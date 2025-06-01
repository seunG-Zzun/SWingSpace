const reservationSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  spaceId: { type: Number, required: true },
  startTime: { type: Number, required: true },
  endTime: { type: Number, required: true },
  club: { type: String, required: true },
  seatIndex: { type: Number, required: true },
  date: { type: String, required: true },

  isExtended: { type: Boolean, default: false },
  returnedAt: { type: Date, default: null },

  status: {
    type: String,
    enum: ['reserved', 'cancelled', 'returned'],
    default: 'reserved'
  },
  returnWarningGiven: { type: Boolean, default: false }
});
