import { initDb, closeDb, DB_PATH } from './client.js';
import { initializeSchema } from './schema.js';

async function main() {
  console.log(`Initializing database at: ${DB_PATH}`);
  await initDb();
  initializeSchema();
  closeDb();
  console.log('Done!');
}

main().catch(console.error);
