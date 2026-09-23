# Shadownik(SWNK) — Web Development Services

Premium web development services site for the swnk.in brand — a React +
TypeScript + Vite single-page experience with Three.js 3D visuals, full SEO
groundwork, and a consultation-booking API.

[![GitHub stars](https://img.shields.io/github/stars/5h4d0wn1k/webdevservices)](#)
[![Last commit](https://img.shields.io/github/last-commit/5h4d0wn1k/webdevservices)](#)

Live site: [https://web.swnk.in/](https://web.swnk.in/) (canonical in
`index.html`); Vercel deployment at the repo homepage.

## Why this project

Shadownik(SWNK) helps businesses transform their digital presence through
custom websites, e-commerce builds, web applications, and digital marketing. An
agency's own website is its most important proof of work: it must look premium,
feel fast, and convert visitors into consultations. This codebase delivers that
with a rich 3D visual layer, complete marketing sections, and a working
consultation-booking flow backed by serverless API functions on Vercel — all in
clean, typed React. It also encodes SEO best practices (meta tags, canonical
URLs, `robots.txt`, `sitemap.xml`, JSON-LD schema) so the site itself is
findable and rankable.

## Features

- **React 18 + TypeScript + Vite** — fast, typed single-page app
- **3D experience** — `react-three-fiber`, `drei`, and `three` with planet
  textures, floating geometry, and a scroll-driven `ScrollExperience`
- **Marketing sections** — Hero, Services, WebDevServices, Portfolio,
  FeaturedProjects, About, Blog, Testimonials, Newsletter, Contact
- **Consultation booking** — Vercel serverless endpoint
  (`src/pages/api/book-consultation.ts`) wiring email + Google Calendar
- **Client onboarding & project management** — guided service workflows
- **SEO** — meta/OG/Twitter tags, canonical URL, `robots.txt`, `sitemap.xml`,
  JSON-LD schema component
- **Compliance UI** — privacy policy, terms of service, cookie consent
- **Extras** — in-page chatbot, admin page, loading screen, page transitions

## Quickstart

Prerequisites: Node 18+, npm.

```bash
npm install
npm run dev       # Vite dev server
npm run build     # type-check + production build
npm run preview   # preview the production build
npm run lint      # eslint
```

## Project structure

- `src/` — React app: `components/`, `pages/`, `data/`, `config/`, `hooks/`
- `src/pages/api/` — Vercel serverless functions (`book-consultation`,
  `test-email`)
- `public/` — `robots.txt`, `sitemap.xml`
- `vercel.json` + `VERCEL_DEPLOYMENT.md` — deployment config and guide

## Documentation

- [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) — Vercel setup, environment
  variables (email, Google Calendar, etc.), and build settings.

## Contributing

Contributions are welcome via issues and pull requests. Please keep the code
typed and reviewed.

## License

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

