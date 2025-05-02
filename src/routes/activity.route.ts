import { Router } from 'express';
import { ActivityController } from '../controllers/activity.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { SchemaValidator } from '../middlewares/validateSchema.middleware';
import { checkCache } from '../middlewares/redis.middleware';
const validateRequest = SchemaValidator(true);
const activityRoute = Router();
const activityCntrl = new ActivityController();

activityRoute.use(authenticate);

//activityRoute.get('/getStates/:countryCode', checkCache, activityCntrl.getStates);  // to check data from redis
activityRoute.get('/getStates/:countryCode', activityCntrl.getStates);

export { activityRoute };
