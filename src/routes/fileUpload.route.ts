import { Router } from 'express';
import { FileUploadController } from '../controllers/fileUpload.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { SchemaValidator } from '../middlewares/validateSchema.middleware';
const validateRequest = SchemaValidator(true);
const fileUploadRoute = Router();
const fileUploadCntrl = new FileUploadController();

fileUploadRoute.use(authenticate);

fileUploadRoute.post(
  '/clientLogo',
  validateRequest,
  fileUploadCntrl.clientLogo,
);
fileUploadRoute.post(
  '/userProfilePicture',
  validateRequest,
  fileUploadCntrl.userProfilePicture,
);

fileUploadRoute.post(
  '/staffPicture',
  validateRequest,
  fileUploadCntrl.staffPicture,
);

fileUploadRoute.post(
  '/staffIdProof',
  validateRequest,
  fileUploadCntrl.staffIdProof,
);

export { fileUploadRoute };
