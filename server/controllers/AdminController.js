const users = require('./userController').users;
const TimeUtils = require('../utils/TimeUtils');
const reservationService = require('../services/reservationService');


exports.getAllUsers = (req, res) => {
  res.json({ success: true, data: users });
};

exports.addWarning = (req, res) => {
  const { studentId } = req.params;
  const user = users.find(u => u.studentId === studentId);

  if (!user) {
    return res.status(404).json({ success: false, message: '사용자 없음' });
  }

  user.addWarning();

  if (user.isBanned()) {
    console.log("이 사용자는 정지되었습니다.");
  }

  return res.json({ success: true, message: '경고 부여 완료', data: user });
};



exports.removeUser = (req, res) => {
  const { studentId } = req.params;
  const user = users.find(u => u.studentId === studentId);

  if (!user || !user.isBanned) {
    return res.status(400).json({ success: false, message: '탈퇴 대상 아님 또는 사용자 없음' });
  }

  user.name = '';
  user.studentId = '';
  user.password = '';
  user.role = '';

  return res.json({ success: true, message: '사용자 탈퇴 완료', data: user });
};

exports.dashboard = (req, res) => {
  const { studentId } = req.query;
  const admin = users.find(u => u.studentId === studentId && u.role === 'admin');

  if (!admin) {
    return res.status(403).json({ success: false, message: '관리자만 접근 가능합니다.' });
  }

  const now = TimeUtils.getNowDecimal();
  const overdue = reservationService.getOverdueReservationsByClub(admin.club, now);

  overdue.forEach(r => {
    const user = users.find(u => u.studentId === r.studentId);
    if (user && !user.returnWarningGiven) {
      user.addWarning();
      r.returnWarningGiven = true;

      if (user.warningCount >= 4) {
        user.name = '';
        user.studentId = '';
        user.password = '';
        user.role = '';
        user.club = '';
      }
    }
  });

  const sameClubUsers = users.filter(u => u.club === admin.club && u.role !== 'admin');
  res.json({
    success: true,
    message: '대시보드 불러오기 성공',
    data: sameClubUsers.map(u => {
      const userReservations = reservationService.getUserReservations(u.studentId);
      const unreturned = userReservations.filter(r =>
        r.status === 'reserved' &&
        !r.returned &&
        now > r.endTime + 1 / 6
      );
  
      return {
        studentId: u.studentId,
        warningCount: u.warningCount,
        isBanned: u.warningCount >= 4,
        unreturnedCount: unreturned.length,
        unreturnedDetails: unreturned.map(r => ({
          reservationId: r.reservationId,
          date: r.date,
          timeRangeStr: TimeUtils.formatFullTime(r.date, r.startTime, r.endTime)
        }))
      };
    })
  });

  
}