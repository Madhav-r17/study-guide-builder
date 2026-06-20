const router = require('express').Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.get('/dashboard', (req, res) => {
  res.json({
    notes: 12,
    flashcards: 24,
    quizzes: 8,
    averageScore: 82
  });
});

router.post('/notes', (req, res) => {
  res.json({
    success: true,
    message: 'Note received'
  });
});

module.exports = router;