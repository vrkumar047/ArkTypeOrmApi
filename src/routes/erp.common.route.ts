import { Router } from 'express';
import { ErpCommonController } from '../controllers/erp.common.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { SchemaValidator } from '../middlewares/validateSchema.middleware';
import { checkCache } from '../middlewares/redis.middleware';
const validateRequest = SchemaValidator(true);
const erpCommonRoute = Router();
const erpCommonCntrl = new ErpCommonController();

erpCommonRoute.use(authenticate);
erpCommonRoute.get('/getSnapShot', erpCommonCntrl.getSnapShot);
erpCommonRoute.get('/getVisitPurposes', erpCommonCntrl.getVisitPurposes);

erpCommonRoute.get('/getDevicesForClient', erpCommonCntrl.getDevicesForClient);
erpCommonRoute.get('/getCountries', erpCommonCntrl.getCountries);
//commonRoute.get('/getFeedBackBaseApi', commonCntrl.getFeedBackBaseApi);

//commonRoute.get('/getStates/:countryCode', checkCache, commonCntrl.getStates);  // to check data from redis
erpCommonRoute.get('/getStates/:countryCode', erpCommonCntrl.getStates);

erpCommonRoute.get('/getIdProofTypes', erpCommonCntrl.getIdProofTypes);

// commonRoute.get(
//   '/getCities',
//   // authenticate,
//   // authorization(["admin"]),
//   commonCntrl.getCities,
// );

export { erpCommonRoute };
