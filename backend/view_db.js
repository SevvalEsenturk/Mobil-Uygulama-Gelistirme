const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'data', 'kilit.sqlite');
console.log(`📂 SQLite Veritabanı Yolu: ${dbPath}`);

const db = new Database(dbPath);

const tables = [
  'users',
  'children',
  'devices',
  'app_catalog',
  'block_rules',
  'time_restrictions',
  'usage_stats',
  'pairing_codes',
  'notifications',
  'permission_logs',
  'child_apps'
];

console.log('\n======================================================');
console.log('📊           KİLİT VERİTABANI GÖRÜNTÜLEYİCİ          📊');
console.log('======================================================\n');

tables.forEach(table => {
  try {
    const rows = db.prepare(`SELECT * FROM ${table}`).all();
    console.log(`\n------------------------------------------------------`);
    console.log(`📋 TABLO: ${table.toUpperCase()} (${rows.length} kayıt)`);
    console.log(`------------------------------------------------------`);
    if (rows.length > 0) {
      console.table(rows);
    } else {
      console.log('   (Kayıt bulunamadı)');
    }
  } catch (error) {
    console.log(`❌ ${table} tablosu okunurken hata:`, error.message);
  }
});

console.log('\n======================================================\n');
db.close();
