const mongoose = require('mongoose');

const spaceSchema = new mongoose.Schema({
  spaceNumber: { type: Number, required: true, unique: true },
  capacity: { type: Number, default: 6 }
});

module.exports = mongoose.model('Space', spaceSchema);
