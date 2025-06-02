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
    await user.save();

    if (user.warningCount >= 4) {
      console.log("이 사용자는 정지되었습니다.");
    }

    res.json({ success: true, message: '경고 부여 완료', data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: '서버 오류', error: err.message });
  }
};
exports.cancelWarning = async (req, res) => { //tmp
  try {
    const { studentId } = req.params;
    const user = await User.findOne({ studentId });
    if (!user) return res.status(404).json({ success: false, message: '사용자 없음' });
    
    
    if (user.warningCount <= 0) {
      return res.status(400).json({ success: false, message: '경고 취소 불가: 경고 횟수가 0회입니다.' });
    }
    else {
      user.warningCount -= 1;
      await user.save();
      res.json({ success: true, message: '경고 취소 완료', data: user });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: '서버 오류', error: err.message });
  }
};
exports.removeUser = async (req, res) => {
  try {
    const { studentId } = req.params;
    const user = await User.findOne({ studentId });
    if (!user) return res.status(404).json({ success: false, message: '사용자 없음' });
    if (user.warningCount < 4) return res.status(400).json({ success: false, message: '경고 4회 미만 사용자입니다.' });

    await Reservation.deleteMany({ studentId });
    await User.deleteOne({ studentId });

    res.json({ success: true, message: '사용자 탈퇴 완료 및 예약 삭제 완료' });
  } catch (err) {
    res.status(500).json({ success: false, message: '서버 오류', error: err.message });
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
      endTime: { $lt: now - 1 / 6 }
    });
    for (const r of overdueReservations) {
      if (!r.returnWarningGiven) {
        const user = await User.findOne({ studentId: r.studentId });
        if (user) {
          user.warningCount += 1;
          await user.save();
      
        }
        r.returnWarningGiven = true;
        await r.save();
      }
    }

    
    const sameClubUsers = await User.find({ club: admin.club, role: { $ne: 'admin' } });

    const data = await Promise.all(sameClubUsers.map(async (u) => {
      const reservations = await Reservation.find({
        studentId: u.studentId,
        status: 'reserved',
        returned: false,
        date: today,
        endTime: { $lt: now - 1 / 6 }
      });

      return {
        studentId: u.studentId,
        warningCount: u.warningCount,
        isBanned: u.warningCount >= 4,
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
