import { getDb, saveDb } from './client.js';

export function initializeSchema(): void {
  const db = getDb();

  // Create vaults table
  db.run(`
    CREATE TABLE IF NOT EXISTS vaults (
      id TEXT PRIMARY KEY,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      last_backup_at DATETIME
    )
  `);

  // Create backups table
  db.run(`
    CREATE TABLE IF NOT EXISTS backups (
      id TEXT PRIMARY KEY,
      vault_id TEXT NOT NULL,
      blob BLOB NOT NULL,
      size_bytes INTEGER NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      device_id TEXT,
      FOREIGN KEY (vault_id) REFERENCES vaults(id)
    )
  `);

  // Create indexes
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_backups_vault_id ON backups(vault_id)
  `);

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_backups_created_at ON backups(created_at)
  `);

  saveDb();
  console.log('✓ Database schema initialized');
}

// Vault operations
export function createVault(id: string): void {
  const db = getDb();
  db.run(
    `INSERT OR IGNORE INTO vaults (id, created_at) VALUES (?, datetime('now'))`,
    [id]
  );
  saveDb();
}

export function updateVaultLastBackup(id: string): void {
  const db = getDb();
  db.run(
    `UPDATE vaults SET last_backup_at = datetime('now') WHERE id = ?`,
    [id]
  );
  saveDb();
}

export function getVault(id: string): { id: string; created_at: string; last_backup_at: string | null } | undefined {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM vaults WHERE id = ?');
  stmt.bind([id]);
  if (stmt.step()) {
    const row = stmt.getAsObject() as { id: string; created_at: string; last_backup_at: string | null };
    stmt.free();
    return row;
  }
  stmt.free();
  return undefined;
}

// Backup operations
export interface BackupRecord {
  id: string;
  vault_id: string;
  blob: Uint8Array;
  size_bytes: number;
  created_at: string;
  device_id: string | null;
}

export function createBackup(
  id: string,
  vaultId: string,
  blob: Buffer,
  deviceId?: string
): BackupRecord {
  const db = getDb();

  // Ensure vault exists
  createVault(vaultId);

  // Insert backup
  db.run(
    `INSERT INTO backups (id, vault_id, blob, size_bytes, device_id, created_at)
     VALUES (?, ?, ?, ?, ?, datetime('now'))`,
    [id, vaultId, blob, blob.length, deviceId || null]
  );

  // Update vault last_backup_at
  updateVaultLastBackup(vaultId);

  saveDb();

  // Return the created backup
  return getBackupById(id)!;
}

export function getBackupById(id: string): BackupRecord | undefined {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM backups WHERE id = ?');
  stmt.bind([id]);
  if (stmt.step()) {
    const row = stmt.getAsObject({ blob: true }) as BackupRecord;
    stmt.free();
    return row;
  }
  stmt.free();
  return undefined;
}

export function getLatestBackup(vaultId: string): BackupRecord | undefined {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT * FROM backups
    WHERE vault_id = ?
    ORDER BY created_at DESC
    LIMIT 1
  `);
  stmt.bind([vaultId]);
  if (stmt.step()) {
    const row = stmt.getAsObject({ blob: true }) as BackupRecord;
    stmt.free();
    return row;
  }
  stmt.free();
  return undefined;
}

export interface BackupMetadata {
  id: string;
  created_at: string;
  size_bytes: number;
  device_id: string | null;
}

export function listBackups(
  vaultId: string,
  limit = 10,
  offset = 0
): { backups: BackupMetadata[]; total: number } {
  const db = getDb();

  // Get total count
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM backups WHERE vault_id = ?');
  countStmt.bind([vaultId]);
  countStmt.step();
  const { count } = countStmt.getAsObject() as { count: number };
  countStmt.free();

  // Get backups
  const stmt = db.prepare(`
    SELECT id, created_at, size_bytes, device_id
    FROM backups
    WHERE vault_id = ?
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `);
  stmt.bind([vaultId, limit, offset]);

  const backups: BackupMetadata[] = [];
  while (stmt.step()) {
    backups.push(stmt.getAsObject() as BackupMetadata);
  }
  stmt.free();

  return { backups, total: count };
}
