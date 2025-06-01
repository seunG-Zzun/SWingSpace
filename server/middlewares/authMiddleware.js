// ✅ authMiddleware.js - JWT 인증 미들웨어
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: '인증 토큰이 필요합니다.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('[DEBUG] decoded.studentId:', decoded.studentId);//debugging
    const user = await User.findOne({ studentId: decoded.studentId });
    console.log('[DEBUG] DB 조회 결과:', user);
    if (!user) {
      return res.status(403).json({ success: false, message: '유효하지 않은 사용자입니다.' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: '토큰 검증 실패', error: err.message });
  }
};

module.exports = authMiddleware;



