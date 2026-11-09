import { html, raw } from './html.mjs';
import { icon } from './icons.mjs';

const NAV = [
  ['home', 'Home', '/'],
  ['explore', 'Explore', '/explore/'],
  ['education', 'Education', '/education/'],
  ['healthcare', 'Healthcare', '/healthcare/'],
  ['events', 'Events', '/events/'],
  ['artistic', 'Artistic corner', '/artistic-corner/'],
  ['news', 'News', '/news/'],
  ['information', 'Information', '/information/']
];

const TABS = [
  ['home', 'Home', '/', 'home'],
  ['explore', 'Explore', '/explore/', 'compass'],
  ['news', 'News', '/news/', 'news'],
  ['events', 'Events', '/events/', 'calendar'],
  ['menu', 'Menu', '/menu/', 'menu']
];

const MARK = `<svg class="brand__mark" viewBox="0 0 32 32" width="34" height="34" aria-hidden="true"><rect width="32" height="32" rx="10" fill="#1E2B6B"/><path d="M9 24V14.5a7 7 0 0 1 14 0V24" fill="none" stroke="#FFB020" stroke-width="3" stroke-linecap="round"/><circle cx="16" cy="19.5" r="2.3" fill="#fff"/></svg>`;

export function shell(ctx, o) {
  const { site, ads, v, year } = ctx;
  const base = site.url.replace(/\/$/, '');
  const url = base + o.path;
  const title = o.titleOnly ? o.title : `${o.title} | ${site.name}`;
  const desc = o.description || site.description;
  const active = o.active || '';
  const tabActive = ['home', 'explore', 'news', 'events'].includes(active) ? active : active ? 'menu' : '';
  const sticky = ads.sticky();
  const jsonld = o.jsonld ? JSON.stringify(o.jsonld).replace(/</g, '\\u003c') : '';
  const usesAdsense = String(o.body).includes('class="adsbygoogle"') || String(sticky).includes('class="adsbygoogle"');

  const footCols = ['discover', 'experience', 'connect'].map((pid) => {
    const p = site.pillars.find((x) => x.id === pid);
    return html`<div><h2 class="foot__h">${p.title}</h2><ul>${ctx.data.categories.filter((c) => c.pillar === pid).map((c) => html`<li><a href="${c.path}">${c.title}</a></li>`)}</ul></div>`;
  });

  const doc = html`<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${url}">
${o.noindex ? raw('<meta name="robots" content="noindex">') : ''}
<meta name="theme-color" content="#121A44">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${url}">
<meta name="twitter:card" content="summary">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="preload" href="/assets/fonts/bricolage-grotesque.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/instrument-sans.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/site.css?v=${v.css}">
${jsonld ? raw(`<script type="application/ld+json">${jsonld}</script>`) : ''}
${usesAdsense ? raw(`<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ads.cfg.adsense.client}" crossorigin="anonymous"></script>`) : ''}
</head>
<body class="${ads.cfg.sticky && ads.cfg.sticky.enabled ? 'has-sticky' : ''}">
<a class="skip" href="#main">Skip to content</a>
<header class="top">
  <div class="wrap top__in">
    <a class="brand" href="/" aria-label="${site.name}, home">${raw(MARK)}<span class="brand__name">${site.name}</span></a>
    <nav class="nav" aria-label="Main">${NAV.map(([k, label, href]) => html`<a class="nav__a" href="${href}" ${active === k ? raw('aria-current="page"') : ''}>${label}</a>`)}</nav>
    <a class="top__search" href="/search/" aria-label="Search">${icon('search', 22)}</a>
  </div>
</header>
<main id="main">
${o.body}
</main>
<footer class="foot">
  <div class="wrap">
    <div class="foot__top">
      <div>
        <p class="foot__name">${site.name}</p>
        <p class="foot__tag">${site.tagline}</p>
        <p class="foot__alt">${site.taglineAlt}</p>
      </div>
      <div class="foot__cols">
        ${footCols}
        <div><h2 class="foot__h">${site.name}</h2><ul>
          <li><a href="/about/">About the project</a></li>
          <li><a href="/about-raipur/">About Raipur</a></li>
          <li><a href="/advertise/">Advertise</a></li>
          <li><a href="/submit/">Add a listing or event</a></li>
          <li><a href="/privacy/">Privacy</a></li>
        </ul></div>
      </div>
    </div>
    <p class="foot__note">Sponsored content is always labelled and is never presented as an independent ranking. Listings marked "Details being verified" are still being checked, so please confirm timings and contact details before you travel.</p>
    <p class="foot__copy">${raw('&copy;')} ${year} ${site.name}</p>
  </div>
</footer>
${sticky}
<nav class="tabbar" aria-label="Primary">
${TABS.map(([k, label, href, ic]) => html`<a class="tab" href="${href}" ${tabActive === k ? raw('aria-current="page"') : ''}><span class="tab__ic">${icon(ic, 24)}</span><span class="tab__l">${label}</span></a>`)}
</nav>
<script src="/assets/site.js?v=${v.js}" defer></script>
</body>
</html>`;

  return '<!doctype html>\n' + doc.s;
}
