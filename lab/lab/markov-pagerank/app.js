/* Markov chains & PageRank: live demo (JavaScript port of the markov package). */
(function () {
  "use strict";
  var C = LAB.colors;
  var $ = function (s) { return document.querySelector(s); };

  LAB.register({
    en: {
      pageTitle: "Markov chains & PageRank", kicker: "Probability · Linear algebra", title: "Markov chains &amp; <em>PageRank</em>",
      lead: "A random passenger keeps taking a random flight. Where do they spend their time? That is PageRank: the stationary distribution of a Markov chain on 3,425 airports.",
      tab1: "PageRank of airports", tab2: "Ehrenfest urn", tab3: "Spectral gap",
      mapTitle: "Where a random passenger spends their time", mapSub: "Each dot is an airport; size and colour show its PageRank. Hover to inspect, click to select.",
      alpha: "Damping factor α", teleport: "Restart from", anyAirport: "any airport", oneAirport: "the selected airport",
      find: "Find an airport", findPh: "ALG, Algiers, Paris…", iters: "Iterations", bound: "Error ≤", time: "Time",
      topTitle: "Top 15 airports", topSub: "Rank change compared with α = 0.85 and restarts from any airport.",
      topSubPers: "Airports where passengers restarting from {code} spend the most time.",
      convTitle: "Convergence of the power method", convSub: "Residual ‖x<sub>k+1</sub> − x<sub>k</sub>‖₁ at each iteration, with the proven rate α<sup>k</sup>.",
      colAirport: "Airport", colScore: "PageRank ×1000", colChange: "vs 0.85",
      residual: "residual ‖xₖ₊₁ − xₖ‖₁", rateLine: "αᵏ (proven rate)", iteration: "iteration k",
      selUniform: "<b>{code}</b> · {name}, {city} ({country})<br>Rank <b>{rank}</b> of {n} · score {score} · {times}× the uniform score 1/n",
      selPersonal: "Passengers restart from <b>{code}</b> ({city}). The scores now measure how close each airport is to {code} in the network.",
      noCoords: "(no coordinates)",
      prNote: "<p><b>The model.</b> From an airport, the passenger takes a random flight with probability α (each route weighted by the number of airlines flying it), or restarts from a random airport with probability 1 − α. This is a Markov chain with transition matrix G = αS′ + (1 − α)·1vᵀ, the <b>Google matrix</b>, and PageRank is its stationary distribution π = πG.</p><p><b>Why the power method works.</b> For two probability vectors, xG − yG = α(x − y)S′, so ‖xG − yG‖₁ ≤ α‖x − y‖₁: each iteration shrinks the error by at least α, and ‖x<sub>k</sub> − π‖₁ ≤ ‖x<sub>k+1</sub> − x<sub>k</sub>‖₁ / (1 − α) gives a guaranteed stopping rule. Move α towards 1 and watch the number of iterations explode.</p><p><b>Restart from one airport</b> (personalized PageRank) answers a different question: which airports are closest to it in the network.</p>",
      balls: "Number of balls N", speed: "Speed (steps per second)", lazy: "Lazy chain (stay put with probability 1/2)",
      play: "Play", pause: "Pause", jump: "+ 100,000 steps", reset: "Reset", steps: "Steps", stateK: "Balls in A", tvFreq: "TV distance",
      urnTitle: "Two urns, one ball moves at each step", urnSub: "A ball chosen at random changes urn. All balls start in urn B.",
      freqTitle: "Time spent in each state vs Binomial(N, 1/2)", freqSub: "Ergodic theorem: the fraction of time spent with k balls in A tends to the stationary probability π(k).",
      tvTitle: "Distance to π: the error falls like 1/√n", tvSub: "Total variation distance between the occupation frequencies and π, along the simulation.",
      freq: "time spent with k balls in A", piBin: "π = Binomial(N, 1/2)", kAxis: "k = balls in urn A", tvAxis: "TV distance", nAxis: "steps n", sqrtRef: "C / √n",
      eNote: "<p><b>Detailed balance.</b> With π(k) = C(N, k)/2<sup>N</sup>, one checks π(k)·(N − k)/N = π(k + 1)·(k + 1)/N: the flow from k to k + 1 equals the flow back, so the binomial distribution is stationary.</p><p><b>Periodicity.</b> Without the lazy option, k changes by ±1 at each step, so its parity alternates: the law of X<sub>n</sub> never converges (period 2). The <b>ergodic theorem</b> still holds: the fraction of time spent in each state converges to π, with an error of order 1/√n. The lazy chain removes the periodicity.</p>",
      chain: "Chain", cycle: "Lazy cycle", lazyE: "Lazy Ehrenfest", plainE: "Ehrenfest", sizeM: "Number of sites m", sizeN: "Number of balls N",
      showN: "Show the distribution at step n", theory: "theory", measured: "Measured rate",
      gapTitle: "Distance to equilibrium ‖μₙ − π‖ (total variation)", gapSub: "Solid: exact computation of μₙ = μ₀Pⁿ. Dashed: the spectral bound ½·√((1 − π(x))/π(x))·λ*ⁿ.",
      distTitle: "Distribution μₙ and stationary distribution π", exact: "‖μₙ − π‖ (exact)", specBound: "spectral bound", muN: "μₙ", piLbl: "π", state: "state",
      noConv: "no convergence", period2: "1 (period 2)",
      gNote: "<p><b>Theorem (spectral bound).</b> For a reversible chain started at x, ‖μ<sub>n</sub> − π‖<sub>TV</sub> ≤ ½·√((1 − π(x))/π(x))·λ<sub>*</sub><sup>n</sup>, where λ<sub>*</sub> is the largest modulus of the eigenvalues other than 1. The proof uses the spectral theorem in ℓ²(π).</p><p><b>Lazy cycle:</b> λ<sub>*</sub> = cos²(π/m) ≈ 1 − π²/m², so the mixing time grows like m²: double the cycle, wait four times longer. <b>Ehrenfest:</b> the eigenvalues are 1 − 2j/N; the value −1 blocks convergence, and the lazy chain has λ<sub>*</sub> = 1 − 1/N.</p>"
    },
    fr: {
      pageTitle: "Chaînes de Markov & PageRank", kicker: "Probabilités · Algèbre linéaire", title: "Chaînes de Markov &amp; <em>PageRank</em>",
      lead: "Un passager prend indéfiniment un vol au hasard. Où passe-t-il son temps ? C'est PageRank : la loi stationnaire d'une chaîne de Markov sur 3 425 aéroports.",
      tab1: "PageRank des aéroports", tab2: "Urne d'Ehrenfest", tab3: "Trou spectral",
      mapTitle: "Où un passager aléatoire passe son temps", mapSub: "Chaque point est un aéroport ; taille et couleur indiquent son PageRank. Survolez pour voir le détail, cliquez pour sélectionner.",
      alpha: "Facteur d'amortissement α", teleport: "Recommencer depuis", anyAirport: "n'importe quel aéroport", oneAirport: "l'aéroport sélectionné",
      find: "Trouver un aéroport", findPh: "ALG, Alger, Paris…", iters: "Itérations", bound: "Erreur ≤", time: "Temps",
      topTitle: "Les 15 premiers aéroports", topSub: "Évolution du rang par rapport à α = 0,85 et à un redémarrage depuis n'importe quel aéroport.",
      topSubPers: "Aéroports où les passagers qui redémarrent depuis {code} passent le plus de temps.",
      convTitle: "Convergence de la méthode de la puissance", convSub: "Résidu ‖x<sub>k+1</sub> − x<sub>k</sub>‖₁ à chaque itération, et la vitesse démontrée α<sup>k</sup>.",
      colAirport: "Aéroport", colScore: "PageRank ×1000", colChange: "vs 0,85",
      residual: "résidu ‖xₖ₊₁ − xₖ‖₁", rateLine: "αᵏ (vitesse démontrée)", iteration: "itération k",
      selUniform: "<b>{code}</b> · {name}, {city} ({country})<br>Rang <b>{rank}</b> sur {n} · score {score} · {times} fois le score uniforme 1/n",
      selPersonal: "Les passagers redémarrent depuis <b>{code}</b> ({city}). Les scores mesurent maintenant la proximité de chaque aéroport avec {code} dans le réseau.",
      noCoords: "(sans coordonnées)",
      prNote: "<p><b>Le modèle.</b> Depuis un aéroport, le passager prend un vol au hasard avec probabilité α (chaque liaison pondérée par le nombre de compagnies qui l'exploitent), ou recommence depuis un aéroport quelconque avec probabilité 1 − α. C'est une chaîne de Markov de matrice G = αS′ + (1 − α)·1vᵀ, la <b>matrice de Google</b>, et PageRank est sa loi stationnaire π = πG.</p><p><b>Pourquoi la méthode de la puissance marche.</b> Pour deux lois de probabilité, xG − yG = α(x − y)S′, donc ‖xG − yG‖₁ ≤ α‖x − y‖₁ : chaque itération réduit l'erreur d'au moins α, et ‖x<sub>k</sub> − π‖₁ ≤ ‖x<sub>k+1</sub> − x<sub>k</sub>‖₁ / (1 − α) donne un critère d'arrêt garanti. Rapprochez α de 1 et regardez le nombre d'itérations exploser.</p><p><b>Recommencer depuis un aéroport</b> (PageRank personnalisé) répond à une autre question : quels aéroports sont les plus proches de lui dans le réseau.</p>",
      balls: "Nombre de boules N", speed: "Vitesse (pas par seconde)", lazy: "Chaîne paresseuse (reste sur place avec probabilité 1/2)",
      play: "Lecture", pause: "Pause", jump: "+ 100 000 pas", reset: "Réinitialiser", steps: "Pas", stateK: "Boules dans A", tvFreq: "Distance TV",
      urnTitle: "Deux urnes, une boule change d'urne à chaque pas", urnSub: "Une boule choisie au hasard change d'urne. Toutes les boules partent de l'urne B.",
      freqTitle: "Temps passé dans chaque état et loi binomiale B(N, 1/2)", freqSub: "Théorème ergodique : la proportion du temps passé avec k boules dans A tend vers la probabilité stationnaire π(k).",
      tvTitle: "Distance à π : l'erreur décroît en 1/√n", tvSub: "Distance en variation totale entre les fréquences d'occupation et π, au fil de la simulation.",
      freq: "temps passé avec k boules dans A", piBin: "π = B(N, 1/2)", kAxis: "k = boules dans l'urne A", tvAxis: "distance TV", nAxis: "pas n", sqrtRef: "C / √n",
      eNote: "<p><b>Équilibre détaillé.</b> Avec π(k) = C(N, k)/2<sup>N</sup>, on vérifie π(k)·(N − k)/N = π(k + 1)·(k + 1)/N : le flux de k vers k + 1 égale le flux retour, donc la loi binomiale est stationnaire.</p><p><b>Périodicité.</b> Sans l'option paresseuse, k change de ±1 à chaque pas, donc sa parité alterne : la loi de X<sub>n</sub> ne converge jamais (période 2). Le <b>théorème ergodique</b> reste vrai : la proportion du temps passé dans chaque état tend vers π, avec une erreur d'ordre 1/√n. La chaîne paresseuse supprime la périodicité.</p>",
      chain: "Chaîne", cycle: "Cycle paresseux", lazyE: "Ehrenfest paresseuse", plainE: "Ehrenfest", sizeM: "Nombre de sites m", sizeN: "Nombre de boules N",
      showN: "Afficher la loi au pas n", theory: "théorie", measured: "Taux mesuré",
      gapTitle: "Distance à l'équilibre ‖μₙ − π‖ (variation totale)", gapSub: "Trait plein : calcul exact de μₙ = μ₀Pⁿ. Pointillés : la borne spectrale ½·√((1 − π(x))/π(x))·λ*ⁿ.",
      distTitle: "Loi μₙ et loi stationnaire π", exact: "‖μₙ − π‖ (exact)", specBound: "borne spectrale", muN: "μₙ", piLbl: "π", state: "état",
      noConv: "pas de convergence", period2: "1 (période 2)",
      gNote: "<p><b>Théorème (borne spectrale).</b> Pour une chaîne réversible partant de x, ‖μ<sub>n</sub> − π‖<sub>TV</sub> ≤ ½·√((1 − π(x))/π(x))·λ<sub>*</sub><sup>n</sup>, où λ<sub>*</sub> est le plus grand module des valeurs propres autres que 1. La preuve utilise le théorème spectral dans ℓ²(π).</p><p><b>Cycle paresseux :</b> λ<sub>*</sub> = cos²(π/m) ≈ 1 − π²/m², donc le temps de mélange croît comme m² : doublez le cycle, attendez quatre fois plus longtemps. <b>Ehrenfest :</b> les valeurs propres sont 1 − 2j/N ; la valeur −1 empêche la convergence, et la chaîne paresseuse a λ<sub>*</sub> = 1 − 1/N.</p>"
    }
  });

  /* ======================================================================
     PageRank
     ====================================================================== */
  var G = null, base = null, cur = null;
  var pr = { alpha: 0.85, mode: "uniform", sel: -1 };
  var convChart = null;

  function buildGraph(d) {
    var n = d.nodes.length, m = d.src.length, e, i;
    var src = Int32Array.from(d.src), dst = Int32Array.from(d.dst), w = Float64Array.from(d.w);
    var outw = new Float64Array(n), inw = new Float64Array(n);
    for (e = 0; e < m; e++) { outw[src[e]] += w[e]; inw[dst[e]] += w[e]; }
    var p = new Float64Array(m);
    for (e = 0; e < m; e++) p[e] = w[e] / outw[src[e]];
    var dang = [];
    for (i = 0; i < n; i++) if (outw[i] === 0) dang.push(i);
    return { n: n, m: m, src: src, dst: dst, p: p, dang: Int32Array.from(dang), nodes: d.nodes, inw: inw };
  }

  /* power method x_{k+1} = x_k G, without forming G: O(edges) per iteration */
  function pagerank(g, alpha, v, tol, maxIter) {
    var n = g.n, x = Float64Array.from(v), y = new Float64Array(n), res = [], k, i, e;
    for (k = 1; k <= maxIter; k++) {
      y.fill(0);
      for (e = 0; e < g.m; e++) y[g.dst[e]] += x[g.src[e]] * g.p[e];
      var dm = 0, sx = 0;
      for (i = 0; i < g.dang.length; i++) dm += x[g.dang[i]];
      for (i = 0; i < n; i++) sx += x[i];
      var c = alpha * dm + (1 - alpha) * sx, r = 0;
      for (i = 0; i < n; i++) { var nv = alpha * y[i] + c * v[i]; r += Math.abs(nv - x[i]); y[i] = nv; }
      var t = x; x = y; y = t;
      res.push(r);
      if (r <= tol * (1 - alpha)) break;
    }
    var s = 0;
    for (i = 0; i < n; i++) s += x[i];
    for (i = 0; i < n; i++) x[i] /= s;
    return { scores: x, iters: res.length, residuals: res, bound: res[res.length - 1] / (1 - alpha) };
  }
  function ranks(scores) {
    var order = Array.from(scores.keys()).sort(function (a, b) { return scores[b] - scores[a]; });
    var r = new Int32Array(scores.length);
    order.forEach(function (i, j) { r[i] = j + 1; });
    return { order: order, rank: r };
  }

  function compute() {
    var n = G.n, v = new Float64Array(n);
    if (pr.mode === "personal" && pr.sel >= 0) v[pr.sel] = 1; else v.fill(1 / n);
    var t0 = performance.now();
    var res = pagerank(G, pr.alpha, v, 1e-12, 20000);
    res.ms = performance.now() - t0;
    var rk = ranks(res.scores);
    res.order = rk.order; res.rank = rk.rank;
    cur = res;
    renderPR();
  }

  /* ---------- map ---------- */
  var map = { W: 0, H: 0, pts: null, hover: -1 };
  var LON0 = -170, LON1 = 180, LAT0 = -56, LAT1 = 76;
  function stops() {
    var dark = matchMedia && matchMedia("(prefers-color-scheme: dark)").matches;
    return [[0, dark ? [96, 78, 196] : [64, 44, 150]], [0.35, [155, 123, 247]], [0.7, [254, 138, 93]], [1, [255, 201, 77]]];
  }
  function colorAt(t) {
    var s = stops(), i = 1;
    while (i < s.length - 1 && t > s[i][0]) i++;
    var a = s[i - 1], b = s[i], u = Math.max(0, Math.min(1, (t - a[0]) / (b[0] - a[0])));
    return "rgb(" + [0, 1, 2].map(function (j) { return Math.round(a[1][j] + u * (b[1][j] - a[1][j])); }).join(",") + ")";
  }
  function sizeMap() {
    var wrap = $("#mapWrap"), cv = $("#map");
    var W = wrap.clientWidth, H = Math.round(W * (LAT1 - LAT0) / (LON1 - LON0) * 1.05);
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    cv.style.height = H + "px";
    map.W = W; map.H = H; map.dpr = dpr;
    map.pts = G.nodes.map(function (nd) {
      return nd[4] == null ? null : [(nd[5] - LON0) / (LON1 - LON0) * W, (LAT1 - nd[4]) / (LAT1 - LAT0) * H];
    });
  }
  function drawMap() {
    if (!G || !cur) return;
    var cv = $("#map"), ctx = cv.getContext("2d"), W = map.W, H = map.H, s = cur.scores;
    ctx.setTransform(map.dpr, 0, 0, map.dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = LAB.cssVar("--surface-2");
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = LAB.cssVar("--line"); ctx.lineWidth = 1;
    for (var lon = -150; lon <= 180; lon += 30) { var x = (lon - LON0) / (LON1 - LON0) * W; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (var lat = -30; lat <= 60; lat += 30) { var y = (LAT1 - lat) / (LAT1 - LAT0) * H; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    var max = s[cur.order[0]], minPos = Infinity, i;
    for (i = 0; i < s.length; i++) if (s[i] > 0 && s[i] < minPos) minPos = s[i];
    var lmin = Math.log(Math.max(minPos, max * 1e-7)), lmax = Math.log(max);
    var scale = Math.max(0.7, W / 900);
    for (var j = cur.order.length - 1; j >= 0; j--) {
      i = cur.order[j];
      var p = map.pts[i];
      if (!p || s[i] <= 0) continue;
      var t = (Math.log(Math.max(s[i], Math.exp(lmin))) - lmin) / (lmax - lmin || 1);
      var r = (0.8 + 13 * Math.sqrt(s[i] / max)) * scale;
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = colorAt(t);
      ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, 6.2832); ctx.fill();
    }
    ctx.globalAlpha = 1;
    // labels for the top airports, skipping those too close to a label already placed
    var placed = [], ink = LAB.ink(), halo = LAB.cssVar("--surface-2");
    ctx.font = "800 " + Math.round(11 * Math.max(0.85, Math.min(scale, 1.2))) + "px Inter, sans-serif";
    ctx.lineJoin = "round";
    function label(i, color) {
      var p = map.pts[i]; if (!p) return;
      var txt = G.nodes[i][0];
      ctx.lineWidth = 3.5; ctx.strokeStyle = halo; ctx.strokeText(txt, p[0] + 6, p[1] - 6);
      ctx.fillStyle = color; ctx.fillText(txt, p[0] + 6, p[1] - 6);
    }
    for (j = 0; j < Math.min(40, cur.order.length) && placed.length < 10; j++) {
      i = cur.order[j];
      var q = map.pts[i];
      if (!q || placed.some(function (z) { return Math.hypot(z[0] - q[0], z[1] - q[1]) < 34 * scale; })) continue;
      placed.push(q); label(i, ink);
    }
    [pr.sel, map.hover].forEach(function (i2, idx) {
      if (i2 < 0 || !map.pts[i2]) return;
      var p2 = map.pts[i2], r2 = (0.8 + 13 * Math.sqrt(s[i2] / max)) * scale;
      ctx.lineWidth = idx === 0 ? 2.5 : 1.5; ctx.strokeStyle = idx === 0 ? C.orange : ink;
      ctx.beginPath(); ctx.arc(p2[0], p2[1], r2 + 4, 0, 6.2832); ctx.stroke();
      if (idx === 0) label(i2, C.orange);
    });
  }
  function nearest(mx, my) {
    var best = -1, bd = 14 * 14;
    for (var i = 0; i < map.pts.length; i++) {
      var p = map.pts[i]; if (!p) continue;
      var d = (p[0] - mx) * (p[0] - mx) + (p[1] - my) * (p[1] - my);
      if (d < bd || (d === bd && best >= 0 && cur.scores[i] > cur.scores[best])) { bd = d; best = i; }
    }
    return best;
  }

  /* ---------- table, stats, chart ---------- */
  function nodeLabel(i) { var nd = G.nodes[i]; return nd[2] ? nd[2] + ", " + nd[3] : nd[1]; }
  function renderPR() {
    var s = cur.scores;
    $("#sIters").textContent = LAB.int(cur.iters);
    $("#sBound").textContent = LAB.sci(Math.max(cur.bound, 1e-16), 1);
    $("#sTime").innerHTML = LAB.fmt(cur.ms, 0) + " <small>ms</small>";
    var rows = cur.order.slice(0, 15).map(function (i, j) {
      var d = base.rank[i] - (j + 1);
      var ch = pr.mode === "personal" ? "" : (d > 0 ? '<span class="badge-ok">▲ ' + d + "</span>" : d < 0 ? '<span class="badge-bad">▼ ' + (-d) + "</span>" : "=");
      return "<tr><td>" + (j + 1) + "</td><td><b>" + G.nodes[i][0] + "</b> " + esc(nodeLabel(i)) + '</td><td class="num">' + LAB.fmt(s[i] * 1000, 3) + "</td>" +
        (pr.mode === "personal" ? "" : '<td class="num">' + ch + "</td>") + "</tr>";
    }).join("");
    $("#topTable").innerHTML = "<thead><tr><th>#</th><th>" + LAB.t("colAirport") + '</th><th class="num">' + LAB.t("colScore") + "</th>" +
      (pr.mode === "personal" ? "" : '<th class="num">' + LAB.t("colChange") + "</th>") + "</tr></thead><tbody>" + rows + "</tbody>";
    var sub = document.querySelector('[data-i18n="topSub"]');
    if (sub) sub.textContent = pr.mode === "personal" && pr.sel >= 0 ? LAB.t("topSubPers", { code: G.nodes[pr.sel][0] }) : LAB.t("topSub");
    renderSel();
    drawMap();
    var pts = cur.residuals.map(function (r, k) { return { x: k + 1, y: Math.max(r, 1e-17) }; });
    var r0 = cur.residuals[0];
    var ref = cur.residuals.map(function (r, k) { return { x: k + 1, y: Math.max(r0 * Math.pow(pr.alpha, k), 1e-17) }; });
    var data = { datasets: [
      { label: LAB.t("residual"), data: pts, borderColor: C.orange, backgroundColor: C.orange, borderWidth: 2, pointRadius: 0 },
      { label: LAB.t("rateLine"), data: ref, borderColor: LAB.ink(), borderDash: [4, 4], borderWidth: 1.4, pointRadius: 0 }
    ] };
    if (!convChart) {
      convChart = LAB.chart($("#convChart"), { type: "line", data: data, options: {
        parsing: false, scales: { x: LAB.linAxis(LAB.t("iteration"), { min: 1 }), y: LAB.logAxis("", { min: 1e-14 }) } } });
    } else {
      convChart.data = data;
      convChart.options.scales.x.title.text = LAB.t("iteration");
      convChart.update();
    }
  }
  function renderSel() {
    var box = $("#selInfo");
    if (pr.sel < 0) { box.hidden = true; return; }
    var i = pr.sel, nd = G.nodes[i];
    box.hidden = false;
    if (pr.mode === "personal") {
      box.innerHTML = LAB.t("selPersonal", { code: nd[0], city: esc(nd[2] || nd[1]) });
    } else {
      box.innerHTML = LAB.t("selUniform", { code: nd[0], name: esc(nd[1]), city: esc(nd[2]), country: esc(nd[3]), rank: LAB.int(cur.rank[i]), n: LAB.int(G.n),
        score: LAB.sci(cur.scores[i], 2), times: LAB.fmt(cur.scores[i] * G.n, 1) }) + (nd[4] == null ? " " + LAB.t("noCoords") : "");
    }
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function select(i) {
    pr.sel = i;
    if (pr.mode === "personal") compute(); else { renderSel(); drawMap(); }
  }

  function initPR(d) {
    G = buildGraph(d);
    var v = new Float64Array(G.n).fill(1 / G.n);
    var b = pagerank(G, 0.85, v, 1e-12, 20000);
    base = ranks(b.scores);
    pr.sel = G.nodes.findIndex(function (nd) { return nd[0] === "ALG"; });
    $("#airportList").innerHTML = G.nodes.map(function (nd) { return '<option value="' + nd[0] + " · " + esc(nd[2] || nd[1]) + (nd[3] ? ", " + esc(nd[3]) : "") + '">'; }).join("");
    $("#prLoading").remove();
    sizeMap();
    compute();
    var cv = $("#map"), tip = $("#mapTip");
    function pos(ev) { var r = cv.getBoundingClientRect(); return [ev.clientX - r.left, ev.clientY - r.top]; }
    cv.addEventListener("mousemove", LAB.raf(function (ev) {
      var p = pos(ev), i = nearest(p[0], p[1]);
      if (i !== map.hover) { map.hover = i; drawMap(); }
      if (i < 0) { tip.hidden = true; cv.style.cursor = "default"; return; }
      cv.style.cursor = "pointer";
      tip.hidden = false;
      tip.textContent = G.nodes[i][0] + " · " + nodeLabel(i) + " · #" + cur.rank[i];
      tip.style.left = map.pts[i][0] + "px"; tip.style.top = map.pts[i][1] + "px";
    }));
    cv.addEventListener("mouseleave", function () { map.hover = -1; tip.hidden = true; drawMap(); });
    cv.addEventListener("click", function (ev) { var p = pos(ev), i = nearest(p[0], p[1]); if (i >= 0) select(i); });
    window.addEventListener("resize", LAB.debounce(function () { sizeMap(); drawMap(); }, 150));
  }

  $("#alpha").addEventListener("input", LAB.raf(function () {
    pr.alpha = +$("#alpha").value;
    $("#alphaOut").textContent = LAB.fmt(pr.alpha, 2);
    if (G) compute();
  }));
  LAB.seg($("#mode"), function (v) { pr.mode = v; if (G) compute(); });
  $("#search").addEventListener("change", function () {
    var q = $("#search").value.trim().toLowerCase();
    if (!q || !G) return;
    var code = q.slice(0, 3).toUpperCase(), i = G.nodes.findIndex(function (nd) { return nd[0] === code; });
    if (i < 0) i = G.nodes.findIndex(function (nd) { return (nd[2] || "").toLowerCase().indexOf(q) === 0 || (nd[1] || "").toLowerCase().indexOf(q) >= 0; });
    if (i >= 0) { select(i); $("#search").value = ""; }
  });

  fetch("/lab/markov-pagerank/data/airports.json").then(function (r) { return r.json(); }).then(initPR).catch(function (e) {
    $("#prLoading").textContent = "Could not load the data: " + e.message;
  });

  /* ======================================================================
     Ehrenfest urn simulation
     ====================================================================== */
  var E = { N: 20, lazy: false, running: true, sps: 20, balls: null, k: 0, steps: 0, visits: null, last: -1, acc: 0, hist: [], nextMark: 10 };
  var rand = LAB.rng(2026);
  var freqChart = null, tvChart = null;

  function binom(N) {
    var out = [], lf = [0];
    for (var i = 1; i <= N; i++) lf[i] = lf[i - 1] + Math.log(i);
    for (var k = 0; k <= N; k++) out.push(Math.exp(lf[N] - lf[k] - lf[N - k] - N * Math.LN2));
    return out;
  }
  function eReset() {
    E.N = +$("#eN").value; E.lazy = $("#eLazy").checked;
    E.balls = new Uint8Array(E.N); E.k = 0; E.steps = 0; E.last = -1; E.acc = 0;
    E.visits = new Float64Array(E.N + 1); E.visits[0] = 1;
    E.pi = binom(E.N); E.hist = []; E.nextMark = 10;
    $("#eNOut").textContent = E.N;
    eDraw(true);
  }
  function eStep() {
    if (!(E.lazy && rand() < 0.5)) {
      var b = Math.floor(rand() * E.N);
      E.balls[b] ^= 1; E.k += E.balls[b] ? 1 : -1; E.last = b;
    }
    E.steps++; E.visits[E.k] += 1;
    if (E.steps >= E.nextMark) { E.hist.push({ x: E.steps, y: eTV() }); E.nextMark = Math.ceil(E.nextMark * 1.15); }
  }
  function eTV() {
    var tot = E.steps + 1, s = 0;
    for (var k = 0; k <= E.N; k++) s += Math.abs(E.visits[k] / tot - E.pi[k]);
    return s / 2;
  }
  function eDrawUrns() {
    var cv = $("#urns"), W = cv.parentNode.clientWidth, H = Math.round(Math.min(280, Math.max(200, W * 0.36)));
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.height = H + "px"; }
    var ctx = cv.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    var gap = 18, uw = (W - gap) / 2, top = 34, uh = H - top - 6;
    var ink = LAB.ink();
    [0, 1].forEach(function (u) {
      var x0 = u * (uw + gap);
      ctx.fillStyle = LAB.cssVar("--surface-2");
      roundRect(ctx, x0, top, uw, uh, 18); ctx.fill();
      ctx.fillStyle = ink; ctx.font = "800 15px Inter, sans-serif";
      var cnt = u === 0 ? E.k : E.N - E.k;
      ctx.fillText((u === 0 ? "A" : "B") + "  ·  " + cnt, x0 + 4, 22);
      // balls of this urn
      var ids = [];
      for (var b = 0; b < E.N; b++) if ((E.balls[b] === 1) === (u === 0)) ids.push(b);
      var rr = 22, cols;
      while (rr > 3) {
        cols = Math.max(1, Math.floor((uw - 24) / (2 * rr + 5)));
        if (Math.ceil(E.N / cols) * (2 * rr + 5) <= uh - 24) break;
        rr -= 1;
      }
      cols = Math.max(1, Math.floor((uw - 24) / (2 * rr + 5)));
      ids.forEach(function (b, j) {
        var cx = x0 + 14 + rr + (j % cols) * (2 * rr + 5), cy = top + uh - 14 - rr - Math.floor(j / cols) * (2 * rr + 5);
        ctx.fillStyle = b === E.last && E.sps <= 60 ? C.orange : (u === 0 ? C.purple : LAB.cssVar("--grey") || C.grey);
        ctx.beginPath(); ctx.arc(cx, cy, rr, 0, 6.2832); ctx.fill();
      });
    });
  }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  var lastChart = 0;
  function eDraw(force) {
    eDrawUrns();
    $("#eSteps").textContent = LAB.int(E.steps);
    $("#eK").textContent = E.k;
    var now = performance.now();
    if (!force && now - lastChart < 120) return;
    lastChart = now;
    var tv = eTV();
    $("#eTV").textContent = LAB.sci(tv, 2);
    var labels = [], fr = [], tot = E.steps + 1;
    for (var k = 0; k <= E.N; k++) { labels.push(k); fr.push(E.visits[k] / tot); }
    var fdata = { labels: labels, datasets: [
      { type: "bar", label: LAB.t("freq"), data: fr, backgroundColor: "rgba(155,123,247,.55)", borderRadius: 4 },
      { type: "line", label: LAB.t("piBin"), data: E.pi, borderColor: C.orange, backgroundColor: C.orange, pointRadius: 2.5, borderWidth: 2 }
    ] };
    if (!freqChart) freqChart = LAB.chart($("#freqChart"), { type: "bar", data: fdata, options: { scales: { x: { title: { display: true, text: LAB.t("kAxis") }, grid: { display: false } }, y: LAB.linAxis("", { min: 0 }) } } });
    else { freqChart.data = fdata; freqChart.options.scales.x.title.text = LAB.t("kAxis"); freqChart.update(); }
    var pts = E.hist.slice();
    var refPts = [];
    if (pts.length) {
      var lp = pts[pts.length - 1], cst = lp.y * Math.sqrt(lp.x);
      refPts = pts.map(function (p) { return { x: p.x, y: cst / Math.sqrt(p.x) }; });
    }
    var tdata = { datasets: [
      { label: LAB.t("tvAxis"), data: pts, borderColor: C.purple, backgroundColor: C.purple, pointRadius: 0, borderWidth: 2 },
      { label: LAB.t("sqrtRef"), data: refPts, borderColor: LAB.ink(), borderDash: [4, 4], pointRadius: 0, borderWidth: 1.3 }
    ] };
    if (!tvChart) tvChart = LAB.chart($("#tvChart"), { type: "line", data: tdata, options: { parsing: false, scales: { x: LAB.logAxis(LAB.t("nAxis"), { min: 10 }), y: LAB.logAxis("") } } });
    else { tvChart.data = tdata; tvChart.options.scales.x.title.text = LAB.t("nAxis"); tvChart.update(); }
  }
  var prevT = 0;
  function eLoop(t) {
    if (E.running && !document.getElementById("eN").closest(".tab-panel").hidden) {
      var dt = prevT ? Math.min(0.1, (t - prevT) / 1000) : 0;
      E.acc += dt * E.sps;
      var n = Math.min(50000, Math.floor(E.acc));
      E.acc -= n;
      for (var i = 0; i < n; i++) eStep();
      if (n) eDraw();
    }
    prevT = t;
    requestAnimationFrame(eLoop);
  }
  function setSpeed() {
    var v = +$("#eSpeed").value;
    E.sps = Math.max(1, Math.round(Math.pow(10, v / 100 * 4.3)));
    $("#eSpeedOut").textContent = LAB.int(E.sps);
  }
  $("#eN").addEventListener("input", eReset);
  $("#eLazy").addEventListener("change", eReset);
  $("#eSpeed").addEventListener("input", setSpeed);
  $("#eReset").addEventListener("click", eReset);
  $("#eJump").addEventListener("click", function () { for (var i = 0; i < 100000; i++) eStep(); eDraw(true); });
  $("#ePlay").addEventListener("click", function () {
    E.running = !E.running;
    $("#ePlay").setAttribute("data-i18n", E.running ? "pause" : "play");
    $("#ePlay").textContent = LAB.t(E.running ? "pause" : "play");
  });

  /* ======================================================================
     Spectral gap: exact distributions of tridiagonal chains
     ====================================================================== */
  var gp = { chain: "cycle", size: 20, n: 10 };
  var gapChart = null, distChart = null, gres = null;

  function chainDef(kind, size) {
    var n, stay = [], up = [], down = [], wrap = false, pi, lam;
    if (kind === "cycle") {
      n = size; wrap = true;
      for (var i = 0; i < n; i++) { stay.push(0.5); up.push(0.25); down.push(0.25); }
      pi = new Array(n).fill(1 / n);
      lam = Math.pow(Math.cos(Math.PI / n), 2);
    } else {
      var N = size, lazy = kind === "lazyE";
      n = N + 1;
      for (var k = 0; k <= N; k++) {
        var u = (N - k) / N, d = k / N;
        if (lazy) { stay.push(0.5); up.push(u / 2); down.push(d / 2); } else { stay.push(0); up.push(u); down.push(d); }
      }
      pi = binom(N);
      lam = lazy ? 1 - 1 / N : 1;
    }
    return { n: n, stay: stay, up: up, down: down, wrap: wrap, pi: pi, lam: lam };
  }
  function stepDist(c, mu) {
    var n = c.n, nu = new Float64Array(n);
    for (var i = 0; i < n; i++) {
      var m = mu[i]; if (!m) continue;
      nu[i] += c.stay[i] * m;
      var r = i + 1, l = i - 1;
      if (c.wrap) { r %= n; l = (l + n) % n; }
      if (r < n) nu[r] += c.up[i] * m;
      if (l >= 0) nu[l] += c.down[i] * m;
    }
    return nu;
  }
  function tv(a, b) { var s = 0; for (var i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]); return s / 2; }

  function gCompute() {
    var c = chainDef(gp.chain, gp.size);
    var nMax = gp.chain === "cycle" ? Math.min(80000, 14 * gp.size * gp.size) : gp.chain === "lazyE" ? 45 * gp.size : 200;
    var mu = new Float64Array(c.n); mu[0] = 1;
    var dists = [mu], d = [tv(mu, c.pi)];
    for (var k = 1; k <= nMax; k++) {
      mu = stepDist(c, mu);
      d.push(tv(mu, c.pi));
      if (k <= 2000) dists.push(mu);
      if (d[k] < 1e-15 && k > 50) break;
    }
    var tmix = d.findIndex(function (x) { return x <= 0.25; });
    // measured rate on the tail (between 1e-2 and 1e-12)
    var rate = null;
    if (gp.chain !== "plainE") {
      var xs = [], ys = [];
      d.forEach(function (v, i) { if (v < 1e-2 && v > 1e-12) { xs.push(i); ys.push(Math.log(v)); } });
      if (xs.length > 5) {
        var h = Math.floor(xs.length / 3);
        xs = xs.slice(h); ys = ys.slice(h);
        var mx = xs.reduce(function (a, b) { return a + b; }) / xs.length, my = ys.reduce(function (a, b) { return a + b; }) / ys.length, num = 0, den = 0;
        for (var j = 0; j < xs.length; j++) { num += (xs[j] - mx) * (ys[j] - my); den += (xs[j] - mx) * (xs[j] - mx); }
        rate = Math.exp(num / den);
      }
    }
    gres = { c: c, d: d, dists: dists, tmix: tmix, rate: rate };
    var stepIn = $("#gStep");
    stepIn.max = Math.min(dists.length - 1, Math.max(20, tmix > 0 ? tmix * 3 : 200));
    if (+stepIn.value > +stepIn.max) stepIn.value = stepIn.max;
    gp.n = +stepIn.value;
    gRender();
  }
  function gRender() {
    var r = gres, c = r.c;
    $("#gLam").textContent = gp.chain === "plainE" ? LAB.t("period2") : LAB.fmt(c.lam, 6);
    $("#gRate").textContent = r.rate == null ? LAB.t("noConv") : LAB.fmt(r.rate, 6);
    $("#gMix").textContent = r.tmix < 0 ? "∞" : LAB.int(r.tmix);
    $("#gSizeOut").textContent = gp.size;
    $("#gSizeLabel").textContent = LAB.t(gp.chain === "cycle" ? "sizeM" : "sizeN");
    $("#gStepOut").textContent = gp.n;
    var stride = Math.max(1, Math.floor(r.d.length / 700));
    var pts = [], bnd = [];
    var piStart = c.pi[0];
    for (var i = 0; i < r.d.length; i += stride) {
      pts.push({ x: i, y: Math.max(r.d[i], 1e-17) });
      if (gp.chain !== "plainE") {
        var b = 0.5 * Math.sqrt((1 - piStart) / piStart) * Math.pow(c.lam, i);
        if (b < 10) bnd.push({ x: i, y: Math.max(b, 1e-17) });
      }
    }
    var data = { datasets: [
      { label: LAB.t("exact"), data: pts, borderColor: C.orange, backgroundColor: C.orange, borderWidth: 2.2, pointRadius: 0 },
      { label: LAB.t("specBound"), data: bnd, borderColor: LAB.ink(), borderDash: [5, 5], borderWidth: 1.3, pointRadius: 0 }
    ] };
    if (!gapChart) gapChart = LAB.chart($("#gapChart"), { type: "line", data: data, options: { parsing: false, scales: { x: LAB.linAxis("n", { min: 0 }), y: LAB.logAxis("", { min: 1e-14, max: 2 }) } } });
    else { gapChart.data = data; gapChart.update(); }
    var mu = r.dists[Math.min(gp.n, r.dists.length - 1)];
    var labels = Array.from({ length: c.n }, function (_, i) { return i; });
    var dd = { labels: labels, datasets: [
      { type: "bar", label: LAB.t("muN").replace("ₙ", "") + "(" + gp.n + ")", data: Array.from(mu), backgroundColor: "rgba(254,138,93,.6)", borderRadius: 3 },
      { type: "line", label: LAB.t("piLbl"), data: c.pi, borderColor: C.purple, backgroundColor: C.purple, pointRadius: 2, borderWidth: 2 }
    ] };
    if (!distChart) distChart = LAB.chart($("#distChart"), { type: "bar", data: dd, options: { scales: { x: { title: { display: true, text: LAB.t("state") }, grid: { display: false } }, y: LAB.linAxis("", { min: 0 }) } } });
    else { distChart.data = dd; distChart.options.scales.x.title.text = LAB.t("state"); distChart.update(); }
  }
  LAB.seg($("#gChain"), function (v) { gp.chain = v; gCompute(); });
  $("#gSize").addEventListener("input", LAB.raf(function () { gp.size = +$("#gSize").value; gCompute(); }));
  $("#gStep").addEventListener("input", LAB.raf(function () { gp.n = +$("#gStep").value; gRender(); }));

  /* exposed for automated checks */
  LAB.debug = LAB.debug || {};
  LAB.debug.pagerank = function () { return cur ? { scores: Array.from(cur.scores), iters: cur.iters } : null; };

  /* ---------- start ---------- */
  var started = { ehrenfest: false, gap: false };
  LAB.tabs(document.querySelector(".tabs"), function (id) {
    if (id === "ehrenfest" && !started.ehrenfest) { started.ehrenfest = true; setSpeed(); eReset(); requestAnimationFrame(eLoop); }
    if (id === "ehrenfest") setTimeout(function () { eDraw(true); }, 0);
    if (id === "gap" && !started.gap) { started.gap = true; gCompute(); }
    if (id === "pagerank" && G) setTimeout(function () { sizeMap(); drawMap(); }, 0);
  });
  LAB.onLang(function () {
    $("#ePlay").textContent = LAB.t(E.running ? "pause" : "play");
    $("#alphaOut").textContent = LAB.fmt(pr.alpha, 2);
    if (cur) {
      renderPR();
      if (convChart) { convChart.data.datasets[0].label = LAB.t("residual"); convChart.data.datasets[1].label = LAB.t("rateLine"); convChart.update(); }
    }
    if (freqChart) eDraw(true);
    if (gres) { gapChart.data.datasets[0].label = LAB.t("exact"); gapChart.data.datasets[1].label = LAB.t("specBound"); gRender(); }
  });
})();
