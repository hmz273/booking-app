import Booking from '@models/booking.model';
import Rooms from '@models/rental.model';
import { isValidBooking } from '@utils/booking';
import moment from 'moment';
import { formatDate } from '@utils/date';
import { BOOKING_STATES, MODELS } from '@shared/constants';

export const cancelReservation = async (req, res) => {
  const { id: bookingId } = req.params;
  try {
    const booking = await Booking.findById(bookingId).select('rental');
    await Booking.findByIdAndUpdate(bookingId, {
      status: BOOKING_STATES.CANCELLED,
    });

    await Rooms.findByIdAndUpdate(
      { _id: booking.rental },
      { $pull: { bookings: bookingId } }
    );

    return res.status(200).json({
      error: false,
      message: 'Reservation cancelled successfully',
      data: booking.rental,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
      data: null,
    });
  }
};

export const createReservation = async (req, res) => {
  const { checkIn, checkOut, roomId, userId, guests, price } = req.body;
  const days = moment(checkOut).diff(moment(checkIn), 'days');
  const checkInDate = formatDate(checkIn);
  const checkOutDate = formatDate(checkOut);
  try {
    await Rooms.findById(roomId)
      .populate('bookings')
      .populate('user')
      .exec(async (err, foundRental) => {
        if (err) {
          return res.status(401).json({
            error: true,
            message: err.message,
            data: null,
          });
        }

        if (!isValidBooking({ checkInDate, checkOutDate }, foundRental)) {
          return res.status(422).json({
            error: true,
            message: 'Booking not available, please choose another date',
            data: null,
          });
        }
        const booking = await Booking.create({
          checkIn: checkInDate,
          checkOut: checkOutDate,
          rental: roomId,
          user: userId,
          totalPrice: price * days,
          days,
          guests,
        });

        booking.rental = foundRental;
        foundRental.bookings.push(booking);
        booking.save((_err) => {
          if (_err) {
            return res.status(401).json({
              error: true,
              message: _err.message,
              data: null,
            });
          }
          foundRental.save();
          return res.status(200).json({
            error: false,
            message: 'Reservation created successfully',
            data: {
              checkIn: booking.checkIn,
              checkOut: booking.checkOut,
            },
          });
        });
      });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
      data: null,
    });
  }
};

export const getReservationById = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        error: true,
        message: `Cannot find booking with this id ${id}`,
        data: null,
      });
    }
    res.status(200).json({
      error: false,
      message: null,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
      data: null,
    });
  }
};

export const deleteReservationById = async (req, res) => res.status(200);

export const updateReservationById = async (req, res) =>
  res.status(200).json({
    error: false,
    message: 'Reservation updated successfully',
    data: null,
  });

export const getAllReservations = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json({
      error: false,
      message: null,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
      data: null,
    });
  }
};

export const getReservationsById = async (req, res) => {
  const { id } = req.params;
  const { type } = req.query;

  if (type !== MODELS.USER && type !== MODELS.RENTAL) {
    return res.status(400).json({
      error: true,
      message: 'Please provide a valid type. [user or rental]',
      data: null,
    });
  }

  try {
    const reservations = await Booking.find({
      [type]: id,
    });
    if (reservations.length === 0) {
      return res.status(404).json({
        error: true,
        message: `Cannot find reservations with this ${type} id: ${id}`,
        data: null,
      });
    }

    res.status(200).json({
      error: false,
      message: null,
      data: reservations,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
      data: null,
    });
  }
};
