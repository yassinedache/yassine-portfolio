/* PCA & SVD: live demo (JavaScript port of the pcasvd package). */
(function () {
  "use strict";
  var C = LAB.colors, $ = function (s) { return document.querySelector(s); };

  LAB.register({
    en: {
      pageTitle: "PCA & SVD", kicker: "Linear algebra · Python", title: "PCA &amp; SVD <em>from scratch</em>",
      lead: "The singular value decomposition, computed with Jacobi rotations, used to compress images and to find the principal components of a dataset.",
      tab1: "Image compression", tab2: "PCA of the Wine dataset",
      original: "Original", rank: "Rank k", rankCap: "Rank {k} approximation", storage: "Numbers stored", errMeasured: "Error ‖A − Aₖ‖ / ‖A‖", errEY: "Eckart–Young prediction",
      yourPhoto: "Try your own photo", choose: "Choose an image", backAstro: "Back to the astronaut",
      photoNote: "Resized to 256 pixels and converted to grey, then decomposed in your browser by the same Jacobi algorithm. Nothing is uploaded.",
      sweep: "Jacobi sweep {s}: largest remaining correlation between columns {w}", svdDone: "SVD of your {m} × {n} image computed in {t} s ({s} sweeps).",
      astroCap: "Original (512 × 512, NASA)", yourCap: "Your image ({m} × {n})",
      svTitle: "Singular values σᵢ", svSub: "The image is the sum of rank-one layers σᵢ uᵢ vᵢᵀ. Keeping the k largest gives the best rank-k approximation.",
      kept: "kept (i ≤ k)", dropped: "discarded", index: "index i",
      cNote: "<p><b>Eckart–Young theorem.</b> Among all matrices of rank at most k, the truncated SVD Aₖ = σ₁u₁v₁ᵀ + … + σₖuₖvₖᵀ is the closest to A, and its error is known in advance: ‖A − Aₖ‖<sub>F</sub> = √(σ²ₖ₊₁ + … + σ²ᵣ) and ‖A − Aₖ‖₂ = σₖ₊₁. Compare the measured error with the prediction while you move the slider.</p><p><b>Storage.</b> Aₖ needs k(m + n + 1) numbers instead of mn. The singular values of the astronaut were computed by my one-sided Jacobi SVD (in Python), which agrees with NumPy to 2 × 10⁻¹¹.</p>",
      axes: "Axes", route: "Computed by", cov: "Covariance + Jacobi", standardise: "Standardise the 13 variables",
      varPlane: "Variance in this plane", acc: "Cultivar found (leave-one-out)", agree: "Both routes agree to",
      scoresTitle: "178 wines in the principal plane", scoresSub: "Colours show the cultivar, which PCA never sees.",
      circleTitle: "Correlation circle", circleSub: "Each arrow is a variable; its coordinates are its correlations with the two components.",
      evTitle: "Explained variance", evBar: "variance explained by PCᵢ", evCum: "cumulative", cultivar: "Cultivar {c}",
      wNote: "<p><b>Two routes to the same axes.</b> Diagonalising the covariance matrix C = ZᵀZ/(n − 1) with Jacobi rotations, or taking the SVD Z = UΣVᵀ of the centred data, gives the same principal axes V and variances σᵢ²/(n − 1). The SVD route never forms ZᵀZ, so it does not square the condition number.</p><p><b>Unsupervised, yet it separates the cultivars:</b> classify each wine by the nearest cultivar centre in the chosen plane (leaving it out) and see how often it is right. Untick “Standardise” and proline, measured in large units, dominates everything.</p>",
      feat: {}
    },
    fr: {
      pageTitle: "ACP & SVD", kicker: "Algèbre linéaire · Python", title: "ACP &amp; SVD <em>de zéro</em>",
      lead: "La décomposition en valeurs singulières, calculée par rotations de Jacobi, pour compresser des images et trouver les composantes principales d'un jeu de données.",
      tab1: "Compression d'image", tab2: "ACP du jeu de données Wine",
      original: "Original", rank: "Rang k", rankCap: "Approximation de rang {k}", storage: "Nombres stockés", errMeasured: "Erreur ‖A − Aₖ‖ / ‖A‖", errEY: "Prédiction d'Eckart–Young",
      yourPhoto: "Essayez votre propre photo", choose: "Choisir une image", backAstro: "Revenir à l'astronaute",
      photoNote: "Redimensionnée à 256 pixels et convertie en gris, puis décomposée dans votre navigateur par le même algorithme de Jacobi. Rien n'est envoyé.",
      sweep: "Balayage de Jacobi {s} : plus grande corrélation restante entre colonnes {w}", svdDone: "SVD de votre image {m} × {n} calculée en {t} s ({s} balayages).",
      astroCap: "Original (512 × 512, NASA)", yourCap: "Votre image ({m} × {n})",
      svTitle: "Valeurs singulières σᵢ", svSub: "L'image est la somme de couches de rang un σᵢ uᵢ vᵢᵀ. Garder les k plus grandes donne la meilleure approximation de rang k.",
      kept: "conservées (i ≤ k)", dropped: "abandonnées", index: "indice i",
      cNote: "<p><b>Théorème d'Eckart–Young.</b> Parmi toutes les matrices de rang au plus k, la SVD tronquée Aₖ = σ₁u₁v₁ᵀ + … + σₖuₖvₖᵀ est la plus proche de A, et son erreur est connue à l'avance : ‖A − Aₖ‖<sub>F</sub> = √(σ²ₖ₊₁ + … + σ²ᵣ) et ‖A − Aₖ‖₂ = σₖ₊₁. Comparez l'erreur mesurée à la prédiction en déplaçant le curseur.</p><p><b>Stockage.</b> Aₖ demande k(m + n + 1) nombres au lieu de mn. Les valeurs singulières de l'astronaute ont été calculées par ma SVD de Jacobi unilatérale (en Python), qui concorde avec NumPy à 2 × 10⁻¹¹ près.</p>",
      axes: "Axes", route: "Calculé par", cov: "Covariance + Jacobi", standardise: "Standardiser les 13 variables",
      varPlane: "Variance dans ce plan", acc: "Cépage retrouvé (validation croisée)", agree: "Les deux méthodes concordent à",
      scoresTitle: "178 vins dans le plan principal", scoresSub: "Les couleurs indiquent le cépage, que l'ACP ne voit jamais.",
      circleTitle: "Cercle des corrélations", circleSub: "Chaque flèche est une variable ; ses coordonnées sont ses corrélations avec les deux composantes.",
      evTitle: "Variance expliquée", evBar: "variance expliquée par CPᵢ", evCum: "cumulée", cultivar: "Cépage {c}",
      wNote: "<p><b>Deux chemins vers les mêmes axes.</b> Diagonaliser la matrice de covariance C = ZᵀZ/(n − 1) par rotations de Jacobi, ou calculer la SVD Z = UΣVᵀ des données centrées, donne les mêmes axes principaux V et les mêmes variances σᵢ²/(n − 1). La SVD ne forme jamais ZᵀZ, donc n'élève pas le conditionnement au carré.</p><p><b>Non supervisée, et pourtant elle sépare les cépages :</b> classez chaque vin par le centre de cépage le plus proche dans le plan choisi (en l'excluant) et regardez combien de fois c'est juste. Décochez « Standardiser » et la proline, mesurée dans une grande unité, écrase tout.</p>",
      feat: { alcohol: "alcool", malic_acid: "acide malique", ash: "cendres", alcalinity_of_ash: "alcalinité des cendres", magnesium: "magnésium", total_phenols: "phénols totaux",
        flavanoids: "flavonoïdes", nonflavanoid_phenols: "phénols non flavonoïdes", proanthocyanins: "proanthocyanidines", color_intensity: "intensité de couleur", hue: "teinte", od280_od315: "OD280/OD315", proline: "proline" }
    }
  });
  function feat(n) { var f = LAB.dict[LAB.lang].feat; return (f && f[n]) || n.replace(/_/g, " ").replace("od280 od315", "OD280/OD315"); }
  function pcName(i) { return (LAB.lang === "fr" ? "CP" : "PC") + (i + 1); }

  /* ======================================================================
     Image compression
     ====================================================================== */
  var img = null, astro = null, svChart = null;

  function loadAstronaut() {
    return fetch("/lab/pca-svd/data/astronaut.bin").then(function (r) { return r.arrayBuffer(); }).then(function (buf) {
      var m = 512, n = 512, K = 256, off = 0;
      var px = new Uint8Array(buf, 0, m * n); off += m * n;
      var s = new Float32Array(buf.slice(off, off + 4 * 512)); off += 4 * 512;
      var U = new Float32Array(buf.slice(off, off + 4 * K * m)); off += 4 * K * m;
      var V = new Float32Array(buf.slice(off, off + 4 * K * n));
      var A = new Float64Array(m * n);
      for (var i = 0; i < m * n; i++) A[i] = px[i] / 255;
      astro = { m: m, n: n, A: A, s: Float64Array.from(s), U: U, V: V, r: K, astro: true };
      return astro;
    });
  }
  function useImage(im, k) {
    img = im;
    img.Ak = new Float64Array(im.m * im.n);
    img.k = 0;
    img.normA = Math.sqrt(im.A.reduce(function (a, b) { return a + b * b; }, 0));
    var tot = 0; for (var i = 0; i < im.s.length; i++) tot += im.s[i] * im.s[i];
    img.s2tot = tot;
    var rk = $("#rank");
    rk.max = im.r;
    rk.value = Math.min(k || 20, im.r);
    drawGray($("#orig"), im.A, im.m, im.n);
    $("#origCap").textContent = im.astro ? LAB.t("astroCap") : LAB.t("yourCap", { m: im.m, n: im.n });
    $("#backAstro").hidden = !!im.astro;
    setRank(+rk.value, true);
  }
  function addLayers(from, to, sign) {
    var m = img.m, n = img.n, Ak = img.Ak;
    for (var i = from; i < to; i++) {
      var si = sign * img.s[i], uo = i * m, vo = i * n;
      for (var r = 0; r < m; r++) {
        var a = si * img.U[uo + r];
        if (a === 0) continue;
        var row = r * n;
        for (var c = 0; c < n; c++) Ak[row + c] += a * img.V[vo + c];
      }
    }
  }
  function setRank(k, force) {
    if (!img) return;
    if (k > img.k) addLayers(img.k, k, 1);
    else if (k < img.k) addLayers(k, img.k, -1);
    img.k = k;
    drawGray($("#approx"), img.Ak, img.m, img.n);
    renderCompression();
  }
  function drawGray(cv, A, m, n) {
    cv.width = n; cv.height = m;
    var ctx = cv.getContext("2d"), d = ctx.createImageData(n, m);
    for (var i = 0; i < m * n; i++) {
      var v = Math.max(0, Math.min(255, Math.round(A[i] * 255)));
      d.data[4 * i] = d.data[4 * i + 1] = d.data[4 * i + 2] = v; d.data[4 * i + 3] = 255;
    }
    ctx.putImageData(d, 0, 0);
  }
  function renderCompression() {
    var k = img.k, m = img.m, n = img.n, A = img.A, Ak = img.Ak, se = 0, mse = 0;
    for (var i = 0; i < m * n; i++) {
      var d = A[i] - Ak[i]; se += d * d;
      var dc = A[i] - Math.max(0, Math.min(1, Ak[i])); mse += dc * dc;
    }
    mse /= m * n;
    var tail = 0; for (i = k; i < img.s.length; i++) tail += img.s[i] * img.s[i];
    $("#rankOut").textContent = k;
    $("#approxCap").textContent = LAB.t("rankCap", { k: k });
    $("#cStore").textContent = LAB.fmt(100 * k * (m + n + 1) / (m * n), 1) + " %";
    $("#cPsnr").innerHTML = (mse > 0 ? LAB.fmt(10 * Math.log10(1 / mse), 1) : "∞") + " <small>dB</small>";
    $("#cErr").textContent = LAB.fmt(Math.sqrt(se) / img.normA, 4);
    $("#cEY").textContent = LAB.fmt(Math.sqrt(tail / img.s2tot), 4);
    var kept = [], dropped = [];
    for (i = 0; i < img.s.length; i++) (i < k ? kept : dropped).push({ x: i + 1, y: Math.max(img.s[i], 1e-12) });
    var data = { datasets: [
      { label: LAB.t("kept"), data: kept, borderColor: C.orange, backgroundColor: C.orange, pointRadius: 0, borderWidth: 2.5 },
      { label: LAB.t("dropped"), data: dropped, borderColor: C.purple, backgroundColor: C.purple, pointRadius: 0, borderWidth: 2 }
    ] };
    if (!svChart) svChart = LAB.chart($("#svChart"), { type: "line", data: data, options: { parsing: false, scales: { x: LAB.linAxis(LAB.t("index"), { min: 1 }), y: LAB.logAxis("") } } });
    else { svChart.data = data; svChart.options.scales.x.title.text = LAB.t("index"); svChart.options.scales.x.max = img.s.length; svChart.update(); }
  }
  $("#rank").addEventListener("input", LAB.raf(function () { setRank(+$("#rank").value); }));
  $("#quick").addEventListener("click", function (e) {
    var b = e.target.closest("[data-k]"); if (!b || !img) return;
    var k = Math.min(+b.getAttribute("data-k"), img.r);
    $("#rank").value = k; setRank(k);
  });
  $("#backAstro").addEventListener("click", function () { if (astro) useImage(astro, 20); $("#svdMsg").textContent = ""; });

  /* your own photo: resize to 256 px, grey levels, SVD in a Web Worker */
  var worker = null;
  $("#file").addEventListener("change", function () {
    var f = this.files && this.files[0];
    if (!f) return;
    var url = URL.createObjectURL(f), im = new Image();
    im.onload = function () {
      var sc = 256 / Math.max(im.width, im.height), w = Math.max(8, Math.round(im.width * Math.min(1, sc))), h = Math.max(8, Math.round(im.height * Math.min(1, sc)));
      var cv = document.createElement("canvas"); cv.width = w; cv.height = h;
      var ctx = cv.getContext("2d"); ctx.drawImage(im, 0, 0, w, h);
      var d = ctx.getImageData(0, 0, w, h).data, A = new Float64Array(w * h);
      for (var i = 0; i < w * h; i++) A[i] = (0.299 * d[4 * i] + 0.587 * d[4 * i + 1] + 0.114 * d[4 * i + 2]) / 255;
      URL.revokeObjectURL(url);
      runSVD(A, h, w);
    };
    im.src = url;
    this.value = "";
  });
  function runSVD(A, m, n) {
    if (worker) worker.terminate();
    worker = new Worker("/lab/pca-svd/svd-worker.js");
    var prog = $("#svdProg"), bar = prog.querySelector("i"), lastSweep = 0;
    prog.hidden = false; bar.style.width = "4%";
    worker.onmessage = function (ev) {
      var d = ev.data;
      if (d.progress) {
        lastSweep = d.sweep;
        bar.style.width = Math.min(95, 8 + d.sweep * 10) + "%";
        $("#svdMsg").textContent = LAB.t("sweep", { s: d.sweep, w: LAB.sci(d.worst, 1) });
        return;
      }
      bar.style.width = "100%";
      setTimeout(function () { prog.hidden = true; }, 600);
      $("#svdMsg").textContent = LAB.t("svdDone", { m: m, n: n, t: LAB.fmt(d.ms / 1000, 1), s: lastSweep });
      useImage({ m: m, n: n, A: A, s: d.s, U: d.U, V: d.V, r: d.r, astro: false }, 10);
    };
    worker.postMessage({ m: m, n: n, data: A });
  }

  /* ======================================================================
     Wine PCA
     ====================================================================== */
  var W = null, wst = { route: "cov", std: true, px: 0, py: 1 }, wCharts = {};
  function fixSigns(V) {          // V[row][comp]: make the largest entry of each component positive
    var p = V.length;
    for (var c = 0; c < p; c++) {
      var best = 0;
      for (var r = 0; r < p; r++) if (Math.abs(V[r][c]) > Math.abs(V[best][c])) best = r;
      if (V[best][c] < 0) for (r = 0; r < p; r++) V[r][c] = -V[r][c];
    }
    return V;
  }
  function pca(X, standardise) {
    var n = X.length, p = X[0].length, mean = [], scale = [], Z = [], i, j;
    for (j = 0; j < p; j++) {
      var m = 0; for (i = 0; i < n; i++) m += X[i][j]; m /= n;
      var s = 0; for (i = 0; i < n; i++) s += (X[i][j] - m) * (X[i][j] - m);
      mean.push(m); scale.push(standardise ? Math.sqrt(s / (n - 1)) : 1);
    }
    for (i = 0; i < n; i++) Z.push(X[i].map(function (v, jj) { return (v - mean[jj]) / scale[jj]; }));
    // covariance route
    var Cm = [];
    for (j = 0; j < p; j++) { Cm.push(new Float64Array(p)); }
    for (j = 0; j < p; j++) for (var k = j; k < p; k++) { var t = 0; for (i = 0; i < n; i++) t += Z[i][j] * Z[i][k]; Cm[j][k] = Cm[k][j] = t / (n - 1); }
    var eg = LA.jacobiEigen(Cm), Vc = fixSigns(eg.vectors.map(function (r) { return r.slice(); })), lc = eg.values.map(function (v) { return Math.max(v, 0); });
    // SVD route
    var cols = []; for (j = 0; j < p; j++) cols.push(Float64Array.from(Z.map(function (r) { return r[j]; })));
    var sv = LA.jacobiSVDcols(cols), Vs = [];
    for (var r = 0; r < p; r++) Vs.push(sv.V.map(function (vec) { return vec[r]; }));
    fixSigns(Vs);
    var ls = sv.s.map(function (x) { return x * x / (n - 1); });
    var agree = 0; for (j = 0; j < p; j++) agree = Math.max(agree, Math.abs(lc[j] - ls[j]));
    var colSd = [];
    for (j = 0; j < p; j++) { var q = 0; for (i = 0; i < n; i++) q += Z[i][j] * Z[i][j]; colSd.push(Math.sqrt(q / (n - 1))); }
    return { Z: Z, cov: { V: Vc, lam: lc }, svd: { V: Vs, lam: ls }, agree: agree, colSd: colSd, p: p, n: n };
  }
  function scoresOf(res, V) {
    return res.Z.map(function (z) { return V[0].map(function (_, c) { var s = 0; for (var j = 0; j < z.length; j++) s += z[j] * V[j][c]; return s; }); });
  }
  function looAccuracy(S, lab, a, b) {
    var n = S.length, ok = 0, sums = {}, cnt = {};
    for (var i = 0; i < n; i++) { var c = lab[i]; sums[c] = sums[c] || [0, 0]; sums[c][0] += S[i][a]; sums[c][1] += S[i][b]; cnt[c] = (cnt[c] || 0) + 1; }
    for (i = 0; i < n; i++) {
      var best = null, bd = Infinity;
      Object.keys(sums).forEach(function (c) {
        var k = +c, m = cnt[k] - (lab[i] === k ? 1 : 0);
        if (m <= 0) return;
        var cx = (sums[k][0] - (lab[i] === k ? S[i][a] : 0)) / m, cy = (sums[k][1] - (lab[i] === k ? S[i][b] : 0)) / m;
        var d = (S[i][a] - cx) * (S[i][a] - cx) + (S[i][b] - cy) * (S[i][b] - cy);
        if (d < bd) { bd = d; best = k; }
      });
      if (best === lab[i]) ok++;
    }
    return ok / n;
  }
  function wineCompute() {
    W.res = pca(W.d.X, wst.std);
    wineRender();
  }
  function wineRender() {
    var res = W.res, R = wst.route === "cov" ? res.cov : res.svd, tot = R.lam.reduce(function (a, b) { return a + b; }, 0);
    var S = scoresOf(res, R.V), a = wst.px, b = wst.py;
    // axis selectors
    ["#px", "#py"].forEach(function (sel, idx) {
      var el = $(sel), cur = idx ? b : a;
      el.innerHTML = R.lam.map(function (l, i) { return '<option value="' + i + '"' + (i === cur ? " selected" : "") + ">" + pcName(i) + " (" + LAB.fmt(100 * l / tot, 1) + " %)</option>"; }).join("");
    });
    $("#wVar").textContent = LAB.fmt(100 * (R.lam[a] + (a === b ? 0 : R.lam[b])) / tot, 1) + " %";
    $("#wAcc").textContent = LAB.fmt(100 * looAccuracy(S, W.d.cultivar, a, b), 1) + " %";
    $("#wAgree").textContent = LAB.sci(Math.max(res.agree, 1e-17), 1);
    var cols3 = [C.purple, C.orange, LAB.ink()];
    var ds = [1, 2, 3].map(function (c, i) {
      return { label: LAB.t("cultivar", { c: c }), data: S.filter(function (_, j) { return W.d.cultivar[j] === c; }).map(function (s) { return { x: s[a], y: s[b] }; }),
        backgroundColor: cols3[i], borderColor: cols3[i], pointRadius: 3.5, pointHoverRadius: 5 };
    });
    if (!wCharts.sc) wCharts.sc = LAB.chart($("#scores"), { type: "scatter", data: { datasets: ds }, options: { interaction: { mode: "nearest", intersect: true }, scales: { x: LAB.linAxis(pcName(a)), y: LAB.linAxis(pcName(b)) } } });
    else { wCharts.sc.data.datasets = ds; wCharts.sc.options.scales.x.title.text = pcName(a); wCharts.sc.options.scales.y.title.text = pcName(b); wCharts.sc.update(); }
    var ratios = R.lam.map(function (l) { return 100 * l / tot; }), cum = [], acc = 0;
    ratios.forEach(function (r) { acc += r; cum.push(acc); });
    var ev = { labels: R.lam.map(function (_, i) { return pcName(i); }), datasets: [
      { type: "bar", label: LAB.t("evBar"), data: ratios, backgroundColor: ratios.map(function (_, i) { return i === a || i === b ? C.orange : "rgba(155,123,247,.6)"; }), borderRadius: 5 },
      { type: "line", label: LAB.t("evCum"), data: cum, borderColor: LAB.ink(), backgroundColor: LAB.ink(), pointRadius: 2.5, borderWidth: 1.6 }
    ] };
    if (!wCharts.ev) wCharts.ev = LAB.chart($("#evChart"), { type: "bar", data: ev, options: { scales: { x: { grid: { display: false } }, y: LAB.linAxis("%", { min: 0, max: 100 }) } } });
    else { wCharts.ev.data = ev; wCharts.ev.update(); }
    drawCircle(res, R, a, b);
  }
  function drawCircle(res, R, a, b) {
    var cv = $("#circle"), W0 = cv.parentNode.clientWidth, H0 = Math.min(W0, 440);
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(W0 * dpr); cv.height = Math.round(H0 * dpr); cv.style.height = H0 + "px";
    var ctx = cv.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W0, H0);
    var cx = W0 / 2, cy = H0 / 2, rad = Math.min(W0, H0) / 2 - 34, ink = LAB.ink(), line = LAB.cssVar("--line"), muted = LAB.cssVar("--muted");
    ctx.strokeStyle = line; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(cx, cy, rad, 0, 6.2832); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, rad / 2, 0, 6.2832); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - rad - 10, cy); ctx.lineTo(cx + rad + 10, cy); ctx.moveTo(cx, cy - rad - 10); ctx.lineTo(cx, cy + rad + 10); ctx.stroke();
    ctx.fillStyle = muted; ctx.font = "700 12px Inter, sans-serif";
    ctx.fillText(pcName(a), cx + rad - 26, cy + 16); ctx.fillText(pcName(b), cx + 6, cy - rad + 4);
    W.d.features.forEach(function (f, j) {
      var x = R.V[j][a] * Math.sqrt(R.lam[a]) / res.colSd[j], y = R.V[j][b] * Math.sqrt(R.lam[b]) / res.colSd[j];
      var px = cx + x * rad, py = cy - y * rad, strong = Math.hypot(x, y) > 0.6;
      ctx.strokeStyle = strong ? C.orange : C.purple; ctx.fillStyle = ctx.strokeStyle; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();
      var ang = Math.atan2(py - cy, px - cx);
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - 8 * Math.cos(ang - 0.4), py - 8 * Math.sin(ang - 0.4)); ctx.lineTo(px - 8 * Math.cos(ang + 0.4), py - 8 * Math.sin(ang + 0.4)); ctx.closePath(); ctx.fill();
      ctx.fillStyle = ink; ctx.font = "600 11px Inter, sans-serif";
      var lbl = feat(f), tw = ctx.measureText(lbl).width;
      var lx = px + (Math.cos(ang) >= 0 ? 6 : -6 - tw), ly = py + (Math.sin(ang) >= 0 ? 13 : -5);
      ctx.fillText(lbl, Math.max(2, Math.min(W0 - tw - 2, lx)), Math.max(12, Math.min(H0 - 4, ly)));
    });
  }
  $("#px").addEventListener("change", function () { wst.px = +this.value; wineRender(); });
  $("#py").addEventListener("change", function () { wst.py = +this.value; wineRender(); });
  $("#wStd").addEventListener("change", function () { wst.std = this.checked; wineCompute(); });
  LAB.seg($("#route"), function (v) { wst.route = v; wineRender(); });

  LAB.debug = LAB.debug || {};
  LAB.debug.pca = function () { var R = W.res.cov, tot = R.lam.reduce(function (a, b) { return a + b; }, 0); return { ratio: R.lam.map(function (l) { return l / tot; }), agree: W.res.agree, acc: $("#wAcc").textContent }; };
  LAB.debug.compress = function () { return img ? { k: img.k, err: $("#cErr").textContent, ey: $("#cEY").textContent, psnr: $("#cPsnr").textContent, store: $("#cStore").textContent } : null; };

  /* ---------- start ---------- */
  var started = {};
  LAB.tabs(document.querySelector(".tabs"), function (id) {
    if (id === "compress" && !started.c) {
      started.c = true;
      loadAstronaut().then(function (a) { $("#cLoading").remove(); useImage(a, 20); }).catch(function (e) { $("#cLoading").textContent = "Could not load the data: " + e.message; });
    }
    if (id === "wine" && !started.w) {
      started.w = true;
      fetch("/lab/pca-svd/data/wine.json").then(function (r) { return r.json(); }).then(function (d) { W = { d: d }; wineCompute(); });
    } else if (id === "wine" && W) setTimeout(wineRender, 0);
  });
  window.addEventListener("resize", LAB.debounce(function () { if (W && W.res && !$('[data-panel="wine"]').hidden) wineRender(); }, 150));
  LAB.onLang(function () {
    if (img) { $("#origCap").textContent = img.astro ? LAB.t("astroCap") : LAB.t("yourCap", { m: img.m, n: img.n }); renderCompression(); svChart.data.datasets[0].label = LAB.t("kept"); svChart.data.datasets[1].label = LAB.t("dropped"); svChart.update(); }
    if (W && W.res) { if (wCharts.ev) { wCharts.ev.data.datasets[0].label = LAB.t("evBar"); wCharts.ev.data.datasets[1].label = LAB.t("evCum"); } wineRender(); }
  });
})();
