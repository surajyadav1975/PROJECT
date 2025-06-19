const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prob',
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: "cpp",
  },
  verdict: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Submission", submissionSchema);
