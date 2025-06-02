const Reservation = require('../models/Reservation');
const { createResponse } = require('../utils/response');
const TimeUtils = require('../utils/TimeUtils');

exports.createReservation = async (studentId, spaceId, startTime, endTime, club, seatIndex, date) => {
  const reservationId = `${studentId}_${Date.now()}`;
  const nowDecimal = TimeUtils.getNowDecimal();
  const today = TimeUtils.getTodayDate();

  if (date === today && startTime < Math.floor(nowDecimal)) {
    return createResponse(false, '현재 시간보다 이전으로는 예약할 수 없습니다.');
  }

  const currentReservations = await Reservation.find({
    spaceId,
    status: 'reserved',
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
    date
  });

  const duplicateByUser = await Reservation.exists({
    studentId,
    date,
    status: 'reserved',
    startTime: { $lt: endTime },
    endTime: { $gt: startTime }
  });
  if (duplicateByUser) {
    return createResponse(false, '이미 같은 날짜에 겹치는 시간의 예약이 존재합니다.');
  }

  const seatTaken = currentReservations.some(r => r.seatIndex === seatIndex);
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

  const res = new Reservation({
    reservationId,
    studentId,
    spaceId,
    startTime,
    endTime,
    club,
    seatIndex,
    date
  });
  await res.save();

  return createResponse(true, '예약 성공', res);
};

exports.cancelReservation = async (reservationId) => {
  const reservation = await Reservation.findOne({ reservationId });
  if (!reservation) return createResponse(false, '예약을 찾을 수 없습니다.');
  if (reservation.status !== 'reserved') return createResponse(false, '이미 처리된 예약입니다.');

  const now = TimeUtils.getNowDecimal();
  const today = TimeUtils.getTodayDate();

  // ✅ 디버깅용 로그
  console.log('[예약취소 검사]', {
    today,
    now,
    reservationDate: reservation.date,
    startTime: reservation.startTime,
    startTimeType: typeof reservation.startTime,
    conditionDateMatch: reservation.date === today,
    conditionTimePassed: now >= reservation.startTime
  });

  if (reservation.date === today && now >= reservation.startTime) {
    console.log('❌ 취소 금지: 이미 시작된 예약입니다.');
    return createResponse(false, '이미 시작된 예약은 취소할 수 없습니다.');
  }

  reservation.cancel();
  await reservation.save();

  console.log('✅ 예약 취소 완료');
  return createResponse(true, '예약이 취소되었습니다.', reservation);
};


exports.extendReservation = async (reservationId, nowDecimal) => {
  const reservation = await Reservation.findOne({ reservationId });
  if (!reservation) return createResponse(false, '예약을 찾을 수 없습니다.');
  if (reservation.status !== 'reserved') return createResponse(false, '유효하지 않은 예약입니다.');
  if (reservation.isExtended) return createResponse(false, '이미 한 번 연장되었거나, 예약이 종료되었습니다.');

  const today = TimeUtils.getTodayDate();
  if (reservation.date !== today) {
    return createResponse(false, '오늘 날짜의 예약만 연장할 수 있습니다.');
  }

  const withinExtendWindow = nowDecimal >= reservation.endTime - 0.5 && nowDecimal <= reservation.endTime;
  if (!withinExtendWindow) {
    return createResponse(false, '예약 종료 30분 전부터만 연장할 수 있습니다.');
  }

  const newEndTime = reservation.endTime + 1.0;

  const conflict = await Reservation.exists({
    spaceId: reservation.spaceId,
    reservationId: { $ne: reservationId },
    status: 'reserved',
    date: reservation.date,
    startTime: { $lt: newEndTime },
    endTime: { $gt: reservation.endTime },
    $or: [
      { seatIndex: reservation.seatIndex },
      { club: { $ne: reservation.club } }
    ]
  });

  if (conflict) {
    return createResponse(false, '해당 시간대에 이미 예약이 있어 연장할 수 없습니다.');
  }

  reservation.extend();
  await reservation.save();
  return createResponse(true, '예약이 1시간 연장되었습니다.', reservation);
};


exports.returnReservation = async (reservationId) => {
  const reservation = await Reservation.findOne({ reservationId });
  if (!reservation) return createResponse(false, '예약을 찾을 수 없습니다.');
  if (reservation.status !== 'reserved') return createResponse(false, '이미 처리된 예약입니다.');

  const now = TimeUtils.getNowDecimal();
  const today = TimeUtils.getTodayDate();

  if (
    (reservation.date === today && now < reservation.startTime) ||
    (reservation.date > today) // 미래 날짜면 무조건 아직 시작 전
  ) {
    return createResponse(false, '예약 시작 시간 이전에는 반납할 수 없습니다.');
  }

  reservation.returnReservation(now);
  await reservation.save();
  return createResponse(true, '반납 완료', reservation);
};


exports.getOverdueReservationsByClub = async (adminClub, now) => {
  const today = TimeUtils.getTodayDate();
  return await Reservation.find({
    status: 'reserved',
    returned: false,
    date: today,
    club: adminClub,
    endTime: { $lt: now - 1 / 6 }
  });
};

exports.getReservationsByStudent = async (studentId, includeCancelled = false) => {
  const query = { studentId };
  if (!includeCancelled) {
    query.status = 'reserved';
  }
  const reservations = await Reservation.find(query);
  return createResponse(true, '예약 목록 조회 성공', reservations);
};

exports.getReservationsByDate = async (date) => {
  const matched = await Reservation.find({ date });
  return createResponse(true, '예약 정보 조회 성공', matched);
};

exports.getAllReservations = async () => {
  const all = await Reservation.find();
  return createResponse(true, '전체 예약 목록 조회 성공', all);
};
