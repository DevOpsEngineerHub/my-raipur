import { html, raw } from './html.mjs';
import { icon } from './icons.mjs';
import { shell } from './layout.mjs';
import { heroArt } from './art.mjs';
import { SLOT_LABELS } from './ads.mjs';
import * as C from './components.mjs';

const HUBS = {
  explore: { title: 'Explore Raipur', icon: 'compass', path: '/explore/', lead: 'Food, shopping and places to visit, all in one place.' },
  education: { title: 'Education', icon: 'cap', path: '/education/', lead: 'Schools, colleges and training institutes across Raipur.' },
  healthcare: { title: 'Healthcare', icon: 'health', path: '/healthcare/', lead: 'Doctors by specialisation, and major hospitals.' }
};

const QUICK = [
  ['cafes', 'Cafes'],
  ['street-food', 'Street food'],
  ['shopping', 'Shopping'],
  ['doctors', 'Doctors'],
  ['schools', 'Schools'],
  ['places', 'Places'],
  ['events', 'Events'],
  ['news', 'News']
];

const EDITION = { morning: 'Morning brief', evening: 'Evening brief' };

const fmtTime = (iso) =>
  new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }).format(new Date(iso));
const fmtDate = (isoDate) =>
  new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(new Date(isoDate + 'T00:00:00+05:30'));

export function buildPages(ctx) {
  const { site, ads, data, today } = ctx;
  const cats = data.categories;
  const catOf = (id) => cats.find((c) => c.id === id);
  const listingsOf = (id) => data.listings.filter((l) => l.category === id);
  const pages = [];
  const page = (path, o) => pages.push({ path, noindex: o.noindex, html: shell(ctx, { path, ...o }) });
  const anySample = (arr) => arr.some((x) => x.sample);

  const aside = () => html`<aside class="side">
  ${ads.slot('sidebar')}
  <div class="side__card">
    <h2>Own a business in Raipur?</h2>
    <p>Get listed, or reach local customers with a clearly labelled ad.</p>
    <a class="btn" href="/advertise/">${icon('megaphone', 18)}Advertise</a>
    <a class="btn btn--ghost" href="/submit/">${icon('plus', 18)}Add a listing</a>
  </div>
</aside>`;

  const withSide = (main) => html`<div class="wrap cols"><div class="cols__main">${main}</div>${aside()}</div>`;

  // ---------------------------------------------------------------- home
  const briefItems = data.news.items.slice(0, 4);
  const edition = EDITION[data.news.edition] || 'Latest news';
  const updated = data.news.updated ? `Updated ${fmtTime(data.news.updated)}` : '';
  const upcoming = data.events.items.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const places = listingsOf('places');
  const face = data.faces.current;

  const pillarCard = (p) => html`<section class="pcard" data-pillar="${p.id}" aria-labelledby="p-${p.id}">
  <h3 id="p-${p.id}">${p.title}</h3>
  <p>${p.purpose}</p>
  <div class="pcard__links">${cats.filter((c) => c.pillar === p.id).map((c) => html`<a class="pill" href="${c.path}">${icon(c.icon, 18)}${c.title}</a>`)}</div>
</section>`;

  page('/', {
    title: `${site.name}: ${site.tagline}`,
    titleOnly: true,
    description: site.description,
    active: 'home',
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: site.name,
      url: site.url,
      potentialAction: { '@type': 'SearchAction', target: site.url + '/search/?q={search_term_string}', 'query-input': 'required name=search_term_string' }
    },
    body: html`
<div class="wrap">
  <section class="hero">
    <div class="hero__in">
      <p class="hero__greet" data-greeting>Welcome</p>
      <h1>Everything Raipur, in one place.</h1>
      <p class="hero__sub">Places, food, doctors, events and news from across the city.</p>
      <form class="search" action="/search/" role="search">
        <label class="sr" for="hq">Search My Raipur</label>
        ${icon('search', 22)}
        <input id="hq" name="q" type="search" placeholder="Search Raipur" autocomplete="off">
        <button type="submit">Search</button>
      </form>
    </div>
    ${raw(heroArt())}
  </section>

  <nav class="quick" aria-label="Shortcuts">
    ${QUICK.map(([id, label]) => { const c = catOf(id); return html`<a href="${c.path}" data-pillar="${c.pillar}"><span class="quick__ic">${icon(c.icon, 26)}</span><span>${label}</span></a>`; })}
  </nav>

  <section class="brief" aria-labelledby="brief-h">
    <header class="brief__head">
      <div>
        <h2 id="brief-h">Today in Raipur</h2>
        <p class="brief__sub"><span class="pill pill--sun"><span data-today>${edition}</span></span><span>${edition}${updated ? `, ${updated.toLowerCase()}` : ''}</span></p>
      </div>
    </header>
    ${briefItems.length
      ? html`<ul class="brief__list">${briefItems.map(C.briefItem)}</ul>`
      : html`<p class="brief__empty">The morning and evening briefs will appear here.</p>`}
    ${anySample(briefItems) ? html`<p class="brief__note">Sample headlines, for layout testing only.</p>` : ''}
    <a class="btn btn--block btn--ghost" href="/news/">Read all news</a>
  </section>

  ${ads.slot('home-top')}

  ${places.length ? html`<section class="block" aria-labelledby="start-h">
    <header class="sechead"><h2 id="start-h">Places to start with</h2><a class="link" href="/explore/places/">See all</a></header>
    <div class="scroller">${places.slice(0, 6).map((l) => C.pickCard(l, catOf('places')))}</div>
  </section>` : ''}

  ${upcoming.length ? html`<section class="block" aria-labelledby="up-h">
    <header class="sechead"><h2 id="up-h">Coming up</h2><a class="link" href="/events/">All events</a></header>
    <div class="panel">${upcoming.slice(0, 3).map(C.eventRow)}</div>
  </section>` : ''}

  ${ads.slot('home-mid')}

  <section class="block" aria-labelledby="all-h">
    <header class="sechead"><h2 id="all-h">Explore by section</h2></header>
    <div class="pcards">${site.pillars.map(pillarCard)}</div>
  </section>

  ${face ? html`<section class="block" aria-labelledby="face-h">
    <header class="sechead"><h2 id="face-h">Face of the month</h2><a class="link" href="/faces/">Read more</a></header>
    <a class="face-card" href="/faces/">
      <span class="avatar avatar--lg" aria-hidden="true">${C.initials(face.name)}</span>
      <span class="face-card__t"><strong>${face.name}</strong><span>${face.role}</span>${face.sample ? html`<span class="badge badge--sample">Sample</span>` : ''}</span>
    </a>
  </section>` : ''}

  <section class="band">
    <h2>Run a business, school, clinic or event in Raipur?</h2>
    <p>Basic listings are free. Featured placements and ads are always clearly labelled.</p>
    <div class="band__act">
      <a class="btn btn--sun" href="/submit/">${icon('plus', 18)}Add a listing</a>
      <a class="btn btn--light" href="/advertise/">${icon('megaphone', 18)}Advertise</a>
    </div>
  </section>

  ${ads.slot('home-lower')}
</div>`
  });

  // ---------------------------------------------------------------- hubs
  for (const [hid, hub] of Object.entries(HUBS)) {
    const hubCats = cats.filter((c) => c.hub === hid);
    page(hub.path, {
      title: hub.title,
      description: hub.lead,
      active: hid,
      body: html`
${C.pageHead({ title: hub.title, lead: hub.lead, icon: hub.icon, pillar: hubCats[0] ? hubCats[0].pillar : 'discover' })}
${withSide(html`
  <div class="navrows">${hubCats.map(C.navRow)}</div>
  ${ads.slot('list-top')}
  ${hubCats.map((c) => {
    const items = listingsOf(c.id).slice(0, 3);
    if (!items.length) return '';
    return html`<section class="block"><header class="sechead"><h2>${c.title}</h2><a class="link" href="${c.path}">See all</a></header>
      <div class="panel">${items.map((l) => C.listingRow(l, c))}</div></section>`;
  })}
  ${ads.slot('list-bottom')}
`)}`
    });
  }

  // ---------------------------------------------------------------- category listing pages
  for (const c of cats.filter((x) => !x.custom)) {
    const items = listingsOf(c.id);
    const areas = [...new Set(items.map((i) => i.area).filter(Boolean))];
    const hub = HUBS[c.hub];
    page(c.path, {
      title: c.title,
      description: c.lead,
      active: c.hub,
      body: html`
${C.pageHead({ title: c.title, lead: c.lead, icon: c.icon, pillar: c.pillar, back: { href: hub.path, label: hub.title } })}
${withSide(html`
  ${anySample(items) ? C.sampleNote('Placeholder entries show how listings will look. They are removed from the live site.') : ''}
  ${areas.length > 1 ? C.chipBar('area', '#list', areas, 'Filter by area') : ''}
  ${ads.slot('list-top')}
  ${items.length
    ? html`<div class="panel" id="list">${items.map((l, i) => html`${i === 3 ? ads.slot('list-inline') : ''}${C.listingRow(l, c)}`)}<p class="none" data-none hidden>Nothing matches this filter.</p></div>`
    : C.emptyState({
        title: c.emptyTitle,
        text: c.emptyText,
        cta: html`${c.specialties ? html`<ul class="spec" aria-label="Specialisations planned">${c.specialties.map((s) => html`<li>${s}</li>`)}</ul>` : ''}${C.submitBtn(c.id, 'Send a suggestion')}`
      })}
  ${items.length ? html`<p class="suggest">Missing something? ${C.submitBtn(c.id, 'Suggest an addition', true)}</p>` : ''}
  ${ads.slot('list-bottom')}
`)}`
    });
  }

  // ---------------------------------------------------------------- events
  {
    const all = data.events.items;
    const up = all.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
    const past = all.filter((e) => e.date < today).sort((a, b) => b.date.localeCompare(a.date));
    const cs = (data.events.categories || []).filter((x) => all.some((e) => e.category === x));
    page('/events/', {
      title: 'Events in Raipur',
      description: 'Concerts, comedy shows, college fests, workshops, food festivals and community events in Raipur.',
      active: 'events',
      body: html`
${C.pageHead({ title: 'Events in Raipur', lead: 'Concerts, shows, fests, workshops and community gatherings. Organisers can send events for review.', icon: 'calendar', pillar: 'experience' })}
${withSide(html`
  ${anySample(all) ? C.sampleNote('These events are placeholders. Replace data/events.json with real events.') : ''}
  ${cs.length > 1 ? C.chipBar('cat', '#events', cs, 'Filter by type') : ''}
  ${ads.slot('list-top')}
  <div id="events">
    <h2 class="subh">Upcoming</h2>
    ${up.length ? html`<div class="panel">${up.map(C.eventRow)}</div>` : C.emptyState({ title: 'No upcoming events yet', text: 'Organising something? Send it in and we will publish it after a quick check.', cta: C.submitBtn('event', 'Submit an event') })}
    <p class="none" data-none hidden>Nothing matches this filter.</p>
    ${past.length ? html`<h2 class="subh">Past</h2><div class="panel">${past.map(C.eventRow)}</div>` : ''}
  </div>
  <p class="suggest">Organiser? ${C.submitBtn('event', 'Submit an event', true)}</p>
  ${ads.slot('list-bottom')}
`)}`
    });
  }

  // ---------------------------------------------------------------- this week
  {
    const tw = data.thisWeek;
    page('/this-week/', {
      title: 'Things to do this week',
      description: 'Quick recommendations for the coming days and weekend in Raipur.',
      active: 'events',
      body: html`
${C.pageHead({ title: 'Things to do this week', lead: tw.weekOf ? `Picks for the week of ${fmtDate(tw.weekOf)}.` : 'Quick ideas for the coming days.', icon: 'sparkle', pillar: 'experience', back: { href: '/events/', label: 'Events' } })}
${withSide(html`
  ${anySample(tw.items) ? C.sampleNote('Placeholder picks. Update data/this-week.json every few days.') : ''}
  ${ads.slot('list-top')}
  ${tw.items.length
    ? html`<div class="panel">${tw.items.map((i) => html`<article class="item"><span class="thumb" data-pillar="experience">${icon('sparkle', 26)}</span><div class="item__body"><h3 class="item__title">${i.title}</h3><p class="item__meta"><span class="kind">${i.kind}</span></p><p class="item__sum">${i.note}</p>${i.sample ? html`<p class="item__badges"><span class="badge badge--sample">Sample</span></p>` : ''}</div></article>`)}</div>`
    : C.emptyState({ title: 'This week’s picks are coming', text: 'Fresh ideas land here every few days.' })}
  <p class="suggest">Seen something worth sharing? ${C.submitBtn('event', 'Tell us', true)}</p>
  ${ads.slot('list-bottom')}
`)}`
    });
  }

  // ---------------------------------------------------------------- artistic corner
  {
    const a = data.artists;
    const crafts = (a.crafts || []).filter((x) => a.items.some((i) => i.craft === x));
    page('/artistic-corner/', {
      title: 'Artistic corner',
      description: 'A showcase for Raipur’s painters, poets, singers, photographers and other creative people.',
      active: 'artistic',
      body: html`
${C.pageHead({ title: 'Artistic corner', lead: 'A space for local talent: paintings, poetry, music, photography and creative projects.', icon: 'palette', pillar: 'connect' })}
${withSide(html`
  ${anySample(a.items) ? C.sampleNote('Placeholder artists. Always get an artist’s permission before publishing their work.') : ''}
  ${crafts.length > 1 ? C.chipBar('craft', '#artists', crafts, 'Filter by craft') : ''}
  ${ads.slot('list-top')}
  ${a.items.length
    ? html`<div class="panel" id="artists">${a.items.map(C.artistRow)}<p class="none" data-none hidden>Nothing matches this filter.</p></div>`
    : C.emptyState({ title: 'The gallery is opening soon', text: 'Painters, poets, singers and photographers from Raipur will be featured here.', cta: C.submitBtn('artist', 'Showcase your work') })}
  <p class="suggest">Are you an artist? ${C.submitBtn('artist', 'Showcase your work', true)}</p>
  ${ads.slot('list-bottom')}
`)}`
    });
  }

  // ---------------------------------------------------------------- faces
  {
    const f = data.faces;
    const cur = f.current;
    page('/faces/', {
      title: 'Face of the month',
      description: 'Each month, My Raipur features an inspiring person from the city.',
      active: 'faces',
      body: html`
${C.pageHead({ title: 'Face of the month', lead: 'One person from Raipur each month: a photograph, a short biography and an interview.', icon: 'camera', pillar: 'connect' })}
${withSide(html`
  ${cur ? html`<article class="feature">
    <span class="avatar avatar--xl" aria-hidden="true">${C.initials(cur.name)}</span>
    <p class="feature__month">${cur.month}</p>
    <h2>${cur.name}</h2>
    <p class="feature__role">${cur.role}${cur.sample ? html` <span class="badge badge--sample">Sample</span>` : ''}</p>
    <p>${cur.bio}</p>
    ${cur.interviewUrl ? html`<a class="btn" href="${cur.interviewUrl}" target="_blank" rel="noopener">${icon('external', 18)}Read the interview</a>` : ''}
  </article>` : C.emptyState({ title: 'The first Face of the Month is coming', text: 'We feature one inspiring person from Raipur every month, always with their consent.' })}
  ${ads.slot('list-top')}
  <h2 class="subh">Earlier faces</h2>
  ${f.archive.length ? html`<div class="panel">${f.archive.map((p) => html`<article class="item"><span class="avatar" aria-hidden="true">${C.initials(p.name)}</span><div class="item__body"><h3 class="item__title">${p.name}</h3><p class="item__meta"><span class="kind">${p.month}</span></p><p class="item__sum">${p.role}</p></div></article>`)}</div>` : html`<p class="muted">Past profiles will be collected here.</p>`}
  <p class="suggest">Know someone inspiring? ${C.submitBtn('face', 'Nominate someone', true)}</p>
  <p class="muted">We publish a profile only with the person’s consent for the photograph and interview.</p>
  ${ads.slot('list-bottom')}
`)}`
    });
  }

  // ---------------------------------------------------------------- news
  {
    const n = data.news;
    const citiesPresent = site.cities.filter((c) => n.items.some((i) => i.city === c));
    const topicsPresent = site.topics.filter((t) => n.items.some((i) => i.topic === t));
    page('/news/', {
      title: 'News gallery: Raipur and Chhattisgarh',
      description: 'Headlines from Raipur and across Chhattisgarh by city and topic, with links to the original reports.',
      active: 'news',
      body: html`
${C.pageHead({ title: 'News gallery', lead: `${EDITION[n.edition] || 'Latest news'}${n.updated ? `, updated ${fmtTime(n.updated)} on ${fmtDate(n.updated.slice(0, 10))}` : ''}. Refreshed every morning and evening.`, icon: 'news', pillar: 'connect' })}
${withSide(html`
  ${anySample(n.items) ? C.sampleNote('Placeholder headlines. Replace data/news.json with real stories each morning and evening.') : ''}
  ${citiesPresent.length > 1 ? C.chipBar('city', '#news', citiesPresent, 'Filter by city') : ''}
  ${topicsPresent.length > 1 ? C.chipBar('topic', '#news', topicsPresent, 'Filter by topic') : ''}
  ${ads.slot('list-top')}
  ${n.items.length
    ? html`<div class="panel" id="news">${n.items.map((it, i) => html`${i === 4 ? ads.slot('list-inline') : ''}${C.newsRow(it)}`)}<p class="none" data-none hidden>Nothing matches these filters.</p></div>`
    : C.emptyState({ title: 'The next brief is on its way', text: 'Headlines are added every morning and evening.' })}
  <p class="muted">My Raipur curates headlines and links to the original reporters. Open a story to read it on the publisher’s site.</p>
  ${ads.slot('list-bottom')}
`)}`
    });
  }

  // ---------------------------------------------------------------- information
  {
    const info = data.info;
    const callRow = (r) => html`<li><a class="call" href="tel:${r.number}"><span class="call__ic">${icon('phone', 20)}</span><span class="call__l">${r.label}${r.note ? html`<small>${r.note}</small>` : ''}</span><span class="call__n">${r.display || r.number}</span></a></li>`;
    const linkRow = (r) => html`<li>${r.url ? html`<a class="linkrow" href="${r.url}" target="_blank" rel="noopener"><span>${r.label}${r.note ? html`<small>${r.note}</small>` : ''}</span>${icon('external', 18)}</a>` : html`<div class="linkrow"><span>${r.label}${r.note ? html`<small>${r.note}</small>` : ''}</span></div>`}</li>`;
    page('/information/', {
      title: 'Information corner',
      description: 'Emergency numbers, power and water services, government portals and transport information for Raipur.',
      active: 'information',
      body: html`
${C.pageHead({ title: 'Information corner', lead: 'Everyday information for residents: emergency numbers, services and official websites.', icon: 'info', pillar: 'connect' })}
${withSide(html`
  <p class="note">${info.lastChecked ? html`Last checked on ${fmtDate(info.lastChecked)}.` : html`<strong>Review pending.</strong> These numbers and links are widely published but must be checked before launch. Set lastChecked in data/information.json once done.`}</p>
  <h2 class="subh">Emergency numbers</h2>
  <ul class="calls">${info.emergency.map(callRow)}</ul>
  ${ads.slot('list-top')}
  <h2 class="subh">Electricity</h2>
  <ul class="calls">${info.power.map(callRow)}</ul>
  <h2 class="subh">Government websites</h2>
  <ul class="linkrows">${info.portals.map(linkRow)}</ul>
  <h2 class="subh">Transport</h2>
  <ul class="linkrows">${info.transport.map(linkRow)}</ul>
  <p class="suggest">Spotted something outdated? ${C.submitBtn('correction', 'Report a correction', true)}</p>
  ${ads.slot('list-bottom')}
`)}`
    });
  }

  // ---------------------------------------------------------------- old raipur
  {
    const o = data.oldRaipur;
    page('/old-raipur/', {
      title: 'Old Raipur gallery',
      description: 'How Raipur looked in earlier decades, with photographs and memories from residents.',
      active: 'old-raipur',
      body: html`
${C.pageHead({ title: 'Old Raipur gallery', lead: 'How the city looked in earlier decades, told through photographs and memories from residents.', icon: 'image', pillar: 'connect' })}
${withSide(html`
  ${o.items.length
    ? html`<div class="gallery">${o.items.filter((p) => p.permission).map((p) => html`<figure><img src="${p.image}" alt="${p.title}" loading="lazy"><figcaption><strong>${p.title}</strong><span>${p.decade}${p.location ? `, ${p.location}` : ''}</span><span class="muted">Shared by ${p.contributor}</span></figcaption></figure>`)}</div>`
    : C.emptyState({
        title: 'Share the Raipur you remember',
        text: 'This gallery is built by residents. Send an old photograph and tell us a little about it.',
        cta: C.submitBtn('photo', 'Send a photograph')
      })}
  <h2 class="subh">What to include with each photo</h2>
  <ul class="checks">
    <li>${icon('check', 18)}Where it was taken</li>
    <li>${icon('check', 18)}The approximate year or decade</li>
    <li>${icon('check', 18)}Your name, so we can credit you</li>
    <li>${icon('check', 18)}Your permission for us to publish it</li>
  </ul>
  ${ads.slot('list-bottom')}
`)}`
    });
  }

  // ---------------------------------------------------------------- about raipur + facts
  {
    const h = data.history;
    page('/about-raipur/', {
      title: 'About Raipur',
      description: 'The history, culture and landmarks of Raipur, the capital of Chhattisgarh.',
      active: 'about-raipur',
      body: html`
${C.pageHead({ title: 'About Raipur', lead: 'The capital of Chhattisgarh, and a city with a long history behind it.', icon: 'map', pillar: 'connect' })}
${withSide(html`
  <p class="lead">Raipur is the capital of Chhattisgarh. Its story runs from ancient Kosal and the Somavanshi rulers of Sirpur, through the Kalchuri and Bhosle eras, to the British commissionery of 1854 and the creation of the state.</p>
  <h2 class="subh">A short timeline</h2>
  <ol class="timeline">${h.items.map((i) => html`<li><span class="timeline__when">${i.when}</span><p>${i.what}${i.needsSource ? html` <span class="badge badge--verify">Source to be added</span>` : ''}</p></li>`)}</ol>
  <p class="muted">Source: <a href="${h.sourceUrl}" target="_blank" rel="noopener">${h.source}</a>, summarised in our own words.</p>
  ${ads.slot('article-mid')}
  <h2 class="subh">Keep exploring</h2>
  <div class="navrows">${['places', 'day-trips', 'street-food', 'facts'].map((id) => C.navRow(catOf(id)))}</div>
  ${ads.slot('list-bottom')}
`)}`
    });

    page('/raipur-facts/', {
      title: 'Raipur facts',
      description: 'Interesting, sourced facts about Raipur: history, landmarks and milestones.',
      active: 'about-raipur',
      body: html`
${C.pageHead({ title: 'Raipur facts', lead: 'Short facts about the city. Each one carries its source, so you can check it.', icon: 'bulb', pillar: 'connect', back: { href: '/about-raipur/', label: 'About Raipur' } })}
${withSide(html`
  <div class="panel">${data.facts.items.map((f, i) => html`${i === 3 ? ads.slot('article-mid') : ''}<article class="item"><div class="item__body"><p class="fact">${f.fact}</p><p class="item__src">${f.sourceUrl ? html`Source: <a href="${f.sourceUrl}" target="_blank" rel="noopener">${f.source}</a>` : html`<span class="badge badge--verify">Source to be added</span>`}</p></div></article>`)}</div>
  <p class="suggest">Know a fact we should add? ${C.submitBtn('correction', 'Send it with a source', true)}</p>
  ${ads.slot('list-bottom')}
`)}`
    });
  }

  // ---------------------------------------------------------------- menu
  page('/menu/', {
    title: 'Menu',
    description: 'Everything on My Raipur.',
    active: 'menu',
    body: html`
${C.pageHead({ title: 'Everything on My Raipur', icon: 'menu' })}
<div class="wrap menu">
  ${site.pillars.map((p) => html`<section class="block"><header class="sechead"><h2>${p.title}</h2></header><div class="navrows">${cats.filter((c) => c.pillar === p.id).map(C.navRow)}</div></section>`)}
  ${ads.slot('list-top')}
  <section class="block"><header class="sechead"><h2>${site.name}</h2></header>
    <div class="linkrows">
      <a class="linkrow" href="/about/"><span>About the project</span>${icon('info', 18)}</a>
      <a class="linkrow" href="/advertise/"><span>Advertise with us</span>${icon('megaphone', 18)}</a>
      <a class="linkrow" href="/submit/"><span>Add a listing, event or photo</span>${icon('plus', 18)}</a>
      <a class="linkrow" href="/privacy/"><span>Privacy</span>${icon('info', 18)}</a>
    </div>
  </section>
</div>`
  });

  // ---------------------------------------------------------------- search
  page('/search/', {
    title: 'Search',
    description: 'Search places, listings and events on My Raipur.',
    active: 'search',
    noindex: true,
    body: html`
${C.pageHead({ title: 'Search', icon: 'search' })}
<div class="wrap search-page">
  <form class="search search--light" action="/search/" role="search">
    <label class="sr" for="q">Search My Raipur</label>
    ${icon('search', 22)}
    <input id="q" name="q" type="search" placeholder="Search Raipur" autocomplete="off" autofocus>
    <button type="submit">Search</button>
  </form>
  <div id="results" class="results" aria-live="polite"></div>
  <noscript><p class="muted">Search needs JavaScript. You can also browse everything from the <a href="/menu/">menu</a>.</p></noscript>
  ${ads.slot('list-bottom')}
</div>`
  });

  // ---------------------------------------------------------------- submit
  page('/submit/', {
    title: 'Add a listing, event or photo',
    description: 'Send a business, event, artist, photograph or correction to My Raipur.',
    active: 'submit',
    body: html`
${C.pageHead({ title: 'Send us something', lead: 'Listings, events, artists, old photographs or corrections. We check everything before it goes live.', icon: 'plus' })}
<div class="wrap narrow">
  <form class="form" data-submit-form data-email="${site.contact.email}" data-wa="${site.contact.whatsapp}">
    <label for="f-type">What are you sending?</label>
    <select id="f-type" name="type">
      <option value="listing">A business, school, clinic or place</option>
      <option value="event">An event</option>
      <option value="artist">My artwork or performance</option>
      <option value="face">A Face of the Month nomination</option>
      <option value="photo">An old Raipur photograph</option>
      <option value="correction">A correction or update</option>
      <option value="other">Something else</option>
    </select>
    <label for="f-name">Name of the place, event or person</label>
    <input id="f-name" name="name" type="text" required autocomplete="off">
    <label for="f-details">Details</label>
    <textarea id="f-details" name="details" rows="5" placeholder="Address or area, timings, what makes it worth listing, links" required></textarea>
    <label for="f-contact">Your phone or email</label>
    <input id="f-contact" name="contact" type="text" autocomplete="off">
    <div class="form__act">
      <button class="btn" type="submit">${icon('mail', 18)}Send by email</button>
      ${site.contact.whatsapp ? html`<button class="btn btn--ghost" type="button" data-wa-btn>${icon('chat', 18)}Send on WhatsApp</button>` : ''}
    </div>
    <p class="muted">This opens your email app with your message ready to send. Nothing is stored on this website.</p>
  </form>
</div>`
  });

  // ---------------------------------------------------------------- advertise
  {
    const slotRows = ads.slotIds().map((id) => {
      const def = ads.cfg.slots[id];
      return html`<tr><th scope="row">${SLOT_LABELS[id] || id}</th><td>${ads.sizeHint(def.size)}</td></tr>`;
    });
    page('/advertise/', {
      title: 'Advertise with My Raipur',
      description: 'Reach people across Raipur with featured listings, banners and sponsored placements.',
      active: 'advertise',
      body: html`
${C.pageHead({ title: 'Advertise with My Raipur', lead: 'Put your business, institute, event or campaign in front of people who are looking for something in Raipur.', icon: 'megaphone', pillar: 'experience' })}
<div class="wrap narrow">
  <h2 class="subh">What you can buy</h2>
  <ul class="plain">
    <li><strong>Featured listing.</strong> Your business is highlighted in its category.</li>
    <li><strong>Sponsored placement.</strong> A banner or in-feed spot, labelled Sponsored.</li>
    <li><strong>Event promotion.</strong> Extra visibility for your event before it happens.</li>
    <li><strong>Premium business profile.</strong> More photos, offers and links.</li>
    <li><strong>Educational promotion.</strong> Admissions campaigns for schools, colleges and institutes.</li>
  </ul>
  <h2 class="subh">Ad spaces</h2>
  <div class="tablewrap"><table class="table"><thead><tr><th scope="col">Where</th><th scope="col">Size</th></tr></thead><tbody>${slotRows}</tbody></table></div>
  <h2 class="subh">How we run ads</h2>
  <ul class="plain">
    <li>Paid placements are always labelled. They are never shown as an independent ranking or recommendation.</li>
    <li>Political advertising carries a visible label and the name of who paid for it.</li>
    <li>We will share visitor numbers once the site is live. Rate card on request.</li>
  </ul>
  <p class="band__act"><a class="btn" href="mailto:${site.contact.email}?subject=Advertising%20on%20My%20Raipur">${icon('mail', 18)}Ask for the rate card</a></p>
</div>`
    });
  }

  // ---------------------------------------------------------------- about / privacy / 404
  page('/about/', {
    title: 'About My Raipur',
    description: 'What My Raipur is, and how we build it.',
    active: 'about',
    body: html`
${C.pageHead({ title: 'About My Raipur', lead: 'Not just another directory. A digital home for the city.', icon: 'info' })}
<div class="wrap narrow">
  <blockquote class="quote">I want to put Raipur on the digital map, not just as a city, but as a community, a culture and an experience.</blockquote>
  <p>My Raipur brings Raipur’s places, businesses, services, events, culture, talent and local information together. It helps residents and visitors discover the city, gives local businesses a way to reach customers, and gives artists and community members a place to be seen.</p>
  <h2 class="subh">How we work</h2>
  <ul class="plain">
    <li><strong>Useful before exhaustive.</strong> A smaller set of accurate pages beats a large directory full of stale ones.</li>
    <li><strong>Trust and accuracy.</strong> We verify business details, timings, contacts and public-service information.</li>
    <li><strong>Clear listings.</strong> Independent picks, user reviews and paid promotions are kept apart and labelled.</li>
    <li><strong>Community participation.</strong> Businesses, organisers, artists and residents can send updates for review.</li>
    <li><strong>Respect and permission.</strong> We publish photos, interviews and profiles only with consent.</li>
    <li><strong>Regular updates.</strong> Listings, events and news links are checked on a schedule.</li>
  </ul>
  <p class="band__act"><a class="btn" href="/submit/">${icon('plus', 18)}Add a listing or event</a></p>
</div>`
  });

  page('/privacy/', {
    title: 'Privacy',
    description: 'How My Raipur handles your information.',
    active: 'privacy',
    body: html`
${C.pageHead({ title: 'Privacy', lead: 'A plain-language summary. Have this checked and expanded before launch.', icon: 'info' })}
<div class="wrap narrow">
  <ul class="plain">
    <li>My Raipur does not ask you to create an account.</li>
    <li>The “Send us something” form opens your own email app. We only receive what you choose to send.</li>
    <li>If advertising is switched on, ad partners such as Google AdSense may use cookies to show ads.</li>
    <li>Links to other sites are covered by those sites’ own policies.</li>
  </ul>
</div>`
  });

  page('/404.html', {
    title: 'Page not found',
    active: '',
    noindex: true,
    body: html`
${C.pageHead({ title: 'We could not find that page', icon: 'search' })}
<div class="wrap narrow">
  <p>The page may have moved. Try the search, or start from the home page.</p>
  <p class="band__act"><a class="btn" href="/">${icon('home', 18)}Go to home</a><a class="btn btn--ghost" href="/search/">${icon('search', 18)}Search</a></p>
</div>`
  });

  return pages;
}

export function searchIndex(ctx) {
  const { data } = ctx;
  const items = [];
  for (const c of data.categories) items.push({ t: c.title, u: c.path, c: 'Section', d: c.lead || '' });
  for (const l of data.listings) {
    const cat = data.categories.find((c) => c.id === l.category);
    items.push({ t: l.name, u: (cat ? cat.path : '/') + '#' + l.id, c: cat ? cat.title : 'Listing', d: [l.area, l.summary, (l.tags || []).join(' ')].filter(Boolean).join(' ') });
  }
  for (const e of data.events.items) items.push({ t: e.title, u: '/events/', c: 'Event', d: [e.venue, e.category, e.date].filter(Boolean).join(' ') });
  return items;
}
