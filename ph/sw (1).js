/* Beam Care Pharmacy — بيخلّي السيستم يفتح حتى لو النت قاطع */
const C='ph-v1.0.0';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','manifest.json','icon-192.png','drugs.json','../bg/glass-light.jpg','../bg/glass-warm.jpg']).catch(()=>{})))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x.startsWith('ph-')).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(u.origin!==location.origin){if(/gstatic|googleapis|cdnjs/.test(u.host))e.respondWith(caches.open(C).then(c=>c.match(r).then(m=>m||fetch(r).then(x=>{if(x.ok)c.put(r,x.clone());return x}))));return}
  if(r.mode==='navigate'||u.pathname.endsWith('.html')){e.respondWith(fetch(r).then(x=>{const y=x.clone();caches.open(C).then(c=>c.put(r,y));return x}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));return}
  e.respondWith(caches.match(r).then(m=>{const f=fetch(r).then(x=>{if(x.ok){const y=x.clone();caches.open(C).then(c=>c.put(r,y))}return x}).catch(()=>m);return m||f}))});
