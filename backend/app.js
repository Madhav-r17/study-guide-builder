const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/notes', (req, res) => {
  const { title, content } = req.body;

  const sql = 'INSERT INTO notes (title, content) VALUES (?, ?)';

  db.query(sql, [title, content], (err, result) => {
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

module.exports = app;