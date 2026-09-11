import { Router } from 'express';
import { ICardController } from '../controllers/icard.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { SchemaValidator } from '../middlewares/validateSchema.middleware';
import { checkCache } from '../middlewares/redis.middleware';
const validateRequest = SchemaValidator(true);
const icardRoute = Router();
const icardCntrl = new ICardController();

icardRoute.post('/GenerateEmployeeRegNo', icardCntrl.generateEmployeeRegNo);
icardRoute.use(authenticate);

icardRoute.post('/generateQrCode', icardCntrl.generateQrCode);
icardRoute.post('/convertPdf', icardCntrl.convertPdf);
icardRoute.post('/convertPdfFromBS64', icardCntrl.convertPdfFromBS64);
icardRoute.post('/generateNewICardPdf', icardCntrl.generateNewICardPdf);
icardRoute.post('/downloadIcard', icardCntrl.downloadIcard);
icardRoute.get('/getCardPrintDetails/:formNo', icardCntrl.getCardPrintDetails);
icardRoute.get('/getCardPrintDetailsWithRegNo/:regNo', icardCntrl.getCardPrintDetailsWithRegNo);
icardRoute.get('/getCardStatus/:regNo/:userId', icardCntrl.getCardStatus);
icardRoute.post('/postPrintCard', icardCntrl.postPrintCard);

export { icardRoute };
