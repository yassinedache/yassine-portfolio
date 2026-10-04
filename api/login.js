// POST /api/login  { password }  -> sets a 7-day session cookie
const L = require("./_lib");

module.exports = async (req, res) => {
  if (req.method !== "POST") return L.sendJSON(res, 405, { error: "Method not allowed" });
  if (!process.env.ADMIN_PASSWORD) return L.sendJSON(res, 500, { error: "ADMIN_PASSWORD isn't set in your Vercel Environment Variables yet." });
  const body = await L.readBody(req);
  if (!L.checkPassword(body.password)) {
    await new Promise((r) => setTimeout(r, 900)); // slows down password guessing
    return L.sendJSON(res, 401, { error: "Wrong password." });
  }
  L.sendJSON(res, 200, { ok: true }, { "Set-Cookie": L.newSessionCookie() });
};
