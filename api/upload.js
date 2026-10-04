// POST /api/upload { data: "data:image/...;base64,...", name } -> stores the image in GitHub (not live until you publish)
const L = require("./_lib");

const TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };
const MAX_BYTES = 3 * 1024 * 1024;

module.exports = async (req, res) => {
  if (!L.guard(req, res, "POST")) return;
  const body = await L.readBody(req);
  const m = /^data:(image\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=]+)$/.exec(String(body.data || ""));
  if (!m) return L.sendJSON(res, 400, { error: "That file isn't a supported image. Use JPG, PNG or WebP." });
  const size = Buffer.from(m[2], "base64").length;
  if (size > MAX_BYTES) return L.sendJSON(res, 413, { error: "That image is too big (max 3 MB after compression). Try a smaller one." });
  const name = String(body.name || "image").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30) || "image";
  const path = `/uploads/${name}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}.${TYPES[m[1]]}`;
  try {
    const blob = await L.gh("/git/blobs", { method: "POST", body: { content: m[2], encoding: "base64" } });
    L.sendJSON(res, 200, { path, sha: blob.sha });
  } catch (err) {
    L.sendJSON(res, 502, { error: L.ghMessage(err) });
  }
};
