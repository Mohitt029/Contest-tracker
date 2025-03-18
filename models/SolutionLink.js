const mongoose = require('mongoose');
const solutionSchema = new mongoose.Schema({
  contestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contest', required: true },
  youtubeLink: { type: String, required: true },
});
module.exports = mongoose.model('SolutionLink', solutionSchema);