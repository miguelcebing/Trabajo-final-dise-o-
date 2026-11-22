const PATHS = {
  menu: `<rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/>`,
  flame: `<path d="M12 3c1.3 4.6 5 6.2 5 10a5 5 0 0 1-10 0c0-2.9 1.9-4 2.6-6.7.9 1.4 1.5 2.9 1.4 4.6 1.1-1.8 1.1-4.5.5-7.9Z"/>`,
  sliders: `<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2.2"/><circle cx="9" cy="12" r="2.2"/><circle cx="17" cy="18" r="2.2"/>`,
  cart: `<path d="M3 4h2.2l2.3 10.3a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 1.9-1.5L21 8H6"/><circle cx="9.5" cy="20" r="1.4"/><circle cx="17.5" cy="20" r="1.4"/>`,
  table: `<path d="M3 8h18M6 8v11M18 8v11M9 4h6v4M8.5 13h7"/>`,
  receipt: `<path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z"/><path d="M9 8h6M9 12h6M9 16h3"/>`,
  card: `<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18M7 15h4"/>`,
  track: `<path d="M4 5h16M4 12h9M4 19h16"/><circle cx="17.5" cy="12" r="2.2"/>`,
  history: `<path d="M3 12a9 9 0 1 0 2.7-6.4L3 8"/><path d="M3 3.5V8h4.5"/><path d="M12 8v5l3.2 1.9"/>`,
  plus: `<path d="M12 5v14M5 12h14"/>`,
  minus: `<path d="M5 12h14"/>`,
  trash: `<path d="M4 7h16M9.5 7V5h5v2M6.5 7l.9 13h9.2l.9-13"/><path d="M10 11v5.5M14 11v5.5"/>`,
  check: `<path d="m5 12.5 4.5 4.5L20 6.5"/>`,
  x: `<path d="M6 6l12 12M18 6 6 18"/>`,
  arrowRight: `<path d="M4.5 12h15M13.5 6l6 6-6 6"/>`,
  arrowLeft: `<path d="M19.5 12h-15M10.5 6l-6 6 6 6"/>`,
  refresh: `<path d="M20 11a8 8 0 1 0-2.4 6.6"/><path d="M20 4.5V11h-6.5"/>`,
  lock: `<rect x="5" y="10" width="14" height="10.5" rx="3"/><path d="M8.2 10V8a3.8 3.8 0 0 1 7.6 0v2"/>`,
  info: `<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8h.01"/>`,
  alert: `<path d="M12 3.5 2.8 20h18.4L12 3.5Z"/><path d="M12 9.5v4.5M12 17.2h.01"/>`,
  wifi: `<path d="M3 9a15 15 0 0 1 18 0M6.5 12.6a10 10 0 0 1 11 0M9.8 16.2a5.2 5.2 0 0 1 4.4 0"/><circle cx="12" cy="19.4" r="1"/>`,
  wifiOff: `<path d="M3 9a15 15 0 0 1 6-3.5M14.6 5.4A15 15 0 0 1 21 9M6.5 12.6a10 10 0 0 1 4-2.2M16.6 11.6a10 10 0 0 1 .9.9M9.8 16.2a5.2 5.2 0 0 1 4.4 0"/><circle cx="12" cy="19.4" r="1"/><path d="M3 3l18 18"/>`,
  edit: `<path d="M4 20h4.2L19 9.2a2.8 2.8 0 0 0-4-4L4 16v4Z"/><path d="m13.5 7.5 3.5 3.5"/>`,
  search: `<circle cx="11" cy="11" r="7"/><path d="m20.5 20.5-4-4"/>`,
  chef: `<path d="M7 13.5a4 4 0 0 1-1.2-7.7 4.2 4.2 0 0 1 7.1-2.3 4.2 4.2 0 0 1 7 2.4A4 4 0 0 1 17 13.5V19H7v-5.5Z"/><path d="M6.5 22h11"/>`,
  burger: `<path d="M4 10a8 8 0 0 1 16 0H4Z"/><path d="M4 13.4h16M4 16.8h16M5.5 20h13"/><path d="M8 7.2h.01M12 6.2h.01M16 7.2h.01"/>`,
  drink: `<path d="M6.2 4h11.6l-1.4 16H7.6L6.2 4Z"/><path d="M6.7 9.5h10.6"/><path d="M10 4V2M14 4V2"/>`,
  snowflake: `<path d="M12 2.5v19M4.2 7l15.6 10M19.8 7 4.2 17"/><path d="M9.4 4.3 12 6.2l2.6-1.9M9.4 19.7 12 17.8l2.6 1.9M4.1 10.4l3.1.4.4-3.1M19.9 13.6l-3.1-.4-.4 3.1M4.1 13.6l3.1-.4.4 3.1M19.9 10.4l-3.1.4-.4-3.1"/>`,
  cake: `<path d="M4 20.5h16M5 20.5v-6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6"/><path d="M4 15c2-2 4-2 6 0s4 2 6 0 2-2 4 0"/><path d="M12 9V7M12 4.5h.01"/>`,
  utensils: `<path d="M7 3v7.5M4.8 3v4.5a2.2 2.2 0 0 0 4.4 0V3M7 10.5V21"/><path d="M16.5 3c-1.8 0-3 2-3 5s1.2 3.2 3 3.2 3-.2 3-3.2-1.2-5-3-5ZM16.5 11.2V21"/>`,
  clock: `<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.2 1.9"/>`,
  user: `<circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>`,
  phone: `<path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 6a2 2 0 0 1 2-2Z"/>`,
  mail: `<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4.5 7.5 7.5 5.8 7.5-5.8"/>`,
  send: `<path d="m21 3-7.2 18-2.8-7-7-2.8L21 3Z"/><path d="M11 14 21 3"/>`,
  bag: `<path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>`,
  spark: `<path d="M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4M5.5 5.5l2.6 2.6M15.9 15.9l2.6 2.6M18.5 5.5l-2.6 2.6M8.1 15.9l-2.6 2.6"/>`,
  chevronRight: `<path d="m9 5 7 7-7 7"/>`,
  chevronLeft: `<path d="m15 5-7 7 7 7"/>`,
  dot: `<circle cx="12" cy="12" r="3.2"/>`,
  shield: `<path d="M12 3 5 6v6c0 4.5 3 7.7 7 9 4-1.3 7-4.5 7-9V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>`,
  filter: `<path d="M4 6h16M7 12h10M10 18h4"/>`,
  layers: `<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>`,
};

export function icon(name, size = 24) {
  const body = PATHS[name] || PATHS.dot;
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
}

export function hydrateIcons(root = document) {
  root.querySelectorAll("[data-icon]").forEach((el) => {
    if (el.dataset.iconReady === "1") return;
    el.innerHTML = icon(el.dataset.icon);
    el.dataset.iconReady = "1";
  });
}
