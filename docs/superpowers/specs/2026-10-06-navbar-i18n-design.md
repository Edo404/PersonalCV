# Navbar a pillola + switch lingua IT/EN

Data: 2026-10-06 · Stato: approvato da Edoardo in chat

## Obiettivo
1. Sostituire l'header attuale con una navbar "a pillola" ispirata al riferimento fornito (stile Kint), adattata alla palette del portfolio.
2. Rendere il sito bilingue: italiano di default, inglese tramite switch. Lo switch traduce tutti i testi del sito.

## Decisioni prese con l'utente
- Pillola **scura** (`--gray-900`) con CTA **arancione** (`--secondary`).
- Si traducono **descrizioni e tag** delle card; i **titoli** dei corsi restano i nomi ufficiali.
- La lingua scelta viene **ricordata** nel browser (`localStorage["language"]`). Primo accesso: italiano.

## Approccio i18n
Sistema leggero senza dipendenze:
- `src/i18n/it.js`, `src/i18n/en.js`: dizionari con chiavi annidate (es. `nav.about`, `hero.subtitle`, `tags["Budget Development"]`).
- `src/i18n/LanguageContext.jsx`: `LanguageProvider` + hook `useLanguage()` che restituisce `{ lang, setLang, t }`.
  - `t(key)` risolve la chiave nel dizionario della lingua attiva; se manca, ritorna la chiave stessa (fallback visibile in sviluppo).
  - `setLang` salva in `localStorage` (con try/catch come `CookieBanner`) e aggiorna `document.documentElement.lang`.
- Scartati: react-i18next (circa 20 KB per due lingue), componenti duplicati per lingua.

## Navbar
- `header` fisso in alto, pillola centrata: sfondo `--gray-900`, angoli completamente arrotondati, ombra leggera. Nessun cambio allo scroll: il listener `scroll` attuale viene rimosso.
- Contenuto, da sinistra: foto profilo tonda (link a `#home`) · separatore · link sezioni (Chi sono / Certificazioni & Progetti) · CTA "Contattami" (a `#contact`) · separatore · selettore lingua.
- Selettore lingua: bandiera + codice (IT/EN) + freccia. Apre un menu a tendina scuro con le due lingue. Bandiere come SVG in `public/flags/` (le emoji bandiera non si vedono su Windows).
- Mobile (sotto 768px): foto · bottone ⋮ · CTA · bandiera (senza codice). Le sezioni appaiono solo al click di ⋮ in un pannello scuro sotto la pillola.
- I menu (sezioni mobile e lingua) si chiudono al click su una voce, al click fuori e con Esc. Bottoni con `aria-expanded` e `aria-label`.

## Testi tradotti
- Header, Hero (titolo, sottotitolo, bottoni; i ruoli rotanti restano in inglese), About (testo italiano scritto partendo dall'originale, da rivedere da Edoardo), Projects (titolo, filtri, bottoni card, pill del filtro attivo), Contact (titolo, testo, placeholder, bottone; i `name` dei campi Netlify **non cambiano**), footer, banner cookie (versione inglese aggiunta).
- `items.js`: `description` diventa `{ it, en }`. I tag restano chiavi inglesi (il filtro lavora sulle chiavi) e vengono mostrati tramite `t("tags.<tag>")` con fallback al tag stesso.
- Restano in una sola lingua: `privacyPolicy.txt` (italiano) e il CV `_EG_CV_ENG.pdf` (inglese).

## Fuori scope
- Traduzione della privacy policy e del CV.
- Rilevamento automatico della lingua del browser.

## Verifica
- Switch IT ↔ EN: controllo automatico nel browser che in modalità IT non restino stringhe inglesi dell'interfaccia (e viceversa).
- Menu mobile e tendina lingua: apertura/chiusura con click, click fuori ed Esc.
- Filtro per tag/ente funzionante in entrambe le lingue.
- `npm run build` senza errori; screenshot desktop e mobile.
- CLAUDE.md aggiornato con la nuova struttura i18n e le regole per aggiungere testi.
