import { Router } from 'express';
import { ErpCommonController } from '../controllers/erp.common.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { SchemaValidator } from '../middlewares/validateSchema.middleware';
import { checkCache } from '../middlewares/redis.middleware';
const validateRequest = SchemaValidator(true);
const erpCommonRoute = Router();
const erpCommonCntrl = new ErpCommonController();

erpCommonRoute.use(authenticate);

erpCommonRoute.use(authenticate);
erpCommonRoute.get(
  '/getDashboardDetails/:action/:role/:userId',
  erpCommonCntrl.getDashboardDetails,
);

export { erpCommonRoute };
