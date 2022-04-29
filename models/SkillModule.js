const mongoose = require('mongoose');

const SkillModuleSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: true,
      unique: true
    },
    child: {
      type: [String]
    },
    beginnerModule: {
      type: [String]
    },
    beginnerTime: {
      type: [String]
    },
    moderateModule: {
      type: [String]
    },
    moderateTime: {
      type: [String]
    },
    advancedModule: {
      type: [String]
    },
    advancedTime: {
      type: [String]
    }
  },
  {
    timestamps: true
  }
);

module.exports = SkillModule = mongoose.model('skillModule', SkillModuleSchema);
