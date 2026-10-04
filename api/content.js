// GET /api/content -> the latest content from GitHub (logged-in only)
const L = require("./_lib");

module.exports = async (req, res) => {
  if (!L.guard(req, res, "GET")) return;
  const { repo, branch } = L.config();
  try {
    const ref = await L.gh(`/git/ref/heads/${encodeURIComponent(branch)}`);
    const sha = ref.object.sha;
    const html = await L.gh(`/contents/index.html?ref=${sha}`, { raw: true });
    const content = L.extractData(html);
    L.sendJSON(res, 200, { content, sha, repo, branch });
  } catch (err) {
    L.sendJSON(res, 502, { error: L.ghMessage(err) });
  }
};
