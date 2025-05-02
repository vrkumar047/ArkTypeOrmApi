import Joi from 'joi';
import { CustomError } from '../helpers/validatorCustomError';

const UploadImage = Joi.object({
  image: Joi.object({
    type: Joi.string().valid('image/jpeg', 'image/png', 'image/gif').required(),
    size: Joi.number()
      .max(5 * 1024 * 1024)
      .required(), // 5MB limit
  }).required(),
});

export { UploadImage };
