import { ALLOWED_RATINGS } from '@shared/constants/index';

import mongoose from 'mongoose';

const { Schema } = mongoose;

const reviewSchema = new Schema({
  rating: Number,
  comment: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  rental: { type: Schema.Types.ObjectId, ref: 'Rental' },
  createdAt: { type: Date, default: Date.now },
});

reviewSchema.pre('save', (next) => {
  if (ALLOWED_RATINGS.indexOf(this.rating) >= 0) {
    return next();
  }
  const err = new Error({ rating: 'Invalid Rating' });
  err.errors = {};
  err.errors.rating = { message: 'Invalid Rating' };
  return next(err);
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
