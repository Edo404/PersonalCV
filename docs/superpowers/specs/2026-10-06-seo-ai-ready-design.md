# SEO e AI-agent readiness

Data: 2026-10-06 · Stato: approvato da Edoardo in chat

## Obiettivo
Far sì che il sito sia il primo risultato su Google cercando "Edoardo Gamurrini" e che gli agenti AI (ChatGPT, Claude, Perplexity…) possano leggerne i contenuti. Il primo posto non è garantibile; il codice rimuove gli ostacoli tecnici, il resto dipende da Search Console e dai link dai profili (azioni dell'utente).

## Problema attuale
SPA React: l'HTML servito contiene solo `<div id="root">`. Il nome completo non è nel `<title>` né nell'h1; mancano meta description, dati strutturati, sitemap, robots.txt, llms.txt e anteprima social.

## Decisioni prese con l'utente
- Due URL: `/` (italiano) e `/en/` (inglese), entrambe statiche e servite dal piano gratuito Netlify.
- Dominio: resta `https://edoardogamurrini.netlify.app` (una sola costante da cambiare in futuro).
- Luogo: Italia (solo il Paese, nessuna città).
- Testi riscritti per includere nome completo e ruoli; l'utente li rivede prima del push.

## Approccio: prerender con react-dom/server
- `src/entry-server.jsx` esporta `render(lang)` con `renderToString`.
- Build: `vite build` (client) → `vite build --ssr src/entry-server.jsx --outDir dist-ssr` → `node scripts/prerender.mjs`.
- `prerender.mjs` usa `dist/index.html` come template e scrive `dist/index.html` (it) e `dist/en/index.html` (en) con head e HTML completi; genera `sitemap.xml`, `robots.txt`, `llms.txt`; rimuove `dist-ssr`.
- Il client usa `hydrateRoot` quando trova HTML prerenderizzato, `createRoot` in sviluppo.
- Scartati: prerender con browser headless (Chromium in build), migrazione a Astro/Next.

## Lingua
- La lingua è determinata dal percorso (`/en/` → en, altrimenti it). `LanguageProvider` riceve `lang` come prop.
- Lo switch della navbar diventa un link `<a href hreflang>` all'altra URL. Rimossa la persistenza in `localStorage["language"]` (decisione esplicita).

## Head per lingua
Title, meta description, canonical, `hreflang` it/en/x-default, author, robots, theme-color, Open Graph (profile, immagine 1200×630 `/og-image.png`), Twitter card, JSON-LD `ProfilePage` + `Person` (nome, ruolo, Paese IT, foto, LinkedIn, GitHub, competenze dai tag, certificazioni come `EducationalOccupationalCredential` da `items.js`). Testi meta nei dizionari (`meta.*`) così `check:i18n` ne verifica la parità.

## File per crawler e agenti
- `robots.txt`: consente tutto, esplicitamente anche GPTBot, OAI-SearchBot, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot-Extended; riga Sitemap.
- `sitemap.xml`: due URL con alternate hreflang e lastmod della build.
- `llms.txt`: riassunto Markdown in inglese (chi è, pagine, profili, certificazioni, progetti) generato dagli stessi dati.

## Testi e semantica
- h1 "Ciao, sono Edoardo Gamurrini!" / "Hello, I'm Edoardo Gamurrini!".
- Sottotitolo hero con "Software Analyst", Italia e AI; About che apre con nome completo e ruolo, senza fatti nuovi.
- Alt della foto tradotto; foto rinominata `edoardo-gamurrini.png`; `<main>` attorno alle sezioni; footer © 2026.

## Verifica
`npm run build`; HTML in `dist/` e `dist/en/` contiene i testi completi nella lingua giusta; JSON-LD parsabile; hydration senza errori in `vite preview`; switch `/` ↔ `/en/`; `check:i18n` OK.

## Azioni dell'utente dopo il push
Google Search Console (verifica proprietà + invio sitemap), link al sito da LinkedIn e GitHub.
