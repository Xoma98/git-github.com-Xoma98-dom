# Сомнительный дом

Многостраничный сайт строительной тематики с **3D-экскурсией по дому** на главной (Three.js).  
Пародия на лендинги застройщиков: навигация по категориям через осмотр интерьера.

## Быстрый старт

```bash
# из корня проекта
npx serve -l 5173 .
```

Откройте [http://localhost:5173](http://localhost:5173).

Docker:

```bash
docker build -t somnitelnyy-dom .
docker run --rm -p 8080:80 somnitelnyy-dom
```

Сайт будет на [http://localhost:8080](http://localhost:8080).

## Структура проекта

```
dom/
├── index.html              # Главная: 3D-экскурсия (вход в дом + осмотр)
├── private.html            # Стройка на частной территории
├── summer.html             # Летние домики
├── landscaping.html        # Отделка участка
├── finish.html             # Отделка домов под ключ
├── apartments.html         # Многоквартирные дома
│
├── css/
│   └── site.css            # Общие стили + адаптив + UI хаба
│
├── js/
│   ├── nav3d.js            # Three.js: дом, вход, точки экскурсии, клики
│   └── site.js             # Мобильное меню на страницах категорий
│
├── images/
│   ├── *.svg               # Иллюстрации для галерей категорий
│   ├── *-hero.jpg          # Hero-картинки (если есть)
│   └── textures/           # SVG-текстуры и иконки для 3D
│       ├── brick.svg
│       ├── wood.svg
│       ├── floor.svg
│       ├── plaster.svg
│       ├── roof.svg
│       ├── grass.svg
│       ├── wallpaper.svg
│       ├── tile-ceramic.svg
│       └── icon-*.svg      # Иконки направлений
│
├── scripts/
│   ├── generate-pages.cjs  # Генерация HTML страниц категорий
│   ├── build-pages.cjs     # Шаблон страницы категории
│   ├── make-images.cjs     # SVG-ассеты галерей
│   └── make-textures.cjs   # SVG-текстуры для Three.js
│
├── Dockerfile              # nginx:alpine для Amvera / Docker
├── nginx.conf              # Конфиг статики
├── amvera.yml              # Деплой на Amvera (порт 80)
└── .dockerignore
```

## Страницы

| Файл | Назначение |
|------|------------|
| `index.html` | 3D-хаб: анимация входа в дом, осмотр изнутри, 5 точек → категории |
| `private.html` | Частная территория |
| `summer.html` | Летние домики |
| `landscaping.html` | Отделка участка |
| `finish.html` | Отделка под ключ |
| `apartments.html` | Многоквартирные дома |

На главной точки экскурсии:

1. Частная территория (вид на участок из окна)  
2. Летние домики (вид во двор)  
3. Отделка участка (взгляд к входу)  
4. Отделка под ключ (гостиная)  
5. Многоквартирные (вид в глубину)

Управление: **← / Далее / Открыть / Список**, шаги **1–5**, свайп или мышь — осмотр взглядом.

## Технологии

- Статический HTML/CSS/JS (без сборщика)
- [Three.js](https://threejs.org/) (CDN `unpkg`, ES modules) — `js/nav3d.js`
- Шрифты Google: Unbounded, Commissioner
- Деплой: Docker + nginx, конфиг Amvera

## Скрипты (опционально)

Пересобрать SVG-текстуры:

```bash
node scripts/make-textures.cjs
```

Пересобрать SVG галерей:

```bash
node scripts/make-images.cjs
```

Перегенерировать страницы категорий из шаблона:

```bash
node scripts/generate-pages.cjs
```

Ручное редактирование `*.html` категорий тоже нормально; генератор удобен, если меняете шаблон в `scripts/build-pages.cjs`.

## Деплой на Amvera

1. Репозиторий с `Dockerfile` и `amvera.yml` в корне  
2. Окружение **Docker**  
3. Приложение слушает порт **80** (nginx)

`amvera.yml` уже задаёт `containerPort: "80"`.

## Важно

- Главная зависит от CDN Three.js (`unpkg.com`) — нужен интернет в браузере пользователя  
- Текстуры и иконки локальные (`images/`), без внешних фото-CDN  
- Мобильная вёрстка: компактный UI хаба, выезжающий список категорий, touch-осмотр

## Куда смотреть при правках

| Задача | Файлы |
|--------|--------|
| 3D-сцена, вход в дом, камеры | `js/nav3d.js` |
| Внешний вид UI / мобилка | `css/site.css`, `index.html` |
| Текст / блоки категории | соответствующий `*.html` или `scripts/generate-pages.cjs` |
| Текстуры стен/пола | `images/textures/`, `scripts/make-textures.cjs` |
| Docker / nginx | `Dockerfile`, `nginx.conf`, `amvera.yml` |
