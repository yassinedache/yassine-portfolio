/* Math Lab: shared helpers (language, header, charts, number formatting). */
(function () {
  "use strict";

  var LANG_KEY = "portfolio-lang";   // same key as the portfolio, so the language carries over
  var GH = "https://github.com/yassinedache/";
  var PAGES = [
    { id: "numerical-analysis", repo: "numerical-analysis-lab", en: "Numerical analysis", fr: "Analyse numérique" },
    { id: "linear-regression", repo: "linear-regression-from-scratch", en: "Linear regression", fr: "Régression linéaire" },
    { id: "pca-svd", repo: "pca-svd-from-scratch", en: "PCA & SVD", fr: "ACP & SVD" },
    { id: "markov-pagerank", repo: "markov-chains-pagerank", en: "Markov & PageRank", fr: "Markov & PageRank" }
  ];
  var LOGO = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 3.5 40.5 9v14.2c0 10.3-6.9 18.6-16.5 21.3C14.4 41.8 7.5 33.5 7.5 23.2V9z" fill="#DCCFFF"/><path d="M24 3.5 40.5 9v14.2c0 10.3-6.9 18.6-16.5 21.3z" fill="#B7A4F4"/><path d="M16 15.5 24 25l8-9.5" fill="none" stroke="#171717" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 25v10" fill="none" stroke="#FE8A5D" stroke-width="4.2" stroke-linecap="round"/></svg>';
  var ICONS = {
    github: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>'
  };

  var COMMON = {
    en: {
      portfolio: "Portfolio", lab: "Math Lab", code: "Code on GitHub", report: "Report (PDF, French)",
      foot: "Interactive demos of my mathematics projects. The algorithms are JavaScript ports of my Python code, run in your browser.",
      by: "Yassine Abderrezak Dache", lang: "Language", loading: "Loading data…"
    },
    fr: {
      portfolio: "Portfolio", lab: "Math Lab", code: "Code sur GitHub", report: "Rapport (PDF)",
      foot: "Démos interactives de mes projets de mathématiques. Les algorithmes sont des portages JavaScript de mon code Python, exécutés dans votre navigateur.",
      by: "Yassine Abderrezak Dache", lang: "Langue", loading: "Chargement des données…"
    }
  };

  function detect() {
    var q = /[?&]lang=(en|fr)\b/i.exec(location.search || "");
    if (q) return q[1].toLowerCase();
    try { var s = localStorage.getItem(LANG_KEY); if (s === "en" || s === "fr") return s; } catch (e) {}
    var nav = (navigator.languages && navigator.languages[0]) || navigator.language || "";
    return /^fr\b/i.test(nav) ? "fr" : "en";
  }

  var LAB = window.LAB = {
    lang: detect(),
    dict: { en: Object.assign({}, COMMON.en), fr: Object.assign({}, COMMON.fr) },
    listeners: [],
    icons: ICONS,
    pages: PAGES,
    colors: { purple: "#9B7BF7", orange: "#FE8A5D", green: "#2BB673", red: "#D64545", grey: "#9CA3AF", blue: "#4F8EF7", teal: "#14B8A6" }
  };

  LAB.register = function (d) {
    Object.assign(LAB.dict.en, d.en || {});
    Object.assign(LAB.dict.fr, d.fr || {});
  };
  LAB.t = function (key, vars) {
    var s = LAB.dict[LAB.lang][key];
    if (s == null) s = LAB.dict.en[key];
    if (s == null) s = key;
    if (vars) s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
    return s;
  };
  LAB.onLang = function (fn) { LAB.listeners.push(fn); };
  LAB.apply = function (root) {
    root = root || document;
    root.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = LAB.t(el.getAttribute("data-i18n")); });
    root.querySelectorAll("[data-i18n-html]").forEach(function (el) { el.innerHTML = LAB.t(el.getAttribute("data-i18n-html")); });
    root.querySelectorAll("[data-i18n-ph]").forEach(function (el) { el.setAttribute("placeholder", LAB.t(el.getAttribute("data-i18n-ph"))); });
    root.querySelectorAll("[data-i18n-aria]").forEach(function (el) { el.setAttribute("aria-label", LAB.t(el.getAttribute("data-i18n-aria"))); });
    document.documentElement.lang = LAB.lang;
    if (LAB.dict.en.pageTitle) document.title = LAB.t("pageTitle") + " | Math Lab";
  };
  LAB.setLang = function (l) {
    if (l === LAB.lang || (l !== "en" && l !== "fr")) return;
    LAB.lang = l;
    try { localStorage.setItem(LANG_KEY, l); } catch (e) {}
    renderChrome();
    LAB.apply();
    LAB.listeners.forEach(function (fn) { try { fn(l); } catch (e) { console.error(e); } });
  };

  /* ---------- header and footer ---------- */
  function renderChrome() {
    var page = document.body.getAttribute("data-page") || "";
    var head = document.getElementById("labHeader");
    if (head) {
      head.className = "lab-header";
      head.innerHTML = '<nav class="lab-nav" aria-label="Math Lab">' +
        '<a class="lab-brand" href="/lab/">' + LOGO + "<span>Math Lab</span></a>" +
        '<div class="lab-links">' + PAGES.map(function (p) {
          return '<a href="/lab/' + p.id + '/"' + (p.id === page ? ' aria-current="page"' : "") + ">" + p[LAB.lang] + "</a>";
        }).join("") + "</div>" +
        '<div class="lab-right"><div class="lang-sw" role="group" aria-label="' + LAB.t("lang") + '">' +
          ["en", "fr"].map(function (l) { return '<button type="button" data-lang="' + l + '" aria-pressed="' + (l === LAB.lang) + '">' + l.toUpperCase() + "</button>"; }).join("") +
        '</div><a class="btn-port" href="/">' + LAB.t("portfolio") + "</a></div></nav>";
    }
    var foot = document.getElementById("labFoot");
    if (foot) {
      var p = PAGES.filter(function (x) { return x.id === page; })[0];
      foot.className = "lab-foot";
      foot.innerHTML = "<span>" + LAB.t("foot") + "</span><span>© " + new Date().getFullYear() + " " + LAB.t("by") +
        ' · <a href="/">' + LAB.t("portfolio") + "</a>" + (p ? ' · <a href="' + GH + p.repo + '" target="_blank" rel="noreferrer">GitHub</a>' : "") + "</span>";
    }
  }
  LAB.repo = function (id) { var p = PAGES.filter(function (x) { return x.id === id; })[0]; return p ? GH + p.repo : GH; };

  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-lang]");
    if (b) LAB.setLang(b.getAttribute("data-lang"));
  });

  /* ---------- numbers ---------- */
  var SUP = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
  LAB.fmt = function (x, d) {
    if (x == null || !isFinite(x)) return "–";
    var s = Number(x).toFixed(d == null ? 2 : d);
    return LAB.lang === "fr" ? s.replace(".", ",") : s;
  };
  LAB.int = function (n) { return Math.round(n).toLocaleString(LAB.lang === "fr" ? "fr-FR" : "en-US"); };
  LAB.sci = function (x, d) {
    if (x == null || !isFinite(x)) return "–";
    if (x === 0) return "0";
    var e = Math.floor(Math.log10(Math.abs(x)));
    if (e >= -2 && e <= 3) return LAB.fmt(x, Math.max(0, (d == null ? 2 : d) - e));
    var m = x / Math.pow(10, e);
    if (Math.abs(m) >= 9.995) { m /= 10; e += 1; }
    return LAB.fmt(m, d == null ? 1 : d) + " × 10" + String(e).split("").map(function (c) { return SUP[c]; }).join("");
  };
  LAB.pow10 = function (e) { return "10" + String(e).split("").map(function (c) { return SUP[c]; }).join(""); };

  /* ---------- charts ---------- */
  function cssVar(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
  LAB.cssVar = cssVar;
  LAB.ink = function () { return cssVar("--ink") || "#171717"; };
  function isPow10(v) { var e = Math.log10(v); return Math.abs(e - Math.round(e)) < 1e-9; }
  LAB.logTicks = function (value) {
    if (!isPow10(value)) return "";
    var e = Math.round(Math.log10(value)), span = this && this.max > 0 && this.min > 0 ? Math.log10(this.max / this.min) : 0;
    var step = span > 16 ? 4 : span > 9 ? 2 : 1;
    return e % step === 0 ? LAB.pow10(e) : "";
  };
  function merge(a, b) {
    Object.keys(b || {}).forEach(function (k) {
      if (b[k] && typeof b[k] === "object" && !Array.isArray(b[k]) && a[k] && typeof a[k] === "object") merge(a[k], b[k]);
      else a[k] = b[k];
    });
    return a;
  }
  LAB.chart = function (canvas, cfg) {
    if (!window.Chart) return null;
    Chart.defaults.font.family = "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = cssVar("--muted") || "#6b7280";
    Chart.defaults.borderColor = cssVar("--line") || "#eceef2";
    var base = {
      responsive: true, maintainAspectRatio: false, animation: false, normalized: true,
      interaction: { mode: "nearest", intersect: false },
      plugins: {
        legend: { labels: { boxWidth: 10, boxHeight: 10, usePointStyle: true, pointStyle: "circle", padding: 12 } },
        tooltip: { backgroundColor: "#171717", titleColor: "#fff", bodyColor: "#fff", padding: 10, cornerRadius: 10, displayColors: true }
      }
    };
    cfg.options = merge(base, cfg.options || {});
    return new Chart(canvas, cfg);
  };
  LAB.logAxis = function (title, extra) {
    var line = cssVar("--line");
    return merge({ type: "logarithmic", title: { display: !!title, text: title }, ticks: { callback: LAB.logTicks, autoSkip: false, maxRotation: 0 },
      grid: { color: function (c) { return c.tick && isPow10(c.tick.value) ? line : "transparent"; } } }, extra || {});
  };
  LAB.linAxis = function (title, extra) {
    return merge({ type: "linear", title: { display: !!title, text: title }, grid: { color: cssVar("--line") } }, extra || {});
  };

  /* request-animation-frame throttle: run fn at most once per frame */
  LAB.raf = function (fn) {
    var queued = false, args;
    return function () { args = arguments; if (queued) return; queued = true; requestAnimationFrame(function () { queued = false; fn.apply(null, args); }); };
  };
  LAB.debounce = function (fn, ms) {
    var t; return function () { var a = arguments; clearTimeout(t); t = setTimeout(function () { fn.apply(null, a); }, ms); };
  };

  /* tabs: buttons [role=tab][data-tab] toggle panels [data-panel] */
  LAB.tabs = function (root, onChange) {
    var btns = root.querySelectorAll("[data-tab]");
    function show(id) {
      btns.forEach(function (b) {
        var on = b.getAttribute("data-tab") === id;
        b.setAttribute("aria-selected", on ? "true" : "false");
        if (on && root.scrollWidth > root.clientWidth) {   // keep the active tab visible when the bar scrolls (phones)
          var rb = b.getBoundingClientRect(), rr = root.getBoundingClientRect();
          if (rb.left < rr.left || rb.right > rr.right) root.scrollLeft += rb.left - rr.left - 12;
        }
      });
      document.querySelectorAll("[data-panel]").forEach(function (p) { p.hidden = p.getAttribute("data-panel") !== id; });
      try { history.replaceState(null, "", "#" + id); } catch (e) {}
      if (onChange) onChange(id);
    }
    btns.forEach(function (b) { b.addEventListener("click", function () { show(b.getAttribute("data-tab")); }); });
    var start = (location.hash || "").slice(1);
    var ids = Array.prototype.map.call(btns, function (b) { return b.getAttribute("data-tab"); });
    show(ids.indexOf(start) >= 0 ? start : ids[0]);
    return show;
  };

  /* segmented buttons: container [data-seg] with buttons [data-v] */
  LAB.seg = function (el, onChange) {
    var btns = el.querySelectorAll("[data-v]");
    function set(v) { btns.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-v") === v ? "true" : "false"); }); }
    btns.forEach(function (b) { b.addEventListener("click", function () { set(b.getAttribute("data-v")); onChange(b.getAttribute("data-v")); }); });
    return set;
  };

  /* simple seeded random generator (mulberry32) for reproducible demos */
  LAB.rng = function (seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  document.addEventListener("DOMContentLoaded", function () {
    renderChrome();
    LAB.apply();
    document.querySelectorAll("[data-repo]").forEach(function (a) { a.href = LAB.repo(a.getAttribute("data-repo")); });
  });
})();
