import { Router } from 'express';
import { MasterController } from '../controllers/master.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { SchemaValidator } from '../middlewares/validateSchema.middleware';
import { checkCache } from '../middlewares/redis.middleware';
const validateRequest = SchemaValidator(true);
const masterRoute = Router();
const masterCntrl = new MasterController();
masterRoute.post('/AddProspectus', masterCntrl.addProspectus);
masterRoute.post('/AddBatchForTATC', masterCntrl.addBatchForTATC);
masterRoute.post('/AddTrainingFeeForTATC', masterCntrl.addTrainingFeeForTATC);
masterRoute.post('/AddBankMaster', masterCntrl.addBankMaster);
masterRoute.post('/AddDesignationMaster', masterCntrl.addDesignationMaster);
masterRoute.post('/AddStateMaster', masterCntrl.addStateMaster);
masterRoute.post('/AddDistrictMaster', masterCntrl.addDistrictMaster);
masterRoute.post('/AddCityMaster', masterCntrl.addCityMaster);
masterRoute.post('/AddBranchMaster', masterCntrl.addBranchMaster);
masterRoute.post('/AddUnitMaster', masterCntrl.addUnitMaster);
masterRoute.post('/AddPincodeMaster', masterCntrl.addPincodeMaster);
masterRoute.get('/getProspectusStatus', masterCntrl.getProspectusStatus);
masterRoute.get('/getVendorBranchList/:username/:password', masterCntrl.getVendorBranchList);
masterRoute.get('/getTempDevicePassword/:username/:password/:deviceID', masterCntrl.getTempDevicePassword);
masterRoute.get('/getDevicePasswordReset/:username/:password/:deviceID', masterCntrl.getDevicePasswordReset);
masterRoute.get('/getUpdateMachineId/:username/:password/:branchCode/:deviceID', masterCntrl.getUpdateMachineId);
masterRoute.post('/Measurement', masterCntrl.Measurement);
masterRoute.post('/GetRemotePassword', masterCntrl.getRemotePassword);
masterRoute.post('/dbUser', masterCntrl.dbUser);
masterRoute.use(authenticate);
masterRoute.post('/UserDetail', masterCntrl.userDetail);
masterRoute.post('/RoleDetails', masterCntrl.userDetail);
masterRoute.post('/UserBranchMapping', masterCntrl.userBranchMapping);
masterRoute.post('/DocumentMapping', masterCntrl.documentMapping);
masterRoute.post('/DocumentManagement', masterCntrl.documentManagement);
masterRoute.post('/BranchMaster', masterCntrl.branchMaster);
masterRoute.post('/DocumentMaster', masterCntrl.documentMaster);
masterRoute.post('/DesignationMaster', masterCntrl.designationMaster);
masterRoute.post('/SchemeMaster', masterCntrl.schemeMaster);
masterRoute.get('/getEmployeeDetails/:RegNo', masterCntrl.getEmployeeDetails);
masterRoute.get('/employeeDetail/:RegNo', masterCntrl.employeeDetail);

masterRoute.post('/addTempDeployment', masterCntrl.addTempDeployment);
masterRoute.post('/updateTempDeployment', masterCntrl.updateTempDeployment);
masterRoute.get(
  '/getTempDeployment/:action/:userId',
  masterCntrl.getTempDeployment,
);
masterRoute.post(
  '/updateTempDeploymentStatus',
  masterCntrl.updateTempDeploymentStatus,
);
// masterRoute.delete(
//   '/removeTempDeployment/:Id',
//   masterCntrl.removeTempDeployment,
// );

export { masterRoute };
