import { Router } from 'express';
import { CmdController } from '../controllers/cmd.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { SchemaValidator } from '../middlewares/validateSchema.middleware';
import { checkCache } from '../middlewares/redis.middleware';
const validateRequest = SchemaValidator(true);
const cmdRoute = Router();
const cmdCntrl = new CmdController();

cmdRoute.use(authenticate);

//employeeRoute.get('/getStates/:countryCode', checkCache, employeeCntrl.getStates);  // to check data from redis
cmdRoute.get('/getStates/:countryCode', cmdCntrl.getStates);

export { cmdRoute };
