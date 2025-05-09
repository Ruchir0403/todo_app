const express = require('express');
const router = express.Router();
const pool = require('../db');

// Helper to build WHERE clause for search
function buildSearchClause(search) {
  if (!search) return { clause: '', params: [] };
  return {
    clause: 'WHERE title LIKE ? OR description LIKE ?',
    params: [`%${search}%`, `%${search}%`]
  };
}

// POST /todos
router.post('/', async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ success: false, message: 'Title is required' });
  try {
    const [result] = await pool.execute(
      'INSERT INTO todos (title, description) VALUES (?, ?)',
      [title, description || null]
    );
    res.status(201).json({ success: true, message: 'To-Do created successfully', data: { id: result.insertId } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// GET /todos
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM todos ORDER BY created_at DESC');
    res.json({
      success: true,
      data: rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// GET /todos/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM todos WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// PUT /todos/:id
router.put('/:id', async (req, res) => {
  const { title, description, status } = req.body;
  try {
    // check exists
    const [rows] = await pool.execute('SELECT id FROM todos WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Not found' });

    // update
    const fields = [];
    const params = [];
    if (title != null)       { fields.push('title = ?');       params.push(title); }
    if (description != null) { fields.push('description = ?'); params.push(description); }
    if (status != null)      { fields.push('status = ?');      params.push(status); }

    if (!fields.length) return res.status(400).json({ success: false, message: 'No fields to update' });

    await pool.execute(
      `UPDATE todos SET ${fields.join(', ')} WHERE id = ?`,
      [...params, req.params.id]
    );

    res.json({ success: true, message: 'To-Do updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// DELETE /todos/:id
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM todos WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'To-Do deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// BONUS: GET /todos/counts
router.get('/counts/status', async (_req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT status, COUNT(*) as count FROM todos GROUP BY status`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

module.exports = router;
