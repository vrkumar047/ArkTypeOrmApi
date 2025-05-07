import { Router } from 'express';
import { CommonController } from '../controllers/common.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { SchemaValidator } from '../middlewares/validateSchema.middleware';
import { checkCache } from '../middlewares/redis.middleware';
const validateRequest = SchemaValidator(true);
const commonRoute = Router();
const commonCntrl = new CommonController();

commonRoute.use(authenticate);
commonRoute.get(
  '/getDashboardDetails/:action/:role/:userId',
  commonCntrl.getDashboardDetails,
);
commonRoute.get(
  '/getProspectusNo/:action/:branchCode/:userId',
  commonCntrl.getProspectusNo,
);
commonRoute.get(
  '/getBasicTableDetails/:action/:userId',
  commonCntrl.getBasicTableDetails,
);
commonRoute.get(
  '/getAddressDetail/:action/:countryId/:stateId/:districtId/:cityId/:userId',
  commonCntrl.getAddressDetail,
);
commonRoute.get('/getState', commonCntrl.getState);
commonRoute.get(
  '/getConstituency/:action/:stateCode/:pcCode',
  commonCntrl.getConstituency,
);
commonRoute.get('/getCasteCategory/:stateCode', commonCntrl.getCasteCategory);
commonRoute.get('/getCaste/:casteCategory/:stateCode', commonCntrl.getCaste);
commonRoute.get(
  '/getFeeBatchAndSchemeList/:tableName/:branchCode/:desigCode',
  commonCntrl.getFeeBatchAndSchemeList,
);
commonRoute.get('/getReasonList/:action', commonCntrl.getReasonList);
commonRoute.get(
  '/getDocumentList/:post/:candType',
  commonCntrl.getDocumentList,
);
commonRoute.get(
  '/getRequiredDocument/:docType/:post/:candType',
  commonCntrl.getRequiredDocument,
);
commonRoute.get(
  '/getRequiredDocs/:post/:candType',
  commonCntrl.getRequiredDocs,
);
commonRoute.get(
  '/getApplicableDocType/:docCode',
  commonCntrl.getApplicableDocType,
);

commonRoute.get(
  '/getDocumentForVerify/:post/:candType/:isBranch',
  commonCntrl.getDocumentForVerify,
);

commonRoute.get(
  '/getMandatoryDocList/:post/:candType',
  commonCntrl.getMandatoryDocList,
);

commonRoute.get(
  '/getEducationDetails/:action/:formNo',
  commonCntrl.getEducationDetails,
);

commonRoute.get(
  '/getLanguageDetails/:action/:formNo',
  commonCntrl.getLanguageDetails,
);

commonRoute.get(
  '/getExperienceDetails/:action/:formNo',
  commonCntrl.getExperienceDetails,
);

commonRoute.get(
  '/getExManExperienceDetails/:action/:formNo',
  commonCntrl.getExManExperienceDetails,
);

commonRoute.get(
  '/getEsiServerDetails/:action/:formNo/:esiNo/:userId',
  commonCntrl.getEsiServerDetails,
);

commonRoute.get(
  '/getFamilyDetails/:action/:formNo',
  commonCntrl.getFamilyDetails,
);

commonRoute.get(
  '/getPhysicalDetails/:action/:formNo',
  commonCntrl.getPhysicalDetails,
);

commonRoute.get('/getBankDetails/:action/:formNo', commonCntrl.getBankDetails);

commonRoute.get(
  '/getBankDetailsIFSCWise/:ifscCode',
  commonCntrl.getBankDetailsIFSCWise,
);

commonRoute.get(
  '/getDesignationList/:action/:branchCode/:userId',
  commonCntrl.getDesignationList,
);

commonRoute.get(
  '/getTempDeploymentFormList/:userId',
  commonCntrl.getTempDeploymentFormList,
);

commonRoute.get(
  '/getUnApprovedDocuments/:formNo',
  commonCntrl.getUnApprovedDocuments,
);

commonRoute.get(
  '/getTempDeploymentApplicationDetail/:formNo',
  commonCntrl.getTempDeploymentApplicationDetail,
);

// commonRoute.post(
//   '/updateTempDeploymentDocumentStatus',
//   commonCntrl.updateTempDeploymentDocumentStatus,
// );

// commonRoute.get(
//   '/RqccDocumentDetail/:action/:formNo',
//   commonCntrl.RqccDocumentDetail,
// );

// commonRoute.get('/CandidatTypeList/:branchCode', commonCntrl.CandidatTypeList);

// commonRoute.get('/GetList/:action/:userId', commonCntrl.GetList);

// commonRoute.get(
//   '/formlist/:action/:role/:branchCode/:desig/:month/:year/:userId',
//   commonCntrl.formlist,
// );

// commonRoute.get(
//   '/esiverificationlist/:action/:role/:branchCode/:fromDate/:toDate/:userId',
//   commonCntrl.esiverificationlist,
// );

// commonRoute.get(
//   '/formstatus/:action/:role/:formNo/:userId',
//   commonCntrl.formstatus,
// );

// commonRoute.get(
//   '/filteredformlist/:role/:formNo/:filterText/:userId',
//   commonCntrl.filteredformlist,
// );

// commonRoute.get('/EmpPicDetails/:action/:formNo', commonCntrl.EmpPicDetails);

// commonRoute.get(
//   '/GetUserDetails/:action/:agentCode/:compCode/:searchText',
//   commonCntrl.GetUserDetails,
// );

// commonRoute.get(
//   '/IsUserExist/:action/:checkFor/:checkString/:userId',
//   commonCntrl.IsUserExist,
// );

// commonRoute.get(
//   '/CheckBasicDetails/:checkFor/:checkString/:name/:formNo',
//   commonCntrl.CheckBasicDetails,
// );

// commonRoute.get(
//   '/AssessmentDetails/:action/:loginName/:assessType/:assessCode',
//   commonCntrl.AssessmentDetails,
// );

// commonRoute.get(
//   '/GetCondoDetails/:action/:formNo/:branchCode',
//   commonCntrl.GetCondoDetails,
// );

// commonRoute.get(
//   '/GetFileSequence/:formNo/:docTypeId',
//   commonCntrl.GetFileSequence,
// );

// commonRoute.get('/IndustryList/:action/:formNo', commonCntrl.IndustryList);

// commonRoute.get(
//   '/GetFileSequence/:formNo/:docTypeId',
//   commonCntrl.GetFileSequence,
// );

// commonRoute.get(
//   '/UserWiseBranchList/:userId/:compCode',
//   commonCntrl.UserWiseBranchList,
// );

// commonRoute.post(
//   '/GetSearchedApplications',
//   commonCntrl.GetSearchedApplications,
// );

// commonRoute.post('/getSchemeDetails', commonCntrl.getSchemeDetails);

// commonRoute.post('/postUanStatusDetail', commonCntrl.postUanStatusDetail);

// commonRoute.post(
//   '/postApproveRejectElectronicDetail',
//   commonCntrl.postApproveRejectElectronicDetail,
// );

// commonRoute.get('/GetReportList/:userId', commonCntrl.GetReportList);

// commonRoute.get('/GetAppToken', commonCntrl.GetAppToken);

// commonRoute.get('/UpdateAppToken', commonCntrl.UpdateAppToken);

export { commonRoute };
