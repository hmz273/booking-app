import mongoose from 'mongoose';

const { Schema } = mongoose;

const rentalSchema = new Schema({
  title: {
    type: String,
    required: true,
    max: [128, 'Too long, max is 128 characters'],
  },
  category: { type: String, required: true, lowercase: true },
  image: [{ type: String, required: true }],
  bedrooms: Number,
  shared: Boolean,
  description: { type: String, required: true },
  dailyRate: Number,
  createdAt: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
});

const Rental = mongoose.model('Rental', rentalSchema);

export default Rental;
