const canvas = document.getElementById("simCanvas");
const ctx = canvas.getContext("2d");

const controls = {
  modeSelect: document.getElementById("modeSelect"),
  baseN: document.getElementById("baseN"),
  dispersion: document.getElementById("dispersion"),
  beamHeight: document.getElementById("beamHeight"),
  dropRadius: document.getElementById("dropRadius"),
  themeBtn: document.getElementById("themeBtn"),
  resetBtn: document.getElementById("resetBtn"),
  animateBtn: document.getElementById("animateBtn"),
  teacherPlayBtn: document.getElementById("teacherPlayBtn"),
  teacherPauseBtn: document.getElementById("teacherPauseBtn"),
  teacherNextBtn: document.getElementById("teacherNextBtn"),
  prevStepBtn: document.getElementById("prevStepBtn"),
  nextStepBtn: document.getElementById("nextStepBtn"),
  tabBtnOverview: document.getElementById("tabBtnOverview"),
  tabBtnControls: document.getElementById("tabBtnControls"),
  tabBtnTeacher: document.getElementById("tabBtnTeacher")
};

const outputs = {
  baseNValue: document.getElementById("baseNValue"),
  dispersionValue: document.getElementById("dispersionValue"),
  beamHeightValue: document.getElementById("beamHeightValue"),
  dropRadiusValue: document.getElementById("dropRadiusValue"),
  contextHint: document.getElementById("contextHint"),
  sceneTitle: document.getElementById("sceneTitle"),
  sceneSubtitle: document.getElementById("sceneSubtitle"),
  teacherStatus: document.getElementById("teacherStatus"),
  teacherCue: document.getElementById("teacherCue"),
  orderStatement: document.getElementById("orderStatement"),
  angleHeader: document.getElementById("angleHeader"),
  dataBody: document.getElementById("dataBody"),
  guideStep: document.getElementById("guideStep"),
  guideAction: document.getElementById("guideAction"),
  guideObserve: document.getElementById("guideObserve"),
  explanation: document.getElementById("explanation"),
  helpOverview: document.getElementById("helpOverview"),
  helpControls: document.getElementById("helpControls"),
  helpTeacher: document.getElementById("helpTeacher")
};

const defaultsByMode = {
  raindrop: { baseN: 1.331, dispersion: 0.012, beamHeight: 0, dropRadius: 150, zoom: 1.0, prismRotate: 0 },
  prism: { baseN: 1.512, dispersion: 0.018, beamHeight: 12, dropRadius: 150, zoom: 1.0, prismRotate: 0 }
};

const spectral = [
  { name: "Red", wavelength: 650, color: "#ff4040" },
  { name: "Orange", wavelength: 610, color: "#ff9a34" },
  { name: "Yellow", wavelength: 580, color: "#ffde45" },
  { name: "Green", wavelength: 535, color: "#56e57a" },
  { name: "Blue", wavelength: 490, color: "#4ea4ff" },
  { name: "Indigo", wavelength: 450, color: "#7b74ff" },
  { name: "Violet", wavelength: 420, color: "#c567ff" }
];

const lessons = {
  raindrop: [
    { action: "Click Animate Rays.", observe: "White light enters, reflects once, and exits as separated colors." },
    { action: "Mouse wheel on the canvas to zoom in.", observe: "You can inspect the first refraction and internal path clearly." },
    { action: "Increase dispersion.", observe: "Red-violet separation grows, making a wider rainbow band." },
    { action: "Check the observer overlay.", observe: "It shows the actual sky order: red outer/top, violet inner/bottom." }
  ],
  prism: [
    { action: "Switch to Regular Prism.", observe: "White light splits after two refractions." },
    { action: "Mouse drag on the canvas.", observe: "Drag horizontally to rotate the prism in real time." },
    { action: "Mouse wheel to zoom.", observe: "Zoom reveals the entry and exit bending more clearly." },
    { action: "Increase dispersion.", observe: "Violet bends most, red bends least." }
  ]
};

const teacherScript = [
  {
    title: "Cue 1/8: Prism Baseline",
    narration: "Start with a regular prism. White light enters from the left and exits separated.",
    durationSec: 12,
    mode: "prism",
    settings: { baseN: 1.512, dispersion: 0.012, beamHeight: 0, dropRadius: 150, zoom: 1.0, prismRotate: 0 },
    animate: true
  },
  {
    title: "Cue 2/8: Increase Prism Dispersion",
    narration: "Increase dispersion: violet bends more than red, widening the color fan.",
    durationSec: 12,
    mode: "prism",
    settings: { baseN: 1.512, dispersion: 0.025, beamHeight: 0, dropRadius: 150, zoom: 1.2, prismRotate: 0 },
    animate: true
  },
  {
    title: "Cue 3/8: Rotate Prism",
    narration: "Rotate the prism. Direction changes, but color-order logic does not.",
    durationSec: 11,
    mode: "prism",
    settings: { baseN: 1.55, dispersion: 0.02, beamHeight: 8, dropRadius: 150, zoom: 1.25, prismRotate: 20 },
    animate: true
  },
  {
    title: "Cue 4/8: Transition to Raindrop",
    narration: "In raindrops, there is refraction in, one internal reflection, then refraction out.",
    durationSec: 12,
    mode: "raindrop",
    settings: { baseN: 1.331, dispersion: 0.012, beamHeight: 0, dropRadius: 165, zoom: 1.15, prismRotate: 0 },
    animate: true
  },
  {
    title: "Cue 5/8: Why Red Is Top",
    narration: "Use the observer overlay: red is outer/top in the sky because it exits at larger rainbow angle.",
    durationSec: 13,
    mode: "raindrop",
    settings: { baseN: 1.331, dispersion: 0.012, beamHeight: 0, dropRadius: 180, zoom: 1.35, prismRotate: 0 },
    animate: true
  },
  {
    title: "Cue 6/8: Wider Rainbow",
    narration: "Increase dispersion. The red-violet angular gap grows but red remains outer/top.",
    durationSec: 12,
    mode: "raindrop",
    settings: { baseN: 1.331, dispersion: 0.026, beamHeight: 0, dropRadius: 180, zoom: 1.45, prismRotate: 0 },
    animate: true
  },
  {
    title: "Cue 7/8: Geometry Change",
    narration: "Change beam height to alter path geometry while preserving color-order rule.",
    durationSec: 11,
    mode: "raindrop",
    settings: { baseN: 1.331, dispersion: 0.02, beamHeight: 20, dropRadius: 170, zoom: 1.3, prismRotate: 0 },
    animate: true
  },
  {
    title: "Cue 8/8: Summary",
    narration: "Dispersion controls splitting. In primary rainbows, red appears on outer/top edge.",
    durationSec: 14,
    mode: "prism",
    settings: { baseN: 1.512, dispersion: 0.018, beamHeight: 0, dropRadius: 150, zoom: 1.1, prismRotate: -10 },
    animate: true
  }
];

const teacherState = { running: false, paused: false, cueIndex: 0, cueEndMs: 0 };
const camera = { zoom: 1.0, prismRotate: 0 };
const pointer = { dragging: false, lastX: 0 };

let animate = false;
let isDarkMode = false;
let stepIndexByMode = { raindrop: 0, prism: 0 };

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

function radToDeg(rad) {
  return (rad * 180) / Math.PI;
}

function normalize(v) {
  const len = Math.hypot(v.x, v.y) || 1;
  return { x: v.x / len, y: v.y / len };
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y;
}

function cross(a, b) {
  return a.x * b.y - a.y * b.x;
}

function add(a, b) {
  return { x: a.x + b.x, y: a.y + b.y };
}

function sub(a, b) {
  return { x: a.x - b.x, y: a.y - b.y };
}

function scale(v, s) {
  return { x: v.x * s, y: v.y * s };
}

function rotatePoint(point, center, angleDeg) {
  const a = degToRad(angleDeg);
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return { x: center.x + dx * c - dy * s, y: center.y + dx * s + dy * c };
}

function getRowByName(rays, name, fallbackIndex) {
  return rays.find((row) => row.name === name) ?? rays[fallbackIndex];
}

function reflectDir(incident, normal) {
  const i = normalize(incident);
  const n = normalize(normal);
  const d = dot(i, n);
  return normalize({ x: i.x - 2 * d * n.x, y: i.y - 2 * d * n.y });
}

function refractDir(incident, normal, n1, n2) {
  let i = normalize(incident);
  let n = normalize(normal);
  let cosi = clamp(dot(i, n), -1, 1);
  let etai = n1;
  let etat = n2;

  if (cosi < 0) {
    cosi = -cosi;
  } else {
    const temp = etai;
    etai = etat;
    etat = temp;
    n = { x: -n.x, y: -n.y };
  }

  const eta = etai / etat;
  const k = 1 - eta * eta * (1 - cosi * cosi);
  if (k < 0) return null;

  return normalize({
    x: eta * i.x + (eta * cosi - Math.sqrt(k)) * n.x,
    y: eta * i.y + (eta * cosi - Math.sqrt(k)) * n.y
  });
}

function intersectRayCircle(point, dir, center, radius) {
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  const b = 2 * (dx * dir.x + dy * dir.y);
  const c = dx * dx + dy * dy - radius * radius;
  const disc = b * b - 4 * c;
  if (disc < 0) return null;

  const sqrtDisc = Math.sqrt(disc);
  const t1 = (-b - sqrtDisc) / 2;
  const t2 = (-b + sqrtDisc) / 2;
  const eps = 1e-4;

  let t = Number.POSITIVE_INFINITY;
  if (t1 > eps) t = Math.min(t, t1);
  if (t2 > eps) t = Math.min(t, t2);
  if (!Number.isFinite(t)) return null;

  return { t, point: { x: point.x + dir.x * t, y: point.y + dir.y * t } };
}

function intersectRaySegment(rayPoint, rayDir, a, b) {
  const r = rayDir;
  const s = sub(b, a);
  const denom = cross(r, s);
  if (Math.abs(denom) < 1e-7) return null;

  const ap = sub(a, rayPoint);
  const t = cross(ap, s) / denom;
  const u = cross(ap, r) / denom;
  if (t <= 1e-4 || u < -1e-4 || u > 1.0001) return null;

  return { t, point: add(rayPoint, scale(r, t)) };
}

function rainbowPrimaryAngleFromIndex(n) {
  let minDeviation = Number.POSITIVE_INFINITY;
  let minI = 0;

  for (let iDeg = 0.01; iDeg <= 89.99; iDeg += 0.01) {
    const i = degToRad(iDeg);
    const sinR = Math.sin(i) / n;
    if (Math.abs(sinR) > 1) continue;

    const r = Math.asin(sinR);
    const deviation = 180 + 2 * iDeg - 4 * radToDeg(r);
    if (deviation < minDeviation) {
      minDeviation = deviation;
      minI = iDeg;
    }
  }

  return { incidentDeg: minI, rainbowDeg: 180 - minDeviation };
}

function getMode() {
  return controls.modeSelect.value;
}

function getSpectrumData() {
  const baseN = Number(controls.baseN.value);
  const dispersion = Number(controls.dispersion.value);

  return spectral.map((entry, idx) => {
    const fraction = idx / (spectral.length - 1);
    const n = baseN + dispersion * fraction;
    const rainbow = rainbowPrimaryAngleFromIndex(n);
    return { ...entry, n, rainbowIncidentDeg: rainbow.incidentDeg, rainbowDeg: rainbow.rainbowDeg };
  });
}

function traceRaindropRay({ n, center, radius, beamHeight, incidentDeg }) {
  const impactY = radius * Math.sin(degToRad(incidentDeg)) + beamHeight;
  const start = { x: center.x - radius - 360, y: center.y - impactY };
  const incoming = { x: 1, y: 0 };

  const hit1 = intersectRayCircle(start, incoming, center, radius);
  if (!hit1) return null;

  const normal1 = normalize(sub(hit1.point, center));
  const inside = refractDir(incoming, normal1, 1, n);
  if (!inside) return null;

  const hit2 = intersectRayCircle(add(hit1.point, scale(inside, 0.01)), inside, center, radius);
  if (!hit2) return null;

  const normal2 = normalize(sub(hit2.point, center));
  const reflected = reflectDir(inside, normal2);

  const hit3 = intersectRayCircle(add(hit2.point, scale(reflected, 0.01)), reflected, center, radius);
  if (!hit3) return null;

  const normal3 = normalize(sub(hit3.point, center));
  const outgoing = refractDir(reflected, normal3, n, 1);
  if (!outgoing) return null;

  const end = add(hit3.point, scale(outgoing, 620));
  const rainbowAngle = radToDeg(Math.acos(clamp(dot(normalize(outgoing), { x: -1, y: 0 }), -1, 1)));

  return {
    points: [start, hit1.point, hit2.point, hit3.point, end],
    entryPoint: hit1.point,
    firstInsidePoint: hit2.point,
    end,
    outgoing,
    rainbowAngle
  };
}

function outwardNormalFromEdge(a, b) {
  const e = sub(b, a);
  return normalize({ x: e.y, y: -e.x });
}

function tracePrismRay({ n, prism, beamHeight }) {
  const incoming = { x: 1, y: 0 };
  const start = { x: 20, y: prism.center.y + beamHeight };
  const edges = [
    [prism.points[0], prism.points[1]],
    [prism.points[1], prism.points[2]],
    [prism.points[2], prism.points[0]]
  ];

  const first = edges
    .map((edge, edgeIndex) => {
      const hit = intersectRaySegment(start, incoming, edge[0], edge[1]);
      return hit ? { ...hit, edgeIndex } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.t - b.t)[0];

  if (!first) return null;

  const normal1 = outwardNormalFromEdge(edges[first.edgeIndex][0], edges[first.edgeIndex][1]);
  const inside = refractDir(incoming, normal1, 1, n);
  if (!inside) return null;

  const second = edges
    .map((edge, edgeIndex) => {
      if (edgeIndex === first.edgeIndex) return null;
      const hit = intersectRaySegment(add(first.point, scale(inside, 0.01)), inside, edge[0], edge[1]);
      return hit ? { ...hit, edgeIndex } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.t - b.t)[0];

  if (!second) return null;

  const normal2 = outwardNormalFromEdge(edges[second.edgeIndex][0], edges[second.edgeIndex][1]);
  const outgoing = refractDir(inside, normal2, n, 1);
  if (!outgoing) return null;

  const end = add(second.point, scale(outgoing, 680));
  const deviation = radToDeg(Math.acos(clamp(dot(normalize(outgoing), incoming), -1, 1)));

  return { points: [start, first.point, second.point, end], end, outgoing, deviation };
}

function buildRaindropState(spectrum) {
  const center = { x: canvas.width * 0.58, y: canvas.height * 0.55 };
  const radius = Number(controls.dropRadius.value);
  const beamHeight = Number(controls.beamHeight.value);

  const rays = spectrum
    .map((row) => {
      const trace = traceRaindropRay({ n: row.n, center, radius, beamHeight, incidentDeg: row.rainbowIncidentDeg });
      return trace ? { ...row, trace, metricAngle: trace.rainbowAngle } : null;
    })
    .filter(Boolean);

  return { mode: "raindrop", center, radius, rays };
}

function buildPrismState(spectrum) {
  const center = { x: canvas.width * 0.45, y: canvas.height * 0.52 };
  const beamHeight = Number(controls.beamHeight.value);
  const rotationDeg = camera.prismRotate;

  const basePoints = [
    { x: center.x - 95, y: center.y - 210 },
    { x: center.x + 270, y: center.y },
    { x: center.x - 95, y: center.y + 210 }
  ];

  const prism = {
    center,
    rotationDeg,
    points: basePoints.map((p) => rotatePoint(p, center, rotationDeg))
  };

  const rays = spectrum
    .map((row) => {
      const trace = tracePrismRay({ n: row.n, prism, beamHeight });
      return trace ? { ...row, trace, metricAngle: trace.deviation } : null;
    })
    .filter(Boolean);

  return { mode: "prism", prism, rays };
}

function drawLabel(text, x, y) {
  ctx.save();
  ctx.font = "700 20px 'Avenir Next', 'Segoe UI', sans-serif";
  const w = ctx.measureText(text).width;
  ctx.fillStyle = "rgba(18, 49, 64, 0.78)";
  ctx.fillRect(x - 9, y - 24, w + 18, 30);
  ctx.fillStyle = "#fdf3d2";
  ctx.fillText(text, x, y - 2);
  ctx.restore();
}

function drawHugeRay(path, color, width, alpha, glow = 24) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.shadowBlur = glow;
  ctx.shadowColor = color;
  ctx.beginPath();
  ctx.moveTo(path[0].x, path[0].y);
  for (let i = 1; i < path.length; i += 1) ctx.lineTo(path[i].x, path[i].y);
  ctx.stroke();
  ctx.restore();
}

function drawObserverOrderOverlay() {
  const cx = 170;
  const cy = canvas.height - 110;
  const boxTop = canvas.height - 250;

  ctx.save();
  ctx.fillStyle = "rgba(255, 255, 255, 0.86)";
  ctx.fillRect(25, boxTop, 320, 200);
  ctx.strokeStyle = "rgba(18, 49, 64, 0.28)";
  ctx.strokeRect(25, boxTop, 320, 200);

  ctx.strokeStyle = "#ff4040";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(cx, cy, 118, Math.PI * 1.05, Math.PI * 1.95, false);
  ctx.stroke();

  ctx.strokeStyle = "#c567ff";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(cx, cy, 98, Math.PI * 1.05, Math.PI * 1.95, false);
  ctx.stroke();

  ctx.fillStyle = "#123140";
  ctx.font = "700 16px 'Avenir Next', 'Segoe UI', sans-serif";
  ctx.fillText("Observer Ground Mechanism (Primary Rainbow)", 34, boxTop + 22);

  const eye = { x: 68, y: boxTop + 122 };
  const highDrop = { x: 252, y: boxTop + 84 };
  const lowDrop = { x: 252, y: boxTop + 132 };

  ctx.fillStyle = "#123140";
  ctx.beginPath();
  ctx.arc(eye.x, eye.y, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillText("Observer eye", eye.x - 18, eye.y + 22);

  ctx.fillStyle = "rgba(126, 183, 255, 0.45)";
  ctx.beginPath();
  ctx.arc(highDrop.x, highDrop.y, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(lowDrop.x, lowDrop.y, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#123140";
  ctx.font = "600 13px 'Avenir Next', 'Segoe UI', sans-serif";
  ctx.fillText("higher drop", highDrop.x - 26, highDrop.y - 14);
  ctx.fillText("lower drop", lowDrop.x - 24, lowDrop.y + 22);

  ctx.strokeStyle = "#ff4040";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(highDrop.x - 8, highDrop.y);
  ctx.lineTo(eye.x + 8, eye.y - 2);
  ctx.stroke();

  ctx.strokeStyle = "#c567ff";
  ctx.beginPath();
  ctx.moveTo(lowDrop.x - 8, lowDrop.y);
  ctx.lineTo(eye.x + 8, eye.y + 3);
  ctx.stroke();

  ctx.fillStyle = "#123140";
  ctx.font = "700 13px 'Avenir Next', 'Segoe UI', sans-serif";
  ctx.fillText("Red ray reaches eye from a higher drop.", 34, boxTop + 168);
  ctx.fillText("Violet reaches eye from a lower drop.", 34, boxTop + 186);
  ctx.restore();
}

function drawRefractionInset(rays) {
  if (!rays.length) return;

  const boxX = canvas.width - 350;
  const boxY = 26;
  const boxW = 320;
  const boxH = 220;

  ctx.save();
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.fillRect(boxX, boxY, boxW, boxH);
  ctx.strokeStyle = "rgba(18, 49, 64, 0.28)";
  ctx.strokeRect(boxX, boxY, boxW, boxH);

  ctx.fillStyle = "#123140";
  ctx.font = "700 15px 'Avenir Next', 'Segoe UI', sans-serif";
  ctx.fillText("Zoomed First Refraction (Entry)", boxX + 10, boxY + 22);

  const mid = rays[Math.floor(rays.length / 2)].trace.entryPoint;
  const scaleK = 7.5;
  const anchorX = boxX + 92;
  const anchorY = boxY + 140;

  ctx.strokeStyle = "#8a9cb0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(boxX + 24, anchorY);
  ctx.lineTo(boxX + 294, anchorY);
  ctx.stroke();

  rays.forEach((row) => {
    const p1 = row.trace.entryPoint;
    const p2 = row.trace.firstInsidePoint;

    const a = { x: anchorX + (p1.x - mid.x) * scaleK, y: anchorY + (p1.y - mid.y) * scaleK };
    const b = { x: anchorX + (p2.x - mid.x) * scaleK, y: anchorY + (p2.y - mid.y) * scaleK };

    drawHugeRay([a, b], row.color, 4, 0.95, 8);
  });

  ctx.fillStyle = "#123140";
  ctx.font = "600 13px 'Avenir Next', 'Segoe UI', sans-serif";
  ctx.fillText("Violet bends more toward the normal than red.", boxX + 10, boxY + 198);
  ctx.restore();
}

function drawRaindropState(state, timeMs) {
  const { center, radius, rays } = state;

  ctx.save();
  ctx.strokeStyle = "rgba(17, 89, 124, 0.32)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(20, center.y);
  ctx.lineTo(canvas.width - 20, center.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.fillStyle = "rgba(126, 183, 255, 0.18)";
  ctx.strokeStyle = "rgba(80, 135, 180, 0.85)";
  ctx.lineWidth = 3;
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  drawLabel("Raindrop", center.x - 54, center.y + 6);
  drawLabel("Sunlight in", 24, center.y - radius - 32);
  ctx.restore();

  if (!rays.length) return;

  const midRay = rays[Math.floor(rays.length / 2)].trace;
  drawHugeRay([midRay.points[0], midRay.points[1]], "#ffffff", 16, 0.96, 38);

  rays.forEach((row, i) => {
    const p = row.trace.points;
    const alpha = animate ? 0.58 + 0.4 * Math.sin(timeMs * 0.005 + i * 0.9) : 0.96;
    drawHugeRay([p[1], p[2], p[3]], row.color, 5, alpha, 14);
    drawHugeRay([p[3], p[4]], row.color, 9, alpha, 26);
  });

  const red = getRowByName(rays, "Red", 0);
  const violet = getRowByName(rays, "Violet", rays.length - 1);
  drawLabel(`Red ${red.metricAngle.toFixed(1)} deg`, center.x - radius - 230, center.y + 12);
  drawLabel(`Violet ${violet.metricAngle.toFixed(1)} deg`, center.x - radius - 230, center.y + 48);

  drawRefractionInset(rays);
  drawObserverOrderOverlay();
}

function drawPrismState(state, timeMs) {
  const { prism, rays } = state;
  const [a, b, c] = prism.points;

  ctx.save();
  ctx.fillStyle = "rgba(198, 227, 255, 0.24)";
  ctx.strokeStyle = "rgba(61, 120, 165, 0.92)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.lineTo(c.x, c.y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  drawLabel("Regular Prism", a.x + 15, a.y - 18);
  ctx.restore();

  if (!rays.length) return;

  const midRay = rays[Math.floor(rays.length / 2)].trace;
  drawHugeRay([midRay.points[0], midRay.points[1]], "#ffffff", 18, 0.97, 40);
  drawLabel("White light in", 18, midRay.points[0].y - 24);

  rays.forEach((row, i) => {
    const p = row.trace.points;
    const alpha = animate ? 0.58 + 0.4 * Math.sin(timeMs * 0.005 + i * 0.95) : 0.98;
    drawHugeRay([p[1], p[2]], row.color, 5, alpha, 14);
    drawHugeRay([p[2], p[3]], row.color, 10, alpha, 28);
  });

  const red = getRowByName(rays, "Red", 0);
  const violet = getRowByName(rays, "Violet", rays.length - 1);
  drawLabel(`Red dev ${red.metricAngle.toFixed(1)} deg`, b.x + 30, b.y - 15);
  drawLabel(`Violet dev ${violet.metricAngle.toFixed(1)} deg`, b.x + 30, b.y + 22);
}

function updateGuide() {
  const mode = getMode();
  const steps = lessons[mode];
  const idx = stepIndexByMode[mode];
  const step = steps[idx];

  outputs.guideStep.textContent = `Guide Step ${idx + 1}/${steps.length}`;
  outputs.guideAction.textContent = `Do this now: ${step.action}`;
  outputs.guideObserve.textContent = `Look for this: ${step.observe}`;
}

function renderDataAndExplanations(state) {
  if (!state.rays.length) {
    outputs.orderStatement.textContent = "No visible outgoing rays. Move Beam height closer to 0 or reduce prism rotation.";
    outputs.dataBody.innerHTML = "";
    outputs.explanation.innerHTML = "";
    return;
  }

  if (state.mode === "raindrop") {
    const ordered = [...state.rays].sort((a, b) => b.metricAngle - a.metricAngle);
    outputs.angleHeader.textContent = "Rainbow angle";
    outputs.orderStatement.textContent = `Primary rainbow order is by outer-to-inner angle: ${ordered.map((r) => r.name).join(" -> ")}.`;

    outputs.dataBody.innerHTML = ordered
      .map(
        (row) => `<tr>
          <td><span class="swatch" style="background:${row.color}"></span>${row.name}</td>
          <td>${row.wavelength}</td>
          <td>${row.n.toFixed(4)}</td>
          <td>${row.metricAngle.toFixed(2)} deg</td>
        </tr>`
      )
      .join("");

    const red = getRowByName(ordered, "Red", 0);
    const violet = getRowByName(ordered, "Violet", ordered.length - 1);

    outputs.explanation.innerHTML = `
      <p><span class="highlight">Important clarification:</span> The local ray drawing around one drop is not the same as the sky arc orientation. Use the Observer Sky View box for top/bottom in the rainbow you actually see.</p>
      <p><span class="highlight">Why red is top in the primary rainbow:</span> Red exits at larger rainbow angle (${red.metricAngle.toFixed(2)} deg) than violet (${violet.metricAngle.toFixed(2)} deg), so red maps to the outer/top edge.</p>
      <p><span class="highlight">First refraction split:</span> Check the zoomed inset. Violet bends more toward the normal than red immediately at entry.</p>
    `;
  } else {
    outputs.angleHeader.textContent = "Deviation";
    const topToBottom = [...state.rays].sort((a, b) => a.trace.end.y - b.trace.end.y);
    outputs.orderStatement.textContent = `Prism output on this screen (top->bottom): ${topToBottom.map((r) => r.name).join(" -> ")}.`;

    outputs.dataBody.innerHTML = topToBottom
      .map(
        (row) => `<tr>
          <td><span class="swatch" style="background:${row.color}"></span>${row.name}</td>
          <td>${row.wavelength}</td>
          <td>${row.n.toFixed(4)}</td>
          <td>${row.metricAngle.toFixed(2)} deg</td>
        </tr>`
      )
      .join("");

    const red = getRowByName(state.rays, "Red", 0);
    const violet = getRowByName(state.rays, "Violet", state.rays.length - 1);

    outputs.explanation.innerHTML = `
      <p><span class="highlight">Prism splitting:</span> White light refracts at entry and exit faces. Different wavelengths bend by different amounts.</p>
      <p><span class="highlight">Monotonic order:</span> Red bends less (lower n), violet bends more (higher n). Order is predictable even when you rotate the prism.</p>
      <p><span class="highlight">Current values:</span> red n=${red.n.toFixed(4)}, violet n=${violet.n.toFixed(4)}.</p>
    `;
  }
}

function syncReadouts() {
  outputs.baseNValue.textContent = Number(controls.baseN.value).toFixed(3);
  outputs.dispersionValue.textContent = Number(controls.dispersion.value).toFixed(3);
  outputs.beamHeightValue.textContent = `${Number(controls.beamHeight.value).toFixed(0)} px`;
  outputs.dropRadiusValue.textContent = `${Number(controls.dropRadius.value).toFixed(0)} px`;
}

function setMode(mode) {
  controls.modeSelect.value = mode;
}

function setHelpTab(tab) {
  const tabButtons = [controls.tabBtnOverview, controls.tabBtnControls, controls.tabBtnTeacher];
  const panels = {
    overview: outputs.helpOverview,
    controls: outputs.helpControls,
    teacher: outputs.helpTeacher
  };

  tabButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.tab === tab));
  Object.entries(panels).forEach(([name, panel]) => panel.classList.toggle("active", name === tab));
}

function updateModeUI() {
  const mode = getMode();
  const isRaindrop = mode === "raindrop";

  outputs.sceneTitle.textContent = isRaindrop ? "Raindrop Rainbow Model" : "Regular Prism Model";
  outputs.sceneSubtitle.textContent = isRaindrop
    ? "Mouse wheel: zoom. Observer box explains why red is top in the sky rainbow."
    : "Mouse wheel: zoom. Mouse drag: rotate prism.";

  outputs.contextHint.textContent = isRaindrop
    ? "Raindrop mode: use the Observer Sky View box to interpret top/bottom correctly."
    : "Prism mode: drag on canvas to rotate prism, wheel to zoom.";

  controls.dropRadius.disabled = !isRaindrop;
  if (!isRaindrop) outputs.dropRadiusValue.textContent = "(unused in prism mode)";

  updateGuide();
}

function applySettings(settings) {
  controls.baseN.value = String(settings.baseN);
  controls.dispersion.value = String(settings.dispersion);
  controls.beamHeight.value = String(settings.beamHeight);
  controls.dropRadius.value = String(settings.dropRadius);
  camera.zoom = settings.zoom;
  camera.prismRotate = settings.prismRotate;
  syncReadouts();
}

function applyModeDefaults() {
  const mode = getMode();
  applySettings(defaultsByMode[mode]);
  stepIndexByMode[mode] = 0;
  updateModeUI();
}

function updateTheme() {
  document.body.classList.toggle("dark-mode", isDarkMode);
  controls.themeBtn.textContent = isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode";
}

function applyTeacherCue(index, nowMs) {
  const cue = teacherScript[index];
  if (!cue) return;

  setMode(cue.mode);
  applySettings(cue.settings);
  updateModeUI();

  animate = cue.animate;
  controls.animateBtn.textContent = animate ? "Stop Ray Animation" : "Animate Rays";

  teacherState.cueIndex = index;
  teacherState.cueEndMs = nowMs + cue.durationSec * 1000;
  outputs.teacherCue.textContent = `${cue.title}: ${cue.narration}`;
}

function startTeacherMode(nowMs) {
  teacherState.running = true;
  teacherState.paused = false;
  controls.teacherPauseBtn.textContent = "Pause";
  outputs.teacherStatus.textContent = "Teacher mode running (auto-advancing cues).";
  outputs.teacherStatus.dataset.tone = "ok";
  applyTeacherCue(0, nowMs);
}

function stopTeacherMode(message) {
  teacherState.running = false;
  teacherState.paused = false;
  controls.teacherPauseBtn.textContent = "Pause";
  outputs.teacherStatus.textContent = message;
  outputs.teacherStatus.dataset.tone = "warn";
}

function tickTeacherMode(nowMs) {
  if (!teacherState.running || teacherState.paused) return;
  if (nowMs < teacherState.cueEndMs) return;

  const next = teacherState.cueIndex + 1;
  if (next >= teacherScript.length) {
    stopTeacherMode("Teacher mode finished. Click Start Teacher Mode to replay.");
    return;
  }

  applyTeacherCue(next, nowMs);
}

function withSceneTransform(focus, zoom, drawFn) {
  ctx.save();
  ctx.translate(focus.x, focus.y);
  ctx.scale(zoom, zoom);
  ctx.translate(-focus.x, -focus.y);
  drawFn();
  ctx.restore();
}

function render(timeMs = 0) {
  tickTeacherMode(timeMs);
  syncReadouts();

  const spectrum = getSpectrumData();
  const mode = getMode();
  const state = mode === "raindrop" ? buildRaindropState(spectrum) : buildPrismState(spectrum);
  const focus = mode === "raindrop" ? state.center : state.prism.center;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  withSceneTransform(focus, camera.zoom, () => {
    if (mode === "raindrop") drawRaindropState(state, timeMs);
    else drawPrismState(state, timeMs);
  });

  renderDataAndExplanations(state);
  requestAnimationFrame(render);
}

function setupCanvasMouse() {
  canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    const factor = Math.exp(-event.deltaY * 0.0012);
    camera.zoom = clamp(camera.zoom * factor, 0.7, 2.3);
  }, { passive: false });

  canvas.addEventListener("mousedown", (event) => {
    if (event.button !== 0) return;
    pointer.dragging = true;
    pointer.lastX = event.clientX;
  });

  window.addEventListener("mouseup", () => {
    pointer.dragging = false;
  });

  canvas.addEventListener("mousemove", (event) => {
    if (!pointer.dragging) return;
    if (getMode() !== "prism") return;

    const dx = event.clientX - pointer.lastX;
    pointer.lastX = event.clientX;
    camera.prismRotate = clamp(camera.prismRotate + dx * 0.18, -60, 60);
  });
}

function setupEvents() {
  [controls.baseN, controls.dispersion, controls.beamHeight, controls.dropRadius].forEach((input) => {
    input.addEventListener("input", syncReadouts);
  });

  controls.modeSelect.addEventListener("change", () => {
    if (teacherState.running) stopTeacherMode("Teacher mode stopped because mode was changed manually.");
    applyModeDefaults();
  });

  controls.themeBtn.addEventListener("click", () => {
    isDarkMode = !isDarkMode;
    updateTheme();
  });

  controls.resetBtn.addEventListener("click", () => {
    if (teacherState.running) stopTeacherMode("Teacher mode stopped by reset.");
    applyModeDefaults();
  });

  controls.animateBtn.addEventListener("click", () => {
    animate = !animate;
    controls.animateBtn.textContent = animate ? "Stop Ray Animation" : "Animate Rays";
  });

  controls.teacherPlayBtn.addEventListener("click", () => {
    startTeacherMode(performance.now());
  });

  controls.teacherPauseBtn.addEventListener("click", () => {
    if (!teacherState.running) return;
    teacherState.paused = !teacherState.paused;
    controls.teacherPauseBtn.textContent = teacherState.paused ? "Resume" : "Pause";
    outputs.teacherStatus.textContent = teacherState.paused ? "Teacher mode paused." : "Teacher mode running (auto-advancing cues).";
  });

  controls.teacherNextBtn.addEventListener("click", () => {
    if (!teacherState.running) {
      startTeacherMode(performance.now());
      return;
    }

    const next = Math.min(teacherState.cueIndex + 1, teacherScript.length - 1);
    applyTeacherCue(next, performance.now());
    if (next === teacherScript.length - 1) {
      outputs.teacherStatus.textContent = "Final cue loaded.";
      outputs.teacherStatus.dataset.tone = "warn";
    }
  });

  controls.prevStepBtn.addEventListener("click", () => {
    const mode = getMode();
    stepIndexByMode[mode] = Math.max(0, stepIndexByMode[mode] - 1);
    updateGuide();
  });

  controls.nextStepBtn.addEventListener("click", () => {
    const mode = getMode();
    const max = lessons[mode].length - 1;
    stepIndexByMode[mode] = Math.min(max, stepIndexByMode[mode] + 1);
    updateGuide();
  });

  [controls.tabBtnOverview, controls.tabBtnControls, controls.tabBtnTeacher].forEach((btn) => {
    btn.addEventListener("click", () => setHelpTab(btn.dataset.tab));
  });
}

setupEvents();
setupCanvasMouse();
setMode("raindrop");
applyModeDefaults();
setHelpTab("overview");
updateTheme();
requestAnimationFrame(render);
