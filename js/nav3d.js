import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";

const STOPS = [
  {
    id: "private",
    title: "Частная территория",
    subtitle: "Участок и посадка дома",
    href: "private.html",
    copy: "Здесь начинается дом: участок, фундамент и посадка на вашей территории.",
    position: new THREE.Vector3(-2.2, 1.15, 2.4),
    camera: new THREE.Vector3(0.2, 2.4, 6.2),
    lookAt: new THREE.Vector3(-1.4, 1.0, 1.2),
    color: 0xd4a017,
  },
  {
    id: "summer",
    title: "Летние домики",
    subtitle: "Гостевой / дачный объём",
    href: "summer.html",
    copy: "Лёгкий летний домик во дворе — для гостей, бани или сезонного отдыха.",
    position: new THREE.Vector3(2.6, 1.05, 2.1),
    camera: new THREE.Vector3(4.8, 2.2, 5.4),
    lookAt: new THREE.Vector3(2.2, 1.0, 1.0),
    color: 0xc48a2a,
  },
  {
    id: "landscaping",
    title: "Отделка участка",
    subtitle: "Двор и озеленение",
    href: "landscaping.html",
    copy: "Дорожки, газон и свет: двор должен работать каждый день, не только на фото.",
    position: new THREE.Vector3(0.1, 0.55, 3.3),
    camera: new THREE.Vector3(0.4, 2.8, 7.0),
    lookAt: new THREE.Vector3(0.1, 0.4, 2.0),
    color: 0x6f8f6a,
  },
  {
    id: "finish",
    title: "Отделка под ключ",
    subtitle: "Интерьер гостиной",
    href: "finish.html",
    copy: "Чистовая отделка внутри: от стяжки и электрики до света и мебели.",
    position: new THREE.Vector3(-0.3, 1.25, -0.2),
    camera: new THREE.Vector3(0.0, 1.7, 2.8),
    lookAt: new THREE.Vector3(-0.3, 1.2, -0.8),
    color: 0xe8dfc8,
  },
  {
    id: "apartments",
    title: "Многоквартирные",
    subtitle: "Вид на ЖК",
    href: "apartments.html",
    copy: "За окном — другой масштаб: секции, этажи и дворы многоквартирных домов.",
    position: new THREE.Vector3(1.9, 1.55, -1.8),
    camera: new THREE.Vector3(-0.5, 1.9, -0.2),
    lookAt: new THREE.Vector3(2.2, 1.5, -2.2),
    color: 0x8aa4b8,
  },
];

const canvas = document.getElementById("nav-canvas");
const hint = document.getElementById("hub-hint");
const fallback = document.getElementById("hub-fallback");
const tourCopy = document.getElementById("tour-copy");
const stepsEl = document.getElementById("tour-steps");
const btnPrev = document.getElementById("tour-prev");
const btnNext = document.getElementById("tour-next");
const btnOpen = document.getElementById("tour-open");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function showFallback(message) {
  setHint(message || "Выберите категорию ниже");
  fallback?.classList.add("is-visible");
}

function isMobile() {
  return window.matchMedia("(max-width: 760px)").matches;
}

function setHint(text) {
  if (hint) hint.textContent = text;
}

function defaultHint() {
  return isMobile()
    ? "Крутите сцену · нажмите плитку или «Открыть»"
    : "Крутите мышью · кликните плитку или «Открыть»";
}

function makeLabelTexture(title, subtitle) {
  const w = 1024;
  const h = 512;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");

  ctx.fillStyle = "rgba(14,19,16,0.92)";
  roundRect(ctx, 16, 16, w - 32, h - 32, 24);
  ctx.fill();
  ctx.strokeStyle = "#d4a017";
  ctx.lineWidth = 10;
  roundRect(ctx, 16, 16, w - 32, h - 32, 24);
  ctx.stroke();

  ctx.fillStyle = "#ebe3cf";
  ctx.font = "700 58px Unbounded, Arial, sans-serif";
  wrapText(ctx, title, 64, 170, w - 128, 66);

  ctx.fillStyle = "#d4a017";
  ctx.font = "500 36px Commissioner, Arial, sans-serif";
  ctx.fillText(subtitle, 64, 320);

  ctx.fillStyle = "#b8ae97";
  ctx.font = "500 32px Commissioner, Arial, sans-serif";
  ctx.fillText("Нажмите, чтобы открыть →", 64, 400);

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

function buildHouse(scene) {
  const matWall = new THREE.MeshStandardMaterial({ color: 0x3a4a40, roughness: 0.85, metalness: 0.05 });
  const matFloor = new THREE.MeshStandardMaterial({ color: 0x2a322c, roughness: 0.9 });
  const matAccent = new THREE.MeshStandardMaterial({ color: 0xd4a017, roughness: 0.45, metalness: 0.2 });
  const matGlass = new THREE.MeshStandardMaterial({
    color: 0x8ec8ff,
    transparent: true,
    opacity: 0.22,
    roughness: 0.1,
    metalness: 0.4,
  });
  const matWood = new THREE.MeshStandardMaterial({ color: 0x6b4a36, roughness: 0.8 });

  const floor = new THREE.Mesh(new THREE.BoxGeometry(8.4, 0.18, 7.2), matFloor);
  floor.position.set(0, 0, 0.2);
  scene.add(floor);

  const yard = new THREE.Mesh(
    new THREE.CircleGeometry(7.5, 48),
    new THREE.MeshStandardMaterial({ color: 0x2f5a38, roughness: 1 })
  );
  yard.rotation.x = -Math.PI / 2;
  yard.position.y = -0.08;
  scene.add(yard);

  const back = new THREE.Mesh(new THREE.BoxGeometry(8.4, 2.8, 0.18), matWall);
  back.position.set(0, 1.4, -3.2);
  scene.add(back);

  const left = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.8, 6.4), matWall);
  left.position.set(-4.1, 1.4, 0);
  scene.add(left);

  const right = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.8, 6.4), matWall);
  right.position.set(4.1, 1.4, 0);
  scene.add(right);

  const frontLeft = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.8, 0.18), matWall);
  frontLeft.position.set(-2.8, 1.4, 3.3);
  scene.add(frontLeft);

  const frontRight = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.8, 0.18), matWall);
  frontRight.position.set(2.8, 1.4, 3.3);
  scene.add(frontRight);

  const door = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.1, 0.12), matWood);
  door.position.set(0, 1.05, 3.28);
  scene.add(door);

  const roof = new THREE.Mesh(new THREE.ConeGeometry(6.2, 1.8, 4), matAccent);
  roof.position.set(0, 3.5, 0);
  roof.rotation.y = Math.PI / 4;
  scene.add(roof);

  const windowL = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.1), matGlass);
  windowL.position.set(-2.6, 1.5, 3.4);
  scene.add(windowL);

  const windowR = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.1), matGlass);
  windowR.position.set(2.6, 1.5, 3.4);
  scene.add(windowR);

  const sofa = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.55, 0.85), matWood);
  sofa.position.set(-1.2, 0.45, -0.8);
  scene.add(sofa);

  const table = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.45, 24), matAccent);
  table.position.set(-0.2, 0.35, 0.4);
  scene.add(table);

  const summerCabin = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.4, 1.4), matWood);
  summerCabin.position.set(3.3, 0.75, 2.4);
  scene.add(summerCabin);

  const cabinRoof = new THREE.Mesh(new THREE.ConeGeometry(1.4, 0.7, 4), matAccent);
  cabinRoof.rotation.y = Math.PI / 4;
  cabinRoof.position.set(3.3, 1.75, 2.4);
  scene.add(cabinRoof);

  const path = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 0.05, 3.2),
    new THREE.MeshStandardMaterial({ color: 0x8a7a5a, roughness: 1 })
  );
  path.position.set(0.1, 0.02, 4.4);
  scene.add(path);

  const tower = new THREE.Mesh(
    new THREE.BoxGeometry(1.3, 3.4, 1.3),
    new THREE.MeshStandardMaterial({ color: 0x4a5560, roughness: 0.75 })
  );
  tower.position.set(2.4, 1.7, -2.5);
  scene.add(tower);

  for (let i = 0; i < 6; i++) {
    const win = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.28), matGlass);
    win.position.set(1.74, 0.7 + i * 0.45, -2.5);
    win.rotation.y = Math.PI / 2;
    scene.add(win);
  }
}

async function init() {
  if (!canvas || !window.WebGLRenderingContext) {
    showFallback("WebGL недоступен — откройте категорию списком");
    return;
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile(),
      alpha: true,
      powerPreference: "high-performance",
    });
  } catch {
    showFallback("Не удалось запустить 3D-экскурсию");
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.copy(STOPS[0].camera);

  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const key = new THREE.DirectionalLight(0xffe2a8, 1.2);
  key.position.set(4, 8, 5);
  const fill = new THREE.DirectionalLight(0x6f8f6a, 0.45);
  fill.position.set(-5, 3, -2);
  scene.add(key, fill);

  buildHouse(scene);

  const pickables = [];
  const tiles = [];
  const labels = [];

  STOPS.forEach((stop, index) => {
    const tile = new THREE.Mesh(
      new THREE.BoxGeometry(1.05, 1.05, 0.14),
      new THREE.MeshStandardMaterial({
        color: stop.color,
        emissive: stop.color,
        emissiveIntensity: 0.35,
        roughness: 0.35,
        metalness: 0.25,
        side: THREE.DoubleSide,
      })
    );
    tile.position.copy(stop.position);
    tile.userData = { href: stop.href, title: stop.title, index, kind: "tile" };
    scene.add(tile);
    tiles.push(tile);

    // Large invisible hit box — reliable clicks
    const hit = new THREE.Mesh(
      new THREE.SphereGeometry(0.95, 16, 16),
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
    );
    hit.position.copy(stop.position);
    hit.userData = { href: stop.href, title: stop.title, index, kind: "hit" };
    scene.add(hit);
    pickables.push(hit);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.7, 0.9, 32),
      new THREE.MeshBasicMaterial({
        color: 0xd4a017,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
      })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(stop.position.x, 0.06, stop.position.z);
    scene.add(ring);

    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 1.1),
      new THREE.MeshBasicMaterial({
        map: makeLabelTexture(stop.title, stop.subtitle),
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    label.position.set(stop.position.x, stop.position.y + 1.05, stop.position.z);
    label.userData = { href: stop.href, title: stop.title, index, kind: "label" };
    scene.add(label);
    labels.push(label);
    pickables.push(label);
    pickables.push(tile);
  });

  if (stepsEl) {
    stepsEl.innerHTML = STOPS.map(
      (s, i) =>
        `<li><button type="button" class="tour-step" data-index="${i}" aria-label="${s.title}">${i + 1}</button></li>`
    ).join("");
  }

  let activeIndex = 0;
  const camFrom = new THREE.Vector3().copy(STOPS[0].camera);
  const camTo = new THREE.Vector3().copy(STOPS[0].camera);
  const lookFrom = new THREE.Vector3().copy(STOPS[0].lookAt);
  const lookTo = new THREE.Vector3().copy(STOPS[0].lookAt);
  const lookNow = new THREE.Vector3().copy(STOPS[0].lookAt);
  let camT = 1;
  let orbitYaw = 0;

  function openStop(index = activeIndex) {
    const stop = STOPS[index];
    if (stop?.href) window.location.assign(stop.href);
  }

  function goTo(index, instant = false) {
    activeIndex = (index + STOPS.length) % STOPS.length;
    const stop = STOPS[activeIndex];
    orbitYaw = 0;
    camFrom.copy(camera.position);
    lookFrom.copy(lookNow);
    camTo.copy(stop.camera);
    lookTo.copy(stop.lookAt);
    camT = instant || reducedMotion ? 1 : 0;

    if (tourCopy) tourCopy.textContent = stop.copy;
    setHint(`Точка ${activeIndex + 1}: ${stop.title}`);
    if (btnOpen) btnOpen.textContent = "Открыть";

    stepsEl?.querySelectorAll(".tour-step").forEach((btn, i) => {
      btn.classList.toggle("is-active", i === activeIndex);
    });

    tiles.forEach((mesh) => {
      const on = mesh.userData.index === activeIndex;
      mesh.material.emissiveIntensity = on ? 0.9 : 0.28;
      mesh.scale.setScalar(on ? 1.15 : 1);
    });
  }

  goTo(0, true);

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
    openStop(activeIndex);
  });
  stepsEl?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-index]");
    if (!btn) return;
    e.stopPropagation();
    const index = Number(btn.dataset.index);
    if (index === activeIndex) {
      openStop(index);
      return;
    }
    goTo(index);
  });

  const raycaster = new THREE.Raycaster();
  raycaster.params.Mesh = { threshold: 0.2 };
  const pointer = new THREE.Vector2();

  const drag = {
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    pointerId: null,
  };

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile() ? 1.75 : 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(h, 1);
    camera.updateProjectionMatrix();
  }

  resize();
  window.addEventListener("resize", resize);

  function setPointer(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  }

  function pick() {
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(pickables, false);
    return hits[0]?.object || null;
  }

  function applyOrbit(dx) {
    orbitYaw += dx * 0.005;
    const stop = STOPS[activeIndex];
    const base = stop.camera.clone().sub(stop.lookAt);
    const spherical = new THREE.Spherical().setFromVector3(base);
    spherical.theta += orbitYaw;
    spherical.phi = THREE.MathUtils.clamp(spherical.phi, 0.4, 1.4);
    camera.position.copy(stop.lookAt).add(new THREE.Vector3().setFromSpherical(spherical));
    camTo.copy(camera.position);
    camFrom.copy(camera.position);
    camT = 1;
  }

  canvas.addEventListener("pointerdown", (event) => {
    if (event.button != null && event.button !== 0) return;
    drag.active = true;
    drag.moved = false;
    drag.startX = event.clientX;
    drag.startY = event.clientY;
    drag.lastX = event.clientX;
    drag.pointerId = event.pointerId;
    canvas.setPointerCapture?.(event.pointerId);
    setPointer(event.clientX, event.clientY);
  });

  canvas.addEventListener("pointermove", (event) => {
    setPointer(event.clientX, event.clientY);

    if (drag.active) {
      const dist = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
      if (dist > 10) drag.moved = true;
      const dx = event.clientX - drag.lastX;
      drag.lastX = event.clientX;
      if (drag.moved) applyOrbit(dx);
      return;
    }

    const hit = pick();
    canvas.style.cursor = hit ? "pointer" : "grab";
    if (hit) setHint(`Открыть: ${hit.userData.title}`);
    else setHint(defaultHint());
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
    if (hit?.userData?.href) {
      window.location.assign(hit.userData.href);
      return;
    }

    // Tap empty space on active stop still allows open via nearby threshold
    setHint(defaultHint());
  }

  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);

  canvas.addEventListener("click", (event) => {
    if (drag.moved) return;
    setPointer(event.clientX, event.clientY);
    const hit = pick();
    if (hit?.userData?.href) window.location.assign(hit.userData.href);
  });

  setHint(defaultHint());
  if (stepsEl) {
    stepsEl.title = "Клик — к точке, повторный клик по активной — открыть раздел";
  }

  let frame = 0;
  function animate() {
    frame = requestAnimationFrame(animate);

    if (camT < 1) {
      camT = Math.min(1, camT + (reducedMotion ? 1 : 0.05));
      const k = 1 - Math.pow(1 - camT, 3);
      camera.position.lerpVectors(camFrom, camTo, k);
      lookNow.lerpVectors(lookFrom, lookTo, k);
    }

    camera.lookAt(lookNow);

    const t = performance.now() * 0.002;
    tiles.forEach((mesh) => {
      const baseY = STOPS[mesh.userData.index].position.y;
      mesh.position.y = baseY + Math.sin(t + mesh.userData.index) * 0.05;
      mesh.rotation.y += 0.012;
    });

    labels.forEach((label) => {
      const on = label.userData.index === activeIndex;
      label.visible = on;
      label.quaternion.copy(camera.quaternion);
      const base = STOPS[label.userData.index].position;
      label.position.set(base.x, tiles[label.userData.index].position.y + 1.05, base.z);
    });

    // Keep hit spheres synced with bobbing tiles
    pickables.forEach((obj) => {
      if (obj.userData.kind !== "hit") return;
      obj.position.copy(tiles[obj.userData.index].position);
    });

    renderer.render(scene, camera);
  }

  animate();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(frame);
    else animate();
  });
}

init().catch(() => showFallback("3D-экскурсия недоступна"));
