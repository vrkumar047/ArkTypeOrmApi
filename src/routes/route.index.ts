import express from 'express';
const route = express();

//import { authenticate } from '../middlewares/authenticate.middleware';

import { authRoute } from './auth.route';
import { commonRoute } from './common.route';
import { fileUploadRoute } from './fileUpload.route';

route.use('/account', authRoute);
route.use('/common', commonRoute);
route.use('/fileupload', fileUploadRoute);

export { route };
