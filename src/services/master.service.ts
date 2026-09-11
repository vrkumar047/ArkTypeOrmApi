import * as sql from "mssql";
import { GetCompanyDb, getResultSets } from "../_dbs/mssql/sqlConnection";
import { DataSource, ILike, Like, In, Not, Raw } from "typeorm";
import { create } from "xmlbuilder2";
import bcrypt from "bcrypt";
import constant from "../_dbs/mssql/constant";
import { plainToClass } from "class-transformer";
import { JWT } from "../helpers/jwt";
import { Encrypt } from "../helpers/encrypt";
import { CustomError } from "../helpers/customError";
import ErrorMessage from "../_configs/errors/customError.json";
import appConfig from "../_configs/app/appConfig.json";
import dotenv from "dotenv";
import Logger from "../utils/logger";
import moment from "moment";
const jwt = new JWT();
dotenv.config();
const {
  db_host,
  db_port,
  db_name,
  db_user,
  db_password,
  refreshTokenExpireTime,
  clientSecret,
} = process.env;
export class MasterService {
  async userDetail(loggedInUser: any, userDetail: any): Promise<any> {
    try {
      let salt = bcrypt.genSaltSync(10);
      let hashPwd = bcrypt.hashSync(userDetail.pwd, salt);
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let updatedUserDetail: any = await companyDb.query(
        `EXEC ${constant.P_NewUser} @action = @0, @user_id = @1, 
        @regNo = @2, @password = @3, @hash_password = @4, @branch_id = @5, 
        @department_id = @6, @name = @7, @role_id = @8, @email_id = @9, 
        @mobile = @10, @address = @11, @country_id = @12, @state_id = @13,
        @district_id = @14, @city_id = @15, @expDate = @16, @created_by = @17`,
        [
          userDetail.action,
          userDetail.userId,
          userDetail.regNo,
          userDetail.pwd,
          userDetail.hashPwd,
          userDetail.branchId,
          userDetail.departmentId,
          userDetail.name,
          userDetail.roleId,
          userDetail.emailId,
          userDetail.mobile,
          userDetail.address,
          userDetail.countryId,
          userDetail.stateId,
          userDetail.districtId,
          userDetail.cityId,
          userDetail.expDate,
          userDetail.createdBy,
        ]
      );
      if (!updatedUserDetail) {
        updatedUserDetail = { message: "Record updated" };
      }
      return updatedUserDetail;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: "master/userDetail",
        error: `{"Error":"${
          error.name == "RequestError" ? error.name : error.message
        }", "Detail":${
          error.name == "RequestError"
            ? JSON.stringify(error.precedingErrors)
            : '"' + error.detail + '"'
        }}`,
        requestPayload: `${JSON.stringify(userDetail)}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == "RequestError"
          ? new CustomError("InternalServerError")
          : error;
      throw error;
    }
  }

  async roleDetail(loggedInUser: any, roleDetail: any): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let updateRoleDetail: any = await companyDb.query(
        `EXEC ${constant.P_RoleMaster} @action = @0, @roleId = @1, 
        @roleName = @2, @roleNote = @3, @claim = @4, @isActive = @5, 
        @userId = @6`,
        [
          roleDetail.action,
          roleDetail.roleId,
          roleDetail.roleName,
          roleDetail.roleNote,
          roleDetail.claim,
          roleDetail.isActive,
          roleDetail.userId,
        ]
      );
      if (!updateRoleDetail) {
        updateRoleDetail = { message: "Record updated" };
      }
      return updateRoleDetail;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: "master/roleDetail",
        error: `{"Error":"${
          error.name == "RequestError" ? error.name : error.message
        }", "Detail":${
          error.name == "RequestError"
            ? JSON.stringify(error.precedingErrors)
            : '"' + error.detail + '"'
        }}`,
        requestPayload: `${JSON.stringify(roleDetail)}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == "RequestError"
          ? new CustomError("InternalServerError")
          : error;
      throw error;
    }
  }

  async userBranchMapping(loggedInUser: any, mappingDetail: any): Promise<any> {
    try {
      let userList = mappingDetail.userDetails;
      let branchList = mappingDetail.branchDetails;
      let userXmlString = "";
      let branchXmlString = "";
      let companyDb = await GetCompanyDb(loggedInUser.secret);

      let userXmlDoc = create().ele("userlist");
      userList.forEach((user: any) => {
        const leafNode = userXmlDoc.ele("user");
        leafNode.ele("RegNo").txt(user.RegNo);
      });
      userXmlString = userXmlDoc.end({
        headless: true,
        prettyPrint: true,
      });
      userXmlString = userXmlString.replace(/[\r\n]+/g, "").trim();

      let branchXmlDoc = create().ele("bnchlist");
      userList.forEach((brnch: any) => {
        const leafNode = branchXmlDoc.ele("bnch");
        leafNode.ele("code").txt(brnch.code);
      });
      branchXmlString = branchXmlDoc.end({
        headless: true,
        prettyPrint: true,
      });
      branchXmlString = branchXmlString.replace(/[\r\n]+/g, "").trim();

      let updateUserDetail: any = await companyDb.query(
        `EXEC ${constant.P_UserBranchPermission} @action = @0, @compCode = @1, 
        @userXml = @2, @branchXml = @3, @userId = @4`,
        [
          mappingDetail.action,
          mappingDetail.compCode,
          userXmlString,
          branchXmlString,
          mappingDetail.userId,
        ]
      );
      return { status: "success" };
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: "master/userBranchMapping",
        error: `{"Error":"${
          error.name == "RequestError" ? error.name : error.message
        }", "Detail":${
          error.name == "RequestError"
            ? JSON.stringify(error.precedingErrors)
            : '"' + error.detail + '"'
        }}`,
        requestPayload: `${JSON.stringify(mappingDetail)}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == "RequestError"
          ? new CustomError("InternalServerError")
          : error;
      throw error;
    }
  }

  async documentMapping(loggedInUser: any, mappingDetail: any): Promise<any> {
    try {
      let docList = mappingDetail.documentDetails;
      let docTypeList = mappingDetail.docTypeDetails;
      let docXmlString = "";
      let docTypeXmlString = "";
      let xmlDoc = create().ele("docs");
      docList.forEach((doc: any) => {
        const leafNode = xmlDoc.ele("id");
        leafNode.ele("docId").txt(doc.docId);
      });
      docXmlString = xmlDoc.end({
        headless: true,
        prettyPrint: true,
      });
      docXmlString = docXmlString.replace(/[\r\n]+/g, "").trim();

      let xmlDocType = create().ele("docType");
      docList.forEach((docType: any) => {
        const leafNode = xmlDocType.ele("id");
        leafNode.ele("validFor").txt(docType.validFor);
      });
      docTypeXmlString = xmlDocType.end({
        headless: true,
        prettyPrint: true,
      });
      docTypeXmlString = docTypeXmlString.replace(/[\r\n]+/g, "").trim();

      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let updatedMappingDetail: any = await companyDb.query(
        `EXEC ${constant.P_UserBranchPermission} @action = @0, @documentXml = @1, 
        @documentTypeXml = @2`,
        [mappingDetail.action, docXmlString, docTypeXmlString]
      );
      return { status: "success" };
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: "master/documentMapping",
        error: `{"Error":"${
          error.name == "RequestError" ? error.name : error.message
        }", "Detail":${
          error.name == "RequestError"
            ? JSON.stringify(error.precedingErrors)
            : '"' + error.detail + '"'
        }}`,
        requestPayload: `${JSON.stringify(mappingDetail)}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == "RequestError"
          ? new CustomError("InternalServerError")
          : error;
      throw error;
    }
  }

  async documentManagement(loggedInUser: any, docDetail: any): Promise<any> {
    try {
      let docsXml = "";
      let docsTypeXml = "";
      if (docDetail.action == "assign" && docDetail.action == "unassign") {
        var docsList = docDetail.docList;
        let xmlDoc = create().ele("docs");
        docsList.forEach((doc: any) => {
          const leafNode = xmlDoc.ele("doc");
          leafNode.ele("docId").txt(doc.id);
        });
        docsXml = xmlDoc.end({
          headless: true,
          prettyPrint: true,
        });
        docsXml = docsXml.replace(/[\r\n]+/g, "").trim();

        let docsTypeList = docDetail.docTypeList;
        let xmlDocType = create().ele("docTypes");
        docsTypeList.forEach((docType: any) => {
          const leafNode = xmlDocType.ele("doctype");
          leafNode.ele("docId").txt(docType.doc_id);
        });
        docsTypeXml = xmlDocType.end({
          headless: true,
          prettyPrint: true,
        });
        docsTypeXml = docsTypeXml.replace(/[\r\n]+/g, "").trim();
      }

      let companyDb = await GetCompanyDb(loggedInUser.secret);

      let updatedMappingDetail: any = await companyDb.query(
        `EXEC ${constant.P_DocumentManagement} @action = @0, @docId = @1, 
        @docs = @2, @docTypes = @3, @userId = @4`,
        [
          docDetail.action,
          docDetail.docId,
          docsXml,
          docsTypeXml,
          docDetail.userId,
        ]
      );
      if (!updatedMappingDetail) {
        updatedMappingDetail = { message: "Record updated" };
      }
      return updatedMappingDetail;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: "master/documentManagement",
        error: `{"Error":"${
          error.name == "RequestError" ? error.name : error.message
        }", "Detail":${
          error.name == "RequestError"
            ? JSON.stringify(error.precedingErrors)
            : '"' + error.detail + '"'
        }}`,
        requestPayload: `${JSON.stringify(docDetail)}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == "RequestError"
          ? new CustomError("InternalServerError")
          : error;
      throw error;
    }
  }

  async branchMaster(loggedInUser: any, branchDetail: any): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let updateBranchDetail: any = await companyDb.query(
        `EXEC ${constant.Proc_BranchMaster} @action = @0,
         @branchId = @1, 
        @companyCode = @2,
        @code = @3,
        @name = @4,
        @incharge = @5, 
        @BranchType = @6, 
        @Camera_IP = @7, 
        @Camera_UserName = @8, 
        @Camera_Password = @9, 
        @ERP_CODE = @10, 
        @BH_EMAIL = @11, 
        @RH_EMAIL = @12, 
        @ZP_EMAIL = @13, 
        @CO_EMAIL = @14, 
        @ED_EMAIL = @15, 
        @Latitude = @16, 
        @Longitude = @17, 
        @Scheme = @18, 
        @IsRecruitmentBranch = @19, 
        @allow_noexp = @20, 
        @allow_notest = @21, 
        @unitCode = @22, 
        @isActive = @23, 
        @userId = @24`,
        [
          branchDetail.action,
          branchDetail.branchId ?? 0,
          branchDetail.companyCode,
          branchDetail.code ?? "",
          branchDetail.name,
          branchDetail.incharge,
          branchDetail.BranchType,
          branchDetail.Camera_IP ?? "",
          branchDetail.Camera_UserName ?? "",
          branchDetail.Camera_Password ?? "",
          branchDetail.ERP_CODE ?? "",
          branchDetail.BH_EMAIL,
          branchDetail.RH_EMAIL,
          branchDetail.ZP_EMAIL,
          branchDetail.CO_EMAIL,
          branchDetail.ED_EMAIL,
          branchDetail.Latitude,
          branchDetail.Longitude,
          branchDetail.Scheme,
          branchDetail.IsRecruitmentBranch,
          branchDetail.allow_noexp,
          branchDetail.allow_notest,
          branchDetail.UnitCode,
          branchDetail.isActive,
          branchDetail.userId,
        ]
      );
      if (!updateBranchDetail) {
        updateBranchDetail = { message: "Record updated" };
      }
      return updateBranchDetail;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: "master/branchMaster",
        error: `{"Error":"${
          error.name == "RequestError" ? error.name : error.message
        }", "Detail":${
          error.name == "RequestError"
            ? JSON.stringify(error.precedingErrors)
            : '"' + error.detail + '"'
        }}`,
        requestPayload: `${JSON.stringify(branchDetail)}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == "RequestError"
          ? new CustomError("InternalServerError")
          : error;
      throw error;
    }
  }

  async documentMaster(loggedInUser: any, docDetail: any): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      const resultSets = await getResultSets(
        companyDb,
        constant.P_DocumentMaster,
        {
          action: docDetail.action,
          ID: docDetail.ID,
          document_name: docDetail.document_name,
          doc_count: docDetail.doc_count,
          DocFor: docDetail.DocFor,
          CandType: docDetail.CandType,
          issuing_authority: docDetail.issuing_authority,
          valid_for: docDetail.valid_for,
          isActive: docDetail.isActive,
          userId: docDetail.userId,
        }
      );
      let res: any = { recordsets: resultSets };
      return res;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: "master/documentMaster",
        error: `{"Error":"${
          error.name == "RequestError" ? error.name : error.message
        }", "Detail":${
          error.name == "RequestError"
            ? JSON.stringify(error.precedingErrors)
            : '"' + error.detail + '"'
        }}`,
        requestPayload: `${JSON.stringify(docDetail)}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == "RequestError"
          ? new CustomError("InternalServerError")
          : error;
      throw error;
    }
  }

  async designationMaster(loggedInUser: any, desigDetail: any): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(clientSecret);
      let updatedDesigDetail: any = await companyDb.query(
        `EXEC ${constant.P_DesignationMaster} 
        @action = @0,
        @id = @1, 
        @code = @2,
        @branchCode = @3,
        @name = @4,
        @std_min_age = @5,
        @minAge = @6,
        @std_max_age = @7,
        @maxAge = @8,
        @std_edu = @9,
        @minEducation = @10,
        @std_exp = @11,
        @minExperience = @12,
        @std_ht = @13,
        @minHeight = @14,
        @std_chst = @15,
        @minChest = @16,
        @min_wt = @17,
        @exManMaxAge = @18,
        @isBranch = @19,
        @isTATC = @20,
        @isActive = @21,
        @userId = @22`,
        [
          desigDetail.action,
          desigDetail.id ?? 0,
          desigDetail.code,
          desigDetail.branchCode,
          desigDetail.name,
          desigDetail.std_min_age,
          desigDetail.minAge,
          desigDetail.std_max_age,
          desigDetail.maxAge,
          desigDetail.std_edu,
          desigDetail.minEducation,
          desigDetail.std_exp,
          desigDetail.minExperience,
          desigDetail.std_ht,
          desigDetail.minHeight,
          desigDetail.std_chst,
          desigDetail.minChest,
          desigDetail.min_wt,
          desigDetail.exManMaxAge,
          desigDetail.isBranch,
          desigDetail.isTATC,
          desigDetail.isActive,
          desigDetail.userId,
        ]
      );
      if (!updatedDesigDetail) {
        updatedDesigDetail = { message: "Record updated" };
      }
      return updatedDesigDetail;
    } catch (error: any) {
      // Logger.error({
      //   clientId: 'sis',
      //   src: 'master/designationMaster',
      //   error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
      //   requestPayload: `${JSON.stringify(desigDetail)}`,
      //   loggedBy: '',
      // });
      if (error.name != undefined && error.name == "QueryFailedError") {
        return {
          isError: true,
          errMsg: error.message,
        };
      } else {
        let customError: any = {
          isError: true,
          errMsg: error.message,
        };
        throw customError;
      }
    }
  }

  async addProspectus(loggedInUser: any, prospectusDetail: any): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(clientSecret);
      let updatedProspectusDetail: any = await companyDb.query(
        `EXEC ${constant.P_Add_prospectus} 
        @BRANCH = @0,
        @ProspectusNo = @1,
        @Date = @2,
        @CandidateName = @3,
        @MobileNo = @4,
        @DOB = @5,
        @BillNo = @6`,
        [
          prospectusDetail.Branch,
          prospectusDetail.ProspectusNo ?? 0,
          prospectusDetail.Date,
          prospectusDetail.CandidateName,
          prospectusDetail.MobileNo,
          prospectusDetail.DOB,
          prospectusDetail.BillNo,
        ]
      );
      if (!updatedProspectusDetail) {
        updatedProspectusDetail = { Result: "success" };
      }
      return updatedProspectusDetail;
    } catch (error: any) {
      // Logger.error({
      //   clientId: 'sis',
      //   src: 'master/addProspectus',
      //   error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
      //   requestPayload: `${JSON.stringify(prospectusDetail)}`,
      //   loggedBy: '',
      // });
      if (error.name != undefined && error.name == "QueryFailedError") {
        return {
          isError: true,
          errMsg: error.message,
        };
      } else {
        let customError: any = {
          isError: true,
          errMsg: error.message,
        };
        throw customError;
      }
    }
  }

  async addBatchForTATC(loggedInUser: any, batchDetail: any): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(clientSecret);
      let addedBatch: any = await companyDb.query(
        `EXEC ${constant.P_TA_TC_BatchMaster_update} 
        @coreServicecode = @0,
        @batchname = @1,
        @batchcode = @2, 
        @startdate = @3, 
        @enddate = @4, 
        @isactive = @5`,
        [
          batchDetail.coreServicecode ?? "",
          batchDetail.batchName ?? "",
          batchDetail.batchCode ?? "",
          batchDetail.startDate,
          batchDetail.endDate,
          batchDetail.isActive,
        ]
      );

      return { Result: "success" };
    } catch (error: any) {
      // Logger.error({
      //   clientId: 'sis',
      //   src: 'master/addBatchForTATC',
      //   error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
      //   requestPayload: `${JSON.stringify(batchDetail)}`,
      //   loggedBy: '',
      // });
      if (error.name != undefined && error.name == "QueryFailedError") {
        return {
          isError: true,
          errMsg: error.message,
        };
      } else {
        let customError: any = {
          isError: true,
          errMsg: error.message,
        };
        throw customError;
      }
    }
  }

  async addTrainingFeeForTATC(
    loggedInUser: any,
    trainingFeeDetail: any
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(clientSecret);
      let addedTrainingFee: any = await companyDb.query(
        `EXEC ${constant.P_TrainingFeeMaster_update} 
        @feeid = @0,
        @corebranchid = @1,
        @coreservicecode = @2, 
        @category = @3, 
        @description = @4,  
        @isactive = @5`,
        [
          trainingFeeDetail.feeId ?? "",
          trainingFeeDetail.coreBranchId ?? "",
          trainingFeeDetail.coreServiceCode ?? "",
          trainingFeeDetail.category ?? "",
          trainingFeeDetail.description ?? "",
          trainingFeeDetail.isActive ?? "",
        ]
      );
      return { Result: "success" };
    } catch (error: any) {
      // Logger.error({
      //   clientId: 'sis',
      //   src: 'master/addTrainingFeeForTATC',
      //   error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
      //   requestPayload: `${JSON.stringify(trainingFeeDetail)}`,
      //   loggedBy: '',
      // });
      if (error.name != undefined && error.name == "QueryFailedError") {
        return {
          isError: true,
          errMsg: error.message,
        };
      } else {
        let customError: any = {
          isError: true,
          errMsg: error.message,
        };
        throw customError;
      }
    }
  }

  async addBankMaster(loggedInUser: any, bankDetail: any): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(clientSecret);
      let addedBank: any = await companyDb.query(
        `EXEC ${constant.P_BankIFSCMaster_update} 
        @BANK_NAME = @0,
        @BANK_BRANCH = @1,
        @BANK_IFSC = @2, 
        @BANK_MICR_CODE = @3, 
        @BRANCH_CONTACT_NO = @4, 
        @BRANCH_ADDRESS = @5, 
        @BRANCH_CITY = @6, 
        @BRANCH_DISTRICT = @7, 
        @BRANCH_STATE = @8, 
        @IS_ACTIVE = @9`,
        [
          bankDetail.BANK_NAME ?? "",
          bankDetail.BANK_BRANCH ?? "",
          bankDetail.BANK_IFSC ?? "",
          bankDetail.BANK_MICR_CODE,
          bankDetail.BRANCH_CONTACT_NO,
          bankDetail.BRANCH_ADDRESS,
          bankDetail.BRANCH_CITY,
          bankDetail.BRANCH_DISTRICT,
          bankDetail.BRANCH_STATE,
          bankDetail.IS_ACTIVE,
        ]
      );

      return { Result: "success" };
    } catch (error: any) {
      // Logger.error({
      //   clientId: 'sis',
      //   src: 'master/addBankMaster',
      //   error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
      //   requestPayload: `${JSON.stringify(bankDetail)}`,
      //   loggedBy: '',
      // });
      if (error.name != undefined && error.name == "QueryFailedError") {
        return {
          isError: true,
          errMsg: error.message,
        };
      } else {
        let customError: any = {
          isError: true,
          errMsg: error.message,
        };
        throw customError;
      }
    }
  }

  async addDesignationMaster(
    loggedInUser: any,
    desigDetail: any
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(clientSecret);
      let addedDesig: any = await companyDb.query(
        `EXEC ${constant.P_DesignationMaster_update} 
        @CORE_CODE = @0,
        @SERVICE_CODE = @1,
        @SERVICE_NAME = @2, 
        @FOR_BRANCH = @3, 
        @FOR_TATC = @4, 
        @IS_ACTIVE = @5, 
        @IS_BH_APPROVAL_REQUIRED = @6, 
        @IS_RH_APPROVAL_REQUIRED = @7, 
        @IS_HR_APPROVAL_REQUIRED = @8`,
        [
          desigDetail.CORE_CODE ?? "",
          desigDetail.SERVICE_CODE ?? "",
          desigDetail.SERVICE_NAME ?? "",
          desigDetail.FOR_BRANCH,
          desigDetail.FOR_TATC,
          desigDetail.IS_ACTIVE,
          desigDetail.IS_BH_APPROVAL_REQUIRED,
          desigDetail.IS_RH_APPROVAL_REQUIRED,
          desigDetail.IS_HR_APPROVAL_REQUIRED,
        ]
      );

      return { Result: "success" };
    } catch (error: any) {
      // Logger.error({
      //   clientId: 'sis',
      //   src: 'master/addDesignationMaster',
      //   error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
      //   requestPayload: `${JSON.stringify(desigDetail)}`,
      //   loggedBy: '',
      // });
      if (error.name != undefined && error.name == "QueryFailedError") {
        return {
          isError: true,
          errMsg: error.message,
        };
      } else {
        let customError: any = {
          isError: true,
          errMsg: error.message,
        };
        throw customError;
      }
    }
  }

  async addDistrictMaster(
    loggedInUser: any,
    districtDetail: any
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(clientSecret);
      let addedDistrict: any = await companyDb.query(
        `EXEC ${constant.P_DistrictMaster_update} 
        @CORE_CODE = @0,
        @CORE_STATE_ID = @1,
        @DISTRICT_CODE = @2, 
        @DISTRICT_NAME = @3`,
        [
          districtDetail.CORE_CODE ?? "",
          districtDetail.CORE_STATE_ID ?? "",
          districtDetail.DISTRICT_CODE ?? "",
          districtDetail.DISTRICT_NAME ?? "",
        ]
      );
      return { Result: "success" };
    } catch (error: any) {
      // Logger.error({
      //   clientId: 'sis',
      //   src: 'master/addDistrictMaster',
      //   error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
      //   requestPayload: `${JSON.stringify(districtDetail)}`,
      //   loggedBy: '',
      // });
      if (error.name != undefined && error.name == "QueryFailedError") {
        return {
          isError: true,
          errMsg: error.message,
        };
      } else {
        let customError: any = {
          isError: true,
          errMsg: error.message,
        };
        throw customError;
      }
    }
  }

  async addStateMaster(loggedInUser: any, stateDetail: any): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(clientSecret);
      let addedState: any = await companyDb.query(
        `EXEC ${constant.P_StateMaster_update} 
        @CORE_CODE = @0,
        @STATE_CODE = @1,
        @STATE_NAME = @2`,
        [
          stateDetail.CORE_CODE ?? "",
          stateDetail.STATE_CODE ?? "",
          stateDetail.STATE_NAME ?? "",
        ]
      );
      return { Result: "success" };
    } catch (error: any) {
      // Logger.error({
      //   clientId: 'sis',
      //   src: 'master/addStateMaster',
      //   error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
      //   requestPayload: `${JSON.stringify(stateDetail)}`,
      //   loggedBy: '',
      // });
      if (error.name != undefined && error.name == "QueryFailedError") {
        return {
          isError: true,
          errMsg: error.message,
        };
      } else {
        let customError: any = {
          isError: true,
          errMsg: error.message,
        };
        throw customError;
      }
    }
  }

  async addCityMaster(loggedInUser: any, cityDetail: any): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(clientSecret);
      let addedCity: any = await companyDb.query(
        `EXEC ${constant.P_CityMaster_update} 
        @CORE_CODE = @0,
        @CITY_CODE = @1,
        @CITY_NAME = @2,
        @CORE_STATE_ID = @3,
        @PINCODE_START = @4,
        @PINCODE_END = @5`,
        [
          cityDetail.CORE_CODE ?? "",
          cityDetail.CITY_CODE ?? "",
          cityDetail.CITY_NAME ?? "",
          cityDetail.CORE_STATE_ID ?? "",
          cityDetail.PINCODE_START ?? "",
          cityDetail.PINCODE_END ?? "",
        ]
      );
      return { Result: "success" };
    } catch (error: any) {
      // Logger.error({
      //   clientId: 'sis',
      //   src: 'master/addCityMaster',
      //   error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
      //   requestPayload: `${JSON.stringify(cityDetail)}`,
      //   loggedBy: '',
      // });
      if (error.name != undefined && error.name == "QueryFailedError") {
        return {
          isError: true,
          errMsg: error.message,
        };
      } else {
        let customError: any = {
          isError: true,
          errMsg: error.message,
        };
        throw customError;
      }
    }
  }

  async addBranchMaster(loggedInUser: any, branchDetail: any): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(clientSecret);
      let addedBranch: any = await companyDb.query(
        `EXEC ${constant.P_BranchMaster_update} 
        @CORE_CODE = @0,
        @BRANCH_CODE = @1,
        @BRANCH_NAME = @2,
        @INCHARGE_NAME = @3,
        @BRANCH_TYPE = @4,
        @RECRUITMENT_ENABLE = @5,
        @BH_EMAIL = @6,
        @RH_EMAIL = @7,
        @ZP_EMAIL = @8,
        @CO_EMAIL = @9,
        @ED_EMAIL = @10`,
        [
          branchDetail.CORE_CODE ?? 0,
          branchDetail.BRANCH_CODE ?? "",
          branchDetail.BRANCH_NAME ?? "",
          branchDetail.INCHARGE_NAME ?? "",
          branchDetail.BRANCH_TYPE ?? "",
          branchDetail.RECRUITMENT_ENABLE ?? 0,
          branchDetail.BH_EMAIL ?? "",
          branchDetail.RH_EMAIL ?? "",
          branchDetail.ZP_EMAIL ?? "",
          branchDetail.CO_EMAIL ?? "",
          branchDetail.ED_EMAIL ?? "",
        ]
      );

      return { Result: "success" };
    } catch (error: any) {
      // Logger.error({
      //   clientId: 'sis',
      //   src: 'master/addBranchMaster',
      //   error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
      //   requestPayload: `${JSON.stringify(branchDetail)}`,
      //   loggedBy: '',
      // });
      if (error.name != undefined && error.name == "QueryFailedError") {
        return {
          isError: true,
          errMsg: error.message,
        };
      } else {
        let customError: any = {
          isError: true,
          errMsg: error.message,
        };
        throw customError;
      }
    }
  }

  async addUnitMaster(loggedInUser: any, unitDetail: any): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(clientSecret);
      let addedUnit: any = await companyDb.query(
        `EXEC ${constant.P_UnitMaster_update} 
        @CORE_CODE = @0,
        @UNIT_CODE = @1,
        @UNIT_NAME = @2,
        @BRANCH_CODE = @3,
        @ISACTIVE = @4,
        @ContractNo = @5,
        @AI_RegNo = @6`,
        [
          unitDetail.CORE_CODE ?? 0,
          unitDetail.UNIT_CODE ?? "",
          unitDetail.UNIT_NAME ?? "",
          unitDetail.BRANCH_CODE ?? "",
          unitDetail.ISACTIVE ?? 1,
          unitDetail.ContractNo ?? "",
          unitDetail.AI_RegNo ?? "",
        ]
      );

      return { Result: "success" };
    } catch (error: any) {
      // Logger.error({
      //   clientId: 'sis',
      //   src: 'master/addUnitMaster',
      //   error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
      //   requestPayload: `${JSON.stringify(unitDetail)}`,
      //   loggedBy: '',
      // });
      if (error.name != undefined && error.name == "QueryFailedError") {
        return {
          isError: true,
          errMsg: error.message,
        };
      } else {
        let customError: any = {
          isError: true,
          errMsg: error.message,
        };
        throw customError;
      }
    }
  }

  async addPincodeMaster(loggedInUser: any, pincodeDetail: any): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(clientSecret);
      let addedPincode: any = await companyDb.query(
        `EXEC ${constant.P_PincodeMaster_update} 
        @PkPincode = @0,
        @Pincode = @1,
        @FkCity = @2,
        @FkState = @3,
        @FkDistrict = @4,
        @FkCountry = @5,
        @IsActive = @6,
        @IsDeleted = @7`,
        [
          pincodeDetail.PkPincode ?? 0,
          pincodeDetail.Pincode ?? 0,
          pincodeDetail.FkCity ?? 0,
          pincodeDetail.FkState ?? 0,
          pincodeDetail.FkDistrict ?? 0,
          pincodeDetail.FkCountry ?? 0,
          pincodeDetail.IsActive ?? true,
          pincodeDetail.IsDeleted ?? false,
        ]
      );

      return { Result: "success" };
    } catch (error: any) {
      // Logger.error({
      //   clientId: 'sis',
      //   src: 'master/addPincodeMaster',
      //   error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
      //   requestPayload: `${JSON.stringify(pincodeDetail)}`,
      //   loggedBy: '',
      // });
      if (error.name != undefined && error.name == "QueryFailedError") {
        return {
          isError: true,
          errMsg: error.message,
        };
      } else {
        let customError: any = {
          isError: true,
          errMsg: error.message,
        };
        throw customError;
      }
    }
  }

  async getProspectusStatus(
    loggedInUser: any,
    ProspectusNo: any
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(clientSecret);
      let prospectusDetail: any = await companyDb.query(
        `EXEC ${constant.P_Prospectus_Status} 
        @Prospectus = @0`,
        [ProspectusNo ?? ""]
      );

      return prospectusDetail;
    } catch (error: any) {
      // Logger.error({
      //   clientId: 'sis',
      //   src: 'master/getProspectusStatus',
      //   error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
      //   requestPayload: `prospectusNo: ${ProspectusNo}`,
      //   loggedBy: '',
      // });
      if (error.name != undefined && error.name == "QueryFailedError") {
        return {
          isError: true,
          errMsg: error.message,
        };
      } else {
        let customError: any = {
          isError: true,
          errMsg: error.message,
        };
        throw customError;
      }
    }
  }

  async getVendorBranchList(userName: string, password: string): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(clientSecret);
      let vendorBranches: any = await companyDb.query(
        `EXEC ${constant.P_VendorActivity} 
        @action = @0, @username = @1, @password = @2`,
        ["branchList", userName ?? "", password ?? ""]
      );

      return vendorBranches;
    } catch (error: any) {
      if (error.name != undefined && error.name == "QueryFailedError") {
        return {
          isError: true,
          errMsg: error.message,
        };
      } else {
        let customError: any = {
          isError: true,
          errMsg: error.message,
        };
        throw customError;
      }
    }
  }

  async getTempDevicePassword(
    userName: string,
    password: string,
    deviceId: string
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(clientSecret);
      let deviceDetail: any = await companyDb.query(
        `EXEC ${constant.P_VendorActivity} 
        @action = @0, @username = @1, @password = @2, @deviceID = @3`,
        ["TempPassword", userName ?? "", password ?? "", deviceId ?? ""]
      );

      return deviceDetail;
    } catch (error: any) {
      if (error.name != undefined && error.name == "QueryFailedError") {
        return {
          isError: true,
          errMsg: error.message,
        };
      } else {
        let customError: any = {
          isError: true,
          errMsg: error.message,
        };
        throw customError;
      }
    }
  }

  async getDevicePasswordReset(
    userName: string,
    password: string,
    deviceId: string
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(clientSecret);
      let deviceDetail: any = await companyDb.query(
        `EXEC ${constant.P_VendorActivity} 
        @action = @0, @username = @1, @password = @2, @deviceID = @3`,
        ["ResetPassword", userName ?? "", password ?? "", deviceId ?? ""]
      );

      return deviceDetail;
    } catch (error: any) {
      if (error.name != undefined && error.name == "QueryFailedError") {
        return {
          isError: true,
          errMsg: error.message,
        };
      } else {
        let customError: any = {
          isError: true,
          errMsg: error.message,
        };
        throw customError;
      }
    }
  }

  async getUpdateMachineId(
    userName: string,
    password: string,
    branchCode: string,
    deviceId: string
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(clientSecret);
      let deviceDetail: any = await companyDb.query(
        `EXEC ${constant.P_VendorActivity} 
        @action = @0, @username = @1, @password = @2, @branchCode = @3, @deviceID = @4`,
        [
          "UpdateMachineID",
          userName ?? "",
          password ?? "",
          branchCode ?? "",
          deviceId ?? "",
        ]
      );

      return deviceDetail;
    } catch (error: any) {
      if (error.name != undefined && error.name == "QueryFailedError") {
        return {
          isError: true,
          errMsg: error.message,
        };
      } else {
        let customError: any = {
          isError: true,
          errMsg: error.message,
        };
        throw customError;
      }
    }
  }

  async updateMeasurement(measurementDetail: any): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(clientSecret);
      let machineLog: any = await companyDb.query(
        `EXEC ${constant.P_MachineLog} 
        @action = @0, @DeviceId = @1`,
        [measurementDetail.action ?? "", measurementDetail.deviceId ?? ""]
      );

      let updatedDetail: any = await companyDb.query(
        `EXEC ${constant.P_UpdateBmiDataFromMachine} 
        @action = @0, @deviceID = @1, @prospectus_no = @2, @occurTime = @3, @timestamp = @4, @height = @5, @weight = @6, @bmi = @7, @macAdd = @8`,
        [
          measurementDetail.action ?? "",
          measurementDetail.deviceId ?? "",
          measurementDetail.uid ?? "",
          measurementDetail.occurTime ?? "",
          measurementDetail.timestamp ?? "",
          measurementDetail.height ?? 0,
          measurementDetail.weight ?? 0,
          measurementDetail.bmi ?? 0,
          measurementDetail.macAdd ?? "",
        ]
      );

      //console.log('BMI data Saved');
      return { retCode: "1", msg: "success", control: "-2" };
    } catch (error: any) {
      if (error.name != undefined && error.name == "QueryFailedError") {
        // return {
        //   isError: true,
        //   errMsg: error.message,
        // };
        return { retCode: "0", msg: "failed", control: "1" };
      } else {
        let customError: any = {
          isError: true,
          errMsg: error.message,
        };
        throw customError;
      }
    }
  }

  async getRemotePassword(deviceId: string): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(clientSecret);
      console.log(`Step 1 :- Log device action`);
      try {
        let machineLog: any = await companyDb.query(
          `EXEC ${constant.P_MachineLog} 
          @action = @0, @DeviceId = @1`,
          ["GetRemotePassword", deviceId ?? ""]
        );
      } catch (machineLogError: any) {
        console.error("Error logging device action:", machineLogError);
      }
      console.log(`Step 2 :- Fetch password`);
      let machinePwdResult: any = {};
      try {
        let machinePwd: any = await companyDb.query(
          `EXEC ${constant.P_MachinePwd} 
          @DeviceID = @0`,
          [deviceId ?? ""]
        );
        if (machinePwd && machinePwd.length > 0) {
          machinePwdResult = {
            recode: "2000",
            remsg: machinePwd[0].DevicePwd,
            data: { password: machinePwd[0].DevicePwdMd5 },
          };
        } else {
          machinePwdResult = {
            recode: "2000",
            remsg: "123456",
            data: { password: "e10adc3949ba59abbe56e057f20f883e" },
          };
        }
      } catch (machinePwdError: any) {
        console.error("Error fetching device password:", machinePwdError);
        return {
          reCode: "500",
          remsg: "Error fetching password",
          data: { password: "" },
        };
      }
      console.log(`Step 3 :- Reset password (non-blocking)`);
      try {
        let machinePwdReset: any = await companyDb.query(
          `EXEC ${constant.P_MachinePwdReset} 
          @DeviceID = @0`,
          [deviceId ?? ""]
        );
      } catch (machinePwdResetError: any) {
        console.error("Password reset failed:", machinePwdResetError);
      }

      console.log(`Step 4 :- Final success response`);
      return machinePwdResult;
    } catch (error: any) {
      console.error("Unexpected server error:", error);
      if (error.name != undefined && error.name == "QueryFailedError") {
        return {
          isError: true,
          errMsg: error.message,
        };
      } else {
        let customError: any = {
          isError: true,
          errMsg: error.message,
        };
        throw customError;
      }
    }
  }

  async dbUser(requestDetail: any): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(clientSecret);
      console.log(`Step 1 :- Log device action`);
      try {
        let machineLog: any = await companyDb.query(
          `EXEC ${constant.P_MachineLog} 
          @action = @0, @DeviceId = @1`,
          [requestDetail.action ?? "", requestDetail.deviceID ?? ""]
        );
      } catch (machineLogError: any) {
        console.error("Error logging device action:", machineLogError);
      }
      if (requestDetail.action == "doCheckDB") {
        return {
          retCode: "1",
          dbinfo: {
            loc: "1",
            dbUrl: "https://ark.sisersys.com:8444/U20240829091420.db",
          },
          msg: "success",
        };
      } else {
        var xid = requestDetail.xid;
        if (xid == "9000") {
          return { retCode: "0", uinfo: {}, dbinfo: {}, msg: "no data found" };
        } else {
          let userData: any = await companyDb.query(
            `EXEC ${constant.P_UserDataMeasurement} 
            @id = @0`,
            [xid ?? ""]
          );
          if (userData && userData.length > 0) {
            let uinfo: any = userData[0];
            let output: any = {
              retCode: "1",
              uinfo: {
                title: uinfo.title || "",
                cardID: uinfo.cardID,
                userNum: uinfo.userNum,
                name: uinfo.name,
                sex: uinfo.sex,
                age: uinfo.age,
                headimgurl: uinfo.headimgurl,
                imgBaseData: uinfo.imgBaseData,
                remark: "User Data",
              },
              dbinfo: {},
              msg: "success",
            };
            return output;
          } else {
            return {
              retCode: "0",
              uinfo: {},
              dbinfo: {},
              msg: "no data found",
            };
          }
        }
      }
    } catch (error: any) {
      console.error("Unexpected server error:", error);
      if (error.name != undefined && error.name == "QueryFailedError") {
        return {
          isError: true,
          errMsg: error.message,
        };
      } else {
        let customError: any = {
          isError: true,
          errMsg: error.message,
        };
        throw customError;
      }
    }
  }

  async schemeMaster(loggedInUser: any, schemeDetail: any): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let criteriaXml: string = "";
      let QRXml: string = "";
      let mappedUnitXml: string = "";
      if (
        (schemeDetail.action == "insert" || schemeDetail.action == "update") &&
        schemeDetail.QRMatrix.length > 0
      ) {
        let criteria: any = schemeDetail.rankCriteria;
        let xmlCrt: any = create().ele("crt");
        for (var i = 0; i <= criteria.length - 1; i++) {
          const leafNode = xmlCrt.ele("cr");
          leafNode.ele("schemeCode").txt(schemeDetail.scheme_code);
          leafNode.ele("rank").txt(criteria[i].rank);
          leafNode.ele("minV").txt(criteria[i].minValue);
          leafNode.ele("maxV").txt(criteria[i].maxValue);
        }
        criteriaXml = xmlCrt.end({
          headless: true,
          prettyPrint: true,
        });
        criteriaXml = criteriaXml.replace(/[\r\n]+/g, "").trim();

        //------------------------------QR metrix
        let qrmtrx: any = schemeDetail.QRMatrix;
        let xmlQR: any = create().ele("QRMtr");
        for (var i = 0; i <= qrmtrx.length - 1; i++) {
          const leafNode = xmlQR.ele("qr");
          leafNode.ele("schemeCode").txt(schemeDetail.scheme_code);
          leafNode.ele("orderNo").txt(qrmtrx[i].orderNo);
          leafNode.ele("criteria").txt(qrmtrx[i].criteria);
          leafNode.ele("minThresoldlimit").txt(qrmtrx[i].minThresoldlimit);
          leafNode.ele("maxThresoldlimit").txt(qrmtrx[i].maxThresoldlimit);
          leafNode.ele("stdMinValue").txt(qrmtrx[i].stdMinValue);
          leafNode.ele("stdMaxValue").txt(qrmtrx[i].stdMaxValue);
          leafNode.ele("scoreVariable").txt(qrmtrx[i].scoreVariable);
          leafNode.ele("score").txt(qrmtrx[i].score);
          leafNode.ele("maxScore").txt(qrmtrx[i].maxScore);
          leafNode.ele("weightage").txt(qrmtrx[i].weightage);
        }
        QRXml = xmlQR.end({
          headless: true,
          prettyPrint: true,
        });
        QRXml = QRXml.replace(/[\r\n]+/g, "").trim();

        //------------------------------Mapped Unit
        let mappedUnit: any = schemeDetail.mappedUnit;
        let xmlmappedUnit: any = create().ele("units");
        for (var i = 0; i <= mappedUnit.length - 1; i++) {
          const leafNode = xmlmappedUnit.ele("unit");
          leafNode.ele("schemeCode").txt(schemeDetail.scheme_code);
          leafNode.ele("locationCode").txt(mappedUnit[i].locationCode);
          leafNode.ele("isCompany").txt(mappedUnit[i].isCompany);
          leafNode.ele("isZone").txt(mappedUnit[i].isZone);
          leafNode.ele("isRegion").txt(mappedUnit[i].isRegion);
          leafNode.ele("isBranch").txt(mappedUnit[i].isBranch);
          leafNode.ele("isUnit").txt(mappedUnit[i].isUnit);
          leafNode.ele("companyCode").txt(mappedUnit[i].companyCode);
          leafNode.ele("zoneCode").txt(mappedUnit[i].zoneCode);
          leafNode.ele("regionCode").txt(mappedUnit[i].regionCode);
          leafNode.ele("branchCode").txt(mappedUnit[i].branchCode);
          leafNode.ele("unitCode").txt(mappedUnit[i].unitCode);
        }
        mappedUnitXml = xmlmappedUnit.end({
          headless: true,
          prettyPrint: true,
        });
        mappedUnitXml = mappedUnitXml.replace(/[\r\n]+/g, "").trim();
      }
      const resultSets = await getResultSets(
        companyDb,
        constant.P_SchemeMaster,
        {
          action: schemeDetail.action,
          id: schemeDetail.id,
          scheme_code: schemeDetail.scheme_code,
          scheme_name: schemeDetail.scheme_name,
          desig_code: schemeDetail.desig_code,
          start_date: schemeDetail.startDate,
          end_date: schemeDetail.endDate,
          ageExempted: schemeDetail.ageRequired,
          expExempted: schemeDetail.expRequired,
          eduExempted: schemeDetail.eduRequired,
          htExempted: schemeDetail.htRequired,
          wtExempted: schemeDetail.wtRequired,
          chestExempted: schemeDetail.chestRequired,
          machineExempted: schemeDetail.machineRequired,
          assessmentExempted: schemeDetail.assessmentRequired,
          condonationExempted: schemeDetail.condonationRequired,
          rankCriteria: schemeDetail.criteriaXml,
          QRMatrix: schemeDetail.QRXml,
          unitDetails: schemeDetail.mappedUnitXml,
          userId: schemeDetail.userId,
          isActive: schemeDetail.is_Active == true ? 1 : 0,
          companyCode: schemeDetail.companyCode,
          zoneCode: schemeDetail.zoneCode,
          regionCode: schemeDetail.regionCode,
          branchCode: schemeDetail.branchCode,
        }
      );
      let res: any = resultSets;
      return res;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: "master/schemeMaster",
        error: `{"Error":"${
          error.name == "RequestError" ? error.name : error.message
        }", "Detail":${
          error.name == "RequestError"
            ? JSON.stringify(error.precedingErrors)
            : '"' + error.detail + '"'
        }}`,
        requestPayload: `${JSON.stringify(schemeDetail)}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == "RequestError"
          ? new CustomError("InternalServerError")
          : error;
      throw error;
    }
  }

  async addTempDeployment(
    loggedInUser: any,
    deploymentDetail: any
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let addedDeploymentDetail: any = await companyDb.query(
        `EXEC ${constant.P_TempDeployment} @action = @0,
         @id = @1, 
        @regionCode = @2,
        @branchCode = @3,
        @unitCode = @4,
        @requestType = @5, 
        @startDate = @6, 
        @validUpto = @7, 
        @strength = @8, 
        @status = @9, 
        @remark = @10, 
        @userId = @11`,
        [
          "insert",
          deploymentDetail.id ?? 0,
          deploymentDetail.regionCode ?? "",
          deploymentDetail.branchCode ?? "",
          deploymentDetail.unitCode ?? "",
          deploymentDetail.requestType ?? "",
          deploymentDetail.startDate ?? "",
          deploymentDetail.validUpto ?? "",
          deploymentDetail.strength ?? 0,
          deploymentDetail.status ?? "Pending",
          deploymentDetail.remark ?? "",
          deploymentDetail.userId ?? "",
        ]
      );
      return { status: "Record added" };
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: "master/addTempDeployment",
        error: `{"Error":"${
          error.name == "RequestError" ? error.name : error.message
        }", "Detail":${
          error.name == "RequestError"
            ? JSON.stringify(error.precedingErrors)
            : '"' + error.detail + '"'
        }}`,
        requestPayload: `${JSON.stringify(deploymentDetail)}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == "RequestError"
          ? new CustomError("InternalServerError")
          : error;
      throw error;
    }
  }

  async updateTempDeployment(
    loggedInUser: any,
    deploymentDetail: any
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let updatedDeploymentDetail: any = await companyDb.query(
        `EXEC ${constant.P_TempDeployment} @action = @0,
         @id = @1, 
        @regionCode = @2,
        @branchCode = @3,
        @unitCode = @4,
        @requestType = @5, 
        @startDate = @6, 
        @validUpto = @7, 
        @strength = @8, 
        @status = @9, 
        @remark = @10, 
        @userId = @11`,
        [
          "update",
          deploymentDetail.id ?? 0,
          deploymentDetail.regionCode ?? "",
          deploymentDetail.branchCode ?? "",
          deploymentDetail.unitCode ?? "",
          deploymentDetail.requestType ?? "",
          deploymentDetail.startDate ?? "",
          deploymentDetail.validUpto ?? "",
          deploymentDetail.strength ?? 0,
          deploymentDetail.status ?? "Pending",
          deploymentDetail.remark ?? "",
          deploymentDetail.userId ?? "",
        ]
      );
      return { status: "Record updated" };
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: "master/updateTempDeployment",
        error: `{"Error":"${
          error.name == "RequestError" ? error.name : error.message
        }", "Detail":${
          error.name == "RequestError"
            ? JSON.stringify(error.precedingErrors)
            : '"' + error.detail + '"'
        }}`,
        requestPayload: `${JSON.stringify(deploymentDetail)}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == "RequestError"
          ? new CustomError("InternalServerError")
          : error;
      throw error;
    }
  }

  async getEmployeeDetails(loggedInUser: any, regNo: string): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      const resultSets = await getResultSets(
        companyDb,
        constant.P_Employee_History,
        {
          RegNo: regNo,
        }
      );
      let res: any = { recordsets: resultSets };
      return res;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: "master/getEmployeeDetails",
        error: `{"Error":"${
          error.name == "RequestError" ? error.name : error.message
        }", "Detail":${
          error.name == "RequestError"
            ? JSON.stringify(error.precedingErrors)
            : '"' + error.detail + '"'
        }}`,
        requestPayload: `regNo : ${regNo}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == "RequestError"
          ? new CustomError("InternalServerError")
          : error;
      throw error;
    }
  }

  async employeeDetail(loggedInUser: any, regNo: string): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      const resultSets = await getResultSets(
        companyDb,
        constant.P_GetEmployeeDetail,
        {
          RegNo: regNo,
        }
      );
      let empDetails: any = {};
      empDetails.basicDetails = resultSets[0];
      empDetails.educationDetails = resultSets[1];
      empDetails.familyDetails = resultSets[2];
      empDetails.bankDetails = resultSets[3];
      let res: any = empDetails;
      return res;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: "master/employeeDetail",
        error: `{"Error":"${
          error.name == "RequestError" ? error.name : error.message
        }", "Detail":${
          error.name == "RequestError"
            ? JSON.stringify(error.precedingErrors)
            : '"' + error.detail + '"'
        }}`,
        requestPayload: `regNo : ${regNo}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == "RequestError"
          ? new CustomError("InternalServerError")
          : error;
      throw error;
    }
  }

  async getTempDeployment(
    loggedInUser: any,
    action: string,
    userId: string
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let resultSet: any = await companyDb.query(
        `EXEC ${constant.P_TempDeployment} @action = @0, @userId = @1, 
        @id = @2`,
        [action, userId, 0]
      );
      let res: any = resultSet[0];
      return res;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: "master/getTempDeployment",
        error: `{"Error":"${
          error.name == "RequestError" ? error.name : error.message
        }", "Detail":${
          error.name == "RequestError"
            ? JSON.stringify(error.precedingErrors)
            : '"' + error.detail + '"'
        }}`,
        requestPayload: `action : ${action},userId:${userId}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == "RequestError"
          ? new CustomError("InternalServerError")
          : error;
      throw error;
    }
  }

  async updateTempDeploymentStatus(
    loggedInUser: any,
    statusDetail: any
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let resultSet: any = await companyDb.query(
        `EXEC ${constant.P_TempDeployment} @action = @0, @id = @1, @status = @2, @remark = @3, @userId = @4`,
        [
          "statusupdate",
          statusDetail.id,
          statusDetail.status,
          statusDetail.remark,
          statusDetail.userId,
        ]
      );
      let res: any = { status: "success" };
      return res;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: "master/getTempDeployment",
        error: `{"Error":"${
          error.name == "RequestError" ? error.name : error.message
        }", "Detail":${
          error.name == "RequestError"
            ? JSON.stringify(error.precedingErrors)
            : '"' + error.detail + '"'
        }}`,
        requestPayload: `action : 'statusupdate',id:${statusDetail.id},status:${statusDetail.status},remark:${statusDetail.remark},userId:${statusDetail.userId}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == "RequestError"
          ? new CustomError("InternalServerError")
          : error;
      throw error;
    }
  }
}
