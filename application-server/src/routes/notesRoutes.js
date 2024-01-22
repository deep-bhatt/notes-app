const express = require('express');
const router = express.Router();
const pool = require('../services/db');
const verifyJwt = require('../middleware/jwt');

router.get('/notes', verifyJwt, async (req, res) => {
  try {
    const userId = req.user.userId;
    const notes = await pool.query('SELECT * FROM notes WHERE userId = $1', [userId]);
    res.json({data: notes.rows});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/notes/:id', verifyJwt, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const notes = await pool.query('SELECT * FROM notes WHERE userId = $1 AND id = $2', [userId, id]);
    res.json({data: notes.rows});
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
      res.status(400).json({ error: 'missing fields title' });
    } else if (!content) {
      res.status(400).json({ error: 'missing fields content' });
    } else {
      const newNote = await pool.query('INSERT INTO notes(userId, title, content) VALUES($1, $2, $3) RETURNING *', [userId, title, content]);
      res.json({data: newNote.rows[0]});
    }
  } catch(error) {
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
      res.status(400).json({ error: 'missing fields title' });
    } else if (!content) {
      res.status(400).json({ error: 'missing fields content' });
    } else {
      const updatedNote = await pool.query(
        'UPDATE notes SET title = $1, content = $2 WHERE id = $3 AND userId = $4 RETURNING *',
        [title, content, id, userId]
      );
      res.json({data: updatedNote.rows[0]});
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/notes/:id', verifyJwt, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    await pool.query('DELETE FROM notes WHERE id = $1 AND userId = $2', [id, userId]);
    res.json({ data: 'Note deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
