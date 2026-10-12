/* One-sided Jacobi SVD (Hestenes), ported from pcasvd/linalg.py, run in a Web Worker.
   Input: { m, n, data: Float64Array (row-major m x n) }.  Output: { s, U, V } with U (m x r) and V (n x r) stored by columns. */
self.onmessage = function (ev) {
  var m = ev.data.m, n = ev.data.n, A = ev.data.data, transposed = false, i, j, k;
  // work on the tall orientation: columns of length rows >= number of columns
  var rows = m, cols = n;
  if (m < n) { transposed = true; rows = n; cols = m; }
  var W = [], Z = [];
  for (j = 0; j < cols; j++) {
    var c = new Float64Array(rows);
    for (i = 0; i < rows; i++) c[i] = transposed ? A[j * n + i] : A[i * n + j];
    W.push(c);
    var z = new Float64Array(cols); z[j] = 1; Z.push(z);
  }
  var tol = 1e-12, t0 = Date.now();
  for (var sweep = 0; sweep < 40; sweep++) {
    var worst = 0;
    for (var p = 0; p < cols - 1; p++) {
      var up = W[p];
      for (var q = p + 1; q < cols; q++) {
        var uq = W[q], al = 0, be = 0, ga = 0;
        for (k = 0; k < rows; k++) { var a = up[k], b = uq[k]; al += a * a; be += b * b; ga += a * b; }
        var den = Math.sqrt(al * be), ratio = den > 0 ? Math.abs(ga) / den : 0;
        if (ratio > worst) worst = ratio;
        if (ratio <= tol) continue;
        var zeta = (be - al) / (2 * ga), t = zeta === 0 ? 1 : (zeta > 0 ? 1 : -1) / (Math.abs(zeta) + Math.sqrt(1 + zeta * zeta));
        var cs = 1 / Math.sqrt(1 + t * t), sn = cs * t;
        for (k = 0; k < rows; k++) { var x = up[k], y = uq[k]; up[k] = cs * x - sn * y; uq[k] = sn * x + cs * y; }
        var vp = Z[p], vq = Z[q];
        for (k = 0; k < cols; k++) { var x2 = vp[k], y2 = vq[k]; vp[k] = cs * x2 - sn * y2; vq[k] = sn * x2 + cs * y2; }
      }
    }
    self.postMessage({ progress: true, sweep: sweep + 1, worst: worst, ms: Date.now() - t0 });
    if (worst <= tol) break;
  }
  var s = W.map(function (w) { var t2 = 0; for (var k2 = 0; k2 < w.length; k2++) t2 += w[k2] * w[k2]; return Math.sqrt(t2); });
  var order = s.map(function (_, i2) { return i2; }).sort(function (a2, b2) { return s[b2] - s[a2]; });
  var r = cols, S = new Float64Array(r), U = new Float64Array(rows * r), V = new Float64Array(cols * r);
  order.forEach(function (o, idx) {
    S[idx] = s[o];
    for (var k3 = 0; k3 < rows; k3++) U[idx * rows + k3] = s[o] > 0 ? W[o][k3] / s[o] : 0;
    for (k3 = 0; k3 < cols; k3++) V[idx * cols + k3] = Z[o][k3];
  });
  // undo the transposition: A = U S V^T  <=>  A^T = V S U^T
  var out = transposed ? { s: S, U: V, V: U, m: m, n: n, r: r } : { s: S, U: U, V: V, m: m, n: n, r: r };
  out.done = true; out.ms = Date.now() - t0;
  self.postMessage(out, [out.s.buffer, out.U.buffer, out.V.buffer]);
};
