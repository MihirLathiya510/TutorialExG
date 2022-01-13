const joi = require('joi');

const swaggerschemasPOST = joi.object().keys({
  title: joi.string().trim().min(3).max(100).required(),
  description: joi.string().trim().min(1).max(5000).required(),
  published: joi.boolean(),
});
const swaggerschemasPUT = joi
  .object()
  .keys({
    title: joi.string().trim().min(3).max(100),
    description: joi.string().trim().min(1).max(5000),
    published: joi.boolean(),
  })
  .or('title', 'description', 'published');

const registerUserSchema = joi.object().keys({
  username: joi.string().trim().min(6).max(256).required(),
  email: joi.string().trim().min(6).max(256).required().email(),
  password: joi.string().min(6).required(),
});
const loginUserSchema = joi.object().keys({
  email: joi.string().trim().min(6).max(256).required().email(),
  password: joi.string().min(6).required(),
});
const resetPasswordSchema = joi.object().keys({
  email: joi.string().trim().min(6).max(256).required().email(),
});
module.exports = {
  swaggerschemasPOST,
  swaggerschemasPUT,
  registerUserSchema,
  loginUserSchema,
  resetPasswordSchema,
};
