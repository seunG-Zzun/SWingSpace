const reservationService = require('../services/reservationService');
const TimeUtils = require('../utils/TimeUtils');

exports.createReservation = (req, res) => {
  const { studentId, spaceId, startTime, endTime, club } = req.body;

  if (!studentId || !spaceId || !startTime || !endTime || !club) {
    return res.status(400).json({ success: false, message: '모든 필드를 입력해주세요.' });
  }

  const result = reservationService.createReservation(studentId, spaceId, startTime, endTime, club);

  if (!result.success) {
    return res.status(400).json(result);
  }

  const readableData = {
    ...result.data,
    startTimeStr: TimeUtils.toTimeString(result.data.startTime),
    endTimeStr: TimeUtils.toTimeString(result.data.endTime)
  };

  res.status(200).json({
    success: result.success,
    message: result.message,
    data: readableData
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
