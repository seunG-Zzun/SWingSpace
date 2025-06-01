const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');
router.get('/dashboard', adminController.dashboard);


const isAdmin = (req, res, next) => {
  const { role } = req.body;
  if (role !== 'admin') {
    return res.status(403).json({ success: false, message: '관리자 권한이 필요합니다.' });
  }
  next();
};

router.get('/dashboard', isAdmin, adminController.dashboard);
router.get('/users', isAdmin, adminController.getAllUsers);
router.post('/users/:userId/warning', isAdmin, adminController.addWarning);
router.delete('/users/:userId/remove', isAdmin, adminController.removeUser);

module.exports = router;
