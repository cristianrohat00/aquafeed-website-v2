# Aquafeed Distribution — website

Marketing + catalogue website for **Aquafeed Distribution**, the official BioMar
fish-feed distributor in Romania. Live at **https://aquafeed-biomar.ro**.

It is a **plain static website** — hand-written HTML, one CSS file and one JS file.
There is **no build step, no framework and no package manager**. You edit the files
and upload them; what's in the repo is exactly what runs in the browser.

---

## Tech stack

- **HTML/CSS/JS only** — no React/Vue, no bundler, no Node dependencies.
- **All behaviour and content data live in [`assets/app.js`](assets/app.js)** (one file): product catalogue, feeding calculator, resource articles, RO/EN translations, cookie consent, contact form.
- **Self-hosted fonts** (`assets/fonts/`, declared in [`assets/fonts.css`](assets/fonts.css)) — no request to Google Fonts, for GDPR.
- **Apache hosting** (Hosterion shared hosting) configured by [`.htaccess`](.htaccess).
- Third-party services: **Formspree** (contact form), **Shopify** webshop (`shop.aquafeed-biomar.ro`), optional **GA4 + Meta Pixel** (off until IDs are filled in).

---

## Project structure

```
.
├── index.html                # Home
├── produse.html              # Product catalogue — the ONLY page with the working product modal
├── calculator-hranire.html   # Feeding calculator (hidden: noindex + not linked anywhere)
├── contact.html              # Contact info, Formspree form, consent-gated Google Map
├── politica-cookies.html     # Cookie policy (bilingual RO/EN blocks toggled by language)
├── resurse/                  # Knowledge-base / SEO articles
│   ├── index.html            # Resource hub
│   └── *.html                # One file per article; slug must match app.js RESOURCE_ARTICLES
├── assets/
│   ├── app.js                # ALL logic + data (products, calculator, i18n, consent, forms)
│   ├── styles.css            # All styles
│   ├── fonts.css             # Self-hosted Google Fonts (GDPR)
│   └── fonts/                # .woff2 files
├── images/                   # Product shots (square), photos, icons, favicons
├── docs/
│   └── catalog-produse-biomar-2025.pdf   # Product catalogue PDF (linked site-wide)
├── archive/                  # Old/original image backups (archive/originals-backup/ is gitignored)
├── .htaccess                 # Apache: force HTTPS, www→non-www, caching, security headers
├── robots.txt
├── sitemap.xml               # MANUAL — must be updated by hand when adding indexable pages
└── favicon.ico
```

---

## Running locally

There is nothing to install. Serve the folder over HTTP (don't open files via
`file://` — the relative paths and `fetch`/consent logic expect a server):

```powershell
# Windows (note: bare `python` is the Microsoft Store stub here — use the `py` launcher)
py -m http.server 8000
```

Then open <http://localhost:8000/>. After editing CSS/JS, hard-refresh with
**Ctrl + F5** to bypass the browser cache.

---

## How to make common changes

### Add or edit a product

Products live in the **`FAMILIES`** array in [`assets/app.js`](assets/app.js).
The model is **family → members → (optional) per-pellet-size table**:

```js
{ id:"efico-alpha", family:"EFICO Alpha", species:"trout", range:"grower",
  desc:"short card text",
  rangeDesc:"<p>long HTML shown at the top of the modal…</p>",
  img:"images/fish-grower-high-performance-efico-alpha.webp",
  members:[
    { id:"t-g-1", name:"EFICO Alpha 790", pellet:"3.0 – 8.0mm",
      protein:"37 - 46%", fat:"26 - 32%",
      longDesc:"…", comp:"…", app:"…",
      benefits:["…","…"],
      shopUrl:"https://www.shop.aquafeed-biomar.ro/products/…",  // optional, see Shop links
      sizes:[                                                    // optional per-size table
        { mm:"3.0", protein:"42-45%", fat:"25-28%" },
        { mm:"4.5", protein:"42-45%", fat:"25-28%" }
      ] }
  ] }
```

- `species`: `trout` | `sturgeon` | `catfish`. `range`: `starter` | `pregrower` | `grower` | `broodstock`.
- If a member has a **`sizes`** array, the modal renders a "Dimensiuni & profil nutrițional"
  table. When you use `sizes`, set `comp` to point at it
  (e.g. `"Raport Proteină brută - Grăsimi pe dimensiune de pelet (vezi tabelul de mai jos)."`).
- `pelletSpan` is auto-computed from member `pellet` values; you normally don't set it.
- **Nutrition values are real product specs** — take them from the official BioMar
  catalogue (`docs/`), don't estimate them.

### Edit the feeding calculator

The calculator's feeding tables are a **separate** array, **`BIOMAR_PRODUCTS`**, in
[`assets/app.js`](assets/app.js). Each product has `rows` of weight ranges, each with a
9-value `rates` array for temperatures **4,6,8,10,12,14,16,18,20 °C** (kg feed / 100 kg
fish / day). The page `calculator-hranire.html` is intentionally **hidden** (`noindex`,
not linked in the nav/footer) — reach it by direct URL.

### Add a resource article

1. Create `resurse/<slug>.html` (copy an existing article for the shared head/nav/footer).
2. Register it in **`RESOURCE_ARTICLES`** (and a category in `RESOURCE_CATEGORIES`) in
   [`assets/app.js`](assets/app.js) — the `slug` must match the filename.
3. Add its URL to `sitemap.xml` (see SEO note below).

### Translations (RO / EN)

Strings are keyed by element **`id`** in the **`LANG`** object (`ro` and `en`) in
[`assets/app.js`](assets/app.js). To make text translatable: give the element an `id`,
then add that id to **both** `ro` and `en`. Larger bilingual blocks (cookie policy) use
`class="lang-ro"` / `class="lang-en"` which `setLanguage()` shows/hides. The chosen
language is saved to `localStorage` (`aq_lang`) and persists across pages.

### Shop links ("Cumpără" buttons)

Resolution order in `app.js`: member **`shopUrl`** (exact product page) → the range's
collection in **`SHOP_COLLECTION_BY_RANGE`** → **`SHOP_BASE`** (shop homepage). Add a
`shopUrl` to a member when its exact Shopify product page exists.

### Catalogue PDF

`docs/catalog-produse-biomar-2025.pdf` is linked from the footer of every page, the
products banner, and each product card. If you replace it, **keep the same filename** or
update every link (search the repo for `catalog-produse-biomar-2025.pdf`).

### Images

- Product family shots are **square** (e.g. 3000×3000) with the bag centred. The modal
  uses `object-fit: cover`, which relies on that square framing — keep new product images
  square.
- Use lowercase **kebab-case filenames, no spaces** (see gotcha below).

### Analytics & cookie consent

GA4 and Meta Pixel are **disabled by default**. Set `GA4_MEASUREMENT_ID` and/or
`META_PIXEL_ID` at the top of [`assets/app.js`](assets/app.js) to enable them. Tags only
load **after the visitor opts in** via the consent banner (Google Consent Mode v2; the
Google Map on the contact page is also consent-gated). The "Setări cookies" footer link
reopens the preferences modal.

### Contact form

`contact.html` posts to **Formspree** (`https://formspree.io/f/mzdodzbr`) via
`bindContactForm()` in `app.js`. Change the endpoint there if the Formspree form changes.

---

## ⚠️ Gotchas & conventions

- **Filenames are case-sensitive in production.** Hosting is Linux/Apache, but Windows
  dev is case-*insensitive*, so a wrong-case path works locally and 404s live. Always
  match the exact filename case, and prefer lowercase-kebab-case with **no spaces**.
- **Shared page chrome is copy-pasted, not included.** The `<nav>`, footer, mobile menu,
  WhatsApp button and `<head>` block are duplicated in every HTML file. A change to any of
  them must be applied to **all** pages.
- **The product modal markup has drifted** — only `produse.html` has the current
  side-by-side modal (and it's the only page where the modal actually opens, since it's
  the only page with `#productGrid`). Other pages still contain an older, dormant copy.
- **`app.js` is loaded by every page** and runs on `DOMContentLoaded`; each feature is
  guarded by checking for the element IDs it needs, so the single file works across pages.
- **`sitemap.xml` is maintained by hand.** It currently lists the home, products, contact
  and cookie-policy pages; the `resurse/` articles are **not** in it yet — add new
  indexable URLs when you publish them. (`calculator-hranire.html` is `noindex` on
  purpose, so leave it out.)
- Git may warn `LF will be replaced by CRLF` on commit — harmless line-ending
  normalisation on Windows.

---

## SEO

Each page has its own `<title>`, meta description, canonical URL, Open Graph / Twitter
cards and JSON-LD structured data (`LocalBusiness`, `Organization`, `FAQPage`). Canonical
URLs are **non-www** (`https://aquafeed-biomar.ro/…`) — `.htaccess` enforces that
redirect. Keep these in sync when you add or rename pages.

---

## Deployment

Static files are served from the site root on Apache (Hosterion). To deploy, upload the
repository contents to the web root (e.g. `public_html/`) via the host's FTP/file manager
or `git pull` on the server — **including `.htaccess`**, which handles:

- force HTTPS,
- `www.` → non-`www` redirect (canonical host),
- gzip compression,
- long-cache headers for static assets (HTML is `no-cache`),
- basic security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`).

There is **no CI/CD pipeline** in this repo; deployment is manual.

---

## Key references

- Domain: `aquafeed-biomar.ro` (non-www canonical) · Webshop: `shop.aquafeed-biomar.ro`
- Partner: BioMar (`biomar.com`)
- Contact: `comenzi@aquafeed-biomar.ro` · `+40 736 800 020`
- This is a **private / proprietary** project, not open source.
