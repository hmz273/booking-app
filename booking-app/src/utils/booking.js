import moment from 'moment';

/**
1. First, we checks to see if the room has any bookings. If it does,
    we loops through each booking and checks to see if the check-in date is before
    the check-out date of the current booking. If it is, we returns false.
2. If the check-in date is after the check-out date of the last booking, we returns true.
3. If the check-in date is between the check-in and check-out dates of a booking, we returns false.
4. If none of the bookings are valid, we returns true.
 */
export const isValidBooking = ({ checkInDate, checkOutDate }, room) => {
  if (room.bookings && room.bookings.length > 0) {
    return room.bookings.every(
      (booking) =>
        moment(checkInDate) > moment(booking.checkOut) ||
        moment(checkOutDate) < moment(booking.checkIn)
    );
  }
  return true;
};
