import Hotel from '@models/hotel.model';
import { hotelSchema } from '@utils/validators';

export const createHotel = async (req, res) => {
  const result = hotelSchema.validate(req.body);
  const { title, city, street } = result.value;
  try {
    if (!req.files) {
      return res.status(400),send({
        error: true,
        message: 'Please upload at least one image',
      });
    }

    if (result.error) {
      console.log(result.error.message);
      return res.status(400).json({
        error: true,
        message: result.error.message,
      });
    }

    const isHotelExists = await Hotel.findOne({
      title,
    });

    if (isHotelExists) {
      return res.status(400).json({
        error: true,
        message: 'Hotel name already exists',
      });
    }

    const images = req.files.map(
      (image) => `${req.protocol}://${req.host}/${image.path}`
    );

    const hotel = new Hotel({ title, city, street, image: images });
    await hotel.save((err, data) => {
      if (err) {
        return res.status(500).json({
          error: true,
          message: 'Error creating hotel',
          err,
        });
      }
      return res.status(201).json({
        error: false,
        message: 'Hotel created successfully',
        data,
      });
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const removeHotelById = async (req, res) => {
  const { id } = req.params;
  try {
    const hotel = await Hotel.findByIdAndDelete(id);
    if (!hotel) {
      return res.status(404).json({
        error: true,
        message: 'Hotel not found',
        data: null,
      });
    }
    res.status(200).json({
      error: false,
      message: 'Hotel deleted successfully',
      hotel,
    });
  } catch (error) {
    res.status(500).json({
      error: false,
      message: error.message,
      data: null,
    });
  }
};

export const getHotelById = async (req, res) => {
  const { id } = req.params;
  try {
    const hotel = await Hotel.findById(id);
    if (!hotel) {
      return res.status(404).json({
        error: true,
        message: `Cannot find hotel with this id ${id}`,
        data: null,
      });
    }
    res.status(200).json({
      error: false,
      message: null,
      data: hotel,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
      data: null,
    });
  }
};

export const updateHotelById = async (req, res) => {
  const { id } = req.params;
  try {
    const hotel = await Hotel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        ...req.body,
      },
      { new: true }
    );
    if (!hotel) {
      return res.status(404).json({
        error: true,
        message: 'error to update the hotel',
      });
    }
    res.status(200).json({
      error: false,
      message: 'Hotel has been updated successfully',
      data: hotel,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
      data: null,
    });
  }
};

export const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    if (!hotels) {
      return res.status(404).json({
        error: true,
        message: 'Hotels not found',
        data: null,
      });
    }
    res.status(200).json({
      error: false,
      message: 'Hotels retrieved successfully',
      data: hotels,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
      data: null,
    });
  }
};
