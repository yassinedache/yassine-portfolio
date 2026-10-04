// POST /api/save { content, baseSha, files: [{ path, sha }] } -> one commit to GitHub; Vercel then redeploys the site
const L = require("./_lib");

function hasDataUrls(value) {
  if (typeof value === "string") return value.startsWith("data:");
  if (Array.isArray(value)) return value.some(hasDataUrls);
  if (value && typeof value === "object") return Object.keys(value).some((k) => hasDataUrls(value[k]));
  return false;
}

module.exports = async (req, res) => {
  if (!L.guard(req, res, "POST")) return;
  const { branch } = L.config();
  const body = await L.readBody(req);
  const content = body.content;
  const ok = content && typeof content === "object" && content.profile &&
    ["services", "projects", "experience", "certificates"].every((k) => Array.isArray(content[k]));
  if (!ok) return L.sendJSON(res, 400, { error: "The content looks incomplete, so nothing was saved." });
  if (hasDataUrls(content)) return L.sendJSON(res, 400, { error: "Some images weren't uploaded yet. Try publishing again." });
  const files = Array.isArray(body.files) ? body.files : [];
  for (const f of files) {
    if (!/^\/uploads\/[\w.-]+\.(jpg|png|webp|gif)$/.test(String(f.path)) || !/^[0-9a-f]{40}$/.test(String(f.sha))) {
      return L.sendJSON(res, 400, { error: "An uploaded image reference was invalid. Try publishing again." });
    }
  }
  try {
    const ref = await L.gh(`/git/ref/heads/${encodeURIComponent(branch)}`);
    const head = ref.object.sha;
    if (body.baseSha && body.baseSha !== head) {
      return L.sendJSON(res, 409, { error: "Your site changed since you opened the admin (maybe from another tab or a git push). Copy anything important, then reload the admin to get the latest version." });
    }
    const commit = await L.gh(`/git/commits/${head}`);
    const html = await L.gh(`/contents/index.html?ref=${head}`, { raw: true });
    const newHtml = L.injectData(html, content);
    const tree = await L.gh("/git/trees", {
      method: "POST",
      body: {
        base_tree: commit.tree.sha,
        tree: [{ path: "index.html", mode: "100644", type: "blob", content: newHtml }]
          .concat(files.map((f) => ({ path: f.path.slice(1), mode: "100644", type: "blob", sha: f.sha })))
      }
    });
    const created = await L.gh("/git/commits", {
      method: "POST",
      body: { message: "Update portfolio from admin", tree: tree.sha, parents: [head] }
    });
    await L.gh(`/git/refs/heads/${encodeURIComponent(branch)}`, { method: "PATCH", body: { sha: created.sha, force: false } });
    L.sendJSON(res, 200, { ok: true, sha: created.sha });
  } catch (err) {
    L.sendJSON(res, 502, { error: L.ghMessage(err) });
  }
};
