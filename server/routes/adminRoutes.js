const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');

const isAdmin = (req, res, next) => {
  const user = req.user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ success: false, message: '관리자 권한이 필요합니다.' });
  }
  next();
};

router.get('/dashboard', isAdmin, adminController.dashboard);
router.get('/users', isAdmin, adminController.getAllUsers);
router.post('/users/:studentId/warning', isAdmin, adminController.addWarning);
router.delete('/users/:studentId/remove', isAdmin, adminController.removeUser);

module.exports = router;
