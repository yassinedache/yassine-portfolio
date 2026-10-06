// GET  /api/messages -> your messages (logged-in only)
// POST /api/messages { action: "read" | "unread" | "delete" | "read-all", id } -> update them
const L = require("./_lib");
const M = require("./_messages");

module.exports = async (req, res) => {
  if (!L.isAuthed(req)) return L.sendJSON(res, 401, { error: "Please log in." });
  const configured = { storage: !!M.redisConfig(), email: !!M.emailConfig() };
  try {
    if (req.method === "GET") {
      if (!configured.storage) return L.sendJSON(res, 200, { messages: [], configured });
      return L.sendJSON(res, 200, { messages: await M.listMessages(), configured });
    }
    if (req.method !== "POST") return L.sendJSON(res, 405, { error: "Method not allowed" });
    if (!configured.storage) return L.sendJSON(res, 400, { error: "Message storage isn't connected yet." });
    const body = await L.readBody(req);
    const id = String(body.id || "");
    if (body.action === "delete") {
      await M.deleteMessage(id);
    } else if (body.action === "read" || body.action === "unread") {
      const m = await M.getMessage(id);
      if (!m) return L.sendJSON(res, 404, { error: "That message no longer exists." });
      m.read = body.action === "read";
      await M.saveMessage(m);
    } else if (body.action === "read-all") {
      const all = await M.listMessages();
      for (const m of all.filter((x) => !x.read)) { m.read = true; await M.saveMessage(m); }
    } else {
      return L.sendJSON(res, 400, { error: "Unknown action." });
    }
    L.sendJSON(res, 200, { messages: await M.listMessages(), configured });
  } catch (err) {
    L.sendJSON(res, 502, { error: err.message || "Message storage error." });
  }
};
