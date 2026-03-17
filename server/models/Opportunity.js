const mongoose = require('mongoose');

const OpportunitySchema = new mongoose.Schema({
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ngoName: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  requiredSkills: [String],
  status: { type: String, default: 'open' }, // open, filled
  assignedVolunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Opportunity', OpportunitySchema);