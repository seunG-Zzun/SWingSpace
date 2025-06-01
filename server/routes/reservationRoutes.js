const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const authMiddleware = require('../middlewares/authMiddleware'); 


router.use(authMiddleware);
router.post('/', reservationController.createReservation);
router.get('/all', reservationController.getAllReservations);
router.get('/date', reservationController.getReservationsByDate);
router.get('/my', reservationController.getReservationsByStudent);
router.delete('/cancel/:reservationId', reservationController.cancelReservation);
router.put('/extend/:reservationId', reservationController.extendReservation);
router.put('/return/:reservationId', reservationController.returnReservation);

module.exports = router;

