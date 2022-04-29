const mongoose = require('mongoose');

const devGoals = new mongoose.Schema(
  {
    empId: {
      type: String,
      required: true,
      unique: true
    },
    goals: {
      type: [String]
    }
  },
  {
    timestamps: true
  }
);

module.exports = DevGoals = mongoose.model('devGoals', devGoals);
