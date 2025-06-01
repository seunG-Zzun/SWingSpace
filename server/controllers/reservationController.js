const reservationService = require('../services/reservationService');
const TimeUtils = require('../utils/TimeUtils');

exports.getAllReservations = (req, res) => {
  const result = reservationService.getAllReservations();
  res.json(result);
};


exports.createReservation = (req, res) => {
  const { studentId, spaceId, startTime, endTime, club, seatIndex, date } = req.body;

  console.log('[DEBUG] 예약 요청 데이터:', req.body);

  if (!studentId || !spaceId || !startTime || !endTime || !club || seatIndex === undefined || !date) {
    return res.status(400).json({ success: false, message: '모든 필드를 입력해주세요.' });
  }
  
  const result = reservationService.createReservation(
    studentId,spaceId,startTime,endTime,club,seatIndex,date
  );
  
  console.log('[DEBUG] 예약 서비스 결과:', result); 

  if (!result.success) {
    return res.status(400).json(result);
  }
  const readableData = {
    ...result.data,
    startTimeStr: TimeUtils.toTimeString(result.data.startTime),
    endTimeStr: TimeUtils.toTimeString(result.data.endTime),
    dateStr: result.data.date,
    timeRangeStr: TimeUtils.formatFullTime(result.data.date, result.data.startTime, result.data.endTime)
  };
  

  res.status(200).json({
    success: result.success,
    message: result.message,
    data: readableData
  });
};
exports.getReservationsByDate = (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ success: false, message: '날짜를 입력해주세요.' });
  }

  const result = reservationService.getReservationsByDate(date);

  const readableList = result.data.map(r => ({
    ...r,
    timeRangeStr: TimeUtils.formatFullTime(r.date, r.startTime, r.endTime),
    startTimeStr: TimeUtils.toTimeString(r.startTime),
    endTimeStr: TimeUtils.toTimeString(r.endTime)
  }));

   res.status(200).json({
    success: result.success,
    message: result.message,
    data: readableList
  });
};
exports.getReservationsByStudent = (req, res) => {
  const { studentId, includeCancelled } = req.query;
  console.log('[DEBUG] 요청된 studentId:', studentId);

  const result = reservationService.getReservationsByStudent(studentId, includeCancelled === 'true');
  console.log('[DEBUG] 서비스 결과:', result);

  if (!result || !result.success) {
    return res.status(500).json({ success: false, message: '예약 조회 실패' });
  }

  const readable = result.data.map(r => ({
    ...r,
    timeRangeStr: TimeUtils.formatFullTime(r.date, r.startTime, r.endTime),
    startTimeStr: TimeUtils.toTimeString(r.startTime),
    endTimeStr: TimeUtils.toTimeString(r.endTime)
  }));

  return res.status(200).json({
    success: true,
    message: result.message,
    data: readable
  });
};




exports.cancelReservation = (req, res) => {
  const { reservationId } = req.body;
  const result = reservationService.cancelReservation(reservationId);
  res.status(result.success ? 200 : 400).json(result);
};

exports.extendReservation = (req, res) => {
  const { reservationId } = req.body;

  const now = TimeUtils.getNowDecimal();

  const result = reservationService.extendReservation(reservationId, now);
  res.status(result.success ? 200 : 400).json(result);
};

exports.returnReservation = (req, res) => {
  const {reservationId} = req.body;
  const result = reservationService.returnReseravtion(reservationId);
  res.status(result.success ? 200 : 400).json(result);
}
