import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { SchemaValidator } from '../middlewares/validateSchema.middleware';
const validateRequest = SchemaValidator(true);
const authRoute = Router();
const authCntrl = new AuthController();

authRoute.post('/signIn', validateRequest, authCntrl.signIn);
//authRoute.post('/refreshToken', validateRequest, authCntrl.refreshToken);

export { authRoute };
