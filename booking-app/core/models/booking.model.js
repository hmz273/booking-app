import mongoose from 'mongoose';

const { Schema } = mongoose;

const bookingSchema = new Schema({
  checkIn: { type: Date, required: 'Check in date is required' },
  checkOut: { type: Date, required: 'Check out date is required' },
  totalPrice: Number,
  days: Number,
  guests: Number,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  rental: { type: Schema.Types.ObjectId, ref: 'Rental' },
  payment: { type: Schema.Types.ObjectId, ref: 'Payment' },
  review: { type: Schema.Types.ObjectId, ref: 'Review' },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
