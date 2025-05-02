import Joi from 'joi';
import { CustomError } from '../helpers/validatorCustomError';

const AddActivity = Joi.object({
  UserName: Joi.string()
    .required()
    .error((errors) => CustomError('UserName', errors)),
  Pwd: Joi.string()
    .required()
    .error((errors) => CustomError('Pwd', errors)),
});

export { AddActivity };
