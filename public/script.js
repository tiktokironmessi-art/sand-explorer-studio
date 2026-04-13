/* ============================================
   MUSEO DIGITALE DELLE SABBIE DEL MONDO
   Main Script — Home Page
   ============================================ */

/* --- Country Flag Emoji Lookup --- */
var COUNTRY_FLAGS = {
  'Algeria':'🇩🇿','Bahamas':'🇧🇸','Belgio':'🇧🇪','Belize':'🇧🇿','Benin':'🇧🇯',
  'Brasile':'🇧🇷','Bulgaria':'🇧🇬','Cipro':'🇨🇾','Costa Rica':'🇨🇷','Croazia':'🇭🇷',
  'Cuba':'🇨🇺','Danimarca':'🇩🇰','Ecuador':'🇪🇨','Egitto':'🇪🇬','Emirati Arabi':'🇦🇪',
  'Estonia':'🇪🇪','Filippine':'🇵🇭','Francia':'🇫🇷','Giordania':'🇯🇴','Grecia':'🇬🇷',
  'India':'🇮🇳','Indonesia':'🇮🇩','Irlanda':'🇮🇪','Islanda':'🇮🇸','Israele':'🇮🇱',
  'Italia':'🇮🇹','Kenia':'🇰🇪','Libano':'🇱🇧','Libia':'🇱🇾','Lituania':'🇱🇹',
  'Madagascar':'🇲🇬','Malesia':'🇲🇾','Malta':'🇲🇹','Marocco':'🇲🇦','Messico':'🇲🇽',
  'Myanmar':'🇲🇲','Namibia':'🇳🇦','Nigeria':'🇳🇬','Norvegia':'🇳🇴','Paesi Bassi':'🇳🇱',
  'Pakistan':'🇵🇰','Perù':'🇵🇪','Polonia':'🇵🇱','Portogallo':'🇵🇹','Regno Unito':'🇬🇧',
  'Rep. delle Maldive':'🇲🇻','Rep. di Capo Verde':'🇨🇻','Rep. di Mauritius':'🇲🇺',
  'Repubblica Dominicana':'🇩🇴','Romania':'🇷🇴','Senegal':'🇸🇳','Siria':'🇸🇾',
  'Slovenia':'🇸🇮','Spagna':'🇪🇸','Sri Lanka':'🇱🇰','Sudafrica':'🇿🇦','Svezia':'🇸🇪',
  'Tanzania':'🇹🇿','Thailandia':'🇹🇭','Tunisia':'🇹🇳','Turchia':'🇹🇷','USA':'🇺🇸',
  'Ungheria':'🇭🇺','Uzbekistan':'🇺🇿','Venezuela':'🇻🇪','Vietnam':'🇻🇳','Yemen':'🇾🇪'
};

const SAND_COLOR_MAP = {
  cava: "#2E8B57",
  desertica: "#EDC9AF",
  eolicadesertica: "#F4A460",
  fluviale: "#708090",
  lacustre: "#ADD8E6",
  lagunare: "#20B2AA",
  marina: "#0077BE",
  marinafluviale: "#5F9EA0",
  marinavulcanica: "#483D8B",
  montagna: "#8B4513",
  nonspecificata: "#D3D3D3",
  torrentizia: "#4682B4",
  vulcanica: "#333333",
};

function normalizeSandType(name) {
  if (!name) return "";
  const cleaned = name.toLowerCase().trim()
    .replace(/\s*[-\/]\s*/g, "-")
    .replace(/\s+/g, " ");
  const aliases = {
    "montana": "montagna",
    "eolica-desertica": "eolicadesertica",
    "eolica desertica": "eolicadesertica",
    "marina-fluviale": "marinafluviale",
    "marina-vulcanica": "marinavulcanica",
    "non specificata": "nonspecificata",
  };
  if (aliases[cleaned]) return aliases[cleaned];
  return cleaned.replace(/[-\/ ]/g, "");
}

function getSandColor(name) {
  return SAND_COLOR_MAP[normalizeSandType(name)] || "#D3D3D3";
}

function getContrastTextColor(hex) {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const toLinear = (v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const L = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return 1.05 / (L + 0.05) >= (L + 0.05) / 0.05 ? "#FFFFFF" : "#111111";
}

/* --- Mobile Menu --- */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const overlay = document.getElementById('mobile-nav-overlay');
  const nav = document.getElementById('mobile-nav');
  if (!toggle || !nav) return;

  function openMenu() {
    nav.classList.add('active');
    nav.setAttribute('aria-hidden', 'false');
    if (overlay) overlay.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    nav.classList.remove('active');
    nav.setAttribute('aria-hidden', 'true');
    if (overlay) overlay.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', function () {
    const isOpen = nav.classList.contains('active');
    isOpen ? closeMenu() : openMenu();
  });

  if (overlay) overlay.addEventListener('click', closeMenu);

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
}

/* --- Header glass effect on scroll --- */
(function() {
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function() {
      header.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }
})();

/* --- Curiosità del giorno --- */
(function() {
  var curiosita = [
    "La sabbia del Sahara viene trasportata dal vento fino all'Amazzonia, fertilizzando la foresta pluviale.",
    "Ogni granello di sabbia impiega in media 200 milioni di anni per formarsi dalla roccia madre.",
    "Esistono sabbie di oltre 20 colori diversi: bianche, nere, rosa, verdi, rosse e persino viola.",
    "Le spiagge di sabbia nera, come quelle islandesi, sono formate da basalto vulcanico eroso.",
    "Un solo cucchiaino di sabbia può contenere fino a 8.000 granelli individuali.",
    "La sabbia rosa delle Bermuda deve il suo colore ai gusci di foraminiferi, organismi marini microscopici.",
    "Il deserto del Gobi ha sabbie che 'cantano': le dune emettono suoni a bassa frequenza quando il vento le attraversa."
  ];
  var el = document.getElementById('curiosita-text');
  if (el) {
    el.textContent = curiosita[Math.floor(Math.random() * curiosita.length)];
  }
})();

(function () {
  'use strict';

  let campioni = [];
  let filteredCampioni = [];
  let currentView = 'grid';

  const galleryGrid = document.getElementById('gallery-grid');
  const searchInput = document.getElementById('search-input');
  const filterContinente = document.getElementById('filter-continente');
  const filterPaese = document.getElementById('filter-paese');
  const filterTipologia = document.getElementById('filter-tipologia');
  const btnReset = document.getElementById('btn-reset');
  const resultsCount = document.getElementById('results-count');
  const filterBadges = document.getElementById('filter-badges');
  const viewToggle = document.getElementById('view-toggle');

  const basePath = (function() {
    const path = window.location.pathname;
    if (path.includes('/museo/')) return '../';
    return '';
  })();

  /* --- View Toggle --- */
  if (viewToggle) {
    viewToggle.querySelectorAll('.view-toggle-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var view = btn.dataset.view;
        if (view === currentView) return;
        currentView = view;
        viewToggle.querySelectorAll('.view-toggle-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        if (galleryGrid) {
          galleryGrid.classList.toggle('gallery-list', view === 'list');
        }
        renderGallery();
      });
    });
  }

  /* --- Load Data --- */
  async function loadData() {
    try {
      const response = await fetch(basePath + 'dati.json');
      if (!response.ok) throw new Error('Errore nel caricamento dei dati');
      campioni = await response.json();
      filteredCampioni = [...campioni];
      galleryGrid.setAttribute('aria-busy', 'false');
      populateFilters();
      renderGallery();
      if (typeof window.initWorldMap === 'function') {
        window.initWorldMap(campioni);
      }
    } catch (error) {
      galleryGrid.setAttribute('aria-busy', 'false');
      galleryGrid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">⚠️</div><h3>Errore di caricamento</h3><p>Impossibile caricare la collezione. Riprova più tardi.</p></div>';
    }
  }

  /* --- Populate Filter Dropdowns --- */
  function populateFilters() {
    var continenti = [...new Set(campioni.map(function(c){return c.continente}).filter(Boolean))].sort();
    var tipologie = [...new Set(campioni.map(function(c){return c.tipologia}).filter(Boolean))].sort();

    continenti.forEach(function(c) {
      var opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      filterContinente.appendChild(opt);
    });

    tipologie.forEach(function(t) {
      var opt = document.createElement('option');
      opt.value = t;
      opt.textContent = t;
      filterTipologia.appendChild(opt);
    });

    updatePaesiDropdown();
  }

  function updatePaesiDropdown() {
    var selectedContinente = filterContinente.value;
    var currentPaese = filterPaese.value;

    var paesi = [...new Set(
      campioni
        .filter(function(c){return !selectedContinente || c.continente === selectedContinente})
        .map(function(c){return c.paese})
        .filter(Boolean)
    )].sort();

    filterPaese.innerHTML = '<option value="">Tutti i paesi</option>';
    paesi.forEach(function(p) {
      var opt = document.createElement('option');
      opt.value = p;
      opt.textContent = (COUNTRY_FLAGS[p] || '') + ' ' + p;
      if (p === currentPaese) opt.selected = true;
      filterPaese.appendChild(opt);
    });
  }

  /* --- Render Filter Badges --- */
  function renderFilterBadges() {
    if (!filterBadges) return;
    var badges = [];
    var continente = filterContinente.value;
    var paese = filterPaese.value;
    var tipologia = filterTipologia.value;
    var search = searchInput.value.trim();

    if (search) {
      badges.push('<span class="filter-badge">🔍 ' + search + ' <button class="filter-badge-x" data-filter="search" aria-label="Rimuovi filtro ricerca">✕</button></span>');
    }
    if (continente) {
      badges.push('<span class="filter-badge">🌍 ' + continente + ' <button class="filter-badge-x" data-filter="continente" aria-label="Rimuovi filtro continente">✕</button></span>');
    }
    if (paese) {
      var flag = COUNTRY_FLAGS[paese] || '🏳️';
      badges.push('<span class="filter-badge">' + flag + ' ' + paese + ' <button class="filter-badge-x" data-filter="paese" aria-label="Rimuovi filtro paese">✕</button></span>');
    }
    if (tipologia) {
      badges.push('<span class="filter-badge">🏖️ ' + tipologia + ' <button class="filter-badge-x" data-filter="tipologia" aria-label="Rimuovi filtro tipologia">✕</button></span>');
    }

    filterBadges.innerHTML = badges.join('');

    filterBadges.querySelectorAll('.filter-badge-x').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var f = btn.dataset.filter;
        if (f === 'search') searchInput.value = '';
        if (f === 'continente') { filterContinente.value = ''; updatePaesiDropdown(); }
        if (f === 'paese') filterPaese.value = '';
        if (f === 'tipologia') filterTipologia.value = '';
        applyFilters();
      });
    });
  }

  /* --- Apply Filters --- */
  function applyFilters() {
    var searchTerm = searchInput.value.toLowerCase().trim();
    var continente = filterContinente.value;
    var paese = filterPaese.value;
    var tipologia = filterTipologia.value;

    filteredCampioni = campioni.filter(function(c) {
      if (searchTerm) {
        var searchable = [c.nome, c.provenienza, c.paese, c.continente, c.bacino, c.tipologia]
          .filter(Boolean).join(' ').toLowerCase();
        if (!searchable.includes(searchTerm)) return false;
      }
      if (continente && c.continente !== continente) return false;
      if (paese && c.paese !== paese) return false;
      if (tipologia && c.tipologia !== tipologia) return false;
      return true;
    });

    renderFilterBadges();
    renderGallery();
  }

  /* --- Reset Filters --- */
  function resetFilters() {
    searchInput.value = '';
    filterContinente.value = '';
    filterPaese.value = '';
    filterTipologia.value = '';
    updatePaesiDropdown();
    filteredCampioni = [...campioni];
    renderFilterBadges();
    renderGallery();
  }

  /* --- Render Gallery --- */
  function renderGallery() {
    var total = campioni.length;
    var shown = filteredCampioni.length;
    resultsCount.innerHTML = shown === total
      ? '<strong>' + total + '</strong> campioni nella collezione'
      : '<strong>' + shown + '</strong> di ' + total + ' campioni';

    if (shown === 0) {
      galleryGrid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🔍</div><h3>Nessun campione trovato</h3><p>Prova a modificare i filtri o la ricerca per trovare altri campioni.</p></div>';
      return;
    }

    if (currentView === 'list') {
      galleryGrid.innerHTML = filteredCampioni.map(function(c, i) {
        var sandColor = getSandColor(c.tipologia);
        var textColor = getContrastTextColor(sandColor);
        var flag = COUNTRY_FLAGS[c.paese] || '';
        return '<a href="dettaglio.html?id=' + c.id + '" class="card card-list" style="animation-delay: ' + Math.min(i * 0.03, 0.3) + 's" aria-label="Scheda dettaglio: ' + c.nome + '">' +
          '<div class="card-list-image">' +
            '<img class="card-image" src="' + basePath + c.immagine + '" alt="' + c.nome + '" loading="lazy" onerror="this.src=\'' + basePath + 'images/coming-soon.jpg\';">' +
          '</div>' +
          '<div class="card-list-body">' +
            '<h3 class="card-title">' + c.nome + '</h3>' +
            '<p class="card-location">' + flag + ' ' + c.provenienza + ' — ' + c.paese + ', ' + c.continente + '</p>' +
            '<div class="card-meta">' +
              '<span class="card-tag continent">' + c.continente + '</span>' +
              '<span class="card-tag">' + flag + ' ' + c.paese + '</span>' +
              '<span class="card-tag type" style="background-color:' + sandColor + ';color:' + textColor + ';">' +
                '<span class="sand-swatch" style="background-color:' + sandColor + ';"></span>' + c.tipologia +
              '</span>' +
            '</div>' +
          '</div>' +
          '<span class="card-list-id">#' + c.id + '</span>' +
        '</a>';
      }).join('');
    } else {
      galleryGrid.innerHTML = filteredCampioni.map(function(c, i) {
        var sandColor = getSandColor(c.tipologia);
        var textColor = getContrastTextColor(sandColor);
        var flag = COUNTRY_FLAGS[c.paese] || '';
        return '<a href="dettaglio.html?id=' + c.id + '" class="card" style="animation-delay: ' + Math.min(i * 0.05, 0.4) + 's" aria-label="Scheda dettaglio: ' + c.nome + '">' +
          '<div class="card-image-wrapper">' +
            '<img class="card-image" src="' + basePath + c.immagine + '" alt="Campione di sabbia: ' + c.nome + ', ' + c.provenienza + '" loading="lazy" onerror="this.src=\'' + basePath + 'images/coming-soon.jpg\'; this.alt=\'Immagine non disponibile\';">' +
            '<span class="card-badge">#' + c.id + '</span>' +
          '</div>' +
          '<div class="card-body">' +
            '<h3 class="card-title">' + c.nome + '</h3>' +
            '<p class="card-location">' + flag + ' ' + c.provenienza + '</p>' +
            '<div class="card-meta">' +
              '<span class="card-tag continent">' + c.continente + '</span>' +
              '<span class="card-tag">' + flag + ' ' + c.paese + '</span>' +
              '<span class="card-tag type sand-type-item" tabindex="0" role="listitem" data-sand-color="' + sandColor + '" data-sand-text="' + textColor + '" style="background-color: ' + sandColor + '; color: ' + textColor + '; transition: all 0.3s ease;">' +
                '<span class="sand-swatch" style="background-color: ' + sandColor + '; transition: background-color 0.3s ease;"></span>' +
                c.tipologia +
              '</span>' +
            '</div>' +
          '</div>' +
        '</a>';
      }).join('');
    }

    // Attach hover/focus listeners
    galleryGrid.querySelectorAll('.sand-type-item').forEach(function(el) {
      var color = el.dataset.sandColor;
      var swatch = el.querySelector('.sand-swatch');

      var activate = function() {
        el.style.boxShadow = '0 2px 8px ' + color + '66';
        if (swatch) swatch.style.transform = 'scale(1.3)';
      };
      var deactivate = function() {
        el.style.boxShadow = 'none';
        if (swatch) swatch.style.transform = 'scale(1)';
      };

      el.addEventListener('mouseenter', activate);
      el.addEventListener('mouseleave', deactivate);
      el.addEventListener('focus', activate);
      el.addEventListener('blur', deactivate);
    });
  }

  /* --- Event Listeners --- */
  searchInput.addEventListener('input', applyFilters);
  filterContinente.addEventListener('change', function () {
    updatePaesiDropdown();
    applyFilters();
  });
  filterPaese.addEventListener('change', applyFilters);
  filterTipologia.addEventListener('change', applyFilters);
  btnReset.addEventListener('click', resetFilters);

  /* --- Init --- */
  initMobileMenu();
  loadData();
})();

/* --- Animated Stat Counters --- */
(function () {
  const statEls = document.querySelectorAll('.hero-stat-number[data-target]');
  if (!statEls.length) return;

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1500;
    let start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statEls.forEach(function (el) { observer.observe(el); });
})();