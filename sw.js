// Beam Care Clinic: بيخلي السيستم يتثبت كأبليكيشن. البيانات دايماً من النت (مفيش تخزين قديم).
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
