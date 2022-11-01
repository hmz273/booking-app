import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    userId: { type: String, unique: true, required: true },
    userName: { type: String, unique: true, required: true },
    email: { type: String, required: true, unique: true },
    active: { type: Boolean, default: false },
    password: { type: String, required: true },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    accessToken: { type: String, default: null },
    lastLogin: { type: Date, default: null },
    role: { type: String, default: 'user' },
    rentals: [{ type: Schema.Types.ObjectId, ref: 'Rental' }],
    bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
);

const User = mongoose.model('User', userSchema);

export default User;
