import { Router } from 'express';
import { CommonController } from '../controllers/common.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { SchemaValidator } from '../middlewares/validateSchema.middleware';
import { checkCache } from '../middlewares/redis.middleware';
const validateRequest = SchemaValidator(true);
const commonRoute = Router();
const commonCntrl = new CommonController();

commonRoute.use(authenticate);
commonRoute.get(
  '/getDashboardDetails/:action/:role/:userId',
  commonCntrl.getDashboardDetails,
);
commonRoute.get('/getVisitPurposes', commonCntrl.getVisitPurposes);

commonRoute.get('/getDevicesForClient', commonCntrl.getDevicesForClient);
commonRoute.get('/getCountries', commonCntrl.getCountries);
//commonRoute.get('/getFeedBackBaseApi', commonCntrl.getFeedBackBaseApi);

//commonRoute.get('/getStates/:countryCode', checkCache, commonCntrl.getStates);  // to check data from redis
commonRoute.get('/getStates/:countryCode', commonCntrl.getStates);

commonRoute.get('/getIdProofTypes', commonCntrl.getIdProofTypes);

// commonRoute.get(
//   '/getCities',
//   // authenticate,
//   // authorization(["admin"]),
//   commonCntrl.getCities,
// );

export { commonRoute };
