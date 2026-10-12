/* Linear regression: live demo (JavaScript port of the linreg package). */
(function () {
  "use strict";
  var C = LAB.colors, $ = function (s) { return document.querySelector(s); };

  LAB.register({
    en: {
      pageTitle: "Linear regression", kicker: "Statistics · Optimization", title: "Linear regression <em>from scratch</em>",
      lead: "Least squares solved with Cholesky and Householder QR, and gradient descent whose speed is set by the condition number. Everything below is recomputed live in your browser.",
      tab1: "Fit your own line", tab2: "Gradient descent", tab3: "California Housing",
      fitTitle: "Click to add a point, click a point to remove it", fitSub: "The orange line minimises the sum of the squared vertical distances (grey segments).",
      random: "New random points", outlier: "Add an outlier", clear: "Clear", points: "Points",
      eq: "<b>Least-squares line</b><br>y = {a} + {b} · x", need: "Add at least two points with different x.",
      method: "Method", intercept: "Intercept", slope: "Slope", ne: "Normal equations (Cholesky)", qr: "QR (Householder)", diff: "Difference",
      fitNote2: "Both direct methods give the same line; QR never forms XᵀX, so it stays accurate when the data are badly conditioned.",
      step: "Step η (in units of 1/L)", optimal: "Optimal step 2/(L + μ)", standardise: "Standardise x", rhoTh: "Rate ρ (theory)", rhoObs: "Rate (measured)", iters: "Iterations to 10⁻¹⁰",
      diverges: "diverges", gdHint: "Uses the points from the first tab. Try η just above 2/L, then tick “Standardise x”: the valley becomes round and one step is enough.",
      surfTitle: "The loss surface f(w₀, w₁) and the path of gradient descent", surfSub: "Colour bands are level sets of f (log scale); the dots are the iterates w₀, w₁, w₂, … starting from (0, 0).",
      gapTitle: "f(wₖ) − f* at each iteration", gapLbl: "f(wₖ) − f*", theoryLbl: "theory ρ²ᵏ", kAxis: "iteration k",
      gdNote: "<p><b>Why the step matters.</b> For f(w) = (1/n)‖Xw − y‖², the error evolves as eₖ₊₁ = (I − ηH)eₖ with H = (2/n)XᵀX. With μ and L the extreme eigenvalues of H, ‖eₖ‖ ≤ ρᵏ‖e₀‖ where ρ = max(|1 − ημ|, |1 − ηL|).</p><p>It converges if and only if η &lt; 2/L, and the best fixed step 2/(L + μ) gives ρ = (κ − 1)/(κ + 1) with κ = L/μ. Long, thin level sets (large κ) make gradient descent zig-zag; standardising the variable rounds them.</p>",
      hTitle: "20,433 Californian block groups, 8 features, 80 % / 20 % split", hSub: "The three solvers run in your browser on the 16,346 training rows; the scores are measured on the 4,087 test rows.",
      rmse: "Test RMSE", r2: "Test R²", maxdiff: "max |w − w_QR|", time: "Time", gd: "Gradient descent (optimal step)", sk: "scikit-learn (Python, from my report)",
      itersN: "{n} iterations", coefTitle: "Coefficients on standardised features", predTitle: "Predicted vs true value (test set)",
      trueV: "true value (100,000 $)", predV: "predicted (100,000 $)", perfect: "perfect prediction",
      standardiseF: "Standardise the features", hGdTitle: "Gradient descent on California Housing (600 iterations)",
      hGdSub: "Relative gap (f(wₖ) − f*) / (f(w₀) − f*), with the theoretical bound ρ²ᵏ (dashed).", relGap: "relative gap",
      feat: { MedInc: "Median income", HouseAge: "House age", AveRooms: "Rooms per household", AveBedrms: "Bedrooms per household", Population: "Population", AveOccup: "Occupants per household", Latitude: "Latitude", Longitude: "Longitude" }
    },
    fr: {
      pageTitle: "Régression linéaire", kicker: "Statistiques · Optimisation", title: "Régression linéaire <em>de zéro</em>",
      lead: "Les moindres carrés résolus par Cholesky et par QR de Householder, et une descente de gradient dont la vitesse dépend du conditionnement. Tout est recalculé en direct dans votre navigateur.",
      tab1: "Ajustez votre droite", tab2: "Descente de gradient", tab3: "California Housing",
      fitTitle: "Cliquez pour ajouter un point, cliquez sur un point pour le retirer", fitSub: "La droite orange minimise la somme des carrés des écarts verticaux (segments gris).",
      random: "Nouveaux points", outlier: "Ajouter un point aberrant", clear: "Effacer", points: "Points",
      eq: "<b>Droite des moindres carrés</b><br>y = {a} + {b} · x", need: "Ajoutez au moins deux points d'abscisses différentes.",
      method: "Méthode", intercept: "Ordonnée à l'origine", slope: "Pente", ne: "Équations normales (Cholesky)", qr: "QR (Householder)", diff: "Écart",
      fitNote2: "Les deux méthodes directes donnent la même droite ; QR ne forme jamais XᵀX, ce qui la garde précise quand les données sont mal conditionnées.",
      step: "Pas η (en unités de 1/L)", optimal: "Pas optimal 2/(L + μ)", standardise: "Standardiser x", rhoTh: "Taux ρ (théorie)", rhoObs: "Taux (mesuré)", iters: "Itérations pour 10⁻¹⁰",
      diverges: "diverge", gdHint: "Utilise les points du premier onglet. Essayez η juste au-dessus de 2/L, puis cochez « Standardiser x » : la vallée devient ronde et un seul pas suffit.",
      surfTitle: "La surface de perte f(w₀, w₁) et le chemin de la descente de gradient", surfSub: "Les bandes de couleur sont des lignes de niveau de f (échelle log) ; les points sont les itérés w₀, w₁, w₂, … partant de (0, 0).",
      gapTitle: "f(wₖ) − f* à chaque itération", gapLbl: "f(wₖ) − f*", theoryLbl: "théorie ρ²ᵏ", kAxis: "itération k",
      gdNote: "<p><b>Pourquoi le pas compte.</b> Pour f(w) = (1/n)‖Xw − y‖², l'erreur vérifie eₖ₊₁ = (I − ηH)eₖ avec H = (2/n)XᵀX. Si μ et L sont les valeurs propres extrêmes de H, ‖eₖ‖ ≤ ρᵏ‖e₀‖ où ρ = max(|1 − ημ|, |1 − ηL|).</p><p>La méthode converge si et seulement si η &lt; 2/L, et le meilleur pas fixe 2/(L + μ) donne ρ = (κ − 1)/(κ + 1) avec κ = L/μ. Des lignes de niveau longues et fines (κ grand) font zigzaguer la descente ; standardiser la variable les arrondit.</p>",
      hTitle: "20 433 îlots californiens, 8 variables, découpage 80 % / 20 %", hSub: "Les trois méthodes tournent dans votre navigateur sur les 16 346 lignes d'apprentissage ; les scores sont mesurés sur les 4 087 lignes de test.",
      rmse: "RMSE test", r2: "R² test", maxdiff: "max |w − w_QR|", time: "Temps", gd: "Descente de gradient (pas optimal)", sk: "scikit-learn (Python, d'après mon rapport)",
      itersN: "{n} itérations", coefTitle: "Coefficients sur variables standardisées", predTitle: "Valeur prédite et valeur réelle (test)",
      trueV: "valeur réelle (100 000 $)", predV: "prédiction (100 000 $)", perfect: "prédiction parfaite",
      standardiseF: "Standardiser les variables", hGdTitle: "Descente de gradient sur California Housing (600 itérations)",
      hGdSub: "Écart relatif (f(wₖ) − f*) / (f(w₀) − f*), et la borne théorique ρ²ᵏ (pointillés).", relGap: "écart relatif",
      feat: { MedInc: "Revenu médian", HouseAge: "Âge des logements", AveRooms: "Pièces par foyer", AveBedrms: "Chambres par foyer", Population: "Population", AveOccup: "Occupants par foyer", Latitude: "Latitude", Longitude: "Longitude" }
    }
  });
  function feat(name) { var f = LAB.dict[LAB.lang].feat; return (f && f[name]) || name; }

  /* ======================================================================
     Fit your own line
     ====================================================================== */
  var pts = [];
  var rng = LAB.rng(7);
  function gauss() { var u = 1 - rng(), v = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function randomPoints() {
    pts = [];
    for (var i = 0; i < 14; i++) { var x = 0.6 + 8.8 * rng(); pts.push([x, Math.max(0.2, Math.min(9.8, 1.4 + 0.7 * x + 0.9 * gauss()))]); }
  }
  randomPoints();

  function fitPoints(P, standardise) {
    var n = P.length, xs = P.map(function (p) { return p[0]; }), ys = Float64Array.from(P.map(function (p) { return p[1]; }));
    var mean = 0, sd = 1;
    if (standardise) {
      mean = xs.reduce(function (a, b) { return a + b; }, 0) / n;
      sd = Math.sqrt(xs.reduce(function (a, b) { return a + (b - mean) * (b - mean); }, 0) / n) || 1;
    }
    var cols = [new Float64Array(n).fill(1), Float64Array.from(xs.map(function (x) { return (x - mean) / sd; }))];
    return { cols: cols, y: ys, mean: mean, sd: sd, n: n };
  }
  function enoughPoints() {
    if (pts.length < 2) return false;
    return pts.some(function (p) { return Math.abs(p[0] - pts[0][0]) > 1e-9; });
  }

  var plane = { W: 0, H: 0 };
  function planeXY(x, y) { return [36 + x / 10 * (plane.W - 50), plane.H - 30 - y / 10 * (plane.H - 44)]; }
  function planeData(px, py) { return [(px - 36) / (plane.W - 50) * 10, (plane.H - 30 - py) / (plane.H - 44) * 10]; }
  function drawPlane(w) {
    var cv = $("#plane"), W = cv.parentNode.clientWidth, H = Math.round(Math.min(520, Math.max(300, W * 0.62)));
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.height = H + "px";
    plane.W = W; plane.H = H;
    var ctx = cv.getContext("2d"), ink = LAB.ink(), line = LAB.cssVar("--line"), muted = LAB.cssVar("--muted");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = line; ctx.lineWidth = 1; ctx.fillStyle = muted; ctx.font = "600 11px Inter, sans-serif";
    for (var g = 0; g <= 10; g++) {
      var a = planeXY(g, 0), b = planeXY(g, 10), c = planeXY(0, g), d = planeXY(10, g);
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(c[0], c[1]); ctx.lineTo(d[0], d[1]); ctx.stroke();
      if (g % 2 === 0) { ctx.fillText(g, a[0] - 3, H - 12); ctx.fillText(g, 14, c[1] + 4); }
    }
    if (w) {
      ctx.strokeStyle = LAB.cssVar("--grey") || C.grey; ctx.lineWidth = 1.5;
      pts.forEach(function (p) {
        var q = planeXY(p[0], p[1]), r = planeXY(p[0], w[0] + w[1] * p[0]);
        ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.lineTo(r[0], r[1]); ctx.stroke();
      });
      var l0 = planeXY(0, w[0]), l1 = planeXY(10, w[0] + 10 * w[1]);
      ctx.save(); ctx.beginPath(); ctx.rect(36, 14, W - 50, H - 44); ctx.clip();
      ctx.strokeStyle = C.orange; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(l0[0], l0[1]); ctx.lineTo(l1[0], l1[1]); ctx.stroke();
      ctx.restore();
    }
    pts.forEach(function (p) {
      var q = planeXY(p[0], p[1]);
      ctx.fillStyle = C.purple; ctx.beginPath(); ctx.arc(q[0], q[1], 6.5, 0, 6.2832); ctx.fill();
      ctx.strokeStyle = LAB.cssVar("--surface"); ctx.lineWidth = 2; ctx.stroke();
    });
  }
  function renderFit() {
    $("#fN").textContent = pts.length;
    if (!enoughPoints()) {
      drawPlane(null);
      $("#fR2").textContent = "–"; $("#fEq").innerHTML = LAB.t("need"); $("#fMethods").innerHTML = "";
      return;
    }
    var F = fitPoints(pts, false), wq = LA.fitQR(F.cols, F.y), wn;
    try { wn = LA.fitNormal(F.cols, F.y); } catch (e) { wn = null; }
    var mean = F.y.reduce(function (a, b) { return a + b; }, 0) / F.n, ssr = 0, sst = 0;
    for (var i = 0; i < F.n; i++) { var r = F.y[i] - (wq[0] + wq[1] * pts[i][0]); ssr += r * r; sst += (F.y[i] - mean) * (F.y[i] - mean); }
    $("#fR2").textContent = sst > 0 ? LAB.fmt(1 - ssr / sst, 3) : "–";
    $("#fEq").innerHTML = LAB.t("eq", { a: LAB.fmt(wq[0], 3), b: LAB.fmt(wq[1], 3) });
    var d = wn ? Math.max(Math.abs(wn[0] - wq[0]), Math.abs(wn[1] - wq[1])) : NaN;
    $("#fMethods").innerHTML = "<thead><tr><th>" + LAB.t("method") + '</th><th class="num">' + LAB.t("intercept") + '</th><th class="num">' + LAB.t("slope") + "</th></tr></thead><tbody>" +
      "<tr><td>" + LAB.t("ne") + '</td><td class="num">' + (wn ? LAB.fmt(wn[0], 6) : "–") + '</td><td class="num">' + (wn ? LAB.fmt(wn[1], 6) : "–") + "</td></tr>" +
      "<tr><td>" + LAB.t("qr") + '</td><td class="num">' + LAB.fmt(wq[0], 6) + '</td><td class="num">' + LAB.fmt(wq[1], 6) + "</td></tr>" +
      "<tr><td>" + LAB.t("diff") + '</td><td class="num" colspan="2">' + (isFinite(d) ? LAB.sci(Math.max(d, 1e-17), 1) : "–") + "</td></tr></tbody>";
    drawPlane(wq);
  }
  $("#plane").addEventListener("click", function (ev) {
    var r = ev.currentTarget.getBoundingClientRect(), px = ev.clientX - r.left, py = ev.clientY - r.top;
    var hit = pts.findIndex(function (p) { var q = planeXY(p[0], p[1]); return Math.hypot(q[0] - px, q[1] - py) < 11; });
    if (hit >= 0) pts.splice(hit, 1);
    else { var d = planeData(px, py); if (d[0] >= 0 && d[0] <= 10 && d[1] >= 0 && d[1] <= 10) pts.push(d); }
    renderFit(); gdDirty = true;
  });
  $("#fRandom").addEventListener("click", function () { randomPoints(); renderFit(); gdDirty = true; });
  $("#fClear").addEventListener("click", function () { pts = []; renderFit(); gdDirty = true; });
  $("#fOutlier").addEventListener("click", function () { pts.push([8.5 + rng(), 0.6 + rng()]); renderFit(); gdDirty = true; });

  /* ======================================================================
     Gradient descent on the loss surface (2 parameters)
     ====================================================================== */
  var gdDirty = true, gChart = null, gd = { etaL: 1.8, std: false };
  function eig2(a, b, c) { var m = (a + c) / 2, r = Math.sqrt((a - c) * (a - c) / 4 + b * b); return [m - r, m + r]; }

  function runGD() {
    if (!enoughPoints()) return null;
    var F = fitPoints(pts, gd.std), n = F.n, x = F.cols[1], y = F.y;
    var sxx = LA.dot(x, x), sx = x.reduce(function (a, b) { return a + b; }, 0);
    var M = [[1, sx / n], [sx / n, sxx / n]];                      // X^T X / n
    var ev = eig2(2 * M[0][0], 2 * M[0][1], 2 * M[1][1]), mu = ev[0], L = ev[1];
    var ws = LA.fitQR(F.cols, y);
    function loss(w) { var s = 0; for (var i = 0; i < n; i++) { var r = w[0] + w[1] * x[i] - y[i]; s += r * r; } return s / n; }
    var fs = loss(ws), eta = gd.etaL / L, w = [0, 0], path = [w.slice()], gaps = [Math.max(loss(w) - fs, 0)];
    var sy = y.reduce(function (a, b) { return a + b; }, 0), sxy = LA.dot(x, y);
    for (var k = 0; k < 3000; k++) {
      // gradient (2/n) X^T (X w - y) from the 2 x 2 normal-equation quantities
      var g0 = 2 * (w[0] + w[1] * sx / n - sy / n), g1 = 2 * (w[0] * sx / n + w[1] * sxx / n - sxy / n);
      w = [w[0] - eta * g0, w[1] - eta * g1];
      var gap = loss(w) - fs;
      gaps.push(Math.max(gap, 0));
      if (path.length < 400) path.push(w.slice());
      if (!isFinite(gap) || gap > 1e8 * (gaps[0] + 1)) break;
      if (gap < 1e-14 * (1 + fs) && k > 5) break;
    }
    var rho = Math.max(Math.abs(1 - eta * mu), Math.abs(1 - eta * L));
    var hit = gaps.findIndex(function (g) { return g < 1e-10; });
    var sel = [], ks = [];
    gaps.forEach(function (g, i) { if (g > 1e-13 && g < gaps[0] * 1e-2 && i > 2) { sel.push(Math.log(g)); ks.push(i); } });
    var obs = null;
    if (ks.length > 4) {
      var mk = ks.reduce(function (a, b) { return a + b; }) / ks.length, my = sel.reduce(function (a, b) { return a + b; }) / sel.length, num = 0, den = 0;
      for (var j = 0; j < ks.length; j++) { num += (ks[j] - mk) * (sel[j] - my); den += (ks[j] - mk) * (ks[j] - mk); }
      obs = Math.exp(num / den / 2);
    }
    if (rho > 1) obs = obs == null ? rho : obs;
    return { F: F, M: M, mu: mu, L: L, ws: ws, fs: fs, path: path, gaps: gaps, rho: rho, iters: hit, obs: obs, diverged: rho >= 1 };
  }

  function drawSurface(r) {
    var cv = $("#surface"), W = cv.parentNode.clientWidth, H = Math.round(Math.min(520, Math.max(300, W * 0.66)));
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.height = H + "px";
    var ctx = cv.getContext("2d");
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    if (!r) return;
    // view window: contains the start (0, 0) and the minimum, with a margin
    var a0 = Math.min(0, r.ws[0]), a1 = Math.max(0, r.ws[0]), b0 = Math.min(0, r.ws[1]), b1 = Math.max(0, r.ws[1]);
    // include the iterates (overshoots), but not a divergent path that leaves for infinity
    var ra = Math.max(a1 - a0, 1), rb = Math.max(b1 - b0, 0.5);
    r.path.forEach(function (w) {
      if (Math.abs(w[0] - r.ws[0]) < 4 * ra && Math.abs(w[1] - r.ws[1]) < 4 * rb) {
        a0 = Math.min(a0, w[0]); a1 = Math.max(a1, w[0]); b0 = Math.min(b0, w[1]); b1 = Math.max(b1, w[1]);
      }
    });
    var pa = Math.max((a1 - a0) * 0.12, 0.3), pb = Math.max((b1 - b0) * 0.12, 0.15);
    var X0 = a0 - pa, X1 = a1 + pa, Y0 = b0 - pb, Y1 = b1 + pb;
    var PW = cv.width, PH = cv.height, img = ctx.createImageData(PW, PH), M = r.M;
    var dark = matchMedia && matchMedia("(prefers-color-scheme: dark)").matches;
    var lo = dark ? [33, 29, 48] : [247, 244, 255], hi = dark ? [96, 78, 170] : [176, 156, 246];
    var gmin = Infinity, gmax = 0, vals = new Float64Array(PW * PH), i, j;
    for (j = 0; j < PH; j++) {
      var w1 = Y1 - (j + 0.5) / PH * (Y1 - Y0) - r.ws[1];
      for (i = 0; i < PW; i++) {
        var w0 = X0 + (i + 0.5) / PW * (X1 - X0) - r.ws[0];
        var gq = M[0][0] * w0 * w0 + 2 * M[0][1] * w0 * w1 + M[1][1] * w1 * w1;
        vals[j * PW + i] = gq;
        if (gq > gmax) gmax = gq;
        if (gq > 0 && gq < gmin) gmin = gq;
      }
    }
    var lmin = Math.log10(Math.max(gmin, gmax * 1e-6)), lmax = Math.log10(gmax);
    for (i = 0; i < vals.length; i++) {
      var lv = Math.log10(Math.max(vals[i], 1e-300)), t = Math.max(0, Math.min(1, (lv - lmin) / (lmax - lmin)));
      var band = Math.floor(lv * 3) % 2 === 0 ? 0 : 1;
      t = Math.min(1, t * 0.85 + band * 0.15);
      var o = i * 4;
      img.data[o] = lo[0] + t * (hi[0] - lo[0]); img.data[o + 1] = lo[1] + t * (hi[1] - lo[1]); img.data[o + 2] = lo[2] + t * (hi[2] - lo[2]); img.data[o + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    function P(w) { return [(w[0] - X0) / (X1 - X0) * W, (Y1 - w[1]) / (Y1 - Y0) * H]; }
    // axes labels
    ctx.fillStyle = LAB.cssVar("--muted"); ctx.font = "700 12px Inter, sans-serif";
    ctx.fillText("w₀ →", W - 46, H - 10);
    ctx.fillText("↑ w₁", 8, 18);
    // path
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
    ctx.strokeStyle = C.orange; ctx.lineWidth = 2; ctx.beginPath();
    r.path.forEach(function (w, k) { var p = P(w); if (k) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); });
    ctx.stroke();
    ctx.fillStyle = C.orange;
    r.path.forEach(function (w, k) { if (k < 150) { var p = P(w); ctx.beginPath(); ctx.arc(p[0], p[1], 3, 0, 6.2832); ctx.fill(); } });
    var s0 = P([0, 0]), sm = P(r.ws), ink = LAB.ink();
    ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(s0[0], s0[1], 5.5, 0, 6.2832); ctx.fill();
    ctx.strokeStyle = ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(sm[0] - 7, sm[1] - 7); ctx.lineTo(sm[0] + 7, sm[1] + 7); ctx.moveTo(sm[0] + 7, sm[1] - 7); ctx.lineTo(sm[0] - 7, sm[1] + 7); ctx.stroke();
    ctx.font = "800 12px Inter, sans-serif"; ctx.fillText("w*", sm[0] + 9, sm[1] - 8);
    ctx.restore();
  }

  function renderGD() {
    var r = runGD();
    $("#gEtaOut").textContent = LAB.fmt(gd.etaL, 2);
    drawSurface(r);
    if (!r) { ["#gKappa", "#gRho", "#gRhoObs", "#gIters"].forEach(function (s) { $(s).textContent = "–"; }); return; }
    $("#gKappa").textContent = LAB.fmt(r.L / r.mu, 1);
    $("#gRho").textContent = LAB.fmt(r.rho, 4);
    $("#gRhoObs").textContent = r.obs == null ? "–" : LAB.fmt(r.obs, 4);
    $("#gIters").textContent = r.diverged ? LAB.t("diverges") : r.iters < 0 ? "> 3000" : LAB.int(r.iters);
    $("#gIters").parentNode.className = "stat " + (r.diverged ? "bad" : "good");
    var g0 = r.gaps[0], data = { datasets: [
      { label: LAB.t("gapLbl"), data: r.gaps.map(function (g, k) { return { x: k, y: Math.min(Math.max(g, 1e-17), 1e8) }; }), borderColor: C.orange, backgroundColor: C.orange, pointRadius: 0, borderWidth: 2 },
      { label: LAB.t("theoryLbl"), data: r.gaps.map(function (g, k) { return { x: k, y: Math.min(Math.max(g0 * Math.pow(r.rho, 2 * k), 1e-17), 1e8) }; }), borderColor: LAB.ink(), borderDash: [5, 5], pointRadius: 0, borderWidth: 1.2 }
    ] };
    if (!gChart) gChart = LAB.chart($("#gChart"), { type: "line", data: data, options: { parsing: false, scales: { x: LAB.linAxis(LAB.t("kAxis"), { min: 0 }), y: LAB.logAxis("", { min: 1e-16 }) } } });
    else { gChart.data = data; gChart.options.scales.x.title.text = LAB.t("kAxis"); gChart.update(); }
  }
  $("#gEta").addEventListener("input", LAB.raf(function () { gd.etaL = +$("#gEta").value; renderGD(); }));
  $("#gStd").addEventListener("change", function () { gd.std = $("#gStd").checked; renderGD(); });
  $("#gOpt").addEventListener("click", function () {
    var r = runGD(); if (!r) return;
    gd.etaL = Math.min(2.2, 2 * r.L / (r.L + r.mu));
    $("#gEta").value = gd.etaL; renderGD();
  });

  /* ======================================================================
     California Housing
     ====================================================================== */
  var H = null, hCharts = {}, hgd = { etaL: 1, std: true };
  function prepHousing(d) {
    var p = d.X.length, nTr = d.nTrain, n = d.y.length, j, i;
    var mean = [], sd = [];
    for (j = 0; j < p; j++) {
      var col = d.X[j], m = 0, s = 0;
      for (i = 0; i < nTr; i++) m += col[i];
      m /= nTr;
      for (i = 0; i < nTr; i++) s += (col[i] - m) * (col[i] - m);
      mean.push(m); sd.push(Math.sqrt(s / nTr) || 1);
    }
    function cols(from, to, standardise) {
      var out = [new Float64Array(to - from).fill(1)];
      for (var jj = 0; jj < p; jj++) {
        var c = new Float64Array(to - from);
        for (var ii = from; ii < to; ii++) c[ii - from] = standardise ? (d.X[jj][ii] - mean[jj]) / sd[jj] : d.X[jj][ii];
        out.push(c);
      }
      return out;
    }
    return { d: d, p: p, nTr: nTr, nTe: n - nTr, tr: cols(0, nTr, true), te: cols(nTr, n, true), trRaw: cols(0, nTr, false),
      ytr: Float64Array.from(d.y.slice(0, nTr)), yte: Float64Array.from(d.y.slice(nTr)), features: d.features };
  }
  function metrics(cols, y, w) {
    var n = y.length, sse = 0, mean = 0, sst = 0, pred = new Float64Array(n), i, j;
    for (i = 0; i < n; i++) { var s = 0; for (j = 0; j < cols.length; j++) s += cols[j][i] * w[j]; pred[i] = s; mean += y[i]; }
    mean /= n;
    for (i = 0; i < n; i++) { sse += (y[i] - pred[i]) * (y[i] - pred[i]); sst += (y[i] - mean) * (y[i] - mean); }
    return { rmse: Math.sqrt(sse / n), r2: 1 - sse / sst, pred: pred };
  }
  function hessian(gram, n) { return gram.A.map(function (row) { return Array.from(row, function (v) { return 2 * v / n; }); }); }
  function gdGram(gram, n, yy, eta, nIter, tol) {
    var p = gram.c.length, w = new Float64Array(p), losses = [], k, i, j;
    function f(w) { var q = 0, l = 0; for (i = 0; i < p; i++) { var s = 0; for (j = 0; j < p; j++) s += gram.A[i][j] * w[j]; q += w[i] * s; l += gram.c[i] * w[i]; } return (q - 2 * l + yy) / n; }
    losses.push(f(w));
    for (k = 0; k < nIter; k++) {
      var g = new Float64Array(p), gn = 0;
      for (i = 0; i < p; i++) { var s = 0; for (j = 0; j < p; j++) s += gram.A[i][j] * w[j]; g[i] = 2 * (s - gram.c[i]) / n; gn += g[i] * g[i]; }
      if (tol && Math.sqrt(gn) < tol) break;
      for (i = 0; i < p; i++) w[i] -= eta * g[i];
      var fv = f(w); losses.push(fv);
      if (!isFinite(fv) || fv > 1e12 * (losses[0] + 1)) break;
    }
    return { w: w, losses: losses, iterations: losses.length - 1 };
  }

  function solveHousing() {
    var h = H, t0, rows = [];
    t0 = performance.now(); var gram = LA.gram(h.tr, h.ytr); var wNE = LA.fitNormal(h.tr, h.ytr, gram); var tNE = performance.now() - t0;
    t0 = performance.now(); var wQR = LA.fitQR(h.tr, h.ytr); var tQR = performance.now() - t0;
    var Hs = hessian(gram, h.nTr), ev = LA.jacobiEigen(Hs).values, L = ev[0], mu = ev[ev.length - 1];
    var yy = LA.dot(h.ytr, h.ytr);
    t0 = performance.now(); var g = gdGram(gram, h.nTr, yy, 2 / (L + mu), 20000, 1e-10); var tGD = performance.now() - t0;
    [["ne", wNE, tNE, 0], ["qr", wQR, tQR, 0], ["gd", g.w, tGD, g.iterations]].forEach(function (m) {
      var met = metrics(h.te, h.yte, m[1]);
      var diff = 0; for (var i = 0; i < wQR.length; i++) diff = Math.max(diff, Math.abs(m[1][i] - wQR[i]));
      rows.push({ key: m[0], met: met, diff: m[0] === "qr" ? null : diff, time: m[2], iters: m[3] });
    });
    h.res = { rows: rows, wQR: wQR, gram: gram, yy: yy };
  }
  function renderHousing() {
    var h = H, r = h.res;
    var body = r.rows.map(function (row) {
      return "<tr><td>" + LAB.t(row.key) + (row.iters ? ' <span class="pill">' + LAB.t("itersN", { n: row.iters }) + "</span>" : "") + '</td><td class="num">' + LAB.int(row.met.rmse * 1e5) + ' $</td><td class="num">' + LAB.fmt(row.met.r2, 4) +
        '</td><td class="num">' + (row.diff == null ? "–" : LAB.sci(Math.max(row.diff, 1e-17), 1)) + '</td><td class="num">' + LAB.fmt(row.time, 1) + " ms</td></tr>";
    }).join("") + '<tr><td style="color:var(--muted)">' + LAB.t("sk") + '</td><td class="num" style="color:var(--muted)">' + LAB.int(72495) + ' $</td><td class="num" style="color:var(--muted)">' + LAB.fmt(0.6076, 4) + '</td><td class="num">–</td><td class="num">–</td></tr>';
    $("#hTable").innerHTML = "<thead><tr><th>" + LAB.t("method") + '</th><th class="num">' + LAB.t("rmse") + '</th><th class="num">' + LAB.t("r2") + '</th><th class="num">' + LAB.t("maxdiff") + '</th><th class="num">' + LAB.t("time") + "</th></tr></thead><tbody>" + body + "</tbody>";
    // coefficients
    var w = r.wQR, names = h.features.map(feat), vals = Array.from(w).slice(1);
    var cdata = { labels: names, datasets: [{ data: vals, backgroundColor: vals.map(function (v) { return v >= 0 ? C.orange : C.purple; }), borderRadius: 6 }] };
    if (!hCharts.coef) hCharts.coef = LAB.chart($("#hCoef"), { type: "bar", data: cdata, options: { indexAxis: "y", plugins: { legend: { display: false } }, scales: { x: LAB.linAxis(""), y: { grid: { display: false } } } } });
    else { hCharts.coef.data = cdata; hCharts.coef.update(); }
    // predictions
    var pred = r.rows[1].met.pred, sc = [];
    for (var i = 0; i < pred.length; i++) sc.push({ x: h.yte[i], y: pred[i] });
    var pdata = { datasets: [
      { type: "scatter", label: LAB.t("predV"), data: sc, backgroundColor: "rgba(155,123,247,.28)", pointRadius: 1.6 },
      { type: "line", label: LAB.t("perfect"), data: [{ x: -1, y: -1 }, { x: 7, y: 7 }], borderColor: C.orange, borderWidth: 2, pointRadius: 0 }
    ] };
    if (!hCharts.pred) hCharts.pred = LAB.chart($("#hPred"), { type: "scatter", data: pdata, options: { interaction: { mode: "nearest", intersect: true }, plugins: { tooltip: { enabled: false } }, scales: { x: LAB.linAxis(LAB.t("trueV"), { min: 0, max: 5.5 }), y: LAB.linAxis(LAB.t("predV"), { min: -1, max: 7 }) } } });
    else { hCharts.pred.data = pdata; hCharts.pred.options.scales.x.title.text = LAB.t("trueV"); hCharts.pred.options.scales.y.title.text = LAB.t("predV"); hCharts.pred.update(); }
    renderHousingGD();
  }
  function renderHousingGD() {
    var h = H, cols = hgd.std ? h.tr : h.trRaw;
    if (!h.gd || h.gd.std !== hgd.std) {
      var gram = LA.gram(cols, h.ytr), Hs = hessian(gram, h.nTr), ev = LA.jacobiEigen(Hs).values;
      var ws = LA.fitQR(cols, h.ytr), yy = LA.dot(h.ytr, h.ytr), p = ws.length, q = 0, l = 0, i, j;
      for (i = 0; i < p; i++) { var s = 0; for (j = 0; j < p; j++) s += gram.A[i][j] * ws[j]; q += ws[i] * s; l += gram.c[i] * ws[i]; }
      h.gd = { std: hgd.std, gram: gram, L: ev[0], mu: ev[ev.length - 1], fs: (q - 2 * l + yy) / h.nTr, yy: yy };
    }
    var G = h.gd, eta = hgd.etaL / G.L, run = gdGram(G.gram, h.nTr, G.yy, eta, 600, 0);
    var f0 = run.losses[0], gaps = run.losses.map(function (f) { return Math.max((f - G.fs) / (f0 - G.fs), 1e-17); });
    var rho = Math.max(Math.abs(1 - eta * G.mu), Math.abs(1 - eta * G.L));
    var ks = [], ls = [];
    gaps.forEach(function (g, k) { if (k > 50 && g > 1e-13 && isFinite(g)) { ks.push(k); ls.push(Math.log(g)); } });
    var obs = null;
    if (ks.length > 5) {
      var mk = ks.reduce(function (a, b) { return a + b; }) / ks.length, my = ls.reduce(function (a, b) { return a + b; }) / ls.length, num = 0, den = 0;
      for (var k = 0; k < ks.length; k++) { num += (ks[k] - mk) * (ls[k] - my); den += (ks[k] - mk) * (ks[k] - mk); }
      obs = Math.exp(num / den / 2);
    }
    $("#hEtaOut").textContent = LAB.fmt(hgd.etaL, 2);
    $("#hKappa").textContent = G.L / G.mu > 1e4 ? LAB.sci(G.L / G.mu, 1) : LAB.fmt(G.L / G.mu, 1);
    $("#hRho").textContent = rho > 0.99995 && rho < 1 ? LAB.fmt(rho, 8) : LAB.fmt(rho, 4);
    $("#hRhoObs").textContent = obs == null ? "–" : LAB.fmt(obs, 4);
    var data = { datasets: [
      { label: LAB.t("relGap"), data: gaps.map(function (g, k) { return { x: k, y: Math.min(g, 1e6) }; }), borderColor: C.orange, backgroundColor: C.orange, pointRadius: 0, borderWidth: 2 },
      { label: LAB.t("theoryLbl"), data: gaps.map(function (g, k) { return { x: k, y: Math.min(Math.max(Math.pow(rho, 2 * k), 1e-17), 1e6) }; }), borderColor: LAB.ink(), borderDash: [5, 5], pointRadius: 0, borderWidth: 1.2 }
    ] };
    if (!hCharts.gd) hCharts.gd = LAB.chart($("#hGd"), { type: "line", data: data, options: { parsing: false, scales: { x: LAB.linAxis(LAB.t("kAxis"), { min: 0, max: 600 }), y: LAB.logAxis("", { min: 1e-16, max: 1e6 }) } } });
    else { hCharts.gd.data = data; hCharts.gd.options.scales.x.title.text = LAB.t("kAxis"); hCharts.gd.update(); }
  }
  $("#hEta").addEventListener("input", LAB.raf(function () { hgd.etaL = +$("#hEta").value; if (H) renderHousingGD(); }));
  $("#hStd").addEventListener("change", function () { hgd.std = $("#hStd").checked; if (H) renderHousingGD(); });

  function loadHousing() {
    fetch("/lab/linear-regression/data/housing.json").then(function (r) { return r.json(); }).then(function (d) {
      H = prepHousing(d);
      solveHousing();
      $("#hLoading").hidden = true; $("#hBody").hidden = false;
      renderHousing();
    }).catch(function (e) { $("#hLoading").textContent = "Could not load the data: " + e.message; });
  }

  LAB.debug = LAB.debug || {};
  LAB.debug.housing = function () { return H && H.res ? { w: Array.from(H.res.wQR), rows: H.res.rows.map(function (r) { return { key: r.key, r2: r.met.r2, rmse: r.met.rmse, diff: r.diff, iters: r.iters }; }) } : null; };

  /* ---------- start ---------- */
  var started = {};
  LAB.tabs(document.querySelector(".tabs"), function (id) {
    setTimeout(function () {
      if (id === "fit") renderFit();
      if (id === "gd") { renderGD(); gdDirty = false; }
      if (id === "housing") { if (!started.housing) { started.housing = true; loadHousing(); } else if (H) renderHousing(); }
    }, 0);
  });
  window.addEventListener("resize", LAB.debounce(function () {
    if (!$('[data-panel="fit"]').hidden) renderFit();
    if (!$('[data-panel="gd"]').hidden) renderGD();
  }, 150));
  LAB.onLang(function () {
    if (!$('[data-panel="fit"]').hidden) renderFit();
    if (!$('[data-panel="gd"]').hidden) renderGD();
    if (gChart) { gChart.data.datasets[0].label = LAB.t("gapLbl"); gChart.data.datasets[1].label = LAB.t("theoryLbl"); gChart.update(); }
    if (H && H.res) renderHousing();
  });
})();
