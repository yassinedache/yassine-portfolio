// POST /api/upload { data: "data:image/... or data:video/...;base64,...", name } -> stores the file in GitHub (not live until you publish)
const L = require("./_lib");

const TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};
const MAX_BYTES = 6 * 1024 * 1024;

module.exports = async (req, res) => {
  if (!L.guard(req, res, "POST")) return;
  const body = await L.readBody(req);

  // If this is an intermediate chunk of a multi-part upload
  if (body.chunk !== undefined && !body.isFinal) {
    if (!body.part || typeof body.part !== "string") {
      return L.sendJSON(res, 400, { error: "Invalid chunk part." });
    }
    try {
      const blob = await L.gh("/git/blobs", {
        method: "POST",
        body: { content: Buffer.from(body.part).toString("base64"), encoding: "base64" },
      });
      return L.sendJSON(res, 200, { ok: true, sha: blob.sha });
    } catch (err) {
      return L.sendJSON(res, 502, { error: L.ghMessage(err) });
    }
  }

  let fullData = String(body.data || "");

  // If this is the final chunk of a multi-part upload, reassemble from GitHub blobs
  if (body.isFinal && Array.isArray(body.shas)) {
    try {
      const parts = [];
      for (const sha of body.shas) {
        const chunkBlob = await L.gh(`/git/blobs/${sha}`);
        if (!chunkBlob || !chunkBlob.content) {
          throw new Error("Failed to retrieve upload chunk from storage.");
        }
        parts.push(Buffer.from(chunkBlob.content, "base64").toString("utf8"));
      }
      parts.push(String(body.part || ""));
      fullData = parts.join("");
    } catch (err) {
      return L.sendJSON(res, 502, { error: L.ghMessage(err) });
    }
  }

  const m =
    /^data:((?:image\/(?:jpeg|png|webp|gif))|(?:video\/(?:mp4|webm|quicktime)));base64,([A-Za-z0-9+/=]+)$/.exec(
      fullData,
    );
  if (!m)
    return L.sendJSON(res, 400, {
      error:
        "That file type isn't supported. Use JPG, PNG or WebP images, or MP4 / WebM videos.",
    });
  const size = Buffer.from(m[2], "base64").length;
  if (size > MAX_BYTES)
    return L.sendJSON(res, 413, {
      error:
        "That file is too big (max 6 MB). For long videos, use a YouTube link instead.",
    });
  const name =
    String(body.name || "image")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 30) || "image";
  const path = `/uploads/${name}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}.${TYPES[m[1]]}`;
  try {
    const blob = await L.gh("/git/blobs", {
      method: "POST",
      body: { content: m[2], encoding: "base64" },
    });
    L.sendJSON(res, 200, { path, sha: blob.sha });
  } catch (err) {
    L.sendJSON(res, 502, { error: L.ghMessage(err) });
  }
};
