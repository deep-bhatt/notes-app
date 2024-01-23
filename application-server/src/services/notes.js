const pool = require('../services/db');

async function deleteNoteById(noteId, userId) {
  const result = await pool.query('DELETE FROM notes WHERE id = $1 AND userId = $2 RETURNING *', [noteId, userId]);
  return result.rowCount > 0;
}

async function checkNoteExists(noteId, userId) {
  const note = await pool.query('SELECT id FROM notes WHERE id = $1 AND userId = $2', [noteId, userId]);
  return note.rowCount > 0;
}

async function getNoteVersions(noteId) {
  const versions = await pool.query('SELECT * FROM notes_version WHERE note_id = $1 ORDER BY timestamp DESC', [noteId]);
  return versions.rows;
}

async function createNote(userId, title, content) {
  const result = await pool.query('INSERT INTO notes(userId, title, content) VALUES($1, $2, $3) RETURNING *', [userId, title, content]);
  return result.rows[0];
}

async function updateNote(noteId, userId, title, content) {
  const result = await pool.query('UPDATE notes SET title = $1, content = $2 WHERE id = $3 AND userId = $4 RETURNING *', [title, content, noteId, userId]);
  return result.rowCount > 0 ? result.rows[0] : null;
}

async function getUserNotes(userId) {
  const result = await pool.query('SELECT * FROM notes WHERE userId = $1 ORDER BY updatedAt DESC', [userId]);
  return result.rows;
}

async function getNoteById(userId, noteId) {
  const result = await pool.query('SELECT * FROM notes WHERE userId = $1 AND id = $2', [userId, noteId]);
  return result.rows;
}

module.exports = {
  deleteNoteById,
  checkNoteExists,
  getNoteVersions,
  createNote,
  updateNote,
  getUserNotes,
  getNoteById,
}