const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

router.post('/create', reservationController.createReservation);
router.post('/cancel', reservationController.cancelReservation);
router.post('/extend', reservationController.extendReservation);
router.get('/list', reservationController.getAllReservations);
router.get('/by-date', reservationController.getReservationsByDate);
router.get('/my', reservationController.getReservationsByStudent);
router.post('/return', reservationController.returnReservation);
router.get('/by-date', reservationController.getReservationsByDate);
module.exports = router;
