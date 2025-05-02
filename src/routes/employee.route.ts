import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { SchemaValidator } from '../middlewares/validateSchema.middleware';
import { checkCache } from '../middlewares/redis.middleware';
const validateRequest = SchemaValidator(true);
const employeeRoute = Router();
const employeeCntrl = new EmployeeController();

employeeRoute.use(authenticate);

//employeeRoute.get('/getStates/:countryCode', checkCache, employeeCntrl.getStates);  // to check data from redis
employeeRoute.get('/getStates/:countryCode', employeeCntrl.getStates);

export { employeeRoute };
