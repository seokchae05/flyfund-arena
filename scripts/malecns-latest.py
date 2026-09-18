import json
import math
import os
from pathlib import Path

import numpy as np

PROJECT = Path(__file__).resolve().parents[1]
DATA = PROJECT / "data"
os.environ.setdefault("STONKFLY_DATA", str(DATA / "malecns"))
os.environ.setdefault("STONKFLY_CXX", r"C:\tools\flyfund-winlibs\mingw64\bin\g++.exe")
os.environ.setdefault("STONKFLY_KERNEL_DLL", r"C:\tools\flyfund-build\memory.dll")

from stonkfly.display import market_frame
from stonkfly.neural.common import annotations
from stonkfly.neural.controller import Decoder
from stonkfly.neural.visual import VisualMemoryBrain


VIEW_WINDOWS = (40, 70, 100, 130)
REGIONS = {
    "시각 감각": ("ol_sensory",),
    "시각엽 내부": ("ol_intrinsic",),
    "시각 투사": ("visual_projection", "visual_centrifugal"),
    "중앙뇌 내부": ("cb_intrinsic",),
    "중앙뇌 감각": ("cb_sensory",),
    "상행뉴런": ("ascending_neuron", "sensory_ascending"),
    "하행뉴런": ("descending_neuron", "sensory_descending"),
    "운동뉴런": ("cb_motor", "vnc_motor"),
}


def region_activity(brain, counts):
    raw = []
    classes = np.asarray(brain.superclass)
    for name, values in REGIONS.items():
        mask = np.isin(classes, values)
        raw.append((name, int(counts[mask].sum())))
    ceiling = max((math.log1p(value) for _, value in raw), default=1) or 1
    return [
        {"name": name, "activity": round(100 * math.log1p(value) / ceiling), "spikes": value}
        for name, value in raw
    ]


def main():
    market = json.loads((DATA / "market-cache.json").read_text(encoding="utf-8"))
    brain = VisualMemoryBrain()
    decoder = Decoder(brain.ids, annotations(brain.ids), threshold=2.0)
    decisions = {}
    total_compute = 0.0

    for symbol, series in market["series"].items():
        bars = series["bars"]
        history = [float(bar["adjustedClose"]) for bar in bars]
        close = float(bars[-1]["close"])
        votes = []
        for fly, window in enumerate(VIEW_WINDOWS, start=1):
            brain.reset(keep_memory=False)
            frame = market_frame(symbol, history[-window:], close, close)
            counts, wall = brain.rgb_step(frame, 500.0, learning=False)
            decoded = decoder.decode(counts, 0.5)
            total_compute += wall
            votes.append(
                {
                    "fly": fly,
                    "viewDays": window,
                    "action": decoded["side"],
                    "confidence": min(1.0, abs(decoded["difference_hz"]) / 20.0),
                    "difference": decoded["difference_hz"],
                    "leftHz": decoded["left_hz"],
                    "rightHz": decoded["right_hz"],
                    "gateSpikes": decoded["gate_spikes"],
                    "totalSpikes": int(counts.sum()),
                    "computeSeconds": wall,
                    "regions": region_activity(brain, counts),
                }
            )
        score = sum({"BUY": 1, "HOLD": 0, "SELL": -1}[vote["action"]] for vote in votes)
        action = "BUY" if score > 0 else "SELL" if score < 0 else "HOLD"
        decisions[symbol] = {
            "date": bars[-1]["date"],
            "action": action,
            "votes": votes,
        }

    payload = {
        "generatedAt": market["generatedAt"],
        "engine": {
            "id": "malecns-v1-stonkfly",
            "label": "MaleCNS v1.0",
            "actualConnectome": True,
            "neurons": int(brain.n),
            "directedEdges": int(len(brain.post)),
            "note": "오늘의 투표는 전체 MaleCNS v1.0 그래프와 Stonkfly C++ 커널을 사용합니다. 과거 리그 수익곡선은 아직 프록시 백테스트입니다.",
        },
        "neuralMsPerVote": 500.0,
        "totalComputeSeconds": total_compute,
        "decisions": decisions,
    }
    target = DATA / "malecns-latest.json"
    temporary = target.with_suffix(".partial")
    temporary.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
    temporary.replace(target)
    print(json.dumps(payload, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
