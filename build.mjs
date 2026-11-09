// Static site generator for My Raipur. No dependencies: `node build.mjs` writes ./dist
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createAds } from './src/ads.mjs';
import { buildPages, searchIndex } from './src/pages.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const read = (f) => JSON.parse(readFileSync(join(root, f), 'utf8'));
const hash = (f) => createHash('md5').update(readFileSync(join(root, f))).digest('hex').slice(0, 8);

export function build() {
  const outDir = join(root, 'dist');
  const site = read('site.config.json');
  const adsCfg = read('ads.json');

  // SHOW_SAMPLES=0 removes every item marked "sample": true (use this for the live site).
  const env = process.env.SHOW_SAMPLES;
  const showSamples = env != null ? !['0', 'false', 'no'].includes(String(env).toLowerCase()) : site.showSampleContent !== false;
  const keep = (x) => !x.hidden && (showSamples || !x.sample);

  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());

  const news = read('data/news.json');
  news.items = (news.items || []).filter(keep);
  const events = read('data/events.json');
  events.items = (events.items || []).filter(keep);
  const thisWeek = read('data/this-week.json');
  thisWeek.items = (thisWeek.items || []).filter(keep);
  const artists = read('data/artists.json');
  artists.items = (artists.items || []).filter(keep);
  const faces = read('data/faces.json');
  if (faces.current && !keep(faces.current)) faces.current = null;

  const data = {
    categories: read('data/categories.json'),
    listings: read('data/listings.json').filter(keep),
    news,
    events,
    thisWeek,
    artists,
    faces,
    oldRaipur: read('data/old-raipur.json'),
    info: read('data/information.json'),
    history: read('data/history.json'),
    facts: read('data/facts.json')
  };
  data.facts.items = (data.facts.items || []).filter(keep);

  const ads = createAds(adsCfg, today);
  const ctx = {
    site,
    ads,
    data,
    today,
    showSamples,
    year: new Date().getFullYear(),
    v: { css: hash('public/assets/site.css'), js: hash('public/assets/site.js') }
  };

  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  if (existsSync(join(root, 'public'))) cpSync(join(root, 'public'), outDir, { recursive: true });

  const pages = buildPages(ctx);
  for (const p of pages) {
    const file = p.path.endsWith('.html') ? join(outDir, p.path) : join(outDir, p.path, 'index.html');
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, p.html);
  }

  writeFileSync(join(outDir, 'search-index.json'), JSON.stringify(searchIndex(ctx)));

  const base = site.url.replace(/\/$/, '');
  const urls = pages.filter((p) => !p.noindex).map((p) => base + p.path);
  writeFileSync(
    join(outDir, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`
  );
  writeFileSync(join(outDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`);

  console.log(`Built ${pages.length} pages to dist/  (samples ${showSamples ? 'ON' : 'OFF'}, ${today})`);
  return { pages: pages.length };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) build();
