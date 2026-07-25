const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "images", "textures");
fs.mkdirSync(dir, { recursive: true });

function write(name, svg) {
  fs.writeFileSync(path.join(dir, name), svg.trim() + "\n");
}

write(
  "brick.svg",
  `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <pattern id="bricks" width="128" height="64" patternUnits="userSpaceOnUse">
      <rect width="128" height="64" fill="#8b5a3c"/>
      <rect x="2" y="2" width="60" height="28" fill="#a66b45"/>
      <rect x="66" y="2" width="60" height="28" fill="#9a613f"/>
      <rect x="-30" y="34" width="60" height="28" fill="#b0754d"/>
      <rect x="34" y="34" width="60" height="28" fill="#a06642"/>
      <rect x="98" y="34" width="60" height="28" fill="#94603d"/>
      <g stroke="#d8c4a8" stroke-width="2" fill="none" opacity=".55">
        <path d="M0 32h128M64 0v32M0 64h128M32 32v32"/>
      </g>
    </pattern>
  </defs>
  <rect width="512" height="512" fill="url(#bricks)"/>
  <rect width="512" height="512" fill="#000" opacity=".08"/>
</svg>`
);

write(
  "plaster.svg",
  `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="p" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#d9d2c3"/><stop offset="1" stop-color="#c7bead"/>
    </linearGradient>
    <filter id="n">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix values="0 0 0 0 0.75  0 0 0 0 0.72  0 0 0 0 0.65  0 0 0 0.18 0"/>
    </filter>
  </defs>
  <rect width="512" height="512" fill="url(#p)"/>
  <rect width="512" height="512" filter="url(#n)"/>
  <path d="M40 120h180M300 220h140M80 380h220" stroke="#b7ae9c" stroke-width="3" opacity=".35"/>
</svg>`
);

write(
  "wood.svg",
  `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="w" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#8a5a38"/><stop offset="1" stop-color="#6e452c"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#w)"/>
  <g fill="none" stroke="#c49a6c" stroke-width="3" opacity=".35">
    <path d="M0 40c80 20 120-20 200 0s140 30 220 0 90-10 92 10"/>
    <path d="M0 120c90 15 130-15 210 5s150 20 230-5"/>
    <path d="M0 210c70 25 140-10 210 10s160 15 302 0"/>
    <path d="M0 300c100 10 150-20 240 5s170 25 272 0"/>
    <path d="M0 390c80 20 160-15 250 8s180 18 262-4"/>
    <path d="M0 470c90 12 140-18 230 6s190 14 282-2"/>
  </g>
  <g stroke="#4a2f1c" stroke-width="2" opacity=".25">
    <line x1="0" y1="96" x2="512" y2="96"/>
    <line x1="0" y1="192" x2="512" y2="192"/>
    <line x1="0" y1="288" x2="512" y2="288"/>
    <line x1="0" y1="384" x2="512" y2="384"/>
  </g>
</svg>`
);

write(
  "floor.svg",
  `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#b89b6e"/>
  <g stroke="#8d734f" stroke-width="4">
    <line x1="0" y1="64" x2="512" y2="64"/>
    <line x1="0" y1="128" x2="512" y2="128"/>
    <line x1="0" y1="192" x2="512" y2="192"/>
    <line x1="0" y1="256" x2="512" y2="256"/>
    <line x1="0" y1="320" x2="512" y2="320"/>
    <line x1="0" y1="384" x2="512" y2="384"/>
    <line x1="0" y1="448" x2="512" y2="448"/>
  </g>
  <g fill="#d4b88a" opacity=".25">
    <rect x="0" y="0" width="512" height="20"/>
    <rect x="0" y="130" width="512" height="14"/>
    <rect x="0" y="260" width="512" height="18"/>
    <rect x="0" y="390" width="512" height="12"/>
  </g>
</svg>`
);

write(
  "roof.svg",
  `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#5a6a72"/>
  <defs>
    <pattern id="tiles" width="64" height="36" patternUnits="userSpaceOnUse">
      <path d="M0 18 L32 0 L64 18 L32 36 Z" fill="#6d7f88"/>
      <path d="M0 18 L32 36 L64 18" fill="none" stroke="#3e4a50" stroke-width="2"/>
    </pattern>
  </defs>
  <rect width="512" height="512" fill="url(#tiles)"/>
  <rect width="512" height="512" fill="#d4a017" opacity=".12"/>
</svg>`
);

write(
  "grass.svg",
  `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#3f6b45"/>
  <g stroke="#2f5435" stroke-width="2" opacity=".55">
    ${Array.from({ length: 80 }, (_, i) => {
      const x = (i * 47) % 512;
      const y = (i * 73) % 512;
      return `<path d="M${x} ${y} l4 -14 l4 14"/>`;
    }).join("")}
  </g>
  <circle cx="120" cy="160" r="40" fill="#4f8158" opacity=".4"/>
  <circle cx="360" cy="300" r="55" fill="#355c3d" opacity=".35"/>
</svg>`
);

write(
  "wallpaper.svg",
  `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#e8dfc8"/>
  <defs>
    <pattern id="orn" width="64" height="64" patternUnits="userSpaceOnUse">
      <circle cx="32" cy="32" r="10" fill="none" stroke="#d4a017" stroke-width="2" opacity=".45"/>
      <circle cx="32" cy="32" r="3" fill="#c9bda3"/>
    </pattern>
  </defs>
  <rect width="512" height="512" fill="url(#orn)"/>
</svg>`
);

write(
  "tile-ceramic.svg",
  `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#dfe6ea"/>
  <defs>
    <pattern id="cer" width="64" height="64" patternUnits="userSpaceOnUse">
      <rect width="60" height="60" x="2" y="2" fill="#f4f7f8" stroke="#b7c2c8" stroke-width="3"/>
    </pattern>
  </defs>
  <rect width="512" height="512" fill="url(#cer)"/>
</svg>`
);

// Hotspot icons
const icons = [
  ["icon-private.svg", "M40 140 L128 70 L216 140 V210 H40 Z", "M90 150 h36 v60 H90 Z", "#d4a017"],
  ["icon-summer.svg", "M60 170 L128 100 L196 170 V220 H60 Z", "M110 40 c20 0 30 25 18 40", "#c48a2a"],
  ["icon-land.svg", "M40 180 Q128 80 216 180 Z", "M70 180 h140", "#6f8f6a"],
  ["icon-finish.svg", "M50 70 h156 v120 H50 Z", "M70 210 h116 v20 H70 Z", "#e8dfc8"],
  ["icon-apt.svg", "M70 50 h40 v170 H70 Z M130 80 h40 v140 h-40 Z M190 60 h30 v160 h-30 Z", "", "#8aa4b8"],
];

for (const [name, a, b, color] of icons) {
  write(
    name,
    `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <rect width="256" height="256" rx="28" fill="#121714"/>
  <rect x="10" y="10" width="236" height="236" rx="22" fill="none" stroke="${color}" stroke-width="8"/>
  <g fill="none" stroke="${color}" stroke-width="10" stroke-linejoin="round" stroke-linecap="round">
    <path d="${a}"/>
    ${b ? `<path d="${b}"/>` : ""}
  </g>
</svg>`
  );
}

console.log("textures:", fs.readdirSync(dir).length);
