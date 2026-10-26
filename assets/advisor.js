// Feed advisor ("Alege furajul potrivit") — loaded only on produse.html, after app.js.
// Uses app.js globals: FAMILIES, currentLang, PREFIX, openFamily, openMember,
// shopForMember, memberShortName. Opened from the #alege-furajul block or the URL hash.

    // ─── EDIT: FEED ADVISOR ("Alege furajul potrivit", produse.html) ─
    // Step-by-step wizard that recommends products from the answers
    // (species → purpose → weight → temperature → system → sinking/floating).
    //
    // FEEDING_TABLES: official BioMar orientative feeding tables (as in the data
    //   sheets in docs/fise-tehnice/ — keep both in sync), keyed by
    //   member id from FAMILIES. Each row: [weightFrom g, weightTo g, pellet mm,
    //   [kg feed / 100 kg fish / day at each temperature column]].
    //   Temperature columns are FEED_TEMPS unless listed in FEED_TEMPS_BY_ID.
    //   To add a product's table, add an entry here — nothing else changes.
    // ADVISOR_PRODUCTS: which products the advisor can recommend and when.
    //   stage: starter (<50 g trout) | grower (>=50 g trout) | brood | sturgeon | catfish
    //   system: flow | ras (grower only) · float: true for floating pellets
    //   goal: meat | caviar (sturgeon only) · rec: true = shown first with a "Recomandat" badge
    //   A product with a table is recommended only when the table covers the weight.
    var FEED_TEMPS = [4, 6, 8, 10, 12, 14, 16, 18, 20];
    var FEED_TEMPS_WARM = [18, 20, 22, 24, 26, 28, 30];
    var FEED_TEMPS_STURGEON = [11, 13, 15, 17, 19, 21, 23, 25];
    var FEED_TEMPS_BY_ID = { "c-g-1": FEED_TEMPS_WARM, "s-g-1": FEED_TEMPS_STURGEON, "s-g-2": FEED_TEMPS_STURGEON, "s-g-3": FEED_TEMPS_STURGEON, "s-g-4": FEED_TEMPS_STURGEON };
    var ADVISOR_GROWER_FROM = 50;   // g — below this, starter / pre-grower feeds
    // Per species group: max weight (g, above it → contact us), table temperatures,
    // default temperature and the quick-pick weight chips.
    var ADVISOR_SPECIES = {
      trout:    { maxWeight:3000,  temps:FEED_TEMPS,      temp:12, chips:[0.2, 2, 10, 30, 80, 250, 600, 1500] },
      brood:    { maxWeight:3000,  temps:FEED_TEMPS,      temp:10, chips:[500, 800, 1200, 2000, 2500] },
      catfish:  { maxWeight:2000,  temps:FEED_TEMPS_WARM, temp:24, chips:[30, 80, 150, 300, 600, 1500] },
      sturgeon: { maxWeight:12000, temps:FEED_TEMPS_STURGEON, temp:17, chips:[100, 500, 2000, 5000, 10000] }
    };
    var FEEDING_TABLES = {
      "t-s-1": [ // INICIO Plus
        [0.1, 0.3, 0.35, [1.19,1.79,2.37,2.91,3.37,3.66,3.73,3.51,2.84]],
        [0.3, 0.5, 0.5,  [1.11,1.67,2.21,2.72,3.14,3.42,3.49,3.27,2.65]],
        [0.5, 1,   0.8,  [1.04,1.56,2.07,2.55,2.94,3.20,3.26,3.06,2.48]],
        [1,   3,   1.1,  [0.93,1.40,1.85,2.27,2.63,2.86,2.91,2.73,2.22]],
        [3,   8,   1.5,  [0.78,1.17,1.55,1.91,2.21,2.40,2.45,2.30,1.86]],
        [8,   15,  1.5,  [0.68,1.02,1.35,1.66,1.91,2.08,2.12,1.99,1.61]],
        [15,  20,  2.0,  [0.64,0.96,1.27,1.55,1.80,1.95,1.99,1.87,1.52]],
        [20,  30,  2.0,  [0.58,0.88,1.16,1.43,1.65,1.79,1.83,1.72,1.39]],
        [30,  50,  2.0,  [0.53,0.79,1.05,1.29,1.49,1.62,1.65,1.55,1.26]]],
      "t-s-2": [ // INICIO Plus G
        [0.1, 0.2, 0.4, [1.22,1.84,2.44,2.99,3.46,3.77,3.84,3.60,2.92]],
        [0.2, 0.4, 0.6, [1.14,1.72,2.28,2.80,3.24,3.52,3.59,3.37,2.73]],
        [0.4, 1.5, 1.0, [1.01,1.52,2.02,2.48,2.87,3.12,3.18,2.98,2.42]]],
      "t-pg-1": [ // INICIO 918
        [3,  8,  1.5, [0.82,1.23,1.63,2.01,2.32,2.52,2.57,2.42,1.96]],
        [8,  15, 1.5, [0.71,1.07,1.41,1.73,2.00,2.18,2.22,2.09,1.69]],
        [15, 20, 2.0, [0.67,1.01,1.34,1.65,1.90,2.07,2.11,1.98,1.61]],
        [20, 30, 2.0, [0.62,0.93,1.23,1.51,1.74,1.90,1.93,1.81,1.47]],
        [30, 50, 2.0, [0.56,0.84,1.11,1.36,1.57,1.71,1.74,1.63,1.32]]],
      "t-pg-2": [ // INICIO 702
        [15, 20, 2.0, [0.73,1.10,1.46,1.79,2.07,2.25,2.30,2.15,1.75]],
        [20, 30, 2.0, [0.67,1.00,1.33,1.63,1.89,2.05,2.09,1.96,1.59]],
        [30, 50, 2.0, [0.60,0.90,1.19,1.46,1.69,1.84,1.88,1.76,1.43]]],
      "t-g-1": [ // EFICO Alpha 790
        [50,  60,   3.0, [0.49,0.74,0.98,1.21,1.40,1.52,1.55,1.45,1.18]],
        [60,  80,   3.0, [0.49,0.73,0.97,1.19,1.38,1.50,1.53,1.43,1.16]],
        [80,  100,  3.0, [0.48,0.72,0.95,1.17,1.35,1.47,1.50,1.41,1.14]],
        [100, 200,  4.5, [0.45,0.68,0.91,1.11,1.29,1.40,1.43,1.34,1.08]],
        [200, 300,  4.5, [0.42,0.64,0.85,1.04,1.20,1.31,1.33,1.25,1.01]],
        [300, 450,  4.5, [0.40,0.60,0.79,0.97,1.12,1.22,1.24,1.17,0.95]],
        [450, 600,  6.0, [0.37,0.56,0.75,0.92,1.06,1.15,1.17,1.10,0.89]],
        [600, 800,  6.0, [0.35,0.52,0.69,0.85,0.98,1.07,1.09,1.02,0.83]],
        [800, 1000, 6.0, [0.32,0.48,0.64,0.78,0.91,0.99,1.00,0.94,0.76]]],
      "t-g-2": [ // EFICO Alpha 790FT
        [50,  60,   3.0, [0.54,0.81,1.07,1.32,1.52,1.66,1.69,1.58,1.28]],
        [60,  80,   3.0, [0.53,0.79,1.05,1.29,1.49,1.63,1.66,1.56,1.26]],
        [80,  100,  3.0, [0.52,0.78,1.03,1.27,1.46,1.59,1.62,1.52,1.23]],
        [100, 200,  4.5, [0.49,0.74,0.98,1.21,1.40,1.52,1.55,1.45,1.18]],
        [200, 300,  4.5, [0.46,0.69,0.91,1.12,1.30,1.41,1.44,1.35,1.09]],
        [300, 450,  4.5, [0.43,0.64,0.85,1.04,1.20,1.31,1.34,1.25,1.02]],
        [450, 600,  6.0, [0.40,0.60,0.80,0.98,1.14,1.24,1.26,1.18,0.96]],
        [600, 800,  6.0, [0.37,0.56,0.74,0.91,1.05,1.14,1.16,1.09,0.89]],
        [800, 1000, 6.0, [0.34,0.51,0.68,0.84,0.97,1.05,1.07,1.01,0.82]]],
      "t-g-3": [ // EFICO Alpha 756 (plutitor)
        [50,   60,   3.0, [0.54,0.81,1.07,1.32,1.52,1.66,1.69,1.58,1.28]],
        [60,   80,   3.0, [0.53,0.79,1.05,1.29,1.49,1.63,1.66,1.56,1.26]],
        [80,   100,  3.0, [0.52,0.78,1.03,1.27,1.46,1.59,1.62,1.52,1.23]],
        [100,  200,  4.5, [0.49,0.74,0.98,1.21,1.40,1.52,1.55,1.45,1.18]],
        [200,  300,  4.5, [0.46,0.69,0.91,1.12,1.30,1.41,1.44,1.35,1.09]],
        [300,  450,  4.5, [0.43,0.64,0.85,1.04,1.20,1.31,1.34,1.25,1.02]],
        [450,  600,  6.0, [0.40,0.60,0.80,0.98,1.14,1.24,1.26,1.18,0.96]],
        [600,  800,  6.0, [0.37,0.56,0.74,0.91,1.05,1.14,1.16,1.09,0.89]],
        [800,  1000, 6.0, [0.34,0.51,0.68,0.84,0.97,1.05,1.07,1.01,0.82]],
        [1000, 1400, 8.0, [0.31,0.47,0.62,0.76,0.88,0.96,0.97,0.91,0.74]],
        [1400, 2000, 8.0, [0.26,0.39,0.52,0.64,0.74,0.80,0.82,0.77,0.62]],
        [2000, 3000, 8.0, [0.20,0.30,0.40,0.49,0.57,0.62,0.63,0.59,0.48]]],
      "t-g-5": [ // EFICO Enviro 920 ADVANCE
        [50,   60,   3.0, [0.47,0.70,0.93,1.14,1.32,1.43,1.46,1.37,1.11]],
        [60,   80,   3.0, [0.46,0.69,0.91,1.12,1.30,1.41,1.44,1.35,1.10]],
        [80,   100,  3.0, [0.45,0.68,0.90,1.11,1.28,1.39,1.42,1.33,1.08]],
        [100,  200,  4.5, [0.43,0.65,0.86,1.06,1.23,1.34,1.36,1.28,1.04]],
        [200,  300,  4.5, [0.41,0.61,0.81,1.00,1.15,1.25,1.28,1.20,0.97]],
        [300,  450,  4.5, [0.38,0.57,0.76,0.93,1.08,1.17,1.19,1.12,0.91]],
        [450,  600,  6.0, [0.36,0.54,0.71,0.87,1.01,1.10,1.12,1.05,0.85]],
        [600,  800,  6.0, [0.33,0.50,0.66,0.81,0.94,1.02,1.04,0.98,0.79]],
        [800,  1000, 6.0, [0.31,0.46,0.61,0.75,0.87,0.94,0.96,0.90,0.73]],
        [1000, 1400, 8.0, [0.28,0.42,0.56,0.69,0.79,0.86,0.88,0.83,0.67]],
        [1400, 2000, 8.0, [0.24,0.36,0.47,0.58,0.67,0.73,0.74,0.70,0.57]],
        [2000, 3000, 8.0, [0.18,0.27,0.36,0.45,0.52,0.56,0.57,0.54,0.43]]],
      "t-g-4": [ // EFICO Alpha 717
        [50,   60,   3.0, [0.55,0.83,1.10,1.35,1.57,1.70,1.74,1.63,1.32]],
        [60,   80,   3.0, [0.54,0.82,1.08,1.33,1.54,1.67,1.70,1.60,1.30]],
        [80,   100,  3.0, [0.53,0.80,1.06,1.30,1.50,1.63,1.67,1.56,1.27]],
        [100,  200,  4.5, [0.51,0.76,1.01,1.24,1.43,1.56,1.59,1.49,1.21]],
        [200,  300,  4.5, [0.47,0.71,0.94,1.15,1.33,1.44,1.47,1.38,1.12]],
        [300,  450,  4.5, [0.44,0.65,0.87,1.07,1.23,1.34,1.37,1.28,1.04]],
        [450,  600,  6.0, [0.41,0.62,0.82,1.00,1.16,1.26,1.29,1.21,0.98]],
        [600,  800,  6.0, [0.38,0.57,0.75,0.93,1.07,1.17,1.19,1.12,0.90]],
        [800,  1000, 6.0, [0.35,0.52,0.69,0.85,0.99,1.07,1.09,1.03,0.83]],
        [1000, 1400, 8.0, [0.32,0.48,0.63,0.77,0.89,0.97,0.99,0.93,0.75]],
        [1400, 2000, 8.0, [0.27,0.40,0.53,0.65,0.75,0.82,0.83,0.78,0.63]],
        [2000, 3000, 8.0, [0.20,0.31,0.40,0.50,0.57,0.63,0.64,0.60,0.48]]],
      "t-g-6": [ // EFICO Enviro 921 ADVANCE (plutitor)
        [50,  60,   3.0, [0.49,0.74,0.98,1.21,1.40,1.52,1.55,1.45,1.18]],
        [60,  80,   3.0, [0.49,0.73,0.97,1.19,1.38,1.50,1.53,1.43,1.16]],
        [80,  100,  3.0, [0.48,0.72,0.95,1.17,1.35,1.47,1.50,1.41,1.14]],
        [100, 200,  4.5, [0.46,0.69,0.91,1.12,1.30,1.41,1.44,1.35,1.09]],
        [200, 300,  4.5, [0.43,0.64,0.85,1.05,1.21,1.32,1.34,1.26,1.02]],
        [300, 450,  4.5, [0.40,0.60,0.80,0.98,1.13,1.23,1.25,1.18,0.95]],
        [450, 600,  6.0, [0.38,0.57,0.75,0.93,1.07,1.16,1.19,1.11,0.90]],
        [600, 800,  6.0, [0.35,0.53,0.70,0.86,0.99,1.08,1.10,1.03,0.84]],
        [800, 1000, 6.0, [0.32,0.49,0.64,0.79,0.91,1.00,1.01,0.95,0.77]]],
      "t-b-1": [ // EFICO Genio 991F (reproducători, plutitor) — from the 991F datasheet
        [450,  600,  6.0, [0.42,0.63,0.83,1.02,1.18,1.28,1.31,1.23,0.99]],
        [600,  800,  6.0, [0.38,0.58,0.77,0.94,1.09,1.18,1.21,1.13,0.92]],
        [800,  1000, 6.0, [0.35,0.53,0.71,0.87,1.00,1.09,1.11,1.04,0.85]],
        [1000, 1400, 8.0, [0.32,0.48,0.64,0.79,0.91,0.99,1.01,0.95,0.77]],
        [1400, 2000, 8.0, [0.27,0.41,0.54,0.66,0.76,0.83,0.85,0.79,0.64]],
        [2000, 3000, 8.0, [0.21,0.31,0.41,0.50,0.58,0.63,0.65,0.61,0.49]]],
      "c-g-1": [ // EFICO 7239F (somn) — columns FEED_TEMPS_WARM (18–30 °C)
        [25,   50,   3.0, [2.35,3.53,4.42,5.29,5.88,5.29,4.71]],
        [50,   100,  3.0, [1.90,2.84,3.55,4.26,4.74,4.26,3.79]],
        [100,  200,  4.5, [1.52,2.28,2.84,3.41,3.79,3.41,3.03]],
        [200,  400,  4.5, [1.10,1.64,2.05,2.46,2.74,2.46,2.19]],
        [400,  1000, 6.0, [0.77,1.16,1.46,1.75,1.94,1.75,1.56]],
        [1000, 2000, 6.0, [0.54,0.80,1.01,1.21,1.34,1.21,1.08]]],
      // Sturgeon — columns FEED_TEMPS_STURGEON (11–25 °C), from the product datasheets.
      "s-g-1": [ // EFICO Sigma 811
        [50,   100,  3.0, [0.46,0.65,0.92,1.28,1.70,2.12,2.47,2.66]],
        [100,  200,  3.0, [0.34,0.48,0.69,0.96,1.27,1.58,1.85,1.99]],
        [200,  350,  3.0, [0.27,0.37,0.53,0.74,0.98,1.23,1.43,1.54]],
        [350,  600,  4.5, [0.21,0.30,0.42,0.59,0.78,0.97,1.13,1.22]],
        [600,  800,  4.5, [0.18,0.25,0.36,0.50,0.66,0.83,0.97,1.04]],
        [800,  1000, 4.5, [0.16,0.23,0.32,0.45,0.60,0.75,0.87,0.94]],
        [1000, 1500, 6.0, [0.14,0.20,0.29,0.40,0.53,0.66,0.77,0.83]],
        [1500, 2500, 6.0, [0.12,0.17,0.23,0.33,0.43,0.54,0.63,0.68]],
        [2500, 4000, 6.0, [0.10,0.13,0.19,0.27,0.35,0.44,0.52,0.55]],
        [4000, 6000, 8.0, [0.08,0.11,0.16,0.22,0.30,0.37,0.43,0.46]],
        [6000, 7000, 8.0, [0.07,0.10,0.14,0.20,0.27,0.33,0.39,0.42]],
        [7000, 8000, 8.0, [0.07,0.10,0.14,0.19,0.25,0.31,0.36,0.39]]],
      "s-g-2": [ // BLUE IMPACT 8040
        [50,   100,  3.0, [0.46,0.65,0.93,1.30,1.72,2.15,2.50,2.69]],
        [100,  200,  3.0, [0.35,0.49,0.70,0.97,1.28,1.60,1.87,2.01]],
        [200,  350,  3.0, [0.27,0.38,0.54,0.75,0.99,1.24,1.45,1.56]],
        [350,  600,  4.5, [0.21,0.30,0.43,0.59,0.79,0.98,1.15,1.23]],
        [600,  800,  4.5, [0.18,0.26,0.36,0.51,0.67,0.84,0.98,1.05]],
        [800,  1000, 4.5, [0.16,0.23,0.33,0.45,0.60,0.75,0.88,0.95]],
        [1000, 1500, 6.5, [0.14,0.20,0.28,0.40,0.53,0.66,0.77,0.82]],
        [1500, 2500, 6.5, [0.12,0.16,0.23,0.33,0.43,0.54,0.63,0.68]],
        [2500, 4000, 6.5, [0.10,0.13,0.19,0.27,0.35,0.44,0.51,0.55]],
        [4000, 6000, 9.0, [0.08,0.11,0.16,0.22,0.30,0.37,0.43,0.46]],
        [6000, 7000, 9.0, [0.07,0.10,0.14,0.20,0.26,0.33,0.39,0.41]],
        [7000, 8000, 9.0, [0.07,0.09,0.14,0.19,0.25,0.31,0.36,0.39]]],
      "s-g-3": [ // BLUE IMPACT 8041
        [50,   100,  3.0, [0.44,0.63,0.89,1.24,1.64,2.05,2.39,2.57]],
        [100,  200,  3.0, [0.33,0.47,0.67,0.93,1.23,1.54,1.80,1.93]],
        [200,  350,  3.0, [0.26,0.37,0.52,0.72,0.96,1.20,1.40,1.50]],
        [350,  600,  4.5, [0.20,0.29,0.41,0.57,0.75,0.94,1.10,1.18]],
        [600,  800,  4.5, [0.17,0.24,0.35,0.48,0.64,0.80,0.94,1.01]],
        [800,  1000, 4.5, [0.16,0.22,0.31,0.44,0.58,0.72,0.84,0.91]],
        [1000, 1500, 6.5, [0.14,0.19,0.28,0.38,0.51,0.63,0.74,0.80]],
        [1500, 2500, 6.5, [0.11,0.16,0.23,0.32,0.42,0.52,0.61,0.66]],
        [2500, 4000, 6.5, [0.09,0.13,0.19,0.26,0.34,0.43,0.50,0.54]],
        [4000, 6000, 9.0, [0.08,0.11,0.16,0.22,0.29,0.36,0.42,0.45]],
        [6000, 7000, 9.0, [0.07,0.10,0.14,0.19,0.26,0.32,0.38,0.40]],
        [7000, 8000, 9.0, [0.07,0.09,0.13,0.18,0.24,0.30,0.35,0.38]]],
      "s-g-4": [ // BLUE IMPACT 8044
        [1000,  1500,  6.5,  [0.14,0.20,0.29,0.40,0.53,0.66,0.77,0.83]],
        [1500,  2500,  6.5,  [0.12,0.17,0.24,0.33,0.43,0.54,0.63,0.68]],
        [2500,  4000,  6.5,  [0.10,0.13,0.19,0.27,0.35,0.44,0.52,0.55]],
        [4000,  6000,  9.0,  [0.08,0.11,0.16,0.22,0.30,0.37,0.43,0.46]],
        [6000,  7000,  9.0,  [0.07,0.10,0.14,0.20,0.27,0.33,0.39,0.42]],
        [7000,  8000,  9.0,  [0.07,0.10,0.14,0.19,0.25,0.31,0.36,0.39]],
        [8000,  9000,  12.0, [0.06,0.09,0.13,0.18,0.24,0.30,0.35,0.37]],
        [9000,  10000, 12.0, [0.06,0.09,0.12,0.17,0.23,0.28,0.33,0.36]],
        [10000, 12000, 12.0, [0.06,0.08,0.12,0.16,0.21,0.27,0.31,0.33]]]
    };
    var ADVISOR_PRODUCTS = [
      { id:"t-s-1",  stage:"starter", rec:true, why:{ ro:"Furaj de start pentru alevini, din prima zi de hrănire activă.", en:"Starter feed for fry, from the first day of active feeding." } },
      { id:"t-s-2",  stage:"starter", why:{ ro:"Hrană granulată pentru alevini foarte mici sau loturi cu dimensiuni neuniforme.", en:"Crumbled feed for very small fry or batches with uneven sizes." } },
      { id:"t-pg-1", stage:"starter", why:{ ro:"Alternativă eficientă pentru alevini medii spre mari.", en:"Efficient alternative for medium to large fry." } },
      { id:"t-pg-2", stage:"starter", why:{ ro:"Pentru alevini mari în ferme convenționale.", en:"For large fry on conventional farms." } },
      { id:"t-g-2",  stage:"grower", system:"flow", float:false, rec:true, why:{ ro:"Versatil și rentabil; optim pentru sisteme flow-through.", en:"Versatile and cost-effective; optimal for flow-through systems." } },
      { id:"t-g-4",  stage:"grower", system:"flow", float:false, rec:true, why:{ ro:"Energie medie, raport bun calitate–preț.", en:"Medium energy, good value for money." } },
      { id:"t-g-3",  stage:"grower", system:"flow", float:true,  rec:true, why:{ ro:"Plutitor: vezi furajul neconsumat și controlezi hrănirea.", en:"Floating: you see uneaten feed and stay in control of feeding." } },
      { id:"t-g-1",  stage:"grower", system:"ras",  float:false, why:{ ro:"Performanță de top; fecale solide, un ajutor pentru biofiltre.", en:"Top performance; firm faeces that help the biofilters." } },
      { id:"t-g-5",  stage:"grower", system:"ras",  float:false, why:{ ro:"Cel mai ridicat nivel de energie, impact redus asupra apei.", en:"Highest energy level, reduced impact on water quality." } },
      { id:"t-g-6",  stage:"grower", system:"ras",  float:true,  why:{ ro:"Variantă plutitoare a gamei Enviro.", en:"Floating version of the Enviro range." } },
      { id:"t-b-1",  stage:"brood", float:true, why:{ ro:"Formulat pentru reproducători și calitatea icrelor.", en:"Formulated for broodstock and egg quality." } },
      { id:"s-g-1",  stage:"sturgeon", goal:"meat",   why:{ ro:"Hrană rentabilă pentru producția de carne de sturion.", en:"Cost-effective feed for sturgeon meat production." } },
      { id:"s-g-2",  stage:"sturgeon", goal:"caviar", why:{ ro:"Pentru perioadele de creștere scăzută (iarna); grăsimi limitate, pentru ovare sănătoase.", en:"For slow-growth periods (winter); limited fat for healthy ovaries." } },
      { id:"s-g-3",  stage:"sturgeon", goal:"caviar", why:{ ro:"Pentru perioadele de creștere puternică (vara); FCR scăzut, recomandat pentru RAS.", en:"For strong-growth periods (summer); low FCR, recommended for RAS." } },
      { id:"s-g-4",  stage:"sturgeon", goal:"caviar", why:{ ro:"Pentru maturarea femelelor și etapele finale ale producției de caviar de înaltă calitate.", en:"For female maturation and the final stages of high-quality caviar production." } },
      { id:"c-g-1",  stage:"catfish", float:true, why:{ ro:"Furaj plutitor pentru somn, conversie eficientă.", en:"Floating feed for catfish, efficient conversion." } }
    ];
    var FEEDING_TOOL_URL = "https://feedingtool.biomar.com/start";

    var ADVISOR_I18N = {
      ro: {
        title:'Alege furajul potrivit', back:'‹ Înapoi', next:'Continuă', restart:'Începe din nou',
        qSpecies:'Ce specie creșteți?', hSpecies:'Alegeți specia principală din fermă.',
        rainbow:'Păstrăv curcubeu', brook:'Păstrăv fântânel', native:'Păstrăv indigen', sturgeon:'Sturion', catfish:'Somn',
        qPurpose:'Ce doriți să hrăniți?', hPurpose:'Furajele pentru reproducători sunt diferite de cele de creștere.',
        grow:'Pește de creștere', growSub:'De la alevin până la recoltare', brood:'Reproducători', broodSub:'Pentru calitatea icrelor',
        qGoal:'Care este obiectivul producției?', hGoal:'BioMar are furaje dedicate pentru producția de carne și pentru producția de caviar.',
        meat:'Producția de carne', meatSub:'Creștere până la dimensiunea comercială', caviar:'Producția de caviar', caviarSub:'Exemplare crescute pentru icre',
        qWeight:'Ce greutate medie are peștele?', hWeight:'Introduceți greutatea medie a lotului, în grame.',
        errWeight:'Introduceți o greutate validă (minim 0,1 g).', errWeightMax:'Peste {max} g vă rugăm să ne contactați pentru o recomandare personalizată.',
        qTemp:'Ce temperatură are apa?', hTemp:'Temperatura influențează rația zilnică, nu produsul. Intervalul tabelelor: {min} – {max} °C.',
        errTemp:'Temperatura trebuie să fie între {min} și {max} °C (limitele tabelelor de furajare).',
        qSystem:'Ce tip de fermă aveți?', hSystem:'Recomandarea ține cont de sistemul de creștere.',
        flow:'Flow-through', flowSub:'Apă cu debit continuu', ras:'RAS', rasSub:'Sistem recirculant',
        qFloat:'Ce tip de furaj preferați?', hFloat:'Furajul standard pentru păstrăv este cu scufundare lentă. Cel plutitor oferă control vizual al hrănirii.',
        sink:'Scufundare lentă', sinkSub:'Varianta standard', float:'Plutitor', floatSub:'Vedeți peștii hrănindu-se la suprafață și opriți la momentul potrivit',
        any:'Nu știu / indiferent', anySub:'Arată-mi toate variantele',
        result:'Recomandarea noastră', rec:'Recomandat', noMatch:'Nu am găsit o potrivire exactă. Contactați-ne și vă recomandăm personal.',
        noMatchFloat:'Încercați și varianta „Nu știu / indiferent” la tipul de furaj.',
        pellet:'Dimensiune pelet', ration:'Rație orientativă', perDay:'/ 100 kg pește / zi',
        tableRow:'Vezi rândul din tabel',
        tableSoon:'Tabelul de furajare pentru acest produs va fi adăugat. Până atunci contactați-ne pentru rație.',
        details:'Detalii produs', buy:'Cumpără', quote:'Cere ofertă',
        note:'Valori orientative. Rația reală depinde de condițiile fermei.',
        ftTitle:'Calculează rația exactă', ftText:'pentru ferma ta în',
        quoteMsg:'Bună ziua, aș dori o ofertă pentru {p}. Detalii fermă: {d}.'
      },
      en: {
        title:'Find the right feed', back:'‹ Back', next:'Continue', restart:'Start over',
        qSpecies:'Which species do you farm?', hSpecies:'Choose the main species on your farm.',
        rainbow:'Rainbow trout', brook:'Brook trout', native:'Brown trout', sturgeon:'Sturgeon', catfish:'Catfish',
        qPurpose:'What are you feeding?', hPurpose:'Broodstock feeds differ from grower feeds.',
        grow:'Grow-out fish', growSub:'From fry to harvest', brood:'Broodstock', broodSub:'For egg quality',
        qGoal:'What is your production goal?', hGoal:'BioMar has dedicated feeds for meat production and for caviar production.',
        meat:'Meat production', meatSub:'Growing to market size', caviar:'Caviar production', caviarSub:'Fish raised for roe',
        qWeight:'What is the average fish weight?', hWeight:'Enter the average weight of the batch, in grams.',
        errWeight:'Enter a valid weight (at least 0.1 g).', errWeightMax:'Above {max} g please contact us for a personalised recommendation.',
        qTemp:'What is the water temperature?', hTemp:'Temperature affects the daily ration, not the product. Table range: {min} – {max} °C.',
        errTemp:'Temperature must be between {min} and {max} °C (the feeding table limits).',
        qSystem:'What type of farm do you have?', hSystem:'The recommendation depends on the farming system.',
        flow:'Flow-through', flowSub:'Continuous water flow', ras:'RAS', rasSub:'Recirculating system',
        qFloat:'Which feed type do you prefer?', hFloat:'The standard trout feed is slow-sinking. Floating feed gives visual control of feeding.',
        sink:'Slow-sinking', sinkSub:'The standard option', float:'Floating', floatSub:'See the fish feeding at the surface and stop at the right moment',
        any:'Not sure / no preference', anySub:'Show me all options',
        result:'Our recommendation', rec:'Recommended', noMatch:'We found no exact match. Contact us and we will advise you personally.',
        noMatchFloat:'Also try “Not sure / no preference” for the feed type.',
        pellet:'Pellet size', ration:'Indicative ration', perDay:'/ 100 kg fish / day',
        tableRow:'See the table row',
        tableSoon:'The feeding table for this product will be added soon. Until then, contact us for the ration.',
        details:'Product details', buy:'Buy', quote:'Request a quote',
        note:'Indicative values. The actual ration depends on your farm conditions.',
        ftTitle:'Calculate the exact ration', ftText:'for your farm in',
        quoteMsg:'Hello, I would like a quote for {p}. Farm details: {d}.'
      }
    };

    function advBlank() { return { species:null, purpose:null, goal:null, weight:null, temp:12, system:null, floatPref:null, step:0, done:false }; }
    var ADV = advBlank();

    function advT(k) { return (ADVISOR_I18N[currentLang] || ADVISOR_I18N.ro)[k]; }
    function advIsTrout() { return ['rainbow','brook','native'].indexOf(ADV.species) !== -1; }
    function advNum(n, d) { var s = (d === undefined) ? String(n) : n.toFixed(d); return currentLang === 'ro' ? s.replace('.', ',') : s; }
    function advMM(n) { return advNum(n, n % 1 ? undefined : 1) + ' mm'; } // 6 → "6,0 mm", 0.35 → "0,35 mm"
    // Settings for the current species group (see ADVISOR_SPECIES).
    function advCfg() {
      return ADVISOR_SPECIES[advIsTrout() ? (ADV.purpose === 'brood' ? 'brood' : 'trout') : ADV.species] || ADVISOR_SPECIES.trout;
    }

    // The question path depends on the answers given so far.
    function advSteps() {
      var p = ['species'];
      if (advIsTrout()) {
        p.push('purpose');
        if (ADV.purpose) p.push('weight', 'temp');
        if (ADV.purpose === 'grow' && ADV.weight !== null && ADV.weight >= ADVISOR_GROWER_FROM) p.push('system', 'float');
      } else if (ADV.species === 'sturgeon') p.push('goal', 'weight', 'temp');
      else if (ADV.species === 'catfish') p.push('weight', 'temp');
      return p;
    }

    function findMember(mid) {
      for (var i = 0; i < FAMILIES.length; i++) {
        var m = FAMILIES[i].members.find(function (x) { return x.id === mid; });
        if (m) return { f: FAMILIES[i], m: m };
      }
      return null;
    }
    function feedingRow(mid, w) {
      var rows = FEEDING_TABLES[mid]; if (!rows) return null;
      for (var i = 0; i < rows.length; i++) {
        var r = rows[i], last = (i === rows.length - 1);
        if (w >= r[0] && (w < r[1] || (last && w <= r[1]))) return r;
      }
      return null;
    }
    function feedingTemps(mid) { return FEED_TEMPS_BY_ID[mid] || FEED_TEMPS; }
    // Linear interpolation between the 2 °C table columns
    function feedingRate(vals, t, temps) {
      for (var i = 0; i < temps.length - 1; i++) {
        if (t >= temps[i] && t <= temps[i + 1]) {
          var k = (t - temps[i]) / (temps[i + 1] - temps[i]);
          return vals[i] + (vals[i + 1] - vals[i]) * k;
        }
      }
      return vals[vals.length - 1];
    }
    function advStage() {
      return ADV.species === 'sturgeon' ? 'sturgeon' : ADV.species === 'catfish' ? 'catfish'
           : ADV.purpose === 'brood' ? 'brood' : (ADV.weight < ADVISOR_GROWER_FROM ? 'starter' : 'grower');
    }
    function advRecommend() {
      var stage = advStage();
      return ADVISOR_PRODUCTS.filter(function (p) {
        if (p.stage !== stage || !findMember(p.id)) return false;
        if (FEEDING_TABLES[p.id] && !feedingRow(p.id, ADV.weight)) return false;
        if (stage === 'sturgeon') return p.goal === ADV.goal;
        if (stage === 'grower') {
          if (p.system !== ADV.system) return false;
          if (ADV.floatPref === 'sink') return !p.float;
          if (ADV.floatPref === 'float') return !!p.float;
        }
        return true;
      });
    }

    // Deep link: produse.html#alege-furajul opens the advisor. A fragment (not a
    // query string) keeps a single crawlable URL for the page.
    var ADVISOR_HASH = '#alege-furajul';
    var _advReturnFocus = null;
    function openAdvisor() {
      var modal = document.getElementById('advisorModal');
      if (!modal) return;
      ADV = advBlank();
      _advReturnFocus = document.activeElement;
      renderAdvisor();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (location.hash !== ADVISOR_HASH) history.replaceState(null, '', ADVISOR_HASH);
      advFocusFirst();
    }
    function closeAdvisor() {
      var modal = document.getElementById('advisorModal');
      if (!modal || !modal.classList.contains('active')) return;
      modal.classList.remove('active');
      document.body.style.overflow = '';
      if (location.hash === ADVISOR_HASH) history.replaceState(null, '', location.pathname + location.search);
      if (_advReturnFocus && _advReturnFocus.focus) _advReturnFocus.focus();
    }
    // Move keyboard focus to the first control of the current step (accessibility).
    function advFocusFirst() {
      var el = document.querySelector('#advisorBody input, #advisorBody .adv-opt, #advisorBody .adv-res button');
      if (el) el.focus({ preventScroll: true });
    }
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAdvisor(); });

    function advOpt(key, val, sub) {
      var cur = { species:ADV.species, purpose:ADV.purpose, goal:ADV.goal, system:ADV.system, float:ADV.floatPref }[key];
      return '<button type="button" class="adv-opt' + (cur === val ? ' sel' : '') + '" onclick="advPick(\'' + key + '\',\'' + val + '\')">' +
        '<b>' + advT(val) + '</b>' + (sub ? '<span>' + advT(sub) + '</span>' : '') + '</button>';
    }
    var ADV_VIEWS = {
      species: function () { return '<div class="adv-q">' + advT('qSpecies') + '</div><div class="adv-hint">' + advT('hSpecies') + '</div><div class="adv-opts">' +
        advOpt('species','rainbow') + advOpt('species','brook') + advOpt('species','native') + advOpt('species','sturgeon') + advOpt('species','catfish') + '</div>'; },
      purpose: function () { return '<div class="adv-q">' + advT('qPurpose') + '</div><div class="adv-hint">' + advT('hPurpose') + '</div><div class="adv-opts">' +
        advOpt('purpose','grow','growSub') + advOpt('purpose','brood','broodSub') + '</div>'; },
      goal: function () { return '<div class="adv-q">' + advT('qGoal') + '</div><div class="adv-hint">' + advT('hGoal') + '</div><div class="adv-opts">' +
        advOpt('goal','meat','meatSub') + advOpt('goal','caviar','caviarSub') + '</div>'; },
      weight: function () { var c = advCfg(); return '<div class="adv-q">' + advT('qWeight') + '</div><div class="adv-hint">' + advT('hWeight') + '</div>' +
        '<div class="adv-field"><input id="advWeight" type="number" min="0.1" max="' + c.maxWeight + '" step="any" inputmode="decimal" aria-label="' + advT('qWeight') + '" value="' + (ADV.weight === null ? '' : ADV.weight) + '" onkeydown="if(event.key===\'Enter\')advNext()"><span class="adv-unit">g</span></div>' +
        '<div class="adv-chips">' + c.chips.map(function (g) {
          return '<button type="button" class="adv-chip" onclick="document.getElementById(\'advWeight\').value=' + g + '">' + advNum(g) + ' g</button>'; }).join('') + '</div>' +
        '<div class="adv-err" id="advErr" role="alert"></div>'; },
      temp: function () { var t = advCfg().temps, lo = t[0], hi = t[t.length - 1];
        return '<div class="adv-q">' + advT('qTemp') + '</div><div class="adv-hint">' + advT('hTemp').replace('{min}', lo).replace('{max}', hi) + '</div>' +
        '<div class="adv-field"><input id="advTempRange" type="range" min="' + lo + '" max="' + hi + '" step="0.5" value="' + ADV.temp + '" aria-label="' + advT('qTemp') + '" oninput="document.getElementById(\'advTemp\').value=this.value">' +
        '<input id="advTemp" type="number" min="' + lo + '" max="' + hi + '" step="0.5" value="' + ADV.temp + '" class="adv-temp" aria-label="' + advT('qTemp') + '" oninput="document.getElementById(\'advTempRange\').value=this.value" onkeydown="if(event.key===\'Enter\')advNext()"><span class="adv-unit">°C</span></div>' +
        '<div class="adv-err" id="advErr" role="alert"></div>'; },
      system: function () { return '<div class="adv-q">' + advT('qSystem') + '</div><div class="adv-hint">' + advT('hSystem') + '</div><div class="adv-opts">' +
        advOpt('system','flow','flowSub') + advOpt('system','ras','rasSub') + '</div>'; },
      float: function () { return '<div class="adv-q">' + advT('qFloat') + '</div><div class="adv-hint">' + advT('hFloat') + '</div><div class="adv-opts">' +
        advOpt('float','sink','sinkSub') + advOpt('float','float','floatSub') + advOpt('float','any','anySub') + '</div>'; }
    };
    var ADV_INPUT_STEPS = { weight:true, temp:true };

    function renderAdvisor() {
      var body = document.getElementById('advisorBody');
      if (!body) return;
      if (ADV.done) { body.innerHTML = renderAdvisorResults(); return; }
      var path = advSteps(), id = path[ADV.step], bars = '';
      for (var i = 0; i <= path.length; i++) bars += '<i class="' + (i <= ADV.step ? 'on' : '') + '"></i>';
      body.innerHTML =
        '<h2 class="adv-title">' + advT('title') + '</h2>' +
        '<div class="adv-progress">' + bars + '</div>' + ADV_VIEWS[id]() +
        '<div class="adv-nav">' +
          '<button type="button" class="adv-back"' + (ADV.step ? '' : ' style="visibility:hidden"') + ' onclick="advBack()">' + advT('back') + '</button>' +
          (ADV_INPUT_STEPS[id] ? '<button type="button" class="btn btn-primary" onclick="advNext()">' + advT('next') + '</button>' : '<span></span>') +
        '</div>';
    }

    function advPick(key, val) {
      if (key === 'species') { ADV.species = val; ADV.purpose = null; ADV.goal = null; ADV.weight = null; ADV.system = null; ADV.floatPref = null; ADV.temp = advCfg().temp; }
      else if (key === 'purpose') { if (ADV.purpose !== val) { ADV.weight = null; ADV.system = null; ADV.floatPref = null; } ADV.purpose = val; ADV.temp = advCfg().temp; }
      else if (key === 'goal') ADV.goal = val;
      else if (key === 'system') ADV.system = val;
      else if (key === 'float') ADV.floatPref = val;
      advAdvance();
    }
    function advAdvance() {
      if (ADV.step >= advSteps().length - 1) {
        ADV.done = true;
        if (typeof gtag === 'function') gtag('event', 'feed_advisor_result', { species: ADV.species, purpose: ADV.purpose || ADV.goal || '', weight_g: ADV.weight || 0, system: ADV.system || '', feed_type: ADV.floatPref || '' });
      } else ADV.step++;
      renderAdvisor();
      var body = document.getElementById('advisorBody'); if (body) body.scrollTop = 0;
      advFocusFirst();
    }
    function advNext() {
      var id = advSteps()[ADV.step], err = document.getElementById('advErr'), c = advCfg();
      if (id === 'weight') {
        var w = parseFloat(String(document.getElementById('advWeight').value).replace(',', '.'));
        if (isNaN(w) || w < 0.1) { err.textContent = advT('errWeight'); return; }
        if (w > c.maxWeight) { err.textContent = advT('errWeightMax').replace('{max}', c.maxWeight); return; }
        ADV.weight = w;
      }
      if (id === 'temp') {
        var t = parseFloat(String(document.getElementById('advTemp').value).replace(',', '.')), lo = c.temps[0], hi = c.temps[c.temps.length - 1];
        if (isNaN(t) || t < lo || t > hi) { err.textContent = advT('errTemp').replace('{min}', lo).replace('{max}', hi); return; }
        ADV.temp = t;
      }
      advAdvance();
    }
    function advBack() {
      if (ADV.done) ADV.done = false; else if (ADV.step > 0) ADV.step--;
      renderAdvisor();
      advFocusFirst();
    }
    function advRestart() { openAdvisor(); }

    // Close the advisor and open the product in the regular product modal.
    function advOpenProduct(mid) {
      var hit = findMember(mid); if (!hit) return;
      closeAdvisor();
      openFamily(hit.f.id);
      if (hit.f.members.length > 1) openMember(hit.f.id, mid);
    }

    function advSummaryTags() {
      var tags = [advT(ADV.species)];
      if (ADV.purpose === 'brood') tags.push(advT('brood'));
      if (ADV.goal) tags.push(advT(ADV.goal));
      if (ADV.weight !== null) tags.push(advNum(ADV.weight) + ' g');
      if (advSteps().indexOf('temp') !== -1) tags.push(advNum(ADV.temp) + ' °C');
      if (ADV.system) tags.push(advT(ADV.system));
      if (ADV.floatPref && ADV.floatPref !== 'any') tags.push(advT(ADV.floatPref));
      return tags;
    }

    function renderAdvisorResults() {
      var list = advRecommend(), tags = advSummaryTags();
      list.sort(function (a, b) { return (b.rec ? 1 : 0) - (a.rec ? 1 : 0); }); // stable: keeps list order otherwise
      var h = '<h2 class="adv-title">' + advT('result') + '</h2>' +
        '<div class="adv-summary">' + tags.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</div>';
      if (!list.length) h += '<p class="adv-hint"><a href="contact.html" style="color:var(--bio-blue);font-weight:700;text-decoration:underline">' + advT('noMatch') + '</a>' +
        (ADV.floatPref && ADV.floatPref !== 'any' && advStage() === 'grower' ? ' ' + advT('noMatchFloat') : '') + '</p>';
      list.forEach(function (p) {
        var hit = findMember(p.id), f = hit.f, m = hit.m;
        var name = m.name.replace(/\s+—\s+.*$/, '');
        var row = feedingRow(p.id, ADV.weight), temps = feedingTemps(p.id);
        var badge = (p.rec ? '<span class="adv-badge adv-rec">' + advT('rec') + '</span> ' : '') + (p.float === true ? '<span class="adv-badge adv-float">' + advT('float') + '</span>'
                  : p.float === false ? '<span class="adv-badge adv-sink">' + advT('sink') + '</span>' : '');
        var quote = advT('quoteMsg').replace('{p}', name).replace('{d}', tags.join(', '));
        h += '<div class="adv-res"><img src="' + f.img + '" alt="' + name + '" loading="lazy"><div>' +
          '<h3>' + name + '</h3>' + badge + '<p class="adv-why">' + p.why[currentLang] + '</p>';
        if (row) {
          h += '<div class="adv-kv"><div><small>' + advT('pellet') + '</small><strong>' + advMM(row[2]) + '</strong></div>' +
            '<div><small>' + advT('ration') + '</small><strong>' + advNum(feedingRate(row[3], ADV.temp, temps), 2) + ' kg</strong> <span class="adv-why">' + advT('perDay') + '</span></div></div>' +
            '<details class="adv-details"><summary>' + advT('tableRow') + ' (' + advNum(row[0]) + ' – ' + advNum(row[1]) + ' g)</summary><div style="overflow-x:auto"><table><tr>' +
            temps.map(function (t) { return '<th>' + t + '°</th>'; }).join('') + '</tr><tr>' +
            row[3].map(function (v, k) { return '<td' + (Math.abs(temps[k] - ADV.temp) < 1 ? ' class="hl"' : '') + '>' + advNum(v, 2) + '</td>'; }).join('') +
            '</tr></table></div></details>';
        } else {
          h += '<div class="adv-kv"><div><small>' + advT('pellet') + '</small><strong>' + m.pellet + '</strong></div></div>' +
            '<div class="adv-missing">' + advT('tableSoon') + '</div>';
        }
        h += '<div class="adv-actions">' +
          '<button type="button" class="btn btn-outline" onclick="advOpenProduct(\'' + p.id + '\')">' + advT('details') + '</button>' +
          '<a class="btn btn-sky" href="' + shopForMember(f, m) + '" target="_blank" rel="noopener">' + advT('buy') + '</a>' +
          '<a class="btn btn-outline" href="contact.html?mesaj=' + encodeURIComponent(quote) + '">' + advT('quote') + '</a>' +
          '</div></div></div>';
      });
      h += '<p class="adv-note">' + advT('note') + '</p>' +
        (advIsTrout() ? '<div class="adv-ft"><b>' + advT('ftTitle') + '</b> ' + advT('ftText') + ' <a href="' + FEEDING_TOOL_URL + '" target="_blank" rel="noopener">BioMar Feeding Tool ↗</a></div>' : '') +
        '<div class="adv-nav"><button type="button" class="adv-back" onclick="advBack()">' + advT('back') + '</button>' +
        '<button type="button" class="btn btn-primary" onclick="advRestart()">' + advT('restart') + '</button></div>';
      return h;
    }

    // produse.html#alege-furajul opens the feed advisor directly (for links from other pages)
    document.addEventListener('DOMContentLoaded', function () {
      if (!document.getElementById('advisorModal')) return;
      if (location.hash === ADVISOR_HASH) openAdvisor();
      window.addEventListener('hashchange', function () { if (location.hash === ADVISOR_HASH) openAdvisor(); });
    });
