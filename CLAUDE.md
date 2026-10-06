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

## Storia

Il sito era originariamente HTML/CSS/JS vanilla (`index.html` + `styles.css` + `script.js`). Nel settembre 2026 è stato migrato a React **mantenendo identico il design**: `styles.css` è stato spostato così com'è in `src/index.css` e il markup/le classi CSS sono state preservate 1:1. Regola: **non cambiare il design** senza richiesta esplicita.

## Comandi

```bash
npm install      # dipendenze
npm run dev      # dev server su http://localhost:5173
npm run build    # build di produzione in dist/
npm run preview  # serve la build locale
```

## Struttura

```
index.html                 # entry Vite + form Netlify statico nascosto (vedi sotto)
netlify.toml               # build: npm run build, publish: dist
public/                    # file statici serviti dalla root (/...)
  _EG_CV_ENG.pdf           # CV aperto dal bottone "Open Resume"
  privacyPolicy.txt        # linkato dal banner cookie
  postsPics/               # tutte le immagini (foto profilo 2o.png, favicon title-img.png, certificati, loghi, screenshot progetti)
src/
  main.jsx                 # bootstrap React
  App.jsx                  # compone le sezioni + footer
  index.css                # TUTTO lo stile del sito
  data/items.js            # DATI di certificazioni e progetti + mappa loghi
  components/
    Header.jsx             # nav fissa, classe "scrolled" dopo 50px, menu hamburger mobile
    Hero.jsx               # sezione #home con animazioni fade-in (CSS)
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
- `type`: `"certification"` o `"project"` (determina in quale filtro compare e il testo del bottone: "View Certification" vs "View Source Code </>").
- `title` (usato anche come `key` React → deve essere **univoco**), `description`, `link` (bottone principale).
- `image`, `imageStyle` opzionale (es. `certImg` 270×200, `badgeImg` 200×200).
- `tags`: array di stringhe mostrate come pill.
- `logos`: array di chiavi della mappa `logos` (microsoft, linkedin, pmi, nasba, bocconi, pendo). Per un nuovo ente, aggiungere prima la voce in `logos`.
- `titleLink` opzionale: rende cliccabile il titolo (se inizia con `#` fa smooth scroll interno).
- `parent: true`: la card mostra il bottone freccia che espande/chiude le sotto-certificazioni.
- `sub: true`: card nascosta finché il `parent` non viene espanso (attualmente le 12 certificazioni PMI/LinkedIn legate a "Career Essentials in Project Management").

### Cambiare testi
Hero → `Hero.jsx`, About → `About.jsx`, Contatti → `Contact.jsx`, footer → `App.jsx`, banner cookie (in italiano) → `CookieBanner.jsx`.

### Cambiare il CV
Sostituire `public/_EG_CV_ENG.pdf` mantenendo lo stesso nome.

## Dettagli di comportamento da preservare

- **Filtro card:** cliccando un filtro, le card visibili sfumano (300ms) e solo dopo compaiono quelle nuove (`activeFilter` aggiorna subito i bottoni, `shownFilter` è ritardato di 300ms). Cambiando filtro le sotto-certificazioni si richiudono.
- **Filtro per tag/ente:** le pill dei tag e dei loghi nelle card sono `<button>` cliccabili. Il click filtra la sezione attuale per quel tag o ente (`activeFilter.tag = { kind: "tag" | "logo", value }`), con la stessa dissolvenza, e mostra una pill arancione `✕` sotto i bottoni per rimuoverlo. Con un tag attivo le sotto-certificazioni corrispondenti appaiono direttamente e il bottone freccia del parent è nascosto. Un tag presente su tutte le card della sezione (es. "Certification") equivale a "mostra tutto".
- **Form Netlify in una SPA:** Netlify rileva i form solo nell'HTML statico al deploy, per questo in `index.html` c'è una **copia nascosta** del form `contact` con gli stessi campi. Se si aggiungono/rinominano campi in `Contact.jsx`, aggiornare anche la copia in `index.html`. L'invio è un normale POST nativo (nessun fetch).
- **Cookie:** la scelta è salvata in `localStorage["cookiePreference"]` (`accepted`/`declined`); il banner compare dopo 1s se non c'è scelta.
- **Animazioni hero:** gestite solo via CSS (`.fade-in`, `.delay-1..3`).
- **Responsive:** breakpoint unico a 768px in `index.css` (menu laterale mobile, about su una colonna).

## Convenzioni

- Indentazione con tab nei file JS/JSX; componenti come `export default function`.
- Commenti brevi, in inglese nel codice nuovo; i commenti/testi del banner cookie sono in italiano (ereditati dall'originale).
- Stili inline presenti nel markup originale sono stati mantenuti come oggetti `style={{...}}`.
