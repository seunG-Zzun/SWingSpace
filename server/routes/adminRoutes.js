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

router.use(authMiddleware);
router.use(isAdmin);

router.get('/dashboard', adminController.dashboard);
router.get('/users', adminController.getAllUsers);
router.post('/users/:studentId/warning', adminController.addWarning);
router.delete('/users/:studentId/remove', adminController.removeUser);

module.exports = router;
