/* Beam Care — ملف تشغيل الأبلكيشن من غير نت */
const V = 'beamcare-v8';
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(['./', './index.html'])).catch(() => {})); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V && k.startsWith('beamcare-')).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
const CDN = /(gstatic\.com\/firebasejs|cdnjs\.cloudflare\.com|fonts\.gstatic\.com|fonts\.googleapis\.com)/;
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin === location.origin) {
    // دايماً النسخة الجديدة من النت، ولو مفيش نت نفتح آخر نسخة اتحفظت لنفس الصفحة
    e.respondWith(fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); } return res; })
      .catch(async () => (await caches.match(r, { ignoreSearch: true })) || (u.pathname.endsWith('/') ? await caches.match(u.pathname + 'index.html', { ignoreSearch: true }) : null) || Response.error()));
    return;
  }
  if (CDN.test(r.url)) {
    e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => { if (res.ok || res.type === 'opaque') { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); } return res; })));
  }
});

/* إشعارات الموبايل: السيرفر بيصحّي الموبايل، وإحنا بنجيب نص الإشعار ونعرضه */
self.addEventListener('push', e => {
  e.waitUntil((async () => {
    let m = { title: '🔔 Beam Care', body: 'يوجد جديد في النظام' }, home = './';
    try { const c = await caches.open('bc-meta'); const r = await c.match('/__bc_meta'); if (r) { const meta = await r.json(); home = meta.home || home; const x = await fetch(meta.url + '/last?t=' + encodeURIComponent(meta.t)).then(r => r.json()); if (x.title) m = x; } } catch (er) {}
    await self.registration.showNotification(m.title, { body: m.body, icon: 'icon-192.png', badge: 'icon-192.png', dir: 'rtl', lang: 'ar', tag: 'bc-' + (m.at || Date.now()), data: { url: home } });
  })());
});
self.addEventListener('notificationclick', e => {
  e.notification.close(); const url = e.notification.data?.url || './';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(L => { for (const c of L) { if ('focus' in c) return c.focus(); } return self.clients.openWindow(url); }));
});
