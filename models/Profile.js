const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  faculty: { type: String, default: '' },
  department: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
