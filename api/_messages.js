// Message storage (Upstash Redis, connected from Vercel's Storage tab) and email sending (Resend).
// Files starting with "_" are not turned into endpoints by Vercel.

function redisConfig() {
  const url = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "").trim().replace(/\/+$/, "");
  const token = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "").trim();
  return url && token ? { url, token } : null;
}

// Runs several Redis commands in one request and returns their results in order.
async function redis(commands) {
  const cfg = redisConfig();
  if (!cfg) throw new Error("Message storage isn't connected yet.");
  const r = await fetch(cfg.url + "/pipeline", {
    method: "POST",
    headers: { Authorization: "Bearer " + cfg.token, "Content-Type": "application/json" },
    body: JSON.stringify(commands)
  });
  const data = await r.json().catch(() => null);
  if (!r.ok || !Array.isArray(data)) throw new Error("Message storage error (" + r.status + ").");
  return data.map((x) => {
    if (x && x.error) throw new Error("Message storage error: " + x.error);
    return x ? x.result : null;
  });
}

const INDEX = "pf:messages";
const key = (id) => "pf:msg:" + id;

async function saveMessage(msg) {
  await redis([["SET", key(msg.id), JSON.stringify(msg)], ["ZADD", INDEX, msg.createdAt, msg.id]]);
}

async function listMessages(limit = 300) {
  const [ids] = await redis([["ZREVRANGE", INDEX, 0, limit - 1]]);
  if (!ids || !ids.length) return [];
  const [values] = await redis([["MGET"].concat(ids.map(key))]);
  return (values || []).map((v) => { try { return JSON.parse(v); } catch (e) { return null; } }).filter(Boolean);
}

async function getMessage(id) {
  const [v] = await redis([["GET", key(id)]]);
  return v ? JSON.parse(v) : null;
}

async function deleteMessage(id) {
  await redis([["DEL", key(id)], ["ZREM", INDEX, id]]);
}

// Counts requests per visitor so one person can't flood the inbox. Returns the count for this hour.
async function hit(ip) {
  const k = "pf:rate:" + ip;
  const [count] = await redis([["INCR", k], ["EXPIRE", k, 3600]]);
  return Number(count) || 0;
}

function emailConfig() {
  const apiKey = (process.env.RESEND_API_KEY || "").trim();
  const to = (process.env.CONTACT_EMAIL || "").trim();
  return apiKey && to ? { apiKey, to } : null;
}

function escHtml(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function sendEmail(msg) {
  const cfg = emailConfig();
  if (!cfg) return false;
  const rows = [
    ["Name", msg.fullName], ["Email", msg.email], ["Phone", msg.phone], ["Service", msg.service],
    ["Budget", msg.budget || "-"], ["Deadline", msg.deadline || "-"]
  ];
  const html =
    '<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#171717">' +
    '<h2 style="margin:0 0 4px">New message from your portfolio</h2>' +
    '<p style="margin:0 0 20px;color:#777">Reply to this email to answer ' + escHtml(msg.fullName) + " directly.</p>" +
    '<table style="width:100%;border-collapse:collapse">' +
    rows.map(([k, v]) => '<tr><td style="padding:8px 12px;background:#F3F4F6;font-weight:bold;width:110px">' + k + '</td><td style="padding:8px 12px;border-bottom:1px solid #eee">' + escHtml(v) + "</td></tr>").join("") +
    "</table>" +
    '<h3 style="margin:24px 0 8px">Project description</h3>' +
    '<p style="white-space:pre-wrap;line-height:1.6;margin:0">' + escHtml(msg.description) + "</p></div>";
  const text = rows.map(([k, v]) => k + ": " + v).join("\n") + "\n\n" + msg.description;
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: "Bearer " + cfg.apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: (process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>").trim(),
      to: [cfg.to],
      reply_to: msg.email,
      subject: "New message from " + msg.fullName + (msg.service ? " (" + msg.service + ")" : ""),
      html,
      text
    })
  });
  if (!r.ok) {
    const body = await r.text().catch(() => "");
    console.error("Resend error", r.status, body.slice(0, 300));
    return false;
  }
  return true;
}

module.exports = { redisConfig, emailConfig, saveMessage, listMessages, getMessage, deleteMessage, hit, sendEmail };
