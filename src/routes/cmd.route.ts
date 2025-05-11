import { Router } from 'express';
import { CmdController } from '../controllers/cmd.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { SchemaValidator } from '../middlewares/validateSchema.middleware';
import { checkCache } from '../middlewares/redis.middleware';
const validateRequest = SchemaValidator(true);
const cmdRoute = Router();
const cmdCntrl = new CmdController();

cmdRoute.use(authenticate);

cmdRoute.get('/execBat', cmdCntrl.execBat);
cmdRoute.get('/pingCamera/:companyCode', cmdCntrl.pingCamera);
cmdRoute.get('/execCommand/:ip/:userid/:pwd/:branchCode', cmdCntrl.execCommand);
cmdRoute.get('/closeBat/:pid', cmdCntrl.closeBat);
cmdRoute.get('/closeCommand', cmdCntrl.closeCommand);

export { cmdRoute };
