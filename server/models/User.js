const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  studentId: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  club: { type: String, required: function () { return this.role !== 'admin'; } },
  warningCount: { type: Number, default: 0 },
  isWithdrawn: { type: Boolean, default: false }
});


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); 
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});


userSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};


userSchema.methods.addWarning = function () {
  this.warningCount++;
};


userSchema.methods.isBanned = function () {
  return this.warningCount >= 4;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
