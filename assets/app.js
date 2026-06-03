
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

    // ─── EDIT: PRODUCT DATA ──────────────────────────────────────
    // To add a product: copy any product object below and change the values.
    // To remove a product: delete its entire { ... } block.
    // Fields: id (unique), name, species (trout/sturgeon/catfish),
    //   range (starter/pregrower/grower/broodstock), size (small/medium/large),
    //   desc, longDesc, comp, benefits (array), app, pellet, img (URL),
    //   shopUrl (OPTIONAL — exact Shopify product URL for the buy button)
    
    const PRODUCTS = [
      // ── TROUT — Starter ──
      { id:"t-s-1", name:"INICIO Plus", species:"trout", range:"starter", size:"small",
        desc:"Gama INICIO Plus acoperă toate nevoile nutriționale ale salmonidelor în primele stadii de viață.",
        longDesc:"Gama INICIO Plus acoperă toate nevoile nutriționale ale salmonidelor în primele stadii de viață. Este bazată pe materii prime de calitate superioară și oferă un echilibru optim între energie și proteină, profiluri echilibrate de aminoacizi și acizi grași, vitamine și micronutrienți.<br><br>Mini-pelete extrudate, realizate din ingrediente de înaltă calitate și cu digestibilitate ridicată. Accent deosebit pe stabilitatea nutrițională, prin suplimentarea cu vitamine, ingrediente cu efect imunomodulator și digestibilitate ridicată, pentru a susține creșterea alevinilor.<br><br>Suport suplimentar este oferit prin ingrediente speciale și aditivi precum Bactocell® și B-WYSE™.",
        comp:"Proteină brută: 60% - 52%,<br> Grăsimi: 14% - 24%,",
        benefits:["Supraviețuire ridicată","Creștere uniformă","Digestibilitate excelentă","Apă curată în bazin"],
        app:"Se administrează din prima zi de hrănire activă.",
        pellet:"0.35 – 2.0mm",
        /* EDIT: Product image URL */ img:"images/fish-starter-first-feeding-inicio-plus.webp" },

        { id:"t-s-2", name:"INICIO Plus G", species:"trout", range:"starter", size:"small",
        desc:"Hrană granulată cu conținut ridicat de proteine, pentru alevini mici",
        longDesc:"Hrana granulată este dezvoltată special pentru alevinii deosebit de mici sau pentru loturile de alevini care au distribuții neuniforme ale dimensiunilor, deoarece se asigură că alevinii mici sunt capabili să se hrănească.<br><br>Accent pe stabilitatea nutrițională cu vitamine sporite și ingrediente imunitare modulante și o digestibilitate ridicată pentru a promova sănătatea și creșterea alevinilor.",
        comp:"Proteină brută: 60%,<br> Grăsimi: 10%",
        benefits:["Supraviețuire ridicată","Creștere uniformă","Digestibilitate excelentă","Apă curată în bazin"],
        app:"Se administrează din prima zi de hrănire activă.",
        pellet:"0.4 – 0.6mm",
        /* EDIT: Product image URL */ img:"images/FISH - Starter - High Performance - INICIO 1.webp" },

      // ── TROUT — Pre-Grower ──
      { id:"t-pg-1", name:"INICIO 918", species:"trout", range:"pregrower", size:"medium",
        desc:"Hrană de transfer pentru juvenili, optimizată pentru conversie alimentară și creștere rapidă.",
        longDesc:"EFICO Alpha este soluția ideală pentru faza de pre-creștere, acoperind creșterea de la 5g la 50g cu raport optim proteine/energie.",
        comp:"Proteină brută: 48% - 46%,<br> Grăsimi: 20% - 23%",
        benefits:["Conversie alimentară eficientă","Creștere rapidă","Acceptabilitate ridicată","Dezvoltare scheletică sănătoasă"],
        app:"Pentru juvenili de 3-50g. Temperatura: 4-20°C.",
        pellet:"1.5 – 2.0mm", img:"images/FISH - Starter - High Performance - INICIO 1.webp",
        shopUrl:"https://www.shop.aquafeed-biomar.ro/products/furaj-pastrav-extrudat-biomar-inicio-918-1-5mm-25kg" },

      { id:"t-pg-2", name:"INICIO 702", species:"trout", range:"pregrower", size:"medium",
        desc:"Formulă specializată pentru sisteme RAS, reducând emisiile de nutrienți.",
        longDesc:"ORBIT este primul produs din industrie dezvoltat special pentru sistemele de recirculare (RAS). Minimizează emisiile de azot și fosfor.",
        comp:"Proteină brută: 41-44%,<br> Grăsimi: 21-24%",
        benefits:["Ideal pentru RAS","Emisii reduse N&P","Stabilitate excelentă în apă","Apă curată în sistem"],
        app:"Pentru sisteme RAS. Juvenili 15-50g.",
        pellet:"2.0mm", img:"images/FISH - Starter - High Performance - INICIO 1.webp" },

      // ── TROUT — Grower ──
      { id:"t-g-1", name:"EFICO Alpha 790", species:"trout", range:"grower", size:"large",
        desc:"Hrană premium de creștere cu eficiență ridicată, pigmentare excelentă și impact ecologic redus.",
        longDesc:"EFICO Enviro 920 este produsul nostru de vârf. Cel mai ridicat nivel de energie, pigmentare uniformă și calitate superioară a fileului.",
        comp:"Proteină brută: 37 - 46%,<br> Grăsimi: 26 - 32%",
        benefits:["Cea mai bună conversie alimentară","Pigmentare excelentă","Impact ecologic redus","Calitate superioară a fileului"],
        app:"Pentru păstrăv >50g până la recoltare. Temperatura: 4 - 20°C.",
        pellet:"3.0 – 8.0mm", img:"images/fish-grower-high-performance-efico-alpha.webp" },

      { id:"t-g-2", name:"EFICO Alpha 790FT", species:"trout", range:"grower", size:"large",
        desc:"Hrană de creștere focalizată pe performanță economică și calitatea fileului.",
        longDesc:"EFICO Focus oferă echilibrul optim între performanța de creștere și costul hrănirii cu calitate excelentă a fileului.",
        comp:"Proteină brută: 36 - 41%,<br> Grăsimi: 27 - 31%",
        benefits:["Performanță economică optimă","Calitate bună a fileului","Conversie competitivă","Preț accesibil"],
        app:"Pentru păstrăv >50g.",
        pellet:"3.0 – 6.0mm", img:"images/fish-grower-high-performance-efico-alpha.webp" },

      { id:"t-g-3", name:"EFICO Alpha 756", species:"trout", range:"grower", size:"large",
        desc:"Dietă funcțională pentru sănătatea peștilor, întărind sistemul imunitar.",
        longDesc:"SmartCare — diete funcționale pentru susținerea sănătății în momente critice. Ingrediente naturale care stimulează imunitatea și reduc mortalitatea.",
        comp:"Proteină brută: 36 - 43%,<br> Grăsimi: 22 - 25%",
        benefits:["Sistem imunitar întărit","Reducerea mortalității","Rezistență la boli","Recuperare rapidă"],
        app:"Se administrează 2-4 săptămâni înainte/în timpul perioadelor critice.",
        pellet:"3.0 – 8mm", img:"images/fish-grower-high-performance-efico-alpha.webp" },

      { id:"t-g-4", name:"EFICO Alpha 717", species:"trout", range:"grower", size:"large",
        desc:"Dietă funcțională pentru sănătatea peștilor, întărind sistemul imunitar.",
        longDesc:"SmartCare — diete funcționale pentru susținerea sănătății în momente critice. Ingrediente naturale care stimulează imunitatea și reduc mortalitatea.",
        comp:"Proteină brută: 40 - 43%,<br> Grăsimi: 21 - 24%",
        benefits:["Sistem imunitar întărit","Reducerea mortalității","Rezistență la boli","Recuperare rapidă"],
        app:"Se administrează 2-4 săptămâni înainte/în timpul perioadelor critice.",
        pellet:"3.0 – 8mm", img:"images/fish-grower-high-performance-efico-alpha.webp" },

      { id:"t-g-5", name:"EFICO Enviro 920 ADVANCE", species:"trout", range:"grower", size:"large",
        desc:"Dietă funcțională pentru sănătatea peștilor, întărind sistemul imunitar.",
        longDesc:"SmartCare — diete funcționale pentru susținerea sănătății în momente critice. Ingrediente naturale care stimulează imunitatea și reduc mortalitatea.",
        comp:"Proteină brută: 38 - 46%,<br> Grăsimi: 27 - 34%",
        benefits:["Sistem imunitar întărit","Reducerea mortalității","Rezistență la boli","Recuperare rapidă"],
        app:"Se administrează 2-4 săptămâni înainte/în timpul perioadelor critice.",
        pellet:"3.0 – 8mm", img:"images/fish-grower-top-performance-efico-enviro.webp" },

      { id:"t-g-6", name:"EFICO Enviro 921 ADVANCE", species:"trout", range:"grower", size:"large",
        desc:"Dietă funcțională pentru sănătatea peștilor, întărind sistemul imunitar.",
        longDesc:"SmartCare — diete funcționale pentru susținerea sănătății în momente critice. Ingrediente naturale care stimulează imunitatea și reduc mortalitatea.",
        comp:"Proteină brută: 42%, Grăsimi: 28%, Cenușă: 6.5%, Fibre: 2.5%, + ingrediente funcționale brevetate",
        benefits:["Sistem imunitar întărit","Reducerea mortalității","Rezistență la boli","Recuperare rapidă"],
        app:"Se administrează 2-4 săptămâni înainte/în timpul perioadelor critice.",
        pellet:"3.0 – 8mm", img:"images/fish-grower-top-performance-efico-enviro.webp" },

      // ── TROUT — Broodstock ──
      { id:"t-b-1", name:"EFICO Genio 991", species:"trout", range:"broodstock", size:"large",
        desc:"Hrană specializată pentru reproducători, formulată pentru calitatea optimă a icrelor.",
        longDesc:"Formulat special pentru reproducătorii de păstrăv. Niveluri optime de vitamine, minerale și acizi grași esențiali pentru calitatea superioară a icrelor.",
        comp:"Proteină brută: 44%, Grăsimi: 22%, Cenușă: 7%, Fibre: 2%, Fosfor: 1%, Vitamine: complex complet",
        benefits:["Calitate superioară a icrelor","Fertilitate ridicată","Sănătatea reproducătorilor","Nutriție completă"],
        app:"Pentru reproducători. Frecvența: 2-3 mese/zi. Se administrează 3-6 luni înainte de reproducere.",
        pellet:"6.0 – 8.0mm", img:"images/HATCHERY-hatchery-Broodstock-EFICO-Genio 1.webp" },

      // ── STURGEON ──

      { id:"s-g-1", name:"EFICO Sigma 811", species:"sturgeon", range:"grower", size:"large",
        desc:"Hrană de creștere pentru sturion, optimizată pentru randament și calitate.",
        longDesc:"Susține creștere constantă pe termen lung cu accent pe masa musculară și calitatea cărnii.",
        comp:"Proteină brută: 45%, Grăsimi: 20%, Cenușă: 7%, Fibre: 2.5%, Fosfor: 1%",
        benefits:["Creștere pe termen lung","Calitate superioară a cărnii","Masă musculară optimă","Conversie eficientă"],
        app:"Pentru sturion >200g. Frecvența: 2-4 mese/zi.",
        pellet:"4.5 – 12mm", img:"images/fish-grower-finisher-efico-sigma.webp" },

      { id:"s-g-2", name:"BLUE IMPACT 8040", species:"sturgeon", range:"grower", size:"large",
        desc:"Hrană de creștere pentru sturion, optimizată pentru randament și calitate.",
        longDesc:"Susține creștere constantă pe termen lung cu accent pe masa musculară și calitatea cărnii.",
        comp:"Proteină brută: 45%, Grăsimi: 20%, Cenușă: 7%, Fibre: 2.5%, Fosfor: 1%",
        benefits:["Creștere pe termen lung","Calitate superioară a cărnii","Masă musculară optimă","Conversie eficientă"],
        app:"Pentru sturion >200g. Frecvența: 2-4 mese/zi.",
        pellet:"4.5 – 12mm", img:"images/salmon-grower-sustainability-blue-impact.webp" },   
        
      { id:"s-g-3", name:"BLUE IMPACT 8041", species:"sturgeon", range:"grower", size:"large",
        desc:"Hrană de creștere pentru sturion, optimizată pentru randament și calitate.",
        longDesc:"Susține creștere constantă pe termen lung cu accent pe masa musculară și calitatea cărnii.",
        comp:"Proteină brută: 45%, Grăsimi: 20%, Cenușă: 7%, Fibre: 2.5%, Fosfor: 1%",
        benefits:["Creștere pe termen lung","Calitate superioară a cărnii","Masă musculară optimă","Conversie eficientă"],
        app:"Pentru sturion >200g. Frecvența: 2-4 mese/zi.",
        pellet:"4.5 – 12mm", img:"images/salmon-grower-sustainability-blue-impact.webp" },      
        
      { id:"s-g-4", name:"BLUE IMPACT 8044", species:"sturgeon", range:"grower", size:"large",
        desc:"Hrană de creștere pentru sturion, optimizată pentru randament și calitate.",
        longDesc:"Susține creștere constantă pe termen lung cu accent pe masa musculară și calitatea cărnii.",
        comp:"Proteină brută: 45%, Grăsimi: 20%, Cenușă: 7%, Fibre: 2.5%, Fosfor: 1%",
        benefits:["Creștere pe termen lung","Calitate superioară a cărnii","Masă musculară optimă","Conversie eficientă"],
        app:"Pentru sturion >200g. Frecvența: 2-4 mese/zi.",
        pellet:"4.5 – 12mm", img:"images/salmon-grower-sustainability-blue-impact.webp" },         

      // ── CATFISH ──

      { id:"c-g-1", name:"EFICO 7239F", species:"catfish", range:"grower", size:"large",
        desc:"Hrană de creștere pentru somn, cu conversie alimentară eficientă.",
        longDesc:"Granule scufundătoare formulate pentru acceptabilitate maximă și digestibilitate excelentă. Reduce risipirea și costurile.",
        comp:"Proteină brută: 40%, Grăsimi: 14%, Cenușă: 8%, Fibre: 3%, Fosfor: 1.1%",
        benefits:["Granule scufundătoare","Conversie eficientă","Risipire redusă","Cost optim"],
        app:"Pentru somn >100g. Frecvența: 2-4 mese/zi.",
        pellet:"4.5 – 12mm", img:"images/fish-grower-high-performance-efico.webp" },
    ];

    // ─── Labels & Colors ─────────────────────────────────────────
    var SPECIES = { trout:"Păstrăv", sturgeon:"Sturion", catfish:"Somn" };
    var RANGES = { starter:"Furaj Starter", pregrower:"Furaj Pre-creștere", grower:"Furaj Creștere", broodstock:"Furaj Reproducători" };
    const RANGE_SIZES = { starter:"0.35 – 1.5mm", pregrower:"1.5 – 2mm", grower:"3 – 8mm", broodstock:"6 – 8mm" };
    const RANGE_COLORS = { starter:"#4a9fd4", pregrower:"#4a9fd4", grower:"#4a9fd4", broodstock:"#4a9fd4" };
    const RANGE_ICONS = { starter:"", pregrower:"", grower:"", broodstock:"" };
    const RANGE_IMGS = {
      starter:"images/fry_trout.png",
      pregrower:"images/pre_grower_fish.png",
      grower:"images/grower_trout.jpg",
      broodstock:"images/broodstock_trout.png"
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

    // ─── Product Filters ─────────────────────────────────────────
    function filterProducts() {
      if (!document.getElementById('productGrid')) return;
      const sf = document.getElementById('filterSpecies').value;
      const rf = document.getElementById('filterRange').value;
      const szf = document.getElementById('filterSize').value;
      const q = document.getElementById('filterSearch').value.toLowerCase();
      const grid = document.getElementById('productGrid');
      const noRes = document.getElementById('noResults');

      const filtered = PRODUCTS.filter(p => {
        if (sf !== 'all' && p.species !== sf) return false;
        if (rf !== 'all' && p.range !== rf) return false;
        if (szf !== 'all' && p.size !== szf) return false;
        if (q && !p.name.toLowerCase().includes(q)) return false;
        return true;
      });

      if (filtered.length === 0) {
        grid.innerHTML = '';
        noRes.style.display = 'block';
        return;
      }
      noRes.style.display = 'none';

      function parseSpec(comp, keyword) {
        const match = comp.match(new RegExp(keyword + '[:\\s]+([\\d%.,\\s-]+)'));
        return match ? match[1].trim().replace(/,\s*$/, '') : '—';
      }

      grid.innerHTML = filtered.map((p, i) => {
        const protein = parseSpec(p.comp, 'Proteină brută');
        const fat = parseSpec(p.comp, 'Grăsimi');
        return `
        <div class="card" style="animation:fadeUp .5s ease-out ${Math.min(i*.06,.4)}s both;border-radius:16px">
          <div style="display:flex;flex-direction:row;min-height:220px">
            <div style="width:220px;min-width:220px;position:relative;overflow:hidden;border-radius:16px 0 0 16px;background:var(--bg-alt)">
              <img src="${p.img}" alt="${p.name} — furaj ${SPECIES[p.species]} BioMar" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;object-position:center">
            </div>
            <div style="flex:1;padding:24px 28px;display:flex;flex-direction:column;justify-content:space-between">
              <div>
                <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px;margin-bottom:12px">
                  <div style="display:flex;gap:6px;flex-wrap:wrap">
                    <span class="tag" style="background:${RANGE_COLORS[p.range]}18;color:${RANGE_COLORS[p.range]};font-weight:700;padding:5px 14px;border-radius:8px;font-size:12px">${RANGES[p.range]}</span>
                    <span class="tag" style="background:rgba(26,50,100,.06);color:${SPECIES_COLORS[p.species]};padding:5px 14px;border-radius:8px;font-size:12px">🐟 ${SPECIES[p.species]}</span>
                  </div>
                  <div style="display:flex;gap:8px">
                    <a href="docs/2025-09 RO_Feed Catalogue 2025-PROOF2.pdf" target="_blank" class="btn btn-outline" style="padding:8px 18px;font-size:13px;border-radius:10px" onclick="event.stopPropagation()" title="Descarcă Catalogul de Produse">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      Descarcă
                    </a>
                    <a href="${getShopUrl(p)}" target="_blank" rel="noopener" class="btn btn-sky" style="padding:8px 18px;font-size:13px;border-radius:10px" onclick="event.stopPropagation()" title="Cumpără ${p.name} din magazinul online">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
                      Cumpără Acum
                    </a>
                  </div>
                </div>
                <h3 style="font-size:22px;font-weight:700;color:var(--dark);margin-bottom:8px;font-family:'Playfair Display',serif">${p.name}</h3>
                <p style="font-size:14px;color:var(--text-light);line-height:1.7;margin-bottom:16px">${p.desc}</p>
              </div>
              <div>
                <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:14px">
                  <div style="flex:1;min-width:120px;background:var(--bg);border:1px solid rgba(26,50,100,.08);border-radius:10px;padding:10px 16px;text-align:center">
                    <div style="font-size:11px;color:var(--text-light);font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px">Dimensiune Pelet</div>
                    <div style="font-size:15px;font-weight:700;color:var(--dark)">${p.pellet}</div>
                  </div>
                  <div style="flex:1;min-width:100px;background:var(--bg);border:1px solid rgba(26,50,100,.08);border-radius:10px;padding:10px 16px;text-align:center">
                    <div style="font-size:11px;color:var(--text-light);font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px">Proteină</div>
                    <div style="font-size:15px;font-weight:700;color:var(--dark)">${protein}</div>
                  </div>
                  <div style="flex:1;min-width:100px;background:var(--bg);border:1px solid rgba(26,50,100,.08);border-radius:10px;padding:10px 16px;text-align:center">
                    <div style="font-size:11px;color:var(--text-light);font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px">Grăsime</div>
                    <div style="font-size:15px;font-weight:700;color:var(--dark)">${fat}</div>
                  </div>
                </div>
                <div style="cursor:pointer;display:inline-flex;align-items:center;gap:6px;font-size:14px;font-weight:600;color:var(--bio-blue)" onclick="openModal('${p.id}')">
                  Afișează Mai Multe Detalii
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>`;
      }).join('');

      if (window.innerWidth <= 768) {
        grid.querySelectorAll('.card > div').forEach(row => {
          row.style.flexDirection = 'column';
          const imgDiv = row.querySelector('div:first-child');
          if (imgDiv) { imgDiv.style.width = '100%'; imgDiv.style.minWidth = '100%'; imgDiv.style.height = '200px'; imgDiv.style.borderRadius = '16px 16px 0 0'; }
        });
      }
    }
    // ─── Product Modal ───────────────────────────────────────────
    function openModal(id) {
      const p = PRODUCTS.find(x => x.id === id);
      if (!p) return;
      document.getElementById('modalImg').src = p.img;
      document.getElementById('modalTitle').textContent = p.name;
      document.getElementById('modalTags').innerHTML =
        `<span class="tag" style="background:rgba(255,255,255,.2);color:#fff;backdrop-filter:blur(6px)">${SPECIES[p.species]}</span>` +
        `<span class="tag" style="background:rgba(255,255,255,.2);color:#fff;backdrop-filter:blur(6px)">${RANGES[p.range]}</span>`;
      document.getElementById('modalDesc').innerHTML = p.longDesc;
      document.getElementById('modalComp').innerHTML = p.comp;
      document.getElementById('modalApp').innerHTML = p.app;
      document.getElementById('modalPellet').innerHTML = '<strong>Dimensiune granulă:</strong> ' + p.pellet;
      document.getElementById('modalBenefits').innerHTML = p.benefits.map(b =>
        `<div style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:#f8fafb;border-radius:12px;border:1px solid rgba(26,50,100,.06)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7ab830" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span style="font-size:14px;color:var(--text);font-weight:500">${b}</span>
        </div>`).join('');
      var buyLink = document.getElementById('modalBuyLink');
      if (buyLink) { buyLink.href = getShopUrl(p); buyLink.title = 'Cumpără ' + p.name + ' din magazinul online'; }
      document.getElementById('productModal').classList.add('active');
      document.body.style.overflow = 'hidden';
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
      { slug:'furaj-pastrav', title:'Furaj Păstrăv: Ghid Complet', desc:'Gama completă de furaje BioMar pentru păstrăv, pe etape de creștere.', img:'images/art-furaj-pastrav.jpg', category:'furajare' },
      { slug:'hranire-pastrav-temperatura', title:'Hrănirea Păstrăvului în Funcție de Temperatură', desc:'Ajustarea rației și a frecvenței de hrănire în funcție de temperatura apei.', img:'images/art-temperatura.jpg', category:'temperatura' },
      { slug:'fcr-pastrav', title:'FCR Păstrăv: Optimizarea Conversiei', desc:'Ce este FCR, ce îl influențează și cum reduci costul pe kilogram de pește.', img:'images/art-fcr.jpg', category:'fcr' },
      { slug:'furaj-hatchery-pastrav', title:'Furaj pentru Hatchery și Puiet', desc:'Furajul de start și protocolul de hrănire pentru puiet sănătos și uniform.', img:'images/art-hatchery.jpg', category:'hatchery' },
      { slug:'dimensiuni-granule-pastrav', title:'Dimensiunea Granulelor: Ghid Complet', desc:'Cum alegi dimensiunea peletului în funcție de greutatea peștelui.', img:'images/art-granule.jpg', category:'furajare' },
      { slug:'furaj-flow-through', title:'Furajare în Sisteme Flow-Through', desc:'Alegerea și administrarea furajului în păstrăvăriile cu debit continuu.', img:'images/art-flowthrough.jpg', category:'sisteme' },
      { slug:'furaj-ras', title:'Furajare în Sisteme RAS', desc:'Furaje cu emisii reduse și stabilitate ridicată pentru sistemele de recirculare.', img:'images/art-ras.jpg', category:'sisteme' },
      { slug:'oxigen-si-conversia-furajului', title:'Oxigen și Impactul asupra FCR', desc:'Cum influențează oxigenul dizolvat conversia furajului și strategiile de aerare.', img:'images/art-oxigen.jpg', category:'temperatura' }
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
        'whyP2':'Cu peste 12 ani de experiență pe piața din România, înțelegem de ce au nevoie fermierii piscicoli: rezultate constante, calitate sigură, suport tehnic și livrări de încredere.',
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
        'filterSpeciesLabel':'Specie', 'filterRangeLabel':'Gamă', 'filterSizeLabel':'Dimensiune', 'filterSearchLabel':'Caută produs',
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
        'whyP2':'With over 12 years of experience on the Romanian market, we understand what fish farmers need: consistent results, reliable quality, technical support, and dependable deliveries.',
        'whyP3':'Through our partnership with BioMar, we bring world-class feeding solutions to Romania, backed by local knowledge and practical farm experience.',
        'whyP4':'We help farms grow more efficiently, perform better, and plan with confidence.',
        'whyP5':'Aquafeed Distribution — global quality, local expertise.',
        'stat1':'Years of Partnership', 'stat2':'Species Served', 'stat3':'Partner Farms', 'stat4':'BioMar Countries',
        'rangesTitle':'Product Ranges',
        'rangesSubtitle':'Complete nutritional solutions for every growth stage — click to explore',
        'photo1':'Clean water, healthy fish', 'photo2':'Ideal natural environment', 'photo3':'Reliable logistics',
        'ctaTitle':'Ready to optimize your farm?', 'ctaContact':'Contact Our Team', 'ctaShop':'Shop Now',
        'prodTitle':'Product Catalogue', 'prodSubtitle':'Explore the full range of BioMar feed available in Romania',
        'filterSpeciesLabel':'Species', 'filterRangeLabel':'Range', 'filterSizeLabel':'Size', 'filterSearchLabel':'Search product',
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
      currentLang = currentLang === 'ro' ? 'en' : 'ro';
      document.getElementById('langBtn').textContent = currentLang === 'ro' ? 'EN' : 'RO';
      document.getElementById('langBtnMobile').textContent = currentLang === 'ro' ? 'EN' : 'RO';
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

      var sizeSelect = document.getElementById('filterSize');
      var currentSizeVal = sizeSelect.value;
      sizeSelect.innerHTML = '<option value="all">' + FILTER_ALL_I18N[currentLang] + '</option>';
      Object.entries(SIZES).forEach(function(entry) { sizeSelect.innerHTML += '<option value="' + entry[0] + '">' + entry[1] + '</option>'; });
      sizeSelect.value = currentSizeVal;

      // Update search placeholder
      document.getElementById('filterSearch').placeholder = currentLang === 'ro' ? 'Nume produs...' : 'Product name...';
      }

      // Rebuild range cards on home
      buildRangeCards();

      // Re-render products if on products page
      filterProducts();
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
      if (byId('filterSize')) { byId('filterSize').innerHTML = '<option value="all">Toate</option>'; Object.entries(SIZES).forEach(function(e){ byId('filterSize').innerHTML += '<option value="'+e[0]+'">'+e[1]+'</option>'; }); }
      if (byId('rangeCards')) buildRangeCards();
      buildResourceCategoryGrid();
      buildFeaturedArticlesGrid();
      if (byId('filterRange')) { var r = new URLSearchParams(window.location.search).get('range'); if (r) byId('filterRange').value = r; }
      if (byId('langBtnMobile')) {
        if (window.innerWidth <= 768) byId('langBtnMobile').style.display = 'flex';
        window.addEventListener('resize', function(){ byId('langBtnMobile').style.display = window.innerWidth <= 768 ? 'flex' : 'none'; });
      }
      bindContactForm();
      setActiveNav();
      if (byId('productGrid')) filterProducts();
      if (typeof renderRelatedArticles === 'function' && document.querySelector('[id^="related-"]')) {
        var slug = window.location.pathname.replace(/^.*\/resurse\//,'').replace(/\.html$/,'');
        renderRelatedArticles(slug);
      }
    });
