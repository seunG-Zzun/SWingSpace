const users = [];
const User = require('../models/User');
const reservations = []; //tmp
exports.signUp = (req, res) => {
  console.log(req.body);
  const { name, studentId, password, role, club } = req.body;


  const exists = users.find(user => user.studentId === studentId);
  if (exists) {
    return res.status(400).json({ success: false, message: '이미 존재하는 아이디입니다.' });
  }

  const newUser = new User(name, studentId, password, role, club);
  users.push(newUser);
  res.json({ success: true, message: `회원가입 완료: 환영합니다. ${name}, ${studentId}`, data: newUser });
};

exports.login = (req, res) => {
  const { studentId, password } = req.body;

  const user = users.find(user => user.studentId === studentId && user.password === password);

  if (!user) {
    return res.status(401).json({ success: false, message: '로그인 실패. 학번 또는 비밀번호 확인.' });
  }

  if (user.isBanned && user.isBanned()) {
    return res.status(403).json({ success: false, message: '이 사용자는 정지되었습니다.' });
  }

  return res.json({ success: true, message: '로그인 성공!, 예약페이지로 이동합니다.',user:user });
};


exports.getReservations = (req, res) => { //tmp
  const { studentId } = req.query;
  const userReservations = reservations.filter(r => r.studentId === studentId);
  res.json(userReservations);
};

exports.users = users;
