const users = require('./userController').users;

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
  res.json({ message: '관리자 대시보드 접근 성공' });
};
