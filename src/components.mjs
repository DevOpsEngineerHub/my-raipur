import { html, raw } from './html.mjs';
import { icon } from './icons.mjs';

export const mapsUrl = (q) => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const initials = (name) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
export { initials };

export function badges(item) {
  const out = [];
  if (item.sponsored) out.push(html`<span class="badge badge--sponsored">Sponsored</span>`);
  if (item.sample) out.push(html`<span class="badge badge--sample">Sample</span>`);
  else if (item.verified !== true) out.push(html`<span class="badge badge--verify">Details being verified</span>`);
  return out;
}

// A listing in a category page. `cat` is the category it belongs to (gives the colour and icon).
export function listingRow(l, cat) {
  const q = l.map || [l.name, l.area, 'Raipur'].filter(Boolean).join(', ');
  const b = badges(l);
  return html`<article class="item ${l.sponsored ? 'item--sponsored' : ''}" id="${l.id}" data-item data-area="${l.area || ''}">
  <span class="thumb" data-pillar="${cat.pillar}">${icon(cat.icon, 26)}</span>
  <div class="item__body">
    <h3 class="item__title">${l.name}</h3>
    <p class="item__meta">${l.area ? html`<span class="where">${icon('pin', 16)}${l.area}</span>` : ''}${l.kind ? html`<span class="kind">${l.kind}</span>` : ''}</p>
    <p class="item__sum">${l.summary}</p>
    ${l.tags && l.tags.length ? html`<ul class="tags">${l.tags.map((t) => html`<li>${t}</li>`)}</ul>` : ''}
    ${b.length ? html`<p class="item__badges">${b}</p>` : ''}
    <div class="item__act">
      ${l.sample ? '' : html`<a class="btn btn--small btn--ghost" href="${mapsUrl(q)}" target="_blank" rel="noopener">${icon('pin', 18)}Open in Maps</a>`}
      ${l.url ? html`<a class="btn btn--small btn--ghost" href="${l.url}" target="_blank" rel="noopener">${icon('external', 18)}Website</a>` : ''}
    </div>
    ${l.source ? html`<p class="item__src">Source: ${l.sourceUrl ? html`<a href="${l.sourceUrl}" target="_blank" rel="noopener">${l.source}</a>` : l.source}</p>` : ''}
  </div>
</article>`;
}

// Card used in the "Places to start with" scroller on the home page.
export function pickCard(l, cat) {
  return html`<a class="pick" href="${cat.path}#${l.id}" data-pillar="${cat.pillar}">
  <span class="pick__art" aria-hidden="true">${icon(cat.icon, 40)}</span>
  <span class="pick__body">
    <span class="pick__kind">${l.kind || 'Place'}</span>
    <span class="pick__t">${l.name}</span>
    ${l.area ? html`<span class="pick__w">${icon('pin', 16)}${l.area}</span>` : ''}
  </span>
</a>`;
}

export function eventRow(e) {
  const [, m, d] = e.date.split('-').map(Number);
  return html`<article class="item event" data-item data-cat="${e.category || ''}">
  <time class="date" datetime="${e.date}"><span class="date__m">${MONTHS[m - 1]}</span><span class="date__d">${d}</span></time>
  <div class="item__body">
    <h3 class="item__title">${e.url ? html`<a href="${e.url}" target="_blank" rel="noopener">${e.title}</a>` : e.title}</h3>
    <p class="item__meta">${e.time ? html`<span class="where">${icon('clock', 16)}${e.time}</span>` : ''}${e.venue ? html`<span class="where">${icon('pin', 16)}${e.venue}</span>` : ''}</p>
    <p class="item__badges">${e.organiser ? html`<span class="by">By ${e.organiser}</span>` : ''}${e.category ? html`<span class="badge">${e.category}</span>` : ''}${e.sample ? html`<span class="badge badge--sample">Sample</span>` : ''}</p>
  </div>
</article>`;
}

export function newsRow(n) {
  const link = n.url && n.url !== '#';
  return html`<article class="item news" data-item data-city="${n.city || ''}" data-topic="${n.topic || ''}">
  <div class="item__body">
    <h3 class="item__title">${link ? html`<a href="${n.url}" target="_blank" rel="noopener">${n.title}</a>` : n.title}</h3>
    ${n.summary ? html`<p class="item__sum">${n.summary}</p>` : ''}
    <p class="item__badges"><span class="news__src">${n.source}</span>${n.city ? html`<span class="badge">${n.city}</span>` : ''}${n.topic ? html`<span class="badge badge--topic">${n.topic}</span>` : ''}${n.sample ? html`<span class="badge badge--sample">Sample</span>` : ''}</p>
  </div>
</article>`;
}

// One headline inside the "Today in Raipur" card.
export function briefItem(n) {
  const link = n.url && n.url !== '#';
  return html`<li><span class="brief__t">${link ? html`<a href="${n.url}" target="_blank" rel="noopener">${n.title}</a>` : n.title}</span><span class="brief__m"><span class="badge">${n.city || 'Raipur'}</span><span class="brief__src">${n.source}</span></span></li>`;
}

export function artistRow(a) {
  return html`<article class="item artist" data-item data-craft="${a.craft || ''}">
  <span class="avatar" aria-hidden="true">${initials(a.name)}</span>
  <div class="item__body">
    <h3 class="item__title">${a.url ? html`<a href="${a.url}" target="_blank" rel="noopener">${a.name}</a>` : a.name}</h3>
    <p class="item__badges"><span class="badge">${a.craft}</span>${a.sample ? html`<span class="badge badge--sample">Sample</span>` : ''}</p>
    <p class="item__sum">${a.bio}</p>
  </div>
</article>`;
}

export function pageHead({ title, lead, icon: ic, pillar, back }) {
  return html`<header class="phead" data-pillar="${pillar || 'discover'}"><div class="wrap">
  ${back ? html`<a class="phead__back" href="${back.href}">${icon('back', 18)}${back.label}</a>` : ''}
  <div class="phead__row">${ic ? html`<span class="phead__ic">${icon(ic, 28)}</span>` : ''}<h1>${title}</h1></div>
  ${lead ? html`<p class="phead__lead">${lead}</p>` : ''}
</div></header>`;
}

export const emptyState = ({ title, text, cta }) =>
  html`<div class="empty"><span class="empty__ic">${icon('plus', 24)}</span><h2>${title}</h2><p>${text}</p>${cta || ''}</div>`;

export const sampleNote = (text) => html`<p class="note"><strong>Sample content.</strong> ${text}</p>`;

export const chipBar = (key, target, values, label) =>
  html`<div class="chips" role="group" aria-label="${label || 'Filter'}" data-filter="${target}" data-key="${key}"><button class="chip is-on" type="button" data-v="*" aria-pressed="true">All</button>${values.map((v) => html`<button class="chip" type="button" data-v="${v}" aria-pressed="false">${v}</button>`)}</div>`;

export const submitBtn = (type, label, ghost) =>
  html`<a class="btn ${ghost ? 'btn--ghost' : ''}" href="/submit/?type=${type}">${icon('plus', 18)}${label}</a>`;

// Big tappable row that links to a section.
export const navRow = (c) =>
  html`<a class="navrow" href="${c.path}" data-pillar="${c.pillar}"><span class="thumb">${icon(c.icon, 24)}</span><span class="navrow__t"><strong>${c.title}</strong>${c.lead ? html`<span>${c.lead}</span>` : ''}</span>${icon('chevron', 20)}</a>`;

export { raw };
