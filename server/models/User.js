const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  studentId: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // 해시 저장
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  club: { type: String, required: function () { return this.role !== 'admin'; } },
  warningCount: { type: Number, default: 0 },
  isBanned: { type: Boolean, default: false }
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

userSchema.methods.addWarning = async function () {
  this.warningCount++;
  if (this.warningCount >= 4) {
    this.isBanned = true;
  }
  await this.save();
};

userSchema.methods.checkIfBanned = function () {
  return this.warningCount >= 4;
};


const User = mongoose.model('User', userSchema);
module.exports = User;
