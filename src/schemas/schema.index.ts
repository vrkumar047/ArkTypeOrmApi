import Joi, { ObjectSchema } from 'joi';
import { UploadImage } from './fileUpload.schema';
import { SignIn, RefreshToken } from './auth.schema';
import { AddEmployee } from './employee.schema';
import { AddActivity } from './activity.schema';
import { GetDashboard } from './dashboard.schema';
import { UploadImageFingerPrint } from './fingerPrint.schema';
import { UploadImageScore } from './score.schema';

export default {
  '/signIn': SignIn,
  '/refreshToken': RefreshToken,
  '/addEmployee': AddEmployee,
} as { [key: string]: ObjectSchema };
