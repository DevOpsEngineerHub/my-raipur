// Illustrated hero scene: Raipur at dusk. Flat shapes only, drawn in code so it stays sharp on any screen.
// The scene is 1200 wide so it can be cropped: phones show the centre (about x 405 to 795), desktops show more.

function rng(seed) {
  return () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
}

function skyline(x0, x1, base, minH, maxH, minW, maxW, fill, opacity, seed) {
  const r = rng(seed);
  let x = x0;
  let d = `M${x0} ${base}`;
  while (x < x1) {
    const w = Math.round(minW + r() * (maxW - minW));
    const h = Math.round(minH + r() * (maxH - minH));
    d += `V${base - h}H${x + w}`;
    x += w;
  }
  d += `V${base}Z`;
  return `<path d="${d}" fill="${fill}" opacity="${opacity}"/>`;
}

function windows(x, y, cols, rows, gap, seed) {
  const r = rng(seed);
  let out = '';
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (r() > 0.55) out += `<rect x="${x + i * gap}" y="${y + j * gap}" width="2.4" height="3" rx=".5"/>`;
    }
  }
  return `<g fill="#FFB020" opacity=".65">${out}</g>`;
}

function tree(x, h, r) {
  return `<rect x="${x - 1.4}" y="${180 - h}" width="2.8" height="${h}"/><circle cx="${x}" cy="${180 - h}" r="${r}"/><circle cx="${x - r * 0.7}" cy="${180 - h + r * 0.5}" r="${r * 0.75}"/><circle cx="${x + r * 0.7}" cy="${180 - h + r * 0.5}" r="${r * 0.75}"/>`;
}

function towers(x, scale) {
  const t = [
    [0, 76, 18],
    [20, 94, 14],
    [36, 62, 22],
    [60, 100, 12],
    [74, 70, 16]
  ];
  let out = '';
  let win = '';
  t.forEach(([dx, h, w], i) => {
    out += `<rect x="${x + dx * scale}" y="${180 - h}" width="${w}" height="${h}"/>`;
    win += windows(x + dx * scale + 3, 180 - h + 6, Math.max(1, Math.floor((w - 4) / 5)), Math.floor((h - 10) / 8), 5.2, 7 + i);
  });
  return `<g fill="#171F5E">${out}</g>${win}`;
}

export function heroArt() {
  const far = skyline(0, 1200, 182, 14, 54, 12, 30, '#6A45A8', 0.5, 11);
  const near = skyline(0, 1200, 182, 10, 36, 16, 38, '#43329A', 0.75, 29);

  return `<svg class="hero__art" viewBox="0 0 1200 210" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
<defs>
  <linearGradient id="lakeg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2B4FA3"/><stop offset="1" stop-color="#121B5C"/></linearGradient>
  <radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFC24D" stop-opacity=".6"/><stop offset="1" stop-color="#FFB020" stop-opacity="0"/></radialGradient>
</defs>
<circle cx="690" cy="122" r="120" fill="url(#glow)"/>
<circle cx="690" cy="122" r="35" fill="#FFB020"/>
${far}
${near}
<g fill="#171F5E">
  <!-- Clock tower -->
  <rect x="459" y="112" width="22" height="68"/>
  <rect x="455" y="107" width="30" height="6"/>
  <path d="M458 107 L470 82 L482 107Z"/>
  <rect x="469" y="70" width="2" height="13"/>
  <!-- Temple with spires -->
  <path d="M526 180V150H594V180Z"/>
  <path d="M534 150C534 128 546 112 560 82C574 112 586 128 586 150Z"/>
  <path d="M520 150C520 141 527 133 531 120C535 133 542 141 542 150Z"/>
  <path d="M578 150C578 141 585 133 589 120C593 133 600 141 600 150Z"/>
  <circle cx="560" cy="78" r="3.2"/>
  <rect x="559" y="64" width="2" height="12"/>
  <path d="M561 64L571 68L561 72Z"/>
</g>
<circle cx="470" cy="126" r="6.5" fill="#FFB020"/>
<path d="M470 126v-4M470 126l3 2.2" stroke="#171F5E" stroke-width="1.2" fill="none" stroke-linecap="round"/>
<rect x="553" y="162" width="14" height="18" rx="7" fill="#FFB020" opacity=".6"/>
<g stroke="#2E3B9A" stroke-width="1.2" fill="none" opacity=".9"><path d="M548 150C548 136 553 124 560 108"/><path d="M572 150C572 136 567 124 560 108"/></g>
${towers(742, 1)}
${towers(302, 0.9)}
${towers(930, 1)}
<g fill="#13305A">
  ${tree(414, 22, 10)}${tree(437, 17, 8)}${tree(508, 16, 8)}${tree(622, 26, 11)}${tree(646, 19, 9)}${tree(706, 14, 7)}
  ${tree(190, 20, 10)}${tree(1010, 22, 10)}${tree(1040, 16, 8)}
</g>
<rect y="176" width="1200" height="34" fill="url(#lakeg)"/>
<g fill="#FFB020">
  <rect x="668" y="183" width="44" height="3" rx="1.5" opacity=".75"/>
  <rect x="674" y="190" width="32" height="3" rx="1.5" opacity=".6"/>
  <rect x="680" y="197" width="20" height="3" rx="1.5" opacity=".45"/>
</g>
<g fill="#fff" opacity=".16">
  <rect x="420" y="184" width="36" height="2" rx="1"/><rect x="500" y="192" width="48" height="2" rx="1"/>
  <rect x="560" y="186" width="30" height="2" rx="1"/><rect x="760" y="190" width="52" height="2" rx="1"/>
  <rect x="860" y="184" width="34" height="2" rx="1"/><rect x="330" y="190" width="44" height="2" rx="1"/>
  <rect x="470" y="199" width="26" height="2" rx="1"/><rect x="610" y="198" width="40" height="2" rx="1"/>
</g>
<path d="M0 210V198Q22 184 48 196Q66 188 88 200V210Z" fill="#0E1650"/>
<path d="M1200 210V196Q1176 182 1150 195Q1130 187 1108 199V210Z" fill="#0E1650"/>
</svg>`;
}
