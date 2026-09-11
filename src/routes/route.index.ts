import express from 'express';
const route = express();

//import { authenticate } from '../middlewares/authenticate.middleware';

import { authRoute } from './auth.route';
import { employeeRoute } from './employee.route';
import { masterRoute } from './master.route';
import { commonRoute } from './common.route';
import { fileUploadRoute } from './fileUpload.route';
import { cmdRoute } from './cmd.route';
import { icardRoute } from './icard.route';
import { fingerPrintRoute } from './fingerPrint.route';
import { scoreRoute } from './score.route';
import { serviceRoute } from './service.route';
import { dashboardRoute } from './dashboard.route';

route.use('/account', authRoute);
route.use('/employee', employeeRoute);
route.use('/master', masterRoute);
route.use('/common', commonRoute);
route.use('/cmd', cmdRoute);
route.use('/fileupload', fileUploadRoute);
route.use('/card', icardRoute);
route.use('/fingerprint', fingerPrintRoute);
route.use('/score', scoreRoute);
route.use('/services', serviceRoute);
route.use('/dashboard', dashboardRoute);

export { route };
