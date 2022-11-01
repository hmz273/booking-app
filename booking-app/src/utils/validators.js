import Joi from 'joi';

export const userSchema = Joi.object().keys({
  userName: Joi.string().required().min(3).max(30),
  email: Joi.string().email({ minDomainSegments: 2 }),
  password: Joi.string().required().min(4),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
});

export const hotelSchema = Joi.object().keys({
  title: Joi.string().required().min(3).max(180),
  city: Joi.string().required().min(3).max(30),
  street: Joi.string().required().min(4).max(50),
});

export const roomsSchema = Joi.object().keys({
  title: Joi.string().required().min(3).max(120),
  category: Joi.string().required().min(3).max(30),
  bedrooms: Joi.number().required(),
  shared: Joi.boolean().required(),
  description: Joi.string().required().min(10).max(500),
  dailyRate: Joi.number().required(),
});
