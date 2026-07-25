import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";

const STOPS = [
  {
    id: "private",
    title: "Частная территория",
    subtitle: "Вид на участок",
    href: "private.html",
    copy: "Вы внутри: из окна виден участок — фундамент и посадка дома начинаются отсюда.",
    icon: "images/textures/icon-private.svg",
    position: new THREE.Vector3(-2.6, 1.45, 1.6),
    camera: { desktop: [0.2, 1.58, 2.15], mobile: [0.15, 1.58, 2.35] },
    lookAt: [-2.8, 1.35, 2.4],
    color: 0xd4a017,
  },
  {
    id: "summer",
    title: "Летние домики",
    subtitle: "Окно во двор",
    href: "summer.html",
    copy: "Справа во дворе — лёгкий гостевой домик для сезона и отдыха.",
    icon: "images/textures/icon-summer.svg",
    position: new THREE.Vector3(2.55, 1.45, 1.5),
    camera: { desktop: [0.35, 1.58, 1.9], mobile: [0.2, 1.58, 2.1] },
    lookAt: [3.2, 1.2, 2.35],
    color: 0xc48a2a,
  },
  {
    id: "landscaping",
    title: "Отделка участка",
    subtitle: "Взгляд к двери",
    href: "landscaping.html",
    copy: "Обернитесь к входу: дорожка, газон и двор — отделка участка с порога.",
    icon: "images/textures/icon-land.svg",
    position: new THREE.Vector3(0.15, 1.15, 2.85),
    camera: { desktop: [0.1, 1.58, 1.35], mobile: [0.05, 1.58, 1.55] },
    lookAt: [0.1, 1.0, 4.4],
    color: 0x6f8f6a,
  },
  {
    id: "finish",
    title: "Отделка под ключ",
    subtitle: "Гостиная",
    href: "finish.html",
    copy: "Гостиная после чистовой: стены, пол, свет и мебель — дом готов к жизни.",
    icon: "images/textures/icon-finish.svg",
    position: new THREE.Vector3(-1.35, 1.45, -0.55),
    camera: { desktop: [1.1, 1.58, 0.9], mobile: [0.95, 1.58, 1.05] },
    lookAt: [-1.4, 1.25, -0.9],
    color: 0xe8dfc8,
  },
  {
    id: "apartments",
    title: "Многоквартирные",
    subtitle: "Вид из окна",
    href: "apartments.html",
    copy: "В глубине — другой масштаб: секции и этажи многоквартирного дома.",
    icon: "images/textures/icon-apt.svg",
    position: new THREE.Vector3(1.8, 1.55, -1.55),
    camera: { desktop: [-0.4, 1.62, -0.2], mobile: [-0.55, 1.62, 0.05] },
    lookAt: [2.35, 1.7, -2.35],
    color: 0x8aa4b8,
  },
];

/** Точки анимации входа: снаружи → через дверь → внутрь */
const ENTER = {
  outside: {
    cam: [0, 1.55, 5.6],
    look: [0, 1.35, 3.35],
  },
  doorway: {
    cam: [0, 1.55, 3.55],
    look: [0, 1.4, 1.2],
  },
};
const canvas = document.getElementById("nav-canvas");
const hint = document.getElementById("hub-hint");
const tourCopy = document.getElementById("tour-copy");
const stepsEl = document.getElementById("tour-steps");
const btnPrev = document.getElementById("tour-prev");
const btnNext = document.getElementById("tour-next");
const btnOpen = document.getElementById("tour-open");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function isMobile() {
  return window.matchMedia("(max-width: 760px)").matches;
}

function setHint(text) {
  if (hint) hint.textContent = text;
}

function defaultHint() {
  return isMobile()
    ? "Осматривайтесь свайпом · «Открыть» — раздел"
    : "Осматривайтесь мышью · клик по плитке или «Открыть»";
}

function camOf(stop) {
  const arr = isMobile() ? stop.camera.mobile : stop.camera.desktop;
  return new THREE.Vector3(...arr);
}

function lookOf(stop) {
  return new THREE.Vector3(...stop.lookAt);
}

function loadTexture(url) {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.anisotropy = 4;
        resolve(tex);
      },
      undefined,
      reject
    );
  });
}

function makeLabelTexture(title, subtitle, iconImg) {
  const w = 1024;
  const h = 480;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");

  ctx.fillStyle = "rgba(14,19,16,0.94)";
  roundRect(ctx, 12, 12, w - 24, h - 24, 28);
  ctx.fill();
  ctx.strokeStyle = "#d4a017";
  ctx.lineWidth = 8;
  roundRect(ctx, 12, 12, w - 24, h - 24, 28);
  ctx.stroke();

  if (iconImg) {
    ctx.drawImage(iconImg, 48, 90, 160, 160);
  }

  ctx.fillStyle = "#ebe3cf";
  ctx.font = "700 52px Unbounded, Arial, sans-serif";
  wrapText(ctx, title, iconImg ? 240 : 64, 160, w - (iconImg ? 300 : 120), 60);

  ctx.fillStyle = "#d4a017";
  ctx.font = "500 34px Commissioner, Arial, sans-serif";
  ctx.fillText(subtitle, iconImg ? 240 : 64, 280);

  ctx.fillStyle = "#b8ae97";
  ctx.font = "500 30px Commissioner, Arial, sans-serif";
  ctx.fillText("Нажмите, чтобы открыть →", iconImg ? 240 : 64, 360);

  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let yy = y;
  for (let i = 0; i < words.length; i++) {
    const test = `${line}${words[i]} `;
    if (ctx.measureText(test).width > maxWidth && i > 0) {
      ctx.fillText(line.trim(), x, yy);
      line = `${words[i]} `;
      yy += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line.trim(), x, yy);
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

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

async function buildHouse(scene, textures) {
  const mat = (map, color, repeat = [2, 2]) => {
    let tex = null;
    if (map && map.isTexture) {
      tex = map.clone();
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(repeat[0], repeat[1]);
      tex.needsUpdate = true;
    }
    return new THREE.MeshStandardMaterial({
      map: tex,
      color: tex ? 0xffffff : color,
      roughness: 0.82,
      metalness: 0.04,
    });
  };

  const wall = mat(textures.brick, 0x8b5a3c, [2.5, 1.4]);
  const plaster = mat(textures.plaster, 0xc7bead, [1.5, 1.5]);
  const wood = mat(textures.wood, 0x6e452c, [1.2, 1.2]);
  const floor = mat(textures.floor, 0xb89b6e, [3, 3]);
  const roof = mat(textures.roof, 0x5a6a72, [3, 2]);
  const grass = mat(textures.grass, 0x3f6b45, [4, 4]);
  const wallpaper = mat(textures.wallpaper, 0xe8dfc8, [2, 2]);
  const ceramic = mat(textures.ceramic, 0xdfe6ea, [2, 2]);
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0xb8dcff,
    transmission: 0.65,
    transparent: true,
    opacity: 0.55,
    roughness: 0.08,
    metalness: 0.05,
    thickness: 0.2,
  });

  const add = (geo, material, pos, rot) => {
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.set(...pos);
    if (rot) mesh.rotation.set(...rot);
    scene.add(mesh);
    return mesh;
  };

  // Ground & yard
  add(new THREE.CircleGeometry(8.5, 64), grass, [0, -0.05, 0.4], [-Math.PI / 2, 0, 0]);
  add(new THREE.BoxGeometry(8.6, 0.16, 7.4), floor, [0, 0.02, 0.15]);

  // House shell — вход открыт, внутри потолок
  add(new THREE.BoxGeometry(8.6, 2.9, 0.2), wall, [0, 1.5, -3.35]);
  add(new THREE.BoxGeometry(0.2, 2.9, 6.7), wall, [-4.2, 1.5, 0]);
  add(new THREE.BoxGeometry(0.2, 2.9, 6.7), plaster, [4.2, 1.5, 0]);
  add(new THREE.BoxGeometry(3.0, 2.9, 0.2), wall, [-2.85, 1.5, 3.35]);
  add(new THREE.BoxGeometry(3.0, 2.9, 0.2), wall, [2.85, 1.5, 3.35]);

  // Ceiling — ощущение, что мы внутри
  add(new THREE.BoxGeometry(8.4, 0.12, 6.5), plaster, [0, 2.88, 0.05]);

  // Interior partition with wallpaper
  add(new THREE.BoxGeometry(0.12, 2.5, 3.2), wallpaper, [-1.5, 1.3, -0.6]);

  // Roof (снаружи)
  const roofMesh = add(new THREE.ConeGeometry(6.4, 1.7, 4), roof, [0, 3.55, 0]);
  roofMesh.rotation.y = Math.PI / 4;

  // Open door — приглашает войти
  const door = add(new THREE.BoxGeometry(1.15, 2.15, 0.1), wood, [0.55, 1.12, 3.2]);
  door.rotation.y = -1.05;

  // Windows
  add(new THREE.BoxGeometry(1.35, 1.15, 0.06), glass, [-2.55, 1.55, 3.46]);
  add(new THREE.BoxGeometry(1.35, 1.15, 0.06), glass, [2.55, 1.55, 3.46]);
  const frameMat = new THREE.MeshStandardMaterial({ color: 0xe8dfc8, roughness: 0.6 });
  add(new THREE.BoxGeometry(1.5, 0.08, 0.08), frameMat, [-2.55, 2.15, 3.48]);
  add(new THREE.BoxGeometry(1.5, 0.08, 0.08), frameMat, [2.55, 2.15, 3.48]);

  // Living furniture
  add(new THREE.BoxGeometry(2.3, 0.5, 0.9), wood, [-1.1, 0.42, -0.85]);
  add(new THREE.BoxGeometry(2.3, 0.35, 0.2), wood, [-1.1, 0.85, -1.2]);
  add(new THREE.CylinderGeometry(0.5, 0.55, 0.4, 24), wood, [0.1, 0.35, 0.45]);
  add(new THREE.CylinderGeometry(0.52, 0.52, 0.05, 24), ceramic, [0.1, 0.58, 0.45]);

  // Renovation props
  add(new THREE.CylinderGeometry(0.22, 0.25, 0.4, 16), new THREE.MeshStandardMaterial({ color: 0xd4a017, roughness: 0.4 }), [-2.6, 0.35, 1.4]);
  add(new THREE.BoxGeometry(0.08, 1.8, 0.45), wood, [1.3, 0.95, 1.8], [0, 0.4, -0.15]);
  add(new THREE.BoxGeometry(0.7, 0.12, 0.35), new THREE.MeshStandardMaterial({ color: 0x4a5560 }), [-2.1, 0.2, 2.0]);

  // Picture / wall accent inside
  add(new THREE.BoxGeometry(0.9, 0.65, 0.04), new THREE.MeshStandardMaterial({ color: 0xd4a017, roughness: 0.5 }), [-4.05, 1.55, 0.2], [0, Math.PI / 2, 0]);

  // Summer cabin outside (видно из окна)
  add(new THREE.BoxGeometry(1.9, 1.45, 1.5), wood, [3.35, 0.8, 2.45]);
  const cabinRoof = add(new THREE.ConeGeometry(1.45, 0.65, 4), roof, [3.35, 1.8, 2.45]);
  cabinRoof.rotation.y = Math.PI / 4;
  add(new THREE.BoxGeometry(0.35, 0.7, 0.06), glass, [3.35, 0.95, 3.22]);

  // Path & planters
  add(new THREE.BoxGeometry(1.15, 0.06, 3.4), ceramic, [0.1, 0.05, 4.55]);
  add(new THREE.CylinderGeometry(0.35, 0.4, 0.35, 12), new THREE.MeshStandardMaterial({ color: 0x8b5a3c }), [-1.4, 0.25, 4.2]);
  add(new THREE.SphereGeometry(0.32, 12, 12), new THREE.MeshStandardMaterial({ color: 0x3f6b45 }), [-1.4, 0.55, 4.2]);
  add(new THREE.CylinderGeometry(0.35, 0.4, 0.35, 12), new THREE.MeshStandardMaterial({ color: 0x8b5a3c }), [1.5, 0.25, 4.3]);
  add(new THREE.SphereGeometry(0.28, 12, 12), new THREE.MeshStandardMaterial({ color: 0x4f8158 }), [1.5, 0.52, 4.3]);

  // Apartment tower (видно из глубины)
  add(new THREE.BoxGeometry(1.45, 3.6, 1.45), plaster, [2.45, 1.85, -2.45]);
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 2; col++) {
      add(
        new THREE.PlaneGeometry(0.32, 0.32),
        glass,
        [1.71, 0.55 + row * 0.55, -2.2 + col * 0.5],
        [0, Math.PI / 2, 0]
      );
    }
  }

  // Interior lighting
  const lamp = new THREE.PointLight(0xffe2a8, 1.35, 9, 2);
  lamp.position.set(-0.4, 2.35, 0.3);
  scene.add(lamp);
  const entryLight = new THREE.PointLight(0xfff2d0, 0.85, 6, 2);
  entryLight.position.set(0, 2.2, 2.4);
  scene.add(entryLight);
  const windowLight = new THREE.PointLight(0xcfe8ff, 0.55, 5, 2);
  windowLight.position.set(-2.4, 1.7, 2.8);
  scene.add(windowLight);
}

async function init() {
  if (!canvas || !window.WebGLRenderingContext) {
    setHint("WebGL недоступен — откройте «Список»");
    return;
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
  } catch {
    setHint("Не удалось запустить 3D");
    return;
  }

  const scene = new THREE.Scene();
  const fogColor = new THREE.Color(0x141a16);
  scene.fog = new THREE.Fog(fogColor, 12, 28);

  const camera = new THREE.PerspectiveCamera(isMobile() ? 62 : 58, 1, 0.08, 100);
  // Старт снаружи — затем вход
  camera.position.set(...ENTER.outside.cam);
  const lookNow = new THREE.Vector3(...ENTER.outside.look);
  camera.lookAt(lookNow);

  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const sun = new THREE.DirectionalLight(0xffe2a8, 1.35);
  sun.position.set(5, 9, 4);
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0x8fb59a, 0.4);
  fill.position.set(-6, 3, -3);
  scene.add(fill);
  const hemi = new THREE.HemisphereLight(0xddeeff, 0x3a4a30, 0.35);
  scene.add(hemi);

  const textures = {};
  try {
    const [brick, plaster, wood, floor, roof, grass, wallpaper, ceramic] = await Promise.all([
      loadTexture("images/textures/brick.svg"),
      loadTexture("images/textures/plaster.svg"),
      loadTexture("images/textures/wood.svg"),
      loadTexture("images/textures/floor.svg"),
      loadTexture("images/textures/roof.svg"),
      loadTexture("images/textures/grass.svg"),
      loadTexture("images/textures/wallpaper.svg"),
      loadTexture("images/textures/tile-ceramic.svg"),
    ]);
    Object.assign(textures, { brick, plaster, wood, floor, roof, grass, wallpaper, ceramic });
  } catch {
    // Materials fall back to solid colors inside buildHouse
  }

  await buildHouse(scene, textures);

  const pickables = [];
  const tiles = [];
  const labels = [];
  const iconImgs = await Promise.all(
    STOPS.map((s) => loadImage(s.icon).catch(() => null))
  );

  STOPS.forEach((stop, index) => {
    const tileMat = new THREE.MeshStandardMaterial({
      color: stop.color,
      emissive: stop.color,
      emissiveIntensity: 0.4,
      roughness: 0.3,
      metalness: 0.25,
      side: THREE.DoubleSide,
    });
    const tile = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.95, 0.12), tileMat);
    tile.position.copy(stop.position);
    tile.userData = { href: stop.href, title: stop.title, index, kind: "tile" };
    scene.add(tile);
    tiles.push(tile);

    // Icon plane on tile front
    if (iconImgs[index]) {
      const iconTex = new THREE.CanvasTexture(iconImgs[index]);
      iconTex.colorSpace = THREE.SRGBColorSpace;
      const icon = new THREE.Mesh(
        new THREE.PlaneGeometry(0.72, 0.72),
        new THREE.MeshBasicMaterial({ map: iconTex, transparent: true })
      );
      icon.position.set(0, 0, 0.08);
      tile.add(icon);
    }

    const hit = new THREE.Mesh(
      new THREE.SphereGeometry(1.05, 16, 16),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
    );
    hit.position.copy(stop.position);
    hit.userData = { href: stop.href, title: stop.title, index, kind: "hit" };
    scene.add(hit);
    pickables.push(hit, tile);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.72, 0.92, 40),
      new THREE.MeshBasicMaterial({ color: 0xd4a017, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(stop.position.x, 0.08, stop.position.z);
    scene.add(ring);

    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(isMobile() ? 1.55 : 1.85, isMobile() ? 0.72 : 0.88),
      new THREE.MeshBasicMaterial({
        map: makeLabelTexture(stop.title, stop.subtitle, iconImgs[index]),
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    label.position.set(stop.position.x, stop.position.y + 1.1, stop.position.z);
    label.userData = { href: stop.href, title: stop.title, index, kind: "label" };
    scene.add(label);
    labels.push(label);
    pickables.push(label);
  });

  if (stepsEl) {
    stepsEl.innerHTML = STOPS.map(
      (s, i) =>
        `<li><button type="button" class="tour-step" data-index="${i}" aria-label="${s.title}"><img src="${s.icon}" alt="" width="18" height="18" /><span>${i + 1}</span></button></li>`
    ).join("");
  }

  let activeIndex = 0;
  const camFrom = new THREE.Vector3().copy(camera.position);
  const camTo = new THREE.Vector3().copy(camera.position);
  const lookFrom = new THREE.Vector3().copy(lookNow);
  const lookTo = new THREE.Vector3().copy(lookNow);
  let camT = 1;
  let lookYaw = 0;
  let lookPitch = 0;
  let entering = true;
  let enterPhase = 0; // 0 outside→door, 1 door→inside stop

  function openStop(index = activeIndex) {
    const stop = STOPS[index];
    if (stop?.href) window.location.assign(stop.href);
  }

  function goTo(index, instant = false) {
    if (entering && !instant) return;
    activeIndex = (index + STOPS.length) % STOPS.length;
    const stop = STOPS[activeIndex];
    lookYaw = 0;
    lookPitch = 0;
    camFrom.copy(camera.position);
    lookFrom.copy(lookNow);
    camTo.copy(camOf(stop));
    lookTo.copy(lookOf(stop));
    camT = instant || reducedMotion ? 1 : 0;

    if (tourCopy) tourCopy.textContent = stop.copy;
    setHint(`Точка ${activeIndex + 1}: ${stop.title}`);

    stepsEl?.querySelectorAll(".tour-step").forEach((btn, i) => {
      btn.classList.toggle("is-active", i === activeIndex);
    });

    tiles.forEach((mesh) => {
      const on = mesh.userData.index === activeIndex;
      mesh.material.emissiveIntensity = on ? 0.95 : 0.3;
      mesh.scale.setScalar(on ? 1.18 : 1);
    });
  }

  function startEntrance() {
    entering = true;
    enterPhase = 0;
    if (tourCopy) tourCopy.textContent = "Входим в дом…";
    setHint("Вход в дом");

    if (reducedMotion) {
      entering = false;
      goTo(0, true);
      setHint(defaultHint());
      return;
    }

    camera.position.set(...ENTER.outside.cam);
    lookNow.set(...ENTER.outside.look);
    camFrom.copy(camera.position);
    lookFrom.copy(lookNow);
    camTo.set(...ENTER.doorway.cam);
    lookTo.set(...ENTER.doorway.look);
    camT = 0;
  }

  function onEntranceStepDone() {
    if (enterPhase === 0) {
      enterPhase = 1;
      camFrom.copy(camera.position);
      lookFrom.copy(lookNow);
      camTo.copy(camOf(STOPS[0]));
      lookTo.copy(lookOf(STOPS[0]));
      camT = 0;
      if (tourCopy) tourCopy.textContent = "Осматриваемся внутри…";
      return;
    }
    entering = false;
    goTo(0, true);
    setHint(defaultHint());
  }

  startEntrance();

  btnNext?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (entering) return;
    goTo(activeIndex + 1);
  });
  btnPrev?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (entering) return;
    goTo(activeIndex - 1);
  });
  btnOpen?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (entering) return;
    openStop(activeIndex);
  });
  stepsEl?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-index]");
    if (!btn || entering) return;
    e.stopPropagation();
    const index = Number(btn.dataset.index);
    if (index === activeIndex) openStop(index);
    else goTo(index);
  });

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const drag = { active: false, moved: false, startX: 0, startY: 0, lastX: 0, lastY: 0, pointerId: null };

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile() ? 1.75 : 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(h, 1);
    camera.fov = isMobile() ? 62 : 58;
    camera.updateProjectionMatrix();
  }

  resize();
  window.addEventListener("resize", () => {
    resize();
    if (!drag.active && !entering) {
      camTo.copy(camOf(STOPS[activeIndex]));
      camFrom.copy(camera.position);
      camT = 0;
    }
  });

  function setPointer(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  }

  function pick() {
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObjects(pickables, false)[0]?.object || null;
  }

  /** Осмотр изнутри: поворот взгляда вокруг позиции камеры */
  function applyLook(dx, dy) {
    lookYaw -= dx * 0.0045;
    lookPitch -= dy * 0.003;
    lookPitch = THREE.MathUtils.clamp(lookPitch, -0.55, 0.45);

    const stop = STOPS[activeIndex];
    const baseDir = lookOf(stop).clone().sub(camOf(stop)).normalize();
    const spherical = new THREE.Spherical().setFromVector3(baseDir);
    spherical.theta += lookYaw;
    spherical.phi = THREE.MathUtils.clamp(spherical.phi + lookPitch, 0.35, Math.PI - 0.35);

    const dir = new THREE.Vector3().setFromSpherical(spherical);
    lookNow.copy(camera.position).add(dir.multiplyScalar(3.2));
    lookTo.copy(lookNow);
    lookFrom.copy(lookNow);
    camT = 1;
  }

  canvas.addEventListener("pointerdown", (event) => {
    if (entering) return;
    if (event.button != null && event.button !== 0) return;
    drag.active = true;
    drag.moved = false;
    drag.startX = event.clientX;
    drag.startY = event.clientY;
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
    drag.pointerId = event.pointerId;
    canvas.setPointerCapture?.(event.pointerId);
    setPointer(event.clientX, event.clientY);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (entering) return;
    setPointer(event.clientX, event.clientY);
    if (drag.active) {
      if (Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) > 10) drag.moved = true;
      const dx = event.clientX - drag.lastX;
      const dy = event.clientY - drag.lastY;
      drag.lastX = event.clientX;
      drag.lastY = event.clientY;
      if (drag.moved) applyLook(dx, dy);
      return;
    }
    const hit = pick();
    canvas.style.cursor = hit ? "pointer" : "grab";
    setHint(hit ? `Открыть: ${hit.userData.title}` : defaultHint());
  });

  function endDrag(event) {
    if (!drag.active) return;
    const wasDrag = drag.moved;
    drag.active = false;
    try {
      canvas.releasePointerCapture?.(drag.pointerId);
    } catch {
      /* ignore */
    }
    if (wasDrag) {
      setHint(defaultHint());
      return;
    }
    setPointer(event.clientX, event.clientY);
    const hit = pick();
    if (hit?.userData?.href) window.location.assign(hit.userData.href);
    else setHint(defaultHint());
  }

  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);
  canvas.addEventListener("click", (event) => {
    if (entering || drag.moved) return;
    setPointer(event.clientX, event.clientY);
    const hit = pick();
    if (hit?.userData?.href) window.location.assign(hit.userData.href);
  });

  setHint("Входим в дом…");

  let frame = 0;
  function animate() {
    frame = requestAnimationFrame(animate);
    if (camT < 1) {
      const speed = entering ? 0.028 : 0.05;
      camT = Math.min(1, camT + (reducedMotion ? 1 : speed));
      const k = 1 - Math.pow(1 - camT, 3);
      camera.position.lerpVectors(camFrom, camTo, k);
      lookNow.lerpVectors(lookFrom, lookTo, k);
      if (camT >= 1 && entering) onEntranceStepDone();
    }
    camera.lookAt(lookNow);

    const t = performance.now() * 0.002;
    tiles.forEach((mesh) => {
      const base = STOPS[mesh.userData.index].position;
      mesh.position.y = base.y + Math.sin(t + mesh.userData.index) * 0.04;
      mesh.rotation.y += 0.01;
    });
    labels.forEach((label) => {
      const on = label.userData.index === activeIndex && !entering;
      label.visible = on;
      label.quaternion.copy(camera.quaternion);
      const tile = tiles[label.userData.index];
      const base = STOPS[label.userData.index].position;
      label.position.set(base.x, tile.position.y + 0.85, base.z);
    });
    pickables.forEach((obj) => {
      if (obj.userData.kind === "hit") obj.position.copy(tiles[obj.userData.index].position);
    });

    renderer.render(scene, camera);
  }

  animate();
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(frame);
    else animate();
  });
}

init().catch(() => setHint("3D-экскурсия недоступна — откройте «Список»"));
