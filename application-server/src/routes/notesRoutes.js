const express = require('express');
const router = express.Router();
const verifyJwt = require('../middleware/jwt');
const {
  deleteNoteById,
  checkNoteExists,
  getNoteVersions,
  createNote,
  updateNote,
  getUserNotes,
  getNoteById,
} = require('../services/notes');

router.get('/notes', verifyJwt, async (req, res) => {
  try {
    const userId = req.user.userId;
    const notes = await getUserNotes(userId);
    res.json({ data: notes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/notes/:id', verifyJwt, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const note = await getNoteById(userId, id);

    if (note.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({ data: note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/notes', verifyJwt, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, content } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Missing fields title'});
    }

    if (!content) {
      return res.status(400).json({ error: 'Missing fields content'});
    }

    const newNote = await createNote(userId, title, content);
    res.json({ data: newNote });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/notes/:id', verifyJwt, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Missing fields title'});
    }

    if (!content) {
      return res.status(400).json({ error: 'Missing fields content'});
    }

    const updatedNote = await updateNote(id, userId, title, content);
    if (!updatedNote) {
      return res.status(404).json({ error: 'Invalid note' });
    }

    res.json({ data: updatedNote });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/notes/:id', verifyJwt, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const deleted = await deleteNoteById(id, userId);

    if (!deleted) {
      return res.status(400).json({ error: 'Invalid note' });
    }

    res.json({ data: 'Note deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/version/notes/:id', verifyJwt, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id: noteId } = req.params;
    const noteExists = await checkNoteExists(noteId, userId);

    if (!noteExists) {
      return res.status(400).json({ error: 'Invalid note' });
    }

    const versions = await getNoteVersions(noteId);
    res.status(200).json({ data: versions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
