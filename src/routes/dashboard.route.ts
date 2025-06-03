import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { SchemaValidator } from '../middlewares/validateSchema.middleware';
import { checkCache } from '../middlewares/redis.middleware';
const validateRequest = SchemaValidator(true);
const dashboardRoute = Router();
const dashboardCntrl = new DashboardController();

dashboardRoute.use(authenticate);

dashboardRoute.post('/DashboardList', dashboardCntrl.dashboardList);
dashboardRoute.post('/DashboardDetails', dashboardCntrl.dashboardDetails);
dashboardRoute.get(
  '/ActiveBranchList/:companyCode',
  dashboardCntrl.activeBranchList,
);
dashboardRoute.get(
  '/BranchCameraDetails/:companyCode',
  dashboardCntrl.branchCameraDetails,
);
dashboardRoute.post('/downloadReport', dashboardCntrl.downloadReport);
dashboardRoute.post('/DownloadVerifiedESI', dashboardCntrl.downloadVerifiedESI);

export { dashboardRoute };
