const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "images");
fs.mkdirSync(dir, { recursive: true });

function mk(name, title, c1, c2, shapes) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="1000" fill="url(#g)"/>
  ${shapes}
  <rect x="0" y="720" width="1600" height="280" fill="rgba(10,14,12,0.45)"/>
  <text x="80" y="880" fill="#ebe3cf" font-family="Arial,sans-serif" font-size="54" font-weight="700">${title}</text>
</svg>`;
  fs.writeFileSync(path.join(dir, name), svg);
}

mk(
  "private-1.svg",
  "Частный дом",
  "#2a3830",
  "#141a16",
  `<path d="M260 720V380l220-110 220 110v340H260z" fill="#415648"/>
   <path d="M260 380l220-110 220 110" fill="none" stroke="#d4a017" stroke-width="6"/>
   <rect x="340" y="500" width="60" height="120" fill="#1a211c"/>
   <rect x="460" y="470" width="80" height="70" fill="#1a211c"/>
   <path d="M820 720V340l300-130 300 130v380H820z" fill="#36483c" opacity=".9"/>`
);

mk(
  "private-2.svg",
  "Участок",
  "#243028",
  "#101612",
  `<rect x="200" y="520" width="1200" height="200" fill="#2f4034"/>
   <path d="M300 520l180-160h200l180 160" fill="#4a5f50"/>
   <circle cx="1200" cy="220" r="70" fill="#e8dfc8" opacity=".2"/>`
);

mk(
  "private-3.svg",
  "Фасад",
  "#1f2a24",
  "#0e1310",
  `<path d="M400 750V420l300-150 300 150v330H400z" fill="#3a4d41"/>
   <path d="M400 420l300-150 300 150" stroke="#d4a017" stroke-width="5" fill="none"/>
   <rect x="520" y="540" width="70" height="140" fill="#121714"/>
   <rect x="680" y="500" width="100" height="80" fill="#121714"/>`
);

mk(
  "summer-1.svg",
  "Летний домик",
  "#314036",
  "#18211c",
  `<path d="M520 700V450l180-100 180 100v250H520z" fill="#5a4030"/>
   <path d="M520 450l180-100 180 100" fill="#7a5240"/>
   <rect x="640" y="540" width="50" height="100" fill="#2a2018"/>
   <circle cx="300" cy="560" r="90" fill="#2f5a38"/>
   <circle cx="1100" cy="580" r="110" fill="#2a5234"/>`
);

mk(
  "summer-2.svg",
  "Дача",
  "#2c3b32",
  "#121916",
  `<ellipse cx="800" cy="780" rx="600" ry="80" fill="#243028"/>
   <path d="M600 700V480l200-120 200 120v220H600z" fill="#6b4a36"/>
   <path d="M600 480l200-120 200 120" fill="#8a6048"/>`
);

mk(
  "summer-3.svg",
  "Гостевой дом",
  "#28362e",
  "#101612",
  `<path d="M450 720V500l250-140 250 140v220H450z" fill="#4d5f52"/>
   <rect x="650" y="560" width="55" height="110" fill="#1a211c"/>
   <path d="M200 720c80-120 160-120 240 0" fill="#355c3d"/>`
);

mk(
  "land-1.svg",
  "Участок",
  "#2e4a34",
  "#152018",
  `<rect x="0" y="620" width="1600" height="380" fill="#3d6b45"/>
   <path d="M100 620c200-80 400-80 600 0s400 80 600 0v380H100z" fill="#4f8158"/>
   <circle cx="300" cy="500" r="60" fill="#2f5a38"/>
   <circle cx="1200" cy="480" r="80" fill="#355c3d"/>`
);

mk(
  "land-2.svg",
  "Дорожки",
  "#334438",
  "#171e18",
  `<path d="M700 1000c-40-200 40-400 20-600s60-300 120-400" fill="none" stroke="#8a7a5a" stroke-width="70"/>
   <circle cx="400" cy="400" r="50" fill="#4a7a52"/>
   <circle cx="1100" cy="350" r="70" fill="#3f6a48"/>`
);

mk(
  "land-3.svg",
  "Озеленение",
  "#35553c",
  "#1a241c",
  `<rect x="0" y="700" width="1600" height="300" fill="#45724c"/>
   <circle cx="350" cy="620" r="120" fill="#2f5a38"/>
   <circle cx="700" cy="580" r="150" fill="#356640"/>
   <circle cx="1100" cy="610" r="130" fill="#2f5a38"/>`
);

mk(
  "finish-1.svg",
  "Интерьер",
  "#3a342c",
  "#1a1612",
  `<rect x="120" y="200" width="1360" height="650" fill="#4a4338"/>
   <rect x="200" y="280" width="500" height="320" fill="#2a3230"/>
   <rect x="780" y="500" width="520" height="200" fill="#c9bda3"/>
   <rect x="220" y="640" width="200" height="80" fill="#d4a017" opacity=".5"/>`
);

mk(
  "finish-2.svg",
  "Кухня",
  "#2f3430",
  "#141816",
  `<rect x="100" y="250" width="1400" height="600" fill="#3a403c"/>
   <rect x="160" y="520" width="900" height="220" fill="#5a6058"/>
   <rect x="1100" y="300" width="320" height="440" fill="#2a302c"/>
   <rect x="200" y="360" width="180" height="120" fill="#1a211c"/>`
);

mk(
  "finish-3.svg",
  "Спальня",
  "#322e2a",
  "#161210",
  `<rect x="150" y="220" width="1300" height="620" fill="#433c36"/>
   <rect x="420" y="480" width="760" height="280" fill="#c9bda3"/>
   <rect x="250" y="300" width="280" height="180" fill="#2a3230"/>`
);

const windows = Array.from({ length: 18 }, (_, i) => {
  const x = 240 + (i % 3) * 70;
  const y = 320 + Math.floor(i / 3) * 60;
  return `<rect x="${x}" y="${y}" width="40" height="30"/>`;
}).join("");

mk(
  "apt-1.svg",
  "ЖК",
  "#2a3238",
  "#101418",
  `<rect x="200" y="280" width="280" height="440" fill="#4a5560"/>
   <rect x="520" y="200" width="320" height="520" fill="#5a6570"/>
   <rect x="880" y="260" width="300" height="460" fill="#3a4550"/>
   <g fill="#1a211c">${windows}</g>`
);

const facade = Array.from({ length: 40 }, (_, i) => {
  const x = 220 + (i % 8) * 140;
  const y = 240 + Math.floor(i / 8) * 100;
  return `<rect x="${x}" y="${y}" width="70" height="50"/>`;
}).join("");

mk(
  "apt-2.svg",
  "Фасад ЖК",
  "#243038",
  "#0e1216",
  `<rect x="150" y="180" width="1300" height="620" fill="#3a4650"/>
   <g fill="#12181c">${facade}</g>`
);

mk(
  "apt-3.svg",
  "Стройка",
  "#2c2a24",
  "#12100e",
  `<rect x="0" y="700" width="1600" height="300" fill="#3a3830"/>
   <rect x="500" y="250" width="600" height="450" fill="#5a5848" opacity=".7"/>
   <path d="M500 250h600" stroke="#d4a017" stroke-width="4"/>
   <line x1="200" y1="700" x2="500" y2="250" stroke="#c9bda3" stroke-width="3"/>
   <line x1="1400" y1="700" x2="1100" y2="250" stroke="#c9bda3" stroke-width="3"/>`
);

console.log("created", fs.readdirSync(dir).length, "images");
