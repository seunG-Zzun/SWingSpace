const Reservation = require('../models/Reservation');
const { createResponse } = require('../utils/response');

const reservations = [];

exports.createReservation = (studentId, spaceId, startTime, endTime) => {
  const id = `${studentId}_${Date.now()}`;
  const res = new Reservation(id,studentId, spaceId, startTime, endTime);
  reservations.push(res);
  return createResponse(true, '예약 성공', res);
};
