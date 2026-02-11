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
scoreRoute.get(
  '/getScoerAndWeihtagePercent/:formNo/:desigCode',
  scoreCntrl.getScoerAndWeihtagePercent,
);
scoreRoute.get('/getScoreDetails/:action/:formNo', scoreCntrl.getScoreDetails);
scoreRoute.get(
  '/getCondonationDetails/:action/:formNo/:branchCode/:unitCode/:customerName',
  scoreCntrl.getCondonationDetails,
);
scoreRoute.post('/addScoreDetails', scoreCntrl.addScoreDetails);
scoreRoute.post('/applyCondonation', scoreCntrl.applyCondonation);

export { scoreRoute };
