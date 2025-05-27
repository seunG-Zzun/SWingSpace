const Space = require('../models/Space');
const Reservation = require('../models/Reservation');
const { createResponse } = require('../utils/response');
const TimeUtils = require('../utils/TimeUtils');

const spaces = [
  new Space(1),
  new Space(2),
  new Space(3),
  new Space(4)
];

const reservations = [];

exports.createReservation = (studentId, spaceId, startTime, endTime, club, seatIndex, date) => {
  const reservationId = `${studentId}_${Date.now()}`;
  const nowDecimal = TimeUtils.getNowDecimal();
  const today = new Date().toISOString().slice(0, 10);

  if (date === today && startTime < nowDecimal) {
    return createResponse(false, '현재 시간보다 이전으로는 예약할 수 없습니다.');
  }

  const currentReservations = reservations.filter(r =>
    r.spaceId === spaceId &&
    r.status === 'reserved' &&
    r.startTime < endTime &&
    r.endTime > startTime
  );

  const duplicateByUser = reservations.some(r =>
    r.studentId === studentId &&
    r.date === date &&
    r.status === 'reserved' &&
    r.startTime < endTime &&
    r.endTime > startTime
  );
  if (duplicateByUser) {
    return createResponse(false, '이미 같은 날짜에 겹치는 시간의 예약이 존재합니다.');
  }

  const seatTaken = currentReservations.some(r =>
    r.date === date && r.seatIndex === seatIndex
  );
  if (seatTaken) {
    return createResponse(false, `${seatIndex + 1}번 좌석은 이미 예약되었습니다.`);
  }

  const hasOtherClub = currentReservations.some(r => r.club !== club);
  if (hasOtherClub) {
    return createResponse(false, '다른 동아리원이 이미 예약한 테이블입니다.');
  }

  if (currentReservations.length >= 6) {
    return createResponse(false, '예약 인원이 가득 찼습니다 (최대 6명).');
  }

  const res = new Reservation(reservationId, studentId, spaceId, startTime, endTime, club, seatIndex, date);
  res.isExtended = false; 
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

exports.extendReservation = (reservationId, nowDecimal) => {
  const reservation = reservations.find(r => r.reservationId === reservationId);
  if (!reservation) return createResponse(false, '예약을 찾을 수 없습니다.');
  if (reservation.status !== 'reserved') return createResponse(false, '유효하지 않은 예약입니다.');
  if (reservation.isExtended) return createResponse(false, '이미 한 번 연장된 예약입니다.');

  const newEndTime = reservation.endTime + 1.0;
  const timeDiff = reservation.endTime - nowDecimal;
  const withinExtendWindow = timeDiff <= 0.5 && timeDiff >= 0;

  const isAvailable = !reservations.some(r =>
    r.spaceId === reservation.spaceId &&
    r.reservationId !== reservationId &&
    r.status === 'reserved' &&
    r.startTime < newEndTime &&
    r.endTime > reservation.endTime &&
    (r.seatIndex === reservation.seatIndex || r.club !== reservation.club)
  );

  if (!withinExtendWindow) {
    return createResponse(false, '예약 종료 30분 전부터만 연장할 수 있습니다.');
  }

  if (!isAvailable) {
    return createResponse(false, '해당 시간대에 이미 예약이 있어 연장할 수 없습니다.');
  }

  reservation.endTime = newEndTime;
  reservation.isExtended = true;

  return createResponse(true, '예약이 1시간 연장되었습니다.', reservation);
};

exports.getReservationsByStudent = (studentId, includeCancelled = false) => {
  const myReservations = reservations.filter(
    r => r.studentId === studentId &&
    (includeCancelled || r.status === 'reserved')
  );
  return createResponse(true, '예약 목록 조회 성공', myReservations);
};

exports.getReservationsByDate = (date) => {
  const matched = reservations.filter(r => r.date === date);
  return createResponse(true, '예약 정보 조회 성공', matched);
};

exports.getAllReservations = () => {
  return createResponse(true, '전체 예약 목록 조회 성공', reservations);
};
