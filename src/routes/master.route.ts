import { Router } from 'express';
import { MasterController } from '../controllers/master.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { SchemaValidator } from '../middlewares/validateSchema.middleware';
import { checkCache } from '../middlewares/redis.middleware';
const validateRequest = SchemaValidator(true);
const masterRoute = Router();
const masterCntrl = new MasterController();

masterRoute.use(authenticate);

masterRoute.post('/UserDetail', masterCntrl.userDetail);
masterRoute.post('/RoleDetails', masterCntrl.userDetail);
masterRoute.post('/UserBranchMapping', masterCntrl.userBranchMapping);
masterRoute.post('/DocumentMapping', masterCntrl.documentMapping);
masterRoute.post('/DocumentManagement', masterCntrl.documentManagement);
masterRoute.post('/BranchMaster', masterCntrl.branchMaster);
masterRoute.post('/DocumentMaster', masterCntrl.documentMaster);
masterRoute.post('/DesignationMaster', masterCntrl.designationMaster);
//masterRoute.post('/SchemeMaster', masterCntrl.schemeMaster);
masterRoute.get('//getEmployeeDetails/:RegNo', masterCntrl.getEmployeeDetails);
// masterRoute.post('/AddProspectus', masterCntrl.AddProspectus);
// masterRoute.post('/AddBatchForTATC', masterCntrl.AddBatchForTATC);
// masterRoute.post('/AddTrainingFeeForTATC', masterCntrl.AddTrainingFeeForTATC);
// masterRoute.post('/AddBankMaster', masterCntrl.AddBankMaster);
// masterRoute.post('/AddDesignationMaster', masterCntrl.AddDesignationMaster);
// masterRoute.post('/AddDistrictMaster', masterCntrl.AddDistrictMaster);
// masterRoute.post('/AddStateMaster', masterCntrl.AddStateMaster);
// masterRoute.post('/AddCityMaster', masterCntrl.AddCityMaster);
// masterRoute.post('/AddBranchMaster', masterCntrl.AddBranchMaster);
// masterRoute.post('/AddUnitMaster', masterCntrl.AddUnitMaster);
// masterRoute.get('/getProspectusStatus', masterCntrl.getProspectusStatus);
// masterRoute.post('/AddPincodeMaster', masterCntrl.AddPincodeMaster);
// masterRoute.post('/AddTempDeployment', masterCntrl.AddTempDeployment);
// masterRoute.post('/UpdateTempDeployment', masterCntrl.UpdateTempDeployment);
// masterRoute.get(
//   '/getTempDeployment/:action/:userId',
//   masterCntrl.getTempDeployment,
// );
// masterRoute.post(
//   '/UpdateTempDeploymentStatus',
//   masterCntrl.UpdateTempDeploymentStatus,
// );
// masterRoute.delete(
//   '/removeTempDeployment/:Id',
//   masterCntrl.removeTempDeployment,
// );
// masterRoute.post('/Measurement', masterCntrl.Measurement);

export { masterRoute };
