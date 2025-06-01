const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');


router.post('/signup', userController.signUp);
router.post('/login', userController.login);
router.get('/me', authMiddleware, userController.getMyInfo);

module.exports = router;
