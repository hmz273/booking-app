import express from 'express';
import {
  getHotelById,
  createHotel,
  removeHotelById,
  updateHotelById,
  getAllHotels,
} from '@controllers/hotel.controller';
import { upload } from '@middlewares/upload.middleware';
import isAuth from '@middlewares/auth.middleware';
import { isAdminOrOwner } from '@middlewares/roles.middleware';

const hotelRouter = express.Router();

hotelRouter.get('/:id', getHotelById);
hotelRouter.get('/', getAllHotels);
hotelRouter.post(
  '/',
  [isAuth, isAdminOrOwner, upload.array('images', 4)],
  createHotel
);
hotelRouter.delete('/:id', [isAuth, isAdminOrOwner], removeHotelById);
hotelRouter.put('/:id', [isAuth, isAdminOrOwner], updateHotelById);

export default hotelRouter;
