# SEO + AI-Agent Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve fully rendered, crawlable HTML in Italian (`/`) and English (`/en/`) with complete SEO metadata, structured data and agent-facing files, so the site can rank first for "Edoardo Gamurrini" and be read by AI agents.

**Architecture:** Build-time prerender with `react-dom/server`: a client build, an SSR build of `src/entry-server.jsx`, then `scripts/prerender.mjs` writes one HTML file per language plus `sitemap.xml`, `robots.txt`, `llms.txt`. The client hydrates the prerendered markup. Language comes from the URL path; SEO data is assembled in `src/seo.js` from the dictionaries and `items.js`.

**Tech Stack:** React 19 (`react-dom/server`, `hydrateRoot`), Vite 7 SSR build, Node ESM scripts, Netlify static hosting (free tier).

**Spec:** `docs/superpowers/specs/2026-10-06-seo-ai-ready-design.md`

## Global Constraints

- Site URL: `https://edoardogamurrini.netlify.app` (single constant `SITE_URL` in `src/seo.js`).
- Language paths: `it` → `/`, `en` → `/en/`; `/en` without slash is also English.
- No new npm dependencies.
- Country only: Italy (`addressCountry: "IT"`); no city, no email exposed in metadata.
- Never invent facts: new copy may only restate Software Analyst, AI Software Developer, Product Builder, Computer Science graduate, IT Consultant, Italy, and the existing certifications/projects.
- Netlify form markup and field names stay unchanged (the hidden form in `index.html` must survive in both generated pages).
- Every visible string lives in both dictionaries; `npm run check:i18n` must pass.
- No em-dash characters in visible copy.

## Review Focus

- Language switch from a section (e.g. `/#projects`) should land on the same section in the other language: switch links append `location.hash` on click (Task 3, browser check).
- `/en` without trailing slash must render English: `langFromPath("/en")` returns `"en"` (Task 1, node assertion).
- Apostrophes and `&` in titles/descriptions ("sull'AI", "Certifications & Projects") must be escaped in attributes and must not break JSON-LD: prerender check parses every JSON-LD block and greps escaped attributes (Task 4).
- Prerendered markup must hydrate without mismatch warnings: `vite preview` console clean after load (Task 4).
- `npm run dev` must still work on `/` and `/en/` with no prerendered HTML: client falls back to `createRoot` (Task 2, browser check).

## File Structure

| File | Responsibility |
|---|---|
| `src/i18n/paths.js` (new) | `LANG_PATHS`, `langFromPath(pathname)` |
| `src/i18n/LanguageContext.jsx` | Provider takes `lang` prop; no storage |
| `src/entry-server.jsx` (new) | `render(lang)` for prerender |
| `src/main.jsx` | Hydrate or create root, lang from path |
| `src/seo.js` (new) | `SITE_URL`, `PERSON`, `headTags(lang, t)`, `jsonLd(lang, t)`, `robotsTxt()`, `sitemapXml(date)`, `llmsTxt(t)` |
| `scripts/prerender.mjs` (new) | Writes `dist/index.html`, `dist/en/index.html`, crawler files |
| `index.html` | Template markers `<!--app-head-->`, `<!--app-html-->` |
| `package.json` | Build pipeline |
| `src/i18n/it.js`, `en.js` | `meta.*`, rewritten hero/about copy, `about.photoAlt`, footer 2026 |
| `src/components/Header.jsx`, `Hero.jsx`, `About.jsx`, `App.jsx`, `index.css` | Language links, full name in h1, `<main>`, link styles |
| `public/postsPics/edoardo-gamurrini.png` (renamed), `public/og-image.png` (new) | Images |
| `.gitignore`, `CLAUDE.md` | `dist-ssr`, documentation |

---

### Task 1: URL-based language

**Files:** Create `src/i18n/paths.js`; modify `src/i18n/LanguageContext.jsx`.

**Interfaces:** Produces `LANG_PATHS = { it: "/", en: "/en/" }`, `langFromPath(pathname: string): "it" | "en"`, `LanguageProvider({ lang, children })`, `useLanguage(): { lang, t }`.

- [ ] **Step 1: Test** — `node -e "import('./src/i18n/paths.js').then(m=>{const a=require('assert');a.equal(m.langFromPath('/'),'it');a.equal(m.langFromPath('/en/'),'en');a.equal(m.langFromPath('/en'),'en');a.equal(m.langFromPath('/enterprise'),'it');console.log('ok')})"` → FAIL (module missing).
- [ ] **Step 2: Implement `src/i18n/paths.js`:**

```js
// Each language lives at its own URL so crawlers can index both
export const LANG_PATHS = { it: "/", en: "/en/" };

export function langFromPath(pathname) {
	return /^\/en(\/|$)/.test(pathname) ? "en" : "it";
}
```

- [ ] **Step 3: Rewrite `LanguageContext.jsx`:** provider receives `lang`, keeps `t` and `LANGUAGES`, drops `localStorage`, `setLang` and the `document.documentElement.lang` effect (the HTML template sets `lang`).
- [ ] **Step 4:** Re-run Step 1 → `ok`. Commit "Derive language from the URL path".

### Task 2: Client entry and SSR entry

**Files:** Create `src/entry-server.jsx`; modify `src/main.jsx`, `src/App.jsx` (`<main>` wrapper).

- [ ] **Step 1: `src/entry-server.jsx`:**

```jsx
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { LanguageProvider } from "./i18n/LanguageContext";

// Used by scripts/prerender.mjs to produce the static HTML of each language
export function render(lang) {
	return renderToString(
		<StrictMode>
			<LanguageProvider lang={lang}>
				<App />
			</LanguageProvider>
		</StrictMode>
	);
}
```

- [ ] **Step 2: `src/main.jsx`:** compute `lang = langFromPath(location.pathname)`; `hydrateRoot` when `root.firstElementChild` exists (prerendered build), else `createRoot` (dev).
- [ ] **Step 3: `App.jsx`:** wrap `Hero`, `About`, `Projects`, `Contact` in `<main>`.
- [ ] **Step 4: Verify** `npm run dev`: `/` renders Italian, `/en/` English, no console errors. Commit "Add SSR entry and hydrate prerendered markup".

### Task 3: Copy, language links, images

**Files:** `src/i18n/it.js`, `src/i18n/en.js`, `Header.jsx`, `Hero.jsx`, `About.jsx`, `index.css`, rename `public/postsPics/2o.png` → `edoardo-gamurrini.png`.

- [ ] **Step 1: Dictionaries.** Add to both:
  - `meta.title`: IT "Edoardo Gamurrini | Software Analyst e AI Software Developer", EN "Edoardo Gamurrini | Software Analyst & AI Software Developer".
  - `meta.description`: IT "Edoardo Gamurrini, Software Analyst e AI Software Developer in Italia. Portfolio con certificazioni (Claude, Microsoft PL-400, Project Management) e progetti." EN "Edoardo Gamurrini, Italy-based Software Analyst and AI Software Developer. Portfolio with certifications (Claude, Microsoft PL-400, Project Management) and projects."
  - `meta.jobTitle`: "Software Analyst" (both).
  - `hero.subtitle`: IT "Software Analyst in Italia: trasformo esigenze di business in software basato sull'AI, dall'analisi al prodotto rilasciato." EN "Italy-based Software Analyst turning business needs into AI-powered software, from analysis to shipped product."
  - `about.photoAlt`: IT "Foto di Edoardo Gamurrini", EN "Photo of Edoardo Gamurrini".
  - `about.body`: first sentence becomes IT "**Ciao, sono Edoardo Gamurrini!** Sono un **Software Analyst** con base in Italia e un **laureato in Informatica**: ho iniziato come **IT Consultant** e oggi unisco l'analisi allo sviluppo di **software basato sull'AI**, con una forte passione per il **Project e Product Management**." EN "**Hello, I'm Edoardo Gamurrini!** I'm an Italy-based **Software Analyst** and **Computer Science graduate**: I started out as an **IT Consultant** and today I combine analysis with building **AI-powered software**, with a strong passion for **Project and Product Management**." Rest of the text unchanged.
  - `footer`: "© 2026 Edoardo Gamurrini. ..." in both.
- [ ] **Step 2: Hero h1** shows `{t("hero.greeting")} <span>Edoardo Gamurrini!</span>`.
- [ ] **Step 3: Language menu** items become `<a href={LANG_PATHS[code]} hrefLang={code} lang={code}>`; on click append `window.location.hash`. CSS: `.nav-dropdown a` gets the same rules as `.nav-dropdown button`.
- [ ] **Step 4: Photo rename** with `git mv`, update `Header.jsx` and `About.jsx` (`alt={t("about.photoAlt")}`).
- [ ] **Step 5: Verify** `npm run check:i18n` OK; in dev, switching from `/#projects` lands on `/en/#projects`. Commit "Rewrite copy for SEO and switch languages by URL".

### Task 4: SEO data, prerender and crawler files

**Files:** Create `src/seo.js`, `scripts/prerender.mjs`, `public/og-image.png`; modify `index.html`, `package.json`, `.gitignore`.

- [ ] **Step 1: Test first** — add to `package.json` `"check:seo": "node scripts/check-seo.mjs"` with `scripts/check-seo.mjs` asserting on `dist/`:
  - `dist/index.html` has `<html lang="it">`, title containing "Edoardo Gamurrini", text "Chi sono", canonical `https://edoardogamurrini.netlify.app/`, hreflang en;
  - `dist/en/index.html` has `<html lang="en">`, "About Me", canonical `.../en/`;
  - every `application/ld+json` block parses and has `mainEntity.name === "Edoardo Gamurrini"`;
  - `dist/robots.txt` mentions `GPTBot` and `Sitemap:`; `dist/sitemap.xml` lists both URLs; `dist/llms.txt` starts with `# Edoardo Gamurrini`;
  - both pages still contain `<form name="contact"`.
  Run after current build → FAIL.
- [ ] **Step 2: `src/seo.js`** builds head tags (escaped attributes, `<` escaped in JSON-LD), ProfilePage + Person JSON-LD with `hasCredential` from certification items (issuer names from a `ISSUERS` map: microsoft Microsoft, linkedin LinkedIn, pmi Project Management Institute, nasba NASBA, bocconi Università Bocconi, pendo Pendo.io, claude Anthropic) and `knowsAbout` from tags, `robotsTxt()`, `sitemapXml(date)`, `llmsTxt(t)` (English).
- [ ] **Step 3: `index.html` template:** `<!--app-head-->` in head, `<div id="root"><!--app-html--></div>`, default `<title>` kept for dev only.
- [ ] **Step 4: `scripts/prerender.mjs`:** load template, import `render` from `dist-ssr/entry-server.js`, write both pages (replace lang, title, markers), write crawler files, remove `dist-ssr`.
- [ ] **Step 5: Pipeline:** `"build": "vite build && vite build --ssr src/entry-server.jsx --outDir dist-ssr && node scripts/prerender.mjs"`; add `dist-ssr` to `.gitignore`.
- [ ] **Step 6: OG image** 1200×630 rendered from an HTML card (photo, name, role, site fonts) with headless Edge, saved as `public/og-image.png`.
- [ ] **Step 7: Verify** `npm run build && npm run check:seo` → PASS; `vite preview` on `/` and `/en/`: content visible, console clean, switch works. Commit "Prerender both languages with SEO metadata and crawler files".

### Task 5: Documentation

- [ ] Update `CLAUDE.md`: build pipeline, `seo.js` and how to change `SITE_URL`, URL-based languages (no storage), generated files, `check:seo`, user checklist (Search Console, profile links). Commit "Document SEO and prerender setup".
