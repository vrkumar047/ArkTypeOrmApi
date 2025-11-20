import { Router } from 'express';
import { ScoreController } from '../controllers/score.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { SchemaValidator } from '../middlewares/validateSchema.middleware';
import { checkCache } from '../middlewares/redis.middleware';
const validateRequest = SchemaValidator(true);
const scoreRoute = Router();
const scoreCntrl = new ScoreController();

scoreRoute.use(authenticate);

scoreRoute.get('/calculateScore/:formNo/:desigCode', scoreCntrl.calculateScore);
scoreRoute.post('/postPrintCard', scoreCntrl.postPrintCard);

export { scoreRoute };
