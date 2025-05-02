import Joi, { ObjectSchema } from 'joi';
import { UploadImage } from './fileUpload.schema';
import { SignIn, RefreshToken } from './auth.schema';

export default {
  '/signIn': SignIn,
  '/refreshToken': RefreshToken,
} as { [key: string]: ObjectSchema };
