const reservationService = require('../services/reservationService');
const TimeUtils = require('../utils/TimeUtils');

const formatReservation = (r) => ({
  ...r.toObject(),
  timeRangeStr: TimeUtils.formatFullTime(r.date, r.startTime, r.endTime),
  startTimeStr: TimeUtils.toTimeString(r.startTime),
  endTimeStr: TimeUtils.toTimeString(r.endTime)
});

exports.getAllReservations = async (req, res) => {
  try {
    const result = await reservationService.getAllReservations();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: '서버 오류', error: err.message });
  }
};


exports.createReservation = async (req, res) => {
  const { spaceId, startTime, endTime, club, seatIndex, date } = req.body;
  const studentId = req.user.studentId; 

  if (!studentId || !spaceId || !startTime || !endTime || !club || seatIndex === undefined || !date) {
    return res.status(400).json({ success: false, message: '모든 필드를 입력해주세요.' });
  }

  try {
    const result = await reservationService.createReservation(studentId, spaceId, startTime, endTime, club, seatIndex, date);
    if (!result.success) return res.status(400).json(result);

    const readableData = formatReservation(result.data);
    res.status(200).json({ success: true, message: result.message, data: readableData });
  } catch (err) {
    res.status(500).json({ success: false, message: '서버 오류', error: err.message });
  }
};

exports.getReservationsByDate = async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ success: false, message: '날짜를 입력해주세요.' });
  }

  try {
    const result = await reservationService.getReservationsByDate(date);
    const readableList = result.data.map(formatReservation);
    res.status(200).json({ success: true, message: result.message, data: readableList });
  } catch (err) {
    res.status(500).json({ success: false, message: '서버 오류', error: err.message });
  }
};

exports.getReservationsByStudent = async (req, res) => {
  const studentId = req.user.studentId;
  const includeCancelled = req.query.includeCancelled === 'true';

  try {
    const result = await reservationService.getReservationsByStudent(studentId, includeCancelled);
    if (!result.success) return res.status(500).json({ success: false, message: '예약 조회 실패' });

    const readable = result.data.map(formatReservation);
    return res.status(200).json({ success: true, message: result.message, data: readable });
  } catch (err) {
    res.status(500).json({ success: false, message: '서버 오류', error: err.message });
  }
};

exports.cancelReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const result = await reservationService.cancelReservation(reservationId);
    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: '서버 오류', error: err.message });
  }
};

exports.extendReservation = async (req, res) => {
  try {
    const { reservationId } = req.body;
    const now = TimeUtils.getNowDecimal();
    const result = await reservationService.extendReservation(reservationId, now);
    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: '서버 오류', error: err.message });
  }
};

exports.returnReservation = async (req, res) => {
  try {
    const { reservationId } = req.body;
    const result = await reservationService.returnReservation(reservationId);
    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: '서버 오류', error: err.message });
  }
};
