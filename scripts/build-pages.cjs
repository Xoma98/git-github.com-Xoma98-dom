function pageShell({ active, title, description, heroImage, heroCredit, intro, features, gallery }) {
  const items = [
    { id: "private", href: "private.html", label: "Частная территория" },
    { id: "summer", href: "summer.html", label: "Летние домики" },
    { id: "landscaping", href: "landscaping.html", label: "Отделка участка" },
    { id: "finish", href: "finish.html", label: "Отделка под ключ" },
    { id: "apartments", href: "apartments.html", label: "Многоквартирные" },
  ];

  const nav = items
    .map(
      (item) =>
        `<a href="${item.href}" class="${item.id === active ? "is-active" : ""}">${item.label}</a>`
    )
    .join("\n          ");

  const featureHtml = features
    .map((f) => `<li><strong>${f.title}.</strong> ${f.text}</li>`)
    .join("\n            ");

  const galleryHtml = gallery
    .map(
      (g) => `<figure class="photo-card">
            <img src="${g.src}" alt="${g.alt}" width="800" height="600" loading="lazy" />
            <figcaption>${g.caption}<br /><span class="photo-credit">Источник: <a href="${g.creditUrl}" rel="noopener noreferrer">${g.credit}</a></span></figcaption>
          </figure>`
    )
    .join("\n          ");

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>${title} — Сомнительный дом</title>
  <meta name="description" content="${description}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Commissioner:wght@400;500;600;700&family=Unbounded:wght@500;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="css/site.css" />
</head>
<body>
  <header class="site-header">
    <div class="site-header__inner">
      <a class="logo" href="index.html" aria-label="На главную — 3D-навигация">
        <span class="logo__mark" aria-hidden="true"></span>
        <span class="logo__text">Сомнительный<span>дом*</span></span>
      </a>
      <button class="menu-toggle" type="button" id="menu-toggle" aria-label="Открыть меню" aria-expanded="false" aria-controls="site-nav">
        <span></span><span></span>
      </button>
      <nav class="site-nav" id="site-nav" aria-label="Категории">
        <a class="is-home" href="index.html">3D-меню</a>
          ${nav}
      </nav>
    </div>
  </header>

  <main>
    <section class="page-hero">
      <div class="page-hero__media" style="background-image:url('${heroImage}')" role="img" aria-label="${title}"></div>
      <div class="page-hero__veil"></div>
      <div class="page-hero__content">
        <p class="eyebrow">Категория</p>
        <h1>${title}</h1>
        <p>${intro}</p>
        <p class="photo-credit">${heroCredit}</p>
      </div>
    </section>

    <section class="section">
      <div class="wrap grid-2">
        <div>
          <h2>Что входит в направление</h2>
          <p>${description}</p>
          <ul class="feature-list">
            ${featureHtml}
          </ul>
        </div>
        <div class="photo-card">
          <img src="${gallery[0].src}" alt="${gallery[0].alt}" width="900" height="675" loading="eager" />
          <figcaption>${gallery[0].caption}<br /><span class="photo-credit">Источник: <a href="${gallery[0].creditUrl}" rel="noopener noreferrer">${gallery[0].credit}</a></span></figcaption>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="wrap">
        <h2>Примеры работ</h2>
        <p>Визуалы — собственные SVG-ассеты проекта (без лицензионных ограничений). При желании можно заменить на фото с <a href="https://unsplash.com/license" rel="noopener noreferrer" target="_blank">Unsplash License</a>.</p>
        <div class="grid-3" style="margin-top:1.5rem">
          ${galleryHtml}
        </div>
      </div>
    </section>

    <div class="wrap">
      <div class="cta-band">
        <p>Вернитесь в 3D-навигацию или перейдите к другой категории.</p>
        <div style="display:flex;flex-wrap:wrap;gap:0.65rem">
          <a class="btn" href="index.html">Открыть 3D-меню</a>
          <a class="btn btn--ghost" href="index.html#list">Все категории</a>
        </div>
      </div>
    </div>
  </main>

  <footer class="site-footer">
    <div class="wrap site-footer__grid">
      <div>
        <p class="logo logo--footer" style="margin-bottom:0.75rem">
          <span class="logo__mark" aria-hidden="true"></span>
          <span class="logo__text">Сомнительный<span>дом*</span></span>
        </p>
        <p>Многостраничный каталог направлений. Изображения — свободные SVG-ассеты проекта.</p>
      </div>
      <div>
        <p>Пародия на рекламный стиль застройщиков. Не является офертой.</p>
      </div>
    </div>
  </footer>

  <script src="js/site.js"></script>
</body>
</html>`;
}

module.exports = { pageShell };
