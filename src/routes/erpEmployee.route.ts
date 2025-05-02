import { Router } from 'express';
import { ErpEmployeeController } from '../controllers/erpEmployee.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { SchemaValidator } from '../middlewares/validateSchema.middleware';
import { checkCache } from '../middlewares/redis.middleware';
const validateRequest = SchemaValidator(true);
const erpEmployeeRoute = Router();
const erpEmployeeCntrl = new ErpEmployeeController();

erpEmployeeRoute.use(authenticate);

//erpEmployeeRoute.get('/getStates/:countryCode', checkCache, erpEmployeeCntrl.getStates);  // to check data from redis
erpEmployeeRoute.get('/getStates/:countryCode', erpEmployeeCntrl.getStates);

export { erpEmployeeRoute };
