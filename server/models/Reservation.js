const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  reservationId: { type: String, required: true, unique: true },
  studentId: { type: String, required: true },
  spaceId: { type: Number, required: true },
  startTime: { type: Number, required: true },
  endTime: { type: Number, required: true },
  club: { type: String, required: true },
  seatIndex: { type: Number, required: true },
  date: { type: String, required: true }, 

  isExtended: { type: Boolean, default: false },
  returned: { type: Boolean, default: false },
  returnedAt: { type: Number, default: null },

  status: {
    type: String,
    enum: ['reserved', 'cancelled', 'returned'],
    default: 'reserved'
  },
  returnWarningGiven: { type: Boolean, default: false }
});

reservationSchema.methods.extend = function () {
  if (!this.isExtended) {
    this.endTime += 1.0; // 1시간 연장
    this.isExtended = true;
  }
};

reservationSchema.methods.cancel = function () {
  this.status = 'cancelled';
};

reservationSchema.methods.returnReservation = function (nowDecimal) {
  this.status = 'returned';
  this.returned = true;
  this.returnedAt = nowDecimal;
};

reservationSchema.methods.canBeExtended = function (nowDecimal, isAvailable) {
  return (
    nowDecimal >= this.endTime - 0.5 &&
    !this.isExtended &&
    isAvailable &&
    this.status === 'reserved'
  );
};

module.exports = mongoose.model('Reservation', reservationSchema);
