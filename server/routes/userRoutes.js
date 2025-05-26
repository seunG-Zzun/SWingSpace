const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/signup', userController.signUp);
router.post('/login', userController.login);


router.get('/reservations', userController.getReservations); //tmp
module.exports = router;
