import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";

/**
 * 3D-презентация стройки дома: 5 этапов → страницы категорий.
 */
const STAGES = [
  {
    id: "private",
    title: "Участок и фундамент",
    subtitle: "Частная территория",
    href: "private.html",
    copy: "Этап 1. Подготовка участка, геология и заливка фундамента — основа дома.",
    icon: "images/textures/icon-private.svg",
    color: 0xd4a017,
    cam: { desktop: [8.5, 5.2, 9.2], mobile: [9.5, 6.2, 10.2] },
    look: [0, 0.6, 0.2],
  },
  {
    id: "summer",
    title: "Коробка дома",
    subtitle: "Стены и проёмы",
    href: "summer.html",
    copy: "Этап 2. Возводим стены, окна и дверные проёмы — появляется объём будущего дома.",
    icon: "images/textures/icon-summer.svg",
    color: 0xc48a2a,
    cam: { desktop: [7.2, 4.2, 8.0], mobile: [8.2, 5.0, 9.0] },
    look: [0, 1.4, 0.2],
  },
  {
    id: "finish",
    title: "Кровля и фасад",
    subtitle: "Закрываем контур",
    href: "finish.html",
    copy: "Этап 3. Крыша, фасад и инженерия — дом защищён от погоды и готов к отделке.",
    icon: "images/textures/icon-finish.svg",
    color: 0xe8dfc8,
    cam: { desktop: [6.4, 3.8, 7.2], mobile: [7.4, 4.6, 8.2] },
    look: [0, 1.8, 0.1],
  },
  {
    id: "landscaping",
    title: "Благоустройство",
    subtitle: "Отделка участка",
    href: "landscaping.html",
    copy: "Этап 4. Дорожки, газон и свет — двор работает каждый день, не только на фото.",
    icon: "images/textures/icon-land.svg",
    color: 0x6f8f6a,
    cam: { desktop: [7.5, 3.4, 8.5], mobile: [8.5, 4.2, 9.5] },
    look: [0.3, 0.5, 2.0],
  },
  {
    id: "apartments",
    title: "Сдача и масштаб",
    subtitle: "От частного к ЖК",
    href: "apartments.html",
    copy: "Этап 5. Дом готов. Рядом — другой масштаб: многоквартирная застройка.",
    icon: "images/textures/icon-apt.svg",
    color: 0x8aa4b8,
    cam: { desktop: [11, 6.0, 11], mobile: [12, 7.0, 12] },
    look: [2.2, 2.0, -1.0],
  },
];

const MARKER_POS = [
  [0, 1.1, 0.2],
  [0, 2.0, 2.85],
  [0, 3.6, 0.1],
  [0.2, 0.7, 4.4],
  [6.5, 4.2, -3.2],
];

const canvas = document.getElementById("nav-canvas");
const hint = document.getElementById("hub-hint");
const tourCopy = document.getElementById("tour-copy");
const stepsEl = document.getElementById("tour-steps");
const btnPrev = document.getElementById("tour-prev");
const btnNext = document.getElementById("tour-next");
const btnOpen = document.getElementById("tour-open");
const progressEl = document.getElementById("build-progress");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function isMobile() {
  return window.matchMedia("(max-width: 760px)").matches;
}

function setHint(text) {
  if (hint) hint.textContent = text;
}

function defaultHint() {
  return isMobile()
    ? "Свайп — осмотр · «Далее» — следующий этап"
    : "Тяните мышью · «Далее» — этап стройки";
}

function camOf(stage) {
  return new THREE.Vector3(...(isMobile() ? stage.cam.mobile : stage.cam.desktop));
}

function lookOf(stage) {
  return new THREE.Vector3(...stage.look);
}

function solid(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: opts.roughness ?? 0.75,
    metalness: opts.metalness ?? 0.05,
    emissive: opts.emissive ?? 0x000000,
    emissiveIntensity: opts.emissiveIntensity ?? 0,
    flatShading: opts.flat ?? false,
  });
}

function loadTexture(url) {
  return new Promise((resolve) => {
    new THREE.TextureLoader().load(
      url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.anisotropy = 4;
        resolve(tex);
      },
      undefined,
      () => resolve(null)
    );
  });
}

function textured(tex, color, repeat = [2, 2]) {
  const mat = solid(color);
  if (tex) {
    const map = tex.clone();
    map.colorSpace = tex.colorSpace;
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(repeat[0], repeat[1]);
    map.needsUpdate = true;
    mat.map = map;
    mat.color.set(0xffffff);
    mat.needsUpdate = true;
  }
  return mat;
}

function makeBadgeTexture(title, subtitle, accent) {
  const w = 1024;
  const h = 420;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  const hex = `#${accent.toString(16).padStart(6, "0")}`;

  ctx.fillStyle = "rgba(16, 22, 18, 0.94)";
  roundRect(ctx, 18, 18, w - 36, h - 36, 28);
  ctx.fill();
  ctx.strokeStyle = hex;
  ctx.lineWidth = 8;
  roundRect(ctx, 18, 18, w - 36, h - 36, 28);
  ctx.stroke();

  ctx.fillStyle = hex;
  ctx.font = "600 28px Commissioner, Arial, sans-serif";
  ctx.fillText("ЭТАП СТРОЙКИ", 64, 100);

  ctx.fillStyle = "#ebe3cf";
  ctx.font = "700 48px Unbounded, Arial, sans-serif";
  ctx.fillText(title, 64, 185);

  ctx.fillStyle = "#c9bda3";
  ctx.font = "500 30px Commissioner, Arial, sans-serif";
  ctx.fillText(subtitle, 64, 250);

  ctx.fillStyle = hex;
  ctx.font = "500 28px Commissioner, Arial, sans-serif";
  ctx.fillText("Открыть направление →", 64, 335);

  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function mesh(parent, geo, material, pos, rot) {
  const m = new THREE.Mesh(geo, material);
  m.position.set(pos[0], pos[1], pos[2]);
  if (rot) m.rotation.set(rot[0], rot[1], rot[2]);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}

async function buildPresentation(scene, textures) {
  const root = new THREE.Group();
  scene.add(root);

  const brick = textured(textures.brick, 0x9a5b3c, [2.4, 1.3]);
  const wood = textured(textures.wood, 0x7a4a2c, [1.5, 1.5]);
  const floor = textured(textures.floor, 0xc4a574, [2.5, 2.5]);
  const roofMat = textured(textures.roof, 0x6a7a82, [2.5, 1.8]);
  const grass = textured(textures.grass, 0x4a8a52, [6, 6]);
  const plaster = textured(textures.plaster, 0xd2c8b4, [1.5, 1.5]);
  const ceramic = textured(textures.ceramic, 0xe8eef0, [2, 2]);
  const concrete = solid(0xa8aea8, { roughness: 0.9 });
  const soil = solid(0x6b533c, { roughness: 1 });
  const glass = solid(0x9ec8ef, { roughness: 0.15, metalness: 0.25 });
  glass.transparent = true;
  glass.opacity = 0.55;
  const steel = solid(0xb0b8be, { metalness: 0.75, roughness: 0.3 });
  const leaf = solid(0x3f8a4a);
  const gold = solid(0xd4a017, { emissive: 0xd4a017, emissiveIntensity: 0.35 });

  // Ground
  const plot = new THREE.Group();
  root.add(plot);
  mesh(plot, new THREE.CircleGeometry(16, 64), grass, [0, 0, 0], [-Math.PI / 2, 0, 0]);
  mesh(plot, new THREE.BoxGeometry(9.4, 0.1, 7.8), soil, [0, 0.06, 0.2]);

  // Site boundary tape
  const tape = solid(0xe2b84a);
  for (const [x, z] of [
    [-4.4, -3.4],
    [4.4, -3.4],
    [-4.4, 3.6],
    [4.4, 3.6],
  ]) {
    mesh(plot, new THREE.CylinderGeometry(0.05, 0.05, 1.0, 8), wood, [x, 0.55, z]);
    mesh(plot, new THREE.BoxGeometry(0.28, 0.14, 0.03), gold, [x, 1.0, z]);
  }
  mesh(plot, new THREE.BoxGeometry(8.8, 0.02, 0.04), tape, [0, 0.9, -3.4]);
  mesh(plot, new THREE.BoxGeometry(8.8, 0.02, 0.04), tape, [0, 0.9, 3.6]);

  const foundation = new THREE.Group();
  const walls = new THREE.Group();
  const roofGroup = new THREE.Group();
  const yard = new THREE.Group();
  const aptGroup = new THREE.Group();
  root.add(foundation, walls, roofGroup, yard, aptGroup);

  // Foundation
  mesh(foundation, new THREE.BoxGeometry(7.4, 0.5, 6.0), concrete, [0, 0.35, 0.15]);
  mesh(foundation, new THREE.BoxGeometry(7.8, 0.25, 6.4), concrete, [0, 0.14, 0.15]);
  for (let i = -3; i <= 3; i++) {
    mesh(foundation, new THREE.CylinderGeometry(0.035, 0.035, 0.65, 6), steel, [i * 0.95, 0.7, -2.3]);
    mesh(foundation, new THREE.CylinderGeometry(0.035, 0.035, 0.65, 6), steel, [i * 0.95, 0.7, 2.5]);
  }

  // Walls
  const wallH = 2.7;
  mesh(walls, new THREE.BoxGeometry(7.0, wallH, 0.3), brick, [0, 1.7, -2.6]);
  mesh(walls, new THREE.BoxGeometry(0.3, wallH, 5.3), brick, [-3.35, 1.7, 0.05]);
  mesh(walls, new THREE.BoxGeometry(0.3, wallH, 5.3), plaster, [3.35, 1.7, 0.05]);
  mesh(walls, new THREE.BoxGeometry(2.5, wallH, 0.3), brick, [-2.15, 1.7, 2.7]);
  mesh(walls, new THREE.BoxGeometry(2.5, wallH, 0.3), brick, [2.15, 1.7, 2.7]);
  mesh(walls, new THREE.BoxGeometry(6.6, 0.14, 5.1), floor, [0, 0.62, 0.05]);
  mesh(walls, new THREE.BoxGeometry(1.35, 1.25, 0.1), glass, [-2.05, 1.85, 2.88]);
  mesh(walls, new THREE.BoxGeometry(1.35, 1.25, 0.1), glass, [2.05, 1.85, 2.88]);
  mesh(walls, new THREE.BoxGeometry(1.15, 2.15, 0.12), wood, [0, 1.5, 2.8]);
  // Scaffold
  mesh(walls, new THREE.BoxGeometry(0.1, 3.4, 0.1), steel, [-3.85, 1.75, 1.3]);
  mesh(walls, new THREE.BoxGeometry(0.1, 3.4, 0.1), steel, [-3.85, 1.75, -1.3]);
  mesh(walls, new THREE.BoxGeometry(0.1, 0.1, 2.7), steel, [-3.85, 2.8, 0]);
  mesh(walls, new THREE.BoxGeometry(2.4, 0.55, 1.0), wood, [-4.55, 0.45, 0]);

  // Roof
  const roofMesh = mesh(roofGroup, new THREE.ConeGeometry(5.3, 1.85, 4), roofMat, [0, 3.75, 0.05]);
  roofMesh.rotation.y = Math.PI / 4;
  mesh(roofGroup, new THREE.BoxGeometry(7.1, 0.18, 5.5), wood, [0, 3.05, 0.05]);
  mesh(roofGroup, new THREE.BoxGeometry(0.6, 1.0, 0.6), brick, [1.7, 4.2, -0.55]);

  // Yard
  mesh(yard, new THREE.BoxGeometry(1.35, 0.1, 4.5), ceramic, [0, 0.12, 4.4]);
  mesh(yard, new THREE.CylinderGeometry(0.42, 0.48, 0.45, 12), wood, [-2.3, 0.35, 4.1]);
  mesh(yard, new THREE.SphereGeometry(0.5, 16, 16), leaf, [-2.3, 0.85, 4.1]);
  mesh(yard, new THREE.CylinderGeometry(0.42, 0.48, 0.45, 12), wood, [2.4, 0.35, 4.2]);
  mesh(yard, new THREE.SphereGeometry(0.45, 16, 16), leaf, [2.4, 0.8, 4.2]);
  for (const z of [3.3, 4.15, 5.0]) {
    mesh(yard, new THREE.CylinderGeometry(0.06, 0.06, 0.75, 8), steel, [-0.9, 0.45, z]);
    mesh(
      yard,
      new THREE.SphereGeometry(0.12, 12, 12),
      solid(0xffe2a8, { emissive: 0xffc857, emissiveIntensity: 1.1 }),
      [-0.9, 0.9, z]
    );
  }
  for (let i = 0; i < 9; i++) {
    mesh(yard, new THREE.BoxGeometry(0.1, 0.75, 0.1), wood, [-5.4, 0.45, -3.2 + i * 0.95]);
  }

  // Apartments + crane
  mesh(aptGroup, new THREE.BoxGeometry(2.5, 6.5, 2.3), plaster, [6.6, 3.3, -3.3]);
  mesh(aptGroup, new THREE.BoxGeometry(2.1, 5.2, 1.9), plaster, [8.8, 2.65, -2.7]);
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 3; col++) {
      mesh(aptGroup, new THREE.PlaneGeometry(0.38, 0.38), glass, [5.33, 0.95 + row * 0.9, -3.85 + col * 0.58], [
        0,
        Math.PI / 2,
        0,
      ]);
    }
  }
  mesh(aptGroup, new THREE.CylinderGeometry(0.1, 0.14, 8.0, 10), steel, [10.4, 4.1, -1.4]);
  mesh(aptGroup, new THREE.BoxGeometry(5.8, 0.14, 0.2), steel, [8.1, 7.9, -1.4]);
  mesh(aptGroup, new THREE.BoxGeometry(0.25, 0.9, 0.25), gold, [10.4, 8.05, -1.4]);

  const houseLight = new THREE.PointLight(0xffe2a8, 0, 14, 2);
  houseLight.position.set(0, 2.3, 0.3);
  root.add(houseLight);

  const layers = [foundation, walls, roofGroup, yard, aptGroup];
  layers.forEach((layer) => {
    layer.visible = false;
    layer.traverse((obj) => {
      if (obj.isMesh) {
        obj.userData.baseY = obj.position.y;
      }
    });
  });

  const markers = [];
  const labels = [];
  const pickables = [];

  STAGES.forEach((stage, i) => {
    const marker = mesh(
      root,
      new THREE.SphereGeometry(0.3, 20, 20),
      solid(stage.color, { emissive: stage.color, emissiveIntensity: 0.55, roughness: 0.35, metalness: 0.2 }),
      MARKER_POS[i]
    );
    marker.userData = { ...stage, index: i, kind: "marker" };
    markers.push(marker);
    pickables.push(marker);

    const ring = mesh(
      root,
      new THREE.RingGeometry(0.4, 0.55, 32),
      new THREE.MeshBasicMaterial({ color: stage.color, transparent: true, opacity: 0.6, side: THREE.DoubleSide }),
      [MARKER_POS[i][0], 0.08, MARKER_POS[i][2]],
      [-Math.PI / 2, 0, 0]
    );
    ring.castShadow = false;

    const hit = mesh(
      root,
      new THREE.SphereGeometry(0.75, 12, 12),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
      MARKER_POS[i]
    );
    hit.userData = { ...stage, index: i, kind: "hit" };
    hit.castShadow = false;
    pickables.push(hit);

    const label = mesh(
      root,
      new THREE.PlaneGeometry(2.5, 1.05),
      new THREE.MeshBasicMaterial({
        map: makeBadgeTexture(stage.title, stage.subtitle, stage.color),
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
      [MARKER_POS[i][0], MARKER_POS[i][1] + 0.95, MARKER_POS[i][2]]
    );
    label.userData = { ...stage, index: i, kind: "label" };
    label.castShadow = false;
    labels.push(label);
    pickables.push(label);
  });

  return { root, layers, markers, labels, pickables, houseLight };
}

async function init() {
  if (!canvas) {
    setHint("Canvas не найден");
    return;
  }

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isMobile(),
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x87a4b0, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = !isMobile();
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87a4b0);
  scene.fog = new THREE.Fog(0x9eb4bc, 22, 45);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);
  camera.position.copy(camOf(STAGES[0]));

  scene.add(new THREE.AmbientLight(0xffffff, 0.62));
  const sun = new THREE.DirectionalLight(0xfff2d6, 1.55);
  sun.position.set(10, 16, 8);
  sun.castShadow = renderer.shadowMap.enabled;
  if (sun.castShadow) {
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 45;
    sun.shadow.camera.left = -14;
    sun.shadow.camera.right = 14;
    sun.shadow.camera.top = 14;
    sun.shadow.camera.bottom = -14;
  }
  scene.add(sun);
  scene.add(new THREE.HemisphereLight(0xd8e8f2, 0x4a6a45, 0.55));

  const textures = {};
  const [brick, wood, floor, roof, grass, plaster, ceramic] = await Promise.all([
    loadTexture("images/textures/brick.svg"),
    loadTexture("images/textures/wood.svg"),
    loadTexture("images/textures/floor.svg"),
    loadTexture("images/textures/roof.svg"),
    loadTexture("images/textures/grass.svg"),
    loadTexture("images/textures/plaster.svg"),
    loadTexture("images/textures/tile-ceramic.svg"),
  ]);
  Object.assign(textures, { brick, wood, floor, roof, grass, plaster, ceramic });

  const { root, layers, markers, labels, pickables, houseLight } = await buildPresentation(scene, textures);

  let activeIndex = 0;
  const camFrom = camera.position.clone();
  const camTo = camera.position.clone();
  const lookFrom = lookOf(STAGES[0]);
  const lookTo = lookOf(STAGES[0]);
  const lookNow = lookOf(STAGES[0]);
  let camT = 1;
  let orbitYaw = 0;
  let orbitPitch = 0;
  let userOrbit = false;
  let idle = 0;

  if (stepsEl) {
    stepsEl.innerHTML = STAGES.map(
      (s, i) =>
        `<li><button type="button" class="tour-step" data-index="${i}" aria-label="${s.title}"><img src="${s.icon}" alt="" width="18" height="18" /><span>${i + 1}</span></button></li>`
    ).join("");
  }

  function updateProgress() {
    if (!progressEl) return;
    const pct = ((activeIndex + 1) / STAGES.length) * 100;
    progressEl.style.setProperty("--p", `${pct}%`);
    progressEl.setAttribute("aria-valuenow", String(activeIndex + 1));
    const label = progressEl.querySelector("[data-progress-label]");
    if (label) label.textContent = `${activeIndex + 1} / ${STAGES.length}`;
  }

  const layerAnim = layers.map(() => ({ start: 0, rising: false }));

  function applyLayerVisibility(index) {
    const now = performance.now();
    layers.forEach((layer, i) => {
      const show = i <= index;
      if (show) {
        if (!layer.visible) {
          layer.visible = true;
          layerAnim[i].start = now;
          layerAnim[i].rising = !reducedMotion;
          layer.scale.set(1, reducedMotion ? 1 : 0.05, 1);
          layer.position.y = reducedMotion ? 0 : -0.6;
        }
      } else {
        layer.visible = false;
        layer.scale.set(1, 1, 1);
        layer.position.y = 0;
        layerAnim[i].rising = false;
      }
    });
    houseLight.intensity = index >= 2 ? 1.6 : 0;
  }

  function goTo(index, open = false) {
    activeIndex = (index + STAGES.length) % STAGES.length;
    const stage = STAGES[activeIndex];

    userOrbit = false;
    orbitYaw = 0;
    orbitPitch = 0;
    camFrom.copy(camera.position);
    lookFrom.copy(lookNow);
    camTo.copy(camOf(stage));
    lookTo.copy(lookOf(stage));
    camT = reducedMotion ? 1 : 0;

    if (tourCopy) tourCopy.textContent = stage.copy;
    setHint(`Этап ${activeIndex + 1}: ${stage.title}`);
    updateProgress();

    stepsEl?.querySelectorAll(".tour-step").forEach((btn, i) => {
      btn.classList.toggle("is-active", i === activeIndex);
    });

    markers.forEach((m, i) => {
      const on = i === activeIndex;
      m.material.emissiveIntensity = on ? 1.15 : 0.4;
      m.scale.setScalar(on ? 1.35 : 1);
      m.visible = true;
    });
    labels.forEach((l, i) => {
      l.visible = i === activeIndex;
    });

    applyLayerVisibility(activeIndex);

    if (open) window.location.assign(stage.href);
  }

  goTo(0);

  btnNext?.addEventListener("click", (e) => {
    e.stopPropagation();
    goTo(activeIndex + 1);
  });
  btnPrev?.addEventListener("click", (e) => {
    e.stopPropagation();
    goTo(activeIndex - 1);
  });
  btnOpen?.addEventListener("click", (e) => {
    e.stopPropagation();
    goTo(activeIndex, true);
  });
  stepsEl?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-index]");
    if (!btn) return;
    e.stopPropagation();
    const idx = Number(btn.dataset.index);
    if (idx === activeIndex) goTo(idx, true);
    else goTo(idx);
  });

  const pointer = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const drag = { active: false, moved: false, lx: 0, ly: 0, sx: 0, sy: 0 };

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile() ? 1.6 : 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(h, 1);
    camera.fov = isMobile() ? 48 : 42;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  function setPointer(x, y) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((x - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((y - rect.top) / rect.height) * 2 + 1;
  }

  function pick() {
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObjects(pickables, false)[0]?.object || null;
  }

  function orbitCamera() {
    const stage = STAGES[activeIndex];
    const target = lookOf(stage);
    const base = camOf(stage);
    const offset = base.clone().sub(target);
    const spherical = new THREE.Spherical().setFromVector3(offset);
    spherical.theta += orbitYaw;
    spherical.phi = THREE.MathUtils.clamp(spherical.phi + orbitPitch, 0.35, 1.35);
    camera.position.copy(target).add(new THREE.Vector3().setFromSpherical(spherical));
    lookNow.copy(target);
    camT = 1;
  }

  canvas.addEventListener("pointerdown", (e) => {
    drag.active = true;
    drag.moved = false;
    drag.sx = drag.lx = e.clientX;
    drag.sy = drag.ly = e.clientY;
    canvas.setPointerCapture?.(e.pointerId);
    setPointer(e.clientX, e.clientY);
  });

  canvas.addEventListener("pointermove", (e) => {
    setPointer(e.clientX, e.clientY);
    if (drag.active) {
      if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 10) drag.moved = true;
      const dx = e.clientX - drag.lx;
      const dy = e.clientY - drag.ly;
      drag.lx = e.clientX;
      drag.ly = e.clientY;
      if (drag.moved) {
        userOrbit = true;
        orbitYaw -= dx * 0.005;
        orbitPitch += dy * 0.0035;
        orbitCamera();
      }
      return;
    }
    const hit = pick();
    canvas.style.cursor = hit ? "pointer" : "grab";
    setHint(hit?.userData?.title ? `Открыть: ${hit.userData.title}` : defaultHint());
  });

  canvas.addEventListener("pointerup", (e) => {
    if (!drag.active) return;
    drag.active = false;
    setPointer(e.clientX, e.clientY);
    if (drag.moved) {
      setHint(defaultHint());
      return;
    }
    const hit = pick();
    if (hit && typeof hit.userData.index === "number") {
      if (hit.userData.index === activeIndex) goTo(activeIndex, true);
      else goTo(hit.userData.index);
    }
  });

  canvas.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const stage = STAGES[activeIndex];
      const target = lookOf(stage);
      const dir = camera.position.clone().sub(target);
      const next = THREE.MathUtils.clamp(dir.length() + e.deltaY * 0.012, 5, 18);
      dir.setLength(next);
      camera.position.copy(target).add(dir);
      camTo.copy(camera.position);
      camFrom.copy(camera.position);
      userOrbit = true;
      camT = 1;
    },
    { passive: false }
  );

  setHint(defaultHint());
  document.body.classList.add("hub-build");

  if (!reducedMotion) {
    root.rotation.y = -0.45;
  }

  function animate() {
    requestAnimationFrame(animate);

    if (!userOrbit && camT < 1) {
      camT = Math.min(1, camT + (reducedMotion ? 1 : 0.035));
      const k = 1 - Math.pow(1 - camT, 3);
      camera.position.lerpVectors(camFrom, camTo, k);
      lookNow.lerpVectors(lookFrom, lookTo, k);
    }

    camera.lookAt(lookNow);

    const now = performance.now();
    layerAnim.forEach((anim, i) => {
      if (!anim.rising) return;
      const k = Math.min(1, (now - anim.start) / 850);
      const e = 1 - (1 - k) ** 3;
      layers[i].scale.y = 0.05 + 0.95 * e;
      layers[i].position.y = -0.6 + 0.6 * e;
      if (k >= 1) {
        anim.rising = false;
        layers[i].scale.set(1, 1, 1);
        layers[i].position.y = 0;
      }
    });

    const t = now * 0.002;
    markers.forEach((m, i) => {
      if (!m.visible) return;
      const base = MARKER_POS[i];
      m.position.y = base[1] + Math.sin(t + i * 1.3) * 0.07;
    });
    labels.forEach((label, i) => {
      if (!label.visible) return;
      label.quaternion.copy(camera.quaternion);
      label.position.y = markers[i].position.y + 0.95;
    });
    pickables.forEach((obj) => {
      if (obj.userData.kind === "hit") obj.position.copy(markers[obj.userData.index].position);
    });

    if (!drag.active && !userOrbit && camT >= 1 && !reducedMotion) {
      idle += 0.0025;
      root.rotation.y = Math.sin(idle) * 0.08;
    } else if (!reducedMotion && root.rotation.y < -0.01) {
      root.rotation.y += 0.008;
      if (root.rotation.y > 0) root.rotation.y = 0;
    }

    renderer.render(scene, camera);
  }

  animate();
}

init().catch((err) => {
  console.error(err);
  setHint("Не удалось запустить презентацию — откройте «Список»");
});
