# Audit completo — `backsoftware-remake / terminal-edition`

Analisi organizzata per severità. Ogni punto indica file, linee e motivazione. In fondo una roadmap prioritizzata.

---

## 🔴 Bug reali (da correggere subito)

### 1. Chiave duplicata in `gameState` di Snake
**File:** `components/games/SnakeGame.jsx:35-36` e di nuovo a riga `54-55`

La proprietà `lastMoveTime: 0` è dichiarata **due volte** nello stesso oggetto literal. È un warning silenzioso di JS (ESLint lo cattura con `no-dupe-keys`) — funziona ma è sciatto.

**Azione:** Rimuovere la seconda occorrenza in entrambi i blocchi.

---

### 2. Chiavi duplicate `source: 'servizi'` negli oggetti `services`
**File:** `components/ModernSite.jsx:596-663`

5 servizi (Siti e Landing, Marketing, Foto&Video, Grafica&Copy, Software su Misura) hanno `source: 'servizi'` due volte all'interno dello stesso oggetto.

**Azione:** Rimuovere i duplicati.

---

### 3. Import di pacchetto non installato
**File:** `components/ui/hover-footer.jsx:4`

```jsx
import { motion } from "motion/react";
```

Il `package.json` contiene **`framer-motion`**, non `motion`. Al momento il file non è importato in produzione (solo da `hover-footer-demo.jsx`) quindi non esplode il build, ma se venisse usato fallirebbe.

**Azione:** Cambiare in `from 'framer-motion'` o rimuovere il file.

---

### 4. `SplinePhone.jsx` — race condition sul dynamic import
**File:** `components/SplinePhone.jsx:7-15`

`SplineComponent` è una `let` module‑scoped assegnata asincronamente tramite `.then()`. Il componente **non ha modo di re‑renderare** quando il modulo finisce di caricare → resta sempre sul fallback. In più il file **non è importato da nessuna parte** (dead code) e trascina due dipendenze pesanti (`@splinetool/react-spline`, `@splinetool/runtime`).

**Azione:** Eliminare il file + rimuovere le dipendenze `@splinetool/*` da package.json.

---

### 5. `sitemap.xml` linka una pagina che non esiste
**File:** `public/sitemap.xml:10`

`/cookies` è in sitemap ma in `/app/` non c'è nessuna route `cookies/page.jsx` → genererà **404 in Search Console** quando Google prova il crawling.

**Azione:** Rimuovere dalla sitemap o creare la pagina.

---

## 🟠 SEO — gap critici

### 6. Asset SEO mancanti in `/public/`
**File:** `app/layout.jsx:38` (riferimenti)

Riferiti nel metadata ma **non presenti**:
- `og-image.jpg` (1200×630) → social preview rotti (WhatsApp / LinkedIn / Twitter mostrano placeholder)
- Nessun `favicon.ico` / `icon.png` / `apple-icon.png` → tab browser anonima
- Nessun `manifest.webmanifest` → niente hint PWA per installazione

**Azione:** Con App Router basta mettere file con nomi convenzionali in `/app/` (`icon.png`, `apple-icon.png`, `opengraph-image.jpg`) e Next 16 li collega automaticamente.

---

### 7. `robots.txt` blocca `_next/` — **regressione SEO**
**File:** `public/robots.txt:8`

```
Disallow: /_next/
```

Googlebot renderizza la pagina come un browser e ha bisogno di `_next/static/chunks/*.js` + `_next/static/css/*.css`. Bloccandoli Google vede **una pagina vuota senza stili** — impatto diretto su ranking, Core Web Vitals e Mobile-Friendly Test.

**Azione:** Rimuovere quella riga.

---

### 8. `sitemap.xml` e `robots.txt` statici
**File:** `public/sitemap.xml`, `public/robots.txt`

Meglio `app/sitemap.js` e `app/robots.js` (Next 13+).

**Benefici:**
- `lastmod` aggiornato automaticamente a ogni build
- Single source of truth per gli URL (niente divergenze)
- Tipizzazione e validazione a compile time

---

### 9. JSON-LD incompleto
**File:** `app/layout.jsx:76-198`

Mancano campi rilevanti già presenti sul sito:
- `vatID: 'IT13227980011'` e `taxID: 'RVRJLN05E26B455T'` (P.IVA/CF mostrati in footer)
- `contactPoint` con `contactType: 'customer service'` per `+393513052627` e PEC `julian.rovera@pec.it`
- `founder` / `foundingDate` se noti
- Nessuno schema `Service` individuale (Google ama i rich snippet servizio‑per‑servizio)
- Nessuno schema `FAQPage` / `Review` / `BreadcrumbList` reale

---

### 10. `BreadcrumbList` fittizia
**File:** `app/layout.jsx:170-197`

Le voci puntano a `#servizi`, `#progetti`, `#contatti`. Google **non** indicizza fragment URLs come entità separate → il breadcrumb **non apparirà** nelle SERP.

**Azione:** Creare pagine reali (`/servizi`, `/progetti`, `/contatti`) o rimuovere questo schema.

---

### 11. `SEO-SETUP.md` menziona codice non presente
**File:** `SEO-SETUP.md:50-53`

Istruisce di sostituire `google: 'GOOGLE_SEARCH_CONSOLE_CODE_HERE'` a riga 56 di `layout.jsx`, ma in `layout.jsx` **quella proprietà non esiste**: manca proprio `verification: { google: ... }` nel `metadata`.

**Azione:** Aggiornare la documentazione o il codice.

---

### 12. Keywords obsolete nel metadata
**File:** `app/layout.jsx:16-21`

La meta `keywords` è **ignorata da Google dal 2009**. Non fa danno ma è rumore.

**Azione:** Valutare se rimuoverla (Bing la usa ancora marginalmente).

---

### 13. Fragment anchors come strategia SEO
Tutto il sito vive su `/` con sezioni anchor. Significa **una sola pagina indicizzabile**. Per dominare query come "siti web Ivrea", "agenzia web Torino" servono landing dedicate per cluster keyword (`/siti-web`, `/marketing`, `/case-famiglia`, `/ivrea`).

---

### 14. Nessun `app/not-found.jsx`, `app/error.jsx`, `app/loading.jsx`
Le tre route convention migliorano sia UX (404 brandizzato, `noindex` automatico) sia percepito di stabilità.

---

## 🟡 Accessibilità (WCAG)

### 15. Viewport blocca lo zoom — **violazione WCAG 1.4.4**
**File:** `app/layout.jsx:3-8`

```jsx
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
```

`maximumScale: 1` + `userScalable: false` impedisce pinch‑to‑zoom agli ipovedenti. Oltre ai problemi legali (AgID, EAA 2025), iOS moderno già li ignora in molti casi.

**Azione:** Rimuovere `maximumScale` e `userScalable`.

---

### 16. Scroll hijacking su `wheel`
**File:** `components/ModernSite.jsx:455-483`

La sezione contatti intercetta `wheel` con `preventDefault` per mostrare il footer. Rompe trackpad a inerzia, Magic Mouse, tasti `PageDown`, screen reader.

**Azione:** Preferire un bottone esplicito "Mostra footer" o animare sul `scrollIntoView` naturale.

---

### 17. Emoji come icone pure, senza label
**File:** `components/ModernSite.jsx:1402` e `1499`

Gli screen reader leggono "faccina joystick".

**Azione:** Aggiungere `aria-label="Apri arcade retro"`.

---

### 18. Card cliccabili con `<motion.div onClick>`
**File:** `components/ModernSite.jsx:1662-1677` (servizi) e `ProjectCard`

Sono `div`, non sono focalizzabili via Tab e non rispondono a Enter/Space.

**Azione:** Aggiungere `role="button"`, `tabIndex={0}`, `onKeyDown` per Enter/Space — o meglio ancora `<button>` veri.

---

### 19. `prefers-reduced-motion` quasi ignorato
**File:** `app/globals.css:341-345`

La media query disabilita solo `scroll-behavior`. Le decine di animazioni infinite (CRT flicker, scan beam, orbit text, float, glow pulse, shiny button) restano attive.

**Azione:** Aggiungere un blocco globale:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

### 20. Contrasto colori borderline
**File:** `components/ModernSite.jsx:1643-1645`

Testi come `text-[#9a9484]` su `#1a1810` (sezione "Perché Back Software") e `text-[#8a7f6a]` sui pill inattivi sono **~3.8:1**, sotto la soglia AA di 4.5:1 per testo normale.

**Azione:** Scurire leggermente il background o schiarire il testo.

---

### 21. Gerarchia heading irregolare
`<h1>` unico (corretto), ma `<h2>` e `<h4>` sono usati saltando `<h3>`. Esempio: le card "Perché Back Software" usano `<h4>` dopo `<h2>`.

**Azione:** Rispettare la gerarchia `<h1>` → `<h2>` → `<h3>` → `<h4>`.

---

## 🟢 Performance

### 22. `ModernSite.jsx` monolitico: ~98 KB / 2006 righe
**File:** `components/ModernSite.jsx`

Un singolo componente `'use client'` contiene Header, Hero, Why Us, Servizi, Progetti, Contact form, Footer, modale servizio/progetto.

**Conseguenze:**
- Tutto il JS interattivo scaricato al primo byte
- Hot reload lento in dev
- Diff git enormi a ogni modifica

**Split consigliato:**
```
components/modern/
  Header.jsx          (orbit SVG logic isolata)
  Hero.jsx
  SectionWhyUs.jsx
  SectionServices.jsx
  SectionProjects.jsx (+ ProjectCard già pronta)
  SectionContact.jsx
  ContactForm.jsx     (i 4 step)
  Footer.jsx
  ServiceDetailView.jsx
```

Il `ModernSite.jsx` finale orchestrerebbe gli state condivisi (~150 righe).

---

### 23. Google Fonts caricato DUE volte
**File:** `app/globals.css:1` e `app/layout.jsx:72`

- `globals.css` fa `@import url('https://fonts.googleapis.com/css2?...')`
- `layout.jsx` fa `<link href="https://fonts.googleapis.com/css2?...">`

Due fetch della stessa risorsa, render‑blocking.

**Azione:** Usare `next/font/google` nel layout:

```jsx
import { Inter, VT323, Share_Tech_Mono } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
```

Self‑host automatico, subsetting per glifi usati, zero CLS da FOIT.

---

### 24. `lucide-react: ^1.8.0` è sospetto
**File:** `package.json`

L'attuale `lucide-react` è in `0.x` (versioning ufficiale dal 2021). Una `^1.8.0` richiama una release storica del 2020. Probabilmente installato male. Non crea errori solo perché `lucide-react` è usato **solo** in `hover-footer-demo.jsx` (orfano).

**Azione:** Rimuovere la dipendenza o aggiornare a `^0.460.0`.

---

### 25. `<img>` senza dimensioni
**File:** `components/PhoneGallery.jsx:100-105`

Manca `width`/`height` → **Cumulative Layout Shift** alto quando le immagini si caricano.

**Azione:** Anche con `output: 'export'` si può usare `next/image` con `unoptimized`, o aggiungere attributi dimensionali.

---

### 26. Animazione orbit text — doppio RAF loop
**File:** `components/ModernSite.jsx:399-448`

Due `requestAnimationFrame` separati per mobile e desktop. Solo uno è attivo per volta (gated da `isDesktopView`), ma la logica è duplicata.

**Azione:** Unificarli in un solo effect parametrico riduce ~50 righe e il rischio di desync.

---

### 27. `ResizeObserver` non riosservato
**File:** `components/ModernSite.jsx:356-364`

Se l'elemento ref viene rimontato condizionalmente, `ro.observe(headerRefMobile.current)` non si ripete. Minor.

---

### 28. `dvh` ovunque senza fallback
`100dvh` è ottimo su iOS 16+, ma su browser vecchi (Samsung Internet <17) cade su `100vh` con salti di layout.

**Azione:** Aggiungere fallback:
```css
height: 100vh;
height: 100dvh;
```

---

### 29. `<style jsx>` dentro `ShinyButton`
**File:** `components/ui/shiny-button.jsx:43-252`

~200 righe di CSS iniettate **per ogni istanza** renderizzata.

**Azione:** Spostare in `globals.css` con classi `.shiny-cta-*` — CSS caricato una volta, bundle più piccolo.

---

## 🔵 Dead code / pulizia dipendenze

| File | Stato | Azione |
|------|-------|--------|
| `components/SplinePhone.jsx` | non importato | eliminare + rimuovere `@splinetool/react-spline` e `@splinetool/runtime` (pesantissimi) |
| `components/ui/spotlight-card.jsx` | `GlowCard` non importato | eliminare |
| `components/ui/hover-footer.jsx` | usato solo in demo | eliminare o integrare |
| `components/ui/hover-footer-demo.jsx` | demo orfana | eliminare (porta seco `lucide-react`) |
| `components/ui/demo.jsx` | demo `ShinyButton` | eliminare |

Rimuovendo questi il `node_modules` scende di decine di MB (Spline da solo è enorme).

### Configurazioni inutilizzate

**File:** `tailwind.config.js:18-41`

Palette `primary`/`secondary` mai usata (tutto il sito usa hex inline tipo `#7c6f5b`, `#2d2818`). Da eliminare o iniziare a usarla (meglio: definire token semantici `clay-50..900`, `espresso-500`, `ink-900`).

**File:** `tailwind.config.js:47-66` e `app/globals.css:450-462`

Keyframes `float`, `pulse-slow`, `gradient-shift` **duplicati** con parametri diversi. Mantenere una sola fonte.

**File:** `app/globals.css:284-286`

Classe `.modern-snap-section.snap-scroll-inner` — mai applicata nel JSX.

---

## 🟣 Architettura / logica

### 30. Tutto `'use client'`, niente Server Components
**File:** `app/page.jsx:1` e `components/ModernSite.jsx:1`

Con Next 16 / React 19 i Server Components permettono di eseguire il grosso del rendering a build‑time, inviando JS solo per le parti davvero interattive.

**Split consigliato:**
- `page.jsx` → Server Component, importa sezioni statiche (Hero, Why Us, Servizi list, Progetti list) come server
- `HeaderOrbit`, `ContactForm`, `ProjectModal`, `TerminalExperience` restano client

**Risultato stimato:** TTI più basso, JS bundle iniziale −40/60%.

---

### 31. Dati hardcoded nel componente
**File:** `components/ModernSite.jsx:582-779`

Progetti, servizi, link footer stanno dentro il JSX (array `services` e `projects`).

**Azione:** Estrarre in `data/services.js`, `data/projects.js`.

**Benefici:**
- Import come Server Component senza `'use client'`
- CMS‑ready (domani basta sostituire con fetch da Sanity/Strapi/Payload)
- Test unitari più semplici

---

### 32. Nessuna persistenza dello stato form
Se l'utente cambia sezione e torna indietro, perde tutto.

**Azione:** Un `sessionStorage.setItem('contact_draft', JSON.stringify(formData))` costa 10 righe.

---

### 33. Contatto via `window.open` diretto
**File:** `components/ModernSite.jsx:944-952`

Nessun tracciamento conversione.

**Azione:** Aggiungere:
```js
window.dataLayer?.push({ event: 'lead_submit', channel: 'whatsapp' });
```
cruciale per misurare ROI del sito in GA4 / Meta Pixel.

---

### 34. Nessuna protezione anti‑spam
Form → `mailto:` / WhatsApp lato client, senza reCAPTCHA / Cloudflare Turnstile / honeypot.

**Azione:** Con static export si può usare `web3forms`, `Formspree`, o Cloudflare Worker come endpoint con rate limiting gratuito.

---

### 35. Analytics non configurati
Nessun GA4, Plausible, Vercel Analytics. Senza metriche tutte le discussioni SEO/UX restano opinioni.

---

### 36. Mancanza TypeScript
Progetto in JS puro nonostante complessità (motion variants, refs multipli, shape dati complesse). Migrare a TS avrebbe evitato i bug dei punti 1-2 (duplicate keys).

**Azione:** Partire con `// @ts-check` + JSDoc è gratuito.

---

### 37. `jsconfig.json` alias `@/*` sottoutilizzato
Definito ma usato solo in `hover-footer.jsx`. Standardizzare (`@/components/...`, `@/lib/...`) migliora leggibilità e prepara la migrazione TS.

---

## 🎨 Design — regole "Impeccable"

### 38. Uso di nero puro
**File:** `components/ModernSite.jsx:988` (`bg-[#1a1a1a]`), `#0a0a0a` per il terminale

Ok sul CRT skeuomorfico, ma il mockup phone in modal usa `#1a1a1a` accanto a `#f5f2ec` → contrasto troppo duro.

**Azione:** Suggerito `#0f0d0a` o `#14110c` (warm off‑black, coerente col brand caldo).

---

### 39. Card‑in‑card con bordi visibili
**File:** `components/ModernSite.jsx:1029-1032`

Dettaglio progetto: `clay-card` con border chiaro dentro un contenitore già bordato. Pattern "Inception" che le regole di design vietano esplicitamente.

**Azione:** Usare whitespace + tipografia per separare, non ribadire i bordi.

---

### 40. Tipografia — gerarchia insufficiente
`<h4>` delle card servizi (`text-sm sm:text-base font-black`) sono solo 1 livello più grandi del `<p>` descrizione (`text-[11px]`). La gerarchia non si legge a colpo d'occhio.

**Azione:** Applicare `text-lg sm:text-xl font-extrabold tracking-tight` crea lo stacco richiesto.

---

### 41. Ombre — ben fatte
Claymorphism usa multi-shadow low-opacity (`app/globals.css:352-357`) — aderente alle regole. Complimenti.

---

## 📐 Roadmap prioritizzata

### Immediato (< 2 h, alto ROI)

1. **Rimuovere** `Disallow: /_next/` da `robots.txt` — SEO critico
2. **Correggere** duplicati di chiave in `SnakeGame` e `services`
3. **Rimuovere** `/cookies` dalla sitemap oppure creare la pagina
4. **Rimuovere** `maximumScale: 1, userScalable: false` dal viewport
5. **Aggiungere** `og-image.jpg`, `icon.png`, `apple-icon.png` in `/app/` (convention Next 16)
6. **Eliminare** file dead: `SplinePhone.jsx`, `spotlight-card.jsx`, `hover-footer*.jsx`, `demo.jsx` + dipendenze `@splinetool/*` e `lucide-react`

---

### Breve termine (mezza giornata)

7. **Unificare** Google Fonts con `next/font/google`
8. **Aggiungere** `verification.google`, `vatID`, `contactPoint` al JSON-LD
9. **Convertire** `sitemap.xml` / `robots.txt` → `app/sitemap.js` / `app/robots.js`
10. **Creare** `app/not-found.jsx` minimale (404 brandizzato)
11. **Aggiungere** blocco CSS globale `prefers-reduced-motion`
12. **Aggiungere** GA4 o Vercel Analytics + evento `lead_submit`
13. **aria-label** sui pulsanti con solo emoji

---

### Medio termine (1-2 giorni)

14. **Split** `ModernSite.jsx` in 6-8 file per sezione
15. **Estrarre** dati (servizi/progetti) in `/data/*.js`
16. **Migrare** sezioni statiche a Server Components
17. **Creare** landing dedicate (`/siti-web`, `/marketing`, `/ivrea`) per SEO locale
18. **Sostituire** scroll hijacking con bottone "Mostra footer"
19. **Adottare** token Tailwind (`clay`, `espresso`, `ink`) al posto degli hex inline

---

### Strategico (sprint)

20. **Migrazione TypeScript** (iniziando con `// @ts-check` + JSDoc)
21. **Aggiungere** blog in `/blog` con MDX — long-tail SEO
22. **Endpoint form** reale (Cloudflare Worker o Web3Forms) + anti-spam
23. **Aggiungere** schema `FAQPage` + `Review` per testimonianze
24. **Case study** pagine `/progetti/[slug]` con screenshot reali e schema `CreativeWork`

---

## ✅ Cose fatte bene

- **App Router** correttamente usato, `metadata` e `viewport` separati (pattern Next 14+)
- **JSON-LD** articolato con `@graph` multi-entità (nonostante i gap)
- **Framer Motion** variants ben strutturate con ease curves professionali
- **Claymorphism 2.0** con ombre multi-layer low-opacity — aderente alle regole "Impeccable"
- **`app/page.jsx`** usa `dynamic(..., { ssr: false })` correttamente per `TerminalExperience`
- **`<html lang="it">`** settato
- **CSS per iOS safe-area** (`env(safe-area-inset-*)`) — dettaglio pro
- **`.gitignore`** include `.env*` e `out/` — corretto per static export
- **Form multistep** con validazione regex e fallback dual-channel (WhatsApp + email)

---

*Audit generato il 22 aprile 2026*
