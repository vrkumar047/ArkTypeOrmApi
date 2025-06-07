import express from 'express';
const route = express();

//import { authenticate } from '../middlewares/authenticate.middleware';

import { authRoute } from './auth.route';
import { employeeRoute } from './employee.route';
import { commonRoute } from './common.route';
import { fileUploadRoute } from './fileUpload.route';
import { cmdRoute } from './cmd.route';

route.use('/account', authRoute);
route.use('/employee', employeeRoute);
route.use('/common', commonRoute);
route.use('/cmd', cmdRoute);
route.use('/fileupload', fileUploadRoute);

export { route };
