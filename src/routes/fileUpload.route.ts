import { Router } from 'express';
import { FileUploadController } from '../controllers/fileUpload.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { SchemaValidator } from '../middlewares/validateSchema.middleware';
const validateRequest = SchemaValidator(true);
const fileUploadRoute = Router();
const fileUploadCntrl = new FileUploadController();

//fileUploadRoute.use(authenticate);

fileUploadRoute.post(
  '/upload/:formNo/:docCode',
  validateRequest,
  authenticate,
  fileUploadCntrl.uploadDocumentFile,
);
fileUploadRoute.post(
  '/captureDocument',
  validateRequest,
  authenticate,
  fileUploadCntrl.captureDocument,
);

fileUploadRoute.post(
  '/generatePdf',
  validateRequest,
  authenticate,
  fileUploadCntrl.generatePdf,
);

fileUploadRoute.post(
  '/captureImage',
  validateRequest,
  authenticate,
  fileUploadCntrl.captureImage,
);

fileUploadRoute.post(
  '/captureSingature',
  validateRequest,
  authenticate,
  fileUploadCntrl.captureSingature,
);

fileUploadRoute.get(
  '/downloadBase64/:formNo/:fileSeq',
  authenticate,
  fileUploadCntrl.getImageBase64,
);

export { fileUploadRoute };
