const mongoose = require('mongoose');

const CalendarSchema = new mongoose.Schema({
  empId: {
    type: String,
    required: true,
    unique: true
  },
  startDate: {
    type: Date,
    required:true
  },
  endDate: {
    type: Date,
    required:true
  },
  email: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String
  },
  taskId:{
      type: String,
      required: true
  },
  timestamps: true
});

module.exports = Calendar = mongoose.model('calendar', CalendarSchema);
