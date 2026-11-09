// Local preview: builds the site, serves ./dist on http://localhost:8080 and rebuilds when files change.
import http from 'node:http';
import { readFileSync, existsSync, statSync, watch } from 'node:fs';
import { join, dirname, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from './build.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, 'dist');
const port = Number(process.env.PORT || 8080);
const watching = !process.argv.includes('--no-watch');

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.xml': 'application/xml',
  '.webmanifest': 'application/manifest+json', '.txt': 'text/plain; charset=utf-8'
};

build();

if (watching) {
  let timer;
  const rebuild = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try { build(); } catch (e) { console.error('Build failed:', e.message); }
    }, 200);
  };
  for (const d of ['data', 'src', 'public']) {
    try { watch(join(root, d), { recursive: true }, rebuild); } catch { /* recursive watch not supported */ }
  }
  watch(root, (evt, name) => { if (name === 'site.config.json' || name === 'ads.json' || name === 'build.mjs') rebuild(); });
}

http
  .createServer((req, res) => {
    const url = decodeURIComponent((req.url || '/').split('?')[0]);
    let file = normalize(join(dist, url));
    if (!file.startsWith(dist)) { res.writeHead(403).end('Forbidden'); return; }
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
    if (!existsSync(file)) {
      res.writeHead(404, { 'Content-Type': MIME['.html'] });
      res.end(existsSync(join(dist, '404.html')) ? readFileSync(join(dist, '404.html')) : 'Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(readFileSync(file));
  })
  .listen(port, () => console.log(`\nMy Raipur running at http://localhost:${port}${watching ? '  (rebuilds when you save a file)' : ''}\n`));
