Interverrò solo sulla parte CSS della mappa per togliere le barre di scorrimento senza cambiare comportamento o funzionalità.

Cosa farò:
1. Lascerò intatta la mappa attuale: colori, confini, tooltip, click sui paesi, zoom con rotellina, pulsanti +/−, drag con mouse e touch.
2. Sistemerò il contenitore `.map-container` e `#world-map` per impedire qualsiasi scrollbar visibile dentro l’area della mappa.
3. Rimuoverò/normalizzerò le regole ridondanti o rischiose che possono creare overflow, in particolare le regole duplicate su `.map-container` presenti in più punti del CSS.
4. Applicherò `overflow: hidden` solo ai contenitori esterni della mappa, non in modo aggressivo ai layer interni SVG/Leaflet, così la mappa resta visibile e funzionante.
5. Verificherò che le altezze responsive restino quelle previste: desktop 520px, tablet 400px, mobile 260px.

Dettagli tecnici:
- File principale da modificare: `public/style.css`.
- Non toccherò `public/mappa.js` salvo necessità evidente, perché la logica interattiva attuale va mantenuta.
- Obiettivo preciso: niente barre per muoversi, ma panning/zoom e interazioni della mappa invariati.