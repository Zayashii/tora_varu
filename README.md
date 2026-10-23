# Тора Вару — toravaru.mn

Компанийн нүүр сайт. Next.js 13 (App Router).

## Бүтэц

- `src/app/page.js` — нүүр хуудас
- `src/sections/landing/` — нүүр хуудасны бүх хэсэг
  - `content.js` — **бүх текст, тоо, бүтээгдэхүүн, төслүүд энд**. Агуулга солихдоо зөвхөн энэ файлыг засна.
  - `landing-view.js` — хэсгүүдийн бүтэц
  - `process-map.js` — нүүрний процессын зураглал
  - `meeting-form.js` — "Уулзалт товлох" маягт
  - `landing.module.css` — загвар (өнгө, фонт `.page` дотор хувьсагчаар)
- `src/app/api/meeting/route.js` — маягтын хүсэлтийг `MEETING_WEBHOOK_URL` руу дамжуулна
- `src/middleware.js` — нүүрнээс бусад бүх замыг `/` руу чиглүүлдэг (дотоод самбар нийтэд хаалттай)

## Локалд ажиллуулах

```bash
yarn install
cp .env.example .env.local
yarn dev        # http://localhost:3041
```

## Vercel-д байршуулах

1. Кодоо GitHub/GitLab репод push хийнэ.
2. vercel.com → **Add New → Project** → репогоо сонгоно. Framework: Next.js (автоматаар танина),
   Install: `yarn install`, Build: `next build` — өөрчлөх шаардлагагүй.
3. **Settings → Environment Variables** хэсэгт `.env.example`-д байгаа хувьсагчдыг оруулна.
4. Deploy хийсний дараа **Settings → Domains** хэсэгт `toravaru.mn` болон `www.toravaru.mn`-г нэмж,
   домэйн бүртгэгч дээрээ Vercel-ийн заасан DNS бичлэгийг (A `76.76.21.21` эсвэл CNAME) тохируулна.

## Уулзалтын маягт

`MEETING_WEBHOOK_URL`-д JSON хүлээж авдаг дурын хаяг өгч болно: өөрсдийн backend, Make/Zapier,
Google Apps Script (Google Sheet-д бичих), Slack/Discord webhook. Тохируулаагүй үед маягт
хэрэглэгчид бөглөсөн мэдээллийг и-мэйлээр илгээх товч харуулна.
