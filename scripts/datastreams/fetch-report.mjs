import crypto from "node:crypto";
import https from "node:https";
import fs from "node:fs";
import path from "node:path";

const MAINNET_REST = "https://api.dataengine.chain.link";
// XAU/USD v8 (RWA Standard), chain-agnostic global feedId.
const DEFAULT_XAU_FEED = "0x0008991d4caf73e8e05f6671ef43cee5e8c5c3652a35fde0b0942e44a77b0e89";

function parseArgs(argv) {
  const args = { feed: DEFAULT_XAU_FEED, timestamp: null, out: null };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--feed") args.feed = argv[++i];
    else if (a === "--timestamp") args.timestamp = argv[++i];
    else if (a === "--out") args.out = argv[++i];
    else throw new Error(`unknown arg: ${a}`);
  }
  return args;
}

function requireEnv(name) {
  const v = process.env[name];
  if (!v || v.trim() === "") {
    console.error(
      `\n[fatal] missing env var ${name}.\n` +
        `Set credentials via env only, e.g.:\n` +
        `  DATASTREAMS_API_KEY=... DATASTREAMS_API_SECRET=... node scripts/datastreams/fetch-report.mjs\n`
    );
    process.exit(2);
  }
  return v;
}

// HMAC-SHA256 auth headers per Chainlink Data Streams spec.
function authHeaders(method, fullPath, body, apiKey, apiSecret) {
  const timestamp = Date.now(); // ms since epoch; must be within 5s of server
  const bodyHash = crypto.createHash("sha256").update(body || "").digest("hex");
  const stringToSign = `${method} ${fullPath} ${bodyHash} ${apiKey} ${timestamp}`;
  const signature = crypto.createHmac("sha256", apiSecret).update(stringToSign).digest("hex");
  return {
    Authorization: apiKey,
    "X-Authorization-Timestamp": timestamp.toString(),
    "X-Authorization-Signature-SHA256": signature,
  };
}

function httpGet(baseUrl, fullPath, headers) {
  return new Promise((resolve, reject) => {
    const url = new URL(fullPath, baseUrl);
    const req = https.request(
      url,
      { method: "GET", headers, timeout: 15000 },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => resolve({ status: res.statusCode, body: data }));
      }
    );
    req.on("error", reject);
    req.on("timeout", () => req.destroy(new Error("request timeout")));
    req.end();
  });
}

async function main() {
  const args = parseArgs(process.argv);
  const apiKey = requireEnv("DATASTREAMS_API_KEY");
  const apiSecret = requireEnv("DATASTREAMS_API_SECRET");
  const baseUrl = process.env.DATASTREAMS_REST_URL || MAINNET_REST;

  // Build the exact path (with query) that we sign AND request — they must match.
  const fullPath = args.timestamp
    ? `/api/v1/reports?feedID=${args.feed}&timestamp=${args.timestamp}`
    : `/api/v1/reports/latest?feedID=${args.feed}`;

  const headers = authHeaders("GET", fullPath, "", apiKey, apiSecret);

  console.log(`[req] GET ${baseUrl}${fullPath}`);
  const { status, body } = await httpGet(baseUrl, fullPath, headers);
  console.log(`[res] HTTP ${status}`);

  if (status !== 200) {
    console.error(`[fail] non-200 response body:\n${body.slice(0, 500)}`);
    if (status === 401) console.error(`[hint] 401 = HMAC/key rejected. Check key, secret, and clock skew (<5s).`);
    process.exit(1);
  }

  const json = JSON.parse(body);
  const report = json.report || (json.reports && json.reports[0]);
  if (!report || !report.fullReport) {
    console.error(`[fail] unexpected response shape:\n${body.slice(0, 500)}`);
    process.exit(1);
  }

  const now = Math.floor(Date.now() / 1000);
  console.log(`\n[ok] signed report received`);
  console.log(`  feedID                : ${report.feedID}`);
  console.log(`  validFromTimestamp    : ${report.validFromTimestamp}`);
  console.log(`  observationsTimestamp : ${report.observationsTimestamp}  (age ${now - Number(report.observationsTimestamp)}s)`);
  console.log(`  fullReport bytes      : ${(report.fullReport.length - 2) / 2}`);
  console.log(`  fullReport (head)     : ${report.fullReport.slice(0, 66)}…`);

  if (args.out) {
    const outPath = path.resolve(args.out);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, report.fullReport);
    console.log(`\n[saved] ${outPath}`);
    console.log(`        -> use as a fixture in a fork test (vm.parseBytes(vm.readFile(...)))`);
  } else {
    console.log(`\n[tip] add --out test/fixtures/xau/live_fetched.hex to save the blob for a fork test`);
  }
}

main().catch((e) => {
  console.error(`[error] ${e.message}`);
  process.exit(1);
});
