const users = [];
const User = require('../models/User');

exports.signUp = (req, res) => {
  const {name, studentId, password, role } = req.body;

  const exists = users.find(user => user.studentId === studentId);
  if (exists) {
    return res.status(400).json({ success: false, message: '이미 존재하는 아이디입니다.' });
  }

  const newUser = new User(name, studentId, password, role);
  users.push(newUser);
  res.json({ success: true, message: `회원가입 완료: ${studentId}`, data: newUser });
};

exports.login = (req, res) => {
  const { studentId, password } = req.body;


  const user = users.find(user => user.studentId=== studentId && user.password === password);
  if (user) {
    return res.json({ success: true, message: '로그인 성공!' });
  } else {
    return res.status(401).json({ success: false, message: '로그인 실패. 학번 또는 비밀번호 확인.' });
  }

  if (user.isBanned && user.isBanned()) {
    return res.status(403).json({ success: false, message: '이 사용자는 정지되었습니다.' });
  }

  return res.json({ success: true, message: '로그인 성공!' });
};

exports.users = users;
