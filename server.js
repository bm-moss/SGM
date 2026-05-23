/**
 * EduManage Pro — Express Backend
 * Persistent JSON file storage, serves all static files
 */
const express = require('express');
const fs      = require('fs');
const path    = require('path');
const crypto  = require('crypto');

const app  = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR  = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');
const BACKUP_FILE = path.join(DATA_DIR, 'db.backup.json');

// ── Ensure data directory ──────────────────────────────────────
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({}));

// ── DB helpers ─────────────────────────────────────────────────
function readDB() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch { return {}; }
}

function writeDB(data) {
  // Atomic write: write to temp then rename
  const tmp = DATA_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, DATA_FILE);
}

function backupDB() {
  try { fs.copyFileSync(DATA_FILE, BACKUP_FILE); } catch {}
}

// Auto-backup every 10 minutes
setInterval(backupDB, 10 * 60 * 1000);

// ── Middleware ─────────────────────────────────────────────────
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS for local dev
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Serve static files
app.use(express.static(__dirname));

// ── API Routes ─────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString(), storage: 'server' });
});

// Get ALL data (for initial sync)
app.get('/api/data', (req, res) => {
  res.json(readDB());
});

// Get single key
app.get('/api/data/:key', (req, res) => {
  const db = readDB();
  const val = db[req.params.key];
  res.json(val !== undefined ? val : null);
});

// Set single key
app.post('/api/data/:key', (req, res) => {
  try {
    const db = readDB();
    db[req.params.key] = req.body.value;
    writeDB(db);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Set multiple keys at once (bulk update)
app.post('/api/data', (req, res) => {
  try {
    const db = readDB();
    const updates = req.body; // { key: value, ... }
    Object.assign(db, updates);
    writeDB(db);
    res.json({ ok: true, updated: Object.keys(updates).length });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Delete single key
app.delete('/api/data/:key', (req, res) => {
  try {
    const db = readDB();
    delete db[req.params.key];
    writeDB(db);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Restore from backup
app.post('/api/restore', (req, res) => {
  try {
    if (!fs.existsSync(BACKUP_FILE)) return res.status(404).json({ ok: false, error: 'No backup found' });
    fs.copyFileSync(BACKUP_FILE, DATA_FILE);
    res.json({ ok: true, message: 'Restored from backup' });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Export full DB as JSON download
app.get('/api/export', (req, res) => {
  const db = readDB();
  res.setHeader('Content-Disposition', `attachment; filename="edumanage-backup-${Date.now()}.json"`);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(db, null, 2));
});

// Import DB from JSON upload
app.post('/api/import', (req, res) => {
  try {
    const data = req.body;
    if (typeof data !== 'object') return res.status(400).json({ ok: false, error: 'Invalid data' });
    backupDB(); // backup before import
    writeDB(data);
    res.json({ ok: true, message: 'Data imported successfully' });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// ── SPA fallback ───────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ── Start ──────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🏫 EduManage Pro`);
  console.log(`   Running at: http://localhost:${PORT}`);
  console.log(`   Data file:  ${DATA_FILE}\n`);
});
