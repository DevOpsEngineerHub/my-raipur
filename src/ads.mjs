import { html, raw, esc } from './html.mjs';

const SIZE_HINT = {
  leaderboard: '728×90 on desktop, 320×100 on phones',
  rectangle: '300×250',
  anchor: '320×50'
};

export const SLOT_LABELS = {
  'home-top': 'Home page, top banner',
  'home-mid': 'Home page, middle',
  'home-lower': 'Home page, bottom banner',
  'list-top': 'Top of every listing page',
  'list-inline': 'Inside listing pages, after the third entry',
  'list-bottom': 'Bottom of every listing page',
  'article-mid': 'Inside About Raipur and Facts pages',
  sidebar: 'Sidebar on desktop',
  'sticky-bottom': 'Sticky bar at the bottom of phones'
};

export function createAds(cfg, today) {
  let adsenseUsed = false;
  const slots = cfg.slots || {};

  const inRange = (c) => (!c.start || today >= c.start) && (!c.end || today <= c.end);
  const findCampaign = (id) =>
    (cfg.campaigns || []).find(
      (c) => c.enabled !== false && (c.slots || (c.slot ? [c.slot] : [])).includes(id) && inRange(c)
    );

  function creative(c) {
    if (c.type === 'html') return raw(c.html || '');
    if (c.type === 'text') {
      return html`<a class="ad__link ad__text" href="${c.href}" target="_blank" rel="sponsored noopener noreferrer"><strong>${c.title}</strong><span>${c.text}</span>${c.cta ? html`<em>${c.cta}</em>` : ''}</a>`;
    }
    const img = html`<img src="${c.image}" alt="${c.alt || c.sponsor || 'Advertisement'}" loading="lazy" decoding="async">`;
    const pic = c.imageMobile
      ? html`<picture><source media="(max-width: 767px)" srcset="${c.imageMobile}">${img}</picture>`
      : img;
    return html`<a class="ad__link" href="${c.href}" target="_blank" rel="sponsored noopener noreferrer">${pic}</a>`;
  }

  function slot(id) {
    const def = slots[id];
    if (!def || def.enabled === false) return '';
    const size = def.size || 'rectangle';
    const camp = findCampaign(id);
    let state;
    let label = '';
    let inner = '';

    if (camp) {
      state = 'paid';
      label = camp.category === 'political' ? 'Political advertisement' : 'Sponsored';
      inner = html`${creative(camp)}${camp.category === 'political' && camp.sponsor ? html`<span class="ad__paid">Paid for by ${camp.sponsor}</span>` : ''}`;
    } else if (cfg.adsense && cfg.adsense.enabled && def.adsenseSlot) {
      adsenseUsed = true;
      state = 'adsense';
      label = 'Ad';
      inner = raw(
        `<ins class="adsbygoogle" style="display:block" data-ad-client="${esc(cfg.adsense.client)}" data-ad-slot="${esc(def.adsenseSlot)}" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script>`
      );
    } else if (cfg.houseAds !== false) {
      state = 'house';
      label = 'Advertise';
      inner = html`<a class="ad__house" href="/advertise/"><strong>Advertise here</strong><span>Reach people across Raipur</span>${cfg.showSizeHints ? html`<small>${SIZE_HINT[size] || ''}</small>` : ''}</a>`;
    } else {
      state = 'empty';
    }

    return html`<aside class="ad ad--${size} ad--${state}" data-slot="${id}"${def.desktopOnly ? raw(' data-desktop-only') : ''} aria-label="Advertisement">${label ? html`<span class="ad__label">${label}</span>` : ''}${inner}</aside>`;
  }

  function sticky() {
    if (!cfg.sticky || !cfg.sticky.enabled) return '';
    return html`<div class="sticky-ad" data-sticky-ad>${slot('sticky-bottom')}<button class="sticky-ad__x" type="button" data-dismiss aria-label="Close ad">${raw('&times;')}</button></div>`;
  }

  return {
    cfg,
    slot,
    sticky,
    slotIds: () => Object.keys(slots),
    sizeHint: (size) => SIZE_HINT[size] || '',
    usedAdsense: () => adsenseUsed
  };
}
