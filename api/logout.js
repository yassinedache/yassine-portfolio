// POST /api/logout -> clears the session cookie
const L = require("./_lib");

module.exports = async (req, res) => {
  L.sendJSON(res, 200, { ok: true }, { "Set-Cookie": L.clearSessionCookie() });
};
