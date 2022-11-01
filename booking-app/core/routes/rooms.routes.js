import express from 'express';
import {
  getRoomById,
  getAllRooms,
  updateRoomById,
  createRoom,
  removeRoomById,
  sortRooms,
  filterRooms,
} from '@controllers/rooms.controller';
import { upload } from '@middlewares/upload.middleware';

const roomsRouter = express.Router();

roomsRouter.get('/filter', filterRooms);
roomsRouter.get('/sort', sortRooms);
roomsRouter.get('/:id', getRoomById);
roomsRouter.get('/', getAllRooms);
roomsRouter.put('/:id', updateRoomById);
roomsRouter.post('/', upload.array('images', 4), createRoom);
roomsRouter.delete('/:id', removeRoomById);

export default roomsRouter;
