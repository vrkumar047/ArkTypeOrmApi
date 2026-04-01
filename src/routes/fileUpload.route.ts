import { Router } from 'express';
import { FileUploadController } from '../controllers/fileUpload.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { SchemaValidator } from '../middlewares/validateSchema.middleware';
import multer, { FileFilterCallback } from 'multer';
const validateRequest = SchemaValidator(true);
const fileUploadRoute = Router();
const fileUploadCntrl = new FileUploadController();
const blobUpload = multer({
    storage: multer.memoryStorage(), // store file in buffer
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit (optional)
    },
        fileFilter: (req, file, cb: FileFilterCallback) => {
        const allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'image/jpg',
            'image/webp',
            'application/pdf'
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only images and PDF files are allowed'));
        }
    }
});

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

fileUploadRoute.post(
  '/uploadFileToS3', blobUpload.single("file"),  fileUploadCntrl.uploadFileToS3,
);

fileUploadRoute.post(
  '/getSignedUrl', fileUploadCntrl.getSignedUrl,
);


export { fileUploadRoute };
