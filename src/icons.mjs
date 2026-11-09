import { raw } from './html.mjs';

// Simple 24px stroke icons. Add new ones here and use icon('name').
const P = {
  home: '<path d="M4 11l8-7 8 7"/><path d="M6 10v9h12v-9"/><path d="M10 19v-5h4v5"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  news: '<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 9h8M8 13h8M8 16h5"/>',
  calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  menu: '<path d="M5 7h14M5 12h14M5 17h14"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/>',
  coffee: '<path d="M5 9h11v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9z"/><path d="M16 10.5h1.5a2 2 0 0 1 0 4H16"/><path d="M8 4v2M12 4v2"/>',
  food: '<path d="M7 4v7M5 4v4a2 2 0 0 0 4 0V4M7 11v9"/><path d="M16 4c-1.7 1.5-2.5 3.5-2.5 6h2.5v10"/>',
  bag: '<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
  pin: '<path d="M12 21s6.5-5.6 6.5-11a6.5 6.5 0 0 0-13 0c0 5.4 6.5 11 6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  cap: '<path d="M3 9l9-4.5L21 9l-9 4.5L3 9z"/><path d="M7 11.5V16c0 1.2 2.2 2.5 5 2.5s5-1.3 5-2.5v-4.5"/>',
  health: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 8v8M8 12h8"/>',
  palette: '<path d="M12 4a8 8 0 1 0 0 16c1.2 0 1.8-.8 1.8-1.7 0-.9-.6-1.3-.6-2.2 0-.9.7-1.6 1.7-1.6H17a3 3 0 0 0 3-3A7.5 7.5 0 0 0 12 4z"/><circle cx="8" cy="11" r="1"/><circle cx="11" cy="7.8" r="1"/><circle cx="15" cy="8.5" r="1"/>',
  camera: '<path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/>',
  book: '<path d="M5 5.5A1.5 1.5 0 0 1 6.5 4H19v14H6.5A1.5 1.5 0 0 0 5 19.5v-14z"/><path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  sparkle: '<path d="M12 4l1.8 5.2L19 11l-5.2 1.8L12 18l-1.8-5.2L5 11l5.2-1.8L12 4z"/>',
  route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h6a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h6"/>',
  phone: '<path d="M6 4h4l1.5 4-2 1.3a10 10 0 0 0 5.2 5.2L16 12.5l4 1.5v4a2 2 0 0 1-2 2A14 14 0 0 1 4 6a2 2 0 0 1 2-2z"/>',
  external: '<path d="M14 5h5v5M19 5l-8 8M18 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4"/>',
  megaphone: '<path d="M4 10v4h3l8 4V6L7 10H4z"/><path d="M18 9a4 4 0 0 1 0 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  image: '<rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="M5 17l5-4 3 2.5 3-3 3 3"/>',
  users: '<circle cx="9" cy="9" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M16 6.5a3 3 0 0 1 0 5.5M17.5 14.5a5 5 0 0 1 3 4.5"/>',
  bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  building: '<path d="M5 20V5l7-2 7 2v15"/><path d="M3 20h18M9 9h2M13 9h2M9 13h2M13 13h2"/>',
  map: '<path d="M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2V6z"/><path d="M9 4v14M15 6v14"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="M4 7l8 6 8-6"/>',
  chat: '<path d="M5 19l1.3-3.7A7.5 7.5 0 1 1 9 18.2L5 19z"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  chevron: '<path d="M9 5l7 7-7 7"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>'
};

export function icon(name, size = 24) {
  const p = P[name];
  if (!p) return '';
  return raw(
    `<svg class="i" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${p}</svg>`
  );
}
