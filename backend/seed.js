/**
 * Seed script — test verileri oluşturur.
 * Kullanım: npm run seed
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('./config/database');

console.log('🌱 Seed işlemi başlatılıyor...\n');

// Mevcut verileri temizle
db.exec(`
  DELETE FROM permission_logs;
  DELETE FROM notifications;
  DELETE FROM usage_stats;
  DELETE FROM time_restrictions;
  DELETE FROM block_rules;
  DELETE FROM devices;
  DELETE FROM pairing_codes;
  DELETE FROM children;
  DELETE FROM app_catalog;
  DELETE FROM users;
`);
console.log('🗑️  Mevcut veriler temizlendi.');

// ===== Kullanıcılar =====
const parentId = uuidv4();
const childId = uuidv4();
const salt = bcrypt.genSaltSync(10);
const passwordHash = bcrypt.hashSync('123456', salt);

db.prepare('INSERT INTO users (id, email, password_hash, role, name) VALUES (?, ?, ?, ?, ?)').run(parentId, 'parent@test.com', passwordHash, 'parent', 'Ahmet Yılmaz');
db.prepare('INSERT INTO users (id, email, password_hash, role, name) VALUES (?, ?, ?, ?, ?)').run(childId, 'child@test.com', passwordHash, 'child', 'Elif Yılmaz');

// Cicek Yildiz ve Nergis Yildiz
const cicekParentId = uuidv4();
const nergisChildId = uuidv4();
db.prepare('INSERT INTO users (id, email, password_hash, role, name) VALUES (?, ?, ?, ?, ?)').run(cicekParentId, 'CicekYildiz@test.com', passwordHash, 'parent', 'Çiçek Yıldız');
db.prepare('INSERT INTO users (id, email, password_hash, role, name) VALUES (?, ?, ?, ?, ?)').run(nergisChildId, 'nergisyildiz@test.com', passwordHash, 'child', 'Nergis Yıldız');
console.log('👤 Kullanıcılar oluşturuldu:');
console.log('   Parent: parent@test.com / 123456');
console.log('   Child:  child@test.com / 123456');
console.log('   Parent: CicekYildiz@test.com / 123456');
console.log('   Child:  nergisyildiz@test.com / 123456');

// ===== Eşleştirme =====
const childRecordId = uuidv4();
db.prepare('INSERT INTO children (id, parent_id, child_user_id, name, age) VALUES (?, ?, ?, ?, ?)').run(childRecordId, parentId, childId, 'Elif', 12);

// Nergis Child Eşleşmesi
const nergisChildRecordId = uuidv4();
db.prepare('INSERT INTO children (id, parent_id, child_user_id, name, age) VALUES (?, ?, ?, ?, ?)').run(nergisChildRecordId, cicekParentId, nergisChildId, 'Nergis', 10);
console.log('🔗 Eşleştirmeler oluşturuldu.');

// ===== Cihaz =====
const deviceId = uuidv4();
db.prepare('INSERT INTO devices (id, child_id, device_name, platform, device_identifier) VALUES (?, ?, ?, ?, ?)').run(deviceId, childRecordId, 'Samsung Galaxy A52', 'android', 'device-seed-001');

// Nergis Cihaz Eşleşmesi
const nergisDeviceId = uuidv4();
db.prepare('INSERT INTO devices (id, child_id, device_name, platform, device_identifier) VALUES (?, ?, ?, ?, ?)').run(nergisDeviceId, nergisChildRecordId, 'Xiaomi Redmi Note 10', 'android', 'device-nergis-001');
console.log('📱 Cihazlar kaydedildi.');

// ===== App Catalog (Uygulama Kataloğu) =====
const apps = [
  { id: uuidv4(), name: 'Instagram', pkg: 'com.instagram.android', category: 'social' },
  { id: uuidv4(), name: 'YouTube', pkg: 'com.google.android.youtube', category: 'video' },
  { id: uuidv4(), name: 'WhatsApp', pkg: 'com.whatsapp', category: 'messaging' },
  { id: uuidv4(), name: 'TikTok', pkg: 'com.tiktok.android', category: 'social' },
  { id: uuidv4(), name: 'Snapchat', pkg: 'com.snapchat.android', category: 'social' },
  { id: uuidv4(), name: 'Spotify', pkg: 'com.spotify.music', category: 'music' },
  { id: uuidv4(), name: 'Discord', pkg: 'com.discord', category: 'messaging' },
  { id: uuidv4(), name: 'Chrome', pkg: 'com.android.chrome', category: 'browser' },
  { id: uuidv4(), name: 'X (Twitter)', pkg: 'com.twitter.android', category: 'social' },
  { id: uuidv4(), name: 'Netflix', pkg: 'com.netflix.mediaclient', category: 'video' },
];
for (const app of apps) {
  db.prepare('INSERT INTO app_catalog (id, app_name, package_name, category) VALUES (?, ?, ?, ?)').run(app.id, app.name, app.pkg, app.category);
}
console.log('📦 Uygulama kataloğu oluşturuldu (10 uygulama).');

// App ID'lerini bul (block_rules, time_restrictions, usage_stats için)
const getAppId = (pkg) => apps.find(a => a.pkg === pkg)?.id || null;

// ===== Block Rules =====
const blockRules = [
  { app: 'TikTok', pkg: 'com.tiktok.android' },
  { app: 'Snapchat', pkg: 'com.snapchat.android' },
];
for (const rule of blockRules) {
  db.prepare('INSERT INTO block_rules (id, parent_id, child_id, app_id, app_name, package_name, is_blocked) VALUES (?, ?, ?, ?, ?, ?, ?)').run(uuidv4(), parentId, childRecordId, getAppId(rule.pkg), rule.app, rule.pkg, 1);
}
console.log('🚫 Engelleme kuralları oluşturuldu.');

// ===== Time Restrictions =====
const timeRestrictions = [
  { app: 'Instagram', pkg: 'com.instagram.android', day: 'Pazartesi-Cuma', start: '09:00', end: '17:00', limit: 60 },
  { app: 'YouTube', pkg: 'com.google.android.youtube', day: 'Her gün', start: '10:00', end: '20:00', limit: 120 },
];
for (const tr of timeRestrictions) {
  db.prepare('INSERT INTO time_restrictions (id, parent_id, child_id, app_id, app_name, package_name, day_of_week, start_time, end_time, daily_limit, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(uuidv4(), parentId, childRecordId, getAppId(tr.pkg), tr.app, tr.pkg, tr.day, tr.start, tr.end, tr.limit, 1);
}

// Nergis için zaman kısıtlamaları ekle
db.prepare('INSERT INTO time_restrictions (id, parent_id, child_id, app_id, app_name, package_name, day_of_week, start_time, end_time, daily_limit, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(uuidv4(), cicekParentId, nergisChildRecordId, getAppId('com.instagram.android'), 'Instagram', 'com.instagram.android', 'Her gün', '09:00', '21:00', 45, 1);
console.log('⏰ Zaman kısıtlamaları oluşturuldu.');

// ===== Usage Stats =====
const today = new Date().toISOString().split('T')[0];
const usageData = [
  { app: 'Instagram', pkg: 'com.instagram.android', minutes: 135 },
  { app: 'YouTube', pkg: 'com.google.android.youtube', minutes: 105 },
  { app: 'WhatsApp', pkg: 'com.whatsapp', minutes: 80 },
  { app: 'TikTok', pkg: 'com.tiktok.android', minutes: 50 },
  { app: 'Chrome', pkg: 'com.android.chrome', minutes: 30 },
];
for (const u of usageData) {
  db.prepare('INSERT INTO usage_stats (id, child_id, app_id, app_name, package_name, usage_minutes, usage_date) VALUES (?, ?, ?, ?, ?, ?, ?)').run(uuidv4(), childRecordId, getAppId(u.pkg), u.app, u.pkg, u.minutes, today);
}

// Nergis için kullanım istatistikleri
db.prepare('INSERT INTO usage_stats (id, child_id, app_id, app_name, package_name, usage_minutes, usage_date) VALUES (?, ?, ?, ?, ?, ?, ?)').run(uuidv4(), nergisChildRecordId, getAppId('com.instagram.android'), 'Instagram', 'com.instagram.android', 35, today);
db.prepare('INSERT INTO usage_stats (id, child_id, app_id, app_name, package_name, usage_minutes, usage_date) VALUES (?, ?, ?, ?, ?, ?, ?)').run(uuidv4(), nergisChildRecordId, getAppId('com.google.android.youtube'), 'YouTube', 'com.google.android.youtube', 50, today);
console.log('📊 Kullanım istatistikleri oluşturuldu.');

// ===== Permission Logs =====
const permissionLogs = [
  { type: 'usage_access', granted: 1 },
  { type: 'notification', granted: 1 },
  { type: 'accessibility', granted: 0 },
  { type: 'overlay', granted: 1 },
  { type: 'device_admin', granted: 0 },
  { type: 'battery_optimization', granted: 1 },
];
const now = new Date().toISOString();
for (const pl of permissionLogs) {
  db.prepare('INSERT INTO permission_logs (id, device_id, permission_type, is_granted, checked_at) VALUES (?, ?, ?, ?, ?)').run(uuidv4(), deviceId, pl.type, pl.granted, now);
}
console.log('🔐 İzin logları oluşturuldu (6 izin türü).');

// ===== Notifications =====
const notifications = [
  { userId: parentId, title: 'Yeni Eşleştirme', message: 'Çocuk cihazı başarıyla eşleştirildi.' },
  { userId: parentId, title: 'Engelleme Denemesi', message: 'TikTok uygulamasına erişim engellendi.' },
  { userId: parentId, title: 'Günlük Rapor', message: 'Günlük kullanım raporu hazır.' },
  { userId: parentId, title: 'İzin Uyarısı', message: 'Erişilebilirlik izni verilmemiş durumda.' },
  { userId: childId, title: 'Eşleştirme Tamamlandı', message: 'Ebeveyn cihazı ile eşleştirildiniz.' },
  { userId: childId, title: 'Uygulama Engellendi', message: 'TikTok uygulaması engellendi.' },
];
for (const n of notifications) {
  db.prepare('INSERT INTO notifications (id, user_id, title, message, is_read) VALUES (?, ?, ?, ?, ?)').run(uuidv4(), n.userId, n.title, n.message, 0);
}

// Çiçek için başlangıç bildirimleri
db.prepare('INSERT INTO notifications (id, user_id, title, message, is_read) VALUES (?, ?, ?, ?, ?)').run(uuidv4(), cicekParentId, 'Yeni Eşleştirme', 'Çocuk cihazı başarıyla eşleştirildi (Nergis Yıldız).', 0);
console.log('🔔 Bildirimler oluşturuldu.');

console.log('\n✅ Seed işlemi tamamlandı! (10 tablo dolduruldu)\n');
process.exit(0);
