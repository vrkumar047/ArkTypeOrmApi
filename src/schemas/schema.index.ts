import Joi, { ObjectSchema } from 'joi';
import { UploadImage } from './fileUpload.schema';
import { SignIn, RefreshToken } from './auth.schema';
import { AddEmployee } from './employee.schema';
import { AddActivity } from './activity.schema';
import { GetDashboard } from './dashboard.schema';

export default {
  '/signIn': SignIn,
  '/refreshToken': RefreshToken,
} as { [key: string]: ObjectSchema };
