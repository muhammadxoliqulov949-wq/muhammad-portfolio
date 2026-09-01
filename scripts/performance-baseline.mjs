import { readdir, stat } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import { performance } from "node:perf_hooks";

const target = new URL(process.argv[2] || process.env.PERF_URL || "http://localhost:3000");
const runs = Number(process.env.PERF_RUNS || 3);
const headers = { "user-agent": "portfolio-performance-baseline/1.0", "accept-encoding": "gzip, br" };

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function bytesFrom(response, body) {
  const declared = Number(response.headers.get("content-length"));
  return Number.isFinite(declared) && declared > 0 ? declared : body.byteLength;
}

function assetsFrom(html) {
  const urls = new Set();
  const patterns = [/<script[^>]+src=["']([^"']+)/gi, /<link[^>]+href=["']([^"']+)/gi, /<img[^>]+src=["']([^"']+)/gi];
  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      const url = new URL(match[1].replaceAll("&amp;", "&"), target);
      if (url.origin === target.origin) urls.add(url.href);
    }
  }
  return [...urls];
}

function kindOf(contentType, pathname) {
  if (contentType.includes("javascript") || pathname.endsWith(".js")) return "js";
  if (contentType.includes("css") || pathname.endsWith(".css")) return "css";
  if (contentType.includes("font") || pathname.endsWith(".woff2")) return "font";
  if (contentType.startsWith("image/")) return "image";
  return "other";
}

async function requestDocument() {
  const started = performance.now();
  const response = await fetch(target, { headers, redirect: "follow", cache: "no-store" });
  const firstByte = performance.now();
  const body = new Uint8Array(await response.arrayBuffer());
  const finished = performance.now();
  if (!response.ok) throw new Error(`${target.href} returned ${response.status}`);
  return {
    response,
    html: new TextDecoder().decode(body),
    transfer: bytesFrom(response, body),
    ttfb: firstByte - started,
    total: finished - started,
  };
}

async function builtAssets(directory) {
  const totals = { js: 0, css: 0, font: 0, image: 0, other: 0 };
  async function walk(current) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const path = join(current, entry.name);
      if (entry.isDirectory()) await walk(path);
      else {
        const ext = extname(entry.name);
        const kind = ext === ".js" ? "js" : ext === ".css" ? "css" : ext === ".woff2" ? "font" : [".png", ".jpg", ".jpeg", ".webp", ".avif"].includes(ext) ? "image" : "other";
        totals[kind] += (await stat(path)).size;
      }
    }
  }
  await walk(directory);
  return totals;
}

const documents = [];
for (let index = 0; index < runs; index += 1) documents.push(await requestDocument());

const first = documents[0];
const transfers = { html: first.transfer, js: 0, css: 0, font: 0, image: 0, other: 0 };
const assetRows = await Promise.all(
  assetsFrom(first.html).map(async (href) => {
    const response = await fetch(href, { headers, redirect: "follow" });
    const body = new Uint8Array(await response.arrayBuffer());
    const kind = kindOf(response.headers.get("content-type") || "", new URL(href).pathname);
    const bytes = bytesFrom(response, body);
    transfers[kind] += bytes;
    return { kind, bytes, path: new URL(href).pathname };
  }),
);

console.log(JSON.stringify({
  measuredAt: new Date().toISOString(),
  target: target.href,
  scope: "production/request transfer; not Core Web Vitals field data",
  requests: {
    runs,
    medianTtfbMs: Math.round(median(documents.map((item) => item.ttfb))),
    medianTotalMs: Math.round(median(documents.map((item) => item.total))),
    cacheControl: first.response.headers.get("cache-control"),
    platformCache: first.response.headers.get("x-vercel-cache"),
  },
  transfers,
  assets: assetRows.sort((a, b) => b.bytes - a.bytes),
  fieldMetrics: { lcp: null, cls: null, inp: null, reason: "Requires CrUX/RUM; this script does not invent field values" },
}, null, 2));

try {
  const totals = await builtAssets(resolve(".next/static"));
  console.error("Build output bytes (.next/static):", JSON.stringify(totals));
} catch {
  console.error("Build output unavailable; run `npm run build` for local bundle visibility.");
}
