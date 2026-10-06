// POST /api/contact -> public endpoint used by the contact form.
// Saves the message for the admin's Messages tab and emails it to you.
const L = require("./_lib");
const M = require("./_messages");

const LIMITS = { fullName: 100, email: 200, phone: 40, service: 120, budget: 100, deadline: 100, description: 5000 };

module.exports = async (req, res) => {
  if (req.method !== "POST") return L.sendJSON(res, 405, { error: "Method not allowed" });
  const body = await L.readBody(req);

  // Spam traps: a hidden field real people never fill, and forms sent too fast to be human.
  if (String(body.company || "").trim() || Number(body.elapsed || 0) < 2500) {
    return L.sendJSON(res, 200, { ok: true });
  }

  const msg = {};
  for (const k of Object.keys(LIMITS)) msg[k] = String(body[k] || "").trim().slice(0, LIMITS[k]);
  if (!msg.fullName || !msg.email || !msg.phone || !msg.service || !msg.description) {
    return L.sendJSON(res, 400, { error: "Please fill in all the required fields." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(msg.email)) return L.sendJSON(res, 400, { error: "Please enter a valid email address." });

  const storage = !!M.redisConfig();
  const email = !!M.emailConfig();
  if (!storage && !email) return L.sendJSON(res, 503, { error: "The contact form isn't connected yet." });

  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  msg.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  msg.createdAt = Date.now();
  msg.read = false;

  let stored = false, emailed = false;
  try {
    if (storage) {
      if ((await M.hit(ip)) > 5) return L.sendJSON(res, 429, { error: "Too many messages from you in the last hour. Please try again later." });
      await M.saveMessage(msg);
      stored = true;
    }
  } catch (err) { console.error("contact storage", err.message); }
  try { emailed = await M.sendEmail(msg); } catch (err) { console.error("contact email", err.message); }

  if (!stored && !emailed) return L.sendJSON(res, 502, { error: "The message couldn't be sent right now." });
  L.sendJSON(res, 200, { ok: true, stored, emailed });
};
