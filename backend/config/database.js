const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// DB yolunu .env'den oku, yoksa varsayılanı kullan
const dbPath = path.resolve(__dirname, '..', process.env.DB_PATH || './data/kilit.sqlite');
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const db = new Database(dbPath);

// WAL mode — daha iyi performans
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Tabloları oluştur (10 tablo)
db.exec(`
  -- 1. users
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('parent', 'child')),
    name TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- 2. children
  CREATE TABLE IF NOT EXISTS children (
    id TEXT PRIMARY KEY,
    parent_id TEXT NOT NULL,
    child_user_id TEXT NOT NULL,
    name TEXT,
    age INTEGER,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (child_user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  -- 3. devices
  CREATE TABLE IF NOT EXISTS devices (
    id TEXT PRIMARY KEY,
    child_id TEXT NOT NULL,
    device_name TEXT,
    platform TEXT,
    device_identifier TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
  );

  -- 4. app_catalog (Takip edilen mobil uygulamalar kataloğu)
  CREATE TABLE IF NOT EXISTS app_catalog (
    id TEXT PRIMARY KEY,
    app_name TEXT NOT NULL,
    package_name TEXT UNIQUE NOT NULL,
    category TEXT,
    icon_url TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- 5. block_rules (app_catalog ile ilişkili)
  CREATE TABLE IF NOT EXISTS block_rules (
    id TEXT PRIMARY KEY,
    parent_id TEXT NOT NULL,
    child_id TEXT NOT NULL,
    app_id TEXT,
    app_name TEXT NOT NULL,
    package_name TEXT NOT NULL,
    is_blocked INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
    FOREIGN KEY (app_id) REFERENCES app_catalog(id) ON DELETE SET NULL
  );

  -- 6. time_restrictions (app_catalog ile ilişkili)
  CREATE TABLE IF NOT EXISTS time_restrictions (
    id TEXT PRIMARY KEY,
    parent_id TEXT NOT NULL,
    child_id TEXT NOT NULL,
    app_id TEXT,
    app_name TEXT NOT NULL,
    package_name TEXT NOT NULL,
    day_of_week TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    daily_limit INTEGER DEFAULT 60,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
    FOREIGN KEY (app_id) REFERENCES app_catalog(id) ON DELETE SET NULL
  );

  -- 7. usage_stats (app_catalog ile ilişkili)
  CREATE TABLE IF NOT EXISTS usage_stats (
    id TEXT PRIMARY KEY,
    child_id TEXT NOT NULL,
    app_id TEXT,
    app_name TEXT NOT NULL,
    package_name TEXT NOT NULL,
    usage_minutes INTEGER NOT NULL,
    usage_date TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
    FOREIGN KEY (app_id) REFERENCES app_catalog(id) ON DELETE SET NULL
  );

  -- 8. pairing_codes
  CREATE TABLE IF NOT EXISTS pairing_codes (
    id TEXT PRIMARY KEY,
    parent_id TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    used INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE
  );

  -- 9. notifications
  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  -- 10. permission_logs (devices ile ilişkili)
  CREATE TABLE IF NOT EXISTS permission_logs (
    id TEXT PRIMARY KEY,
    device_id TEXT NOT NULL,
    permission_type TEXT NOT NULL CHECK(permission_type IN ('usage_access', 'notification', 'accessibility', 'overlay', 'device_admin', 'battery_optimization')),
    is_granted INTEGER DEFAULT 0,
    checked_at TEXT DEFAULT (datetime('now')),
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
  );

  -- 11. child_apps (Çocuğun cihazında yüklü olan uygulamalar)
  CREATE TABLE IF NOT EXISTS child_apps (
    id TEXT PRIMARY KEY,
    child_id TEXT NOT NULL,
    app_name TEXT NOT NULL,
    package_name TEXT NOT NULL,
    icon_url TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
    UNIQUE(child_id, package_name)
  );
`);

module.exports = db;
