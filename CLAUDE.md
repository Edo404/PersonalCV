# PersonalCV — Portfolio di Edoardo Gamurrini

Sito portfolio personale (single page) di Edoardo Gamurrini: presentazione, certificazioni, progetti, form contatti.

- **Repo:** https://github.com/Edo404/PersonalCV (branch principale: `master`)
- **Live:** https://edoardogamurrini.netlify.app/
- **Deploy:** Netlify con deploy continuo — ogni push su `master` avvia build e pubblicazione automatiche.

## Stack

- **React 19 + Vite 7**, JavaScript (niente TypeScript), nessun router, nessuna libreria UI.
- **CSS puro** in un unico file globale: `src/index.css` (variabili colore su `:root`). Nessun CSS-in-JS / Tailwind.
- **Font Awesome 4.7** da CDN (caricato in `index.html`); le icone sono usate come glifi unicode (`<i className="fa">{""}</i>`).
- **Netlify Forms** per il form contatti.
- **Bilingue IT/EN** con un sistema i18n fatto in casa (`src/i18n/`), senza librerie. Italiano di default.

## Storia

Il sito era originariamente HTML/CSS/JS vanilla (`index.html` + `styles.css` + `script.js`). Nel settembre 2026 è stato migrato a React **mantenendo identico il design**: `styles.css` è stato spostato così com'è in `src/index.css` e il markup/le classi CSS sono state preservate 1:1. Regola: **non cambiare il design** senza richiesta esplicita.

## Comandi

```bash
npm install      # dipendenze
npm run dev      # dev server su http://localhost:5173
npm run build    # build di produzione in dist/
npm run preview  # serve la build locale
npm run check:i18n  # verifica che IT/EN abbiano le stesse chiavi, i tag una label italiana e ogni card description { it, en }
```

Dopo ogni modifica ai testi o a `items.js` lanciare `npm run check:i18n` e `npm run build`.

## Struttura

```
index.html                 # entry Vite + form Netlify statico nascosto (vedi sotto)
netlify.toml               # build: npm run build, publish: dist
public/                    # file statici serviti dalla root (/...)
  _EG_CV_ENG.pdf           # CV aperto dal bottone "Apri il CV / Open Resume" (solo inglese)
  privacyPolicy.txt        # linkato dal banner cookie (solo italiano)
  flags/                   # it.svg, en.svg per il selettore lingua
  postsPics/               # tutte le immagini (foto profilo 2o.png, favicon title-img.png, certificati, loghi, screenshot progetti)
scripts/
  check-i18n.mjs           # controllo completezza traduzioni (npm run check:i18n)
docs/superpowers/          # spec e piani delle modifiche più grandi
src/
  main.jsx                 # bootstrap React, avvolge App in LanguageProvider
  App.jsx                  # compone le sezioni + footer
  index.css                # TUTTO lo stile del sito
  data/items.js            # DATI di certificazioni e progetti + mappa loghi
  i18n/
    it.js, en.js           # dizionari (stesse chiavi; en.tags vuoto perché i tag sono già in inglese)
    LanguageContext.jsx    # LanguageProvider + useLanguage() → { lang, setLang, t }, LANGUAGES
    richText.jsx           # renderBold: "**testo**" → <strong> (usato per il testo About)
  components/
    Header.jsx             # navbar "a pillola" scura: foto, sezioni, CTA Contattami, selettore lingua, menu ⋮ su mobile
    Hero.jsx               # sezione #home: ruolo rotante + mazzo di badge
    About.jsx              # sezione #about + bottone CV
    Projects.jsx           # sezione #projects: filtro Certifications/Projects, espansione sotto-certificazioni
    ProjectCard.jsx        # singola card + hook useFade (dissolvenza 300ms)
    Contact.jsx            # sezione #contact: form Netlify + link social
    CookieBanner.jsx       # banner cookie + bottone 🍪 per riaprirlo
  utils/
    scroll.js              # scrollToSection: smooth scroll per i link #ancora
    analytics.js           # enable/disableTrackingCookies (Google Analytics, ID placeholder UA-XXXXX-Y)
```

## Come fare le modifiche più comuni

### Aggiungere una certificazione o un progetto
Aggiungere un oggetto all'array `items` in `src/data/items.js` (l'ordine dell'array = ordine di visualizzazione). Mettere l'immagine in `public/postsPics/` e referenziarla con path assoluto `/postsPics/...`.

Campi:
- `type`: `"certification"` o `"project"` (determina in quale filtro compare e il testo del bottone: "Vedi certificato / View Certification" vs "Vedi codice / View Source Code </>").
- `title` (nome ufficiale, non si traduce; usato anche come `key` React → deve essere **univoco**), `link` (bottone principale).
- `description`: **oggetto** `{ it: "...", en: "..." }`. Schema usato: IT "Certificazione <titolo> di <ente>, conseguita a <mese> <anno>", EN "<titolo> Certification by <ente> taken on <Month> <Year>".
- `image`, `imageStyle` opzionale (es. `certImg` 270×200, `badgeImg` 200×200).
- `tags`: array di chiavi **in inglese** (il filtro lavora sulle chiavi). Per un tag nuovo aggiungere la label italiana in `src/i18n/it.js` → `tags` (in inglese si mostra la chiave stessa).
- `logos`: array di chiavi della mappa `logos` (microsoft, linkedin, pmi, nasba, bocconi, pendo, claude). Per un nuovo ente, aggiungere prima la voce in `logos`.
- `titleLink` opzionale: rende cliccabile il titolo (se inizia con `#` fa smooth scroll interno).
- `parent: true`: la card mostra il bottone freccia che espande/chiude le sotto-certificazioni.
- `sub: true`: card nascosta finché il `parent` non viene espanso (attualmente le 12 certificazioni PMI/LinkedIn legate a "Career Essentials in Project Management").

### Cambiare testi
Tutti i testi dell'interfaccia stanno nei dizionari `src/i18n/it.js` e `src/i18n/en.js` (sezioni `nav`, `hero`, `about`, `projects`, `contact`, `footer`, `cookie`): modificare **sempre entrambi** con le stesse chiavi. Nei componenti si leggono con `const { t } = useLanguage(); t("hero.subtitle")`. Il testo About usa `**grassetto**`, reso da `renderBold`. Mai scrivere testo visibile direttamente nel JSX. Eccezioni volute: i ruoli rotanti della hero (`ROLES` in `Hero.jsx`) restano in inglese in entrambe le lingue, i titoli delle card sono nomi ufficiali.

### Cambiare il CV
Sostituire `public/_EG_CV_ENG.pdf` mantenendo lo stesso nome.

## Dettagli di comportamento da preservare

- **Filtro card:** cliccando un filtro, le card visibili sfumano (300ms) e solo dopo compaiono quelle nuove (`activeFilter` aggiorna subito i bottoni, `shownFilter` è ritardato di 300ms). Cambiando filtro le sotto-certificazioni si richiudono.
- **Filtro per tag/ente:** le pill dei tag e dei loghi nelle card sono `<button>` cliccabili. Il click filtra la sezione attuale per quel tag o ente (`activeFilter.tag = { kind: "tag" | "logo", value }`), con la stessa dissolvenza, e mostra una pill arancione `✕` sotto i bottoni per rimuoverlo. Con un tag attivo le sotto-certificazioni corrispondenti appaiono direttamente e il bottone freccia del parent è nascosto. Un tag presente su tutte le card della sezione (es. "Certification") equivale a "mostra tutto".
- **Form Netlify in una SPA:** Netlify rileva i form solo nell'HTML statico al deploy, per questo in `index.html` c'è una **copia nascosta** del form `contact` con gli stessi campi. Se si aggiungono/rinominano campi in `Contact.jsx`, aggiornare anche la copia in `index.html`. L'invio è un normale POST nativo (nessun fetch).
- **Cookie:** la scelta è salvata in `localStorage["cookiePreference"]` (`accepted`/`declined`); il banner compare dopo 1s se non c'è scelta.
- **Hero (ridisegnata a ottobre 2026):** layout a due colonne (una sotto 768px), configurata in `Hero.jsx`:
  - `ROLES`: il ruolo sotto il titolo cambia ogni `ROLE_INTERVAL_MS` (2,4s, una battuta a 100 BPM) con scorrimento verticale (Software Analyst / AI Software Developer / Product Builder).
  - `DECK_TITLES`: i badge mostrati nel mazzo a destra, presi da `items.js` per titolo (da aggiornare a mano quando arrivano nuove certificazioni). Il mazzo si apre a ventaglio all'hover, si inclina col mouse e porta a `#projects`.
  - Animazioni solo con `transform`/`opacity`, senza librerie. Con `prefers-reduced-motion` il ruolo resta fisso e le transizioni sono disattivate. Entrata del testo via `.fade-in` + `.delay-1..3`.
  - Su richiesta di Edoardo sono stati **rimossi** il "battito" del mazzo e lo step-sequencer di barre in basso: non reintrodurli.
- **Navbar (ottobre 2026, stile ispirato a un riferimento fornito da Edoardo):** pillola fissa centrata in alto, sfondo `--gray-900`, CTA "Contattami" arancione (`--secondary`) con testo scuro. Nessun effetto allo scroll. Ordine: foto (→ `#home`) · Chi sono · Certificazioni & Progetti · Contattami · selettore lingua (bandiera + codice + freccia, tendina scura). Su mobile: foto · ⋮ · Contattami · bandiera; le sezioni compaiono **solo** cliccando ⋮. I menu si chiudono con click su una voce, click fuori o Esc (`openMenu`: `null | "sections" | "language"`).
- **Lingua:** default `it`; la scelta è salvata in `localStorage["language"]` e aggiorna `<html lang>`. Privacy policy solo in italiano, CV solo in inglese (scelte esplicite).
- **Responsive:** breakpoint unico a 768px in `index.css` (navbar con menu ⋮, hero e about su una colonna).

## Convenzioni

- Indentazione con tab nei file JS/JSX; componenti come `export default function`.
- Commenti brevi, in inglese nel codice nuovo; alcuni commenti del banner cookie sono in italiano (ereditati dall'originale).
- Stili inline presenti nel markup originale sono stati mantenuti come oggetti `style={{...}}`.
