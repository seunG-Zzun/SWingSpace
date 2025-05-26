const Space = require('../models/Space');
const Reservation = require('../models/Reservation');
const { createResponse } = require('../utils/response');

const spaces = [
  new Space(1),
  new Space(2),
  new Space(3),
  new Space(4)
];
exports.getAllReservations = () => {
  return createResponse(true, '전체 예약 목록', reservations);
};

exports.getReservationsByDate = (date) => {
  const filtered = reservations
    .filter(r => r.date === date && r.status === 'reserved')
    .sort((a, b) => a.startTime - b.startTime);

  return createResponse(true, `${date} 예약 목록`, filtered);
};

exports.getReservationsByStudent = (studentId) => {
  const filtered = reservations
    .filter(r => r.studentId === studentId && r.status === 'reserved')
    .sort((a, b) => {
      if (a.date === b.date) return a.startTime - b.startTime;
      return a.date.localeCompare(b.date);
    });

  return createResponse(true, `${studentId}의 예약 목록`, filtered);
};

const reservations = [];
exports.createReservation = (studentId, spaceId, startTime, endTime, club, seatIndex, date) => {
  const id = `${studentId}_${Date.now()}`;

  const currentReservations = reservations.filter(r =>
    r.spaceId === spaceId &&
    r.status === 'reserved' &&
    r.date===date&&
    r.startTime < endTime &&
    r.endTime > startTime
  );

  const seatTaken = currentReservations.some(r => r.seatIndex === seatIndex);
  if (seatTaken) {
    return createResponse(false, `${seatIndex}번 좌석은 이미 예약되었습니다.`);
  }

  const hasOtherClub = currentReservations.some(r => r.club !== club);
  if (hasOtherClub) {
    return createResponse(false, '다른 동아리원이 이미 예약한 테이블입니다.');
  }

  if (currentReservations.length >= 6) {
    return createResponse(false, '예약 인원이 가득 찼습니다 (최대 6명).');
  }

  const res = new Reservation(id, studentId, spaceId, startTime, endTime, club, seatIndex);
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
    r.date === reservation.date &&
    r.startTime < reservation.endTime + 1.0 &&
    r.endTime > reservation.endTime
  );

  if (!reservation.canBeExtended(now, isAvailable)) {
    return createResponse(false, '연장 조건이 충족되지 않습니다.');
  }

  reservation.extend();
  return createResponse(true, '예약이 1시간 연장되었습니다.', reservation);
};
