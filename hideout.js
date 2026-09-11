(() => {
  if (window.__HIDEOUT_BOOTED) return;
  window.__HIDEOUT_BOOTED = true;

const IMG = JSON.parse(document.getElementById('imgdata').textContent);
const pic = id => IMG[id] || null;

/* ============================================================
   LANGUAGES

   Every visible string in the JSON files may be either a plain
   string or an object keyed by language:

       "name": "Birria Tacos"
       "name": { "en": "Birria Tacos", "ko": "비리아 타코" }

   A plain string is treated as English, so a half-translated
   file works: untranslated entries simply stay in English
   rather than going blank.

   ENGLISH IS LOAD-BEARING and cannot be dropped. It generates
   the cart ids and the photo filenames, which is what lets a
   customer switch language mid-order without losing their
   basket — the ids never move because they are built from a
   string that never changes.

   Adding Spanish is this list plus a label, and nothing else.
   ============================================================ */
const LANGS = ['en', 'ko', 'es'];
/* Listed in the drawer but not selectable — the words do not exist yet.
   Moving 'es' from here into LANGS above is the whole of switching it on. */
const LANG_SOON  = [];
const LANG_LABEL = {en:'EN',   ko:'KOR',  es:'ESP'};
/* Files, not emoji: Android font coverage for flag emoji is inconsistent and
   some builds render them as bare letter pairs. These live in img/flags/ rather
   than inline because the Spanish arms alone are 80KB of vector, and the drawer
   is opened rarely enough that a lazy fetch is the right trade. */
const LANG_FLAG  = {en:'img/flags/gb.svg', ko:'img/flags/kr.svg', es:'img/flags/es.svg'};

/* The staff screen. Locked to one language regardless of what the customer
   is browsing in, so the bar reads the same order every time. Change this
   one string to hand the waiter view to Korean instead. */
const WAITER_LANG = 'en';

/* ============================================================
   CONTACT — edit these four. Nothing else in the file needs touching.

   The address is a language block like everything else: Korean puts the
   district before the street, and a Korean-speaking customer wants that
   order. English stays as the structural fallback.
   ============================================================ */
const CONTACT = {
  instagram: 'https://www.instagram.com/hideoutbusan',
  naver:     'https://naver.me/FYrPnmwP',
  gmaps:     'https://maps.app.goo.gl/iMR9D4oESefvn5qc7',
  address:   {en:'2F, 9, Busandaehak-ro 38beon-gil, Geumjeong-gu, Busan, South Korea', ko:'부산광역시 금정구 부산대학로38번길 9, 2층'}
};

const ICON = {
  insta: `<svg fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90.55 96.491"><path d="M48.5,31.171c-13.7-2.12-25.39,9.57-23.27,23.26,1.33,8.61,8.22,15.5,16.83,16.83,13.69,2.12,25.38-9.57,23.26-23.26-1.33-8.61-8.22-15.5-16.82-16.83Z"/><path d="M87.15,5.941H3.4C1.52,5.941,0,7.461,0,9.341v83.76c0,1.88,1.52,3.39,3.4,3.39h83.75c1.88,0,3.4-1.51,3.4-3.39V9.341c0-1.88-1.52-3.4-3.4-3.4ZM71.73,53.381c-1.02,12.85-11.44,23.27-24.29,24.29-16.34,1.3-29.92-12.28-28.62-28.62,1.03-12.85,11.44-23.27,24.29-24.29,16.34-1.3,29.92,12.28,28.62,28.62ZM76.41,24.031c-.07.3-.15.6-.27.88-.13.28-.27.54-.44.81-.17.25-.36.48-.58.7-.87.88-2.07,1.38-3.3,1.38-.3,0-.61-.03-.93-.1-.29-.06-.59-.14-.87-.26-.28-.11-.55-.27-.8-.44-.26-.16-.5-.36-.71-.58-.22-.22-.41-.45-.58-.7-.17-.27-.31-.53-.44-.81-.12-.28-.2-.58-.26-.88-.07-.31-.1-.61-.1-.92s.03-.61.1-.92c.06-.3.14-.59.26-.87.13-.28.27-.55.44-.8.17-.26.36-.5.58-.72.21-.22.45-.4.71-.57.25-.18.52-.32.8-.44.28-.11.58-.2.87-.27,1.53-.31,3.16.19,4.23,1.28.22.22.41.46.58.72.17.25.31.52.44.8.12.28.2.57.27.87.06.31.09.61.09.92s-.03.61-.09.92Z"/></svg>`,
  naver: `<svg fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90.55 96.491"><path d="M87.15,5.941H3.4c-1.88,0-3.4,1.52-3.4,3.4v83.76c0,1.88,1.52,3.39,3.4,3.39h83.75c1.88,0,3.4-1.51,3.4-3.39V9.341c0-1.88-1.52-3.4-3.4-3.4ZM70.29,73.851h-17.44l-15.16-22.63v22.63h-17.42V28.591h17.42l15.16,22.63v-22.63h17.44v45.26Z"/></svg>`,
  gmaps: `<svg fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 103.098 96.491"><path d="M3.618,5.944h45.464c-5.99,5.758-9.591,13.813-10.241,22.996-.116,1.667-.106,3.335.03,4.992.922,11.596,7.642,22.256,15.097,30.839.408.458.811.927,1.224,1.385l-1.844,1.844L3.159,17.807v14.643l14.367,14.367-14.367,14.373v14.643l21.691-21.691,21.178,21.183-17.999,18.004h14.643l19.793-19.798c1.874,1.758,3.798,3.456,5.753,5.108,2.514,2.126,6.156,2.126,8.67,0,4.529-3.829,9.304-8.277,13.657-13.208v27.434c0,1.995-1.632,3.627-3.617,3.627l-83.311-.005c-1.985,0-3.617-1.632-3.617-3.627V9.565c0-1.995,1.632-3.622,3.617-3.622h0ZM72.545,0C57.958,0,43.373,9.717,41.994,29.166c-1.28,18.07,14.362,35.318,28.255,47.06,1.34,1.128,3.254,1.128,4.594,0,13.889-11.742,29.534-28.986,28.255-47.06C101.723,9.716,87.129,0,72.546,0h0ZM72.545,9.46c-11.652,0-21.091,9.44-21.091,21.091s9.44,21.091,21.091,21.091,21.091-9.44,21.091-21.091c.005-11.652-9.44-21.091-21.091-21.091Z" fill-rule="evenodd"/></svg>`
};

const LANG_KEY = 'hideout.lang';

/* ============================================================
   THEME

   The device decides, because a customer who has set their
   phone to dark at 11pm has already told us what they want.
   Only when the device will not say — an old browser, a
   webview that answers neither query — do we fall back to the
   clock, and to Seoul's clock rather than the phone's, since
   the thing that is actually dark is this bar.

   A manual choice outranks both and is remembered.
   ============================================================ */
const THEME_KEY = 'hideout.theme';
const THEMES = ['light', 'dark'];

/* Material Symbols, one path each. Replace the d="..." to change them. */
const THEME_ICON = {
  dark: 'M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z',
  light: 'M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z'
};

/* The icon shows what you will GET, not what you are in — a moon while the
   menu is light. Swap the two lines in themeIcon() for the other convention. */
const DARK_FROM = 18 * 60;      // 18:00 Seoul
const DARK_UNTIL = 8 * 60;      // until 08:00

function darkByClock(){
  const min = seoulNow().min;
  return min >= DARK_FROM || min < DARK_UNTIL;
}

function firstTheme(){
  try{
    const saved = localStorage.getItem(THEME_KEY);
    if(saved && THEMES.includes(saved)) return saved;
  }catch(e){}
  try{
    if(window.matchMedia){
      if(matchMedia('(prefers-color-scheme: dark)').matches)  return 'dark';
      if(matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    }
  }catch(e){}
  return darkByClock() ? 'dark' : 'light';   // the device would not say
}

let THEME = 'light';            // real value set in start(), once seoulNow exists

function firstLang(){
  try{
    const saved = localStorage.getItem(LANG_KEY);
    if(saved && LANGS.includes(saved)) return saved;
  }catch(e){}
  /* No choice made yet — follow the phone, since a customer who has set
     their device to Korean almost certainly wants the Korean menu. */
  try{
    const want = [navigator.language, ...(navigator.languages || [])];
    for(const w of want){
      const base = String(w || '').toLowerCase().split('-')[0];
      if(LANGS.includes(base)) return base;
    }
  }catch(e){}
  return 'en';
}

let LANG = firstLang();

/* loc() — what to show the customer. can() — the English underneath, for
   ids, filenames and the waiter. Both take a string or a language object. */
function pick(v, lang){
  if(v == null) return '';
  if(typeof v !== 'object') return String(v);
  if(Array.isArray(v)) return '';
  return v[lang] !== undefined ? String(v[lang])
       : v.en !== undefined ? String(v.en)
       : String(Object.values(v)[0] ?? '');
}
const loc = v => pick(v, LANG);
const can = v => pick(v, 'en');

/* A description may be one string or a list of lines. A list puts each entry
   on its own line; a plain string can do the same with \n inside it. Both
   work per language, so English can be split and Korean not, or the reverse.
   Escaped line by line — the <br> is ours, nothing from the file is markup. */
function locLines(v){
  let raw = v;
  if(v && typeof v === 'object' && !Array.isArray(v)){
    raw = v[LANG] !== undefined ? v[LANG] : (v.en !== undefined ? v.en : Object.values(v)[0]);
  }
  const lines = Array.isArray(raw) ? raw.map(loc) : String(raw == null ? '' : raw).split('\n');
  return lines.map(x => x.trim()).filter(Boolean).map(esc).join('<br>');
}

/* Ingredient lists translate as a whole list, not entry by entry:
   "ingredients": { "en": ["Gin","Lime"], "ko": ["진","라임"] } */
function locArr(v){
  if(!v) return [];
  if(Array.isArray(v)) return v.map(loc);
  const a = v[LANG] !== undefined ? v[LANG] : (v.en !== undefined ? v.en : Object.values(v)[0]);
  return Array.isArray(a) ? a.map(loc) : [];
}

/* The site's own wording. Not in the JSON files — the owners have no
   business editing it, and it changes only when the code does. */
const UI = {
  order:        {en:'Order',            ko:'주문',            es:'Pedido'},
  yourOrder:    {en:'Your order',       ko:'주문 내역',       es:'Tu pedido'},
  total:        {en:'Total',            ko:'합계',            es:'Total'},
  clear:        {en:'Clear',            ko:'비우기',          es:'Vaciar'},
  showWaiter:   {en:'Show to waiter',   ko:'직원에게 보여주기', es:'Mostrar al mesero'},
  emptyOrder:   {en:'Nothing here yet', ko:'아직 담긴 것이 없음', es:'Aún no hay nada aquí'},
  nothingShow:  {en:'Nothing to show',  ko:'표시할 것이 없음',  es:'Nada que mostrar'},
  cleared:      {en:'Order cleared',    ko:'주문 내역을 비웠음', es:'Pedido vaciado'},
  undo:         {en:'Undo',             ko:'되돌리기',         es:'Deshacer'},
  mocktail:     {en:'Non-alcoholic!',   ko:'무알코올!',        es:'¡Sin alcohol!'},
  spicy:        {en:'Spicy!',           ko:'매운맛!',          es:'¡Picante!'},
  noSpecials:   {en:'Nothing on special right now', ko:'현재 스페셜 메뉴가 없음', es:'No hay especiales ahora'},
  specialsBad:  {en:'Specials unavailable',         ko:'스페셜 메뉴를 불러올 수 없음', es:'Especiales no disponibles'},
  menuBad:      {en:'Menu unavailable. Please ask at the bar.',
                 ko:'메뉴를 불러올 수 없습니다. 바에 문의해 주세요.',
                 es:'Menú no disponible. Pregunta en la barra.'},
  needServer:   {en:'This page needs to be opened through a local server, not by opening the file directly.',
                 ko:'이 페이지는 파일을 직접 열지 말고 로컬 서버를 통해 열어야 합니다.',
                 es:'Esta página debe abrirse a través de un servidor local, no abriendo el archivo directamente.'},
  drinks:       {en:'Drinks',           ko:'음료',            es:'Bebidas'},
  food:         {en:'Food',             ko:'음식',            es:'Comida'},
  /* one sentence per line — locLines() gives each entry its own line */
  tonightEvent: {en:"Tonight's event", ko:'오늘의 이벤트', es:'Evento de esta noche'},
  addSet:       {en:'Add', ko:'담기', es:'Añadir'},
  edit:         {en:'Edit', ko:'변경', es:'Editar'},
  chooseTitle:  {en:'Choose', ko:'선택', es:'Elegir'},
  confirmSet:   {en:'Confirm', ko:'확인', es:'Confirmar'},
  pickNone:     {en:'Not available right now',
                 ko:'현재 선택할 수 없습니다',
                 es:'No disponible en este momento'},
  followEvents: {en:'Follow us on Instagram for more events!',
                 ko:'더 많은 이벤트는 인스타그램에서 확인하세요!',
                 es:'¡Síguenos en Instagram para más eventos!'},
  footNote:     {en:['Tap any item to open it. Your order is kept on this device.'],
                 ko:['항목을 누르면 자세히 볼 수 있음. 주문 내역은 이 기기에 저장됨.'],
                 es:['Toca cualquier elemento para abrirlo. Tu pedido se guarda en este dispositivo.']}
};
const u = k => loc(UI[k]);
const w = k => pick(UI[k], WAITER_LANG);   // staff wording, never the customer's

/* "1 item" / "2 items" in English; Korean counts with a unit noun and does
   not inflect, so this cannot be a format string with a plural rule. */
function itemCount(k){
  if(LANG === 'ko') return k + '개';
  if(LANG === 'es') return k + (k === 1 ? ' artículo' : ' artículos');
  return k + (k === 1 ? ' item' : ' items');
}

/* ============================================================
   MENU DATA — lives in menu.json, not in this file.

   Single source of truth. There is deliberately no duplicate copy
   baked in here: a stale duplicate would silently serve last year's
   prices the day menu.json breaks, and wrong prices are worse than
   no menu. Instead, the last version that parsed cleanly is cached
   on the device, so a bad commit mid-service degrades to yesterday's
   menu rather than a blank screen.
   ============================================================ */
const MENU_CACHE = 'hideout.menu.v1';
let TABS = {}, TAB_ORDER = [];

function buildTabs(json){
  const tabs = (json && Array.isArray(json.tabs)) ? json.tabs : null;
  if(!tabs || !tabs.length) throw new Error('no tabs array');

  const built = {}, order = [];
  for(const t of tabs){
    if(!t || !t.name) continue;
    /* The key is the English name and never changes; label is the raw value,
       resolved to the reader's language at paint time. Keying on the display
       string would rename every tab — and every cart id under it — the
       moment someone switched language. */
    const key = can(t.name);
    order.push(key);

    if(t.source === 'specials.json'){          // filled in by applySpecials
      built[key] = {stub:'noSpecials', label:t.name};
      continue;
    }
    const secs = (t.sections||[]).map(s=>{
      if(s.rows){
        return {
          t: s.title || '',
          vl: Array.isArray(s.variants) ? s.variants : null,
          /* Optional parallel list used ONLY on the order and waiter screens.
             Choosing wants the full label — "Standard", "Double shot" —
             while a summary wants it short, or gone. An empty string here
             means no label at all. Falls back to the full label when absent,
             so a section that needs no shortening says nothing. */
          vs: Array.isArray(s.variantsShort) ? s.variantsShort : null,
          nb: s.noteBelow === true,
          /* "titleOnOrder": true sends the section heading along as the row's
             qualifier — a beer needs "Bottled" or "On Tap" beside it once it
             is off the menu page and sitting in a list. Off by default: most
             headings ("Bartender's Choice") are shelf labels, not facts about
             the drink. */
          tl: s.titleOnOrder === true ? (s.title || '') : null,
          ctr: s.centreRow === true,
          rows: (s.rows||[]).map(r => Array.isArray(r.prices)
            ? {n:r.name||'', sub:r.note||'', v:r.prices.map(Number)}
            : {n:r.name||'', sub:r.note||'', p:Number(r.price)||0})
        };
      }
      return {
        t: s.title || '',
        layout: s.layout || null,
        items: (s.items||[]).map(it=>({
          n   : it.name || 'Untitled',
          p   : Number(it.price)||0,
          ing : it.ingredients || [],
          desc: it.description || '',
          ar  : it.ratio || null,
          mocktail: it.mocktail === true,
          heat: Math.max(0, Math.min(3, Number(it.heat) || 0)),
          add : Array.isArray(it.addons)
                ? it.addons.map(a => ({n:a.name||'', p:Number(a.price)||0}))
                : [],
          /* A set that promises "dessert of choice" has to take the choice.
             Each entry is one question; `from` points at a section or a whole
             tab and is read fresh every time, so a slot aimed at Specials
             follows the month without anything here being edited. */
          ch  : Array.isArray(it.choices) && it.choices.length
                ? it.choices.map(c => ({
                    k   : c.key || slug(can(c.name || '')),
                    n   : c.name || '',
                    from: c.from || null,
                    opts: Array.isArray(c.options) ? c.options : null,
                    pick: Math.max(1, Math.min(4, Number(c.pick) || 1))
                  }))
                : null,
          /* No "photo" field needed: the filename is derived from the item
             name, so dropping baby-turtle.jpg into img/cocktails/ is all it
             takes. A file that isn't there falls back to the lettered tile.
             Set "photo" explicitly only for a different name or a .png. */
          img : (t.kind==='food' ? 'img/food/' : 'img/cocktails/') +
                (it.photo || slug(can(it.name)) + '.jpg')
        }))
      };
    });
    const isList = (t.sections||[]).some(s => s.rows);
    built[key] = isList ? {list:secs, label:t.name}
                        : {kind:t.kind||'drink', secs, label:t.name};
  }
  if(!order.length) throw new Error('no usable tabs');
  return {built, order};
}

function applyMenu(raw, where){
  const json = typeof raw === 'string' ? JSON.parse(raw) : raw;
  const {built, order} = buildTabs(json);
  TABS = built; TAB_ORDER = order;
  indexAll();
  return json;
}

/* tab order is the order of the tabs array in menu.json */
function paintNav(){
  document.getElementById('nav').innerHTML = TAB_ORDER.filter(n=>TABS[n]).map((n,i)=>
    `${i?'<span class="bar"></span>':''}<button data-tab="${esc(n)}">${esc(loc(TABS[n].label || n))}</button>`).join('');
}

/* ---------- flat index of every orderable line ----------
   Built once from TABS. Ids are stable across tab switches, so the
   cart survives navigation; variants (shot vs bottle) are separate
   lines because they are separate things to pour. */
/* Strip accents before slugging, so "Piña Colada" is pina-colada rather
   than pi-a-colada. NFD splits a letter from its accent; the range below
   is the combining marks. A few letters have no decomposition, so they
   get named directly. This matches the filename rule in HOW-TO-UPDATE.md. */
const slug = s => String(s)
  .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .replace(/ø/gi,'o').replace(/æ/gi,'ae').replace(/œ/gi,'oe')
  .replace(/ß/g,'ss').replace(/đ/gi,'d').replace(/ł/gi,'l')
  .toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const INDEX = {};

function indexAll(){
  Object.keys(INDEX).forEach(k => delete INDEX[k]);
  for(const [tabName,T] of Object.entries(TABS)){
    const group = tabName === 'Food' ? 'food' : 'drink';   // tabName is the English key
    const add = (name, sub, price, variant, vshort) => {
      /* Ids are built from the English only. Switching language must not
         move a single one of them, or the customer's basket empties. */
      const id = [slug(tabName),
                  slug(can(name) + ' ' + can(sub)),
                  variant ? slug(can(variant)) : ''].filter(Boolean).join('/');
      INDEX[id] = {id, name, sub:sub||'', variant:variant||'',
                   vshort: vshort === undefined ? (variant||'') : vshort,
                   price, group, tab:tabName};
      return id;
    };
    if(T.secs) T.secs.forEach(s => s.items.forEach(it => {
      it.id = add(it.n, '', it.p);
      /* Carried onto the record so a saved instance can still be validated
         after a reload, when `it` is a fresh object and INDEX is all we have. */
      if(it.ch) INDEX[it.id].ch = it.ch;
      (it.add||[]).forEach(a => {
        /* can() first: these are language objects, and concatenating one
           straight into a string yields "[object Object]" — which every
           add-on on the menu would then share as its id. */
        a.id = add(can(it.n) + ' ' + can(a.n), '', a.p);
        /* name stays the parent's, so the order sheet and the waiter view
           both read "Birria tacos / add fries" rather than a loose line */
        INDEX[a.id].name   = it.n;
        INDEX[a.id].sub    = a.n;
        INDEX[a.id].parent = it.id;
      });
    }));
    if(T.list) T.list.forEach(s => {
      /* A note earns its place on an order only when it is doing work: two
         rows sharing a name are told apart by their notes alone, so the bar
         must see it. A note on a row with no twin — a country, a gin, an
         ingredient list — is information for someone choosing, and only
         clutters a summary. The id still uses the note either way, so
         nothing can collide. */
      const twins = {};
      s.rows.forEach(r => { twins[can(r.n)] = (twins[can(r.n)] || 0) + 1; });
      s.rows.forEach(r => {
        const tells = twins[can(r.n)] > 1 ? (r.sub || '') : '';
        const short = i => s.vs && s.vs[i] !== undefined ? s.vs[i] : s.vl[i];
        if(r.v) r.ids = r.v.map((p,i) => {
          const id = add(r.n, r.sub, p, s.vl[i], short(i));
          INDEX[id].sub = tells;
          return id;
        });
        else {
          /* no variants here, so the qualifier slot is free for the heading */
          r.id = add(r.n, r.sub, r.p, '', s.tl || '');
          INDEX[r.id].sub = tells;
        }
      });
    });
  }
}

/* ============================================================
   SPECIALS — the only part the owners touch.

   Source of truth is specials.json sitting next to index.html.
   The block baked into the page below is the fallback, so the
   menu still works if that file is missing, empty or malformed.
   Nothing here can break the rest of the menu.
   ============================================================ */
function applySpecials(raw, where){
  let json;
  try{
    json = typeof raw === 'string' ? JSON.parse(raw) : raw;
  }catch(err){
    console.warn('specials: could not read ' + where, err);
    if(TAB_ORDER.includes('Specials')){
      TABS.Specials = {stub:'specialsBad', label:(TABS.Specials||{}).label}; indexAll(); }
    return false;
  }
  const secs = ((json && json.sections) || []).map(s => ({
    t: s.title || 'Specials',
    items: ((s.items) || []).map(it => ({
      n  : it.name || 'Untitled',
      p  : Number(it.price) || 0,
      ing: it.ingredients || [],
      mocktail: it.mocktail === true,
      heat: Math.max(0, Math.min(3, Number(it.heat) || 0)),
      img: 'img/specials/' + (it.photo || slug(can(it.name)) + '.jpg')
    }))
  })).filter(s => s.items.length);

  if(!TAB_ORDER.includes('Specials')) return true;   // menu.json didn't ask for it
  const label = (TABS.Specials || {}).label;
  TABS.Specials = secs.length ? {kind:'drink', secs, label} : {stub:'noSpecials', label};
  indexAll();
  return true;
}

/* If a standalone specials.json is present, it wins. Fails silently
   on file:// where fetch is blocked — the baked-in block covers it. */
function refreshSpecials(){
  if(typeof fetch !== 'function') return;
  try{
    fetch('specials.json', {cache:'no-store'})
      .then(r => r.ok ? r.text() : Promise.reject(r.status))
      .then(txt => {
        if(!applySpecials(txt, 'specials.json')) return;
        /* The basket was checked against the placeholder specials baked into
           this file, so anything ordered from the real list looked unknown
           and was dropped. Now that the actual specials are indexed, read it
           again — localStorage still holds the full saved basket. */
        cart = loadCart();
        sets = loadSets();     // a slot aimed at Specials has just changed under it
        pruneCart();
        pruneSets();
        /* Unconditional: loadSets() has just silently dropped anything whose
           cocktail was retired, so pruneSets() sees nothing left to do and
           storage would keep the corpse. This is the first moment the real
           specials are indexed, so it is the first moment it is safe. */
        saveSets();
        paintAllQty();
        paintBar();
        if(tab === 'Specials'){ render(); sizeRails(); requestAnimationFrame(parkRails); }
      })
      .catch(()=>{});
  }catch(e){}
}

/* ============================================================
   EVENTS — one-night things, logged ahead, shown only on the night.

   Times are Asia/Seoul wall clock, NOT the customer's device clock.
   A tourist's phone on London time would otherwise never see tonight's
   poster. Default window is 18:00 on the date through 04:00 the next
   morning, because the bar day doesn't end at midnight.
   ============================================================ */
let EVENTS = [];

function applyEvents(raw, where){
  try{
    const json = typeof raw === 'string' ? JSON.parse(raw) : raw;
    EVENTS = ((json && json.events) || []).filter(e => e && e.date);
    return true;
  }catch(err){
    console.warn('events: could not read ' + where, err);
    EVENTS = [];
    return false;
  }
}

const toMin = hhmm => {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(hhmm||''));
  return m ? (+m[1])*60 + (+m[2]) : null;
};

/* Whole days since the epoch, so a run of nights is plain arithmetic and
   never touches the device's timezone. */
function dayNum(iso){
  const [y,m,d] = iso.split('-').map(Number);
  return Math.round(Date.UTC(y, m-1, d) / 86400000);
}

/* Current Seoul date + minutes-past-midnight.
   ?when=2026-08-15        → that night at 21:00
   ?when=2026-08-16T02:30  → those small hours
   Both are read as Seoul wall clock, so testing isn't tz-dependent. */
function seoulNow(){
  try{
    const q = new URLSearchParams(location.search).get('when');
    if(q){
      const m = /^(\d{4}-\d{2}-\d{2})(?:[T ](\d{1,2}):(\d{2}))?$/.exec(q.trim());
      if(m) return { date:m[1], min: m[2] ? (+m[2])*60 + (+m[3]) : 21*60 };
    }
  }catch(e){}
  const p = {};
  new Intl.DateTimeFormat('en-CA', {
    timeZone:'Asia/Seoul', year:'numeric', month:'2-digit', day:'2-digit',
    hour:'2-digit', minute:'2-digit', hour12:false
  }).formatToParts(new Date()).forEach(x => { p[x.type] = x.value; });
  const hr = (+p.hour) % 24;                       // some engines report 24 for midnight
  return { date:`${p.year}-${p.month}-${p.day}`, min: hr*60 + (+p.minute) };
}

/* One continuous window, however many nights long. "until" is the LAST
   night of a run — Chuseok over the 24th, 25th and 26th is one entry with
   date 2026-09-24 and until 2026-09-26, and the poster stays up the whole
   time rather than blinking out each morning. Omit it for a single night.
   First match in file order wins, so if two ever overlap, put the more
   specific one higher up. */
function activeEvent(){
  const now  = seoulNow();
  const nowN = dayNum(now.date) * 1440 + now.min;
  for(const ev of EVENTS){
    const on   = ev.date === 'today' ? now.date : ev.date;    // 'today' is a preview aid
    const from = toMin(ev.from) ?? 18*60;
    const to   = toMin(ev.to)   ?? 4*60;
    const last = ev.until || on;
    const startN = dayNum(on) * 1440 + from;
    /* an end time at or before the start time means it lands the next morning */
    const endN   = (dayNum(last) + (to <= from ? 1 : 0)) * 1440 + to;
    if(endN > startN && nowN >= startN && nowN < endN) return ev;
  }
  return null;
}

function posterHTML(ev){
  const art = ev.poster
    ? `<img src="img/events/${esc(ev.poster)}" alt="${esc(loc(ev.name))}">`
    : `<div class="ph"><span>${esc(loc(ev.name) || 'Event')}</span></div>`;
  /* Only while a poster is up: the line argues "there will be more of these",
     which is nonsense with nothing on show. */
  const follow = wired(CONTACT.instagram)
    ? `<div class="evwrap"><a class="evfollow" href="${CONTACT.instagram}" target="_blank" rel="noopener"
         >${ICON.insta}<span>${esc(u('followEvents'))}</span></a></div>` : '';
  return `<section class="sec poster-sec">
    <div class="sec-head"><h2>${esc(u('tonightEvent'))}</h2><span class="rule"></span></div>
    <div class="poster">${art}</div>${follow}</section>`;
}

applyEvents(document.getElementById('events-data').textContent, 'the built-in block');

function refreshEvents(){
  if(typeof fetch !== 'function') return;
  try{
    fetch('events.json', {cache:'no-store'})
      .then(r => r.ok ? r.text() : Promise.reject(r.status))
      .then(txt => { if(applyEvents(txt, 'events.json') && tab === 'Specials'){
        render(); sizeRails(); requestAnimationFrame(parkRails);
      }})
      .catch(()=>{});
  }catch(e){}
}

/* Land on Specials when there's something there — a live event poster or
   this month's cocktails. An empty Specials tab is a worse first screen
   than the food, so fall through to Food if it has nothing. */
function landingTab(){
  const shown = TAB_ORDER.filter(n => TABS[n]);
  const has = n => shown.includes(n);
  if(has('Specials')){
    if(activeEvent()) return 'Specials';
    const S = TABS.Specials;
    if(S && S.secs && S.secs.some(s => s.items.length)) return 'Specials';
  }
  return has('Food') ? 'Food' : shown[0];   // whatever the menu actually offers
}

let tab = 'Food';
/* Empty for now. A saved basket cannot be validated until the menu has
   arrived and INDEX exists, so it is restored in start() instead — reading
   it here would check every saved id against an empty index, find none of
   them, and throw the whole basket away on every page load. */
let cart = {};

function loadCart(){
  try{ const c = JSON.parse(localStorage.getItem('hideout.cart')||'{}');
       Object.keys(c).forEach(k=>{ if(!INDEX[k] || !(c[k]>0)) delete c[k]; });
       /* An add-on cannot outlive its parent, and cannot outnumber it —
          the same rule setQty() enforces, applied to whatever was saved. */
       Object.keys(c).forEach(k=>{
         const r = INDEX[k];
         if(!r || !r.parent) return;
         const cap = c[r.parent] || 0;
         if(!cap) delete c[k];
         else if(c[k] > cap) c[k] = cap;
       });
       return c; }
  catch(e){ return {}; }
}
function saveCart(){ try{ localStorage.setItem('hideout.cart', JSON.stringify(cart)); }catch(e){} }
/* a special that vanished this month must not linger in someone's order */
function pruneCart(){
  let changed = false;
  Object.keys(cart).forEach(k => { if(!INDEX[k]){ delete cart[k]; changed = true; } });
  if(changed){ saveCart(); paintAllQty(); paintBar(); }
}

const lines      = () => Object.keys(cart).map(id => ({...INDEX[id], qty:cart[id]}));
/* A configured set counts as one item and carries its own price; there is
   nothing to multiply because an instance is always exactly one. */
const cartCount  = () => Object.values(cart).reduce((a,b)=>a+b,0) + sets.length;
const cartTotal  = () => lines().reduce((a,l)=>a + l.price*l.qty, 0) + setsTotal();
const won        = n => '₩' + Math.round(n*1000).toLocaleString('en-US');

const kidsOf = id => Object.values(INDEX).filter(r => r.parent === id);

/* Two tacos, at most two portions of fries. Anything else and the kitchen
   gets an order for fries that belong to nothing. */
function clampAddons(){
  let changed = false;
  Object.keys(cart).forEach(k => {
    const r = INDEX[k];
    if(!r || !r.parent) return;
    const cap = cart[r.parent] || 0;
    if(cart[k] > cap){ if(cap) cart[k] = cap; else delete cart[k]; changed = true; }
  });
  return changed;
}

/* ============================================================
   SETS WITH CHOICES

   A set that says "dessert of choice" is not a variant and must not be
   made one: variants are a closed list the menu declares, and these are
   open, customer-made, and in the Monthly Special's case regenerate every
   month. So sets live beside the cart rather than inside it.

   `cart` stays exactly what it was — {id: qty} — and `sets` is a list of
   instances, each one configured set:

       {sid, of, picks:{slotKey:[optionId, ...]}}

   One Add is one instance. Two identical sets are two rows, deliberately:
   the moment identical picks merged into a quantity, minus would have to
   decide which instance to kill, which is the ambiguity that took the
   stepper off these cards in the first place.

   Option ids are slugged from English like every other id, so switching
   language never moves one. A pick pointing at a special that has since
   been replaced cannot be honoured, so the instance is dropped on load —
   the same rule pruneCart() already applies to a vanished drink.
   ============================================================ */
let sets = [];
const SETS_KEY = 'hideout.sets';
let sidSeq = 0;
const newSid = () => 's' + Date.now().toString(36) + (sidSeq++).toString(36);

const itemsOfTab = name => {
  const T = TABS[name];
  return (T && T.secs) ? T.secs.reduce((a,s)=>a.concat(s.items||[]), []) : [];
};
const itemsOfSection = (tabName, title) => {
  const T = TABS[tabName];
  const s = T && T.secs && T.secs.find(x => can(x.t) === title);
  return s ? (s.items||[]) : [];
};

/* Read fresh on every paint rather than cached: this is what lets the
   cocktail slot follow specials.json without a second place to edit. */
function optionsFor(rec, slot){
  const out = [], seen = new Set();
  const push = n => {
    const oid = slug(can(n));
    if(!oid || seen.has(oid)) return;
    seen.add(oid); out.push({oid, n});
  };
  if(slot.from){
    (TABS[slot.from] ? itemsOfTab(slot.from) : itemsOfSection(rec.tab, slot.from))
      .forEach(it => push(it.n));
  }
  (slot.opts||[]).forEach(o => {
    if(o.ref){
      /* by English name, so the translations and nothing else come along */
      const it = itemsOfTab(rec.tab).find(x => can(x.n) === o.ref);
      push(it ? it.n : {en:o.ref});
    } else if(o.name) push(o.name);
  });
  return out;
}

const setRec  = s => (s && INDEX[s.of]) || null;
const setName = (s, lang) => {
  const rec = setRec(s);
  return rec ? (lang ? pick(rec.name, lang) : loc(rec.name)) : '';
};
/* Every chosen option, in slot order, resolved for display. An option that
   no longer exists resolves to nothing and is filtered out — validation
   will have dropped the instance already, this is belt and braces. */
function setPicks(s, lang){
  const rec = setRec(s);
  if(!rec || !rec.ch) return [];
  return rec.ch.reduce((acc, slot) => {
    const opts = optionsFor(rec, slot);
    (s.picks[slot.k]||[]).forEach(oid => {
      const o = opts.find(x => x.oid === oid);
      if(o) acc.push(lang ? pick(o.n, lang) : loc(o.n));
    });
    return acc;
  }, []);
}

function validSet(s){
  const rec = setRec(s);
  if(!rec || !rec.ch || !s.sid || !s.picks) return false;
  return rec.ch.every(slot => {
    const got = s.picks[slot.k];
    if(!Array.isArray(got) || got.length !== slot.pick) return false;
    const ok = new Set(optionsFor(rec, slot).map(o => o.oid));
    return got.every(oid => ok.has(oid));
  });
}

/* Reads and validates, and deliberately does NOT write back what it rejected:
   at boot this runs against the placeholder specials, where a perfectly good
   instance looks invalid only because the real cocktails have not arrived
   yet. Saving here would delete a valid basket a quarter-second before it
   became verifiable. The write happens once specials.json has landed. */
function loadSets(){
  try{
    const a = JSON.parse(localStorage.getItem(SETS_KEY) || '[]');
    return Array.isArray(a) ? a.filter(validSet) : [];
  }catch(e){ return []; }
}
function saveSets(){ try{ localStorage.setItem(SETS_KEY, JSON.stringify(sets)); }catch(e){} }
function pruneSets(){
  const kept = sets.filter(validSet);
  if(kept.length === sets.length) return false;
  sets = kept; saveSets();
  paintAllQty(); paintBar();
  if(sheet.classList.contains('show')) paintSheet();
  return true;
}

const setsOf   = id => sets.filter(s => s.of === id).length;
const setsTotal = () => sets.reduce((a,s) => a + ((setRec(s)||{}).price || 0), 0);

function addSet(of, picks){
  if(cleared) hideUndo();
  sets.push({sid:newSid(), of, picks});
  saveSets(); paintAllQty(); paintBar();
}
function editSet(sid, picks){
  const s = sets.find(x => x.sid === sid);
  if(!s) return;
  s.picks = picks; saveSets();
}
function dropSet(sid){
  sets = sets.filter(s => s.sid !== sid);
  saveSets(); paintAllQty(); paintBar();
}

function setQty(id, n){
  /* Restoring the old basket over a new one would be worse than the mistake
     it undoes, so the first thing added afterwards cancels the offer. */
  if(cleared) hideUndo();
  const rec = INDEX[id];
  n = Math.max(0, Math.min(99, n));
  if(rec && rec.parent) n = Math.min(n, cart[rec.parent] || 0);
  if(n) cart[id] = n; else delete cart[id];
  clampAddons();
  saveCart(); paintAllQty(); paintBar();
}
function bump(id, d){ setQty(id, (cart[id]||0) + d); }
/* The full stop IS the thousands marker: 13. is 13,000 and 6.5 is 6,500.
   So a price with a decimal already has its dot and must not get another.
   Rounded first — 6.5 * 3 is exact in binary, but not every price will be. */
const money = n => {
  const v = Math.round(n * 10) / 10;
  return Number.isInteger(v) ? v + '.' : String(v);
};
const esc = s => String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));


const main = document.getElementById('main');

function stepper(id, kind){
  return `<div class="step${kind ? ' ' + kind : ''}">
    <button data-step="-1" data-id="${id}">−</button>
    <span class="q" data-q="${id}">0</span>
    <button data-step="1" data-id="${id}">+</button>
  </div>`;
}

/* ---------------------------------------------------------------
   THE FLAME. To change the icon, replace the d="..." string below and
   nothing else — the viewBox must match whatever the new path is drawn
   against. Everything about stacking, colour and placement is handled by
   heatMark() and the .heat rules in the stylesheet.
   --------------------------------------------------------------- */
const FLAME_BOX  = '0 0 24.634 33.978';
const FLAME_PATH = 'M14.865,0c-5.521,5.09-7.645,11.879-7.645,17.83-1.699-2.553-1.699-4.679-2.124-8.07C.849,15.278,0,18.249,0,23.351c0,5.667,3.935,9.351,8.494,10.626-1-1.258-1.699-3.018-1.699-4.667,0-2.125.425-4.246,1.699-5.946.187,1.528.951,2.673,1.699,3.822,0-2.679.967-6.628,3.398-8.919.934,4.97,4.247,6.832,4.247,11.043,0,1.664-.705,3.403-1.699,4.667,4.714-1.241,8.494-4.904,8.494-10.626,0-9.351-7.645-12.312-9.769-23.351Z';

/* At this level and above, the flames are joined by a word, on the grounds
   that anyone who reads descriptions does not need warning and anyone who
   does not read them will not see the flames either. Drop it to 2 to shout
   about the medium ones too. */
const SPICY_TAG_AT = 3;

/* The loud labels at the top of an open panel. Nothing is ever both, but
   the code does not need to care. */
function panelTags(it){
  return (it.mocktail ? `<span class="tag">${esc(u('mocktail'))}</span>` : '') +
         (it.heat >= SPICY_TAG_AT ? `<span class="tag">${esc(u('spicy'))}</span>` : '');
}

/* Level 1 is one flame; each extra level adds another to the LEFT and one
   shade lighter, so the rightmost is always full magenta. */
function heatMark(level){
  if(!level) return '';
  let out = '';
  for(let i = 0; i < level; i++){
    out += `<svg class="h${level - i}" viewBox="${FLAME_BOX}" aria-hidden="true">` +
           `<path fill="currentColor" d="${FLAME_PATH}"/></svg>`;
  }
  return `<span class="heat" title="Spicy ${level} of 3">${out}</span>`;
}

function addonRows(it){
  return (it.add||[]).map(a => `<div class="addrow">
    <span class="addlbl">${esc(loc(a.n))} <span class="addpr">+${money(a.p)}</span></span>
    ${stepper(a.id, 'addon')}
  </div>`).join('');
}

/* Sets don't expand — everything is on show, so the stepper just sits there.
   Full content width, photo keeps its own printed proportion. */
function setCard(it){
  const art = artTag(it);
  /* A set with choices cannot carry a stepper: minus would have no way to
     know which configuration the customer meant once two are in the basket.
     So the card offers Add, and quantity is managed on the order sheet where
     each instance is its own row. */
  const ctl = it.ch
    ? `<div class="setctl"><span class="setn" data-sn="${it.id}"></span>
        <button class="setadd" data-choose="${it.id}">${esc(u('addSet'))}</button></div>`
    : stepper(it.id);
  return `<article class="setcard">
    <div class="setshot" style="aspect-ratio:${it.ar||'1/1'}">${art}${heatMark(it.heat)}</div>
    <div class="setmeta">
      <div class="setsplit">
        <div class="setleft">
          <div class="setnm">${locLines(it.n)}</div>
          <p class="setdesc">${locLines(it.desc)}</p>
        </div>
        <div class="setright">
          <div class="setpr">${money(it.p)}</div>
          ${ctl}
        </div>
      </div>
      ${addonRows(it)}
    </div>
  </article>`;
}

/* ---------- dark-mode photography ----------
   A dark variant is the same filename with -dm before the extension.
   We never keep a list of which ones exist: the first 404 tells us, and
   NO_DM remembers for the session so the request isn't repeated. Missing
   -dm therefore degrades to the light shot, not to the typographic tile. */
const NO_DM   = new Set();
const dmSrc   = p => p.replace(/\.(jpe?g|png|webp)$/i, '-dm.$1');
const shotSrc = p => (THEME === 'dark' && !NO_DM.has(p)) ? dmSrc(p) : p;

function artTag(it){
  return it.img
    ? `<img loading="lazy" src="${shotSrc(it.img)}" data-light="${it.img}" alt="" data-fallback="${esc(loc(it.n))}">`
    : `<div class="ph"><span>${esc(loc(it.n))}</span></div>`;
}

function card(it, kind, key){
  const inner = kind==='food'
    ? `<p class="desc">${locLines(it.desc)}</p>`
    : `<ul class="ing">${locArr(it.ing).map(i=>`<li>${esc(i)}</li>`).join('')}</ul>`;
    const art = artTag(it);
  return `<article class="item" data-key="${key}">
    <div class="frame">
      <div class="shot" data-tap="${key}">${art}${it.mocktail?'<span class="star">&lowast;</span>':''}${heatMark(it.heat)}<span class="badge" data-b="${it.id}"></span></div>
      <div class="panel"><div>${panelTags(it)}${inner}</div><div>${addonRows(it)}${stepper(it.id)}</div></div>
    </div>
    <div class="cap"><div class="nm">${locLines(it.n)}</div><div class="pr">${money(it.p)}</div></div>
  </article>`;
}

function listRow(r, s, ri){
  /* Name once, then the variants side by side. Two lines total instead of
     three, and the prices sit next to their labels rather than at the edge. */
  /* "noteBelow": true on the section drops the note to its own line. Used
     where the note is an ingredient list rather than a country or an age —
     those overrun the name's line on a narrow phone and break the column. */
  const inline = s.nb ? '' : (r.sub ? `<span class="sub">${esc(loc(r.sub))}</span>` : '');
  const below  = (s.nb && r.sub) ? `<div class="subline">${esc(loc(r.sub))}</div>` : '';
  /* "centreRow": true on the section drops the price to the vertical middle
     alongside the stepper. Without it the price stays on the name's line and
     only the stepper centres. */
  const rc = below ? (s.ctr ? 'row nbrow ctr' : 'row nbrow') : 'row';
  /* On a two-price row the note is ALWAYS under the name — it is the
     variety, and it belongs beside the thing it names rather than above a
     list of sizes. The section's noteBelow flag does not apply here. */
  if(r.v){
    return `<div class="row" data-row="${ri}">
      <div class="vsplit">
        <div class="vleft">
          <div class="rowname">${locLines(r.n)}</div>
          ${r.sub ? `<div class="subline">${esc(loc(r.sub))}</div>` : ''}
        </div>
        <div class="vright">${r.ids.map((id,i)=>`<div class="vline">
          <div class="vtext">
            <span class="vname">${esc(loc(s.vl[i]))}</span>
            <span class="vpr">${money(r.v[i])}</span>
          </div>
          ${stepper(id)}
        </div>`).join('')}</div>
      </div>
    </div>`;
  }
  /* Three shapes: a plain row, a note-below row with the price up top, and
     a note-below row with the price centred beside the stepper. */
  if(below && s.ctr) return `<div class="${rc}" data-row="${ri}">
    <div class="vrow single">
      <div class="nbtext"><span class="rowname">${locLines(r.n)}</span>${below}</div>
      <span class="vpr">${money(r.p)}</span>
      ${stepper(r.id)}
    </div>
  </div>`;
  if(below) return `<div class="${rc}" data-row="${ri}">
    <div class="vrow single">
      <div class="nbtext">
        <div class="nbtop"><span class="rowname">${locLines(r.n)}</span>
          <span class="vpr">${money(r.p)}</span></div>
        ${below}
      </div>
      ${stepper(r.id)}
    </div>
  </div>`;
  return `<div class="${rc}" data-row="${ri}">
    <div class="vrow single">
      <span class="rowname">${locLines(r.n)}${inline}</span>
      <span class="vpr">${money(r.p)}</span>
      ${stepper(r.id)}
    </div>
  </div>`;
}

function render(){
  const T = TABS[tab];
  let html = '';
  const ev = tab === 'Specials' ? activeEvent() : null;
  if(ev) html += posterHTML(ev);
  /* a poster plus "nothing on special" reads as a contradiction */
  if(T.stub) html += ev ? '' : `<p class="stub">${esc(u(T.stub))}</p>`;
  else if(T.secs) html += T.secs.map((s,si)=>`
    <section class="sec"><div class="sec-head"><h2>${esc(loc(s.t))}</h2><span class="rule"></span></div>
      ${s.layout === 'stack'
        ? `<div class="stack">${s.items.map(setCard).join('')}</div>`
        : `<div class="rail ${T.kind}">${s.items.map((it,i)=>card(it,T.kind,si+'-'+i)).join('')}</div>`}
    </section>`).join('');
  else html += T.list.map((s,si)=>`
    <section class="sec"><div class="sec-head"><h2>${esc(loc(s.t))}</h2><span class="rule"></span></div>
      <div class="list">${s.rows.map((r,ri)=>listRow(r,s,si+'-'+ri)).join('')}</div>
    </section>`).join('');
  main.innerHTML = `<div class="flow">${html}</div>` + footHTML();
  paintAllQty();
}

/* A link only earns its place if it points somewhere. An unedited CHANGE_ME
   is dropped rather than shipped as a dead tap. */
const wired = s => Boolean(s) && !String(s).includes('CHANGE_ME');

/* UI.footNote is deliberately not printed here any more — the tap-to-open and
   saved-on-this-device lines were written for a menu with nobody attached to
   it, and there are waiters. The string is kept so it can be put back in one
   line if that ever changes. */
function footHTML(){
  const map = (href, key, label) => wired(href)
    ? `<a href="${href}" target="_blank" rel="noopener" aria-label="${esc(label)}">${ICON[key]}</a>` : '';
  const addr  = loc(CONTACT.address);
  const icons = map(CONTACT.instagram, 'insta', 'Instagram')
              + map(CONTACT.naver,     'naver', 'Naver Map')
              + map(CONTACT.gmaps,     'gmaps', 'Google Maps');
  /* Nothing wired means no footer at all, rather than a bare rule across an
     empty block. */
  if(!wired(addr) && !icons) return '';
  return `<footer class="foot">
    ${wired(addr) ? `<p class="faddr">${esc(addr)}</p>` : ''}
    ${icons ? `<div class="fsocwrap"><div class="fsoc">${icons}</div></div>` : ''}
  </footer>`;
}

/* ---------- quantity painting (targeted, never a full re-render) ---------- */
function paintQty(id){
  main.querySelectorAll(`[data-q="${id}"]`).forEach(el=>{
    el.textContent = cart[id]||0;
    el.closest('.step').classList.toggle('empty', !cart[id]);
  });
  main.querySelectorAll('[data-b]').forEach(el=>{
    const ids = el.dataset.b.split(',');
    if(!ids.includes(id)) return;
    const n = ids.reduce((a,i)=>a+(cart[i]||0),0);
    el.textContent = n || '';
    el.classList.toggle('on', n>0);
  });
}
function paintAllQty(){
  main.querySelectorAll('[data-q]').forEach(el=>{
    const id = el.dataset.q, n = cart[id]||0, rec = INDEX[id];
    el.textContent = n;
    const step = el.closest('.step');
    step.classList.toggle('empty', !n);
    /* magenta only while another one can actually be added */
    if(rec && rec.parent) step.classList.toggle('can', n < (cart[rec.parent]||0));
  });
  main.querySelectorAll('[data-sn]').forEach(el=>{
    const n = setsOf(el.dataset.sn);
    el.textContent = n ? n + ' \u00d7' : '';
    el.classList.toggle('on', n > 0);
  });
  main.querySelectorAll('[data-b]').forEach(el=>{
    const n = el.dataset.b.split(',').reduce((a,i)=>a+(cart[i]||0),0);
    el.textContent = n || '';
    el.classList.toggle('on', n>0);
  });
}

/* ---------- geometry ----------
   Read the ratios straight out of CSS so there is one source of truth. */
const ratio = n => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(n));

/* 'boundary' → the seam between photo and panel lands on screen centre
   'card'     → the whole open card is centred
   Identical on Food (photo and panel are the same width); they differ
   by half a photo on Drinks, where the panel is narrower. */
const ALIGN = 'boundary';

function geo(rail){
  const W = main.clientWidth;
  return {
    W,
    card : W * ratio('--f-card'),
    open : W * ratio(rail.classList.contains('food') ? '--f-open-food' : '--f-open-drink'),
    gut  : W * ratio('--f-gut'),
    gap  : W * ratio('--f-gap'),
    lead : W * ratio('--f-lead')
  };
}

/* Deterministic, not measured: a card mid-transition reports an
   interpolated width, so reading offsetLeft during one lies. */
function leftOf(rail, i){
  const g = geo(rail);
  return g.gut + g.lead + g.gap + i * (g.card + g.gap);
}

/* Re-clamps every frame. The rail's scrollWidth grows while the card
   expands, so a target computed up front would otherwise be clipped. */
function glide(rail, target, ms){
  const from = rail.scrollLeft, t0 = performance.now();
  cancelAnimationFrame(rail._raf);
  const step = now => {
    const p = Math.min(1, (now - t0) / ms);
    const e = 1 - Math.pow(1 - p, 3);
    const max = Math.max(0, rail.scrollWidth - rail.clientWidth);
    rail.scrollLeft = Math.min(max, Math.max(0, from + (target - from) * e));
    if(p < 1) rail._raf = requestAnimationFrame(step);
  };
  rail._raf = requestAnimationFrame(step);
}

function centreOpen(rail, i){
  const g = geo(rail);
  const anchor = ALIGN === 'boundary' ? g.card : g.open / 2;
  glide(rail, leftOf(rail, i) + anchor - rail.clientWidth / 2, 340);
}

/* Park each rail past its leading spacer so it looks untouched at rest,
   while leaving room to scroll left when the first card opens. */
function parkRails(){
  document.querySelectorAll('.rail').forEach(r=>{
    const first = r.querySelector('.item');
    if(first) r.scrollLeft = geo(r).lead + geo(r).gap;
  });
}
/* A photo named in menu.json that isn't in the folder yet would otherwise
   render as the browser's broken-image icon. Swap in the same typographic
   tile used when no photo is named. Error events don't bubble, so capture. */
main.addEventListener('error', e=>{
  const img = e.target;
  if(!img || img.tagName !== 'IMG' || !img.dataset.fallback) return;
  /* A missing -dm is not a missing photo. Drop to the light shot and
     remember; only a light shot that also fails earns the tile. */
  const lit = img.dataset.light;
  if(lit && !img.src.endsWith(lit)){ NO_DM.add(lit); img.src = lit; return; }
  const tile = document.createElement('div');
  tile.className = 'ph';
  tile.innerHTML = `<span>${esc(img.dataset.fallback)}</span>`;
  img.replaceWith(tile);
}, true);

function sizeRails(){
  const w = main.clientWidth || document.documentElement.clientWidth || 393;
  document.documentElement.style.setProperty('--railw', w + 'px');
}
addEventListener('resize', sizeRails);
addEventListener('load', sizeRails);
if(document.fonts && document.fonts.ready) document.fonts.ready.then(sizeRails);

main.addEventListener('click', e=>{
  const tap = e.target.closest('[data-tap]');
  if(tap){
    const key = tap.dataset.tap;
    const el  = main.querySelector(`.item[data-key="${key}"]`);
    const rail= el.parentElement;
    const items = [...rail.querySelectorAll('.item')];
    main.querySelectorAll('.item.open').forEach(o=>{ if(o!==el) o.classList.remove('open'); });
    const opening = !el.classList.contains('open');
    el.classList.toggle('open', opening);
    if(opening) centreOpen(rail, items.indexOf(el));
    return;
  }
  const st = e.target.closest('[data-step]');
  if(st){ bump(st.dataset.id, Number(st.dataset.step)); }
});

/* ============================================================
   ORDER BAR / ORDER PAGE / WAITER VIEW
   ============================================================ */
const obar   = document.getElementById('obar');
const sheet  = document.getElementById('sheet');
const waiter = document.getElementById('waiter');

function paintBar(){
  const n = cartCount();
  document.getElementById('ocount').textContent = itemCount(n);
  document.getElementById('ototal').textContent = won(cartTotal());
  obar.classList.toggle('show', n>0);
  document.body.classList.toggle('hasbar', n>0);
  if(sheet.classList.contains('show')) paintSheet();
}

function paintSheet(){
  const ls = lines();
  const body = document.getElementById('sheetbody');
  if(!ls.some(l => !l.parent) && !sets.length){
    body.innerHTML = `<p class="mt">${esc(u('emptyOrder'))}</p>`;
    document.getElementById('sheetfoot').classList.add('hide');
    return;
  }
  document.getElementById('sheetfoot').classList.remove('hide');
  /* One renderer each, so the order they are composed in below is the only
     thing that decides the sequence on screen. */
  const lineHTML = l => {
    /* every add-on of this dish, whether or not any have been ordered — a
       zero row is an offer, not a leftover */
    const kids = kidsOf(l.id).map(k=>{
      const q = cart[k.id] || 0;
      const off = q ? '' : ' off';
      return `<div class="oline oadd">
      <div class="ol"><div class="oaddnm">${esc(loc(k.sub))}</div></div>
      <div class="ostep">
        <button data-o="-1" data-id="${k.id}" class="${off.trim()}">−</button>
        <span class="q${off}">${q}</span>
        <button data-o="1" data-id="${k.id}" class="${q < l.qty ? 'can' : ''}">+</button>
      </div>
      <div class="opr${q ? '' : ' zero'}">${q ? money(k.price*q) : '+' + money(k.price)}</div>
      <span class="oxs"></span>
    </div>`;}).join('');
    return `<div class="ogroup">
    <div class="oline${kids ? ' ohas' : ''}">
      <div class="ol">
        <div class="onm">${esc(loc(l.name))}</div>
        ${(l.sub||l.vshort)?`<div class="osub">${esc([loc(l.sub),loc(l.vshort)].filter(Boolean).join(' · '))}</div>`:''}
      </div>
      <div class="ostep">
        <button data-o="-1" data-id="${l.id}">−</button>
        <span class="q">${l.qty}</span>
        <button data-o="1" data-id="${l.id}">+</button>
      </div>
      <div class="opr">${money(l.price*l.qty)}</div>
      <button class="ox" data-del="${l.id}" aria-label="Remove">×</button>
    </div>${kids}</div>`;};
  const setHTML = s => {
    const rec = setRec(s);
    if(!rec) return '';
    const picks = setPicks(s).map(p => `<div class="opick">- ${esc(p)}</div>`).join('');
    return `<div class="ogroup">
      <div class="oline ohas">
        <div class="ol"><div class="onm">${esc(loc(rec.name))}</div></div>
        <button class="oedit" data-editset="${s.sid}">${esc(u('edit'))}</button>
        <div class="opr">${money(rec.price)}</div>
        <button class="ox" data-delset="${s.sid}" aria-label="Remove">×</button>
      </div>
      <div class="oline opickrow">
        <div class="ol">${picks}</div>
        <span class="oxs"></span>
      </div>
    </div>`;};
  /* Drinks first, then food — the same split the waiter view uses, so the
     customer and the bar read the order in the same sequence. No headings
     here: an order is short, and the customer knows what they ordered.
     Sets fall into their own group's block rather than trailing the whole
     list, which is where they used to sit. */
  const GROUPS = ['drink','food'];
  body.innerHTML = GROUPS.map(g =>
      ls.filter(l => !l.parent && l.group === g).map(lineHTML).join('')
    + sets.filter(s => (setRec(s)||{}).group === g).map(setHTML).join('')
  ).join('')
  /* anything with an unexpected group still has to appear somewhere */
  + ls.filter(l => !l.parent && !GROUPS.includes(l.group)).map(lineHTML).join('');
  document.getElementById('ototal2').textContent = won(cartTotal());
}

function paintWaiter(){
  const ls = lines();
  const block = (label, g) => {
    const rows = ls.filter(l => l.group === g && !l.parent);
    const mine = sets.filter(s => (setRec(s)||{}).group === g);
    if(!rows.length && !mine.length) return '';
    /* The picks are the whole point of this screen, so they get their own
       lines rather than a comma run in the grey note — the same shape an
       add-on has on the order sheet, read across a bar in the dark. */
    const setRows = mine.map(s => `<div class="wline wset"><span class="wq">1 &times;</span>
      <span class="wn"><span>${esc(setName(s, WAITER_LANG))}</span></span></div>` +
      setPicks(s, WAITER_LANG).map(p => `<div class="wpick">- ${esc(p)}</div>`).join('')
    ).join('');
    return `<h3>${esc(label)}</h3>` + rows.map(l=>{
      /* an add-on is a modification of a dish, not a dish — it reads on the
         parent's line so the bar counts plates, not lines */
      const extras = ls.filter(x => x.parent === l.id)
                       .map(x => `+${x.qty} ${pick(x.sub, WAITER_LANG)}`).join(', ');
      /* One line only, so a disambiguating note joins the name rather than
         trailing it in grey with the size. */
      const nm   = l.sub ? pick(l.name, WAITER_LANG) + ' — ' + pick(l.sub, WAITER_LANG)
                         : pick(l.name, WAITER_LANG);
      const note = [pick(l.vshort, WAITER_LANG), extras].filter(Boolean).join(' ');
      return `<div class="wline"><span class="wq">${l.qty} &times;</span>
      <span class="wn"><span>${esc(nm)}</span>${note?`<em>${esc(note)}</em>`:''}</span></div>`;
    }).join('')
    /* Sets last within their group, matching the order sheet: a line with a
       list hanging off it reads better at the end than buried in the middle. */
    + setRows;
  };
  document.getElementById('waiterbody').innerHTML =
    (block(w('drinks'),'drink') + block(w('food'),'food'))
    || `<p class="mt">${esc(w('nothingShow'))}</p>`;
}

/* ---------- the chooser ----------
   Open question, not a page: it floats over the card that raised it. It
   goes through openPanel() all the same, so back and the edge swipe close
   it like every other panel — including when it is opened from the order
   sheet to edit, where it sits on top and back reveals the sheet again. */
const chooser = document.getElementById('chooser');
let choosing = null;            // {of, sid|null, picks}

function chooseOpen(of, sid){
  const rec = INDEX[of];
  if(!rec || !rec.ch) return;
  const from = sid ? sets.find(s => s.sid === sid) : null;
  /* Editing starts from what was picked; adding starts empty. Nothing is
     pre-selected on a fresh add — there is no default for a thing that is
     a choice. */
  const picks = {};
  rec.ch.forEach(slot => { picks[slot.k] = from ? (from.picks[slot.k]||[]).slice() : []; });
  choosing = {of, sid: sid || null, picks};
  openPanel('chooser');
}

function paintChooser(){
  if(!choosing) return;
  const rec = INDEX[choosing.of];
  if(!rec){ closePanel(); return; }
  document.getElementById('chtitle').textContent = loc(rec.name);
  document.getElementById('chbody').innerHTML = rec.ch.map(slot => {
    const opts = optionsFor(rec, slot);
    const got  = choosing.picks[slot.k] || [];
    const body = opts.length
      ? opts.map(o => {
          const n = got.filter(x => x === o.oid).length;
          return `<button class="chopt${n ? ' on' : ''}" data-ch="${esc(slot.k)}" data-oid="${esc(o.oid)}">
            <span>${esc(loc(o.n))}</span>${n && slot.pick > 1 ? `<span class="chn">${n}</span>` : ''}
          </button>`;
        }).join('')
      /* A slot whose source is empty — specials.json down, or a section
         emptied — cannot be answered, so the set cannot be ordered. Saying
         so is better than an empty box with a dead Confirm under it. */
      : `<p class="chnone">${esc(u('pickNone'))}</p>`;
    return `<div class="chgrp">
      <div class="chlbl"><span>${esc(loc(slot.n))}</span>${
        slot.pick > 1 ? `<span>${got.length}/${slot.pick}</span>` : ''}</div>
      ${body}</div>`;
  }).join('');
  document.getElementById('chgo').disabled = !chooseComplete();
}

const chooseComplete = () => {
  const rec = choosing && INDEX[choosing.of];
  return Boolean(rec) && rec.ch.every(slot => (choosing.picks[slot.k]||[]).length === slot.pick);
};

/* Tapping always does something. With room left it adds one — so the same
   cocktail twice is just two taps. Once the slot is full, tapping something
   already picked takes one back, and tapping anything else replaces the
   oldest pick, which keeps a full slot editable without a second control. */
function chooseTap(k, oid){
  const rec = INDEX[choosing.of];
  const slot = rec.ch.find(s => s.k === k);
  if(!slot) return;
  const got = choosing.picks[k] || (choosing.picks[k] = []);
  if(slot.pick === 1){ choosing.picks[k] = got[0] === oid ? [] : [oid]; }
  else if(got.length < slot.pick){ got.push(oid); }
  else {
    const at = got.indexOf(oid);
    if(at > -1) got.splice(at, 1);
    else { got.shift(); got.push(oid); }
  }
  paintChooser();
}

document.getElementById('chbody').addEventListener('click', e => {
  const b = e.target.closest('[data-ch]');
  if(b) chooseTap(b.dataset.ch, b.dataset.oid);
});

document.getElementById('chgo').addEventListener('click', () => {
  if(!choosing || !chooseComplete()) return;
  /* specials.json can land while the chooser is open, taking a cocktail off
     the list under the customer's finger. Repaint rather than commit a pick
     the kitchen can no longer make. */
  if(!validSet({sid:'check', of:choosing.of, picks:choosing.picks})){ paintChooser(); return; }
  if(choosing.sid) editSet(choosing.sid, choosing.picks);
  else             addSet(choosing.of, choosing.picks);
  closePanel();
  if(sheet.classList.contains('show')) paintSheet();
});

document.getElementById('chclose').addEventListener('click', closePanel);
/* tapping the dimmed page behind is the other obvious way out */
chooser.addEventListener('click', e => { if(e.target === chooser) closePanel(); });

main.addEventListener('click', e => {
  const b = e.target.closest('[data-choose]');
  if(b) chooseOpen(b.dataset.choose, null);
});

/* ============================================================
   BACK / SWIPE

   The order sheet and the waiter view cover the whole screen, so
   every phone user reads them as pages and reaches for back to
   leave one. Without this, back leaves the SITE — the worst
   failure we have, because it looks like the order was thrown
   away.

   Each panel pushes one history entry as it opens. Back — or an
   edge swipe on iOS, which is the same event — pops it, and the
   handler closes whatever is on top. The × buttons deliberately
   go through history.back() as well rather than hiding the panel
   directly: if they didn't, the pushed entry would still be
   sitting there and a later back press would reopen a panel the
   customer had already dismissed.

   The URL never changes, so nothing here needs anything of the
   server, and ?when= survives untouched.
   ============================================================ */
let depth = 0;                  // history entries we are responsible for

const showSheet  = () => { hideUndo(); paintSheet(); sheet.classList.add('show'); document.body.style.overflow='hidden'; };
const hideSheet  = () => { hideUndo(); sheet.classList.remove('show'); document.body.style.overflow=''; };
const showWaiter = () => { paintWaiter(); waiter.classList.add('show'); };
const hideWaiter = () => waiter.classList.remove('show');
const showChooser = () => { paintChooser(); chooser.classList.add('show'); document.body.style.overflow='hidden'; };
const hideChooser = () => {
  chooser.classList.remove('show'); choosing = null;
  /* the sheet may be underneath and still wants the page frozen */
  if(!sheet.classList.contains('show')) document.body.style.overflow='';
};

const PANEL = {sheet:showSheet, waiter:showWaiter, chooser:showChooser};

function openPanel(kind){
  try{ history.pushState({hideout:kind}, ''); depth++; }catch(e){}
  (PANEL[kind] || showSheet)();
}

/* One way out, whichever control the customer used. */
function closePanel(){
  if(depth > 0){ history.back(); return; }      // popstate does the closing
  hideChooser(); hideWaiter(); hideSheet();     // no entry to pop: close directly
}

addEventListener('popstate', () => {
  /* Topmost first: the waiter view opens on top of the order sheet, so one
     back press should reveal the sheet rather than dismiss both. The chooser
     can open above either, so it is checked before both. */
  if(chooser.classList.contains('show')){ hideChooser(); depth = Math.max(0, depth-1); return; }
  if(waiter.classList.contains('show')){ hideWaiter(); depth = Math.max(0, depth-1); return; }
  if(sheet.classList.contains('show')){  hideSheet();  depth = Math.max(0, depth-1); return; }
  depth = 0;                                  // nothing of ours was open
});

document.getElementById('oopen').addEventListener('click', () => openPanel('sheet'));
document.getElementById('showwaiter').addEventListener('click', () => openPanel('waiter'));
document.getElementById('sheetclose').addEventListener('click', closePanel);
document.getElementById('waiterclose').addEventListener('click', closePanel);
/* ---------- clear, and the way back ---------- */
const undoBar = document.getElementById('undo');
const UNDO_MS = 8000;
let cleared = null, undoTimer = null;

function hideUndo(){
  undoBar.classList.remove('show');
  clearTimeout(undoTimer);
  cleared = null;
}

function showUndo(){
  undoBar.classList.add('show');
  clearTimeout(undoTimer);
  undoTimer = setTimeout(hideUndo, UNDO_MS);
}

document.getElementById('clearorder').addEventListener('click', ()=>{
  if(!cartCount()) return;
  cleared = {cart:Object.assign({}, cart), sets:sets.slice()};  // held only while the offer stands
  cart = {}; sets = [];
  saveCart(); saveSets(); paintAllQty(); paintBar(); paintSheet();
  showUndo();
});

document.getElementById('undogo').addEventListener('click', ()=>{
  if(cleared){
    cart = cleared.cart; sets = cleared.sets;
    saveCart(); saveSets(); paintAllQty(); paintBar(); paintSheet();
  }
  hideUndo();
});

document.getElementById('undox').addEventListener('click', hideUndo);

document.getElementById('sheetbody').addEventListener('click', e=>{
  const ed = e.target.closest('[data-editset]');
  if(ed){ chooseOpen(sets.find(s => s.sid === ed.dataset.editset).of, ed.dataset.editset); return; }
  const ds = e.target.closest('[data-delset]');
  if(ds){ dropSet(ds.dataset.delset); paintSheet(); return; }
  const del = e.target.closest('[data-del]');
  if(del){ setQty(del.dataset.del, 0); paintSheet(); return; }
  const st = e.target.closest('[data-o]');
  if(st){ bump(st.dataset.id, Number(st.dataset.o)); paintSheet(); }
});


/* Web convention: the wordmark is home, and home is Specials. Guarded because
   Specials is not guaranteed to exist — a failed specials.json leaves a stub,
   and menu.json need never have asked for the tab at all. */
document.getElementById('home').addEventListener('click', () => {
  const home = TAB_ORDER.includes('Specials') ? 'Specials' : TAB_ORDER[0];
  if(!home) return;
  showTab(home);
  scrollTo({top:0});
});

document.getElementById('nav').addEventListener('click', e=>{
  const b = e.target.closest('[data-tab]'); if(!b) return;
  showTab(b.dataset.tab);
  scrollTo({top:0});
});

function showTab(name){
  tab = name;
  document.querySelectorAll('[data-tab]').forEach(x => x.classList.toggle('on', x.dataset.tab === tab));
  render();
  sizeRails();
  requestAnimationFrame(parkRails);
}

/* ============================================================
   LANGUAGE SWITCHING

   Nothing is re-fetched and nothing is re-indexed: the cart ids
   are built from English, so they are identical in every
   language and the basket rides through a switch untouched.
   ============================================================ */
function paintLangs(){
  document.getElementById('drawer').innerHTML =
    LANGS.concat(LANG_SOON).map(l => {
      const soon = !LANGS.includes(l);
      return `<button data-lang="${l}" lang="${l}"
        class="${soon ? 'soon' : ''}${l === LANG ? ' on' : ''}"
        ${soon ? 'disabled aria-disabled="true"' : ''}
        aria-current="${l === LANG ? 'true' : 'false'}"
      >${LANG_FLAG[l] ? `<img class="flag" src="${LANG_FLAG[l]}" alt="" loading="lazy">` : ''}${esc(LANG_LABEL[l] || l.toUpperCase())}</button>`;
    }).join('');
}

const drawer = document.getElementById('drawer');
const burger = document.getElementById('burger');

function openDrawer(on){
  drawer.classList.toggle('open', on);
  burger.setAttribute('aria-expanded', on ? 'true' : 'false');
}

burger.addEventListener('click', e => {
  e.stopPropagation();
  openDrawer(!drawer.classList.contains('open'));
});
/* anywhere else on the page closes it */
document.addEventListener('click', e => {
  if(!drawer.contains(e.target)) openDrawer(false);
});
addEventListener('keydown', e => { if(e.key === 'Escape') openDrawer(false); });

/* Static markup carries its English in the HTML so the page reads correctly
   before any script runs; this replaces it once a language is known. */
function paintChrome(){
  document.documentElement.lang = LANG;
  document.querySelectorAll('[data-ui]').forEach(el => { el.textContent = u(el.dataset.ui); });
  document.querySelectorAll('[data-uiw]').forEach(el => { el.textContent = w(el.dataset.uiw); });
}

function setLang(next){
  if(!LANGS.includes(next) || next === LANG) return;
  LANG = next;
  try{ localStorage.setItem(LANG_KEY, LANG); }catch(e){}
  paintLangs();
  paintChrome();
  paintNav();
  document.querySelectorAll('[data-tab]').forEach(x => x.classList.toggle('on', x.dataset.tab === tab));
  render();
  sizeRails();
  requestAnimationFrame(parkRails);
  paintBar();
  if(sheet.classList.contains('show'))  paintSheet();
  if(waiter.classList.contains('show')) paintWaiter();
}

drawer.addEventListener('click', e => {
  const b = e.target.closest('[data-lang]');
  if(!b || b.disabled) return;
  setLang(b.dataset.lang);
  openDrawer(false);
});

/* ---------- theme switching ---------- */
function themeIcon(){
  const next = THEME === 'dark' ? 'light' : 'dark';
  const btn = document.getElementById('mode');
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">` +
                  `<path d="${THEME_ICON[next]}"/></svg>`;
  btn.setAttribute('aria-label', next === 'dark' ? 'Dark mode' : 'Light mode');
}

function applyTheme(){
  document.documentElement.dataset.theme = THEME;
  themeIcon();
  /* the phone paints its own chrome from this, so it has to keep up */
  /* Must match --paper for the theme, or the phone paints a strip of the
     wrong colour above the menu. There is a test tying these to the CSS. */
  const meta = document.querySelector('meta[name="theme-color"]');
    /* Photography follows the theme without a re-render — swapping src keeps
     scroll position, open panels and the carousel's parked offset intact. */
  document.querySelectorAll('img[data-light]').forEach(img=>{
    const want = shotSrc(img.dataset.light);
    if(!img.src.endsWith(want)) img.src = want;
  });
  if(meta) meta.setAttribute('content', THEME === 'dark' ? '#1f1f1f' : '#fff');
}

function setTheme(next){
  if(!THEMES.includes(next) || next === THEME) return;
  THEME = next;
  try{ localStorage.setItem(THEME_KEY, THEME); }catch(e){}
  applyTheme();
}

document.getElementById('mode').addEventListener('click', () => {
  setTheme(THEME === 'dark' ? 'light' : 'dark');
});

/* ---------- boot ---------- */
function fatal(msg){
  document.getElementById('main').innerHTML =
    `<p class="stub">${esc(msg)}</p>`;
  document.getElementById('nav').innerHTML = '';
}

/* Staff-only notice. Customers see a working menu; whoever is on shift
   sees that it is the cached one and that menu.json needs fixing. */
function staleWarning(){
  const el = document.createElement('div');
  el.className = 'stale';
  el.textContent = 'Menu file has an error — showing the last saved version. Tell whoever edited it.';
  document.body.appendChild(el);
  el.addEventListener('click', ()=> el.remove());
}

function start(){
  THEME = firstTheme();
  applyTheme();
  paintLangs();
  paintChrome();
  paintNav();
  applySpecials(document.getElementById('specials-data').textContent, 'the built-in block');
  cart = loadCart();          // INDEX is populated by now, so ids can be checked
  sets = loadSets();          // same reason, and its picks need the options to exist
  showTab(landingTab());
  paintBar();
  refreshSpecials();
  refreshEvents();
}

function loadMenu(){
  const cached = (()=>{ try{ return localStorage.getItem(MENU_CACHE); }catch(e){ return null; } })();

  /* Two tiers, deliberately. There is no copy of the menu baked into this
     file: one would need regenerating every time menu.json changed, and a
     forgotten regeneration means serving last year's prices to a paying
     customer. Wrong prices are worse than no menu. */
  const useCached = (why) => {
    console.warn('menu: could not use menu.json —', why);
    if(cached){
      try{ applyMenu(cached, 'device cache'); start(); staleWarning(); return; }catch(e){}
    }
    fatal(location.protocol === 'file:' ? u('needServer') : u('menuBad'));
  };

  if(typeof fetch !== 'function'){ useCached('no fetch available'); return; }

  fetch('menu.json', {cache:'no-store'})
    .then(r => r.ok ? r.text() : Promise.reject('HTTP ' + r.status))
    .then(txt => {
      applyMenu(txt, 'menu.json');          // throws if malformed
      try{ localStorage.setItem(MENU_CACHE, txt); }catch(e){}
      start();
    })
    .catch(useCached);
}

loadMenu();
})();
