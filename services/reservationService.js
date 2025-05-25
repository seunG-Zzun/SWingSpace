const Reservation = require('../models/Reservation');
const { createResponse } = require('../utils/response');

const reservations = [];

exports.createReservation = (studentId, spaceId, startTime, endTime) => {
  const id = `${studentId}_${Date.now()}`;
  const res = new Reservation(id, studentId, spaceId, startTime, endTime);
  reservations.push(res);
  return createResponse(true, '예약 성공', res);
};

exports.cancelReservation = (reservationId) => {
  const reservation = reservations.find(r => r.reservationId === reservationId);
  if (!reservation) return createResponse(false, '예약을 찾을 수 없습니다.');
  if (reservation.status !== 'reserved') return createResponse(false, '이미 처리된 예약입니다.');

  reservation.cancel();
  return createResponse(true, '예약이 취소되었습니다.', reservation);
};

exports.extendReservation = (reservationId, now) => {
  const reservation = reservations.find(r => r.reservationId === reservationId);
  if (!reservation) return createResponse(false, '예약을 찾을 수 없습니다.');

  const isAvailable = !reservations.some(r =>
    r.spaceId === reservation.spaceId &&
    r.reservationId !== reservationId &&
    r.status === 'reserved' &&
    r.startTime < reservation.endTime + 1.0 &&
    r.endTime > reservation.endTime
  );

  if (!reservation.canBeExtended(now, isAvailable)) {
    return createResponse(false, '연장 조건이 충족되지 않습니다.');
  }

  reservation.extend();
  return createResponse(true, '예약이 1시간 연장되었습니다.', reservation);
};
