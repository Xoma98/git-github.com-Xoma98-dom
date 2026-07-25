const fs = require("fs");
const path = require("path");
const { pageShell } = require("./build-pages.cjs");

const creditLocal =
  'Иллюстрация: собственный SVG-ассет проекта (свободное использование). Дополнительно можно подключать фото <a href="https://unsplash.com/license" rel="noopener noreferrer" target="_blank">Unsplash License</a>.';

const pages = [
  {
    file: "private.html",
    active: "private",
    title: "Стройка домов на частной территории",
    description:
      "Проектируем и строим частные дома на вашем участке: от геологии и фундамента до кровли и фасада.",
    heroImage: "images/private-1.svg",
    heroCredit: creditLocal,
    intro:
      "Индивидуальные и типовые проекты для участков в городе и области. Свайный или ленточный фундамент, газобетон, кирпичный фасад.",
    features: [
      { title: "Под ваш участок", text: "Геология, посадка дома, коммуникации и въезд учитываем до старта работ." },
      { title: "Фиксированные этапы", text: "Смета и график фиксируются договором, отчёты — фото и видео." },
      { title: "Гарантия на конструктив", text: "Сопровождение после сдачи и понятный список гарантийных случаев." },
    ],
    gallery: [
      {
        src: "images/private-1.svg",
        alt: "Частный дом",
        caption: "Частный дом на участке",
        credit: "SVG asset",
        creditUrl: "images/private-1.svg",
      },
      {
        src: "images/private-2.svg",
        alt: "Участок с домом",
        caption: "Посадка дома на участке",
        credit: "SVG asset",
        creditUrl: "images/private-2.svg",
      },
      {
        src: "images/private-3.svg",
        alt: "Фасад дома",
        caption: "Фасад и входная группа",
        credit: "SVG asset",
        creditUrl: "images/private-3.svg",
      },
    ],
  },
  {
    file: "summer.html",
    active: "summer",
    title: "Стройка летних домиков",
    description:
      "Лёгкие дачные и гостевые домики: быстрый монтаж, разумный бюджет, сезонное или круглогодичное использование.",
    heroImage: "images/summer-1.svg",
    heroCredit: creditLocal,
    intro: "Каркас, мини-дома и дачные постройки для отдыха. Утепление, инженерия и отделка — по выбранному пакету.",
    features: [
      { title: "Быстрый цикл", text: "От согласования планировки до ключей — короткие сроки на типовых решениях." },
      { title: "Модульность", text: "Можно начать с базы и нарастить веранду, баню или хозблок позже." },
      { title: "Сезонность", text: "Варианты «лето» и «зима» с разным уровнем утепления и отопления." },
    ],
    gallery: [
      { src: "images/summer-1.svg", alt: "Летний домик", caption: "Компактный летний дом", credit: "SVG asset", creditUrl: "images/summer-1.svg" },
      { src: "images/summer-2.svg", alt: "Дача", caption: "Дачный домик", credit: "SVG asset", creditUrl: "images/summer-2.svg" },
      { src: "images/summer-3.svg", alt: "Гостевой дом", caption: "Гостевой дом на участке", credit: "SVG asset", creditUrl: "images/summer-3.svg" },
    ],
  },
  {
    file: "landscaping.html",
    active: "landscaping",
    title: "Отделка участка",
    description: "Благоустройство территории: дорожки, освещение, озеленение, дренаж и зоны отдыха вокруг дома.",
    heroImage: "images/land-1.svg",
    heroCredit: creditLocal,
    intro: "От плана участка до посадки растений и мощения. Двор должен работать каждый день, а не только на фото.",
    features: [
      { title: "Инженерная база", text: "Уклоны, ливнёвка, освещение и полив закладываем до декора." },
      { title: "Зонирование", text: "Парковка, сад, детская и барбекю-зона без пересечения потоков." },
      { title: "Уход", text: "Подбираем растения под климат и простой сезонный уход." },
    ],
    gallery: [
      { src: "images/land-1.svg", alt: "Озеленение", caption: "Газон и посадки", credit: "SVG asset", creditUrl: "images/land-1.svg" },
      { src: "images/land-2.svg", alt: "Дорожки", caption: "Садовые дорожки", credit: "SVG asset", creditUrl: "images/land-2.svg" },
      { src: "images/land-3.svg", alt: "Сад", caption: "Ландшафтная композиция", credit: "SVG asset", creditUrl: "images/land-3.svg" },
    ],
  },
  {
    file: "finish.html",
    active: "finish",
    title: "Отделка домов под ключ",
    description: "Чистовая отделка и инженерия: от стяжки и электрики до мебели и света — дом готов к заселению.",
    heroImage: "images/finish-1.svg",
    heroCredit: creditLocal,
    intro: "Дизайн-проект, комплектация и строительный контроль в одном контуре. Сдаём объект с актами и инструкцией.",
    features: [
      { title: "Один подрядчик", text: "Отделочники, электрики и сантехники работают по единому графику." },
      { title: "Смета без «серых» зон", text: "Материалы и работы прозрачны на каждом этапе." },
      { title: "Приёмка по чек-листу", text: "Проверяем геометрию, инженерию и чистоту до подписания акта." },
    ],
    gallery: [
      { src: "images/finish-1.svg", alt: "Гостиная", caption: "Гостиная после чистовой", credit: "SVG asset", creditUrl: "images/finish-1.svg" },
      { src: "images/finish-2.svg", alt: "Кухня", caption: "Кухня под ключ", credit: "SVG asset", creditUrl: "images/finish-2.svg" },
      { src: "images/finish-3.svg", alt: "Спальня", caption: "Спальня с чистовой отделкой", credit: "SVG asset", creditUrl: "images/finish-3.svg" },
    ],
  },
  {
    file: "apartments.html",
    active: "apartments",
    title: "Стройка многоквартирных домов",
    description: "Малоэтажные и среднеэтажные жилые дома: проектирование, стройка, инженерия и сдача секций.",
    heroImage: "images/apt-1.svg",
    heroCredit: creditLocal,
    intro: "Работаем с заказчиками и инвесторами: от концепции квартала до ввода в эксплуатацию.",
    features: [
      { title: "Проектная документация", text: "Архитектура, КЖ, инженерия и согласования в понятном пакете." },
      { title: "Поэтапная сдача", text: "Секции и этажи принимаются по актам с фотофиксацией скрытых работ." },
      { title: "Двор и МОП", text: "Благоустройство, входные группы и места общего пользования входят в контур." },
    ],
    gallery: [
      { src: "images/apt-1.svg", alt: "Жилой комплекс", caption: "Фасад жилого комплекса", credit: "SVG asset", creditUrl: "images/apt-1.svg" },
      { src: "images/apt-2.svg", alt: "Городская застройка", caption: "Городская жилая застройка", credit: "SVG asset", creditUrl: "images/apt-2.svg" },
      { src: "images/apt-3.svg", alt: "Строительство", caption: "Этап строительства каркаса", credit: "SVG asset", creditUrl: "images/apt-3.svg" },
    ],
  },
];

const root = path.join(__dirname, "..");
for (const page of pages) {
  fs.writeFileSync(path.join(root, page.file), pageShell(page), "utf8");
  console.log("wrote", page.file);
}
