import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { SchemaValidator } from '../middlewares/validateSchema.middleware';
import { checkCache } from '../middlewares/redis.middleware';
const validateRequest = SchemaValidator(true);
const dashboardRoute = Router();
const dashboardCntrl = new DashboardController();

dashboardRoute.use(authenticate);

dashboardRoute.get('/getBankDetails/:action/:formNo', dashboardCntrl.getStates);
// dashboardRoute.post('/DashboardList', dashboardCntrl.DashboardList);
// dashboardRoute.post('/DashboardDetails', dashboardCntrl.DashboardDetails);
// dashboardRoute.get('/ActiveBranchList/:companyCode', dashboardCntrl.ActiveBranchList);
// dashboardRoute.get('/BranchCameraDetails/:companyCode', dashboardCntrl.BranchCameraDetails);
// dashboardRoute.post('/downloadReport', dashboardCntrl.downloadReport);
// dashboardRoute.post('/DownloadVerifiedESI', dashboardCntrl.DownloadVerifiedESI);

export { dashboardRoute };
