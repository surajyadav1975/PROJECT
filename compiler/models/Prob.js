const mongoose = require('mongoose');

const TestCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  visible: { type: Boolean, default: false }
});

const ProblemSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  tag: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  description: { type: String, required: true },
  testcases: [TestCaseSchema]
});

module.exports = mongoose.model('Prob', ProblemSchema);
