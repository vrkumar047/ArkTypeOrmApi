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
commonRoute.get(
  '/getProspectusNo/:action/:branchCode/:userId',
  commonCntrl.getProspectusNo,
);
commonRoute.get(
  '/getBasicTableDetails/:action/:userId',
  commonCntrl.getBasicTableDetails,
);
commonRoute.get(
  '/getAddressDetail/:action/:countryId/:stateId/:districtId/:cityId/:userId',
  commonCntrl.getAddressDetail,
);
commonRoute.get('/getState', commonCntrl.getState);
commonRoute.get(
  '/getConstituency/:action/:stateCode/:pcCode',
  commonCntrl.getConstituency,
);
commonRoute.get('/getCasteCategory/:stateCode', commonCntrl.getCasteCategory);
commonRoute.get('/getCaste/:casteCategory/:stateCode', commonCntrl.getCaste);
commonRoute.get(
  '/getFeeBatchAndSchemeList/:tableName/:branchCode/:desigCode',
  commonCntrl.getFeeBatchAndSchemeList,
);

// commonRoute.get(
//   '/getCities',
//   // authenticate,
//   // authorization(["admin"]),
//   commonCntrl.getCities,
// );

export { commonRoute };
