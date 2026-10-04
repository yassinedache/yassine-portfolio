// Shared helpers for the admin API. Files starting with "_" are not turned into endpoints by Vercel.
const crypto = require("crypto");

const COOKIE = "pf_admin";
const SESSION_DAYS = 7;

function config() {
  const repo = (process.env.GITHUB_REPO || "").trim();
  const token = (process.env.GITHUB_TOKEN || "").trim();
  const branch = (process.env.GITHUB_BRANCH || "main").trim();
  const missing = [];
  if (!process.env.ADMIN_PASSWORD) missing.push("ADMIN_PASSWORD");
  if (!token) missing.push("GITHUB_TOKEN");
  if (!repo) missing.push("GITHUB_REPO");
  return { repo, token, branch, missing };
}

function secret() {
  return process.env.SESSION_SECRET ||
    crypto.createHash("sha256").update("portfolio-admin:" + (process.env.ADMIN_PASSWORD || "") + ":" + (process.env.GITHUB_TOKEN || "")).digest("hex");
}

function sign(value) {
  return crypto.createHmac("sha256", secret()).update(String(value)).digest("hex");
}

function safeEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

function parseCookies(req) {
  const out = {};
  String(req.headers.cookie || "").split(";").forEach((part) => {
    const i = part.indexOf("=");
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  });
  return out;
}

function isAuthed(req) {
  if (!process.env.ADMIN_PASSWORD) return false;
  const raw = parseCookies(req)[COOKIE];
  if (!raw) return false;
  const [exp, sig] = raw.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return safeEqual(sig, sign(exp));
}

function newSessionCookie() {
  const exp = Date.now() + SESSION_DAYS * 864e5;
  return `${COOKIE}=${exp}.${sign(exp)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_DAYS * 86400}`;
}

function clearSessionCookie() {
  return `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

function checkPassword(input) {
  const real = process.env.ADMIN_PASSWORD || "";
  if (!real) return false;
  const a = crypto.createHash("sha256").update(String(input || "")).digest();
  const b = crypto.createHash("sha256").update(real).digest();
  return crypto.timingSafeEqual(a, b);
}

function sendJSON(res, status, body, extraHeaders) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  if (extraHeaders) Object.keys(extraHeaders).forEach((k) => res.setHeader(k, extraHeaders[k]));
  res.end(JSON.stringify(body));
}

function readBody(req) {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === "string") {
      try { return Promise.resolve(JSON.parse(req.body || "{}")); } catch (e) { return Promise.resolve({}); }
    }
    return Promise.resolve(req.body);
  }
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (c) => { data += c; });
    req.on("end", () => { try { resolve(JSON.parse(data || "{}")); } catch (e) { resolve({}); } });
  });
}

// Plain-language errors for the most common GitHub problems.
function ghMessage(err) {
  const s = err && err.status;
  if (s === 401) return "GitHub refused the token. Check GITHUB_TOKEN in your Vercel settings (it may be wrong or expired).";
  if (s === 403) return "The GitHub token can't write to the repository. Give it Contents: Read and write on this repo.";
  if (s === 404) return "GitHub couldn't find the repository or file. Check GITHUB_REPO (username/repo-name) and that the token has access to it.";
  if (s === 409 || s === 422) return "GitHub rejected the update because the repository changed. Reload the admin and try again.";
  return (err && err.message) || "GitHub request failed.";
}

async function gh(path, opts = {}) {
  const { repo, token } = config();
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: opts.raw ? "application/vnd.github.raw+json" : "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "portfolio-admin"
  };
  if (opts.body) headers["Content-Type"] = "application/json";
  const r = await fetch(`https://api.github.com/repos/${repo}${path}`, {
    method: opts.method || "GET",
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });
  const text = await r.text();
  if (!r.ok) {
    let msg = text;
    try { msg = JSON.parse(text).message || text; } catch (e) {}
    const err = new Error(msg || `GitHub error ${r.status}`);
    err.status = r.status;
    throw err;
  }
  if (opts.raw) return text;
  return text ? JSON.parse(text) : null;
}

// The site's content lives inside index.html in a <script id="site-data"> block.
const DATA_RE = /(<script id="site-data" type="application\/json">)([\s\S]*?)(<\/script>)/;

function extractData(html) {
  const m = DATA_RE.exec(html);
  if (!m) throw new Error('index.html has no <script id="site-data"> block.');
  return JSON.parse(m[2]);
}

function escAttr(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function injectData(html, data) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  if (!DATA_RE.test(html)) throw new Error('index.html has no <script id="site-data"> block.');
  let out = html.replace(DATA_RE, (all, a, b, c) => a + json + c);
  const p = data.profile || {};
  const title = escAttr((p.fullName || "Portfolio") + " | Portfolio");
  const desc = escAttr([p.fullName, [p.role, p.specialty].filter(Boolean).join(" & ")].filter(Boolean).join(" - "));
  out = out.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${title}</title>`);
  out = out.replace(/<meta name="description" content="[^"]*">/, () => `<meta name="description" content="${desc}">`);
  out = out.replace(/<meta property="og:title" content="[^"]*">/, () => `<meta property="og:title" content="${title}">`);
  out = out.replace(/<meta property="og:description" content="[^"]*">/, () => `<meta property="og:description" content="${desc}">`);
  return out;
}

function guard(req, res, method) {
  if (method && req.method !== method) { sendJSON(res, 405, { error: "Method not allowed" }); return false; }
  const cfg = config();
  if (cfg.missing.length) { sendJSON(res, 500, { error: "Missing settings on Vercel: " + cfg.missing.join(", ") + ". Add them in your project's Environment Variables, then redeploy." }); return false; }
  if (!isAuthed(req)) { sendJSON(res, 401, { error: "Please log in." }); return false; }
  return true;
}

module.exports = {
  config, isAuthed, newSessionCookie, clearSessionCookie, checkPassword,
  sendJSON, readBody, gh, ghMessage, extractData, injectData, guard
};
