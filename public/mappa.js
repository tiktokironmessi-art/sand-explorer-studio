/* ============================================
   MUSEO DIGITALE DELLE SABBIE DEL MONDO
   Interactive World Map
   ============================================ */

(function () {
  'use strict';

  /* Italian country name → ISO 3166-1 Alpha-3 */
  var COUNTRY_MAP = {
    'Algeria': 'DZA', 'Bahamas': 'BHS', 'Belgio': 'BEL', 'Belize': 'BLZ',
    'Benin': 'BEN', 'Brasile': 'BRA', 'Bulgaria': 'BGR', 'Cipro': 'CYP',
    'Costa Rica': 'CRI', 'Croazia': 'HRV', 'Cuba': 'CUB', 'Danimarca': 'DNK',
    'Ecuador': 'ECU', 'Egitto': 'EGY', 'Emirati Arabi': 'ARE', 'Estonia': 'EST',
    'Filippine': 'PHL', 'Francia': 'FRA', 'Giordania': 'JOR', 'Grecia': 'GRC',
    'India': 'IND', 'Indonesia': 'IDN', 'Irlanda': 'IRL', 'Islanda': 'ISL',
    'Israele': 'ISR', 'Italia': 'ITA', 'Kenia': 'KEN', 'Libano': 'LBN',
    'Libia': 'LBY', 'Lituania': 'LTU', 'Madagascar': 'MDG', 'Malesia': 'MYS',
    'Malta': 'MLT', 'Marocco': 'MAR', 'Messico': 'MEX', 'Myanmar': 'MMR',
    'Namibia': 'NAM', 'Nigeria': 'NGA', 'Norvegia': 'NOR', 'Paesi Bassi': 'NLD',
    'Pakistan': 'PAK', 'Perù': 'PER', 'Polonia': 'POL', 'Portogallo': 'PRT',
    'Regno Unito': 'GBR', 'Rep. delle Maldive': 'MDV', 'Rep. di Capo Verde': 'CPV',
    'Rep. di Mauritius': 'MUS', 'Repubblica Dominicana': 'DOM', 'Romania': 'ROU',
    'Senegal': 'SEN', 'Siria': 'SYR', 'Slovenia': 'SVN', 'Spagna': 'ESP',
    'Sri Lanka': 'LKA', 'Sudafrica': 'ZAF', 'Svezia': 'SWE', 'Tanzania': 'TZA',
    'Thailandia': 'THA', 'Tunisia': 'TUN', 'Turchia': 'TUR', 'USA': 'USA',
    'Ungheria': 'HUN', 'Uzbekistan': 'UZB', 'Venezuela': 'VEN', 'Vietnam': 'VNM',
    'Yemen': 'YEM'
  };

  /* Country flag emoji */
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

  /* Reverse map: ISO → Italian name */
  var ISO_TO_NAME = {};
  for (var k in COUNTRY_MAP) ISO_TO_NAME[COUNTRY_MAP[k]] = k;

  var map, geoLayer, countryData = {}, allCampioni = [];
  var mapContainer = document.getElementById('world-map');
  var mapTooltip = document.getElementById('map-tooltip');
  var mapBackBtn = document.getElementById('map-back-btn');
  var initialCenter = [25, 10];
  var initialZoom = 2;
  var isZoomed = false;

  if (!mapContainer) return;

  /* Theme colors */
  var COLOR_EMPTY = '#E8E0D5';
  var COLOR_HAS_1 = '#C9A87C';
  var COLOR_HAS_10 = '#A6854E';
  var COLOR_HAS_50 = '#7A6651';
  var COLOR_HAS_100 = '#5C4D3C';
  var COLOR_HOVER = '#B85C38';
  var COLOR_ACTIVE = '#9A4A2C';
  var COLOR_BORDER = '#FFFDF9';

  function getCountryColor(count) {
    if (!count || count === 0) return COLOR_EMPTY;
    if (count < 5) return COLOR_HAS_1;
    if (count < 20) return COLOR_HAS_10;
    if (count < 50) return COLOR_HAS_50;
    return COLOR_HAS_100;
  }

  function initMap(campioni) {
    allCampioni = campioni;

    /* Count samples per ISO code */
    campioni.forEach(function (c) {
      var iso = COUNTRY_MAP[c.paese];
      if (iso) {
        countryData[iso] = (countryData[iso] || 0) + 1;
      }
    });

    /* Create Leaflet map */
    map = L.map('world-map', {
      center: initialCenter,
      zoom: initialZoom,
      minZoom: 2,
      maxZoom: 6,
      zoomControl: true,
      attributionControl: false,
      scrollWheelZoom: true,
      worldCopyJump: true
    });

    /* Subtle tile layer */
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    /* Back button */
    if (mapBackBtn) {
      mapBackBtn.addEventListener('click', function() {
        map.flyTo(initialCenter, initialZoom, { duration: 0.8 });
        mapBackBtn.style.display = 'none';
        isZoomed = false;
      });
    }

    /* Load GeoJSON */
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json')
      .then(function (r) { return r.json(); })
      .then(function (topoData) {
        var geoData = topojson.feature(topoData, topoData.objects.countries);

        geoLayer = L.geoJSON(geoData, {
          style: function (feature) {
            var iso = getISO3(feature);
            var count = countryData[iso] || 0;
            return {
              fillColor: getCountryColor(count),
              weight: 1,
              color: COLOR_BORDER,
              fillOpacity: count > 0 ? 0.85 : 0.4
            };
          },
          onEachFeature: function (feature, layer) {
            var iso = getISO3(feature);
            var name = ISO_TO_NAME[iso];
            var count = countryData[iso] || 0;
            var flag = name ? (COUNTRY_FLAGS[name] || '') : '';

            layer.on({
              mouseover: function (e) {
                var l = e.target;
                l.setStyle({
                  fillColor: count > 0 ? COLOR_HOVER : '#D0C8BD',
                  weight: 2,
                  color: COLOR_HOVER,
                  fillOpacity: 0.9
                });
                l.bringToFront();
                if (mapTooltip && name) {
                  var thumbHtml = '';
                  if (count > 0) {
                    var firstSample = allCampioni.find(function(c) { return c.paese === name; });
                    if (firstSample && firstSample.immagine) {
                      var bp = window.location.pathname.includes('/museo/') ? '../' : '';
                      thumbHtml = '<img src="' + bp + firstSample.immagine + '" class="map-tooltip-thumb" alt="" onerror="this.style.display=\'none\'">';
                    }
                  }
                  mapTooltip.innerHTML =
                    '<div class="map-tooltip-header">' + flag + ' <strong>' + name + '</strong></div>' +
                    (count > 0 ? '<div class="map-tooltip-count">' + count + ' campion' + (count === 1 ? 'e' : 'i') + '</div>' : '<div class="map-tooltip-count"><em>Nessun campione</em></div>') +
                    thumbHtml;
                  mapTooltip.style.display = 'block';
                }
              },
              mouseout: function (e) {
                geoLayer.resetStyle(e.target);
                if (mapTooltip) mapTooltip.style.display = 'none';
              },
              mousemove: function (e) {
                if (mapTooltip) {
                  var rect = mapContainer.getBoundingClientRect();
                  mapTooltip.style.left = (e.originalEvent.clientX - rect.left + 14) + 'px';
                  mapTooltip.style.top = (e.originalEvent.clientY - rect.top - 10) + 'px';
                }
              },
              click: function () {
                if (name && count > 0) {
                  /* Smooth fly to country */
                  var bounds = layer.getBounds();
                  map.flyToBounds(bounds, { padding: [40, 40], duration: 0.8, maxZoom: 5 });
                  isZoomed = true;
                  if (mapBackBtn) mapBackBtn.style.display = 'block';

                  /* Set filter and scroll to gallery */
                  var filterPaese = document.getElementById('filter-paese');
                  if (filterPaese) {
                    filterPaese.value = name;
                    filterPaese.dispatchEvent(new Event('change'));
                  }
                  var collezione = document.getElementById('collezione');
                  if (collezione) {
                    setTimeout(function() {
                      collezione.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 400);
                  }
                }
              }
            });
          }
        }).addTo(map);
      })
      .catch(function (err) {
        console.error('Map load error:', err);
        mapContainer.innerHTML = '<p style="text-align:center;padding:2rem;color:#8C847B;">Impossibile caricare la mappa</p>';
      });
  }

  /* ISO3 numeric to alpha-3 lookup */
  var NUM_TO_ISO3 = {
    '12':'DZA','44':'BHS','56':'BEL','84':'BLZ','204':'BEN','76':'BRA',
    '100':'BGR','196':'CYP','188':'CRI','191':'HRV','192':'CUB','208':'DNK',
    '218':'ECU','818':'EGY','784':'ARE','233':'EST','608':'PHL','250':'FRA',
    '400':'JOR','300':'GRC','356':'IND','360':'IDN','372':'IRL','352':'ISL',
    '376':'ISR','380':'ITA','404':'KEN','422':'LBN','434':'LBY','440':'LTU',
    '450':'MDG','458':'MYS','470':'MLT','504':'MAR','484':'MEX','104':'MMR',
    '516':'NAM','566':'NGA','578':'NOR','528':'NLD','586':'PAK','604':'PER',
    '616':'POL','620':'PRT','826':'GBR','462':'MDV','132':'CPV','480':'MUS',
    '214':'DOM','642':'ROU','686':'SEN','760':'SYR','705':'SVN','724':'ESP',
    '144':'LKA','710':'ZAF','752':'SWE','834':'TZA','764':'THA','788':'TUN',
    '792':'TUR','840':'USA','348':'HUN','860':'UZB','862':'VEN','704':'VNM',
    '887':'YEM'
  };

  function getISO3(feature) {
    if (feature.properties && feature.properties.ISO_A3) return feature.properties.ISO_A3;
    var id = String(feature.id || feature.properties.id || '');
    return NUM_TO_ISO3[id] || '';
  }

  /* Expose init for script.js to call after data loads */
  window.initWorldMap = initMap;

})();