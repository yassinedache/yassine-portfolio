/* Linear algebra ported from the Python projects (linreg/linalg.py and pcasvd/linalg.py).
   Matrices are arrays of rows (Float64Array or plain arrays); tall data matrices are stored by columns. */
(function () {
  "use strict";
  var LA = window.LA = {};

  LA.dot = function (a, b, from) {
    var s = 0;
    for (var i = from || 0; i < a.length; i++) s += a[i] * b[i];
    return s;
  };

  /* A = L L^T for a symmetric positive definite matrix (throws if not positive definite) */
  LA.cholesky = function (A) {
    var n = A.length, L = [], i, j, k;
    for (i = 0; i < n; i++) L.push(new Float64Array(n));
    for (j = 0; j < n; j++) {
      var d = A[j][j];
      for (k = 0; k < j; k++) d -= L[j][k] * L[j][k];
      if (!(d > 0)) throw new Error("matrix is not positive definite");
      L[j][j] = Math.sqrt(d);
      for (i = j + 1; i < n; i++) {
        var s = A[i][j];
        for (k = 0; k < j; k++) s -= L[i][k] * L[j][k];
        L[i][j] = s / L[j][j];
      }
    }
    return L;
  };
  LA.forwardSub = function (L, b) {
    var n = L.length, x = new Float64Array(n);
    for (var i = 0; i < n; i++) { var s = b[i]; for (var k = 0; k < i; k++) s -= L[i][k] * x[k]; x[i] = s / L[i][i]; }
    return x;
  };
  LA.backSub = function (U, b) {
    var n = U.length, x = new Float64Array(n);
    for (var i = n - 1; i >= 0; i--) { var s = b[i]; for (var k = i + 1; k < n; k++) s -= U[i][k] * x[k]; x[i] = s / U[i][i]; }
    return x;
  };
  LA.transpose = function (A) {
    var m = A.length, n = A[0].length, T = [];
    for (var j = 0; j < n; j++) { var r = new Float64Array(m); for (var i = 0; i < m; i++) r[i] = A[i][j]; T.push(r); }
    return T;
  };

  /* Normal equations X^T X w = X^T y solved by Cholesky. cols: the columns of X. */
  LA.gram = function (cols, y) {
    var p = cols.length, A = [], c = new Float64Array(p);
    for (var i = 0; i < p; i++) {
      A.push(new Float64Array(p));
      c[i] = LA.dot(cols[i], y);
    }
    for (i = 0; i < p; i++) for (var j = i; j < p; j++) { A[i][j] = A[j][i] = LA.dot(cols[i], cols[j]); }
    return { A: A, c: c };
  };
  LA.fitNormal = function (cols, y, gram) {
    var g = gram || LA.gram(cols, y), L = LA.cholesky(g.A);
    return LA.backSub(LA.transpose(L), LA.forwardSub(L, g.c));
  };

  /* Householder QR of the m x n matrix given by its columns; Q is kept as reflectors */
  LA.householderQR = function (cols) {
    var n = cols.length, m = cols[0].length, R = cols.map(function (c) { return Float64Array.from(c); }), refl = [];
    for (var k = 0; k < n; k++) {
      var x = R[k], alpha = 0, i;
      for (i = k; i < m; i++) alpha += x[i] * x[i];
      alpha = Math.sqrt(alpha);
      var v = new Float64Array(m - k), beta = 0;
      if (alpha > 0) {
        for (i = k; i < m; i++) v[i - k] = x[i];
        v[0] += (x[k] >= 0 ? 1 : -1) * alpha;      // avoids cancellation
        var v0 = v[0], vv = 0;
        for (i = 0; i < v.length; i++) { v[i] /= v0; vv += v[i] * v[i]; }
        beta = 2 / vv;
        for (var j = k; j < n; j++) {
          var col = R[j], s = 0;
          for (i = k; i < m; i++) s += v[i - k] * col[i];
          s *= beta;
          for (i = k; i < m; i++) col[i] -= s * v[i - k];
        }
      }
      refl.push({ v: v, beta: beta });
    }
    var Rn = [];
    for (var r = 0; r < n; r++) { var row = new Float64Array(n); for (var c2 = r; c2 < n; c2++) row[c2] = R[c2][r]; Rn.push(row); }
    return { refl: refl, R: Rn };
  };
  LA.applyQt = function (refl, b) {
    var y = Float64Array.from(b);
    refl.forEach(function (h, k) {
      if (!h.beta) return;
      var s = 0, i;
      for (i = k; i < y.length; i++) s += h.v[i - k] * y[i];
      s *= h.beta;
      for (i = k; i < y.length; i++) y[i] -= s * h.v[i - k];
    });
    return y;
  };
  LA.fitQR = function (cols, y) {
    var qr = LA.householderQR(cols), qty = LA.applyQt(qr.refl, y);
    return LA.backSub(qr.R, qty.slice(0, cols.length));
  };

  /* Cyclic Jacobi for a symmetric matrix: eigenvalues in decreasing order, eigenvectors as columns of V */
  LA.jacobiEigen = function (S, tol, maxSweeps) {
    tol = tol || 1e-14; maxSweeps = maxSweeps || 100;
    var n = S.length, A = S.map(function (r) { return Float64Array.from(r); }), V = [], i, j, p, q;
    for (i = 0; i < n; i++) { V.push(new Float64Array(n)); V[i][i] = 1; }
    var scale = 0;
    for (i = 0; i < n; i++) for (j = 0; j < n; j++) scale += A[i][j] * A[i][j];
    scale = Math.sqrt(scale);
    for (var sweep = 0; sweep < maxSweeps; sweep++) {
      var off = 0;
      for (i = 0; i < n; i++) for (j = 0; j < n; j++) if (i !== j) off += A[i][j] * A[i][j];
      if (Math.sqrt(off) <= tol * scale) break;
      for (p = 0; p < n - 1; p++) for (q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-300) continue;
        var tau = (A[q][q] - A[p][p]) / (2 * A[p][q]), t;
        if (tau === 0) t = 1;
        else if (Math.abs(tau) > 1e8) t = 1 / (2 * tau);
        else t = Math.sign(tau) / (Math.abs(tau) + Math.sqrt(1 + tau * tau));
        var c = 1 / Math.sqrt(1 + t * t), s = t * c, k, a, b;
        for (k = 0; k < n; k++) { a = A[k][p]; b = A[k][q]; A[k][p] = c * a - s * b; A[k][q] = s * a + c * b; }
        for (k = 0; k < n; k++) { a = A[p][k]; b = A[q][k]; A[p][k] = c * a - s * b; A[q][k] = s * a + c * b; }
        for (k = 0; k < n; k++) { a = V[k][p]; b = V[k][q]; V[k][p] = c * a - s * b; V[k][q] = s * a + c * b; }
      }
    }
    var vals = [], order = [];
    for (i = 0; i < n; i++) { vals.push(A[i][i]); order.push(i); }
    order.sort(function (x, y) { return vals[y] - vals[x]; });
    return {
      values: order.map(function (i2) { return vals[i2]; }),
      vectors: V.map(function (row) { return order.map(function (i2) { return row[i2]; }); })   // V[row][component]
    };
  };

  /* One-sided Jacobi SVD (Hestenes) of an m x n matrix (m >= n) given by its columns.
     Returns s (decreasing) and V (columns = right singular vectors); U = A V / s if needed. */
  LA.jacobiSVDcols = function (cols, tol, maxSweeps) {
    tol = tol || 1e-13; maxSweeps = maxSweeps || 60;
    var n = cols.length, m = cols[0].length, W = cols.map(function (c) { return Float64Array.from(c); }), Z = [], i, j, k;
    for (i = 0; i < n; i++) { Z.push(new Float64Array(n)); Z[i][i] = 1; }
    for (var sweep = 0; sweep < maxSweeps; sweep++) {
      var worst = 0;
      for (i = 0; i < n - 1; i++) for (j = i + 1; j < n; j++) {
        var up = W[i], uq = W[j], al = 0, be = 0, ga = 0;
        for (k = 0; k < m; k++) { al += up[k] * up[k]; be += uq[k] * uq[k]; ga += up[k] * uq[k]; }
        var den = Math.sqrt(al * be), ratio = den > 0 ? Math.abs(ga) / den : 0;
        if (ratio > worst) worst = ratio;
        if (ratio <= tol) continue;
        var zeta = (be - al) / (2 * ga), t = zeta === 0 ? 1 : Math.sign(zeta) / (Math.abs(zeta) + Math.sqrt(1 + zeta * zeta));
        var c = 1 / Math.sqrt(1 + t * t), s = c * t, a, b;
        for (k = 0; k < m; k++) { a = up[k]; b = uq[k]; up[k] = c * a - s * b; uq[k] = s * a + c * b; }
        var vp = Z[i], vq = Z[j];
        for (k = 0; k < n; k++) { a = vp[k]; b = vq[k]; vp[k] = c * a - s * b; vq[k] = s * a + c * b; }
      }
      if (worst <= tol) break;
    }
    var sing = W.map(function (w) { return Math.sqrt(LA.dot(w, w)); });
    var order = sing.map(function (_, i2) { return i2; }).sort(function (a2, b2) { return sing[b2] - sing[a2]; });
    return { s: order.map(function (i2) { return sing[i2]; }), V: order.map(function (i2) { return Z[i2]; }), U: order.map(function (i2) { return W[i2].map(function (x) { return sing[i2] > 0 ? x / sing[i2] : 0; }); }) };
  };
})();
