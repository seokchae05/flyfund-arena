import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execute = promisify(execFile);
const PROJECT = process.cwd();
const OUTPUT = path.join(PROJECT, "data", "malecns-latest.json");

export async function runMaleCnsLatest() {
  const graph = path.join(PROJECT, "data", "malecns", "graph.npz");
  try {
    await fs.access(graph);
  } catch {
    return { available: false, reason: "MaleCNS graph is not prepared" };
  }
  const python = path.join(PROJECT, ".venv", "Scripts", "python.exe");
  const env = {
    ...process.env,
    PYTHONPATH: path.join(PROJECT, "vendor"),
    STONKFLY_DATA: path.join(PROJECT, "data", "malecns"),
    STONKFLY_CXX: "C:\\tools\\flyfund-winlibs\\mingw64\\bin\\g++.exe",
    STONKFLY_KERNEL_DLL: "C:\\tools\\flyfund-build\\memory.dll"
  };
  const { stdout } = await execute(python, [path.join(PROJECT, "scripts", "malecns-latest.py")], {
    cwd: PROJECT,
    env,
    timeout: 180_000,
    maxBuffer: 4 * 1024 * 1024
  });
  return { available: true, stdout };
}

export async function readMaleCnsLatest() {
  try {
    return JSON.parse(await fs.readFile(OUTPUT, "utf8"));
  } catch {
    return null;
  }
}

export function applyMaleCnsLatest(simulation, actual) {
  if (!actual?.engine?.actualConnectome) return simulation;
  for (const [symbol, decision] of Object.entries(actual.decisions || {})) {
    const trace = simulation.sleeves?.[symbol]?.trace;
    if (!trace?.length) continue;
    const target = trace.findLast((point) => point.date === decision.date) || trace.at(-1);
    target.action = decision.action;
    target.votes = decision.votes;
    target.engine = actual.engine.id;
  }
  return {
    ...simulation,
    engine: actual.engine,
    actualDecisionGeneratedAt: actual.generatedAt,
    neuralComputeSeconds: actual.totalComputeSeconds
  };
}

