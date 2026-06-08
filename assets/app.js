
    // ─── COOKIE CONSENT + ANALYTICS (GDPR / ePrivacy) ────────────
    // Non-essential tags load ONLY after the visitor opts in via the
    // consent banner. Fill in your IDs to activate (nothing loads while
    // empty). Get them from:
    //   GA4:        https://analytics.google.com  (Admin → Data Streams → "G-XXXXXXXXXX")
    //   Meta Pixel: https://business.facebook.com  (Events Manager → Pixel ID, digits only)
    const GA4_MEASUREMENT_ID = '';   // e.g. 'G-XXXXXXXXXX'  (analytics category)
    const META_PIXEL_ID      = '';   // e.g. '123456789012345' (marketing category)
    const CONSENT_KEY = 'aq_consent';
    const CONSENT_VERSION = 1;        // bump to re-prompt every visitor
    const CONSENT_MAX_AGE_DAYS = 180; // re-prompt after 6 months

    // Google Consent Mode v2 — deny everything BY DEFAULT, before any tag runs.
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = window.gtag || gtag;
    gtag('consent', 'default', {
      ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
      analytics_storage: 'denied', functionality_storage: 'granted', security_storage: 'granted',
      wait_for_update: 500
    });

    // ── Consent state ──
    function readConsent() {
      try {
        var raw = localStorage.getItem(CONSENT_KEY); if (!raw) return null;
        var c = JSON.parse(raw);
        if (c.v !== CONSENT_VERSION) return null;
        if (c.ts && (Date.now() - c.ts) > CONSENT_MAX_AGE_DAYS * 864e5) return null;
        return c;
      } catch (e) { return null; }
    }
    function saveConsent(cats) {
      var c = { v: CONSENT_VERSION, ts: Date.now(), analytics: !!cats.analytics, marketing: !!cats.marketing };
      try { localStorage.setItem(CONSENT_KEY, JSON.stringify(c)); } catch (e) {}
      applyConsent(c);
      return c;
    }

    // ── Tag loaders (each runs at most once) ──
    var _ga4Loaded = false, _pixelLoaded = false;
    function loadGA4() {
      if (_ga4Loaded || !GA4_MEASUREMENT_ID) return; _ga4Loaded = true;
      var s = document.createElement('script'); s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_MEASUREMENT_ID;
      document.head.appendChild(s);
      gtag('js', new Date());
      gtag('config', GA4_MEASUREMENT_ID);
    }
    function loadMetaPixel() {
      if (_pixelLoaded || !META_PIXEL_ID) return; _pixelLoaded = true;
      !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
        t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
      }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', META_PIXEL_ID);
      window.fbq('track', 'PageView');
    }
    function applyConsent(c) {
      gtag('consent', 'update', {
        analytics_storage: c.analytics ? 'granted' : 'denied',
        ad_storage: c.marketing ? 'granted' : 'denied',
        ad_user_data: c.marketing ? 'granted' : 'denied',
        ad_personalization: c.marketing ? 'granted' : 'denied'
      });
      if (c.analytics) loadGA4();
      if (c.marketing) loadMetaPixel();
      // Let other widgets react (e.g. the Google Maps click-to-load on contact).
      try { document.dispatchEvent(new CustomEvent('aq:consent', { detail: c })); } catch (e) {}
    }

    // ── Consent banner / preferences UI ──
    const CONSENT_I18N = {
      ro: {
        title: 'Acest site folosește cookie-uri',
        text: 'Folosim cookie-uri strict necesare pentru funcționarea site-ului și, doar cu acordul tău, cookie-uri de analiză și marketing pentru a îmbunătăți experiența și a măsura traficul.',
        accept: 'Acceptă tot', reject: 'Respinge tot', settings: 'Preferințe', save: 'Salvează preferințele',
        policy: 'Politica de cookie-uri', prefTitle: 'Preferințe cookie-uri', close: 'Închide',
        necTitle: 'Strict necesare', always: 'Mereu active',
        necDesc: 'Esențiale pentru funcționarea site-ului (limba aleasă, acces). Nu pot fi dezactivate și nu necesită consimțământ.',
        anaTitle: 'Analiză', anaDesc: 'Google Analytics — ne ajută să înțelegem cum este folosit site-ul, în mod anonim agregat.',
        mktTitle: 'Marketing', mktDesc: 'Meta Pixel și harta Google încorporată — folosite pentru a măsura campaniile și a afișa harta locației.',
        settingsLink: 'Setări cookies',
        mapBlocked: 'Harta Google este dezactivată până accepți cookie-urile de marketing.',
        mapLoad: 'Încarcă harta'
      },
      en: {
        title: 'This website uses cookies',
        text: 'We use strictly necessary cookies to run the site and, only with your consent, analytics and marketing cookies to improve your experience and measure traffic.',
        accept: 'Accept all', reject: 'Reject all', settings: 'Preferences', save: 'Save preferences',
        policy: 'Cookie Policy', prefTitle: 'Cookie preferences', close: 'Close',
        necTitle: 'Strictly necessary', always: 'Always on',
        necDesc: 'Essential for the website to work (chosen language, access). They cannot be disabled and require no consent.',
        anaTitle: 'Analytics', anaDesc: 'Google Analytics — helps us understand how the site is used, in anonymous aggregate form.',
        mktTitle: 'Marketing', mktDesc: 'Meta Pixel and the embedded Google Map — used to measure campaigns and display the location map.',
        settingsLink: 'Cookie settings',
        mapBlocked: 'The Google Map is disabled until you accept marketing cookies.',
        mapLoad: 'Load map'
      }
    };
    function consentLang() { return (typeof currentLang !== 'undefined' && CONSENT_I18N[currentLang]) ? currentLang : 'ro'; }
    function policyHref() { return (location.pathname.indexOf('/resurse/') !== -1 ? '../' : '') + 'politica-cookies.html'; }

    var _consentBuilt = false;
    function buildConsentUI() {
      if (_consentBuilt || !document.body) return; _consentBuilt = true;
      var wrap = document.createElement('div');
      wrap.innerHTML =
        '<div id="aqcBanner" class="aqc-banner" role="dialog" aria-label="Cookie consent" aria-live="polite">' +
          '<div class="aqc-banner-inner">' +
            '<div class="aqc-banner-text"><strong id="aqcTitle"></strong><p id="aqcText"></p></div>' +
            '<div class="aqc-banner-actions">' +
              '<button type="button" class="aqc-btn aqc-btn-ghost" id="aqcSettings"></button>' +
              '<button type="button" class="aqc-btn aqc-btn-ghost" id="aqcReject"></button>' +
              '<button type="button" class="aqc-btn aqc-btn-primary" id="aqcAccept"></button>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div id="aqcModal" class="aqc-modal" role="dialog" aria-modal="true" aria-label="Cookie preferences">' +
          '<div class="aqc-modal-card">' +
            '<div class="aqc-modal-head"><h2 id="aqcPrefTitle"></h2><button type="button" class="aqc-x" id="aqcClose" aria-label="Close">&times;</button></div>' +
            '<div class="aqc-modal-body">' +
              '<div class="aqc-cat"><div class="aqc-cat-head"><span id="aqcNecTitle"></span><span class="aqc-always" id="aqcAlways"></span></div><p id="aqcNecDesc"></p></div>' +
              '<div class="aqc-cat"><div class="aqc-cat-head"><span id="aqcAnaTitle"></span><label class="aqc-switch"><input type="checkbox" id="aqcAna"><span class="aqc-slider"></span></label></div><p id="aqcAnaDesc"></p></div>' +
              '<div class="aqc-cat"><div class="aqc-cat-head"><span id="aqcMktTitle"></span><label class="aqc-switch"><input type="checkbox" id="aqcMkt"><span class="aqc-slider"></span></label></div><p id="aqcMktDesc"></p></div>' +
            '</div>' +
            '<div class="aqc-modal-foot"><a href="#" id="aqcModalPolicy" class="aqc-policy-link"></a>' +
              '<div class="aqc-foot-btns"><button type="button" class="aqc-btn aqc-btn-ghost" id="aqcReject2"></button><button type="button" class="aqc-btn aqc-btn-primary" id="aqcSave"></button></div>' +
            '</div>' +
          '</div>' +
        '</div>';
      document.body.appendChild(wrap);

      document.getElementById('aqcAccept').addEventListener('click', function () { saveConsent({ analytics: true, marketing: true }); hideBanner(); closeConsentModal(); });
      function rejectAll() { saveConsent({ analytics: false, marketing: false }); hideBanner(); closeConsentModal(); }
      document.getElementById('aqcReject').addEventListener('click', rejectAll);
      document.getElementById('aqcReject2').addEventListener('click', rejectAll);
      document.getElementById('aqcSettings').addEventListener('click', openConsentPreferences);
      document.getElementById('aqcClose').addEventListener('click', closeConsentModal);
      document.getElementById('aqcSave').addEventListener('click', function () {
        saveConsent({ analytics: document.getElementById('aqcAna').checked, marketing: document.getElementById('aqcMkt').checked });
        hideBanner(); closeConsentModal();
      });
      document.getElementById('aqcModal').addEventListener('click', function (e) { if (e.target === this) closeConsentModal(); });
      renderConsentTexts();
    }
    function renderConsentTexts() {
      if (!_consentBuilt) return;
      var t = CONSENT_I18N[consentLang()];
      var set = function (id, v) { var el = document.getElementById(id); if (el) el.textContent = v; };
      set('aqcTitle', t.title); set('aqcText', t.text);
      set('aqcSettings', t.settings); set('aqcReject', t.reject); set('aqcAccept', t.accept);
      set('aqcPrefTitle', t.prefTitle);
      set('aqcNecTitle', t.necTitle); set('aqcAlways', t.always); set('aqcNecDesc', t.necDesc);
      set('aqcAnaTitle', t.anaTitle); set('aqcAnaDesc', t.anaDesc);
      set('aqcMktTitle', t.mktTitle); set('aqcMktDesc', t.mktDesc);
      set('aqcReject2', t.reject); set('aqcSave', t.save);
      set('aqcMapPhText', t.mapBlocked); set('aqcMapLoad', t.mapLoad);
      var pl = document.getElementById('aqcModalPolicy'); if (pl) { pl.textContent = t.policy; pl.href = policyHref(); }
    }
    function showBanner() { var b = document.getElementById('aqcBanner'); if (b) b.classList.add('aqc-show'); }
    function hideBanner() { var b = document.getElementById('aqcBanner'); if (b) b.classList.remove('aqc-show'); }
    function openConsentPreferences() {
      buildConsentUI();
      var c = readConsent() || { analytics: false, marketing: false };
      document.getElementById('aqcAna').checked = !!c.analytics;
      document.getElementById('aqcMkt').checked = !!c.marketing;
      renderConsentTexts();
      document.getElementById('aqcModal').classList.add('aqc-show');
    }
    function closeConsentModal() { var m = document.getElementById('aqcModal'); if (m) m.classList.remove('aqc-show'); }

    // ── Click-to-load for the Google Maps embed (marketing category) ──
    function loadConsentMap() {
      var box = document.getElementById('aqcMap'); if (!box || box.dataset.loaded) return;
      var src = box.getAttribute('data-src'); if (!src) return;
      box.dataset.loaded = '1';
      box.innerHTML = '<iframe src="' + src + '" width="100%" height="100%" style="border:0;display:block" ' +
        'loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Locație Aquafeed Distribution"></iframe>';
    }
    function initConsentMap() {
      var box = document.getElementById('aqcMap'); if (!box) return;
      var c = readConsent();
      if (c && c.marketing) { loadConsentMap(); return; }
      var btn = document.getElementById('aqcMapLoad');
      if (btn) btn.addEventListener('click', loadConsentMap); // explicit per-embed consent
      // Auto-load if the visitor later grants marketing consent.
      document.addEventListener('aq:consent', function (e) { if (e.detail && e.detail.marketing) loadConsentMap(); });
    }

    function initConsent() {
      buildConsentUI();
      var c = readConsent();
      if (c) { applyConsent(c); } else { showBanner(); }
      initConsentMap();
    }
    // Exposed for the "Setări cookies" footer link.
    window.openConsentPreferences = openConsentPreferences;

    // ─── SHOP LINKING ────────────────────────────────────────────
    // The "Cumpără Acum" buttons link to the Shopify webshop.
    // Best (exact product page): add a `shopUrl` field to a product, e.g.
    //   shopUrl:"https://www.shop.aquafeed-biomar.ro/products/furaj-pastrav-extrudat-biomar-inicio-918-1-5mm-25kg"
    // If no shopUrl is set, the button falls back to the matching collection
    // (verified: starter + creștere), then to the shop homepage.
    const SHOP_BASE = "https://www.shop.aquafeed-biomar.ro/";
    // Only collections confirmed to exist are mapped here. Add more as you create them.
    const SHOP_COLLECTION_BY_RANGE = {
      starter: "https://www.shop.aquafeed-biomar.ro/collections/furaj-starter",
      grower:  "https://www.shop.aquafeed-biomar.ro/collections/furaj-crestere"
    };
    function getShopUrl(p) {
      if (p && p.shopUrl) return p.shopUrl;                       // 1) exact product page
      if (p && SHOP_COLLECTION_BY_RANGE[p.range]) return SHOP_COLLECTION_BY_RANGE[p.range]; // 2) collection
      return SHOP_BASE;                                            // 3) shop homepage
    }

    // ─── EDIT: PRODUCT DATA (FAMILY MODEL) ───────────────────────
    // The catalogue is now organised by FAMILY (gamă). Each family has a
    // list of `members` (the individual products). A family with a single
    // member that comes in many pellet sizes can expose a per-size table via
    // the member's optional `sizes` array. Multi-member families list their
    // products in the modal.
    //
    // Family fields: id, family (display name), species (trout/sturgeon/catfish),
    //   range (starter/pregrower/grower/broodstock — the growth stage),
    //   desc (short card text), img, [pelletSpan optional — auto-computed if omitted].
    // Member fields: id, name, pellet ("3.0 – 8.0mm"), protein, fat, comp,
    //   benefits[], app, longDesc, [shopUrl], [img], [sizes:[{mm,protein,fat}]].

    const FAMILIES = [
      // ══ PĂSTRĂV ══
      { id:"inicio-plus", family:"INICIO Plus", species:"trout", range:"starter",
        desc:"Gama de start pentru salmonide — mini-pelete extrudate, un singur produs disponibil în mai multe dimensiuni de pelet.",
        rangeDesc:'<p style="margin:0 0 12px;line-height:1.7">Gama <strong>INICIO Plus</strong> acoperă toate necesitățile nutriționale ale salmonidelor în primele etape de viață. Rețetele sunt dezvoltate pe baza unor materii prime de calitate superioară și asigură un echilibru optim între energie și proteină, profiluri echilibrate de aminoacizi și acizi grași, precum și un aport adecvat de vitamine și micronutrienți.</p><p style="margin:0 0 12px;line-height:1.7">INICIO Plus este actualizată permanent prin integrarea celor mai recente rezultate ale cercetării și dezvoltării în domeniul nutriției peștilor și al furajelor, oferind soluții adaptate cerințelor diferitelor sisteme de creștere și piețe din acvacultură.</p><p style="margin:0 0 12px;line-height:1.7">Furajul este produs sub formă de <strong>microgranule extrudate</strong>, utilizând ingrediente de înaltă calitate și cu digestibilitate ridicată. Formularea INICIO Plus este concepută pentru a asigura o nutriție optimă și o dezvoltare sănătoasă a puietului.</p><p style="margin:0 0 12px;line-height:1.7">Accentul este pus pe stabilitatea nutrițională, prin includerea unui nivel optim de vitamine și ingrediente cu efect de susținere a sistemului imunitar, precum și pe o digestibilitate ridicată care favorizează creșterea și dezvoltarea puietului.</p><p style="margin:0 0 12px;line-height:1.7">Beneficiile produsului sunt completate de ingrediente și aditivi funcționali special selectați, precum <strong>Bactocell®</strong> și <strong>B-WYSE™</strong>, care contribuie la sănătatea și performanța peștilor în primele faze de creștere.</p><p style="font-size:12px;font-style:italic;color:var(--text-light);margin:14px 0 0">Imaginile produselor sunt prezentate cu titlu informativ și pot diferi de aspectul real al ambalajului.</p><p style="font-size:12px;font-style:italic;color:var(--text-light);margin:6px 0 0">Disponibilitatea produselor poate varia în funcție de regiune. Pentru informații suplimentare privind disponibilitatea gamei INICIO Plus în România, vă rugăm să ne contactați.</p>',
        img:"images/fish-starter-first-feeding-inicio-plus.webp",
        members:[
          { id:"t-s-1", name:"INICIO Plus", pellet:"0.35 – 2.0mm", protein:"60% - 52%", fat:"14% - 24%",
            longDesc:"Gama INICIO Plus acoperă toate nevoile nutriționale ale salmonidelor în primele stadii de viață. Este bazată pe materii prime de calitate superioară și oferă un echilibru optim între energie și proteină, profiluri echilibrate de aminoacizi și acizi grași, vitamine și micronutrienți.<br><br>Mini-pelete extrudate, realizate din ingrediente de înaltă calitate și cu digestibilitate ridicată. Accent deosebit pe stabilitatea nutrițională, prin suplimentarea cu vitamine, ingrediente cu efect imunomodulator și digestibilitate ridicată, pentru a susține creșterea alevinilor.<br><br>Suport suplimentar este oferit prin ingrediente speciale și aditivi precum Bactocell® și B-WYSE™.",
            comp:"Raport Proteină brută - Grăsimi pe dimensiune de pelet (vezi tabelul de mai jos).",
            benefits:["Supraviețuire ridicată","Creștere uniformă","Digestibilitate excelentă","Apă curată în bazin"],
            app:"Se administrează din prima zi de hrănire activă.",
            sizes:[
              { mm:"0.35", protein:"60%", fat:"14%" },
              { mm:"0.5",  protein:"50%", fat:"15%" },
              { mm:"0.8",  protein:"56%", fat:"18%" },
              { mm:"1.1",  protein:"56%", fat:"18%" },
              { mm:"1.5",  protein:"54%", fat:"21%" },
              { mm:"2.0",  protein:"52%", fat:"24%" }
            ] },
          { id:"t-s-2", name:"INICIO Plus G", pellet:"0.4 – 0.6mm", protein:"60%", fat:"10%",
            longDesc:"Hrana granulată este dezvoltată special pentru alevinii deosebit de mici sau pentru loturile de alevini care au distribuții neuniforme ale dimensiunilor, deoarece se asigură că alevinii mici sunt capabili să se hrănească.<br><br>Accent pe stabilitatea nutrițională cu vitamine sporite și ingrediente imunitare modulante și o digestibilitate ridicată pentru a promova sănătatea și creșterea alevinilor.",
            comp:"Proteină brută: 60%,<br> Grăsimi: 10%",
            benefits:["Supraviețuire ridicată","Creștere uniformă","Digestibilitate excelentă","Apă curată în bazin"],
            app:"Se administrează din prima zi de hrănire activă." }
        ] },

      { id:"inicio-pregrower", family:"INICIO", species:"trout", range:"pregrower",
        desc:"Furaj de transfer pentru juvenili, optimizat pentru conversie alimentară și creștere rapidă.",
        rangeDesc:'<p style="margin:0 0 12px;line-height:1.7">Gama <strong>INICIO</strong> reprezintă o soluție excelentă de furajare, cu un nivel mediu-ridicat de energie, destinată puietului de dimensiuni medii și mari.</p><p style="margin:0 0 12px;line-height:1.7">Portofoliul include rețete atât cu proteine de origine terestră, cât și fără acestea, pentru a răspunde diferitelor preferințe și obiective de producție ale fermierilor.</p><h4 style="font-size:13px;font-weight:700;color:var(--bio-blue);text-transform:uppercase;letter-spacing:.6px;margin:18px 0 10px">Beneficii principale</h4><ul style="margin:0 0 12px;padding-left:20px;line-height:1.7"><li style="margin-bottom:6px">Granule extrudate de înaltă calitate fizică, cu dimensiuni atent calibrate pentru fiecare etapă de creștere.</li><li style="margin-bottom:6px">Stabilitate nutrițională ridicată, pentru o alimentație constantă și eficientă.</li><li style="margin-bottom:6px">Materii prime atent selecționate, de calitate superioară.</li><li style="margin-bottom:6px">Formulare concepută pentru a susține o creștere sănătoasă și o valorificare eficientă a furajului.</li></ul><p style="font-size:12px;font-style:italic;color:var(--text-light);margin:14px 0 0">Imaginile produselor sunt prezentate cu titlu informativ și pot diferi de aspectul real al ambalajului.</p><p style="font-size:12px;font-style:italic;color:var(--text-light);margin:6px 0 0">Disponibilitatea produselor poate varia în funcție de regiune. Pentru informații suplimentare privind disponibilitatea gamei INICIO în România, vă rugăm să ne contactați.</p>',
        img:"images/FISH - Starter - High Performance - INICIO 1.webp",
        members:[
          { id:"t-pg-1", name:"INICIO 918", pellet:"1.5 – 2.0mm", protein:"48% - 46%", fat:"20% - 23%",
            longDesc:"Soluția ideală pentru faza de pre-creștere, acoperind creșterea de la 5g la 50g cu raport optim proteine/energie.",
            comp:"Raport Proteină brută - Grăsimi pe dimensiune de pelet (vezi tabelul de mai jos).",
            benefits:["Conversie alimentară eficientă","Creștere rapidă","Acceptabilitate ridicată","Dezvoltare scheletică sănătoasă"],
            app:"Pentru juvenili de 3-50g. Temperatura: 4-20°C.",
            shopUrl:"https://www.shop.aquafeed-biomar.ro/products/furaj-pastrav-extrudat-biomar-inicio-918-1-5mm-25kg",
            sizes:[
              { mm:"1.5", protein:"48%", fat:"20%" },
              { mm:"2.0", protein:"46%", fat:"23%" }
            ] },
          { id:"t-pg-2", name:"INICIO 702", pellet:"2.0mm", protein:"41-44%", fat:"21-24%",
            longDesc:"Produs dezvoltat special pentru sistemele de recirculare (RAS). Minimizează emisiile de azot și fosfor.",
            comp:"Proteină brută: 41-44%,<br> Grăsimi: 21-24%",
            benefits:["Ideal pentru RAS","Emisii reduse N&P","Stabilitate excelentă în apă","Apă curată în sistem"],
            app:"Pentru sisteme RAS. Juvenili 15-50g." }
        ] },

      { id:"efico-alpha", family:"EFICO Alpha", species:"trout", range:"grower",
        desc:"Furaje premium de creștere — performanță, pigmentare și calitate superioară a fileului, în mai multe variante.",
        rangeDesc:'<p style="margin:0 0 12px;line-height:1.7"><strong>EFICO Alpha</strong> este o gamă versatilă de furaje pentru păstrăv, concepută pentru a oferi performanțe constante într-o varietate de condiții de creștere și sisteme de producție.</p><p style="margin:0 0 12px;line-height:1.7">Rețetele sunt formulate pe baza unui raport optimizat între proteină digestibilă și energie digestibilă, contribuind la o utilizare eficientă a nutrienților și la obținerea unor rezultate constante în fermă.</p><p style="margin:0 0 12px;line-height:1.7">Gama include furaje cu diferite niveluri energetice, permițând alegerea soluției potrivite în funcție de intensitatea producției, condițiile de creștere și obiectivele fiecărei ferme.</p><h4 style="font-size:13px;font-weight:700;color:var(--bio-blue);text-transform:uppercase;letter-spacing:.6px;margin:18px 0 10px">Beneficii principale</h4><ul style="margin:0 0 12px;padding-left:20px;line-height:1.7"><li style="margin-bottom:6px">Gamă flexibilă, adaptată unei varietăți de condiții de creștere.</li><li style="margin-bottom:6px">Disponibilă în mai multe niveluri energetice pentru a răspunde diferitelor strategii de producție.</li><li style="margin-bottom:6px">Susține performanțe constante și o conversie furajeră eficientă.</li><li style="margin-bottom:6px">Valorificare optimă a nutrienților datorită formulărilor echilibrate.</li><li style="margin-bottom:6px">Dezvoltată pe baza conceptului <strong>Performance Concept</strong> BioMar.</li></ul><p style="margin:0 0 12px;line-height:1.7"><strong>EFICO Alpha</strong> reprezintă alegerea ideală pentru fermele care caută un echilibru între performanță, flexibilitate și eficiență economică, indiferent de sistemul de creștere utilizat.</p><p style="font-size:12px;font-style:italic;color:var(--text-light);margin:14px 0 0">Imaginile produselor sunt prezentate cu titlu informativ și pot diferi de aspectul real al ambalajului.</p><p style="font-size:12px;font-style:italic;color:var(--text-light);margin:6px 0 0">Disponibilitatea produselor poate varia în funcție de regiune. Pentru informații suplimentare privind disponibilitatea gamei EFICO Alpha în România, vă rugăm să ne contactați.</p>',
        img:"images/fish-grower-high-performance-efico-alpha.webp",
        members:[
          { id:"t-g-1", name:"EFICO Alpha 790", pellet:"3.0 – 8.0mm", protein:"37 - 46%", fat:"26 - 32%",
            longDesc:"Hrană premium de creștere cu eficiență ridicată, pigmentare excelentă și impact ecologic redus.",
            comp:"Raport Proteină brută - Grăsimi pe dimensiune de pelet (vezi tabelul de mai jos).",
            benefits:["Cea mai bună conversie alimentară","Pigmentare excelentă","Impact ecologic redus","Calitate superioară a fileului"],
            app:"Pentru păstrăv >50g până la recoltare. Temperatura: 4 - 20°C.",
            sizes:[
              { mm:"3.0", protein:"43-46%", fat:"26-29%" },
              { mm:"4.5", protein:"39-42%", fat:"28-31%" },
              { mm:"6.0", protein:"37-40%", fat:"29-32%" },
              { mm:"8.0", protein:"37-40%", fat:"29-32%" }
            ] },
          { id:"t-g-2", name:"EFICO Alpha 790FT", pellet:"3.0 – 6.0mm", protein:"36 - 41%", fat:"27 - 31%",
            longDesc:"Hrană de creștere focalizată pe performanță economică și calitatea fileului.",
            comp:"Raport Proteină brută - Grăsimi pe dimensiune de pelet (vezi tabelul de mai jos).",
            benefits:["Performanță economică optimă","Calitate bună a fileului","Conversie competitivă","Preț accesibil"],
            app:"Pentru păstrăv >50g.",
            sizes:[
              { mm:"3.0", protein:"40-43%", fat:"25-28%" },
              { mm:"4.5", protein:"38-41%", fat:"26-29%" },
              { mm:"6.0", protein:"36-39%", fat:"27-30%" }
            ] },
          { id:"t-g-3", name:"EFICO Alpha 756 — Plutitor", pellet:"3.0 – 8.0mm", protein:"36 - 43%", fat:"22 - 25%",
            longDesc:"Dietă funcțională pentru sănătatea peștilor, întărind sistemul imunitar. Granulă plutitoare.",
            comp:"Raport Proteină brută - Grăsimi pe dimensiune de pelet (vezi tabelul de mai jos).",
            benefits:["Sistem imunitar întărit","Reducerea mortalității","Rezistență la boli","Recuperare rapidă"],
            app:"Se administrează 2-4 săptămâni înainte/în timpul perioadelor critice.",
            sizes:[
              { mm:"3.0", protein:"40-43%", fat:"22-25%" },
              { mm:"4.5", protein:"40-43%", fat:"22-25%" },
              { mm:"6.0", protein:"36-39%", fat:"22-25%" },
              { mm:"8.0", protein:"36-39%", fat:"22-25%" }
            ] },
          { id:"t-g-4", name:"EFICO Alpha 717", pellet:"3.0 – 8.0mm", protein:"40 - 43%", fat:"21 - 24%",
            longDesc:"Dietă funcțională pentru sănătatea peștilor, întărind sistemul imunitar.",
            comp:"Raport Proteină brută - Grăsimi pe dimensiune de pelet (vezi tabelul de mai jos).",
            benefits:["Sistem imunitar întărit","Reducerea mortalității","Rezistență la boli","Recuperare rapidă"],
            app:"Se administrează 2-4 săptămâni înainte/în timpul perioadelor critice.",
            sizes:[
              { mm:"3.0", protein:"40-43%", fat:"21-24%" },
              { mm:"4.5", protein:"40-43%", fat:"21-24%" },
              { mm:"6.0", protein:"40-43%", fat:"21-24%" },
              { mm:"8.0", protein:"40-43%", fat:"21-24%" }
            ] }
        ] },

      { id:"efico-enviro", family:"EFICO Enviro", species:"trout", range:"grower",
        desc:"Furaje de vârf pentru creștere — cel mai ridicat nivel de energie și impact ecologic redus.",
        rangeDesc:'<p style="margin:0 0 12px;line-height:1.7"><strong>EFICO Enviro</strong> este o gamă premium de furaje pentru păstrăv, recunoscută pentru performanțele sale ridicate și calitatea superioară a ingredientelor utilizate.</p><p style="margin:0 0 12px;line-height:1.7">Materiile prime sunt atent selecționate pentru a asigura un profil echilibrat de aminoacizi și o digestibilitate ridicată, permițând o valorificare optimă a nutrienților de către pești. Acest lucru contribuie la obținerea unor performanțe superioare de creștere și la reducerea impactului asupra mediului de cultură prin menținerea unei calități mai bune a apei.</p><h4 style="font-size:13px;font-weight:700;color:var(--bio-blue);text-transform:uppercase;letter-spacing:.6px;margin:18px 0 10px">Beneficii principale</h4><ul style="margin:0 0 12px;padding-left:20px;line-height:1.7"><li style="margin-bottom:6px">Furaj premium, echilibrat nutrițional, adaptat cerințelor păstrăvului în faza de creștere.</li><li style="margin-bottom:6px">Digestibilitate ridicată și utilizare eficientă a nutrienților.</li><li style="margin-bottom:6px">Susține performanțe excelente de creștere și o conversie furajeră eficientă.</li><li style="margin-bottom:6px">Contribuie la reducerea încărcării organice a apei și la menținerea unui mediu de creștere mai curat.</li><li style="margin-bottom:6px">Dezvoltat pe baza conceptului <strong>Performance Concept</strong> BioMar.</li></ul><p style="margin:0 0 12px;line-height:1.7"><strong>EFICO Enviro</strong> este alegerea ideală pentru fermele care urmăresc maximizarea performanțelor de producție, menținând în același timp standarde ridicate privind eficiența și gestionarea calității apei.</p><p style="font-size:12px;font-style:italic;color:var(--text-light);margin:14px 0 0">Imaginile produselor sunt prezentate cu titlu informativ și pot diferi de aspectul real al ambalajului.</p><p style="font-size:12px;font-style:italic;color:var(--text-light);margin:6px 0 0">Disponibilitatea produselor poate varia în funcție de regiune. Pentru informații suplimentare privind disponibilitatea gamei EFICO Enviro în România, vă rugăm să ne contactați.</p>',
        img:"images/fish-grower-top-performance-efico-enviro.webp",
        members:[
          { id:"t-g-5", name:"EFICO Enviro 920 ADVANCE", pellet:"3.0 – 8.0mm", protein:"38 - 46%", fat:"27 - 34%",
            longDesc:"Produsul nostru de vârf. Cel mai ridicat nivel de energie, pigmentare uniformă și calitate superioară a fileului.",
            comp:"Raport Proteină brută - Grăsimi pe dimensiune de pelet (vezi tabelul de mai jos).",
            benefits:["Cea mai bună conversie alimentară","Pigmentare excelentă","Impact ecologic redus","Calitate superioară a fileului"],
            app:"Pentru păstrăv >50g până la recoltare.",
            sizes:[
              { mm:"3.0", protein:"43-46%", fat:"27-30%" },
              { mm:"4.5", protein:"42-45%", fat:"29-32%" },
              { mm:"6.0", protein:"38-41%", fat:"31-34%" },
              { mm:"8.0", protein:"38-41%", fat:"31-34%" }
            ] },
          { id:"t-g-6", name:"EFICO Enviro 921 ADVANCE — Plutitor", pellet:"3.0 – 8.0mm", protein:"42%", fat:"28%",
            longDesc:"Variantă plutitoare a gamei Enviro, cu ingrediente funcționale brevetate.",
            comp:"Raport Proteină brută - Grăsimi pe dimensiune de pelet (vezi tabelul de mai jos).",
            benefits:["Pigmentare excelentă","Impact ecologic redus","Calitate superioară a fileului","Granulă plutitoare"],
            app:"Pentru păstrăv >50g până la recoltare.",
            sizes:[
              { mm:"3.0", protein:"42-45%", fat:"25-28%" },
              { mm:"4.5", protein:"42-45%", fat:"25-28%" },
              { mm:"6.0", protein:"40-43%", fat:"26-29%" }
            ] }
        ] },

      { id:"efico-genio", family:"EFICO Genio", species:"trout", range:"broodstock",
        desc:"Furaj specializat pentru reproducători, formulat pentru calitatea optimă a icrelor.",
        rangeDesc:'<p style="margin:0 0 12px;line-height:1.7"><strong>EFICO Genio</strong> este o gamă de furaje special formulată pentru reproducătorii de păstrăv, destinată obținerii unor icre de înaltă calitate și a unui puiet sănătos și viguros.</p><p style="margin:0 0 12px;line-height:1.7">Rețetele acoperă cerințele nutriționale specifice reproducătorilor pe întreaga perioadă reproductivă, de la maturarea gonadelor până la recuperarea după reproducere. Formularea optimizată include micronutrienți esențiali și ingrediente funcționale care susțin dezvoltarea reproducătorilor și contribuie la obținerea unor rezultate superioare în procesul de reproducere.</p><h4 style="font-size:13px;font-weight:700;color:var(--bio-blue);text-transform:uppercase;letter-spacing:.6px;margin:18px 0 10px">Beneficii principale</h4><ul style="margin:0 0 12px;padding-left:20px;line-height:1.7"><li style="margin-bottom:6px">Conceput special pentru reproducătorii de păstrăv și producția de icre de calitate superioară.</li><li style="margin-bottom:6px">Susține fertilitatea și dezvoltarea optimă a gonadelor.</li><li style="margin-bottom:6px">Contribuie la obținerea unui puiet sănătos, uniform și viguros.</li><li style="margin-bottom:6px">Conține făină de krill, care stimulează apetitul și furnizează astaxantină naturală.</li><li style="margin-bottom:6px">Susține dezvoltarea celulelor ovariene, pigmentarea naturală și performanțele reproductive.</li><li style="margin-bottom:6px">Nivel optimizat de energie digestibilă, precum și profiluri echilibrate de aminoacizi și acizi grași pentru susținerea proceselor reproductive.</li></ul><p style="margin:0 0 12px;line-height:1.7"><strong>EFICO Genio</strong> reprezintă soluția dedicată fermelor care urmăresc maximizarea performanțelor reproductive și obținerea unor generații de puiet de cea mai bună calitate.</p><p style="font-size:12px;font-style:italic;color:var(--text-light);margin:14px 0 0">Imaginile produselor sunt prezentate cu titlu informativ și pot diferi de aspectul real al ambalajului.</p><p style="font-size:12px;font-style:italic;color:var(--text-light);margin:6px 0 0">Disponibilitatea produselor poate varia în funcție de regiune. Pentru informații suplimentare privind disponibilitatea gamei EFICO Genio în România, vă rugăm să ne contactați.</p>',
        img:"images/HATCHERY-Hatchery-Broodstock-EFICO-Genio 1.webp",
        members:[
          { id:"t-b-1", name:"EFICO Genio 991", pellet:"6.0 – 8.0mm", protein:"44%", fat:"22%",
            longDesc:"Formulat special pentru reproducătorii de păstrăv. Niveluri optime de vitamine, minerale și acizi grași esențiali pentru calitatea superioară a icrelor.",
            comp:"Proteină brută: 48%, Grăsimi: 15%",
            benefits:["Calitate superioară a icrelor","Fertilitate ridicată","Sănătatea reproducătorilor","Nutriție completă"],
            app:"Pentru reproducători. Frecvența: 2-3 mese/zi. Se administrează 3-6 luni înainte de reproducere." }
        ] },

      // ══ STURION ══
      { id:"efico-sigma", family:"EFICO Sigma", species:"sturgeon", range:"grower",
        desc:"Furaj de creștere pentru sturion, optimizat pentru randament și calitatea cărnii.",
        rangeDesc:'<p style="margin:0 0 12px;line-height:1.7"><strong>EFICO Sigma</strong> este o gamă specializată de furaje pentru sturioni, dezvoltată pentru a răspunde diferitelor obiective de producție, de la creșterea pentru carne până la producția de caviar.</p><p style="margin:0 0 12px;line-height:1.7">Rețetele sunt rezultatul a peste 20 de ani de cercetare și colaborare cu fermieri specializați în creșterea sturionilor, oferind soluții nutriționale adaptate diferitelor specii și categorii de greutate.</p><h4 style="font-size:13px;font-weight:700;color:var(--bio-blue);text-transform:uppercase;letter-spacing:.6px;margin:18px 0 10px">Beneficii principale</h4><ul style="margin:0 0 12px;padding-left:20px;line-height:1.7"><li style="margin-bottom:6px">Furaje specializate pentru producția de carne și caviar.</li><li style="margin-bottom:6px">Include rețete dedicate femelelor mature destinate producției de caviar.</li><li style="margin-bottom:6px">Potrivite atât pentru sisteme recirculante (RAS), cât și pentru ferme cu flux continuu de apă (flow-through).</li><li style="margin-bottom:6px">Adaptate diferitelor condiții climatice și sisteme de producție.</li><li style="margin-bottom:6px">Asigură aportul necesar de micronutrienți pentru dezvoltarea armonioasă a sturionilor în toate etapele de creștere.</li><li style="margin-bottom:6px">Formulare echilibrată pentru valorificarea eficientă a furajului și susținerea performanțelor de creștere.</li><li style="margin-bottom:6px">Contribuie la optimizarea indicelui de conversie furajeră (ICF) și la creșterea eficienței economice a fermei.</li></ul><p style="margin:0 0 12px;line-height:1.7"><strong>EFICO Sigma</strong> oferă soluții nutriționale complete pentru fermele de sturioni care urmăresc performanțe ridicate, eficiență în producție și produse finale de cea mai bună calitate.</p><p style="font-size:12px;font-style:italic;color:var(--text-light);margin:14px 0 0">Imaginile produselor sunt prezentate cu titlu informativ și pot diferi de aspectul real al ambalajului.</p><p style="font-size:12px;font-style:italic;color:var(--text-light);margin:6px 0 0">Disponibilitatea produselor poate varia în funcție de regiune. Pentru informații suplimentare privind disponibilitatea gamei EFICO Sigma în România, vă rugăm să ne contactați.</p>',
        img:"images/fish-grower-finisher-efico-sigma.webp",
        members:[
          { id:"s-g-1", name:"EFICO Sigma 811", pellet:"4.5 – 12mm", protein:"45%", fat:"20%",
            sizes:[
              { mm:"4.5",  protein:"45%", fat:"20%" },
              { mm:"6.0",  protein:"45%", fat:"20%" },
              { mm:"8.0",  protein:"45%", fat:"20%" },
              { mm:"12.0", protein:"45%", fat:"20%" }
            ],
            longDesc:"Susține creștere constantă pe termen lung cu accent pe masa musculară și calitatea cărnii.",
            comp:"Proteină brută: 45%, Grăsimi: 20%, Cenușă: 7%, Fibre: 2.5%, Fosfor: 1%",
            benefits:["Creștere pe termen lung","Calitate superioară a cărnii","Masă musculară optimă","Conversie eficientă"],
            app:"Pentru sturion >200g. Frecvența: 2-4 mese/zi." }
        ] },

      { id:"blue-impact", family:"BLUE IMPACT", species:"sturgeon", range:"grower",
        desc:"Gamă de creștere pentru sturion, axată pe sustenabilitate și performanță.",
        rangeDesc:'<p style="margin:0 0 12px;line-height:1.7"><strong>Blue Impact</strong> este conceptul global BioMar dedicat dezvoltării unei acvaculturi mai sustenabile și reducerii impactului asupra mediului, fără a compromite performanțele de creștere ale peștilor.</p><p style="margin:0 0 12px;line-height:1.7">Gama este bazată pe utilizarea unor materii prime inovatoare și responsabile, cu o amprentă de carbon redusă, o utilizare mai eficientă a resurselor și o dependență mai mică de ingredientele provenite din pescuitul de captură.</p><h4 style="font-size:13px;font-weight:700;color:var(--bio-blue);text-transform:uppercase;letter-spacing:.6px;margin:18px 0 10px">Beneficii principale</h4><ul style="margin:0 0 12px;padding-left:20px;line-height:1.7"><li style="margin-bottom:6px">Contribuie la reducerea amprentei de carbon asociate producției de pește.</li><li style="margin-bottom:6px">Integrează materii prime circulare și ingrediente provenite din surse sustenabile.</li><li style="margin-bottom:6px">Reduce dependența de resursele marine limitate utilizate tradițional în producția furajelor pentru acvacultură.</li><li style="margin-bottom:6px">Include ingrediente noi și inovatoare care contribuie la îmbunătățirea performanței de sustenabilitate a fermei.</li><li style="margin-bottom:6px">Conține niveluri ridicate de acizi grași Omega-3 și menține un raport optim între acizii grași Omega-6 și Omega-3.</li><li style="margin-bottom:6px">Dezvoltat pe baza rețetei premium <strong>BioMar Power</strong>, asigurând performanțe ridicate de creștere și o conversie furajeră eficientă.</li></ul><p style="margin:0 0 12px;line-height:1.7"><strong>Blue Impact</strong> reprezintă alegerea ideală pentru fermele care urmăresc să combine performanțele productive cu obiectivele de sustenabilitate și responsabilitate față de mediu.</p><p style="font-size:12px;font-style:italic;color:var(--text-light);margin:14px 0 0">Imaginile produselor sunt prezentate cu titlu informativ și pot diferi de aspectul real al ambalajului.</p><p style="font-size:12px;font-style:italic;color:var(--text-light);margin:6px 0 0">Disponibilitatea produselor poate varia în funcție de regiune. Pentru informații suplimentare privind disponibilitatea gamei Blue Impact în România, vă rugăm să ne contactați.</p>',
        img:"images/salmon-grower-sustainability-blue-impact.webp",
        members:[
          { id:"s-g-2", name:"BLUE IMPACT 8040", pellet:"4.5 – 12mm", protein:"45%", fat:"20%",
            sizes:[
              { mm:"4.5",  protein:"45%", fat:"20%" },
              { mm:"6.0",  protein:"45%", fat:"20%" },
              { mm:"8.0",  protein:"45%", fat:"20%" },
              { mm:"12.0", protein:"45%", fat:"20%" }
            ],
            longDesc:"Susține creștere constantă pe termen lung cu accent pe masa musculară și calitatea cărnii.",
            comp:"Proteină brută: 45%, Grăsimi: 20%, Cenușă: 7%, Fibre: 2.5%, Fosfor: 1%",
            benefits:["Creștere pe termen lung","Calitate superioară a cărnii","Masă musculară optimă","Conversie eficientă"],
            app:"Pentru sturion >200g. Frecvența: 2-4 mese/zi." },
          { id:"s-g-3", name:"BLUE IMPACT 8041", pellet:"4.5 – 12mm", protein:"45%", fat:"20%",
            sizes:[
              { mm:"4.5",  protein:"45%", fat:"20%" },
              { mm:"6.0",  protein:"45%", fat:"20%" },
              { mm:"8.0",  protein:"45%", fat:"20%" },
              { mm:"12.0", protein:"45%", fat:"20%" }
            ],
            longDesc:"Susține creștere constantă pe termen lung cu accent pe masa musculară și calitatea cărnii.",
            comp:"Proteină brută: 45%, Grăsimi: 20%, Cenușă: 7%, Fibre: 2.5%, Fosfor: 1%",
            benefits:["Creștere pe termen lung","Calitate superioară a cărnii","Masă musculară optimă","Conversie eficientă"],
            app:"Pentru sturion >200g. Frecvența: 2-4 mese/zi." },
          { id:"s-g-4", name:"BLUE IMPACT 8044", pellet:"4.5 – 12mm", protein:"45%", fat:"20%",
            sizes:[
              { mm:"4.5",  protein:"45%", fat:"20%" },
              { mm:"6.0",  protein:"45%", fat:"20%" },
              { mm:"8.0",  protein:"45%", fat:"20%" },
              { mm:"12.0", protein:"45%", fat:"20%" }
            ],
            longDesc:"Susține creștere constantă pe termen lung cu accent pe masa musculară și calitatea cărnii.",
            comp:"Proteină brută: 45%, Grăsimi: 20%, Cenușă: 7%, Fibre: 2.5%, Fosfor: 1%",
            benefits:["Creștere pe termen lung","Calitate superioară a cărnii","Masă musculară optimă","Conversie eficientă"],
            app:"Pentru sturion >200g. Frecvența: 2-4 mese/zi." }
        ] },

      // ══ SOMN ══
      { id:"efico-catfish", family:"EFICO (Somn)", species:"catfish", range:"grower",
        desc:"Furaj de creștere pentru somn, cu conversie alimentară eficientă.",
        img:"images/fish-grower-high-performance-efico.webp",
        members:[
          { id:"c-g-1", name:"EFICO 7239F", pellet:"4.5 – 12mm", protein:"40%", fat:"14%",
            sizes:[
              { mm:"4.5",  protein:"40%", fat:"14%" },
              { mm:"6.0",  protein:"40%", fat:"14%" },
              { mm:"8.0",  protein:"40%", fat:"14%" },
              { mm:"12.0", protein:"40%", fat:"14%" }
            ],
            longDesc:"Granule scufundătoare formulate pentru acceptabilitate maximă și digestibilitate excelentă. Reduce risipirea și costurile.",
            comp:"Proteină brută: 40%, Grăsimi: 14%, Cenușă: 8%, Fibre: 3%, Fosfor: 1.1%",
            benefits:["Granule scufundătoare","Conversie eficientă","Risipire redusă","Cost optim"],
            app:"Pentru somn >100g. Frecvența: 2-4 mese/zi." }
        ] }
    ];

    // ─── Pellet parsing & helpers ────────────────────────────────
    function fmtMM(n) { return (Math.round(n * 100) / 100).toString(); }
    function parsePelletRange(s) {
      var nums = (String(s || '').match(/[0-9]+(\.[0-9]+)?/g) || []).map(parseFloat).filter(function (n) { return !isNaN(n); });
      if (!nums.length) return { min: 0, max: 0 };
      return { min: Math.min.apply(null, nums), max: Math.max.apply(null, nums) };
    }
    (function precomputeFamilies() {
      FAMILIES.forEach(function (f) {
        var mins = [], maxs = [];
        f.members.forEach(function (m) {
          var r = parsePelletRange(m.pellet);
          m._pmin = r.min; m._pmax = r.max;
          mins.push(r.min); maxs.push(r.max);
        });
        f._pmin = Math.min.apply(null, mins);
        f._pmax = Math.max.apply(null, maxs);
        if (!f.pelletSpan) {
          f.pelletSpan = (f._pmin === f._pmax) ? (fmtMM(f._pmin) + 'mm') : (fmtMM(f._pmin) + ' – ' + fmtMM(f._pmax) + 'mm');
        }
      });
    })();

    // Canonical BioMar pellet ladder used to populate the pellet-size filter.
    var PELLET_LADDER = [0.35, 0.5, 0.8, 1.1, 1.5, 2.0, 3.0, 4.5, 6.0, 8.0, 12.0];
    function pelletFilterOptions() {
      return PELLET_LADDER.filter(function (v) {
        return FAMILIES.some(function (f) { return f.members.some(function (m) { return v >= m._pmin && v <= m._pmax; }); });
      });
    }
    function familyMatchesPellet(f, v) { return f.members.some(function (m) { return v >= m._pmin && v <= m._pmax; }); }
    function memberMatchesPellet(m, v) { return v >= m._pmin && v <= m._pmax; }

    // Shop URL resolution (member-level URL wins, then range collection, then shop home)
    function shopForMember(f, m) {
      if (m && m.shopUrl) return m.shopUrl;
      if (f && SHOP_COLLECTION_BY_RANGE[f.range]) return SHOP_COLLECTION_BY_RANGE[f.range];
      return SHOP_BASE;
    }
    function shopForFamily(f) {
      if (f.members.length === 1) return shopForMember(f, f.members[0]);
      if (SHOP_COLLECTION_BY_RANGE[f.range]) return SHOP_COLLECTION_BY_RANGE[f.range];
      return SHOP_BASE;
    }

    // ─── Labels & Colors ─────────────────────────────────────────
    var SPECIES = { trout:"Păstrăv", sturgeon:"Sturion", catfish:"Somn" };
    var RANGES = { starter:"Furaj Starter", pregrower:"Furaj Pre-creștere", grower:"Furaj Creștere", broodstock:"Furaj Reproducători" };
    const RANGE_SIZES = { starter:"0.35 – 1.5mm", pregrower:"1.5 – 2mm", grower:"3 – 8mm", broodstock:"6 – 8mm" };
    const RANGE_COLORS = { starter:"#4a9fd4", pregrower:"#4a9fd4", grower:"#4a9fd4", broodstock:"#4a9fd4" };
    const RANGE_ICONS = { starter:"", pregrower:"", grower:"", broodstock:"" };
    const RANGE_IMGS = {
      starter:"images/fry_trout.jpg",
      pregrower:"images/pre_grower_fish.jpg",
      grower:"images/grower_trout.jpg",
      broodstock:"images/broodstock_trout.jpg"
    };
    var RANGE_DESCS = {
      starter:"Diete de start și hrană pentru larviculturi, formulate pentru supraviețuire maximă și creștere uniformă în primele etape de viață.",
      pregrower:"Hrană de transfer și creștere timpurie, optimizată pentru dezvoltare rapidă, conversie eficientă și rezistență.",
      grower:"Hrană de performanță pentru creștere, concepută pentru randament maxim, pigmentare și calitate superioară a fileului.",
      broodstock:"Hrană specializată pentru reproducători, formulată pentru calitatea optimă a icrelor și sănătatea peștilor."
    };
    const SPECIES_COLORS = { trout:"#1a3264", sturgeon:"#5a6a7c", catfish:"#6a7b5f" };
    var SIZES = { small:"Mică (0.35–1.5mm)", medium:"Medie (1.5–3mm)", large:"Mare (3–12mm)" };

    // ─── State ───────────────────────────────────────────────────
    let currentPage = 'home';
    let currentLang = 'ro';
    let pendingRange = null;

    // ─── Navigation ──────────────────────────────────────────────
    var PREFIX = (location.pathname.indexOf('/resurse/') !== -1) ? '../' : '';
    var PAGE_URLS = { home:PREFIX+'index.html', products:PREFIX+'produse.html', calculator:PREFIX+'calculator-hranire.html', resurse:PREFIX+'resurse/index.html', contact:PREFIX+'contact.html' };
    function navigate(page, range) {
      var url = PAGE_URLS[page] || (PREFIX+'index.html');
      if (page === 'products' && range) url += '?range=' + encodeURIComponent(range);
      window.location.href = url;
    }

    function toggleMobileMenu() {
      var menu = document.getElementById('mobileMenu');
      if (menu.style.display === 'flex') {
        menu.style.display = 'none';
      } else {
        menu.style.display = 'flex';
      }
    }

    // ─── Product Filters (family cards) ──────────────────────────
    function buildPelletFilter() {
      var sel = document.getElementById('filterPellet');
      if (!sel) return;
      var cur = sel.value;
      var allLabel = (typeof FILTER_ALL_I18N !== 'undefined' && FILTER_ALL_I18N[currentLang]) ? FILTER_ALL_I18N[currentLang] : 'Toate';
      sel.innerHTML = '<option value="all">' + allLabel + '</option>';
      pelletFilterOptions().forEach(function (v) {
        sel.innerHTML += '<option value="' + v + '">' + fmtMM(v) + ' mm</option>';
      });
      if (cur) sel.value = cur;
    }

    function filterProducts() {
      if (!document.getElementById('productGrid')) return;
      var sf = document.getElementById('filterSpecies').value;
      var rf = document.getElementById('filterRange').value;
      var pelEl = document.getElementById('filterPellet');
      var pf = pelEl ? pelEl.value : 'all';
      var q = document.getElementById('filterSearch').value.toLowerCase();
      var grid = document.getElementById('productGrid');
      var noRes = document.getElementById('noResults');
      var pv = (pf !== 'all') ? parseFloat(pf) : null;

      var filtered = FAMILIES.filter(function (f) {
        if (sf !== 'all' && f.species !== sf) return false;
        if (rf !== 'all' && f.range !== rf) return false;
        if (pv !== null && !familyMatchesPellet(f, pv)) return false;
        if (q) {
          var hit = f.family.toLowerCase().indexOf(q) !== -1 ||
                    f.members.some(function (m) { return m.name.toLowerCase().indexOf(q) !== -1; });
          if (!hit) return false;
        }
        return true;
      });

      if (filtered.length === 0) { grid.innerHTML = ''; noRes.style.display = 'block'; return; }
      noRes.style.display = 'none';

      grid.innerHTML = filtered.map(function (f, i) {
        var count = f.members.length;
        var ro = currentLang === 'ro';
        var countLabel = ro ? (count === 1 ? '1 produs' : count + ' produse') : (count === 1 ? '1 product' : count + ' products');
        var ctaLabel = (count > 1)
          ? (ro ? 'Vezi produsele din gamă' : 'See products in range')
          : (ro ? 'Afișează Mai Multe Detalii' : 'Show More Details');
        var matchBadge = '';
        if (pv !== null) {
          var mc = f.members.filter(function (m) { return memberMatchesPellet(m, pv); }).length;
          matchBadge = '<span style="display:inline-flex;align-items:center;gap:5px;background:rgba(122,184,48,.12);color:#4d7a12;font-weight:700;padding:5px 12px;border-radius:8px;font-size:12px">' +
            '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7ab830" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' +
            fmtMM(pv) + 'mm · ' + mc + '/' + count + '</span>';
        }
        return '' +
        '<div class="card" style="animation:fadeUp .5s ease-out ' + Math.min(i * .06, .4) + 's both;border-radius:16px">' +
          '<div style="display:flex;flex-direction:row;min-height:220px">' +
            '<div style="width:220px;min-width:220px;position:relative;overflow:hidden;border-radius:16px 0 0 16px;background:var(--bg-alt)">' +
              '<img src="' + f.img + '" alt="' + f.family + ' — gamă furaje ' + SPECIES[f.species] + ' BioMar" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;object-position:center">' +
            '</div>' +
            '<div style="flex:1;padding:24px 28px;display:flex;flex-direction:column;justify-content:space-between">' +
              '<div>' +
                '<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px;margin-bottom:12px">' +
                  '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">' +
                    '<span class="tag" style="background:' + RANGE_COLORS[f.range] + '18;color:' + RANGE_COLORS[f.range] + ';font-weight:700;padding:5px 14px;border-radius:8px;font-size:12px">' + RANGES[f.range] + '</span>' +
                    '<span class="tag" style="background:rgba(26,50,100,.06);color:' + SPECIES_COLORS[f.species] + ';padding:5px 14px;border-radius:8px;font-size:12px">🐟 ' + SPECIES[f.species] + '</span>' +
                    matchBadge +
                  '</div>' +
                  '<div style="display:flex;gap:8px">' +
                    '<a href="docs/catalog-produse-biomar-2025.pdf" target="_blank" class="btn btn-outline" style="padding:8px 18px;font-size:13px;border-radius:10px" onclick="event.stopPropagation()" title="Descarcă Catalogul de Produse">' +
                      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>' +
                      'Descarcă' +
                    '</a>' +
                    '<a href="' + shopForFamily(f) + '" target="_blank" rel="noopener" class="btn btn-sky" style="padding:8px 18px;font-size:13px;border-radius:10px" onclick="event.stopPropagation()" title="Cumpără ' + f.family + ' din magazinul online">' +
                      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>' +
                      'Cumpără Acum' +
                    '</a>' +
                  '</div>' +
                '</div>' +
                '<h3 style="font-size:22px;font-weight:700;color:var(--dark);margin-bottom:8px;font-family:\'Playfair Display\',serif">' + f.family + '</h3>' +
                '<p style="font-size:14px;color:var(--text-light);line-height:1.7;margin-bottom:16px">' + f.desc + '</p>' +
              '</div>' +
              '<div>' +
                '<div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:14px">' +
                  '<div style="flex:1;min-width:120px;background:var(--bg);border:1px solid rgba(26,50,100,.08);border-radius:10px;padding:10px 16px;text-align:center">' +
                    '<div style="font-size:11px;color:var(--text-light);font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px">Dimensiune Pelet</div>' +
                    '<div style="font-size:15px;font-weight:700;color:var(--dark)">' + f.pelletSpan + '</div>' +
                  '</div>' +
                  '<div style="flex:1;min-width:100px;background:var(--bg);border:1px solid rgba(26,50,100,.08);border-radius:10px;padding:10px 16px;text-align:center">' +
                    '<div style="font-size:11px;color:var(--text-light);font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px">Produse</div>' +
                    '<div style="font-size:15px;font-weight:700;color:var(--dark)">' + countLabel + '</div>' +
                  '</div>' +
                '</div>' +
                '<div style="cursor:pointer;display:inline-flex;align-items:center;gap:6px;font-size:14px;font-weight:600;color:var(--bio-blue)" onclick="openFamily(\'' + f.id + '\')">' +
                  ctaLabel +
                  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
      }).join('');

      if (window.innerWidth <= 768) {
        grid.querySelectorAll('.card > div').forEach(function (row) {
          row.style.flexDirection = 'column';
          var imgDiv = row.querySelector('div:first-child');
          if (imgDiv) { imgDiv.style.width = '100%'; imgDiv.style.minWidth = '100%'; imgDiv.style.height = '200px'; imgDiv.style.borderRadius = '16px 16px 0 0'; }
        });
      }
    }

    // ─── Product Modal (family → members → detail) ───────────────
    var MODAL_STATE = { family: null };

    function openFamily(id) {
      var f = FAMILIES.find(function (x) { return x.id === id; });
      if (!f) return;
      MODAL_STATE.family = f;
      var img = document.getElementById('modalImg');
      img.src = f.img || (f.members[0] && f.members[0].img) || '';
      img.alt = f.family;
      document.getElementById('modalTags').innerHTML =
        '<span class="tag" style="background:' + RANGE_COLORS[f.range] + '18;color:' + RANGE_COLORS[f.range] + ';font-weight:700;padding:5px 14px;border-radius:8px;font-size:12px">' + RANGES[f.range] + '</span>' +
        '<span class="tag" style="background:rgba(26,50,100,.06);color:' + SPECIES_COLORS[f.species] + ';padding:5px 14px;border-radius:8px;font-size:12px">🐟 ' + SPECIES[f.species] + '</span>';
      var pelEl = document.getElementById('filterPellet');
      var pv = (pelEl && pelEl.value !== 'all') ? parseFloat(pelEl.value) : null;
      if (f.members.length > 1) { showMemberList(f, pv); }
      else { showMemberDetail(f, f.members[0], false); }
      document.getElementById('productModal').classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function showMemberList(f, pv) {
      var ro = currentLang === 'ro';
      document.getElementById('modalTitle').textContent = f.family;
      document.getElementById('modalDesc').innerHTML = f.rangeDesc || f.desc || '';
      var back = document.getElementById('modalBack'); if (back) back.style.display = 'none';
      var detail = document.getElementById('modalDetail'); if (detail) detail.style.display = 'none';
      var list = document.getElementById('modalMemberList'); if (!list) return;
      list.style.display = 'block';
      list.innerHTML =
        '<h4 style="font-size:13px;font-weight:700;color:var(--bio-blue);text-transform:uppercase;letter-spacing:.8px;margin-bottom:14px">' +
          (ro ? ('Produse în gama ' + f.family) : ('Products in the ' + f.family + ' range')) + '</h4>' +
        '<div style="display:flex;flex-direction:column;gap:12px;margin-bottom:28px">' +
        f.members.map(function (m) {
          var match = (pv !== null && memberMatchesPellet(m, pv));
          var badge = match
            ? '<span style="display:inline-flex;align-items:center;gap:5px;background:rgba(122,184,48,.12);color:#4d7a12;font-weight:700;padding:4px 10px;border-radius:7px;font-size:12px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7ab830" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' + fmtMM(pv) + 'mm</span>'
            : '';
          return '<div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;background:#f8fafb;border:1px solid rgba(26,50,100,.08);border-radius:14px;padding:16px 18px' + (match ? ';outline:2px solid rgba(122,184,48,.35)' : '') + '">' +
              '<div style="flex:1;min-width:180px">' +
                '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:4px">' +
                  '<span style="font-size:16px;font-weight:700;color:var(--dark)">' + m.name + '</span>' + badge +
                '</div>' +
                '<div style="font-size:13px;color:var(--text-light)"><strong>' + (ro ? 'Pelet:' : 'Pellet:') + '</strong> ' + m.pellet +
                  (m.protein ? (' &nbsp;·&nbsp; <strong>' + (ro ? 'Proteină:' : 'Protein:') + '</strong> ' + m.protein) : '') + '</div>' +
              '</div>' +
              '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
                '<button class="btn btn-outline" style="padding:8px 16px;font-size:13px;border-radius:10px" onclick="openMember(\'' + f.id + '\',\'' + m.id + '\')">' +
                  (ro ? 'Detalii' : 'Details') +
                  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>' +
                '</button>' +
                '<a href="' + shopForMember(f, m) + '" target="_blank" rel="noopener" class="btn btn-sky" style="padding:8px 16px;font-size:13px;border-radius:10px">' +
                  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>' +
                  (ro ? 'Cumpără' : 'Buy') +
                '</a>' +
              '</div>' +
            '</div>';
        }).join('') +
        '</div>';
    }

    function openMember(fid, mid) {
      var f = FAMILIES.find(function (x) { return x.id === fid; });
      if (!f) return;
      var m = f.members.find(function (x) { return x.id === mid; });
      if (!m) return;
      MODAL_STATE.family = f;
      showMemberDetail(f, m, f.members.length > 1);
    }

    function renderSizesTable(sizes) {
      var ro = currentLang === 'ro';
      var head = '<tr>' +
        '<th style="text-align:left;padding:8px 12px;font-size:12px;text-transform:uppercase;letter-spacing:.5px;color:var(--bio-blue)">' + (ro ? 'Pelet' : 'Pellet') + '</th>' +
        '<th style="text-align:left;padding:8px 12px;font-size:12px;text-transform:uppercase;letter-spacing:.5px;color:var(--bio-blue)">' + (ro ? 'Proteină' : 'Protein') + '</th>' +
        '<th style="text-align:left;padding:8px 12px;font-size:12px;text-transform:uppercase;letter-spacing:.5px;color:var(--bio-blue)">' + (ro ? 'Grăsime' : 'Fat') + '</th>' +
        '</tr>';
      var rows = sizes.map(function (s) {
        return '<tr style="border-top:1px solid rgba(26,50,100,.08)">' +
          '<td style="padding:8px 12px;font-size:14px;font-weight:700;color:var(--dark)">' + s.mm + ' mm</td>' +
          '<td style="padding:8px 12px;font-size:14px;color:var(--text)">' + (s.protein || '—') + '</td>' +
          '<td style="padding:8px 12px;font-size:14px;color:var(--text)">' + (s.fat || '—') + '</td>' +
        '</tr>';
      }).join('');
      return '<h4 style="font-size:13px;font-weight:700;color:var(--bio-blue);text-transform:uppercase;letter-spacing:.8px;margin-bottom:12px">' +
        (ro ? 'Dimensiuni & profil nutrițional' : 'Sizes & nutritional profile') + '</h4>' +
        '<div style="overflow-x:auto;background:var(--bg-alt);border-radius:16px;padding:8px 8px;margin-bottom:28px">' +
          '<table style="width:100%;border-collapse:collapse">' + head + rows + '</table>' +
        '</div>';
    }

    function showMemberDetail(f, m, canBack) {
      document.getElementById('modalTitle').textContent = m.name;
      // Single-product ranges (no member list) show the full range description up top.
      document.getElementById('modalDesc').innerHTML = (!canBack && f.rangeDesc) ? f.rangeDesc : (m.longDesc || f.longDesc || f.desc || '');
      document.getElementById('modalComp').innerHTML = m.comp || '';
      document.getElementById('modalApp').innerHTML = m.app || '';
      document.getElementById('modalPellet').innerHTML = '<strong>Dimensiune granulă:</strong> ' + m.pellet;

      var sizesEl = document.getElementById('modalSizes');
      if (sizesEl) {
        if (m.sizes && m.sizes.length) { sizesEl.style.display = 'block'; sizesEl.innerHTML = renderSizesTable(m.sizes); }
        else { sizesEl.style.display = 'none'; sizesEl.innerHTML = ''; }
      }

      document.getElementById('modalBenefits').innerHTML = (m.benefits || []).map(function (b) {
        return '<div style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:#f8fafb;border-radius:12px;border:1px solid rgba(26,50,100,.06)">' +
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7ab830" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' +
          '<span style="font-size:14px;color:var(--text);font-weight:500">' + b + '</span>' +
        '</div>';
      }).join('');

      var buyLink = document.getElementById('modalBuyLink');
      if (buyLink) { buyLink.href = shopForMember(f, m); buyLink.title = 'Cumpără ' + m.name + ' din magazinul online'; }

      var back = document.getElementById('modalBack');
      if (back) back.style.display = canBack ? 'inline-flex' : 'none';
      var list = document.getElementById('modalMemberList'); if (list) list.style.display = 'none';
      var detail = document.getElementById('modalDetail'); if (detail) detail.style.display = 'block';
    }

    function modalBack() {
      if (!MODAL_STATE.family) return;
      var pelEl = document.getElementById('filterPellet');
      var pv = (pelEl && pelEl.value !== 'all') ? parseFloat(pelEl.value) : null;
      showMemberList(MODAL_STATE.family, pv);
    }

    function closeModal() {
      document.getElementById('productModal').classList.remove('active');
      document.body.style.overflow = '';
    }

    // ─── Resurse Section ───────────────────────────────────────
    var RESOURCE_CATEGORIES = [
      { id:'furajare', icon:'🐟', color:'var(--sky-blue)', title:'Furajare Păstrăv', desc:'Ghiduri despre tipurile de furaj, dimensiunea peletului și hrănirea corectă a păstrăvului.', articles:['furaj-pastrav','hranire-pastrav-temperatura','dimensiuni-granule-pastrav'] },
      { id:'hatchery', icon:'🥚', color:'#4a9fd4', title:'Hatchery & Puiet', desc:'Nutriția în faza de incubator și puiet — furaj de start și protocoale de hrănire.', articles:['furaj-hatchery-pastrav'] },
      { id:'fcr', icon:'📊', color:'var(--accent-green)', title:'FCR & Performanță', desc:'Cum măsori și optimizezi conversia furajului pentru costuri de producție mai mici.', articles:['fcr-pastrav'] },
      { id:'management', icon:'🏭', color:'#8a6abf', title:'Management Fermă', desc:'Furajarea în sisteme flow-through și RAS, pentru eficiență și calitatea apei.', articles:['furaj-flow-through','furaj-ras'] },
      { id:'temperatura', icon:'🌡️', color:'#d4850a', title:'Temperatură & Oxigen', desc:'Cum influențează temperatura apei și oxigenul dizolvat hrănirea și creșterea.', articles:['hranire-pastrav-temperatura','oxigen-si-conversia-furajului'] },
      { id:'sisteme', icon:'🔄', color:'var(--bio-blue)', title:'Sisteme Flow-Through & RAS', desc:'Particularitățile furajării în sistemele de creștere moderne.', articles:['furaj-flow-through','furaj-ras'] }
    ];

    var RESOURCE_ARTICLES = [
      { slug:'furaj-pastrav', title:'Furaj Păstrăv: Ghid Complet', desc:'Gama completă de furaje BioMar pentru păstrăv, pe etape de creștere.', img:'images/grower_trout.jpg', category:'furajare' },
      { slug:'hranire-pastrav-temperatura', title:'Hrănirea Păstrăvului în Funcție de Temperatură', desc:'Ajustarea rației și a frecvenței de hrănire în funcție de temperatura apei.', img:'images/fish_farm2.jpg', category:'temperatura' },
      { slug:'fcr-pastrav', title:'FCR Păstrăv: Optimizarea Conversiei', desc:'Ce este FCR, ce îl influențează și cum reduci costul pe kilogram de pește.', img:'images/productie_furaj.jpg', category:'fcr' },
      { slug:'furaj-hatchery-pastrav', title:'Furaj pentru Hatchery și Puiet', desc:'Furajul de start și protocolul de hrănire pentru puiet sănătos și uniform.', img:'images/fry_trout_v2.jpg', category:'hatchery' },
      { slug:'dimensiuni-granule-pastrav', title:'Dimensiunea Granulelor: Ghid Complet', desc:'Cum alegi dimensiunea peletului în funcție de greutatea peștelui.', img:'images/products_image.jpg', category:'furajare' },
      { slug:'furaj-flow-through', title:'Furajare în Sisteme Flow-Through', desc:'Alegerea și administrarea furajului în păstrăvăriile cu debit continuu.', img:'images/home-page.jpg', category:'sisteme' },
      { slug:'furaj-ras', title:'Furajare în Sisteme RAS', desc:'Furaje cu emisii reduse și stabilitate ridicată pentru sistemele de recirculare.', img:'images/productie_furaj.jpg', category:'sisteme' },
      { slug:'oxigen-si-conversia-furajului', title:'Oxigen și Impactul asupra FCR', desc:'Cum influențează oxigenul dizolvat conversia furajului și strategiile de aerare.', img:'images/fish_farm2.jpg', category:'temperatura' }
    ];

    function navigateArticle(slug) { var pre = (location.pathname.indexOf('/resurse/') !== -1) ? '../' : ''; window.location.href = pre + 'resurse/' + slug + '.html'; }

    function renderRelatedArticles(currentSlug) {
      var CAT_LABELS = {furajare:'Furajare',hatchery:'Hatchery',fcr:'FCR',management:'Management',temperatura:'Temperatură',sisteme:'Sisteme'};
      var related = RESOURCE_ARTICLES.filter(function(a) { return a.slug !== currentSlug; }).slice(0, 3);
      var containers = document.querySelectorAll('[id^="related-"]');
      containers.forEach(function(container) {
        container.innerHTML = related.map(function(a) {
          return '<a class="article-card" onclick="navigateArticle(\'' + a.slug + '\')" style="cursor:pointer">' +
            '<div class="article-card-img"><img src="' + a.img + '" alt="' + a.title + '"></div>' +
            '<div class="article-card-body">' +
              '<div style="font-size:11px;font-weight:600;color:var(--sky-blue);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">' + (CAT_LABELS[a.category] || 'Resurse') + '</div>' +
              '<h3 style="font-size:16px;font-weight:700;color:var(--dark);margin-bottom:6px;line-height:1.3">' + a.title + '</h3>' +
              '<p style="font-size:13px;color:var(--text-light);line-height:1.6">' + a.desc + '</p>' +
            '</div></a>';
        }).join('');
      });
    }

    function buildResourceCategoryGrid() {
      var grid = document.getElementById('resourceCategoryGrid');
      if (!grid) return;
      grid.innerHTML = RESOURCE_CATEGORIES.map(function(cat) {
        return '<div class="resource-category-card" onclick="navigateArticle(\'' + cat.articles[0] + '\')">' +
          '<div class="rcc-icon" style="background:' + cat.color + '15">' + cat.icon + '</div>' +
          '<h3 style="font-size:18px;font-weight:700;color:var(--dark);margin-bottom:6px">' + cat.title + '</h3>' +
          '<p style="font-size:13px;color:var(--text-light);line-height:1.6;margin-bottom:12px">' + cat.desc + '</p>' +
          '<div class="rcc-arrow" style="font-size:14px;font-weight:600;display:flex;align-items:center;gap:4px">Citește mai mult <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>' +
        '</div>';
      }).join('');
    }

    function buildFeaturedArticlesGrid() {
      var grid = document.getElementById('featuredArticlesGrid');
      if (!grid) return;
      grid.innerHTML = RESOURCE_ARTICLES.slice(0, 6).map(function(a) {
        return '<a class="article-card" onclick="navigateArticle(\'' + a.slug + '\')" style="cursor:pointer">' +
          '<div class="article-card-img"><img src="' + a.img + '" alt="' + a.title + '"></div>' +
          '<div class="article-card-body">' +
            '<h3 style="font-size:16px;font-weight:700;color:var(--dark);margin-bottom:6px;line-height:1.3">' + a.title + '</h3>' +
            '<p style="font-size:13px;color:var(--text-light);line-height:1.6">' + a.desc + '</p>' +
          '</div></a>';
      }).join('');
    }

    function toggleFaq(btn) {
      var answer = btn.nextElementSibling;
      var isOpen = btn.classList.contains('open');
      // Close all FAQs in the same container
      var container = btn.closest('article') || btn.closest('section') || document.body;
      container.querySelectorAll('.faq-question').forEach(function(q) { q.classList.remove('open'); });
      container.querySelectorAll('.faq-answer').forEach(function(a) { a.classList.remove('open'); });
      if (!isOpen) {
        btn.classList.add('open');
        answer.classList.add('open');
      }
    }

    // ─── BioMar Feeding Calculator ─────────────────────────────
    // Data source: Official BioMar feeding guides (Romania)
    // Values = kg feed per 100 kg fish per day
    // Temperatures: 4,6,8,10,12,14,16,18,20 °C

    var BIOMAR_PRODUCTS = [
      {
        name: "INICIO Plus",
        pellets: "0.35 – 2.0mm",
        rows: [
          { wMin:0.1, wMax:0.3, pellet:"0.35mm", rates:[1.19,1.79,2.37,2.91,3.37,3.66,3.73,3.51,2.84] },
          { wMin:0.3, wMax:0.5, pellet:"0.5mm",  rates:[1.11,1.67,2.21,2.72,3.14,3.42,3.49,3.27,2.65] },
          { wMin:0.5, wMax:1,   pellet:"0.8mm",  rates:[1.04,1.56,2.07,2.55,2.94,3.20,3.26,3.06,2.48] },
          { wMin:1,   wMax:3,   pellet:"1.1mm",  rates:[0.93,1.40,1.85,2.27,2.63,2.86,2.91,2.73,2.22] },
          { wMin:3,   wMax:8,   pellet:"1.5mm",  rates:[0.78,1.17,1.55,1.91,2.21,2.40,2.45,2.30,1.86] },
          { wMin:8,   wMax:15,  pellet:"1.5mm",  rates:[0.68,1.02,1.35,1.66,1.91,2.08,2.12,1.99,1.61] },
          { wMin:15,  wMax:20,  pellet:"2.0mm",  rates:[0.64,0.96,1.27,1.57,1.81,1.97,2.01,1.88,1.53] },
          { wMin:20,  wMax:30,  pellet:"2.0mm",  rates:[0.59,0.88,1.17,1.44,1.66,1.81,1.84,1.73,1.40] },
          { wMin:30,  wMax:50,  pellet:"2.0mm",  rates:[0.53,0.80,1.06,1.30,1.50,1.63,1.67,1.56,1.27] }
        ]
      },
      {
        name: "INICIO 918",
        pellets: "1.5 – 2.0mm",
        rows: [
          { wMin:3,   wMax:8,   pellet:"1.5mm",  rates:[0.82,1.23,1.63,2.01,2.32,2.52,2.57,2.42,1.96] },
          { wMin:8,   wMax:15,  pellet:"1.5mm",  rates:[0.71,1.07,1.41,1.73,2.00,2.18,2.22,2.09,1.69] },
          { wMin:15,  wMax:20,  pellet:"2.0mm",  rates:[0.67,1.01,1.34,1.65,1.90,2.07,2.11,1.98,1.61] },
          { wMin:20,  wMax:30,  pellet:"2.0mm",  rates:[0.62,0.93,1.23,1.51,1.74,1.90,1.93,1.81,1.47] },
          { wMin:30,  wMax:50,  pellet:"2.0mm",  rates:[0.56,0.84,1.11,1.36,1.57,1.71,1.74,1.63,1.32] }
        ]
      },
      {
        name: "INICIO 702",
        pellets: "2.0mm",
        rows: [
          { wMin:15,  wMax:20,  pellet:"2.0mm",  rates:[0.73,1.10,1.46,1.79,2.07,2.25,2.30,2.15,1.75] },
          { wMin:20,  wMax:30,  pellet:"2.0mm",  rates:[0.67,1.00,1.33,1.63,1.89,2.05,2.09,1.96,1.59] },
          { wMin:30,  wMax:50,  pellet:"2.0mm",  rates:[0.60,0.90,1.19,1.46,1.69,1.84,1.88,1.76,1.43] }
        ]
      },
      {
        name: "EFICO Alpha 790",
        pellets: "3.0 – 6.0mm",
        rows: [
          { wMin:50,   wMax:60,   pellet:"3.0mm", rates:[0.49,0.74,0.98,1.21,1.40,1.52,1.55,1.45,1.18] },
          { wMin:60,   wMax:80,   pellet:"3.0mm", rates:[0.49,0.73,0.97,1.19,1.38,1.50,1.53,1.43,1.16] },
          { wMin:80,   wMax:100,  pellet:"3.0mm", rates:[0.48,0.72,0.95,1.17,1.35,1.47,1.50,1.41,1.14] },
          { wMin:100,  wMax:200,  pellet:"4.5mm", rates:[0.45,0.68,0.91,1.11,1.29,1.40,1.43,1.34,1.08] },
          { wMin:200,  wMax:300,  pellet:"4.5mm", rates:[0.42,0.64,0.85,1.04,1.20,1.31,1.33,1.25,1.01] },
          { wMin:300,  wMax:450,  pellet:"4.5mm", rates:[0.40,0.60,0.79,0.97,1.12,1.22,1.24,1.17,0.95] },
          { wMin:450,  wMax:600,  pellet:"6.0mm", rates:[0.37,0.56,0.75,0.92,1.06,1.15,1.17,1.10,0.89] },
          { wMin:600,  wMax:800,  pellet:"6.0mm", rates:[0.35,0.52,0.69,0.85,0.98,1.07,1.09,1.02,0.83] },
          { wMin:800,  wMax:1000, pellet:"6.0mm", rates:[0.32,0.48,0.64,0.78,0.91,0.99,1.00,0.94,0.76] }
        ]
      },
      {
        name: "EFICO Alpha 790 FT",
        pellets: "3.0 – 6.0mm",
        rows: [
          { wMin:50,   wMax:60,   pellet:"3.0mm", rates:[0.51,0.77,1.02,1.25,1.45,1.57,1.60,1.50,1.22] },
          { wMin:60,   wMax:80,   pellet:"3.0mm", rates:[0.50,0.76,1.00,1.23,1.42,1.55,1.58,1.48,1.20] },
          { wMin:80,   wMax:100,  pellet:"3.0mm", rates:[0.49,0.74,0.98,1.21,1.39,1.52,1.55,1.45,1.18] },
          { wMin:100,  wMax:200,  pellet:"4.5mm", rates:[0.47,0.70,0.93,1.15,1.33,1.44,1.47,1.38,1.12] },
          { wMin:200,  wMax:300,  pellet:"4.5mm", rates:[0.44,0.66,0.87,1.07,1.24,1.35,1.37,1.29,1.04] },
          { wMin:300,  wMax:450,  pellet:"4.5mm", rates:[0.41,0.61,0.81,1.00,1.15,1.25,1.28,1.20,0.97] },
          { wMin:450,  wMax:600,  pellet:"6.0mm", rates:[0.39,0.58,0.77,0.95,1.10,1.19,1.22,1.14,0.92] },
          { wMin:600,  wMax:800,  pellet:"6.0mm", rates:[0.36,0.54,0.71,0.88,1.01,1.10,1.13,1.06,0.86] },
          { wMin:800,  wMax:1000, pellet:"6.0mm", rates:[0.33,0.50,0.66,0.81,0.94,1.02,1.04,0.97,0.79] }
        ]
      },
      {
        name: "EFICO Alpha 756",
        pellets: "3.0 – 8.0mm",
        rows: [
          { wMin:50,   wMax:60,   pellet:"3.0mm", rates:[0.54,0.81,1.07,1.32,1.52,1.66,1.69,1.58,1.28] },
          { wMin:60,   wMax:80,   pellet:"3.0mm", rates:[0.53,0.79,1.05,1.29,1.49,1.63,1.66,1.56,1.26] },
          { wMin:80,   wMax:100,  pellet:"3.0mm", rates:[0.52,0.78,1.03,1.27,1.46,1.59,1.62,1.52,1.23] },
          { wMin:100,  wMax:200,  pellet:"4.5mm", rates:[0.49,0.74,0.98,1.21,1.40,1.52,1.55,1.45,1.18] },
          { wMin:200,  wMax:300,  pellet:"4.5mm", rates:[0.46,0.69,0.91,1.12,1.30,1.41,1.44,1.35,1.09] },
          { wMin:300,  wMax:450,  pellet:"4.5mm", rates:[0.43,0.64,0.85,1.04,1.20,1.31,1.34,1.25,1.02] },
          { wMin:450,  wMax:600,  pellet:"6.0mm", rates:[0.40,0.60,0.80,0.98,1.14,1.24,1.26,1.18,0.96] },
          { wMin:600,  wMax:800,  pellet:"6.0mm", rates:[0.37,0.56,0.74,0.91,1.05,1.14,1.16,1.09,0.89] },
          { wMin:800,  wMax:1000, pellet:"6.0mm", rates:[0.34,0.51,0.68,0.84,0.97,1.05,1.07,1.01,0.82] },
          { wMin:1000, wMax:1400, pellet:"8.0mm", rates:[0.31,0.47,0.62,0.76,0.88,0.96,0.97,0.91,0.74] },
          { wMin:1400, wMax:2000, pellet:"8.0mm", rates:[0.26,0.39,0.52,0.64,0.74,0.80,0.82,0.77,0.62] },
          { wMin:2000, wMax:3000, pellet:"8.0mm", rates:[0.20,0.30,0.40,0.49,0.57,0.62,0.63,0.59,0.48] }
        ]
      },
      {
        name: "EFICO Enviro 920",
        pellets: "3.0 – 8.0mm",
        rows: [
          { wMin:50,   wMax:60,   pellet:"3.0mm", rates:[0.47,0.70,0.93,1.14,1.32,1.43,1.46,1.37,1.11] },
          { wMin:60,   wMax:80,   pellet:"3.0mm", rates:[0.46,0.69,0.91,1.12,1.30,1.41,1.44,1.35,1.10] },
          { wMin:80,   wMax:100,  pellet:"3.0mm", rates:[0.45,0.68,0.90,1.11,1.28,1.39,1.42,1.33,1.08] },
          { wMin:100,  wMax:200,  pellet:"4.5mm", rates:[0.43,0.65,0.86,1.06,1.23,1.34,1.36,1.28,1.04] },
          { wMin:200,  wMax:300,  pellet:"4.5mm", rates:[0.41,0.61,0.81,1.00,1.15,1.25,1.28,1.20,0.97] },
          { wMin:300,  wMax:450,  pellet:"4.5mm", rates:[0.38,0.57,0.76,0.93,1.08,1.17,1.19,1.12,0.91] },
          { wMin:450,  wMax:600,  pellet:"6.0mm", rates:[0.36,0.54,0.71,0.87,1.01,1.10,1.12,1.05,0.85] },
          { wMin:600,  wMax:800,  pellet:"6.0mm", rates:[0.33,0.50,0.66,0.81,0.94,1.02,1.04,0.98,0.79] },
          { wMin:800,  wMax:1000, pellet:"6.0mm", rates:[0.31,0.46,0.61,0.75,0.87,0.94,0.96,0.90,0.73] },
          { wMin:1000, wMax:1400, pellet:"8.0mm", rates:[0.28,0.42,0.56,0.69,0.79,0.86,0.88,0.83,0.67] },
          { wMin:1400, wMax:2000, pellet:"8.0mm", rates:[0.24,0.36,0.47,0.58,0.67,0.73,0.74,0.70,0.57] },
          { wMin:2000, wMax:3000, pellet:"8.0mm", rates:[0.18,0.27,0.36,0.45,0.52,0.56,0.57,0.54,0.43] }
        ]
      }
    ];

    var CALC_TEMPS = [4,6,8,10,12,14,16,18,20];

    function calcShowProducts() {
      var weight = parseFloat(document.getElementById('calcWeight').value);
      var temp = parseFloat(document.getElementById('calcTemp').value);
      var count = parseInt(document.getElementById('calcCount').value);
      if (!weight || weight < 0.1 || !temp || !count) return;

      document.getElementById('calcWeightDisplay').textContent = weight + 'g';
      document.getElementById('calcTempDisplay').textContent = temp + '°C';

      // Find matching products
      var matches = [];
      BIOMAR_PRODUCTS.forEach(function(prod) {
        prod.rows.forEach(function(row) {
          if (weight >= row.wMin && weight < row.wMax) {
            matches.push({ product: prod, row: row });
          }
        });
      });

      var list = document.getElementById('calcProductList');
      var noProds = document.getElementById('calcNoProducts');

      if (matches.length === 0) {
        list.innerHTML = '';
        noProds.style.display = 'block';
      } else {
        noProds.style.display = 'none';
        // Interpolate rate for preview
        var tempIdx = calcTempIndex(temp);
        list.innerHTML = matches.map(function(m) {
          var rate = calcInterpolate(m.row.rates, temp);
          var dailyPerFish = (weight * rate / 100);
          return '<div style="border:2px solid rgba(26,50,100,.1);border-radius:14px;padding:20px 24px;cursor:pointer;transition:all .2s;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px" ' +
            'onmouseover="this.style.borderColor=\'var(--sky-blue)\';this.style.background=\'var(--bg-alt)\'" ' +
            'onmouseout="this.style.borderColor=\'rgba(26,50,100,.1)\';this.style.background=\'#fff\'" ' +
            'onclick="calcSelectProduct(\'' + m.product.name + '\',' + m.row.wMin + ',' + m.row.wMax + ')">' +
            '<div>' +
              '<div style="font-size:17px;font-weight:700;color:var(--dark)">' + m.product.name + '</div>' +
              '<div style="font-size:13px;color:var(--text-light);margin-top:4px">Pelet: ' + m.row.pellet + ' · Interval: ' + m.row.wMin + '–' + m.row.wMax + 'g</div>' +
            '</div>' +
            '<div style="text-align:right">' +
              '<div style="font-size:22px;font-weight:800;color:var(--bio-blue)">' + rate.toFixed(2) + '</div>' +
              '<div style="font-size:11px;color:var(--text-light)">kg/100kg/zi</div>' +
            '</div>' +
          '</div>';
        }).join('');
      }

      document.getElementById('calcStep1').style.display = 'none';
      document.getElementById('calcStep2').style.display = 'block';
      document.getElementById('calcStep3').style.display = 'none';
    }

    function calcSelectProduct(productName, wMin, wMax) {
      var weight = parseFloat(document.getElementById('calcWeight').value);
      var temp = parseFloat(document.getElementById('calcTemp').value);
      var count = parseInt(document.getElementById('calcCount').value);

      // Find the product and row
      var product = null, row = null;
      BIOMAR_PRODUCTS.forEach(function(p) {
        if (p.name === productName) {
          product = p;
          p.rows.forEach(function(r) {
            if (r.wMin === wMin && r.wMax === wMax) row = r;
          });
        }
      });
      if (!product || !row) return;

      var rate = calcInterpolate(row.rates, temp);
      var dailyPerFish = weight * rate / 100; // grams
      var biomassKg = count * weight / 1000;
      var totalDailyKg = biomassKg * rate / 100;
      var monthlyKg = totalDailyKg * 30;

      document.getElementById('calcProductName').textContent = product.name;
      document.getElementById('resRate').textContent = rate.toFixed(2);
      document.getElementById('resPerFish').textContent = dailyPerFish < 1 ? dailyPerFish.toFixed(2) : dailyPerFish.toFixed(1);
      document.getElementById('resTotal').textContent = totalDailyKg < 10 ? totalDailyKg.toFixed(2) : totalDailyKg.toFixed(1);

      var monthlyDisplay = monthlyKg >= 1000 ? (monthlyKg / 1000).toFixed(1) : Math.round(monthlyKg);
      var monthlyUnit = monthlyKg >= 1000 ? 'tone' : 'kg';
      document.getElementById('resMonthly').textContent = monthlyDisplay;
      document.getElementById('resMonthlyUnit').textContent = monthlyUnit;

      document.getElementById('resPellet').textContent = row.pellet;
      document.getElementById('resBiomass').textContent = biomassKg >= 1000 ? (biomassKg / 1000).toFixed(1) + ' tone' : biomassKg.toFixed(0) + ' kg';
      document.getElementById('resWeightRange').textContent = row.wMin + ' – ' + row.wMax + 'g';
      document.getElementById('resProductCta').textContent = product.name;

      document.getElementById('calcStep1').style.display = 'none';
      document.getElementById('calcStep2').style.display = 'none';
      document.getElementById('calcStep3').style.display = 'block';
    }

    function calcBack(step) {
      document.getElementById('calcStep1').style.display = step === 1 ? 'block' : 'none';
      document.getElementById('calcStep2').style.display = step === 2 ? 'block' : 'none';
      document.getElementById('calcStep3').style.display = 'none';
      if (step === 2) calcShowProducts();
    }

    // Interpolate feeding rate between temperature columns
    function calcInterpolate(rates, temp) {
      if (temp <= CALC_TEMPS[0]) return rates[0];
      if (temp >= CALC_TEMPS[CALC_TEMPS.length - 1]) return rates[rates.length - 1];
      for (var i = 0; i < CALC_TEMPS.length - 1; i++) {
        if (temp >= CALC_TEMPS[i] && temp <= CALC_TEMPS[i + 1]) {
          var t0 = CALC_TEMPS[i], t1 = CALC_TEMPS[i + 1];
          var r0 = rates[i], r1 = rates[i + 1];
          var frac = (temp - t0) / (t1 - t0);
          return r0 + (r1 - r0) * frac;
        }
      }
      return rates[Math.floor(rates.length / 2)];
    }

    function calcTempIndex(temp) {
      var closest = 0, minDiff = 999;
      CALC_TEMPS.forEach(function(t, i) {
        if (Math.abs(t - temp) < minDiff) { minDiff = Math.abs(t - temp); closest = i; }
      });
      return closest;
    }

    // ─── Contact Form ────────────────────────────────────────────


    // ─── Language Toggle — Full Translation System ─────────────
    const LANG = {
      ro: {
        // Nav
        'nav-home':'Acasă', 'nav-products':'Produse', 'nav-calculator':'Calculator Hrănire', 'nav-resurse':'Resurse', 'nav-contact':'Contact',
        'mnav-home':'Acasă', 'mnav-products':'Produse', 'mnav-calculator':'Calculator Hrănire', 'mnav-resurse':'Resurse', 'mnav-contact':'Contact',
        'navShopLabel':'Magazin Online',
        // Hero
        'heroTitle':'Furaje Premium pentru Păstrăv, Sturion și Somn',
        'heroDesc':'Distribuitor oficial BioMar în România. Furaje premium cu conversie alimentară excelentă, livrare în toată țara și suport tehnic pentru fermele piscicole.',
        'heroCta':'Descoperă Produsele', 'heroShop':'Magazin Online',
        // Why Us
        'whyTitle':'De Ce Aquafeed Distribution?',
        'whyP1':'Mai mult decât un furnizor de furaje — un partener real pentru acvacultură.',
        'whyP2':'Cu peste 15 ani de experiență pe piața din România, înțelegem de ce au nevoie fermierii piscicoli: rezultate constante, calitate sigură, suport tehnic și livrări de încredere.',
        'whyP3':'Prin parteneriatul nostru cu BioMar, aducem în România soluții de furajare de clasă mondială, susținute de cunoștințe locale și experiență practică în ferme.',
        'whyP4':'Ajutăm fermele să crească mai eficient, să performeze mai bine și să planifice cu încredere.',
        'whyP5':'Aquafeed Distribution — calitate globală, expertiză locală.',
        'stat1':'Ani de Parteneriat', 'stat2':'Specii Deservite', 'stat3':'Fermieri Parteneri', 'stat4':'Țări BioMar',
        // Ranges
        'rangesTitle':'Game de Produse',
        'rangesSubtitle':'Soluții nutritive complete pentru fiecare etapă de creștere — apasă pentru a explora',
        // Photos
        'photo1':'Apă curată, pești sănătoși', 'photo2':'Mediu natural ideal', 'photo3':'Logistică fiabilă',
        // CTA
        'ctaTitle':'Pregătit să-ți optimizezi ferma?', 'ctaContact':'Contactează Echipa', 'ctaShop':'Cumpără Acum',
        // Products
        'prodTitle':'Catalogul de Produse', 'prodSubtitle':'Explorează gama completă de hrană BioMar disponibilă în România',
        'filterSpeciesLabel':'Specie', 'filterRangeLabel':'Gamă', 'filterSizeLabel':'Dimensiune pelet (mm)', 'filterSearchLabel':'Caută produs',
        'noResults':'Nu s-au găsit produse cu filtrele selectate.',
        // Calculator
        'calcTitle':'Calculator de Hrănire',
        'calcSubtitle':'Instrumentul BioMar de calcul al rațiilor — integrat direct pentru confortul tău.',
        'calcNote':'Dacă instrumentul nu se încarcă, îl poți accesa direct:',
        'calcOpenBtn':'Deschide Feeding Tool',
        'calcDisclaimer':'Acest instrument este furnizat de BioMar. Rezultatele sunt orientative și trebuie adaptate condițiilor specifice fermei tale.',
        // Contact
        'contactSubtitle':'Suntem la dispoziția ta pentru orice întrebare legată de hrană pentru acvacultură.',
        'contactInfoTitle':'Informații de Contact',
        'mapNote':'Deservim fermieri din toată România',
        'formTitle':'Contactează-ne', 'formSubtitle':'Suntem aici să te ajutăm să găsești soluția potrivită pentru ferma ta.',
        'submitText':'Trimite Mesajul',
        // Modal
        'modalCompLabel':'Compoziție', 'modalAppLabel':'Aplicare', 'modalBenLabel':'Beneficii',
        'modalDsLabel':'Fișă Tehnică', 'modalBuyLabel':'Cumpără Acum',
        // Footer
        'footerDesc':'Partener BioMar în România. Hrană premium pentru acvacultură.',
        'footerLinksTitle':'Linkuri Utile', 'footerRights':'Toate drepturile rezervate.',
        'flink-home':'Acasă', 'flink-products':'Produse', 'flink-calculator':'Calculator Hrănire', 'flink-resurse':'Resurse', 'flink-contact':'Contact',
        'flink-catalog':'Catalog Produse (PDF)', 'ctaCatalogText':'Descarcă Catalogul',
        'flink-cookies':'Politica de cookie-uri', 'flink-cookie-settings':'Setări cookies',
        'catalogBannerTitle':'Catalogul Complet de Produse BioMar', 'catalogBannerDesc':'Descarcă catalogul PDF cu toate produsele și specificațiile tehnice', 'catalogBannerBtn':'Descarcă Catalogul (PDF)',
      },
      en: {
        'nav-home':'Home', 'nav-products':'Products', 'nav-calculator':'Feeding Calculator', 'nav-resurse':'Resources', 'nav-contact':'Contact',
        'mnav-home':'Home', 'mnav-products':'Products', 'mnav-calculator':'Feeding Calculator', 'mnav-resurse':'Resources', 'mnav-contact':'Contact',
        'navShopLabel':'Online Shop',
        'heroTitle':'Premium Feed for Trout, Sturgeon & Catfish',
        'heroDesc':'Official BioMar distributor in Romania. Premium fish feed with excellent feed conversion, nationwide delivery, and dedicated technical support for fish farms.',
        'heroCta':'Discover Products', 'heroShop':'Online Shop',
        'whyTitle':'Why Aquafeed Distribution?',
        'whyP1':'More than a feed supplier — a real aquaculture partner.',
        'whyP2':'With over 15 years of experience on the Romanian market, we understand what fish farmers need: consistent results, reliable quality, technical support, and dependable deliveries.',
        'whyP3':'Through our partnership with BioMar, we bring world-class feeding solutions to Romania, backed by local knowledge and practical farm experience.',
        'whyP4':'We help farms grow more efficiently, perform better, and plan with confidence.',
        'whyP5':'Aquafeed Distribution — global quality, local expertise.',
        'stat1':'Years of Partnership', 'stat2':'Species Served', 'stat3':'Partner Farms', 'stat4':'BioMar Countries',
        'rangesTitle':'Product Ranges',
        'rangesSubtitle':'Complete nutritional solutions for every growth stage — click to explore',
        'photo1':'Clean water, healthy fish', 'photo2':'Ideal natural environment', 'photo3':'Reliable logistics',
        'ctaTitle':'Ready to optimize your farm?', 'ctaContact':'Contact Our Team', 'ctaShop':'Shop Now',
        'prodTitle':'Product Catalogue', 'prodSubtitle':'Explore the full range of BioMar feed available in Romania',
        'filterSpeciesLabel':'Species', 'filterRangeLabel':'Range', 'filterSizeLabel':'Pellet size (mm)', 'filterSearchLabel':'Search product',
        'noResults':'No products match the selected filters.',
        'calcTitle':'Feeding Calculator',
        'calcSubtitle':'BioMar\'s ration calculation tool — embedded here for your convenience.',
        'calcNote':'If the tool doesn\'t load, you can access it directly:',
        'calcOpenBtn':'Open Feeding Tool',
        'calcDisclaimer':'This tool is provided by BioMar. Results are indicative and should be adapted to your farm\'s specific conditions.',
        'contactSubtitle':'We\'re at your disposal for any aquaculture feed enquiry.',
        'contactInfoTitle':'Contact Information',
        'mapNote':'We serve farmers across all of Romania',
        'formTitle':'Get in Touch', 'formSubtitle':'We\'re here to help you find the right solution for your farm.',
        'submitText':'Send Message',
        'modalCompLabel':'Composition', 'modalAppLabel':'Application', 'modalBenLabel':'Benefits',
        'modalDsLabel':'Data Sheet', 'modalBuyLabel':'Buy Now',
        'footerDesc':'BioMar partner in Romania. Premium aquaculture feed.',
        'footerLinksTitle':'Useful Links', 'footerRights':'All rights reserved.',
        'flink-home':'Home', 'flink-products':'Products', 'flink-calculator':'Feeding Calculator', 'flink-resurse':'Resources', 'flink-contact':'Contact',
        'flink-catalog':'Product Catalogue (PDF)', 'ctaCatalogText':'Download Catalogue',
        'flink-cookies':'Cookie Policy', 'flink-cookie-settings':'Cookie settings',
        'catalogBannerTitle':'Complete BioMar Product Catalogue', 'catalogBannerDesc':'Download the PDF catalogue with all products and technical specifications', 'catalogBannerBtn':'Download Catalogue (PDF)',
      }
    };

    // Product labels per language
    const SPECIES_I18N = { ro:{trout:"Păstrăv",sturgeon:"Sturion",catfish:"Somn"}, en:{trout:"Trout",sturgeon:"Sturgeon",catfish:"Catfish"} };
    const RANGES_I18N = { ro:{starter:"Furaj Starter",pregrower:"Furaj Pre-creștere",grower:"Furaj Creștere",broodstock:"Furaj Reproducători"}, en:{starter:"Starter Feed",pregrower:"Pre-Grower Feed",grower:"Grower Feed",broodstock:"Broodstock Feed"} };
    const SIZES_I18N = { ro:{small:"Mică (0.35–1.5mm)",medium:"Medie (1.5–3mm)",large:"Mare (3–12mm)"}, en:{small:"Small (0.35–1.5mm)",medium:"Medium (1.5–3mm)",large:"Large (3–12mm)"} };
    const RANGE_DESCS_I18N = {
      ro:{ starter:"Diete de start și hrană pentru larviculturi, formulate pentru supraviețuire maximă și creștere uniformă în primele etape de viață.", pregrower:"Hrană de transfer și creștere timpurie, optimizată pentru dezvoltare rapidă, conversie alimentară eficientă și rezistență.", grower:"Hrană de performanță pentru creștere și finisare, concepută pentru randament maxim, pigmentare și calitate superioară a fileului.", broodstock:"Hrană specializată pentru reproducători, formulată pentru calitatea optimă a icrelor și sănătatea peștilor de prăsilă." },
      en:{ starter:"Starter and hatchery diets formulated for maximum survival and uniform growth during the earliest life stages.", pregrower:"Transfer and early-growth feed optimized for rapid development, efficient feed conversion, and resilience.", grower:"High-performance grower and finisher feed designed for maximum yield, pigmentation, and superior fillet quality.", broodstock:"Specialized broodstock feed formulated for optimal egg quality and breeder fish health." }
    };
    const FILTER_ALL_I18N = { ro:'Toate', en:'All' };
    const EXPLORE_I18N = { ro:'Explorează Gama →', en:'Explore Range →' };

    function toggleLang() {
      setLanguage(currentLang === 'ro' ? 'en' : 'ro');
    }

    // Apply a language and persist it so the choice survives page navigation/reload.
    function setLanguage(lang) {
      currentLang = lang;
      try { localStorage.setItem('aq_lang', lang); } catch (e) {}
      var lb = document.getElementById('langBtn'); if (lb) lb.textContent = currentLang === 'ro' ? 'EN' : 'RO';
      var lbm = document.getElementById('langBtnMobile'); if (lbm) lbm.textContent = currentLang === 'ro' ? 'EN' : 'RO';
      document.documentElement.lang = currentLang;

      // Update all translatable elements
      var translations = LANG[currentLang];
      Object.keys(translations).forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.textContent = translations[id];
      });

      // Update product labels
      SPECIES = SPECIES_I18N[currentLang];
      RANGES = RANGES_I18N[currentLang];
      SIZES = SIZES_I18N[currentLang];
      RANGE_DESCS = RANGE_DESCS_I18N[currentLang];

      // Rebuild filter dropdowns
      if (document.getElementById('filterRange')) {
      var rangeSelect = document.getElementById('filterRange');
      var currentRangeVal = rangeSelect.value;
      rangeSelect.innerHTML = '<option value="all">' + FILTER_ALL_I18N[currentLang] + '</option>';
      Object.entries(RANGES).forEach(function(entry) { rangeSelect.innerHTML += '<option value="' + entry[0] + '">' + entry[1] + '</option>'; });
      rangeSelect.value = currentRangeVal;

      var speciesSelect = document.getElementById('filterSpecies');
      var currentSpeciesVal = speciesSelect.value;
      speciesSelect.innerHTML = '<option value="all">' + FILTER_ALL_I18N[currentLang] + '</option>';
      Object.entries(SPECIES).forEach(function(entry) { speciesSelect.innerHTML += '<option value="' + entry[0] + '">' + entry[1] + '</option>'; });
      speciesSelect.value = currentSpeciesVal;

      buildPelletFilter();

      // Update search placeholder
      document.getElementById('filterSearch').placeholder = currentLang === 'ro' ? 'Nume produs...' : 'Product name...';
      }

      // Rebuild range cards on home
      buildRangeCards();

      // Re-render products if on products page
      filterProducts();

      // Keep the cookie banner/modal in the chosen language
      if (typeof renderConsentTexts === 'function') renderConsentTexts();

      // Toggle bilingual content blocks (cookie policy page)
      document.querySelectorAll('.lang-ro').forEach(function (el) { el.style.display = currentLang === 'ro' ? '' : 'none'; });
      document.querySelectorAll('.lang-en').forEach(function (el) { el.style.display = currentLang === 'en' ? '' : 'none'; });
    }

    function buildRangeCards() {
      if (!document.getElementById('rangeCards')) return;
      var rangeCardsHtml = '';
      Object.keys(RANGES).forEach(function(key, i) {
        rangeCardsHtml += '<div class="card anim-fu' + Math.min(i+1,4) + '" style="cursor:pointer" onclick="navigate(\'products\',\'' + key + '\')">' +
          '<div style="position:relative;height:160px;overflow:hidden">' +
            '<img src="' + RANGE_IMGS[key] + '" alt="' + RANGES[key] + '" style="width:100%;height:100%;object-fit:cover">' +
            '<div style="position:absolute;inset:0;background:linear-gradient(135deg,' + RANGE_COLORS[key] + '44,transparent)"></div>' +
            '<div style="position:absolute;top:14px;left:14px;font-size:32px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.3))">' + RANGE_ICONS[key] + '</div>' +
            '<div style="position:absolute;bottom:10px;right:14px;font-size:11px;font-weight:700;color:#fff;background:rgba(0,0,0,.4);padding:4px 12px;border-radius:20px;backdrop-filter:blur(8px)">' + RANGE_SIZES[key] + '</div>' +
          '</div>' +
          '<div style="padding:20px 24px 24px">' +
            '<h3 style="font-size:20px;font-weight:700;color:var(--dark);margin-bottom:8px">' + RANGES[key] + '</h3>' +
            '<p style="font-size:13px;color:var(--text-light);line-height:1.7;margin-bottom:14px">' + RANGE_DESCS[key] + '</p>' +
            '<div style="font-size:14px;font-weight:600;color:' + RANGE_COLORS[key] + ';opacity:.8">' + EXPLORE_I18N[currentLang] + '</div>' +
          '</div>' +
        '</div>';
      });
      document.getElementById('rangeCards').innerHTML = rangeCardsHtml;
    }

    function bindContactForm() {
      var cf = document.getElementById('contact-form');
      if (!cf || cf.dataset.bound) return;
      cf.dataset.bound = 'true';
      cf.addEventListener('submit', function(e) {
        e.preventDefault();
        var btn = document.getElementById('submitBtn');
        var txt = document.getElementById('submitText');
        var msg = document.getElementById('formMessage');
        btn.disabled = true; txt.textContent = 'Se trimite...'; msg.style.display = 'none';
        var data = new FormData(cf);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://formspree.io/f/mzdodzbr');
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.onreadystatechange = function() {
          if (xhr.readyState !== 4) return;
          if (xhr.status >= 200 && xhr.status < 300) {
            msg.style.display='block'; msg.style.background='linear-gradient(135deg,#27ae60,#2ecc71)'; msg.style.color='#fff';
            msg.textContent='\u2713 Mesajul t\u0103u a fost trimis! Te vom contacta \u00een cur\u00e2nd.';
            btn.style.background='linear-gradient(135deg,#27ae60,#2ecc71)'; txt.textContent='Trimis! \u2713'; cf.reset();
            setTimeout(function(){ btn.style.background=''; btn.disabled=false; txt.textContent='Trimite Mesajul'; },4000);
          } else {
            msg.style.display='block'; msg.style.background='#fee2e2'; msg.style.color='#b91c1c';
            msg.textContent='A ap\u0103rut o eroare. \u00cencearc\u0103 din nou.'; btn.disabled=false; txt.textContent='Trimite Mesajul';
          }
        };
        xhr.send(data);
      });
    }

    function setActiveNav() {
      var p = window.location.pathname, key = 'home';
      if (p.indexOf('resurse') !== -1) key = 'resurse';
      else if (p.indexOf('produse') !== -1) key = 'products';
      else if (p.indexOf('calculator') !== -1) key = 'calculator';
      else if (p.indexOf('contact') !== -1) key = 'contact';
      document.querySelectorAll('.nav-link,.nav-mobile-link').forEach(function(l){ l.classList.remove('active'); });
      var n = document.getElementById('nav-'+key); if (n) n.classList.add('active');
      var m = document.getElementById('mnav-'+key); if (m) m.classList.add('active');
    }

    document.addEventListener('DOMContentLoaded', function() {
      var byId = function(id){ return document.getElementById(id); };
      if (byId('footerYear')) byId('footerYear').textContent = new Date().getFullYear();
      if (byId('filterRange')) { byId('filterRange').innerHTML = '<option value="all">Toate</option>'; Object.entries(RANGES).forEach(function(e){ byId('filterRange').innerHTML += '<option value="'+e[0]+'">'+e[1]+'</option>'; }); }
      if (byId('filterSpecies')) { byId('filterSpecies').innerHTML = '<option value="all">Toate</option>'; Object.entries(SPECIES).forEach(function(e){ byId('filterSpecies').innerHTML += '<option value="'+e[0]+'">'+e[1]+'</option>'; }); }
      if (byId('filterPellet')) buildPelletFilter();
      if (byId('rangeCards')) buildRangeCards();
      buildResourceCategoryGrid();
      buildFeaturedArticlesGrid();
      if (byId('filterRange')) { var r = new URLSearchParams(window.location.search).get('range'); if (r) byId('filterRange').value = r; }
      var _famParam = new URLSearchParams(window.location.search).get('family');
      if (byId('langBtnMobile')) {
        if (window.innerWidth <= 768) byId('langBtnMobile').style.display = 'flex';
        window.addEventListener('resize', function(){ byId('langBtnMobile').style.display = window.innerWidth <= 768 ? 'flex' : 'none'; });
      }
      bindContactForm();
      setActiveNav();
      if (byId('productGrid')) filterProducts();
      if (byId('productGrid') && _famParam && typeof openFamily === 'function') { try { openFamily(_famParam); } catch (e) {} }
      if (typeof renderRelatedArticles === 'function' && document.querySelector('[id^="related-"]')) {
        var slug = window.location.pathname.replace(/^.*\/resurse\//,'').replace(/\.html$/,'');
        renderRelatedArticles(slug);
      }
      // Restore the visitor's previously chosen language across pages/reloads.
      var _savedLang = null;
      try { _savedLang = localStorage.getItem('aq_lang'); } catch (e) {}
      if (_savedLang === 'en' && currentLang !== 'en') setLanguage('en');

      // Cookie consent — build banner, restore prior choice (or prompt).
      initConsent();
    });
