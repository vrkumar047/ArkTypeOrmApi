import Joi from 'joi';
import { CustomError } from '../helpers/validatorCustomError';

const ChangePassword = Joi.object({
  UserName: Joi.string()
    .required()
    .error((errors) => CustomError('UserName', errors)),
  Pwd: Joi.string()
    .required()
    .error((errors) => CustomError('Pwd', errors)),
});

const RefreshToken = Joi.object({
  refreshToken: Joi.string()
    .required()
    .error((errors) => CustomError('refreshToken', errors)),
  token: Joi.string()
    .required()
    .error((errors) => CustomError('token', errors)),
});

export { ChangePassword };
