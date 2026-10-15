/* =====================================================================
   ¿A quién prestarle? — lógica de la página
   - Simulador: regresión logística de 8 variables (modelo_web.json)
   - Gráficos SVG animados con datos de resultados.json
   Sin frameworks ni dependencias externas.
   ===================================================================== */
(() => {
"use strict";

const D = window.DATOS;
const M = D.modelo;
const R = D.resultados;
const X = D.extra;
const SVGNS = "http://www.w3.org/2000/svg";
const MOVIMIENTO = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- Utilidades ---------- */
function num(x, d = 0) {
  const s = Math.abs(x).toFixed(d);
  let [ent, dec] = s.split(".");
  ent = ent.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return (x < 0 && Number(s) !== 0 ? "−" : "") + ent + (dec ? "," + dec : "");
}
const pct = (x, d = 0) => num(x * 100, d) + " %";
const signo = (x, d = 2) => (x >= 0 ? "+" : "−") + num(Math.abs(x), d);
function svg(tag, attrs = {}, padre) {
  const e = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (padre) padre.appendChild(e);
  return e;
}
function css(nombre) { return getComputedStyle(document.documentElement).getPropertyValue(nombre).trim(); }
const easeOut = t => 1 - Math.pow(1 - t, 3);
function tween(desde, hasta, ms, fn) {
  if (!MOVIMIENTO || ms <= 0) { fn(hasta); return; }
  const t0 = performance.now();
  const paso = ahora => {
    const t = Math.min(1, (ahora - t0) / ms);
    fn(desde + (hasta - desde) * easeOut(t));
    if (t < 1) requestAnimationFrame(paso);
  };
  requestAnimationFrame(paso);
}

/* ---------- Tooltip compartido ---------- */
const tip = $("#tooltip");
function mostrarTip(ev, html) {
  tip.innerHTML = html;
  tip.classList.add("visible");
  moverTip(ev);
}
function moverTip(ev) {
  const r = tip.getBoundingClientRect();
  let x = ev.clientX + 14, y = ev.clientY - r.height - 12;
  if (x + r.width > innerWidth - 8) x = ev.clientX - r.width - 14;
  if (y < 8) y = ev.clientY + 18;
  tip.style.left = x + "px";
  tip.style.top = y + "px";
}
const ocultarTip = () => tip.classList.remove("visible");
function conTip(el, html) {
  el.addEventListener("pointerenter", e => { mostrarTip(e, html); el.classList?.add("activa"); });
  el.addEventListener("pointermove", moverTip);
  el.addEventListener("pointerleave", () => { ocultarTip(); el.classList?.remove("activa"); });
}

/* =====================================================================
   NAVEGACIÓN, TEMA, REVELADO Y CONTADORES
   ===================================================================== */
const nav = $("#nav");
const progreso = $("#progreso");
const enlaces = $$("#navLinks a");
function alDesplazar() {
  const y = scrollY;
  nav.classList.toggle("nav--solida", y > 40);
  const total = document.documentElement.scrollHeight - innerHeight;
  progreso.style.width = (total > 0 ? (y / total) * 100 : 0) + "%";
}
addEventListener("scroll", alDesplazar, { passive: true });
alDesplazar();

const obsSeccion = new IntersectionObserver(entradas => {
  entradas.forEach(en => {
    if (en.isIntersecting) enlaces.forEach(a => a.classList.toggle("activo", a.getAttribute("href") === "#" + en.target.id));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
$$("main > section[id]").forEach(s => obsSeccion.observe(s));

const btnMenu = $("#btnMenu"), links = $("#navLinks");
btnMenu.addEventListener("click", () => {
  const abierto = links.classList.toggle("abierto");
  btnMenu.setAttribute("aria-expanded", abierto);
});
enlaces.forEach(a => a.addEventListener("click", () => { links.classList.remove("abierto"); btnMenu.setAttribute("aria-expanded", "false"); }));

$("#btnTema").addEventListener("click", () => {
  const oscuro = document.documentElement.dataset.theme
    ? document.documentElement.dataset.theme === "dark"
    : matchMedia("(prefers-color-scheme: dark)").matches;
  const nuevo = oscuro ? "light" : "dark";
  document.documentElement.dataset.theme = nuevo;
  try { localStorage.setItem("tema", nuevo); } catch (e) {}
  redibujar();
  actualizarSimulador(false);
});

// Revelado escalonado
$$(".revelar").forEach(el => {
  const hermanos = [...el.parentElement.children].filter(h => h.classList.contains("revelar"));
  const i = hermanos.indexOf(el);
  if (i > 0) el.style.setProperty("--retraso", Math.min(i * 0.08, 0.5) + "s");
});
const obsRevelar = new IntersectionObserver(entradas => {
  entradas.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add("visible");
    $$(".contador", en.target).forEach(animarContador);
    if (en.target.classList.contains("contador")) animarContador(en.target);
    obsRevelar.unobserve(en.target);
  });
}, { threshold: 0.15 });
$$(".revelar").forEach(el => obsRevelar.observe(el));

function animarContador(el) {
  if (el.dataset.hecho) return;
  el.dataset.hecho = "1";
  const fin = Number(el.dataset.fin);
  tween(0, fin, 1400, v => { el.textContent = num(Math.round(v)); });
}
// Contadores del hero (no están dentro de .revelar)
setTimeout(() => $$(".hero .contador").forEach(animarContador), 400);

/* =====================================================================
   HERO: red animada con forma de árbol de decisión
   ===================================================================== */
(function heroRed() {
  const s = $("#heroRed");
  const nodos = {
    r: [380, 70], a: [270, 180], b: [490, 170], c: [210, 300], d: [330, 300], e: [440, 290], f: [560, 300],
    g: [260, 420], h: [380, 420], i: [500, 420], j: [150, 420], k: [560, 440],
  };
  const aristas = [["r","a"],["r","b"],["a","c"],["a","d"],["b","e"],["b","f"],["d","g"],["d","h"],["e","h"],["e","i"],["c","j"],["f","k"]];
  const tenues = [["a","b"],["c","d"],["e","f"],["g","h"],["h","i"],["j","g"],["i","k"],["d","e"]];
  const claves = ["a", "e", "h"];
  const caminos = [];
  tenues.forEach(([p, q], i) => {
    const l = svg("path", { d: `M${nodos[p]}L${nodos[q]}`, class: "arista arista--tenue" }, s);
    l.style.animationDelay = (0.8 + i * 0.08) + "s";
  });
  aristas.forEach(([p, q], i) => {
    const d = `M${nodos[p]}L${nodos[q]}`;
    const l = svg("path", { d, class: "arista" }, s);
    l.style.animationDelay = (i * 0.12) + "s";
    caminos.push(d);
  });
  Object.entries(nodos).forEach(([k, [x, y]], i) => {
    if (claves.includes(k)) {
      const h = svg("circle", { cx: x, cy: y, r: 14, class: "halo" }, s);
      h.style.animationDelay = (i * 0.3) + "s";
    }
    const n = svg("circle", { cx: x, cy: y, r: claves.includes(k) ? 7 : 4.5, class: "nodo" + (claves.includes(k) ? " nodo--clave" : "") }, s);
    n.style.animationDelay = (0.3 + i * 0.07) + "s";
  });
  if (!MOVIMIENTO) return;
  // Pulsos que viajan por las ramas, como una decisión que baja por el árbol
  caminos.forEach((d, i) => {
    const c = svg("circle", { r: 3, class: "pulso", opacity: 0 }, s);
    const dur = 2.4 + (i % 4) * 0.5;
    svg("animateMotion", { path: d, dur: dur + "s", begin: (2 + i * 0.45) + "s", repeatCount: "indefinite" }, c);
    svg("animate", { attributeName: "opacity", values: "0;1;1;0", dur: dur + "s", begin: (2 + i * 0.45) + "s", repeatCount: "indefinite" }, c);
  });
})();

/* =====================================================================
   DATASET: dona, chips de variables
   ===================================================================== */
function dibujarDona(animar) {
  const s = $("#dona");
  s.innerHTML = "";
  const r = 76, C = 2 * Math.PI * r, gap = 4;
  const partes = [[0.7, css("--bueno")], [0.3, css("--malo")]];
  let acum = 0;
  svg("circle", { cx: 100, cy: 100, r, fill: "none", stroke: css("--surface-2"), "stroke-width": 26 }, s);
  partes.forEach(([f, color], i) => {
    const largo = f * C - gap;
    const arco = svg("circle", {
      cx: 100, cy: 100, r, fill: "none", stroke: color, "stroke-width": 26,
      "stroke-dasharray": `0 ${C}`, "stroke-dashoffset": -acum, transform: "rotate(-90 100 100)",
    }, s);
    const ini = acum;
    tween(0, largo, animar ? 1200 + i * 300 : 0, v => arco.setAttribute("stroke-dasharray", `${v} ${C}`));
    conTip(arco, `<b>${i ? "Malos" : "Buenos"} pagadores</b><br>${i ? 300 : 700} personas (${i ? 30 : 70}&nbsp;%)`);
    acum = ini + f * C;
  });
  const t = svg("text", { x: 100, y: 98, "text-anchor": "middle", "font-size": 34, "font-weight": 800, fill: css("--ink") }, s);
  t.textContent = "70 %";
  const t2 = svg("text", { x: 100, y: 122, "text-anchor": "middle", "font-size": 13, fill: css("--muted") }, s);
  t2.textContent = "buenos pagadores";
}

(function chips() {
  const vars = [
    ["Cuenta corriente", "u"], ["Duración", "u"], ["Historial crediticio", "u"], ["Propósito"], ["Monto", "u"],
    ["Ahorros", "u"], ["Antigüedad en el empleo"], ["Cuota / ingreso", "u"], ["Estado civil y sexo", "x"], ["Otros deudores"],
    ["Años de residencia"], ["Propiedad", "u"], ["Edad"], ["Otros planes de pago", "u"], ["Vivienda"],
    ["Número de créditos"], ["Empleo"], ["Dependientes"], ["Teléfono"], ["Trabajador extranjero", "x"],
  ];
  const ul = $("#chipsVariables");
  vars.forEach(([n, t], i) => {
    const li = document.createElement("li");
    li.textContent = n;
    if (t === "u") li.className = "usada";
    if (t === "x") { li.className = "excluida"; li.title = "Excluida del modelo por razones éticas"; }
    li.style.transitionDelay = (i * 0.035) + "s";
    ul.appendChild(li);
  });
})();

/* =====================================================================
   GRÁFICO DE BARRAS HORIZONTALES (genérico)
   grupos: [{ etiqueta, barras: [{ valor, color, texto, tip }] }]
   ===================================================================== */
function barras(cont, op) {
  const W = Math.max(280, cont.clientWidth);
  const angosto = W < 420;
  const etW = op.etiquetaW ? Math.min(op.etiquetaW, W * (angosto ? 0.36 : 0.38)) : 0;
  const barH = op.barH || (angosto ? 14 : 16), gapB = 3, padG = op.padG ?? 14;
  const top = op.top ?? 8, bottom = op.ticks ? 26 : 6, derecha = op.derecha ?? 52;
  const grupos = op.grupos;
  const alturaG = g => g.barras.length * (barH + gapB) - gapB;
  const H = top + bottom + grupos.reduce((a, g) => a + alturaG(g) + padG, 0) - padG + (op.refs?.some(r => r.etiqueta) ? 16 : 0);
  const x0 = etW, x1 = W - derecha;
  const log = op.escala === "log";
  const tx = v => log
    ? x0 + (Math.log(v) - Math.log(op.min)) / (Math.log(op.max) - Math.log(op.min)) * (x1 - x0)
    : x0 + (v - op.min) / (op.max - op.min) * (x1 - x0);
  const base = op.base ?? op.min;
  cont.innerHTML = "";
  const s = svg("svg", { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: "img", "aria-label": op.aria || "" }, cont);
  const yIni = top + (op.refs?.some(r => r.etiqueta) ? 16 : 0);

  // Rejilla y ejes
  if (op.ticks) {
    const gr = svg("g", { class: "rejilla" }, s);
    const ej = svg("g", { class: "eje" }, s);
    op.ticks.forEach(t => {
      svg("line", { x1: tx(t), x2: tx(t), y1: yIni - 4, y2: H - bottom + 2 }, gr);
      const tt = svg("text", { x: tx(t), y: H - 8, "text-anchor": "middle" }, ej);
      tt.textContent = op.fmtTick ? op.fmtTick(t) : t;
    });
  }
  // Líneas de referencia
  (op.refs || []).forEach(r => {
    svg("line", { x1: tx(r.valor), x2: tx(r.valor), y1: yIni - 6, y2: H - bottom, class: "linea-ref" }, s);
    if (r.etiqueta) {
      const t = svg("text", { x: tx(r.valor), y: top + 8, "text-anchor": r.ancla || "middle", class: "etiqueta" }, s);
      t.textContent = angosto && r.corta ? r.corta : r.etiqueta;
    }
  });
  // Barras
  let y = yIni;
  const anims = [];
  grupos.forEach((g, gi) => {
    const hG = alturaG(g);
    if (etW) {
      const lineas = Array.isArray(g.etiqueta) ? g.etiqueta : [g.etiqueta];
      const t = svg("text", { x: etW - 10, y: y + hG / 2 - (lineas.length - 1) * 7 + 4, "text-anchor": "end", class: "etiqueta--cat" }, s);
      lineas.forEach((l, li) => { const sp = svg("tspan", { x: etW - 10, dy: li ? 14 : 0 }, t); sp.textContent = l; });
    }
    g.barras.forEach((b, bi) => {
      const xb = tx(base), xv = tx(b.valor);
      const positivo = xv >= xb;
      const grupo = svg("g", { class: "barra" }, s);
      const p = svg("path", { fill: b.color }, grupo);
      const etq = svg("text", { y: y + barH / 2 + 4, class: "etiqueta--fuerte" }, grupo);
      etq.textContent = b.texto;
      const hit = svg("rect", { x: 0, y: y - gapB / 2, width: W, height: barH + gapB, class: "hit" }, grupo);
      if (b.tip) conTip(grupo, b.tip);
      const yy = y;
      const dibuja = f => {
        const largo = Math.abs(xv - xb) * f;
        const r = Math.min(4, largo, barH / 2);
        const xa = positivo ? xb : xb - largo;
        p.setAttribute("d", positivo
          ? `M${xa},${yy}h${largo - r}a${r},${r} 0 0 1 ${r},${r}v${barH - 2 * r}a${r},${r} 0 0 1 ${-r},${r}h${-(largo - r)}z`
          : `M${xb},${yy}h${-(largo - r)}a${r},${r} 0 0 0 ${-r},${r}v${barH - 2 * r}a${r},${r} 0 0 0 ${r},${r}h${largo - r}z`);
        etq.setAttribute("x", positivo ? xa + largo + 6 : xa - 6);
        etq.setAttribute("text-anchor", positivo ? "start" : "end");
        etq.setAttribute("opacity", f);
      };
      dibuja(0);
      anims.push([dibuja, (gi * g.barras.length + bi) * 70]);
      y += barH + gapB;
    });
    y += padG - gapB;
  });
  anims.forEach(([fn, retraso]) => setTimeout(() => tween(0, 1, op.animar ? 900 : 0, fn), op.animar ? retraso : 0));
}

/* ---------- Registro de gráficos: se dibujan al aparecer y al cambiar tamaño/tema ---------- */
const graficos = [];
function registrar(id, fn) {
  const cont = document.getElementById(id);
  if (!cont) return;
  const g = { cont, fn, visto: false };
  graficos.push(g);
  const obs = new IntersectionObserver(en => {
    if (en[0].isIntersecting && !g.visto) { g.visto = true; fn(cont, true); obs.disconnect(); }
  }, { threshold: 0.25 });
  obs.observe(cont);
}
function redibujar() {
  graficos.forEach(g => { if (g.visto) g.fn(g.cont, false); });
  dibujarDona(false);
  dibujarMedidorBase();
}
let tRes;
let anchoPrevio = innerWidth;
addEventListener("resize", () => {
  if (innerWidth === anchoPrevio) return;
  anchoPrevio = innerWidth;
  clearTimeout(tRes);
  tRes = setTimeout(redibujar, 150);
});

/* ---------- Colores por modelo (identidad fija en toda la página) ---------- */
const MODELOS = ["Regresión logística", "Árbol de decisión", "Random Forest", "Gradient Boosting"];
const colorModelo = n => css(["--m1", "--m2", "--m3", "--m4"][MODELOS.indexOf(n)]);

/* ---------- Mini gráficos del EDA ---------- */
function miniEda(datos, aria) {
  return (cont, animar) => barras(cont, {
    animar, aria, etiquetaW: 118, min: 0, max: 60, ticks: [0, 20, 40, 60], fmtTick: t => t + " %",
    refs: [{ valor: 30, etiqueta: "promedio 30 %" }], derecha: 40,
    grupos: datos.map(([et, v, n]) => ({
      etiqueta: et,
      barras: [{ valor: v, color: css("--m1"), texto: num(v, 0) + " %", tip: `<b>${et}</b><br>${num(v, 1)}&nbsp;% de malos pagadores<br>${num(n)} personas` }],
    })),
  });
}
registrar("gDuracion", miniEda(X.eda.duracion, "Porcentaje de malos pagadores por duración del crédito"));
registrar("gCuenta", miniEda(X.eda.cuenta, "Porcentaje de malos pagadores por estado de la cuenta corriente"));
registrar("gEdad", miniEda(X.eda.edad, "Porcentaje de malos pagadores por grupo de edad"));
const obsDona = new IntersectionObserver(en => { if (en[0].isIntersecting) { dibujarDona(true); obsDona.disconnect(); } }, { threshold: 0.4 });
obsDona.observe($("#dona"));

/* =====================================================================
   SECCIÓN MODELO: tarjetas de algoritmos
   ===================================================================== */
(function algoritmos() {
  const desc = {
    "Regresión logística": "Combina las variables con pesos y las convierte en probabilidad. Muy interpretable.",
    "Árbol de decisión": "Preguntas sí/no sucesivas. Reglas fáciles de leer, pero inestables.",
    "Random Forest": "Promedia 400 árboles entrenados con muestras distintas. Robusto.",
    "Gradient Boosting": "Árboles en secuencia, cada uno corrige los errores del anterior.",
  };
  const cont = $("#algoritmos");
  MODELOS.forEach((n, i) => {
    const a = document.createElement("article");
    a.className = "tarjeta algoritmo revelar";
    a.style.setProperty("--c", `var(${["--m1", "--m2", "--m3", "--m4"][i]})`);
    a.style.setProperty("--retraso", i * 0.08 + "s");
    a.innerHTML = `<h3>${n}</h3><p>${desc[n]}</p><span class="auc">ROC-AUC en validación cruzada<br><b>${num(R.cv_roc_auc[n], 3)}</b></span>`;
    cont.appendChild(a);
    obsRevelar.observe(a);
  });
  const ley = $("#leyendaModelos");
  MODELOS.forEach((n, i) => {
    ley.insertAdjacentHTML("beforeend", `<span class="leyenda"><i class="sw" style="background:var(${["--m1", "--m2", "--m3", "--m4"][i]})"></i>${n}</span>`);
  });
})();

/* =====================================================================
   RESULTADOS
   ===================================================================== */
registrar("gAuc", (cont, animar) => barras(cont, {
  animar, aria: "ROC-AUC en validación cruzada por modelo", etiquetaW: 150, min: 0.5, max: 0.85,
  ticks: [0.5, 0.6, 0.7, 0.8], fmtTick: t => num(t, 1), padG: 12, barH: 22,
  grupos: MODELOS.map(n => ({
    etiqueta: n,
    barras: [{ valor: R.cv_roc_auc[n], color: colorModelo(n), texto: num(R.cv_roc_auc[n], 3),
      tip: `<b>${n}</b><br>ROC-AUC CV: ${num(R.cv_roc_auc[n], 3)}<br>ROC-AUC prueba: ${num(R.prueba_umbral_05[n]["ROC-AUC"], 3)}` }],
  })),
}));

registrar("gCosto", (cont, animar) => barras(cont, {
  animar, aria: "Costo en prueba con umbral 0,5 y con umbral ajustado", etiquetaW: 150, min: 0, max: 400,
  ticks: [0, 100, 200, 300, 400], derecha: 40,
  refs: [
    { valor: R.referencias_costo.rechazar_a_todos, etiqueta: "rechazar a todos (175)", corta: "175", ancla: "end" },
    { valor: R.referencias_costo.aprobar_a_todos, etiqueta: "aprobar a todos (375)", corta: "375", ancla: "end" },
  ],
  grupos: MODELOS.map(n => {
    const c05 = R.prueba_umbral_05[n].Costo, cop = R.prueba_umbral_optimo[n].Costo, u = R.umbral_optimo[n];
    const cambio = (cop / c05 - 1) * 100;
    return {
      etiqueta: n,
      barras: [
        { valor: c05, color: css("--gris-serie"), texto: num(c05), tip: `<b>${n}</b><br>Umbral 0,5 → costo ${num(c05)}` },
        { valor: cop, color: css("--baja"), texto: `${num(cop)} (${cambio > 0 ? "+" : "−"}${num(Math.abs(cambio))} %)`,
          tip: `<b>${n}</b><br>Umbral ${num(u, 2)} → costo ${num(cop)}<br>Cambio: ${cambio > 0 ? "+" : "−"}${num(Math.abs(cambio))}&nbsp;%` },
      ],
    };
  }),
}));

// Tabla de métricas con pestañas
const tabla = $("#tablaMetricas");
function llenarTabla(cual) {
  const fuente = cual === "05" ? R.prueba_umbral_05 : R.prueba_umbral_optimo;
  const cols = ["Accuracy", "Recall", "Precisión", "F1", "ROC-AUC", "Costo"];
  const mejor = {}, peor = {};
  cols.forEach(c => {
    const vals = MODELOS.map(n => fuente[n][c]);
    mejor[c] = c === "Costo" ? Math.min(...vals) : Math.max(...vals);
    peor[c] = c === "Costo" ? Math.max(...vals) : null;
  });
  let h = `<thead><tr><th>Modelo</th>${cual === "opt" ? "<th>Umbral</th>" : ""}${cols.map(c => `<th>${c}</th>`).join("")}</tr></thead><tbody>`;
  MODELOS.forEach((n, i) => {
    h += `<tr style="animation-delay:${i * 0.06}s"><td><i class="sw" style="background:${colorModelo(n)}"></i>${n}</td>`;
    if (cual === "opt") h += `<td>${num(fuente[n].Umbral, 2)}</td>`;
    cols.forEach(c => {
      const v = fuente[n][c];
      const cls = v === mejor[c] ? "mejor" : (c === "Costo" && v === peor[c] ? "peor" : "");
      h += `<td class="${cls}">${c === "Costo" ? num(v) : num(v, 3)}</td>`;
    });
    h += "</tr>";
  });
  tabla.innerHTML = h + "</tbody>";
  $("#notaTabla").innerHTML = cual === "05"
    ? "En verde, el mejor valor de cada columna; en rojo, el costo más alto. Gradient Boosting tiene la mayor accuracy, pero el mayor costo: deja pasar a 40 de 75 malos pagadores."
    : "Umbrales elegidos con validación cruzada en entrenamiento, nunca con la prueba. En prueba, Gradient Boosting resulta el más barato (133), pero el modelo final se eligió por su costo en validación cruzada: Random Forest (0,512 frente a 0,520 de la regresión logística).";
}
$$(".pestanas button").forEach(b => b.addEventListener("click", () => {
  $$(".pestanas button").forEach(o => o.setAttribute("aria-selected", o === b));
  llenarTabla(b.dataset.tabla);
}));
llenarTabla("05");

// KPIs y matrices de confusión
(function finalYConfusion() {
  const rf = R.prueba_umbral_optimo["Random Forest"];
  $("#kpisFinal").innerHTML = [["Recall", num(rf.Recall, 3)], ["ROC-AUC", num(rf["ROC-AUC"], 3)], ["Costo", num(rf.Costo)]]
    .map(([k, v]) => `<li><span>${k}</span><b>${v}</b></li>`).join("");
  const cont = $("#confusiones");
  Object.entries(X.confusion).forEach(([nombre, [vn, fp, fn, vp]], i) => {
    const costo = 5 * fn + fp;
    const d = document.createElement("div");
    d.className = "tarjeta confusion revelar";
    d.style.setProperty("--retraso", (0.1 + i * 0.12) + "s");
    d.innerHTML = `<h4>${nombre}</h4><p>250 solicitantes de prueba</p>
      <div class="confusion__rejilla">
        <span></span><span class="cab">Aprueba</span><span class="cab">Rechaza</span>
        <span class="lado">Bueno</span>
        <div class="celda celda--ok" style="transition-delay:.1s"><b>${vn}</b><span>buenos aprobados</span></div>
        <div class="celda celda--fp" style="transition-delay:.2s"><b>${fp}</b><span>buenos rechazados · costo 1</span></div>
        <span class="lado">Malo</span>
        <div class="celda celda--fn" style="transition-delay:.3s"><b>${fn}</b><span>malos aprobados · costo 5</span></div>
        <div class="celda celda--ok" style="transition-delay:.4s"><b>${vp}</b><span>malos detectados</span></div>
      </div>
      <p class="confusion__costo">Costo: 5 × ${fn} + ${fp} = <b>${costo}</b></p>`;
    cont.appendChild(d);
    obsRevelar.observe(d);
  });
})();

// Importancia por permutación (Random Forest)
registrar("gImportancia", (cont, animar) => {
  const imp = R.importancia_permutacion_prueba["Random Forest"];
  const nombres = {
    cuenta_corriente: "Cuenta corriente", duracion_meses: "Duración", ahorros: "Ahorros", monto_credito: "Monto",
    edad: "Edad", historial_credito: "Historial", proposito: "Propósito", otros_deudores: "Otros deudores",
    otros_planes_pago: "Otros planes de pago", propiedad: "Propiedad",
  };
  const top = Object.entries(imp).sort((a, b) => b[1] - a[1]).slice(0, 10);
  barras(cont, {
    animar, aria: "Importancia por permutación de las 10 variables principales", etiquetaW: 150, min: 0, max: 0.16,
    ticks: [0, 0.05, 0.1, 0.15], fmtTick: t => num(t, 2), padG: 6, barH: 15,
    grupos: top.map(([k, v]) => ({
      etiqueta: nombres[k] || k,
      barras: [{ valor: v, color: css("--m3"), texto: num(v, 3), tip: `<b>${nombres[k] || k}</b><br>Caída del ROC-AUC: ${num(v, 4)}` }],
    })),
  });
});

// Odds ratios (escala logarítmica centrada en 1)
registrar("gOdds", (cont, animar) => barras(cont, {
  animar, aria: "Odds ratios de la regresión logística", etiquetaW: 170, min: 0.4, max: 1.6, base: 1, escala: "log",
  ticks: [0.5, 0.75, 1, 1.25, 1.5], fmtTick: t => num(t, 2), padG: 6, barH: 15, derecha: 44,
  grupos: X.odds.map(([et, v]) => ({
    etiqueta: et,
    barras: [{ valor: v, color: v > 1 ? css("--sube") : css("--baja"), texto: "×" + num(v, 2),
      tip: `<b>${et}</b><br>Odds ratio ×${num(v, 2)}<br>${v > 1 ? "Aumenta" : "Reduce"} las probabilidades relativas de impago` }],
  })),
}));

// Equidad por edad
registrar("gEquidadEdad", (cont, animar) => {
  const eq = R.modelo_web.equidad_edad;
  barras(cont, {
    animar, aria: "Buenos pagadores rechazados por grupo de edad", etiquetaW: 80, min: 0, max: 1,
    ticks: [0, 0.25, 0.5, 0.75, 1], fmtTick: t => num(t * 100) + " %", barH: 24, padG: 26, derecha: 44,
    grupos: Object.entries(eq).map(([g, v]) => ({
      etiqueta: g.replace("-", "–") + " años",
      barras: [
        { valor: v["Buenos rechazados — Random Forest"], color: css("--m3"), texto: pct(v["Buenos rechazados — Random Forest"]),
          tip: `<b>${g} años · Random Forest</b><br>Buenos rechazados: ${pct(v["Buenos rechazados — Random Forest"], 1)}<br>Recall: ${pct(v["Recall — Random Forest"], 1)}` },
        { valor: v["Buenos rechazados — modelo web"], color: css("--m4"), texto: pct(v["Buenos rechazados — modelo web"]),
          tip: `<b>${g} años · Modelo web</b><br>Buenos rechazados: ${pct(v["Buenos rechazados — modelo web"], 1)}<br>Recall: ${pct(v["Recall — modelo web"], 1)}` },
      ],
    })),
  });
});

/* =====================================================================
   GALERÍA
   ===================================================================== */
const FIGURAS = [
  ["01_objetivo", "Distribución de buenos y malos pagadores", "Exploración"],
  ["02_densidades", "Duración, monto y edad por tipo de riesgo", "Exploración"],
  ["03_boxplots", "Variables numéricas por tipo de riesgo", "Exploración"],
  ["04_duracion_monto", "Monto vs. duración y riesgo por plazo", "Exploración"],
  ["05_tasa_categorias", "% de malos por categoría (13 variables)", "Exploración"],
  ["06_heatmap_cuenta_historial", "Cuenta corriente × historial crediticio", "Exploración"],
  ["07_edad_sexo", "Riesgo por edad y por sexo", "Exploración"],
  ["08_correlacion", "Matriz de correlación", "Exploración"],
  ["09_cramer_info_mutua", "V de Cramér e información mutua", "Modelado"],
  ["10_division", "División entrenamiento / prueba", "Modelado"],
  ["11_cv_boxplot", "ROC-AUC en validación cruzada", "Modelado"],
  ["12_arbol", "Primeros niveles del árbol de decisión", "Modelado"],
  ["13_metricas_prueba", "Métricas en prueba (umbral 0,5)", "Evaluación"],
  ["14_roc", "Curvas ROC", "Evaluación"],
  ["15_confusion_05", "Matrices de confusión (umbral 0,5)", "Evaluación"],
  ["16_costo_umbral", "Costo según el umbral", "Evaluación"],
  ["17_costo_prueba", "Costo en prueba: 0,5 vs. ajustado", "Evaluación"],
  ["18_confusion_final", "Modelo final antes y después del ajuste", "Evaluación"],
  ["19_importancia", "Importancia por permutación", "Interpretación"],
  ["20_odds_ratios", "Odds ratios de la regresión logística", "Interpretación"],
  ["21_explicacion_individual", "Explicación de dos solicitantes", "Interpretación"],
  ["22_equidad", "Equidad por sexo y edad", "Equidad y web"],
  ["23_modelo_web", "Modelo completo vs. modelo web", "Equidad y web"],
  ["24_equidad_web", "Brecha por edad: modelo final vs. web", "Equidad y web"],
];
(function galeria() {
  const grid = $("#galeria-grid"), filtros = $("#filtrosGaleria");
  const cats = ["Todos", ...new Set(FIGURAS.map(f => f[2]))];
  cats.forEach((c, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.textContent = c; b.setAttribute("aria-pressed", i === 0);
    b.addEventListener("click", () => {
      $$("button", filtros).forEach(o => o.setAttribute("aria-pressed", o === b));
      $$(".galeria__item", grid).forEach(it => it.classList.toggle("oculto", c !== "Todos" && it.dataset.cat !== c));
    });
    filtros.appendChild(b);
  });
  FIGURAS.forEach(([arch, titulo, cat], i) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "galeria__item revelar"; b.dataset.cat = cat; b.dataset.i = i;
    b.style.setProperty("--retraso", (i % 4) * 0.06 + "s");
    b.innerHTML = `<div class="galeria__img"><img src="img/figuras/${arch}.png" alt="${titulo}" loading="lazy"></div><span>${titulo}<small>${cat} · figura ${i + 1}</small></span>`;
    b.addEventListener("click", () => abrirVisor(i));
    grid.appendChild(b);
    obsRevelar.observe(b);
  });
  const visor = $("#visor");
  let actual = 0;
  function abrirVisor(i) {
    actual = (i + FIGURAS.length) % FIGURAS.length;
    const [arch, titulo] = FIGURAS[actual];
    $("#visorImg").src = `img/figuras/${arch}.png`;
    $("#visorImg").alt = titulo;
    $("#visorCap").textContent = `Figura ${actual + 1}. ${titulo}`;
    if (!visor.open) visor.showModal();
  }
  $("#visorCerrar").addEventListener("click", () => visor.close());
  $("#visorAnt").addEventListener("click", () => abrirVisor(actual - 1));
  $("#visorSig").addEventListener("click", () => abrirVisor(actual + 1));
  visor.addEventListener("click", e => { if (e.target === visor) visor.close(); });
  visor.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") abrirVisor(actual - 1);
    if (e.key === "ArrowRight") abrirVisor(actual + 1);
  });
})();

/* =====================================================================
   SIMULADOR
   ===================================================================== */
const UMBRAL = M.umbral;
const Z_UMBRAL = Math.log(UMBRAL / (1 - UMBRAL));
const ORDEN = {
  cuenta_corriente: ["Saldo negativo", "0 a 200 DM", "200 DM o más", "Sin cuenta"],
  ahorros: ["Menos de 100 DM", "100 a 500 DM", "500 a 1000 DM", "1000 DM o más", "Sin ahorros / desconocido"],
  historial_credito: ["Sin créditos / todo pagado", "Todo pagado en este banco", "Pagando al día", "Atrasos en el pasado", "Cuenta crítica / créditos en otros bancos"],
  otros_planes_pago: ["Ninguno", "Banco", "Tiendas"],
  propiedad: ["Inmueble", "Seguro de vida / ahorro vivienda", "Auto u otro bien", "Sin propiedad / desconocido"],
};
const VARS = [
  { k: "duracion_meses", nombre: "Duración", tipo: "num", txt: v => `${v} meses` },
  { k: "monto_credito", nombre: "Monto", tipo: "num", txt: v => `${num(v)} DM` },
  { k: "cuota_pct_ingreso", nombre: "Peso de la cuota", tipo: "num", txt: v => `nivel ${v} de 4` },
  { k: "cuenta_corriente", nombre: "Cuenta corriente", tipo: "cat" },
  { k: "ahorros", nombre: "Ahorros", tipo: "cat" },
  { k: "historial_credito", nombre: "Historial", tipo: "cat" },
  { k: "otros_planes_pago", nombre: "Otros planes de pago", tipo: "cat" },
  { k: "propiedad", nombre: "Propiedad", tipo: "cat" },
];
// Comprobación: las categorías del JSON deben coincidir con las del formulario
Object.entries(ORDEN).forEach(([k, cats]) => {
  const json = Object.keys(M.categoricas[k]).sort().join("|");
  if (json !== [...cats].sort().join("|")) console.error("Categorías distintas en", k);
});

const PERFILES = {
  base:   { duracion_meses: 18, monto_credito: 2300, cuota_pct_ingreso: 3, cuenta_corriente: "0 a 200 DM", ahorros: "Menos de 100 DM", historial_credito: "Pagando al día", otros_planes_pago: "Ninguno", propiedad: "Auto u otro bien" },
  bajo:   { duracion_meses: 12, monto_credito: 1500, cuota_pct_ingreso: 2, cuenta_corriente: "Sin cuenta", ahorros: "Sin ahorros / desconocido", historial_credito: "Cuenta crítica / créditos en otros bancos", otros_planes_pago: "Ninguno", propiedad: "Inmueble" },
  limite: { duracion_meses: 24, monto_credito: 3000, cuota_pct_ingreso: 3, cuenta_corriente: "Sin cuenta", ahorros: "Menos de 100 DM", historial_credito: "Pagando al día", otros_planes_pago: "Ninguno", propiedad: "Auto u otro bien" },
  alto:   { duracion_meses: 48, monto_credito: 8000, cuota_pct_ingreso: 4, cuenta_corriente: "Saldo negativo", ahorros: "Menos de 100 DM", historial_credito: "Sin créditos / todo pagado", otros_planes_pago: "Banco", propiedad: "Sin propiedad / desconocido" },
};
const estado = { ...PERFILES.base };

function contribuciones(x) {
  const c = {};
  for (const [k, info] of Object.entries(M.numericas)) c[k] = info.coef * (x[k] - info.media) / info.desviacion;
  for (const [k, cats] of Object.entries(M.categoricas)) c[k] = cats[x[k]] ?? 0;
  return c;
}
function puntaje(x) {
  const c = contribuciones(x);
  const z = M.intercepto + Object.values(c).reduce((a, b) => a + b, 0);
  return { z, p: 1 / (1 + Math.exp(-z)), c };
}

// ---- Construcción del formulario ----
const form = $("#formSim");
function pintarRango(inp) {
  const p = (inp.value - inp.min) / (inp.max - inp.min) * 100;
  inp.style.setProperty("--p", p + "%");
}
["duracion_meses", "monto_credito"].forEach(k => {
  const inp = $("#" + k);
  inp.addEventListener("input", () => { estado[k] = Number(inp.value); actualizarSimulador(true); });
});
Object.entries(ORDEN).forEach(([k, cats]) => {
  const sel = $("#" + k);
  cats.forEach(c => sel.insertAdjacentHTML("beforeend", `<option value="${c}">${c}</option>`));
  sel.addEventListener("change", () => { estado[k] = sel.value; actualizarSimulador(true); });
});
const seg = $("#cuota_pct_ingreso");
[1, 2, 3, 4].forEach(v => {
  const b = document.createElement("button");
  b.type = "button"; b.setAttribute("role", "radio"); b.textContent = v; b.dataset.v = v;
  b.setAttribute("aria-label", `Nivel ${v} de 4`);
  b.addEventListener("click", () => { estado.cuota_pct_ingreso = v; actualizarSimulador(true); });
  seg.appendChild(b);
});

function sincronizarFormulario(resaltar = []) {
  ["duracion_meses", "monto_credito"].forEach(k => { const i = $("#" + k); i.value = estado[k]; pintarRango(i); });
  $("#o_duracion_meses").textContent = `${estado.duracion_meses} meses`;
  $("#o_monto_credito").textContent = `${num(estado.monto_credito)} DM`;
  Object.keys(ORDEN).forEach(k => { $("#" + k).value = estado[k]; });
  $$("button", seg).forEach(b => b.setAttribute("aria-checked", Number(b.dataset.v) === estado.cuota_pct_ingreso));
  resaltar.forEach(k => {
    const el = $("#" + k);
    el.classList.remove("cambio"); void el.offsetWidth; el.classList.add("cambio");
  });
}

// ---- Medidor semicircular ----
const med = $("#medidor");
const CX = 160, CY = 160, RAD = 130;
const punto = (f, r = RAD) => { const a = Math.PI * (1 - f); return [CX + r * Math.cos(a), CY - r * Math.sin(a)]; };
const arco = (f0, f1, r = RAD) => { const [x0, y0] = punto(f0, r), [x1, y1] = punto(f1, r); return `M${x0},${y0}A${r},${r} 0 0 1 ${x1},${y1}`; };
let medArco, medAguja, pActual = 0;
function dibujarMedidorBase() {
  med.innerHTML = "";
  svg("path", { d: arco(0, 1), class: "medidor__pista" }, med);
  svg("path", { d: arco(0.002, UMBRAL), class: "medidor__zona", stroke: css("--ok") }, med);
  svg("path", { d: arco(UMBRAL, 0.998), class: "medidor__zona", stroke: css("--critico") }, med);
  medArco = svg("path", { d: arco(0, 0.001), class: "medidor__arco" }, med);
  const [ux0, uy0] = punto(UMBRAL, RAD - 18), [ux1, uy1] = punto(UMBRAL, RAD + 18);
  svg("line", { x1: ux0, y1: uy0, x2: ux1, y2: uy1, class: "medidor__umbral" }, med);
  const [tx, ty] = punto(UMBRAL, RAD + 32);
  const t = svg("text", { x: tx, y: ty, "text-anchor": "middle", class: "medidor__marca-txt" }, med);
  t.textContent = "umbral " + num(UMBRAL * 100) + " %";
  [[0, "0 %"], [1, "100 %"]].forEach(([f, s]) => {
    const [x, y] = punto(f, RAD);
    const tt = svg("text", { x, y: y + 30, "text-anchor": "middle", class: "medidor__marca-txt" }, med);
    tt.textContent = s;
  });
  medAguja = svg("circle", { r: 13, class: "medidor__punta" }, med);
  pintarMedidor(pActual);
}
function pintarMedidor(p) {
  const f = Math.max(0.001, Math.min(0.999, p));
  medArco.setAttribute("d", arco(0, f));
  medArco.setAttribute("stroke", p >= UMBRAL ? css("--critico") : css("--ok"));
  const [px, py] = punto(f);
  medAguja.setAttribute("cx", px); medAguja.setAttribute("cy", py);
  medAguja.setAttribute("fill", p >= UMBRAL ? css("--critico") : css("--ok"));
  $("#puntaje").textContent = num(p * 100);
}

// ---- Contribuciones ----
const contrib = $("#contrib");
VARS.forEach(v => {
  contrib.insertAdjacentHTML("beforeend", `
    <div class="contrib__fila" data-k="${v.k}">
      <div class="contrib__nombre"><b>${v.nombre}</b><span></span></div>
      <div class="contrib__pista"><div class="contrib__barra"></div><span class="contrib__valor"></span></div>
    </div>`);
});
$$(".contrib__fila", contrib).forEach(fila => { fila.addEventListener("pointermove", moverTip); fila.addEventListener("pointerleave", ocultarTip); });
const ESCALA_C = 1.1; // máximo |contribución| posible ≈ 1,01 (duración de 72 meses)
const textoValor = (v, k) => v.tipo === "num" ? v.txt(estado[k]) : estado[k];
function pintarContrib(c) {
  VARS.forEach(v => {
    const fila = $(`.contrib__fila[data-k="${v.k}"]`, contrib);
    const val = c[v.k];
    const ancho = Math.min(1, Math.abs(val) / ESCALA_C) * 50;
    const barra = $(".contrib__barra", fila), etq = $(".contrib__valor", fila);
    barra.className = "contrib__barra " + (val >= 0 ? "contrib__barra--sube" : "contrib__barra--baja");
    barra.style.left = (val >= 0 ? 50 : 50 - ancho) + "%";
    barra.style.width = Math.max(ancho, 0.6) + "%";
    etq.textContent = signo(val);
    if (val >= 0) { etq.style.left = `calc(${50 + ancho}% + 6px)`; etq.style.transform = "none"; }
    else { etq.style.left = `calc(${50 - ancho}% - 6px)`; etq.style.transform = "translateX(-100%)"; }
    $(".contrib__nombre span", fila).textContent = textoValor(v, v.k);
    fila.onpointerenter = e => mostrarTip(e, `<b>${v.nombre}: ${textoValor(v, v.k)}</b><br>Aporte al puntaje (escala logit): ${signo(val, 3)}<br>${val >= 0 ? "Aumenta" : "Reduce"} el riesgo`);
  });
  const orden = VARS.map(v => [v, c[v.k]]).sort((a, b) => b[1] - a[1]);
  const sube = orden.filter(o => o[1] > 0.02).slice(0, 2), baja = orden.filter(o => o[1] < -0.02).reverse().slice(0, 2);
  const lista = arr => arr.map(([v]) => `<strong>${v.nombre.toLowerCase()}</strong> (${textoValor(v, v.k)})`).join(" y ");
  $("#frases").innerHTML =
    (sube.length ? `Lo que más <span style="color:var(--sube);font-weight:700">aumenta</span> el riesgo: ${lista(sube)}. ` : "Ninguna respuesta aumenta el riesgo de forma notable. ") +
    (baja.length ? `Lo que más lo <span style="color:var(--baja);font-weight:700">reduce</span>: ${lista(baja)}.` : "Ninguna respuesta lo reduce de forma notable.");
}

// ---- Contrafactuales: el cambio mínimo que cambia la decisión ----
const ACCIONABLES = ["duracion_meses", "monto_credito", "cuota_pct_ingreso", "cuenta_corriente", "ahorros", "otros_planes_pago", "propiedad"];
function sugerencias() {
  const { p } = puntaje(estado);
  const rechazado = p >= UMBRAL;
  const lista = [];
  const prueba = cambio => ({ ...estado, ...cambio });
  const cruza = x => (puntaje(x).p >= UMBRAL) !== rechazado;
  // Numéricas: valor exacto que cruza el umbral
  const numerica = (k, paso, minimo, maximo, texto) => {
    const info = M.numericas[k];
    const { z } = puntaje(estado);
    const delta = Z_UMBRAL - z + (rechazado ? -1e-6 : 1e-6);
    let objetivo = estado[k] + delta * info.desviacion / info.coef;
    objetivo = rechazado ? Math.floor(objetivo / paso) * paso : Math.ceil(objetivo / paso) * paso;
    if (objetivo >= minimo && objetivo <= maximo && objetivo !== estado[k] && cruza(prueba({ [k]: objetivo })))
      lista.push({ cambio: { [k]: objetivo }, texto: texto(objetivo) });
  };
  numerica("duracion_meses", 1, 4, 72, v => rechazado ? `Reducir el plazo a <strong>${v} meses</strong>` : `Si el plazo subiera a <strong>${v} meses</strong>`);
  numerica("monto_credito", 50, 250, 18424, v => rechazado ? `Pedir <strong>${num(v)} DM</strong> o menos` : `Si el monto subiera a <strong>${num(v)} DM</strong>`);
  const cuotas = rechazado ? [3, 2, 1].filter(v => v < estado.cuota_pct_ingreso) : [2, 3, 4].filter(v => v > estado.cuota_pct_ingreso);
  const cuota = cuotas.find(v => cruza(prueba({ cuota_pct_ingreso: v })));
  if (cuota) lista.push({ cambio: { cuota_pct_ingreso: cuota }, texto: rechazado ? `Bajar el peso de la cuota al <strong>nivel ${cuota}</strong>` : `Si el peso de la cuota subiera al <strong>nivel ${cuota}</strong>` });
  // Categóricas: la opción que cruza con el menor salto
  ["cuenta_corriente", "ahorros", "otros_planes_pago", "propiedad"].forEach(k => {
    const opciones = ORDEN[k].filter(o => o !== estado[k]).map(o => ({ o, p: puntaje(prueba({ [k]: o })).p })).filter(r => (r.p >= UMBRAL) !== rechazado);
    if (!opciones.length) return;
    opciones.sort((a, b) => rechazado ? b.p - a.p : a.p - b.p);
    const nombre = VARS.find(v => v.k === k).nombre.toLowerCase();
    lista.push({ cambio: { [k]: opciones[0].o }, texto: `${rechazado ? "Cambiar" : "Si cambiara"} ${nombre} a <strong>${opciones[0].o}</strong>` });
  });
  lista.forEach(s => { s.p = puntaje(prueba(s.cambio)).p; });
  lista.sort((a, b) => rechazado ? b.p - a.p : a.p - b.p);
  if (rechazado && !lista.length) { const comb = combinacion(); if (comb) lista.push(comb); }
  return { rechazado, p, lista: lista.slice(0, 4) };
}
// Búsqueda voraz: aplica el cambio que más baja el puntaje, hasta 3 pasos
function combinacion() {
  let x = { ...estado };
  const pasos = [], cambio = {};
  for (let i = 0; i < 3; i++) {
    const cands = [];
    if (x.duracion_meses > 12) cands.push({ c: { duracion_meses: Math.max(6, x.duracion_meses - 12) }, t: v => `plazo de ${v.duracion_meses} meses` });
    if (x.monto_credito > 1000) cands.push({ c: { monto_credito: Math.max(250, Math.round(x.monto_credito * 0.6 / 50) * 50) }, t: v => `monto de ${num(v.monto_credito)} DM` });
    if (x.cuota_pct_ingreso > 1) cands.push({ c: { cuota_pct_ingreso: x.cuota_pct_ingreso - 1 }, t: v => `cuota nivel ${v.cuota_pct_ingreso}` });
    ["cuenta_corriente", "ahorros", "otros_planes_pago", "propiedad"].forEach(k => {
      if (k in cambio) return;
      ORDEN[k].filter(o => o !== x[k]).forEach(o => cands.push({ c: { [k]: o }, t: v => `${VARS.find(z => z.k === k).nombre.toLowerCase()}: ${v[k]}` }));
    });
    let mejor = null;
    cands.forEach(cd => { const p = puntaje({ ...x, ...cd.c }).p; if (!mejor || p < mejor.p) mejor = { ...cd, p }; });
    if (!mejor) break;
    x = { ...x, ...mejor.c };
    Object.assign(cambio, mejor.c);
    pasos.push(mejor.t(x));
    if (mejor.p < UMBRAL) return { cambio, texto: `Ningún cambio individual alcanza. Combinando: <strong>${pasos.join(" + ")}</strong>`, p: mejor.p };
  }
  return null;
}
function pintarSugerencias() {
  const { rechazado, p, lista } = sugerencias();
  const margen = Math.abs(p - UMBRAL) * 100;
  $("#cfTitulo").textContent = rechazado ? "¿Qué cambio mínimo lo haría aprobable?" : "¿Qué lo pasaría a riesgo alto?";
  $("#cfSub").textContent = rechazado
    ? `El puntaje está ${num(margen, 1)} puntos por encima del umbral. Cambios de una sola respuesta que bastan para bajar de ${num(UMBRAL * 100)} %:`
    : `El puntaje está ${num(margen, 1)} puntos por debajo del umbral. Cambios de una sola respuesta que bastarían para superarlo:`;
  const cont = $("#cfLista");
  if (!lista.length) {
    cont.innerHTML = `<p class="cf__vacio">${rechazado ? "Ningún cambio en una sola respuesta alcanza: harían falta varios cambios a la vez. Prueba combinando un plazo menor con más ahorros." : "Ningún cambio en una sola respuesta lo llevaría al rechazo: el perfil es sólido."}</p>`;
    return;
  }
  cont.innerHTML = "";
  lista.forEach((s, i) => {
    const d = document.createElement("div");
    d.className = "cf__item";
    d.style.animationDelay = i * 0.06 + "s";
    d.innerHTML = `<span class="cf__icono">${rechazado ? "↓" : "↑"}</span>
      <span class="cf__texto">${s.texto}<small>El puntaje pasaría de ${num(p * 100)} % a ${num(s.p * 100)} % → ${s.p >= UMBRAL ? "rechazar" : "aprobar"}</small></span>
      <button type="button" class="cf__btn">Probar</button>`;
    $(".cf__btn", d).addEventListener("click", () => {
      Object.assign(estado, s.cambio);
      actualizarSimulador(true, Object.keys(s.cambio));
    });
    cont.appendChild(d);
  });
}

// ---- Traza del puntaje ----
const historial = [];
function pintarTraza() {
  const s = $("#traza");
  s.innerHTML = "";
  const W = 300, H = 46, n = historial.length;
  const y = p => H - 4 - p * (H - 8);
  svg("line", { x1: 0, x2: W, y1: y(UMBRAL), y2: y(UMBRAL) }, s);
  if (n < 2) return;
  const x = i => (i / (n - 1)) * (W - 8) + 4;
  const pts = historial.map((p, i) => `${x(i)},${y(p)}`);
  svg("path", { d: `M${x(0)},${H}L${pts.join("L")}L${x(n - 1)},${H}Z`, class: "area" }, s);
  svg("path", { d: "M" + pts.join("L") }, s);
  svg("circle", { cx: x(n - 1), cy: y(historial[n - 1]), r: 4 }, s);
}

// ---- Actualización principal ----
let rechazoPrevio = null;
function actualizarSimulador(animar = true, resaltar = []) {
  sincronizarFormulario(resaltar);
  const { p, c } = puntaje(estado);
  const desde = pActual;
  pActual = p;
  tween(desde, p, animar ? 700 : 0, pintarMedidor);
  const rech = p >= UMBRAL;
  const v = $("#veredicto");
  v.className = "veredicto " + (rech ? "veredicto--rechazar" : "veredicto--aprobar");
  v.innerHTML = rech
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>Riesgo alto: se recomienda rechazar`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M8 12.5l2.8 2.8L16 10"/></svg>Riesgo bajo: se recomienda aprobar`;
  if (rechazoPrevio !== null && rechazoPrevio !== rech) { void v.offsetWidth; v.classList.add("salto"); }
  rechazoPrevio = rech;
  pintarContrib(c);
  pintarSugerencias();
  if (!historial.length || Math.abs(historial[historial.length - 1] - p) > 1e-9) {
    historial.push(p);
    if (historial.length > 30) historial.shift();
  }
  pintarTraza();
}

$$(".perfil").forEach(b => b.addEventListener("click", () => {
  const k = b.dataset.perfil;
  if (k === "azar") {
    const azar = arr => arr[Math.floor(Math.random() * arr.length)];
    Object.assign(estado, {
      duracion_meses: 6 + Math.round(Math.random() * 42),
      monto_credito: Math.round((500 + Math.random() * 9000) / 50) * 50,
      cuota_pct_ingreso: 1 + Math.floor(Math.random() * 4),
    });
    Object.keys(ORDEN).forEach(o => { estado[o] = azar(ORDEN[o]); });
  } else {
    Object.assign(estado, PERFILES[k]);
  }
  actualizarSimulador(true, VARS.map(v => v.k));
}));

dibujarMedidorBase();
actualizarSimulador(false);
// Animación de entrada del medidor cuando aparece en pantalla
const obsMed = new IntersectionObserver(en => {
  if (en[0].isIntersecting) { const p = pActual; pActual = 0; pintarMedidor(0); tween(0, p, 1200, pintarMedidor); pActual = p; obsMed.disconnect(); }
}, { threshold: 0.5 });
obsMed.observe(med);

})();
