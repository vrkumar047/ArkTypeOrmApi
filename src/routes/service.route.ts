import { Router } from 'express';
import { ServiceController } from '../controllers/service.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { SchemaValidator } from '../middlewares/validateSchema.middleware';
import { checkCache } from '../middlewares/redis.middleware';
const validateRequest = SchemaValidator(true);
const serviceRoute = Router();
const serviceCntrl = new ServiceController();

serviceRoute.use(authenticate);

serviceRoute.get(
  '/EmpBasicDetails/:action/:formNo/:userId',
  serviceCntrl.empBasicDetails,
);

export { serviceRoute };
