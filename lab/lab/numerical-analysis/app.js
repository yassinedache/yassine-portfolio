/* Numerical analysis: live demo (JavaScript port of the numlab package). */
(function () {
  "use strict";
  var C = LAB.colors, $ = function (s) { return document.querySelector(s); };

  LAB.register({
    en: {
      pageTitle: "Numerical analysis", kicker: "Numerical analysis · Python", title: "Numerical analysis <em>lab</em>",
      lead: "Classic numerical methods, each with its convergence order measured live and compared with the theory.",
      tab1: "Root finding", tab2: "Integration", tab3: "Differential equations", tab4: "Interpolation", tab5: "Monte Carlo",
      equation: "Equation f(x) = 0", start: "Starting point x₀ (Newton, fixed point)",
      rInfo: "Root r = {r} · bisection on [{a}, {b}] · fixed point {g} · secant from {s0} and x₀",
      errTitle: "Error |xₙ − r| at each iteration", errSub: "Straight lines on this log scale mean linear convergence; curves that plunge mean superlinear convergence.",
      newtonTitle: "Newton's method follows the tangents", newtonSub: "xₙ₊₁ is where the tangent at xₙ crosses the axis. Move x₀ to see where it fails.",
      iteration: "iteration n", method: "Method", iterations: "Iterations", measured: "Measured order", theory: "Theory",
      bisection: "Bisection", fixed: "Fixed point", secant: "Secant", newton: "Newton", rate: "rate", failed: "fails", diverged: "diverges", zeroDeriv: "f′(xₙ) = 0",
      tangents: "Newton steps", fx: "f(x)",
      rNote: "<p><b>Order of convergence.</b> If eₙ₊₁ ≈ C·eₙ<sup>q</sup>, the method has order q. Bisection halves the interval (order 1, rate 1/2), the fixed-point iteration converges at rate |g′(r)|, Newton doubles the number of correct digits at each step (order 2), and the secant method reaches the golden ratio (1 + √5)/2 ≈ 1.618 without computing any derivative. The measured order uses q ≈ log(eₙ₊₁/eₙ) / log(eₙ/eₙ₋₁).</p>",
      integral: "Integral", rule: "Rule shown", mid: "Midpoint", trap: "Trapezoid", subint: "Sub-intervals n", estimate: "Estimate", error: "Error",
      areaTitle: "The area the rule actually computes", qErrTitle: "Error against the number of sub-intervals", qErrSub: "The slope on this log-log plot is the order of the rule.",
      slope: "slope", gl: "Gauss–Legendre (n nodes)", nAxis: "n", ruleArea: "area computed by the rule",
      qNote: "<p><b>Orders.</b> Midpoint and trapezoid rules have error O(h²), Simpson's rule O(h⁴), with h = (b − a)/n. Gauss–Legendre with n nodes is exact for polynomials of degree 2n − 1 and, for smooth functions, its error falls faster than any power of 1/n. Choose √x: its derivative blows up at 0, and every rule loses its order (the slopes drop to about −1.5).</p>",
      stepH: "Step h", horizon: "Final time T", methods: "Methods", driftE: "Drift of V, Euler", driftR: "Drift of V, RK4",
      phaseTitle: "Predators and prey (Lotka–Volterra)", phaseSub: "The exact orbit is closed. Euler spirals outwards; RK4 stays on the cycle.",
      driftTitle: "Drift of the conserved quantity V(x, y)", driftSub: "V = δx − γ ln x + βy − α ln y is constant along the true solution.",
      prey: "prey x", predators: "predators y", time: "time t", relDrift: "|V(t) − V(0)| / V(0)",
      ordTitle: "Measured orders on y′ = −2ty, y(0) = 1", ordSub: "Error at t = 2 against the exact solution e^(−t²), halving h each time.",
      over: "over",
      oNote: "<p><b>One-step methods.</b> Euler uses the slope at the start of the step (global error O(h)); Heun averages two slopes (O(h²)); the classical Runge–Kutta method combines four (O(h⁴)). On the predator–prey model, the small errors of Euler always push the solution outwards, so the conserved quantity drifts: increase h and watch the spiral.</p>",
      function: "Function", degree: "Polynomial degree n", errEq: "Max error, equally spaced", errCh: "Max error, Chebyshev",
      interpTitle: "Interpolating polynomials of degree n", interpErrTitle: "Maximum error on [−1, 1] against the degree",
      fLbl: "f(x)", eqLbl: "equally spaced nodes", chLbl: "Chebyshev nodes", deg: "degree n",
      iNote: "<p><b>The Runge phenomenon.</b> Interpolating 1/(1 + 25x²) at equally spaced points makes the error explode near the ends of the interval as the degree grows. Chebyshev nodes, the projections of equally spaced points on a half circle, cluster near ±1 and make the error decrease geometrically. The polynomials are evaluated with the barycentric Lagrange formula, which is numerically stable.</p>",
      speedPts: "Points per second", pause: "Pause", play: "Play", jumpPts: "+ 1,000,000 points", reset: "Reset", ptsN: "Points N", piEst: "Estimate of π", ci: "95 % interval ±",
      dartsTitle: "Random points in the unit square", dartsSub: "The fraction inside the quarter disc tends to π/4.",
      mcErrTitle: "Error against N", mcErrSub: "The 95 % interval shrinks exactly like 1/√N.", absErr: "|estimate − π|", ciLbl: "95 % interval half-width", nPts: "N",
      mNote: "<p><b>Monte Carlo.</b> Each point falls in the quarter disc with probability π/4, so 4 × (fraction inside) is an unbiased estimate of π. By the central limit theorem its error is about 1.96·4·√(p(1 − p)/N) with 95 % confidence: to gain one digit you need a hundred times more points. Slow, but independent of the dimension, which is why Monte Carlo wins for integrals in many dimensions.</p>"
    },
    fr: {
      pageTitle: "Analyse numérique", kicker: "Analyse numérique · Python", title: "Laboratoire d'analyse <em>numérique</em>",
      lead: "Les méthodes numériques classiques, avec leur ordre de convergence mesuré en direct et comparé à la théorie.",
      tab1: "Équations f(x) = 0", tab2: "Intégration", tab3: "Équations différentielles", tab4: "Interpolation", tab5: "Monte-Carlo",
      equation: "Équation f(x) = 0", start: "Point de départ x₀ (Newton, point fixe)",
      rInfo: "Racine r = {r} · dichotomie sur [{a}, {b}] · point fixe {g} · sécante depuis {s0} et x₀",
      errTitle: "Erreur |xₙ − r| à chaque itération", errSub: "Une droite en échelle log signifie une convergence linéaire ; une courbe qui plonge, une convergence superlinéaire.",
      newtonTitle: "La méthode de Newton suit les tangentes", newtonSub: "xₙ₊₁ est le point où la tangente en xₙ coupe l'axe. Déplacez x₀ pour la voir échouer.",
      iteration: "itération n", method: "Méthode", iterations: "Itérations", measured: "Ordre mesuré", theory: "Théorie",
      bisection: "Dichotomie", fixed: "Point fixe", secant: "Sécante", newton: "Newton", rate: "taux", failed: "échoue", diverged: "diverge", zeroDeriv: "f′(xₙ) = 0",
      tangents: "pas de Newton", fx: "f(x)",
      rNote: "<p><b>Ordre de convergence.</b> Si eₙ₊₁ ≈ C·eₙ<sup>q</sup>, la méthode est d'ordre q. La dichotomie divise l'intervalle par deux (ordre 1, taux 1/2), le point fixe converge au taux |g′(r)|, Newton double le nombre de chiffres exacts à chaque pas (ordre 2), et la sécante atteint le nombre d'or (1 + √5)/2 ≈ 1,618 sans calculer de dérivée. L'ordre mesuré utilise q ≈ log(eₙ₊₁/eₙ) / log(eₙ/eₙ₋₁).</p>",
      integral: "Intégrale", rule: "Méthode affichée", mid: "Point milieu", trap: "Trapèzes", subint: "Sous-intervalles n", estimate: "Valeur approchée", error: "Erreur",
      areaTitle: "L'aire réellement calculée par la méthode", qErrTitle: "Erreur en fonction du nombre de sous-intervalles", qErrSub: "La pente en échelle log-log est l'ordre de la méthode.",
      slope: "pente", gl: "Gauss–Legendre (n nœuds)", nAxis: "n", ruleArea: "aire calculée par la méthode",
      qNote: "<p><b>Ordres.</b> Les méthodes du point milieu et des trapèzes ont une erreur en O(h²), Simpson en O(h⁴), avec h = (b − a)/n. Gauss–Legendre à n nœuds est exacte pour les polynômes de degré 2n − 1 et, pour une fonction régulière, son erreur décroît plus vite que toute puissance de 1/n. Choisissez √x : sa dérivée explose en 0, et toutes les méthodes perdent leur ordre (les pentes tombent vers −1,5).</p>",
      stepH: "Pas h", horizon: "Temps final T", methods: "Méthodes", driftE: "Dérive de V, Euler", driftR: "Dérive de V, RK4",
      phaseTitle: "Proies et prédateurs (Lotka–Volterra)", phaseSub: "L'orbite exacte est fermée. Euler part en spirale ; RK4 reste sur le cycle.",
      driftTitle: "Dérive de la quantité conservée V(x, y)", driftSub: "V = δx − γ ln x + βy − α ln y est constante le long de la vraie solution.",
      prey: "proies x", predators: "prédateurs y", time: "temps t", relDrift: "|V(t) − V(0)| / V(0)",
      ordTitle: "Ordres mesurés sur y′ = −2ty, y(0) = 1", ordSub: "Erreur en t = 2 par rapport à la solution exacte e^(−t²), en divisant h par deux à chaque fois.",
      over: "sur",
      oNote: "<p><b>Méthodes à un pas.</b> Euler utilise la pente au début du pas (erreur globale O(h)) ; Heun moyenne deux pentes (O(h²)) ; la méthode de Runge–Kutta classique en combine quatre (O(h⁴)). Sur le modèle proies-prédateurs, les petites erreurs d'Euler poussent toujours la solution vers l'extérieur et la quantité conservée dérive : augmentez h et regardez la spirale.</p>",
      function: "Fonction", degree: "Degré du polynôme n", errEq: "Erreur max, nœuds équidistants", errCh: "Erreur max, Tchebychev",
      interpTitle: "Polynômes d'interpolation de degré n", interpErrTitle: "Erreur maximale sur [−1, 1] selon le degré",
      fLbl: "f(x)", eqLbl: "nœuds équidistants", chLbl: "nœuds de Tchebychev", deg: "degré n",
      iNote: "<p><b>Le phénomène de Runge.</b> Interpoler 1/(1 + 25x²) en des points équidistants fait exploser l'erreur aux extrémités de l'intervalle quand le degré augmente. Les nœuds de Tchebychev, projections de points équirépartis sur un demi-cercle, se concentrent près de ±1 et font décroître l'erreur géométriquement. Les polynômes sont évalués par la formule barycentrique de Lagrange, numériquement stable.</p>",
      speedPts: "Points par seconde", pause: "Pause", play: "Lecture", jumpPts: "+ 1 000 000 points", reset: "Réinitialiser", ptsN: "Points N", piEst: "Valeur approchée de π", ci: "Intervalle à 95 % ±",
      dartsTitle: "Points aléatoires dans le carré unité", dartsSub: "La proportion dans le quart de disque tend vers π/4.",
      mcErrTitle: "Erreur en fonction de N", mcErrSub: "L'intervalle à 95 % se resserre exactement en 1/√N.", absErr: "|valeur approchée − π|", ciLbl: "demi-largeur de l'intervalle à 95 %", nPts: "N",
      mNote: "<p><b>Monte-Carlo.</b> Chaque point tombe dans le quart de disque avec probabilité π/4, donc 4 × (proportion à l'intérieur) estime π sans biais. Par le théorème central limite, l'erreur vaut environ 1,96·4·√(p(1 − p)/N) avec 95 % de confiance : pour gagner un chiffre, il faut cent fois plus de points. Lent, mais indépendant de la dimension, d'où son intérêt pour les intégrales en grande dimension.</p>"
    }
  });

  function slopeOf(xs, ys) {
    var n = xs.length, mx = 0, my = 0, num = 0, den = 0, i;
    for (i = 0; i < n; i++) { mx += xs[i]; my += ys[i]; }
    mx /= n; my /= n;
    for (i = 0; i < n; i++) { num += (xs[i] - mx) * (ys[i] - my); den += (xs[i] - mx) * (xs[i] - mx); }
    return num / den;
  }
  function upd(chart, data, opts) { chart.data = data; if (opts) opts(chart.options); chart.update(); }

  /* ======================================================================
     Root finding
     ====================================================================== */
  var FUN = [
    { label: "cos x − x = 0", f: function (x) { return Math.cos(x) - x; }, df: function (x) { return -Math.sin(x) - 1; }, g: Math.cos, gl: "x = cos x", a: 0, b: 1, x0: 1, range: [-0.5, 2.5] },
    { label: "x³ − 2x − 5 = 0", f: function (x) { return x * x * x - 2 * x - 5; }, df: function (x) { return 3 * x * x - 2; }, g: function (x) { return Math.cbrt(2 * x + 5); }, gl: "x = ∛(2x + 5)", a: 2, b: 3, x0: 2, range: [-1.5, 4] },
    { label: "e⁻ˣ − x = 0", f: function (x) { return Math.exp(-x) - x; }, df: function (x) { return -Math.exp(-x) - 1; }, g: function (x) { return Math.exp(-x); }, gl: "x = e⁻ˣ", a: 0, b: 1, x0: 1, range: [-1, 3] },
    { label: "x² − 2 = 0", f: function (x) { return x * x - 2; }, df: function (x) { return 2 * x; }, g: function (x) { return x - (x * x - 2) / 3; }, gl: "x = x − (x² − 2)/3", a: 1, b: 2, x0: 1, range: [-1, 3] }
  ];
  FUN.forEach(function (F) {   // reference root: bisection down to machine precision
    var a = F.a, b = F.b, fa = F.f(a);
    for (var i = 0; i < 200; i++) { var m = (a + b) / 2, fm = F.f(m); if (fa * fm <= 0) b = m; else { a = m; fa = fm; } }
    F.root = (a + b) / 2;
  });
  var rs = { fun: 0, x0: 1 }, rCharts = {};

  function bisection(f, a, b, tol) {
    var fa = f(a), it = [];
    for (var k = 0; k < 200; k++) {
      var m = (a + b) / 2; it.push(m);
      var fm = f(m);
      if (fm === 0 || (b - a) / 2 < tol) return { it: it, ok: true };
      if (fa * fm < 0) b = m; else { a = m; fa = fm; }
    }
    return { it: it, ok: false };
  }
  function fixedPoint(g, x0, tol) {
    var x = x0, it = [];
    for (var k = 0; k < 500; k++) {
      var xn = g(x); it.push(xn);
      if (!isFinite(xn) || Math.abs(xn) > 1e8) return { it: it, ok: false, why: "diverged" };
      if (Math.abs(xn - x) < tol) return { it: it, ok: true };
      x = xn;
    }
    return { it: it, ok: false, why: "diverged" };
  }
  function newton(f, df, x0, tol) {
    var x = x0, it = [];
    for (var k = 0; k < 100; k++) {
      var d = df(x);
      if (d === 0) return { it: it, ok: false, why: "zeroDeriv" };
      var xn = x - f(x) / d; it.push(xn);
      if (!isFinite(xn) || Math.abs(xn) > 1e8) return { it: it, ok: false, why: "diverged" };
      if (Math.abs(xn - x) < tol) return { it: it, ok: true };
      x = xn;
    }
    return { it: it, ok: false, why: "diverged" };
  }
  function secant(f, x0, x1, tol) {
    var it = [], f0 = f(x0), f1 = f(x1);
    for (var k = 0; k < 100; k++) {
      if (f1 === f0) break;
      var x2 = x1 - f1 * (x1 - x0) / (f1 - f0); it.push(x2);
      if (!isFinite(x2) || Math.abs(x2) > 1e8) return { it: it, ok: false, why: "diverged" };
      if (Math.abs(x2 - x1) < tol) return { it: it, ok: true };
      x0 = x1; f0 = f1; x1 = x2; f1 = f(x2);
    }
    return { it: it, ok: false, why: "diverged" };
  }
  function measuredOrder(errs, linear) {
    var e = errs.filter(function (x) { return x > 1e-13; });
    if (e.length < 3) return null;
    if (linear) {
      var ks = e.map(function (_, i) { return i; }), ls = e.map(Math.log);
      return { linear: true, rate: Math.exp(slopeOf(ks, ls)) };
    }
    var n = e.length;
    return { linear: false, q: Math.log(e[n - 1] / e[n - 2]) / Math.log(e[n - 2] / e[n - 3]) };
  }

  function initRoots() {
    $("#rFun").innerHTML = FUN.map(function (F, i) { return '<option value="' + i + '">' + F.label + "</option>"; }).join("");
    $("#rFun").addEventListener("change", function () { rs.fun = +this.value; var F = FUN[rs.fun]; rs.x0 = F.x0; setX0Range(); renderRoots(); });
    $("#rX0").addEventListener("input", LAB.raf(function () { rs.x0 = +$("#rX0").value; renderRoots(); }));
    setX0Range(); renderRoots();
  }
  function setX0Range() {
    var F = FUN[rs.fun], el = $("#rX0");
    el.min = F.range[0]; el.max = F.range[1]; el.value = rs.x0;
  }
  function renderRoots() {
    var F = FUN[rs.fun], r = F.root, tol = 1e-12;
    $("#rX0Out").textContent = LAB.fmt(rs.x0, 2);
    var gp = (F.g(r + 1e-6) - F.g(r - 1e-6)) / 2e-6;
    $("#rInfo").textContent = LAB.t("rInfo", { r: LAB.fmt(r, 12), a: LAB.fmt(F.a, 0), b: LAB.fmt(F.b, 0), g: F.gl, s0: LAB.fmt(rs.x0 - (F.b - F.a), 2) });
    var runs = [
      { key: "bisection", res: bisection(F.f, F.a, F.b, tol), color: LAB.cssVar("--grey") || C.grey, linear: true, theory: "1 (" + LAB.t("rate") + " 1/2)" },
      { key: "fixed", res: fixedPoint(F.g, rs.x0, tol), color: C.purple, linear: true, theory: Math.abs(gp) < 1 ? "1 (" + LAB.t("rate") + " " + LAB.fmt(Math.abs(gp), 3) + ")" : "|g′(r)| = " + LAB.fmt(Math.abs(gp), 2) + " > 1" },
      { key: "secant", res: secant(F.f, rs.x0 - (F.b - F.a), rs.x0, tol), color: C.orange, linear: false, theory: "1.618" },
      { key: "newton", res: newton(F.f, F.df, rs.x0, tol), color: LAB.ink(), linear: false, theory: "2" }
    ];
    var ds = [], rows = [];
    runs.forEach(function (R) {
      var errs = R.res.it.map(function (x) { return Math.abs(x - r); });
      var conv = R.res.ok && errs.length && errs[errs.length - 1] < 1e-8;
      ds.push({ label: LAB.t(R.key), data: errs.map(function (e, i) { return { x: i + 1, y: Math.min(Math.max(e, 1e-17), 1e3) }; }),
        borderColor: R.color, backgroundColor: R.color, pointRadius: 2.5, borderWidth: 2 });
      var mo = conv ? measuredOrder(errs, R.linear) : null;
      var meas = !conv ? '<span class="badge-bad">' + LAB.t(R.res.why === "zeroDeriv" ? "zeroDeriv" : (R.res.ok ? "failed" : "diverged")) + "</span>"
        : !mo ? "–" : mo.linear ? "1 (" + LAB.t("rate") + " " + LAB.fmt(mo.rate, 3) + ")" : LAB.fmt(mo.q, 2);
      rows.push("<tr><td>" + '<span class="dot" style="background:' + R.color + '"></span>' + LAB.t(R.key) + '</td><td class="num">' + R.res.it.length + '</td><td class="num">' + meas + '</td><td class="num">' + R.theory.replace(".", LAB.lang === "fr" ? "," : ".") + "</td></tr>");
    });
    $("#rTable").innerHTML = "<thead><tr><th>" + LAB.t("method") + '</th><th class="num">' + LAB.t("iterations") + '</th><th class="num">' + LAB.t("measured") + '</th><th class="num">' + LAB.t("theory") + "</th></tr></thead><tbody>" + rows.join("") + "</tbody>";
    var data = { datasets: ds };
    if (!rCharts.err) rCharts.err = LAB.chart($("#rChart"), { type: "line", data: data, options: { parsing: false, scales: { x: LAB.linAxis(LAB.t("iteration"), { min: 1 }), y: LAB.logAxis("", { min: 1e-16, max: 10 }) } } });
    else upd(rCharts.err, data, function (o) { o.scales.x.title.text = LAB.t("iteration"); });
    // function plot with Newton tangents
    var lo = F.range[0], hi = F.range[1], curve = [], fmin = Infinity, fmax = -Infinity;
    for (var i = 0; i <= 200; i++) { var x = lo + (hi - lo) * i / 200, y = F.f(x); curve.push({ x: x, y: y }); fmin = Math.min(fmin, y); fmax = Math.max(fmax, y); }
    var pad = (fmax - fmin) * 0.08;
    var tang = [], xk = rs.x0;
    for (var k = 0; k < 5; k++) {
      var d = F.df(xk); if (d === 0) break;
      var xn = xk - F.f(xk) / d;
      if (!isFinite(xn)) break;
      tang.push({ x: xk, y: F.f(xk) }, { x: xn, y: 0 }, { x: xn, y: NaN });
      if (xn >= lo && xn <= hi) tang.push({ x: xn, y: 0 }, { x: xn, y: F.f(xn) }, { x: xn, y: NaN });
      xk = xn;
    }
    var pdata = { datasets: [
      { label: LAB.t("fx"), data: curve, borderColor: C.purple, borderWidth: 2.5, pointRadius: 0 },
      { label: LAB.t("tangents"), data: tang, borderColor: C.orange, backgroundColor: C.orange, borderWidth: 1.6, pointRadius: 2.5, spanGaps: false },
      { label: "r", data: [{ x: r, y: 0 }], borderColor: LAB.ink(), backgroundColor: LAB.ink(), pointRadius: 5, showLine: false }
    ] };
    if (!rCharts.plot) rCharts.plot = LAB.chart($("#rPlot"), { type: "line", data: pdata, options: { parsing: false, scales: { x: LAB.linAxis("x", { min: lo, max: hi, ticks: { includeBounds: false } }), y: LAB.linAxis("", { min: fmin - pad, max: fmax + pad, ticks: { includeBounds: false } }) } } });
    else upd(rCharts.plot, pdata, function (o) { o.scales.x.min = lo; o.scales.x.max = hi; o.scales.y.min = fmin - pad; o.scales.y.max = fmax + pad; });
  }

  /* ======================================================================
     Quadrature
     ====================================================================== */
  var QF = [
    { g: "sin x", iv: "[0, π]", val: "2", f: Math.sin, a: 0, b: Math.PI, exact: 2 },
    { g: "eˣ", iv: "[0, 1]", val: "e − 1", f: Math.exp, a: 0, b: 1, exact: Math.E - 1 },
    { g: "1/(1 + x²)", iv: "[0, 1]", val: "π/4", f: function (x) { return 1 / (1 + x * x); }, a: 0, b: 1, exact: Math.PI / 4 },
    { g: "√x", iv: "[0, 1]", val: "2/3", f: Math.sqrt, a: 0, b: 1, exact: 2 / 3 }
  ];
  var qs = { fun: 0, rule: "trap", n: 4 }, qCharts = {};
  function midpoint(f, a, b, n) { var h = (b - a) / n, s = 0; for (var i = 0; i < n; i++) s += f(a + h * (i + 0.5)); return h * s; }
  function trapezoid(f, a, b, n) { var h = (b - a) / n, s = 0.5 * (f(a) + f(b)); for (var i = 1; i < n; i++) s += f(a + h * i); return h * s; }
  function simpson(f, a, b, n) { var h = (b - a) / n, s = f(a) + f(b); for (var i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + h * i); return h / 3 * s; }
  var glCache = {};
  function legendre(n) {      // nodes and weights by Newton's method on the Legendre polynomial P_n
    if (glCache[n]) return glCache[n];
    var x = [], w = [];
    for (var i = 1; i <= n; i++) {
      var z = Math.cos(Math.PI * (i - 0.25) / (n + 0.5)), dp = 0;
      for (var it = 0; it < 100; it++) {
        var p0 = 1, p1 = z;
        for (var k = 2; k <= n; k++) { var p2 = ((2 * k - 1) * z * p1 - (k - 1) * p0) / k; p0 = p1; p1 = p2; }
        if (n === 1) { p1 = z; p0 = 1; }
        dp = n * (z * p1 - p0) / (z * z - 1);
        var dz = p1 / dp; z -= dz;
        if (Math.abs(dz) < 1e-16) break;
      }
      x.push(z); w.push(2 / ((1 - z * z) * dp * dp));
    }
    return (glCache[n] = { x: x, w: w });
  }
  function gauss(f, a, b, n) { var L = legendre(n), s = 0; for (var i = 0; i < n; i++) s += L.w[i] * f(0.5 * (b - a) * L.x[i] + 0.5 * (a + b)); return 0.5 * (b - a) * s; }

  function initQuad() {
    qOptions();
    $("#qFun").addEventListener("change", function () { qs.fun = +this.value; renderQuad(); });
    LAB.seg($("#qRule"), function (v) { qs.rule = v; renderQuad(); });
    $("#qN").addEventListener("input", LAB.raf(function () { qs.n = +$("#qN").value; renderQuad(); }));
    renderQuad();
  }
  function qOptions() {
    $("#qFun").innerHTML = QF.map(function (F, i) { return '<option value="' + i + '">∫ ' + F.g + " dx " + LAB.t("over") + " " + F.iv + " = " + F.val + "</option>"; }).join("");
    $("#qFun").value = qs.fun;
  }
  function renderQuad() {
    var F = QF[qs.fun], n = qs.n, rules = { mid: midpoint, trap: trapezoid, simp: simpson };
    $("#qNOut").textContent = n;
    var est = rules[qs.rule](F.f, F.a, F.b, n);
    $("#qEst").textContent = LAB.fmt(est, 6);
    $("#qErr").textContent = LAB.sci(Math.max(Math.abs(est - F.exact), 1e-17), 2);
    // illustration
    var curve = [];
    for (var i = 0; i <= 200; i++) { var x = F.a + (F.b - F.a) * i / 200; curve.push({ x: x, y: F.f(x) }); }
    var h = (F.b - F.a) / n, shape = [];
    if (qs.rule === "trap") for (i = 0; i <= n; i++) shape.push({ x: F.a + i * h, y: F.f(F.a + i * h) });
    else if (qs.rule === "mid") for (i = 0; i < n; i++) { var y = F.f(F.a + h * (i + 0.5)); shape.push({ x: F.a + i * h, y: y }, { x: F.a + (i + 1) * h, y: y }); }
    else for (i = 0; i < n; i += 2) {
      var x0 = F.a + i * h, f0 = F.f(x0), f1 = F.f(x0 + h), f2 = F.f(x0 + 2 * h);
      for (var j = 0; j <= 16; j++) { var t = j / 8, xx = x0 + t * h; shape.push({ x: xx, y: f0 * (t - 1) * (t - 2) / 2 - f1 * t * (t - 2) + f2 * t * (t - 1) / 2 }); }
    }
    var pdata = { datasets: [
      { label: LAB.t("ruleArea"), data: shape, borderColor: C.orange, backgroundColor: "rgba(254,138,93,.28)", fill: "origin", borderWidth: 1.6, pointRadius: qs.rule === "simp" ? 0 : 2.5, tension: 0 },
      { label: "f(x)", data: curve, borderColor: LAB.ink(), borderWidth: 2.2, pointRadius: 0 }
    ] };
    if (!qCharts.plot) qCharts.plot = LAB.chart($("#qPlot"), { type: "line", data: pdata, options: { parsing: false, scales: { x: LAB.linAxis("x"), y: LAB.linAxis("", { beginAtZero: true }) } } });
    else upd(qCharts.plot, pdata);
    // convergence
    var ns = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024], series = [];
    [["mid", midpoint, C.purple], ["trap", trapezoid, LAB.cssVar("--grey") || C.grey], ["simp", simpson, C.orange]].forEach(function (R) {
      var pts = ns.map(function (k) { return { x: k, y: Math.max(Math.abs(R[1](F.f, F.a, F.b, k) - F.exact), 1e-17) }; });
      var use = pts.filter(function (p) { return p.y > 1e-13; });
      var sl = use.length > 2 ? slopeOf(use.map(function (p) { return Math.log(p.x); }), use.map(function (p) { return Math.log(p.y); })) : NaN;
      series.push({ label: (R[0] === "simp" ? "Simpson" : LAB.t(R[0])) + " (" + LAB.t("slope") + " " + LAB.fmt(sl, 2) + ")", data: pts, borderColor: R[2], backgroundColor: R[2], pointRadius: 3, borderWidth: 2 });
    });
    var glp = []; for (var k = 1; k <= 20; k++) glp.push({ x: k, y: Math.max(Math.abs(gauss(F.f, F.a, F.b, k) - F.exact), 1e-17) });
    series.push({ label: LAB.t("gl"), data: glp, borderColor: LAB.ink(), backgroundColor: LAB.ink(), pointRadius: 2.5, borderWidth: 1.6, borderDash: [4, 3] });
    var data = { datasets: series };
    if (!qCharts.err) qCharts.err = LAB.chart($("#qChart"), { type: "line", data: data, options: { parsing: false, scales: { x: LAB.logAxis(LAB.t("nAxis"), { min: 1, max: 1024 }), y: LAB.logAxis("", { min: 1e-16 }) } } });
    else upd(qCharts.err, data);
  }

  /* ======================================================================
     ODEs
     ====================================================================== */
  var AL = 2 / 3, BE = 4 / 3, GA = 1, DE = 1, oCharts = {};
  function lv(t, z) { return [AL * z[0] - BE * z[0] * z[1], DE * z[0] * z[1] - GA * z[1]]; }
  function Vq(x, y) { return DE * x - GA * Math.log(x) + BE * y - AL * Math.log(y); }
  var STEP = {
    euler: function (f, t, y, h) { var k = f(t, y); return y.map(function (v, i) { return v + h * k[i]; }); },
    heun: function (f, t, y, h) { var k1 = f(t, y), y1 = y.map(function (v, i) { return v + h * k1[i]; }), k2 = f(t + h, y1); return y.map(function (v, i) { return v + h / 2 * (k1[i] + k2[i]); }); },
    rk4: function (f, t, y, h) {
      var k1 = f(t, y), k2 = f(t + h / 2, y.map(function (v, i) { return v + h / 2 * k1[i]; })), k3 = f(t + h / 2, y.map(function (v, i) { return v + h / 2 * k2[i]; })), k4 = f(t + h, y.map(function (v, i) { return v + h * k3[i]; }));
      return y.map(function (v, i) { return v + h / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]); });
    }
  };
  function solve(f, t0, y0, T, n, m) {
    var h = (T - t0) / n, y = y0.slice(), out = [{ t: t0, y: y }];
    for (var k = 0; k < n; k++) { y = STEP[m](f, t0 + k * h, y, h); out.push({ t: t0 + (k + 1) * h, y: y }); if (!y.every(isFinite)) break; }
    return out;
  }
  function initODE() {
    ["#oH", "#oT"].forEach(function (s) { $(s).addEventListener("input", LAB.raf(renderODE)); });
    ["#oEuler", "#oHeun", "#oRK4"].forEach(function (s) { $(s).addEventListener("change", renderODE); });
    renderODE(); renderOrders();
  }
  function renderODE() {
    var h = +$("#oH").value, T = +$("#oT").value, n = Math.round(T / h);
    $("#oHOut").textContent = LAB.fmt(h, 2); $("#oTOut").textContent = T;
    var meth = [["euler", "#oEuler", "Euler", LAB.cssVar("--grey") || C.grey], ["heun", "#oHeun", "Heun", C.purple], ["rk4", "#oRK4", "RK4", C.orange]];
    var phase = [], drift = [], V0 = Vq(1, 1), maxd = {};
    meth.forEach(function (M) {
      var sol = solve(lv, 0, [1, 1], T, n, M[0]), stride = Math.max(1, Math.floor(sol.length / 1500)), d = 0, dp = [], pp = [];
      sol.forEach(function (s, i) {
        var ok = s.y[0] > 0 && s.y[1] > 0;
        var dv = ok ? Math.abs(Vq(s.y[0], s.y[1]) - V0) / Math.abs(V0) : NaN;
        if (ok && isFinite(dv)) d = Math.max(d, dv);
        if (i % stride === 0 || i === sol.length - 1) {
          pp.push({ x: s.y[0], y: s.y[1] });
          if (i > 0) dp.push({ x: s.t, y: isFinite(dv) ? Math.max(dv, 1e-17) : NaN });
        }
      });
      maxd[M[0]] = d;
      if (!$(M[1]).checked) return;
      phase.push({ label: M[2], data: pp, borderColor: M[3], backgroundColor: M[3], pointRadius: 0, borderWidth: 1.4, showLine: true });
      drift.push({ label: M[2], data: dp, borderColor: M[3], backgroundColor: M[3], pointRadius: 0, borderWidth: 1.6 });
    });
    $("#oDE").textContent = LAB.sci(maxd.euler, 1);
    $("#oDR").textContent = LAB.sci(Math.max(maxd.rk4, 1e-17), 1);
    if (!oCharts.phase) oCharts.phase = LAB.chart($("#oPhase"), { type: "scatter", data: { datasets: phase }, options: { scales: { x: LAB.linAxis(LAB.t("prey"), { min: 0, max: 5 }), y: LAB.linAxis(LAB.t("predators"), { min: 0, max: 3 }) } } });
    else upd(oCharts.phase, { datasets: phase }, function (o) { o.scales.x.title.text = LAB.t("prey"); o.scales.y.title.text = LAB.t("predators"); });
    if (!oCharts.drift) oCharts.drift = LAB.chart($("#oDrift"), { type: "line", data: { datasets: drift }, options: { parsing: false, scales: { x: LAB.linAxis(LAB.t("time"), { min: 0 }), y: LAB.logAxis(LAB.t("relDrift"), { min: 1e-14, max: 10 }) } } });
    else upd(oCharts.drift, { datasets: drift }, function (o) { o.scales.x.title.text = LAB.t("time"); o.scales.y.title.text = LAB.t("relDrift"); });
  }
  function renderOrders() {
    var f = function (t, y) { return [-2 * t * y[0]]; }, exact = Math.exp(-4), ns = [10, 20, 40, 80, 160, 320, 640];
    var rows = [["euler", "Euler", "1"], ["heun", "Heun", "2"], ["rk4", "RK4", "4"]].map(function (M) {
      var errs = ns.map(function (n) { var s = solve(f, 0, [1], 2, n, M[0]); return Math.abs(s[s.length - 1].y[0] - exact); });
      var hs = ns.map(function (n) { return 2 / n; }), keep = errs.map(function (e) { return e > 1e-14; });
      var lx = [], ly = []; hs.forEach(function (hh, i) { if (keep[i]) { lx.push(Math.log(hh)); ly.push(Math.log(errs[i])); } });
      return "<tr><td>" + M[1] + '</td><td class="num">' + LAB.sci(errs[1], 1) + '</td><td class="num">' + LAB.sci(errs[3], 1) + '</td><td class="num">' + LAB.sci(errs[5], 1) + '</td><td class="num"><b>' + LAB.fmt(slopeOf(lx, ly), 2) + '</b></td><td class="num">' + M[2] + "</td></tr>";
    }).join("");
    $("#oTable").innerHTML = "<thead><tr><th>" + LAB.t("method") + '</th><th class="num">' + LAB.t("error") + ', <span class="nc">n = 20</span>' + '</th><th class="num">' + LAB.t("error") + ', <span class="nc">n = 80</span>' + '</th><th class="num">' + LAB.t("error") + ', <span class="nc">n = 320</span>' + '</th><th class="num">' + LAB.t("measured") + '</th><th class="num">' + LAB.t("theory") + "</th></tr></thead><tbody>" + rows + "</tbody>";
  }

  /* ======================================================================
     Interpolation
     ====================================================================== */
  var IF = [
    { label: "1 / (1 + 25x²)  (Runge)", f: function (x) { return 1 / (1 + 25 * x * x); } },
    { label: "|x|", f: Math.abs },
    { label: "sin(3x) · eˣ", f: function (x) { return Math.sin(3 * x) * Math.exp(x); } }
  ];
  var ist = { fun: 0, n: 10 }, iCharts = {};
  function binomRow(n) { var r = [1]; for (var k = 1; k <= n; k++) r.push(r[k - 1] * (n - k + 1) / k); return r; }
  function nodesEq(n) { var x = [], w = [], b = binomRow(n); for (var j = 0; j <= n; j++) { x.push(-1 + 2 * j / n); w.push((j % 2 ? -1 : 1) * b[j]); } return { x: x, w: w }; }
  function nodesCh(n) { var x = [], w = []; for (var j = 0; j <= n; j++) { var th = (2 * j + 1) * Math.PI / (2 * (n + 1)); x.push(Math.cos(th)); w.push((j % 2 ? -1 : 1) * Math.sin(th)); } return { x: x, w: w }; }
  function bary(N, vals, x) {      // barycentric Lagrange formula
    var num = 0, den = 0;
    for (var j = 0; j < N.x.length; j++) {
      var d = x - N.x[j];
      if (Math.abs(d) < 1e-14) return vals[j];
      var t = N.w[j] / d; num += t * vals[j]; den += t;
    }
    return num / den;
  }
  function interpErr(F, n, kind) {
    var N = kind === "eq" ? nodesEq(n) : nodesCh(n), vals = N.x.map(F.f), e = 0;
    for (var i = 0; i <= 1000; i++) { var x = -1 + 2 * i / 1000; e = Math.max(e, Math.abs(bary(N, vals, x) - F.f(x))); }
    return e;
  }
  function initInterp() {
    $("#iFun").innerHTML = IF.map(function (F, i) { return '<option value="' + i + '">' + F.label + "</option>"; }).join("");
    $("#iFun").addEventListener("change", function () { ist.fun = +this.value; renderInterp(true); });
    $("#iDeg").addEventListener("input", LAB.raf(function () { ist.n = +$("#iDeg").value; renderInterp(false); }));
    renderInterp(true);
  }
  function renderInterp(full) {
    var F = IF[ist.fun], n = ist.n, Ne = nodesEq(n), Nc = nodesCh(n), ve = Ne.x.map(F.f), vc = Nc.x.map(F.f);
    $("#iDegOut").textContent = n;
    var cf = [], ce = [], cc = [], fmin = Infinity, fmax = -Infinity;
    for (var i = 0; i <= 600; i++) {
      var x = -1 + 2 * i / 600, y = F.f(x);
      fmin = Math.min(fmin, y); fmax = Math.max(fmax, y);
      cf.push({ x: x, y: y }); ce.push({ x: x, y: bary(Ne, ve, x) }); cc.push({ x: x, y: bary(Nc, vc, x) });
    }
    var span = fmax - fmin, grey = LAB.cssVar("--grey") || C.grey;
    $("#iEq").textContent = LAB.sci(interpErr(F, n, "eq"), 1);
    $("#iCh").textContent = LAB.sci(interpErr(F, n, "ch"), 1);
    var pdata = { datasets: [
      { label: LAB.t("eqLbl"), data: ce, borderColor: grey, borderWidth: 2, pointRadius: 0 },
      { label: LAB.t("chLbl"), data: cc, borderColor: C.orange, borderWidth: 2, pointRadius: 0 },
      { label: LAB.t("fLbl"), data: cf, borderColor: LAB.ink(), borderWidth: 2.4, pointRadius: 0 },
      { label: "", data: Ne.x.map(function (x, j) { return { x: x, y: ve[j] }; }), borderColor: grey, backgroundColor: grey, pointRadius: 3, showLine: false },
      { label: "", data: Nc.x.map(function (x, j) { return { x: x, y: vc[j] }; }), borderColor: C.orange, backgroundColor: C.orange, pointRadius: 3, showLine: false }
    ] };
    var legend = { labels: { filter: function (it) { return !!it.text; } } };
    if (!iCharts.plot) iCharts.plot = LAB.chart($("#iPlot"), { type: "line", data: pdata, options: { parsing: false, plugins: { legend: legend }, scales: { x: LAB.linAxis("x", { min: -1, max: 1 }), y: LAB.linAxis("", { min: fmin - 0.6 * span, max: fmax + 0.6 * span, ticks: { includeBounds: false } }) } } });
    else upd(iCharts.plot, pdata, function (o) { o.scales.y.min = fmin - 0.6 * span; o.scales.y.max = fmax + 0.6 * span; });
    if (full || !iCharts.err) {
      var de = [], dc = [];
      for (var k = 2; k <= 40; k++) { de.push({ x: k, y: Math.min(Math.max(interpErr(F, k, "eq"), 1e-17), 1e8) }); dc.push({ x: k, y: Math.max(interpErr(F, k, "ch"), 1e-17) }); }
      iCharts.errData = { de: de, dc: dc };
    }
    var cur = [{ x: n, y: Math.min(Math.max(interpErr(F, n, "eq"), 1e-17), 1e8) }, { x: n, y: Math.max(interpErr(F, n, "ch"), 1e-17) }];
    var edata = { datasets: [
      { label: LAB.t("eqLbl"), data: iCharts.errData.de, borderColor: grey, backgroundColor: grey, pointRadius: 2, borderWidth: 2 },
      { label: LAB.t("chLbl"), data: iCharts.errData.dc, borderColor: C.orange, backgroundColor: C.orange, pointRadius: 2, borderWidth: 2 },
      { label: "", data: cur, borderColor: LAB.ink(), backgroundColor: LAB.ink(), pointRadius: 6, showLine: false }
    ] };
    if (!iCharts.err) iCharts.err = LAB.chart($("#iChart"), { type: "line", data: edata, options: { parsing: false, plugins: { legend: legend }, scales: { x: LAB.linAxis(LAB.t("deg"), { min: 2, max: 40 }), y: LAB.logAxis("") } } });
    else upd(iCharts.err, edata, function (o) { o.scales.x.title.text = LAB.t("deg"); });
  }

  /* ======================================================================
     Monte Carlo
     ====================================================================== */
  var mc = { N: 0, inside: 0, running: true, pps: 200, acc: 0, drawn: 0, hist: [], next: 10 }, mChart = null, mrand = LAB.rng(314159);
  function mcSize() {
    var cv = $("#mDarts"), W = Math.min(cv.parentNode.clientWidth, 460), dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr); cv.height = Math.round(W * dpr); cv.style.height = W + "px"; cv.style.width = W + "px";
    mc.W = W; mc.dpr = dpr;
  }
  function mcClear() {
    var cv = $("#mDarts"), ctx = cv.getContext("2d"), W = mc.W;
    ctx.setTransform(mc.dpr, 0, 0, mc.dpr, 0, 0);
    ctx.fillStyle = LAB.cssVar("--surface-2"); ctx.fillRect(0, 0, W, W);
    ctx.strokeStyle = LAB.ink(); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, W, W, -Math.PI / 2, 0); ctx.stroke();
    mc.drawn = 0;
  }
  function mcStep(k, draw) {
    var cv = $("#mDarts"), ctx = cv.getContext("2d"), W = mc.W;
    for (var i = 0; i < k; i++) {
      var x = mrand(), y = mrand(), inn = x * x + y * y <= 1;
      mc.N++; if (inn) mc.inside++;
      if (draw && mc.drawn < 40000) {
        ctx.fillStyle = inn ? "rgba(254,138,93,.8)" : "rgba(155,123,247,.8)";
        ctx.fillRect(x * W - 1, (1 - y) * W - 1, 2.2, 2.2); mc.drawn++;
      }
      if (mc.N >= mc.next) {
        var p = mc.inside / mc.N, est = 4 * p;
        mc.hist.push({ n: mc.N, err: Math.abs(est - Math.PI), ci: 1.96 * 4 * Math.sqrt(p * (1 - p) / mc.N) });
        mc.next = Math.ceil(mc.next * 1.12);
      }
    }
  }
  var mLast = 0;
  function mcRender(force) {
    var p = mc.N ? mc.inside / mc.N : 0;
    $("#mN").textContent = LAB.int(mc.N);
    $("#mPi").textContent = mc.N ? LAB.fmt(4 * p, 5) : "–";
    $("#mErr").textContent = mc.N ? LAB.sci(Math.max(Math.abs(4 * p - Math.PI), 1e-17), 2) : "–";
    $("#mCI").textContent = mc.N ? LAB.sci(1.96 * 4 * Math.sqrt(p * (1 - p) / mc.N), 2) : "–";
    var now = performance.now();
    if (!force && now - mLast < 150) return;
    mLast = now;
    var data = { datasets: [
      { label: LAB.t("absErr"), data: mc.hist.map(function (h) { return { x: h.n, y: Math.max(h.err, 1e-9) }; }), borderColor: C.purple, backgroundColor: C.purple, pointRadius: 0, borderWidth: 1.6 },
      { label: LAB.t("ciLbl"), data: mc.hist.map(function (h) { return { x: h.n, y: h.ci }; }), borderColor: C.orange, backgroundColor: C.orange, pointRadius: 0, borderWidth: 2.2 }
    ] };
    if (!mChart) mChart = LAB.chart($("#mChart"), { type: "line", data: data, options: { parsing: false, scales: { x: LAB.logAxis(LAB.t("nPts"), { min: 10 }), y: LAB.logAxis("") } } });
    else upd(mChart, data);
  }
  var mPrev = 0;
  function mcLoop(t) {
    if (mc.running && !$('[data-panel="mc"]').hidden) {
      var dt = mPrev ? Math.min(0.1, (t - mPrev) / 1000) : 0;
      mc.acc += dt * mc.pps;
      var k = Math.min(200000, Math.floor(mc.acc));
      mc.acc -= k;
      if (k) { mcStep(k, true); mcRender(); }
    }
    mPrev = t;
    requestAnimationFrame(mcLoop);
  }
  function mcSpeed() { mc.pps = Math.max(1, Math.round(Math.pow(10, +$("#mSpeed").value / 100 * 5))); $("#mSpeedOut").textContent = LAB.int(mc.pps); }
  function mcReset() { mc.N = 0; mc.inside = 0; mc.hist = []; mc.next = 10; mcrandReset(); mcClear(); mcRender(true); }
  function mcrandReset() { mrand = LAB.rng(314159); }
  function initMC() {
    mcSize(); mcClear(); mcSpeed(); mcRender(true);
    $("#mSpeed").addEventListener("input", mcSpeed);
    $("#mReset").addEventListener("click", mcReset);
    $("#mJump").addEventListener("click", function () { mcStep(1000000, false); mcRender(true); });
    $("#mPlay").addEventListener("click", function () { mc.running = !mc.running; $("#mPlay").textContent = LAB.t(mc.running ? "pause" : "play"); });
    requestAnimationFrame(mcLoop);
  }

  LAB.debug = LAB.debug || {};
  LAB.debug.num = function () {
    return { roots: $("#rTable").innerText, quad: qCharts.err ? qCharts.err.data.datasets.map(function (d) { return d.label; }) : null, orders: $("#oTable").innerText };
  };

  /* ---------- start ---------- */
  var started = {};
  LAB.tabs(document.querySelector(".tabs"), function (id) {
    setTimeout(function () {
      if (!started[id]) {
        started[id] = true;
        if (id === "roots") initRoots();
        if (id === "quad") initQuad();
        if (id === "ode") initODE();
        if (id === "interp") initInterp();
        if (id === "mc") initMC();
      }
    }, 0);
  });
  LAB.onLang(function () {
    if (started.roots) renderRoots();
    if (started.quad) { qOptions(); renderQuad(); }
    if (started.ode) { renderODE(); renderOrders(); }
    if (started.interp) renderInterp(true);
    if (started.mc) { $("#mPlay").textContent = LAB.t(mc.running ? "pause" : "play"); mcRender(true); }
  });
})();
