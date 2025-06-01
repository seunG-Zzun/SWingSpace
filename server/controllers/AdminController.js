const User = require('../models/User');
const Reservation = require('../models/Reservation');
const TimeUtils = require('../utils/TimeUtils');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: '서버 오류', error: err.message });
  }
};

exports.addWarning = async (req, res) => {
  try {
    const { studentId } = req.params;
    const user = await User.findOne({ studentId });
    if (!user) return res.status(404).json({ success: false, message: '사용자 없음' });

    user.warningCount += 1;
    if (user.warningCount >= 4) user.isBanned = true;
    await user.save();

    if (user.isBanned) {
      const today = TimeUtils.getTodayDate();
      await Reservation.updateMany(
        { studentId, date: { $gte: today }, status: 'reserved' },
        { $set: { status: 'cancelled' } }
      );
    }

    res.json({ success: true, message: '경고 1회 부여 완료', data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: '서버 오류', error: err.message });
  }
};

exports.removeUser = async (req, res) => {
  try {
    const { studentId } = req.params;
    const user = await User.findOne({ studentId });

    if (!user) {
      return res.status(404).json({ success: false, message: '사용자 없음' });
    }

    if (user.warningCount < 4) {
      return res.status(400).json({ success: false, message: '경고 4회 미만 사용자입니다.' });
    }

    user.isBanned = true;
    await user.save();

    const today = TimeUtils.getTodayDate();
    await Reservation.updateMany(
      { studentId, date: { $gte: today }, status: 'reserved' },
      { $set: { status: 'cancelled' } }
    );

    return res.json({ success: true, message: '사용자가 정지되고, 이후 예약은 모두 취소되었습니다.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: '서버 오류', error: err.message });
  }
};

exports.dashboard = async (req, res) => {
  try {
    const { studentId } = req.query;
    const admin = await User.findOne({ studentId, role: 'admin' });

    if (!admin) return res.status(403).json({ success: false, message: '관리자만 접근 가능합니다.' });

    const now = TimeUtils.getNowDecimal();
    const today = TimeUtils.getTodayDate();

    const overdueReservations = await Reservation.find({
      status: 'reserved',
      returned: false,
      club: admin.club,
      date: today,
      endTime: { $lt: now - 1 / 6 },
      returnWarningGiven: false
    });

    for (const r of overdueReservations) {
      r.returnWarningGiven = true;
      await r.save();
    }

    const sameClubUsers = await User.find({ club: admin.club, role: { $ne: 'admin' } });

    const data = await Promise.all(sameClubUsers.map(async (u) => {
      const reservations = await Reservation.find({
        studentId: u.studentId,
        status: 'reserved',
        returned: false,
        date: today,
        endTime: { $lt: now - 1 / 6 },
        returnWarningGiven: true
      });

      return {
        studentId: u.studentId,
        warningCount: u.warningCount,
        isBanned: u.isBanned === true,
        unreturnedCount: reservations.length,
        unreturnedDetails: reservations.map(r => ({
          reservationId: r.reservationId,
          date: r.date,
          timeRangeStr: TimeUtils.formatFullTime(r.date, r.startTime, r.endTime)
        }))
      };
    }));

    res.json({ success: true, message: '대시보드 불러오기 성공', data });
  } catch (err) {
    res.status(500).json({ success: false, message: '서버 오류', error: err.message });
  }
};
