const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  roleName: {
    type: string,
    required:true
  },
  description: {
    type: string
  },
}, {
  timestamps: true
});

module.exports = Roles = mongoose.model('Roles', RoleSchema);
