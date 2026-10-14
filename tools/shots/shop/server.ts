// Hearth & Co: the demo shop the screenshots show, a buyer, a seller and an admin of one marketplace.
// Signing in is a name only (a demo site of our own: no passwords). One state served on several ports, so every
// Kulisa task (each runs the app on its own ports: the usual ones plus 100, 200 …) sees the same shop.
//   node server.ts 4480 4580 4680
import http from 'node:http';

type User = { id: string; name: string; role: 'buyer' | 'seller' | 'admin' };
type Item = { product: number; qty: number };
type Order = { id: number; buyer: string; items: Item[]; status: 'new' | 'shipped'; at: string };

const users: User[] = [
  { id: 'anna', name: 'Anna Berg', role: 'buyer' },
  { id: 'ben', name: 'Ben Okafor', role: 'seller' },
  { id: 'cleo', name: 'Cleo Duarte', role: 'admin' },
];
const products = [
  { id: 1, name: 'Stoneware mug', price: 24, hue: 215 },
  { id: 2, name: 'Linen tea towel', price: 18, hue: 32 },
  { id: 3, name: 'Walnut board', price: 46, hue: 20 },
  { id: 4, name: 'Beeswax candle', price: 12, hue: 48 },
  { id: 5, name: 'Wool throw', price: 89, hue: 350 },
  { id: 6, name: 'Clay planter', price: 31, hue: 140 },
];
const orders: Order[] = [
  { id: 1041, buyer: 'Maya Lund', items: [{ product: 3, qty: 1 }], status: 'shipped', at: '09:12' },
  { id: 1042, buyer: 'Omar Haddad', items: [{ product: 2, qty: 2 }, { product: 4, qty: 1 }], status: 'shipped', at: '10:47' },
  { id: 1043, buyer: 'Iris Vogel', items: [{ product: 5, qty: 1 }], status: 'new', at: '11:30' },
];
const carts = new Map<string, Item[]>();
let changes = 0; // pages poll it and reload when it moves, so an order shows up for the seller and the admin

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const money = (n: number) => `$${n.toFixed(2)}`;
const total = (items: Item[]) => items.reduce((s, i) => s + i.qty * products.find((p) => p.id === i.product)!.price, 0);
const itemsText = (items: Item[]) => items.map((i) => `${products.find((p) => p.id === i.product)!.name}${i.qty > 1 ? ` × ${i.qty}` : ''}`).join(', ');
const now = () => new Date().toTimeString().slice(0, 5);

const css = `
:root { color-scheme: light dark; --bg: #faf7f2; --card: #fff; --ink: #2b2620; --muted: #7a7064; --line: #e8e1d6; --accent: #b4532a; --ok: #2f7d4f; }
@media (prefers-color-scheme: dark) { :root { --bg: #1d1a17; --card: #26221e; --ink: #efe8de; --muted: #a59b8e; --line: #3a342d; --accent: #e07a4b; --ok: #5dbb84; } }
* { box-sizing: border-box; } body { margin: 0; font: 15px/1.45 system-ui, sans-serif; background: var(--bg); color: var(--ink); }
header { display: flex; align-items: center; gap: 16px; padding: 12px 24px; border-bottom: 1px solid var(--line); background: var(--card); }
header .brand { font-weight: 700; font-size: 18px; letter-spacing: .2px; } header .brand span { color: var(--accent); }
header nav { margin-left: auto; display: flex; gap: 14px; align-items: center; color: var(--muted); }
header .who { display: flex; align-items: center; gap: 8px; } .badge { font-size: 12px; padding: 2px 8px; border-radius: 99px; background: var(--line); }
main { padding: 20px 24px; max-width: 1100px; } h1 { font-size: 20px; margin: 0 0 14px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 14px; }
.card { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 12px; }
.ph { height: 92px; border-radius: 8px; margin-bottom: 10px; }
.card h3 { margin: 0; font-size: 15px; } .price { color: var(--muted); margin: 2px 0 10px; }
button { font: inherit; border: 0; border-radius: 8px; padding: 7px 12px; background: var(--accent); color: #fff; cursor: pointer; }
button.quiet { background: var(--line); color: var(--ink); }
.layout { display: grid; grid-template-columns: 1fr 260px; gap: 20px; align-items: start; }
.cart li { display: flex; justify-content: space-between; padding: 4px 0; } .cart ul { list-style: none; margin: 0 0 10px; padding: 0; }
table { width: 100%; border-collapse: collapse; background: var(--card); border: 1px solid var(--line); border-radius: 12px; overflow: hidden; }
th, td { text-align: left; padding: 9px 12px; border-bottom: 1px solid var(--line); } th { color: var(--muted); font-weight: 500; font-size: 13px; }
tr:last-child td { border-bottom: 0; } td { vertical-align: top; }
@media (max-width: 760px) {
  body { font-size: 14px; } header { padding: 10px 16px; } main { padding: 14px 16px; } h1 { font-size: 18px; }
  .layout { grid-template-columns: 1fr; } .layout aside { order: -1; }
  .grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; } .ph { height: 64px; }
  th, td { padding: 7px 8px; font-size: 13px; } .wide { display: none; } .stats { gap: 8px; } .stats b { font-size: 18px; }
} .status { font-size: 12px; padding: 2px 8px; border-radius: 99px; }
.status.new { background: color-mix(in srgb, var(--accent) 18%, transparent); color: var(--accent); }
.status.shipped { background: color-mix(in srgb, var(--ok) 18%, transparent); color: var(--ok); }
.stats { display: flex; gap: 14px; margin-bottom: 16px; } .stats .card { flex: 1; } .stats b { display: block; font-size: 22px; }
.login { max-width: 360px; margin: 60px auto; } .login a { display: block; margin: 8px 0; padding: 10px 14px; border: 1px solid var(--line); border-radius: 10px; color: inherit; text-decoration: none; background: var(--card); }
`;

function page(title: string, user: User | undefined, body: string) {
  const who = user ? `<span class="who">${esc(user.name)} <span class="badge">${user.role}</span></span><a href="/logout">Sign out</a>` : '';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(title)} · Hearth &amp; Co</title>
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#b4532a"/><path d="M9 22V13l7-5 7 5v9h-5v-5h-4v5z" fill="#fff"/></svg>')}">
<style>${css}</style></head><body><header><span class="brand">Hearth <span>&amp;</span> Co</span><nav>${who}</nav></header><main>${body}</main>
<script>setInterval(async () => { try { if (await (await fetch('/api/changes')).text() !== '${changes}') location.reload(); } catch {} }, 1500)</script>
</body></html>`;
}

function shop(user: User) {
  const cart = carts.get(user.id) || [];
  const cards = products.map((p) => `<div class="card"><div class="ph" style="background: linear-gradient(135deg, hsl(${p.hue} 55% 72%), hsl(${p.hue} 45% 55%))"></div>
<h3>${esc(p.name)}</h3><p class="price">${money(p.price)}</p><form method="post" action="/cart"><input type="hidden" name="product" value="${p.id}"><button>Add to cart</button></form></div>`).join('');
  const lines = cart.map((i) => { const p = products.find((x) => x.id === i.product)!; return `<li><span>${esc(p.name)}${i.qty > 1 ? ` × ${i.qty}` : ''}</span><span>${money(p.price * i.qty)}</span></li>`; }).join('');
  const mine = orders.filter((o) => o.buyer === user.name).map((o) => `<li><span>#${o.id}</span><span class="status ${o.status}">${o.status}</span></li>`).join('');
  return page('Shop', user, `<div class="layout"><section><h1>Handmade for the home</h1><div class="grid">${cards}</div></section>
<aside class="card cart"><h3>Your cart</h3>${cart.length ? `<ul>${lines}</ul><p><b>Total ${money(total(cart))}</b></p><form method="post" action="/order"><button>Place order</button></form>` : '<p class="price">Your cart is empty.</p>'}
${mine ? `<h3 style="margin-top:14px">Your orders</h3><ul>${mine}</ul>` : ''}</aside></div>`);
}

function ordersTable(list: Order[], actions: boolean) {
  const rows = [...list].reverse().map((o) => `<tr data-order="${o.id}"><td>#${o.id}</td><td>${esc(o.buyer)}</td><td>${esc(itemsText(o.items))}</td><td>${money(total(o.items))}</td><td class="wide">${o.at}</td>
<td><span class="status ${o.status}">${o.status}</span></td>${actions ? `<td>${o.status === 'new' ? `<form method="post" action="/ship"><input type="hidden" name="order" value="${o.id}"><button class="quiet">Mark shipped</button></form>` : ''}</td>` : ''}</tr>`).join('');
  return `<table><thead><tr><th>Order</th><th>Buyer</th><th>Items</th><th>Total</th><th class="wide">Time</th><th>Status</th>${actions ? '<th></th>' : ''}</tr></thead><tbody>${rows}</tbody></table>`;
}

function seller(user: User) {
  return page('Orders', user, `<h1>Orders to ship</h1>${ordersTable(orders, true)}`);
}

function admin(user: User) {
  const fresh = orders.filter((o) => o.status === 'new').length;
  const stats = `<div class="stats"><div class="card"><span class="price">Orders today</span><b>${orders.length}</b></div>
<div class="card"><span class="price">To ship</span><b>${fresh}</b></div><div class="card"><span class="price">Revenue</span><b>${money(orders.reduce((s, o) => s + total(o.items), 0))}</b></div></div>`;
  return page('Admin', user, `<h1>Marketplace</h1>${stats}${ordersTable(orders, false)}`);
}

const home = { buyer: '/shop', seller: '/seller', admin: '/admin' } as const;

function handle(req: http.IncomingMessage, res: http.ServerResponse, form: URLSearchParams) {
  const u = new URL(req.url || '/', 'http://x');
  const user = users.find((x) => x.id === /(?:^|;\s*)user=(\w+)/.exec(req.headers.cookie || '')?.[1]);
  const go = (to: string, cookie?: string) => { res.writeHead(303, { location: to, ...(cookie ? { 'set-cookie': cookie } : {}) }); res.end(); };
  const send = (html: string) => { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end(html); };
  if (u.pathname === '/api/changes') { res.writeHead(200, { 'content-type': 'text/plain' }); return res.end(String(changes)); }
  if (u.pathname === '/login') {
    const as = users.find((x) => x.id === u.searchParams.get('as'));
    if (as) return go(home[as.role], `user=${as.id}; Path=/; Max-Age=31536000; SameSite=Lax`);
    return send(page('Sign in', undefined, `<div class="login"><h1>Sign in</h1>${users.map((x) => `<a href="/login?as=${x.id}">${esc(x.name)} <span class="badge">${x.role}</span></a>`).join('')}</div>`));
  }
  if (u.pathname === '/logout') return go('/login', 'user=; Path=/; Max-Age=0');
  if (!user) return go('/login');
  if (req.method === 'POST' && u.pathname === '/cart' && user.role === 'buyer') {
    const id = Number(form.get('product')), cart = carts.get(user.id) || [];
    const line = cart.find((i) => i.product === id);
    if (line) line.qty++; else if (products.some((p) => p.id === id)) cart.push({ product: id, qty: 1 });
    carts.set(user.id, cart);
    return go('/shop');
  }
  if (req.method === 'POST' && u.pathname === '/order' && user.role === 'buyer') {
    const cart = carts.get(user.id) || [];
    if (cart.length) { orders.push({ id: (orders.at(-1)?.id || 1040) + 1, buyer: user.name, items: cart, status: 'new', at: now() }); carts.delete(user.id); changes++; }
    return go('/shop');
  }
  if (req.method === 'POST' && u.pathname === '/ship' && user.role === 'seller') {
    const o = orders.find((x) => x.id === Number(form.get('order')));
    if (o) { o.status = 'shipped'; changes++; }
    return go('/seller');
  }
  if (u.pathname === '/') return go(home[user.role]);
  if (u.pathname === '/shop' && user.role === 'buyer') return send(shop(user));
  if (u.pathname === '/seller' && user.role === 'seller') return send(seller(user));
  if (u.pathname === '/admin' && user.role === 'admin') return send(admin(user));
  return go(home[user.role]);
}

const server = (req: http.IncomingMessage, res: http.ServerResponse) => {
  let body = '';
  req.on('data', (d) => (body += d));
  req.on('end', () => handle(req, res, new URLSearchParams(body)));
};
const ports = process.argv.slice(2).map(Number).filter(Boolean);
for (const port of ports.length ? ports : [4480]) http.createServer(server).listen(port, '127.0.0.1', () => console.log(`[shop] http://localhost:${port}`));
