/* Beam Care Pharmacy — بيخلّي السيستم يفتح حتى لو النت قاطع */
const C='ph-v1.2.0';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','manifest.json','icon-192.png','drugs.json','../bg/glass-light.jpg','../bg/glass-warm.jpg']).catch(()=>{})))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x.startsWith('ph-')).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(u.origin!==location.origin){if(/gstatic|googleapis|cdnjs/.test(u.host))e.respondWith(caches.open(C).then(c=>c.match(r).then(m=>m||fetch(r).then(x=>{if(x.ok)c.put(r,x.clone());return x}))));return}
  if(r.mode==='navigate'||u.pathname.endsWith('.html')){e.respondWith(fetch(r).then(x=>{const y=x.clone();caches.open(C).then(c=>c.put(r,y));return x}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));return}
  e.respondWith(caches.match(r).then(m=>{const f=fetch(r).then(x=>{if(x.ok){const y=x.clone();caches.open(C).then(c=>c.put(r,y))}return x}).catch(()=>m);return m||f}))});
self.addEventListener('notificationclick',e=>{e.notification.close();const url=(e.notification.data&&e.notification.data.url)||'./';e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(L=>{for(const c of L){if('focus' in c)return c.focus()}return self.clients.openWindow(url)}))});
/* إشعارات الموبايل: السيرفر بيصحّي الموبايل، وإحنا بنجيب نص الإشعار ونعرضه */
self.addEventListener('push',e=>{e.waitUntil((async()=>{let m={title:'🔔 إشعار جديد',body:'فيه حاجة جديدة في الصيدلية'},home='./';
  try{const c=await caches.open('bc-meta');const r=await c.match('/__bc_meta_ph');if(r){const meta=await r.json();home=meta.home||home;const x=await fetch(meta.url+'/last?t='+encodeURIComponent(meta.t)).then(r=>r.json());if(x.title)m=x}}catch(er){}
  await self.registration.showNotification(m.title,{body:m.body,icon:'icon-192.png',badge:'icon-192.png',dir:'rtl',lang:'ar',tag:'ph-'+(m.at||Date.now()),data:{url:home}})})())});
