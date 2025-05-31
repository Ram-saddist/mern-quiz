const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

const data = JSON.parse(fs.readFileSync('./data/questions.json', 'utf-8'));

// Helper function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
  const shuffled = [...array]; // Clone the array to avoid modifying the original
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get all topics
app.get('/api/topics', (req, res) => {
  res.json(Object.keys(data));
});

// Get questions by topic (shuffled)
app.get('/api/questions/:topic', (req, res) => {
  const topic = req.params.topic.toLowerCase();
  if (data[topic]) {
    const shuffledQuestions = shuffleArray(data[topic]);
    res.json(shuffledQuestions);
  } else {
    res.status(404).json({ error: 'Topic not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Quiz API server running on http://localhost:${PORT}`);
});