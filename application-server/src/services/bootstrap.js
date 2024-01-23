const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
})

const setupTables = async () => {
  const client = await pool.connect();

  const uuidExt = 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";';
  const usersTable = `CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    hash TEXT NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT now()
  );`

  const notesTable = `CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userId UUID NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT now(),
    FOREIGN KEY (userId) REFERENCES users(id));`;

  const notesTriggerFunc = `CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updatedAt = now(); -- Set updatedAt to the current timestamp
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;`;

  const notesTrigger = `CREATE OR REPLACE TRIGGER set_notes_updated_at
    BEFORE UPDATE ON notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();`;

  const versionTable = `CREATE TABLE IF NOT EXISTS notes_version (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    note_id UUID NOT NULL,
    colName TEXT NOT NULL,
    oldVal TEXT,
    newVal TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
  );`;
  const versionControlFunc = `CREATE OR REPLACE FUNCTION log_note_update()
    RETURNS TRIGGER AS $$
    BEGIN
        IF OLD.title IS DISTINCT FROM NEW.title THEN
            INSERT INTO notes_version (note_id, colName, oldVal, newVal)
            VALUES (NEW.id, 'title', OLD.title, NEW.title);
        END IF;

        IF OLD.content IS DISTINCT FROM NEW.content THEN
            INSERT INTO notes_version (note_id, colName, oldVal, newVal)
            VALUES (NEW.id, 'content', OLD.content, NEW.content);
        END IF;

        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;`;
  const versionControlTrigger = `CREATE OR REPLACE TRIGGER notes_version_trigger
    AFTER UPDATE OF title, content
    ON notes
    FOR EACH ROW
    EXECUTE FUNCTION log_note_update();`;

  const notesUserIdIndex = `CREATE INDEX IF NOT EXISTS idx_notes_userid ON notes(userId);`;
  const usersUsernameIndex = `CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`;
  const notesVersionIndex = `CREATE INDEX IF NOT EXISTS idx_notes_version_noteid ON notes_version(note_id)`;

  try {
    await client.query(uuidExt);
    await client.query(usersTable);
    await client.query(notesTable);
    await client.query(versionTable);
    await client.query(versionControlFunc);
    await client.query(versionControlTrigger);
    await client.query(notesUserIdIndex);
    await client.query(usersUsernameIndex);
    await client.query(notesVersionIndex);
    await client.query(notesTriggerFunc);
    await client.query(notesTrigger);
  } catch(err) {
    console.log('error in bootstrapping the database');
    console.log(err);
  }
}

module.exports = {
  setupTables,
}
