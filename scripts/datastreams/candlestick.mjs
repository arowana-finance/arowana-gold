const HOST = process.env.CANDLESTICK_HOST || "https://priceapi.dataengine.chain.link";
const LOGIN = process.env.DATASTREAMS_API_KEY;
const PASSWORD = process.env.CANDLESTICK_API_KEY || process.env.DATASTREAMS_API_SECRET;
const PW_SOURCE = process.env.CANDLESTICK_API_KEY ? "CANDLESTICK_API_KEY" : "DATASTREAMS_API_SECRET (fallback)";
const SYMBOL = process.argv[2] || "XAUUSD";
const RESOLUTION = process.argv[3] || "1m";

if (!LOGIN || !PASSWORD) {
  console.error("[err] need DATASTREAMS_API_KEY + (CANDLESTICK_API_KEY | DATASTREAMS_API_SECRET) in env");
  process.exit(1);
}

console.log(`[cfg] host=${HOST}`);
console.log(`[cfg] login=DATASTREAMS_API_KEY, password=${PW_SOURCE}`);

// 1) authorize -> JWT
const authRes = await fetch(`${HOST}/api/v1/authorize`, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ login: LOGIN, password: PASSWORD }),
});
const authBody = await authRes.text();
if (!authRes.ok) {
  console.error(`[auth] HTTP ${authRes.status} ${authBody.slice(0, 300)}`);
  process.exit(1);
}
const { access_token, expiration } = JSON.parse(authBody);
console.log(`[auth] ok — token expires ${new Date(expiration * 1000).toISOString()}`);

const bearer = { Authorization: `Bearer ${access_token}` };

// 2) symbol_info — confirm the gold symbol exists on this engine
const si = await fetch(`${HOST}/api/v1/symbol_info`, { headers: bearer });
const siBody = await si.text();
if (si.ok) {
  const info = JSON.parse(siBody);
  const syms = info.symbol || info.symbols || [];
  const goldIdx = syms.findIndex((s) => String(s).toUpperCase().includes("XAU"));
  console.log(`[symbols] ${syms.length} total; XAU match: ${goldIdx >= 0 ? syms[goldIdx] : "NONE"}`);
} else {
  console.error(`[symbols] HTTP ${si.status} ${siBody.slice(0, 200)}`);
}

// 3) last 30 min of candles for the symbol
const to = Math.floor(Date.now() / 1000);
const from = to - 30 * 60;
const h = await fetch(
  `${HOST}/api/v1/history/rows?symbol=${SYMBOL}&resolution=${RESOLUTION}&from=${from}&to=${to}`,
  { headers: bearer },
);
const hBody = await h.text();
if (!h.ok) {
  console.error(`[history] HTTP ${h.status} ${hBody.slice(0, 300)}`);
  process.exit(1);
}
const rows = JSON.parse(hBody);
const candles = Array.isArray(rows) ? rows : rows.candles || rows.data || [];
console.log(`[history] ${SYMBOL} ${RESOLUTION} — ${candles.length} candles (last 30m)`);
const last = candles[candles.length - 1];
if (last) {
  const [t, o, hi, lo, c, v] = last;
  console.log(`[last]  t=${new Date(t * 1000).toISOString()} O=${o} H=${hi} L=${lo} C=${c} V=${v}`);
}
