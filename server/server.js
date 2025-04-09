const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ⛓️ Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://ay4875007:KcMgklZvcf74nHQf@cluster0.brlyxxc.mongodb.net/gabe_db?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB Atlas 🚀"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// 🎯 Schema & Model
const hunterSchema = new mongoose.Schema({
  name: String,
  score: Number,
  timeTaken: Number,
  createdAt: { type: Date, default: Date.now }
});

// Use the 'scores' collection instead of the default 'hunters'
const Hunter = mongoose.model('Hunter', hunterSchema, 'scores');

// 📝 Save Score API
app.post('/api/save-score', async (req, res) => {
  const { name, score, timeTaken } = req.body;
  try {
    // Find existing score for this player
    const existingScore = await Hunter.findOne({ name: name });
    
    if (existingScore) {
      // Update the score if the new score is higher
      if (score > existingScore.score) {
        existingScore.score = score;
        existingScore.timeTaken = timeTaken;
        await existingScore.save();
      }
    } else {
      // Create new score if player doesn't exist
      const newScore = new Hunter({ name, score, timeTaken });
      await newScore.save();
    }
    
    res.status(201).json({ message: 'Score saved!' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving score' });
  }
});

// 🏆 Top 10 Scores API
app.get('/api/scoreboard', async (req, res) => {
  try {
    const topPlayers = await Hunter.find()
      .sort({ score: -1, timeTaken: 1 })
      .limit(10);
    res.json(topPlayers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch scoreboard' });
  }
});

app.listen(3000, () => {
  console.log('🔥 Server running on http://localhost:3000');
});
