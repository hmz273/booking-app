import mongoose from 'mongoose';

const { Schema } = mongoose;

const paymentSchema = new Schema({
  fromUser: { type: Schema.Types.ObjectId, ref: 'User' },
  fromStripeCustomerId: String,
  toUser: { type: Schema.Types.ObjectId, ref: 'User' },
  booking: { type: Schema.Types.ObjectId, ref: 'Booking' },
  amount: Number,
  tokenId: String,
  charge: Schema.Types.Mixed,
  status: { type: String, default: 'pending' },
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
