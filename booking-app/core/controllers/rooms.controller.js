import Rooms from '@models/rental.model';
import { roomsSchema } from '@utils/validators';

export const getRoomById = async (req, res) => {
  const { id } = req.params;
  try {
    const room = await Rooms.findById(id);
    if (!room) {
      return res.status(404).json({
        error: true,
        message: `Cannot find room with this id ${id}`,
        data: null,
      });
    }
    res.status(200).json({
      error: false,
      message: null,
      data: room,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
      data: null,
    });
  }
};

export const updateRoomById = async (req, res) => {
  const { id } = req.params;
  try {
    const room = await Rooms.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        ...req.body,
      },
      { new: true }
    );
    if (!room) {
      return res.status(404).json({
        error: true,
        message: 'error to update the Room',
      });
    }
    res.status(200).json({
      error: false,
      message: 'Room has been updated successfully',
      data: room,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
      data: null,
    });
  }
};

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Rooms.find();
    res.status(200).json({
      error: false,
      message: null,
      data: rooms,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
      data: null,
    });
  }
};

export const createRoom = async (req, res) => {
  const result = roomsSchema.validate(req.body);
  const { title, category, bedrooms, shared, description, dailyRate } =
    result.value;
  try {
    if (!req.files) {
      return res.status(400).send({
        error: true,
        message: 'Please upload at least one image',
      });
    }

    if (result.error) {
      return res.status(400).json({
        error: true,
        message: result.error.message,
      });
    }

    const images = req.files.map(
      (image) => `${req.protocol}://${req.host}/${image.path}`
    );

    const room = new Rooms({
      title,
      category,
      bedrooms,
      shared,
      description,
      dailyRate,
      image: images,
    });
    await room.save();
    res.status(201).json({
      error: false,
      message: 'Room created successfully',
      data: room,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Error creating room',
      data: null,
    });
  }
};

export const removeRoomById = async (req, res) => {
  const { id } = req.params;
  try {
    const room = await Rooms.findByIdAndDelete(id);
    if (!room) {
      return res.status(404).json({
        error: true,
        message: 'Room not found',
        data: null,
      });
    }
    res.status(200).json({
      error: false,
      message: 'Room deleted successfully',
      room,
    });
  } catch (error) {
    res.status(500).json({
      error: false,
      message: error.message,
      data: null,
    });
  }
};

export const sortRooms = async (req, res) => {
  const { sort } = req.query;
  try {
    const rooms = await Rooms.find().sort({ [sort]: 1 });
    res.status(200).json({
      error: false,
      message: null,
      data: rooms,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
      data: null,
    });
  }
};

export const filterRooms = async (req, res) => {
  const { min, max, category, shared, bedrooms } = req.query;
  try {
    const rooms = await Rooms.find({
      $or: [
        {
          dailyRate: { $gte: min, $lte: max },
        },
        {
          category,
        },
        {
          shared,
        },
        {
          bedrooms,
        },
      ],
    });
    res.status(200).json({
      error: false,
      message: null,
      data: rooms,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: 'error.message',
      data: null,
    });
  }
};
