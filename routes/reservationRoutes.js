const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

router.post('/create', reservationController.createReservation);

module.exports = router;
