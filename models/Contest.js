const mongoose = require('mongoose');
const contestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  platform: { type: String, enum: ['Codeforces', 'CodeChef', 'LeetCode'], required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  duration: { type: Number, required: true }, // in seconds
  bookmarked: { type: Boolean, default: false },
});
module.exports = mongoose.model('Contest', contestSchema);