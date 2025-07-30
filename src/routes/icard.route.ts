import { Router } from 'express';
import { ICardController } from '../controllers/icard.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { SchemaValidator } from '../middlewares/validateSchema.middleware';
import { checkCache } from '../middlewares/redis.middleware';
const validateRequest = SchemaValidator(true);
const icardRoute = Router();
const icardCntrl = new ICardController();

icardRoute.use(authenticate);

icardRoute.get('/getCardPrintDetails/:formNo', icardCntrl.getCardPrintDetails);
icardRoute.post('/GenerateEmployeeRegNo', icardCntrl.generateEmployeeRegNo);
icardRoute.get('/getCardStatus/:regNo/:userId', icardCntrl.getCardStatus);
icardRoute.post('/postPrintCard', icardCntrl.postPrintCard);

export { icardRoute };
