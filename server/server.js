const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ⛓️ Connect to MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ay4875007:KcMgklZvcf74nHQf@cluster0.brlyxxc.mongodb.net/gabe_db?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
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
    console.error("Error saving score:", error);
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
    console.error("Error fetching scoreboard:", error);
    res.status(500).json({ error: 'Failed to fetch scoreboard' });
  }
});

// Use the PORT environment variable provided by Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
