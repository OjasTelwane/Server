const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const Flags = new Schema(
  {
    empId: {
      type: String,
      required: true,
      unique: true
    },
    profileFlag: {
      type: Boolean
    },
    empReviewReportFlag: {
      type: Boolean
    },
    actionPlanFlag: {
      type: Boolean
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Flags', Flags);
