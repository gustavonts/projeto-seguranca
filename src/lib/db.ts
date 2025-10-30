import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

let dbInstance: Database.Database | null = null;

function ensureDirExists(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function getDb() {
  if (dbInstance) return dbInstance;

  const dbPath = process.env.DATABASE_URL || path.join(process.cwd(), "data", "app.db");
  ensureDirExists(dbPath);
  const db = new Database(dbPath, { fileMustExist: false, readonly: false });

  // Hardening pragmas suitable for most workloads
  db.pragma("journal_mode = WAL");
  db.pragma("synchronous = NORMAL");
  db.pragma("foreign_keys = ON");

  // Minimal schema with hashed passwords; do not expose passwordHash in APIs
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      passwordHash TEXT NOT NULL,
      level INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  `);

  dbInstance = db;
  return dbInstance;
}

export type DbUser = {
  id: number;
  email: string;
  level: number;
  createdAt: string;
};

export function findUsersByEmail(emailLike: string, limit: number, offset: number): DbUser[] {
  const db = getDb();
  // Parameterized query blocks SQL injection
  const stmt = db.prepare(
    `SELECT id, email, level, createdAt
     FROM users
     WHERE email LIKE ? ESCAPE '\\'
     ORDER BY id ASC
     LIMIT ? OFFSET ?`
  );
  // Escape % and _ in user input if you want literal search; keep %...% patterning controlled by code
  const sanitized = emailLike.replace(/[\\_%]/g, (m) => `\\${m}`);
  const pattern = `%${sanitized}%`;
  return stmt.all(pattern, limit, offset) as DbUser[];
}

export function findUserById(id: number): DbUser | undefined {
  const db = getDb();
  const stmt = db.prepare(`SELECT id, email, level, createdAt FROM users WHERE id = ?`);
  return stmt.get(id) as DbUser | undefined;
}

