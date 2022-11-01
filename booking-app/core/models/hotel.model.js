import mongoose from 'mongoose';

const { Schema } = mongoose;

const hotelSchema = new Schema({
  title: {
    type: String,
    required: true,
    max: [128, 'Too long, max is 128 characters'],
  },
  city: { type: String, required: true },
  street: {
    type: String,
    required: true,
    min: [4, 'Too short, min is 4 characters'],
  },
  image: [{ type: String, required: true }],
  stars: { type: Number, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
  deleteAt: { type: Date, default: null },
  rental: [{ type: Schema.Types.ObjectId, ref: 'Rental' }],
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;
