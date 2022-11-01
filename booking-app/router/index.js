import express from 'express';
import auth from '@routes/auth.routes';
import hotel from '@routes/hotel.routes';
import rooms from '@routes/rooms.routes';
import reservation from '@routes/reservation.routes';

const routes = express.Router();

routes.get('/', (req, res) => {
  res.status(200).json({
    message: 'Main app routes endpoint',
  });
});

routes.use('/auth', auth);
routes.use('/hotel', hotel);
routes.use('/rooms', rooms);
routes.use('/reservation', reservation);

export default routes;
