import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { SchemaValidator } from '../middlewares/validateSchema.middleware';
const validateRequest = SchemaValidator(true);
const authRoute = Router();
const authCntrl = new AuthController();

authRoute.post('/signUp', validateRequest, authCntrl.signUp);
authRoute.post('/signIn', validateRequest, authCntrl.signIn);
authRoute.post('/isLogedIn', validateRequest, authCntrl.isLogedIn);
//authRoute.post('/refreshToken', validateRequest, authCntrl.refreshToken);
authRoute.post('/logOut', validateRequest, authenticate, authCntrl.logOut);

export { authRoute };
