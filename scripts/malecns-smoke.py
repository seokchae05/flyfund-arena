import json
import os
from pathlib import Path

import numpy as np

PROJECT = Path(__file__).resolve().parents[1]
os.environ.setdefault("STONKFLY_DATA", str(PROJECT / "data" / "malecns"))
os.environ.setdefault("STONKFLY_CXX", r"C:\tools\flyfund-winlibs\mingw64\bin\g++.exe")
os.environ.setdefault("STONKFLY_KERNEL_DLL", r"C:\tools\flyfund-build\memory.dll")

from stonkfly.neural.visual import VisualMemoryBrain


def main():
    brain = VisualMemoryBrain()
    frame = np.zeros((180, 320, 3), dtype=np.uint8)
    frame[:, :, 1] = np.linspace(20, 230, 320, dtype=np.uint8)
    counts, wall = brain.rgb_step(frame, 10.0, learning=False)
    report = {
        "engine": "MaleCNS v1.0",
        "neurons": int(brain.n),
        "directed_edges": int(len(brain.post)),
        "simulation_ms": 10.0,
        "compute_seconds": wall,
        "spikes": int(counts.sum()),
        "kernel": str(Path(os.environ["STONKFLY_KERNEL_DLL"])),
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

