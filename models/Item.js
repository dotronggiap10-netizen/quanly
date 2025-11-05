const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  type: { type: String, enum: ['detai','baibao','sach','huongdan','giaithuong'], required: true },
  title: { type: String, required: true },
  kind: { type: String, default: '' },
  members: { type: [String], default: [] },
  notes: { type: String, default: '' },
  extra: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
