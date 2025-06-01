const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.signUp = async (req, res) => {
  const { name, studentId, password, role, club } = req.body;

  try {
    const exists = await User.findOne({ studentId });
    if (exists) {
      return res.status(400).json({ success: false, message: '이미 존재하는 아이디입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, studentId, password: hashedPassword, role, club });
    await newUser.save();

    const { password: _, ...safeUser } = newUser.toObject();
    res.json({ success: true, message: `회원가입 완료: ${studentId}`, data: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, message: '서버 오류', error: err.message });
  }
};

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

exports.login = async (req, res) => {
  const { studentId, password } = req.body;
  try {
    const user = await User.findOne({ studentId });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: '로그인 실패. 학번 또는 비밀번호 확인.' });
    }

    if (user.isBanned()) {
      return res.status(403).json({ success: false, message: '이 사용자는 정지되었습니다.' });
    }

    const token = jwt.sign(
      { studentId: user.studentId, role: user.role },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    const { password: _, ...safeUser } = user.toObject();
    res.json({ success: true, message: '로그인 성공!', token, data: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, message: '서버 오류', error: err.message });
  }
};

exports.getMyInfo = async (req, res) => {
  try {
    const { password, ...safeUser } = req.user.toObject();
    res.json({ success: true, message: '사용자 정보 조회 성공', data: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, message: '서버 오류', error: err.message });
  }
};




