import { mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

const mode = process.argv[2] === "desktop" ? "desktop" : "mobile";
const url = process.argv[3] || process.env.PERF_URL || "http://localhost:3000";
const outputDirectory = resolve("reports/performance");
await mkdir(outputDirectory, { recursive: true });

const executable = resolve("node_modules/lighthouse/cli/index.js");
const args = [
  executable,
  url,
  "--only-categories=performance,accessibility,best-practices,seo",
  "--output=json",
  "--output=html",
  `--output-path=${joinOutput(mode)}`,
  "--chrome-flags=--headless --no-sandbox --disable-gpu",
];
if (mode === "desktop") args.push("--preset=desktop");

const child = spawn(process.execPath, args, { stdio: "inherit" });
child.on("exit", (code) => process.exit(code ?? 1));

function joinOutput(name) {
  return resolve(outputDirectory, `lighthouse-${name}`);
}
