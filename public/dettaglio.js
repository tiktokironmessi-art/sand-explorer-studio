/* ============================================
   MUSEO DIGITALE DELLE SABBIE DEL MONDO
   Detail Page Script
   ============================================ */

const SAND_COLOR_MAP_D = {
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

function normalizeSandTypeD(name) {
  if (!name) return "";
  var cleaned = name.toLowerCase().trim()
    .replace(/\s*[-\/]\s*/g, "-")
    .replace(/\s+/g, " ");
  var aliases = {
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

function getSandColorD(name) {
  return SAND_COLOR_MAP_D[normalizeSandTypeD(name)] || "#D3D3D3";
}

function getContrastTextColorD(hex) {
  var c = hex.replace("#", "");
  var r = parseInt(c.substring(0, 2), 16);
  var g = parseInt(c.substring(2, 4), 16);
  var b = parseInt(c.substring(4, 6), 16);
  var toLinear = function(v) {
    var s = v / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  var L = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return 1.05 / (L + 0.05) >= (L + 0.05) / 0.05 ? "#FFFFFF" : "#111111";
}

/* --- Mobile Menu --- */
function initMobileMenuDetail() {
  var toggle = document.getElementById('menu-toggle');
  var overlay = document.getElementById('mobile-nav-overlay');
  var nav = document.getElementById('mobile-nav');
  if (!toggle || !nav) return;

  function openMenu() {
    nav.classList.add('active');
    if (overlay) overlay.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    nav.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', function () {
    var isOpen = nav.classList.contains('active');
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
  var header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function() {
      header.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }
})();

(function () {
  'use strict';

  var detailPage = document.getElementById('detail-page');
  var basePath = (function() {
    var path = window.location.pathname;
    if (path.includes('/museo/')) return '../';
    return '';
  })();

  function getSampleId() {
    var params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'), 10);
  }

  async function loadDetail() {
    var id = getSampleId();
    if (!id) { showError('ID campione non specificato.'); return; }

    try {
      var response = await fetch(basePath + 'dati.json');
      if (!response.ok) throw new Error('Errore nel caricamento dei dati');
      var campioni = await response.json();
      var campione = campioni.find(function(c){return c.id === id});

      if (!campione) { showError('Campione #' + id + ' non trovato.'); return; }

      document.title = campione.nome + ' — Museo delle Sabbie';
      renderDetail(campione, campioni);
    } catch (error) {
      showError(error.message);
    }
  }

  function showError(message) {
    detailPage.innerHTML =
      '<div class="detail-back"><a href="index.html" class="btn btn-back">← Torna alla collezione</a></div>' +
      '<div class="empty-state"><div class="empty-state-icon">⚠️</div><h3>Errore</h3><p>' + message + '</p></div>';
  }

  function metaItem(label, value) {
    if (!value) return '';
    return '<div class="metadata-item"><div class="metadata-label">' + label + '</div><div class="metadata-value">' + value + '</div></div>';
  }

  function imageBlock(src, alt, label, qrId) {
    return '<div class="detail-image-block">' +
      '<img src="' + basePath + src + '" alt="' + alt + '" onerror="this.src=\'' + basePath + 'images/coming-soon.jpg\';">' +
      '<div class="detail-image-label">' + label + '</div>' +
      '<div class="image-qr"><div class="qr-container image-qr-container" id="' + qrId + '" data-image-src="' + src + '"></div><p class="qr-note">QR Code immagine</p></div>' +
    '</div>';
  }

  function renderDetail(c, allCampioni) {
    var related = allCampioni
      .filter(function(s){return s.continente === c.continente && s.id !== c.id})
      .slice(0, 4);

    var sc = getSandColorD(c.tipologia);
    var tc = getContrastTextColorD(sc);

    var imagesHtml = imageBlock(c.immagine, 'Campione di sabbia: ' + c.nome, '📷 Immagine del campione', 'image-qr-main');
    var microscopeImages = [];
    if (c.microscopio && c.microscopio !== 'images/coming-soon.jpg') {
      microscopeImages.push({ src: c.microscopio, label: '🔬 Immagine al microscopio' });
    }
    if (Array.isArray(c.immagini_extra)) {
      c.immagini_extra.forEach(function(img) {
        if (img && img.src && !microscopeImages.some(function(existing) { return existing.src === img.src; })) {
          microscopeImages.push({ src: img.src, label: img.label || '🔬 Immagine al microscopio' });
        }
      });
    }
    imagesHtml += microscopeImages.map(function(img, index) {
      return imageBlock(img.src, img.label + ': ' + c.nome, img.label, 'image-qr-extra-' + index);
    }).join('');

    var tipologiaHtml = '<div class="metadata-item"><span class="metadata-label">Tipologia</span>' +
      '<span class="metadata-value sand-type-item" tabindex="0" role="listitem" data-sand-color="' + sc + '" data-sand-text="' + tc + '" style="background-color:' + sc + ';color:' + tc + ';padding:4px 12px;border-radius:20px;transition:all 0.3s ease;display:inline-flex;align-items:center;gap:6px;">' +
      '<span class="sand-swatch" style="width:9px;height:9px;border-radius:50%;background-color:' + sc + ';display:inline-block;transition:background-color 0.3s ease;"></span>' +
      c.tipologia + '</span></div>';

    detailPage.innerHTML =
      '<div class="detail-back"><a href="index.html" class="btn btn-back">← Torna alla collezione</a></div>' +
      '<div class="detail-header"><h1>' + c.nome + '</h1><p class="detail-header-location">📍 ' + c.provenienza + ' — ' + c.paese + ', ' + c.continente + '</p></div>' +
      '<div class="detail-content">' +
        '<div class="detail-images">' +
          imagesHtml +
        '</div>' +
        '<div class="detail-info">' +
          '<div class="detail-description"><h2>Descrizione</h2><p>' + c.descrizione + '</p></div>' +
          '<div class="detail-metadata"><h2>Scheda tecnica</h2><div class="metadata-grid">' +
            metaItem('Campione N°', c.id) +
            metaItem('Nome', c.nome) +
            metaItem('Provenienza', c.provenienza) +
            metaItem('Provincia', c.provincia) +
            metaItem('Isola', c.isola) +
            metaItem('Regione', c.regione) +
            metaItem('Bacino / Mare', c.bacino) +
            metaItem('Paese', c.paese) +
            metaItem('Continente', c.continente) +
            tipologiaHtml +
            metaItem('Anno di raccolta', c.anno) +
          '</div></div>' +
          '<div class="detail-qr"><h2>QR Code</h2><div class="qr-container" id="qr-code"></div><p class="qr-note">Scansiona per accedere a questa scheda dal tuo dispositivo</p></div>' +
        '</div>' +
      '</div>' +
      (related.length > 0 ? '<section class="related-section"><h2>Campioni correlati</h2><div class="related-grid">' +
        related.map(function(r) {
          var rsc = getSandColorD(r.tipologia);
          var rtc = getContrastTextColorD(rsc);
          return '<a href="dettaglio.html?id=' + r.id + '" class="card" aria-label="Vai al campione: ' + r.nome + '">' +
            '<div class="card-image-wrapper"><img class="card-image" src="' + basePath + r.immagine + '" alt="Campione: ' + r.nome + '" loading="lazy" onerror="this.src=\'' + basePath + 'images/coming-soon.jpg\';"><span class="card-badge">#' + r.id + '</span></div>' +
            '<div class="card-body"><h3 class="card-title">' + r.nome + '</h3><p class="card-location">📍 ' + r.provenienza + '</p>' +
            '<div class="card-meta"><span class="card-tag continent">' + r.continente + '</span><span class="card-tag">' + r.paese + '</span>' +
            '<li class="card-tag type sand-type-item" tabindex="0" role="listitem" data-sand-color="' + rsc + '" data-sand-text="' + rtc + '" style="background-color:' + rsc + ';color:' + rtc + ';transition:all 0.3s ease;"><span class="sand-swatch" style="background-color:' + rsc + ';transition:background-color 0.3s ease;"></span>' + r.tipologia + '</li>' +
            '</div></div></a>';
        }).join('') +
      '</div></section>' : '');

    generateQR(c.id);
    generateImageQRs();

    // Attach hover/focus listeners
    document.querySelectorAll('.sand-type-item').forEach(function(el) {
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

  function generateQR(id) {
    var qrContainer = document.getElementById('qr-code');
    if (!qrContainer) return;
    var pageUrl = window.location.href;

    if (typeof QRCode !== 'undefined') {
      new QRCode(qrContainer, {
        text: pageUrl, width: 180, height: 180,
        colorDark: '#2A2520', colorLight: '#FFFFFF',
        correctLevel: QRCode.CorrectLevel.M
      });
    } else {
      var img = document.createElement('img');
      img.src = 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=' + encodeURIComponent(pageUrl);
      img.alt = 'QR Code per questo campione';
      img.width = 180;
      img.height = 180;
      qrContainer.appendChild(img);
    }
  }

  function generateImageQRs() {
    document.querySelectorAll('.image-qr-container').forEach(function(container) {
      var imageSrc = container.dataset.imageSrc;
      if (!imageSrc) return;
      var imageUrl = new URL(basePath + imageSrc, window.location.href).href;

      if (typeof QRCode !== 'undefined') {
        new QRCode(container, {
          text: imageUrl, width: 120, height: 120,
          colorDark: '#2A2520', colorLight: '#FFFFFF',
          correctLevel: QRCode.CorrectLevel.M
        });
      } else {
        var img = document.createElement('img');
        img.src = 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=' + encodeURIComponent(imageUrl);
        img.alt = 'QR Code per immagine';
        img.width = 120;
        img.height = 120;
        container.appendChild(img);
      }
    });
  }

  initMobileMenuDetail();
  loadDetail();
})();
