
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});
app.get("/api/study-guide/:category", (req, res) => {
  const { category } = req.params;

  const sql =
    "SELECT * FROM notes WHERE category = ? ORDER BY created_at DESC";

  db.query(sql, [category], (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch study guide"
      });
    }

    res.json(results);
  });
});
app.get("/api/stats", (req, res) => {
  const sql = `
    SELECT category, COUNT(*) as count
    FROM notes
    GROUP BY category
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch stats"
      });
    }

    res.json(results);
  });
});
app.post('/api/notes', (req, res) => {
  const { title, content, category } = req.body;

  const sql =
    'INSERT INTO notes (title, content, category) VALUES (?, ?, ?)';

  db.query(sql, [title, content, category], (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: 'Failed to save note'
      });
    }

    res.status(201).json({
      message: 'Note saved successfully',
      id: result.insertId
    });
  });
});
app.get("/api/notes", (req, res) => {
  const sql = "SELECT * FROM notes ORDER BY created_at DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch notes"
      });
    }

    res.json(results);
  });
});
app.delete("/api/notes/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM notes WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to delete note"
      });
    }

    res.json({
      message: "Note deleted successfully"
    });
  });
});
app.put("/api/notes/:id", (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const sql =
    "UPDATE notes SET title = ?, content = ? WHERE id = ?";

  db.query(sql, [title, content, id], (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to update note"
      });
    }

    res.json({
      message: "Note updated successfully"
    });
  });
});
app.get("/api/recent-notes", (req, res) => {
  const sql =
    "SELECT * FROM notes ORDER BY created_at DESC LIMIT 5";

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch recent notes"
      });
    }

    res.json(results);
  });
});
module.exports = app;