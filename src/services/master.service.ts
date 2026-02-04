import * as sql from 'mssql';
import { GetCompanyDb, getResultSets } from '../_dbs/mssql/sqlConnection';
import { DataSource, ILike, Like, In, Not, Raw } from 'typeorm';
import { create } from 'xmlbuilder2';
import bcrypt from 'bcrypt';
import constant from '../_dbs/mssql/constant';
import { plainToClass } from 'class-transformer';
import { JWT } from '../helpers/jwt';
import { Encrypt } from '../helpers/encrypt';
import { CustomError } from '../helpers/customError';
import ErrorMessage from '../_configs/errors/customError.json';
import appConfig from '../_configs/app/appConfig.json';
import dotenv from 'dotenv';
import Logger from '../utils/logger';
import moment from 'moment';
const jwt = new JWT();
dotenv.config();
const {
  db_host,
  db_port,
  db_name,
  db_user,
  db_password,
  refreshTokenExpireTime,
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
        ],
      );
      if (!updatedUserDetail) {
        updatedUserDetail = { message: 'Record updated' };
      }
      return updatedUserDetail;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'master/userDetail',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `${JSON.stringify(userDetail)}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
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
        ],
      );
      if (!updateRoleDetail) {
        updateRoleDetail = { message: 'Record updated' };
      }
      return updateRoleDetail;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'master/roleDetail',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `${JSON.stringify(roleDetail)}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async userBranchMapping(loggedInUser: any, mappingDetail: any): Promise<any> {
    try {
      let userList = mappingDetail.userDetails;
      let branchList = mappingDetail.branchDetails;
      let userXmlString = '';
      let branchXmlString = '';
      let companyDb = await GetCompanyDb(loggedInUser.secret);

      let userXmlDoc = create().ele('userlist');
      userList.forEach((user) => {
        const leafNode = userXmlDoc.ele('user');
        leafNode.ele('RegNo').txt(user.RegNo);
      });
      userXmlString = userXmlDoc.end({
        headless: true,
        prettyPrint: true,
      });
      userXmlString = userXmlString.replace(/[\r\n]+/g, '').trim();

      let branchXmlDoc = create().ele('bnchlist');
      userList.forEach((brnch) => {
        const leafNode = branchXmlDoc.ele('bnch');
        leafNode.ele('code').txt(brnch.code);
      });
      branchXmlString = branchXmlDoc.end({
        headless: true,
        prettyPrint: true,
      });
      branchXmlString = branchXmlString.replace(/[\r\n]+/g, '').trim();

      let updateUserDetail: any = await companyDb.query(
        `EXEC ${constant.P_UserBranchPermission} @action = @0, @compCode = @1, 
        @userXml = @2, @branchXml = @3, @userId = @4`,
        [
          mappingDetail.action,
          mappingDetail.compCode,
          userXmlString,
          branchXmlString,
          mappingDetail.userId,
        ],
      );
      return { status: 'success' };
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'master/userBranchMapping',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `${JSON.stringify(mappingDetail)}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async documentMapping(loggedInUser: any, mappingDetail: any): Promise<any> {
    try {
      let docList = mappingDetail.documentDetails;
      let docTypeList = mappingDetail.docTypeDetails;
      let docXmlString = '';
      let docTypeXmlString = '';
      let xmlDoc = create().ele('docs');
      docList.forEach((doc) => {
        const leafNode = xmlDoc.ele('id');
        leafNode.ele('docId').txt(doc.docId);
      });
      docXmlString = xmlDoc.end({
        headless: true,
        prettyPrint: true,
      });
      docXmlString = docXmlString.replace(/[\r\n]+/g, '').trim();

      let xmlDocType = create().ele('docType');
      docList.forEach((docType) => {
        const leafNode = xmlDocType.ele('id');
        leafNode.ele('validFor').txt(docType.validFor);
      });
      docTypeXmlString = xmlDocType.end({
        headless: true,
        prettyPrint: true,
      });
      docTypeXmlString = docTypeXmlString.replace(/[\r\n]+/g, '').trim();

      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let updatedMappingDetail: any = await companyDb.query(
        `EXEC ${constant.P_UserBranchPermission} @action = @0, @documentXml = @1, 
        @documentTypeXml = @2`,
        [mappingDetail.action, docXmlString, docTypeXmlString],
      );
      return { status: 'success' };
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'master/documentMapping',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `${JSON.stringify(mappingDetail)}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async documentManagement(loggedInUser: any, docDetail: any): Promise<any> {
    try {
      let docsXml = '';
      let docsTypeXml = '';
      if (docDetail.action == 'assign' && docDetail.action == 'unassign') {
        var docsList = docDetail.docList;
        let xmlDoc = create().ele('docs');
        docsList.forEach((doc) => {
          const leafNode = xmlDoc.ele('doc');
          leafNode.ele('docId').txt(doc.id);
        });
        docsXml = xmlDoc.end({
          headless: true,
          prettyPrint: true,
        });
        docsXml = docsXml.replace(/[\r\n]+/g, '').trim();

        let docsTypeList = docDetail.docTypeList;
        let xmlDocType = create().ele('docTypes');
        docsTypeList.forEach((docType) => {
          const leafNode = xmlDocType.ele('doctype');
          leafNode.ele('docId').txt(docType.doc_id);
        });
        docsTypeXml = xmlDocType.end({
          headless: true,
          prettyPrint: true,
        });
        docsTypeXml = docsTypeXml.replace(/[\r\n]+/g, '').trim();
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
        ],
      );
      if (!updatedMappingDetail) {
        updatedMappingDetail = { message: 'Record updated' };
      }
      return updatedMappingDetail;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'master/documentManagement',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `${JSON.stringify(docDetail)}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
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
          branchDetail.code ?? '',
          branchDetail.name,
          branchDetail.incharge,
          branchDetail.BranchType,
          branchDetail.Camera_IP ?? '',
          branchDetail.Camera_UserName ?? '',
          branchDetail.Camera_Password ?? '',
          branchDetail.ERP_CODE ?? '',
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
        ],
      );
      if (!updateBranchDetail) {
        updateBranchDetail = { message: 'Record updated' };
      }
      return updateBranchDetail;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'master/branchMaster',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `${JSON.stringify(branchDetail)}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
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
        },
      );
      let res: any = { recordsets: resultSets };
      return res;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'master/documentMaster',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `${JSON.stringify(docDetail)}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async designationMaster(loggedInUser: any, desigDetail: any): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);

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
        ],
      );
      if (!updatedDesigDetail) {
        updatedDesigDetail = { message: 'Record updated' };
      }
      return updatedDesigDetail;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'master/designationMaster',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `${JSON.stringify(desigDetail)}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async schemeMaster(loggedInUser: any, roleDetail: any): Promise<any> {
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
        ],
      );
      if (!updateRoleDetail) {
        updateRoleDetail = { message: 'Record updated' };
      }
      return updateRoleDetail;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'master/schemeMaster',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `${JSON.stringify(roleDetail)}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
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
        },
      );
      let res: any = { recordsets: resultSets };
      return res;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'master/getEmployeeDetails',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `regNo : ${regNo}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }
}
