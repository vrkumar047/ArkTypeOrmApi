import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { SchemaValidator } from '../middlewares/validateSchema.middleware';
import { checkCache } from '../middlewares/redis.middleware';
const validateRequest = SchemaValidator(true);
const employeeRoute = Router();
const employeeCntrl = new EmployeeController();

employeeRoute.use(authenticate);

//employeeRoute.get('/getStates/:countryCode', checkCache, employeeCntrl.getStates);  // to check data from redis
employeeRoute.get(
  '/getFormNo/:head/:branchCode/:updateBit',
  employeeCntrl.getFormNo,
);
employeeRoute.post('/addEmployee', employeeCntrl.addEmployee);
employeeRoute.put(
  '/OTPDetail/:action/:formNo/:otpNo/:userId',
  employeeCntrl.otpDetail,
);
employeeRoute.post('/addEducationDetails', employeeCntrl.addEducationDetails);
employeeRoute.put(
  '/removeEducationDetails/:action/:formNo/:classCode',
  employeeCntrl.removeEducationDetails,
);
employeeRoute.post('/addLanguageDetails', employeeCntrl.addLanguageDetails);

employeeRoute.post('/addCvExpDetails', employeeCntrl.addCvExpDetails);

employeeRoute.put(
  '/removeCvExpDetails/:action/:formNo/:orgType',
  employeeCntrl.removeCvExpDetails,
);

employeeRoute.post('/addExManExpDetails', employeeCntrl.addExManExpDetails);
employeeRoute.put(
  '/removeExManExpDetails/:action/:formNo/:serviceType/:org',
  employeeCntrl.removeExManExpDetails,
);

employeeRoute.post('/addEsiServerDetails', employeeCntrl.addEsiServerDetails);
employeeRoute.put(
  '/removeEsiServerDetails/:action/:formNo/:esiNo',
  employeeCntrl.removeEsiServerDetails,
);

employeeRoute.post('/addFamilyDetails', employeeCntrl.addFamilyDetails);
employeeRoute.put(
  '/removeFamilyDetail/:action/:formNo/:name',
  employeeCntrl.removeFamilyDetail,
);

employeeRoute.post('/addPhysicalDetails', employeeCntrl.addPhysicalDetails);
employeeRoute.put(
  '/removePhysicalDetail/:action/:formNo',
  employeeCntrl.removePhysicalDetail,
);

employeeRoute.post('/addBankDetails', employeeCntrl.addBankDetails);
employeeRoute.put(
  '/removeBankDetail/:action/:formNo',
  employeeCntrl.removeBankDetail,
);
employeeRoute.put(
  '/updateFormStatus/:action/:formNo/:formName/:status/:userId',
  employeeCntrl.updateFormStatus,
);
employeeRoute.get(
  '/getEmployeeBasicDetails/:action/:formNo',
  employeeCntrl.getEmployeeBasicDetails,
);
employeeRoute.get(
  '/getUploadedFormDetails/:action/:formNo',
  employeeCntrl.getUploadedFormDetails,
);
employeeRoute.get(
  '/removedocument/:action/:formNo/:docTypeId/:docId',
  employeeCntrl.removedocument,
);
employeeRoute.get(
  '/getEduLangDetails/:formNo',
  employeeCntrl.getEduLangDetails,
);
employeeRoute.get(
  '/getExpExMEsiDetails/:formNo',
  employeeCntrl.getExpExMEsiDetails,
);
employeeRoute.post('/updateRqccDocument', employeeCntrl.updateRqccDocument);
employeeRoute.post('/UpdateApprovalStatus', employeeCntrl.updateApprovalStatus);
employeeRoute.post(
  '/UpdateEmployeeDetails',
  employeeCntrl.updateEmployeeDetails,
);
employeeRoute.post('/UpdateAllFormStatus', employeeCntrl.updateAllFormStatus);
employeeRoute.post('/UpdateRegNo', employeeCntrl.updateRegNo);
employeeRoute.post(
  '/UpdateApprovalStatusDetails',
  employeeCntrl.updateApprovalStatusDetails,
);
// employeeRoute.post('/CheckPreEmployee', employeeCntrl.CheckPreEmployee);
employeeRoute.post('/sendOtp', employeeCntrl.sendOtp);
export { employeeRoute };
