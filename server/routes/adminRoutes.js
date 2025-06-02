const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');
const authMiddleware = require('../middlewares/authMiddleware');

const isAdmin = (req, res, next) => {
  const user = req.user;

  if (!user || user.role !== 'admin') {
    return res.status(403).json({ success: false, message: '관리자 권한이 필요합니다.' });
  }
  next();
};
//인증증
router.use(authMiddleware);

//관리자 권한 확인
router.use(isAdmin);

//모든 라우트: 인증 + 관리자만 통과
router.get('/dashboard', adminController.dashboard);
router.get('/users', adminController.getAllUsers);
router.post('/users/:studentId/warning', adminController.addWarning);
router.delete('/users/:studentId/remove', adminController.removeUser);

router.post('/users/:studentId/cancelWarning', adminController.cancelWarning); //tmp
module.exports = router;