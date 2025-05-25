const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

router.post('/create', reservationController.createReservation);
router.post('/cancel', reservationController.cancelReservation);
router.post('/extend', reservationController.extendReservation);


module.exports = router;
