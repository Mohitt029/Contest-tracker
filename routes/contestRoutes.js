const express = require('express');
const router = express.Router();
const Contest = require('../models/Contest');
const SolutionLink = require('../models/SolutionLink');

router.get('/contests', async (req, res) => {
  try {
    const { platforms } = req.query; // e.g., "Codeforces,LeetCode"
    const filter = platforms ? { platform: { $in: platforms.split(',') } } : {};
    const contests = await Contest.find(filter); // Removed .populate()
    res.json(contests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Other routes remain the same
router.put('/contests/:id/bookmark', async (req, res) => {
  try {
    const contest = await Contest.findByIdAndUpdate(
      req.params.id,
      { bookmarked: req.body.bookmarked },
      { new: true }
    );
    if (!contest) return res.status(404).json({ error: 'Contest not found' });
    res.json(contest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/solutions', async (req, res) => {
  try {
    const { contestId, youtubeLink } = req.body;
    const solution = new SolutionLink({ contestId, youtubeLink });
    await solution.save();
    res.json(solution);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;