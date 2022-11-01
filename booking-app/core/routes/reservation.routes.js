import express from 'express';
import {
  createReservation,
  getReservationById,
  deleteReservationById,
  updateReservationById,
  getAllReservations,
  cancelReservation,
  getReservationsById,
} from '@controllers/reservation.controller';

const reservationRouter = express.Router();

reservationRouter.post('/', createReservation);
reservationRouter.get('/', getAllReservations);
reservationRouter.get('/entity/:id', getReservationsById);
reservationRouter.get('/:id', getReservationById);
reservationRouter.put('/:id', updateReservationById);
reservationRouter.delete('/:id', deleteReservationById);
reservationRouter.patch('/:id/cancel', cancelReservation);

export default reservationRouter;
