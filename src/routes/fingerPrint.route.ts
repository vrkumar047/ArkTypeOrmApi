import { Router } from 'express';
import { FingerPrintController } from '../controllers/fingerPrint.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { SchemaValidator } from '../middlewares/validateSchema.middleware';
import { checkCache } from '../middlewares/redis.middleware';
const validateRequest = SchemaValidator(true);
const fingerPrintRoute = Router();
const fingerPrintCntrl = new FingerPrintController();

fingerPrintRoute.use(authenticate);

fingerPrintRoute.post('/addFingerPrint', fingerPrintCntrl.addFingerPrint);

export { fingerPrintRoute };
