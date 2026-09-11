import { GetCompanyDb, getResultSets } from '../_dbs/mssql/sqlConnection';
import { plainToClass } from 'class-transformer';
import constant from '../_dbs/mssql/constant';
import Logger from '../utils/logger';
import { CustomError } from '../helpers/customError';
import { Config } from '../helpers/config';
import * as path from 'path';
import * as http from 'http';
import * as fs from 'fs';
import moment from 'moment';
//import { fileTypeFromBuffer } from 'file-type';
import * as crypto from 'crypto';
import * as request from 'request';
import axios from 'axios';
//import Redis from 'ioredis';
//const redis = new Redis();
import dotenv from 'dotenv';
dotenv.config();
const { clientSecret } = process.env;

let options: any = {
  excludeExtraneousValues: true,
};

export class CommonService {
  generateUniqueId(format: string) {
    return `${format}${Math.floor(Math.random() * 100000)}`;
  }

  async getDashboardDetails(
    loggedInUser: any,
    action: string,
    role: string,
    userId: string,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      const resultSets = await getResultSets(
        companyDb,
        constant.P_GetFormMasterList,
        {
          action: action,
          role: role,
          userId: userId,
        },
      );
      let res: any = { recordsets: resultSets };
      return res;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/getDashboardDetails',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `action : ${action}, role : ${role}, userId : ${userId}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getBasicTableDetails(
    loggedInUser: any,
    action: string,
    userId: string,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      const resultSets = await getResultSets(
        companyDb,
        constant.P_BasicTableDetails,
        {
          action: action,
          userId: userId,
        },
      );
      let res: any = { recordsets: resultSets };
      return res;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/getBasicTableDetails',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `action : ${action}, userId : ${userId}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getProspectusNo(
    loggedInUser: any,
    action: string,
    branchCode: string,
    userId: string,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      const resultSets = await getResultSets(
        companyDb,
        constant.P_ProspectusDetails,
        {
          action: action,
          branchCode: branchCode,
          userId: userId,
        },
      );
      let res: any;
      if (!resultSets) {
        res = [];
      } else {
        res = resultSets[0];
      }
      return res;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/getProspectusNo',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `action : ${action}, branchCode : ${branchCode}, userId : ${userId}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getAddressDetail(
    loggedInUser: any,
    action: string,
    countryId: string,
    stateId: string,
    districtId: string,
    cityId: string,
    userId: string,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let resultSets: any[] = await getResultSets(
        companyDb,
        constant.P_AddressDetail,
        {
          action: action,
          countryId: countryId,
          stateId: stateId,
          districtId: districtId,
          cityId: cityId,
          userId: userId,
        },
      );
      let res: any;
      if (!resultSets) {
        res = [];
      } else {
        res = resultSets[0];
      }
      return res;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/getAddressDetail',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `action : ${action}, countryId : ${countryId}, stateId : ${stateId}, districtId : ${districtId}, cityId : ${cityId}, userId : ${userId}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getState(loggedInUser: any): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      const resultSets = await getResultSets(
        companyDb,
        constant.P_Get_State_Master,
        {},
      );
      let res: any;
      if (!resultSets) {
        res = [];
      } else {
        res = resultSets[0];
      }
      return res;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/getState',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: ``,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getConstituency(
    loggedInUser: any,
    action: string,
    stateCode: string,
    pcCode: string,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      const resultSets = await getResultSets(
        companyDb,
        constant.P_Get_Constituency_Detail,
        {
          action: action,
          stateCode: stateCode,
          pcCode: pcCode,
        },
      );
      let res: any;
      if (!resultSets) {
        res = [];
      } else {
        res = resultSets[0];
      }
      return res;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/getConstituency',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `action : ${action}, stateCode : ${stateCode}, pcCode : ${pcCode}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getCasteCategory(loggedInUser: any, stateCode: string): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let casteCategory: any[] = await companyDb.query(
        'select id,CategoryName from tbl_CasteCategoryMaster_New (nolock) where isActive =1',
        [],
      );
      if (!casteCategory) {
        casteCategory = [];
      }
      return casteCategory;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/getCasteCategory',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `stateCode : ${stateCode}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getCaste(
    loggedInUser: any,
    casteCategory: string,
    stateCode: string,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let casteRes: any[] = await companyDb.query(
        `select id,CasteCategory,caste_name as CasteName from tbl_CasteDetail_New (nolock) where StateCode = '${stateCode}' and CasteCategory= '${casteCategory}' and isActive=1`,
        [],
      );
      if (!casteRes) {
        casteRes = [];
      }
      return casteRes;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/getCaste',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `casteCategory : ${casteCategory}, stateCode : ${stateCode}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getFeeBatchAndSchemeList(
    loggedInUser: any,
    tableName: string,
    branchCode: string,
    desigCode: string,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      const resultSets = await getResultSets(
        companyDb,
        constant.P_getFeeBatchAndSchemeDetails,
        {
          tableName: tableName,
          branchCode: branchCode,
          desigCode: desigCode,
        },
      );
      let res: any;
      if (!resultSets) {
        res = [];
      } else {
        res = resultSets[0];
      }
      return res;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/getFeeBatchAndSchemeList',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `tableName : ${tableName}, branchCode : ${branchCode}, desigCode : ${desigCode}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getReasonList(loggedInUser: any, action: string = ''): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let reasonList: any = await companyDb.query(
        `EXEC ${constant.P_getReasonList} @action = @0`,
        [action],
      );
      return reasonList ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/getReasonList',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `action : ${action}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getDocumentList(
    loggedInUser: any,
    post: string = '',
    candidateType: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let documentList: any = await companyDb.query(
        `EXEC ${constant.Proc_DocumentRequired} @Post = @0, @CandType = @1`,
        [post, candidateType],
      );
      return documentList ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'employee/addPhysicalDetails',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `post : ${post}, candidateType : ${candidateType}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getRequiredDocument(
    loggedInUser: any,
    docType: number = 0,
    post: string = '',
    candidateType: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let documentList: any = await companyDb.query(
        `EXEC ${constant.Proc_DocumentList}  @DocType = @0, @Post = @1, @CandType = @2`,
        [docType, post, candidateType],
      );
      return documentList ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/getRequiredDocument',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `docType : ${docType}, post : ${post}, candidateType : ${candidateType}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getRequiredDocs(
    loggedInUser: any,
    post: string = '',
    candidateType: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let documentList: any = await companyDb.query(
        `EXEC ${constant.P_GetRequiredDocument} @Post = @0, @CandType = @1`,
        [post, candidateType],
      );
      return documentList ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/getRequiredDocs',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `post : ${post}, candidateType : ${candidateType}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getApplicableDocType(
    loggedInUser: any,
    docCode: number = 0,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let documentList: any = await companyDb.query(
        `EXEC ${constant.P_GetApplicableDocType} @DocId = @0`,
        [docCode],
      );
      return documentList ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/getApplicableDocType',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `docCode : ${docCode}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getDocumentForVerify(
    loggedInUser: any,
    post: string = '',
    candidateType: string = '',
    isBranch: number = 0,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let documentList: any = await companyDb.query(
        `EXEC ${constant.Proc_required_document_list} @Post = @0, @CandType = @1, @isBranch = @2`,
        [post, candidateType, isBranch],
      );
      return documentList ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/getDocumentForVerify',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `post : ${post}, candidateType : ${candidateType}, isBranch : ${isBranch}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getMandatoryDocList(
    loggedInUser: any,
    post: string = '',
    candidateType: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let documentList: any = await companyDb.query(
        `EXEC ${constant.P_GetDocumentVerification} @Post = @0, @CandType = @1`,
        [post, candidateType],
      );
      return documentList ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/getMandatoryDocList',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `post :${post}, candidateType : ${candidateType}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getEducationDetails(
    loggedInUser: any,
    action: string = '',
    formNo: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let eduDetails: any = await companyDb.query(
        `EXEC ${constant.P_EducationDetails} @action = @0, @formNo = @1`,
        [action, formNo],
      );
      return eduDetails ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/getEducationDetails',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `action : ${action}, formNo : ${formNo}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getLanguageDetails(
    loggedInUser: any,
    action: string = '',
    formNo: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let languageDetails: any = await companyDb.query(
        `EXEC ${constant.P_LanguageDetails} @action = @0, @formNo = @1`,
        [action, formNo],
      );
      return languageDetails ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/getLanguageDetails',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `action : ${action}, formNo : ${formNo}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getExperienceDetails(
    loggedInUser: any,
    action: string = '',
    formNo: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let expDetails: any = await companyDb.query(
        `EXEC ${constant.P_CivilianDetails} @action = @0, @formNo = @1`,
        [action, formNo],
      );
      return expDetails ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/getExperienceDetails',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `action : ${action}, formNo : ${formNo}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getExManExperienceDetails(
    loggedInUser: any,
    action: string = '',
    formNo: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let exManExpDetails: any = await companyDb.query(
        `EXEC ${constant.P_ExManExpDetails} @action = @0, @formNo = @1`,
        [action, formNo],
      );
      return exManExpDetails ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/getExManExperienceDetails',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `action : ${action}, formNo : ${formNo}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getEsiServerDetails(
    loggedInUser: any,
    action: string = '',
    formNo: string = '',
    esiNo: string = '',
    userId: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let esiDetails: any = await companyDb.query(
        `EXEC ${constant.P_EsiServerDetails} @action = @0, @formNo = @1, @esiNo = @2, @userId = @3`,
        [action, formNo, esiNo, userId],
      );
      return esiDetails ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/getEsiServerDetails',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `action : ${action}, formNo : ${formNo}, esiNo : ${esiNo}, userId : ${userId}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getFamilyDetails(
    loggedInUser: any,
    action: string = '',
    formNo: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let familyDetails: any = await companyDb.query(
        `EXEC ${constant.P_FamilyDetails} @action = @0, @formNo = @1`,
        [action, formNo],
      );
      return familyDetails ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/getFamilyDetails',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `action : ${action}, formNo : ${formNo}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getPhysicalDetails(
    loggedInUser: any,
    action: string = '',
    formNo: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let physicalDetails: any = await companyDb.query(
        `EXEC ${constant.P_PhysicalDetails} @action = @0, @formNo = @1`,
        [action, formNo],
      );
      return physicalDetails ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/getPhysicalDetails',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `action : ${action}, formNo : ${formNo}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getBankDetails(
    loggedInUser: any,
    action: string = '',
    formNo: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let bankDetails: any = await companyDb.query(
        `EXEC ${constant.P_BankDetails} @action = @0, @formNo = @1`,
        [action, formNo],
      );
      return bankDetails ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/getBankDetails',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `action : ${action}, formNo : ${formNo}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getBankDetailsIFSCWise(
    loggedInUser: any,
    ifscCode: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let bankDetails: any = await companyDb.query(
        `EXEC ${constant.P_GetBankDetailIFSCCodeWise} @ifscCode = @0`,
        [ifscCode],
      );
      return bankDetails ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/getBankDetailsIFSCWise',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `ifscCode : ${ifscCode}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getDesignationList(
    loggedInUser: any,
    action: string = '',
    branchCode: string = '',
    userId: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      const resultSets = await getResultSets(
        companyDb,
        constant.P_DesignationDetails,
        {
          action: action,
          branchCode: branchCode,
          userId: userId,
        },
      );
      let res: any = { recordsets: resultSets };
      return res;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/getDesignationList',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `action : ${action}, branchCode : ${branchCode}, userId : ${userId}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getTempDeploymentFormList(
    loggedInUser: any,
    userId: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      const resultSets = await getResultSets(
        companyDb,
        constant.P_GetTempDeploymentFormList,
        {
          userId: userId,
        },
      );
      let res: any = { recordsets: resultSets };
      return res;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/getTempDeploymentFormList',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `userId : ${userId}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getUnApprovedDocuments(
    loggedInUser: any,
    formNo: number = 0,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      const resultSets = await getResultSets(
        companyDb,
        constant.P_GetUnApprovedDocuments,
        {
          formNo: formNo,
        },
      );
      let res: any = { recordsets: resultSets };
      return res;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/getUnApprovedDocuments',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `formNo : ${formNo}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getTempDeploymentApplicationDetail(
    loggedInUser: any,
    formNo: number = 0,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      const resultSets = await getResultSets(
        companyDb,
        constant.P_GetTempDeploymentApplicationDetails,
        {
          formNo: formNo,
        },
      );
      let res: any = { recordsets: resultSets };
      return res;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/getTempDeploymentApplicationDetail',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `formNo : ${formNo}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async updateTempDeploymentDocumentStatus(
    loggedInUser: any,
    docsStatus: string = '',
    userId: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let documentStatus: any = await companyDb.query(
        `EXEC ${constant.p_updateTempDeploymentDocStatus} @docsStatus = @0, @userId = @1`,
        [docsStatus, userId],
      );
      return documentStatus ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/updateTempDeploymentDocumentStatus',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `docsStatus : ${docsStatus}, userId : ${userId}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async RqccDocumentDetail(
    loggedInUser: any,
    action: string = '',
    formNo: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let documentDetails: any = await companyDb.query(
        `EXEC ${constant.P_RqccDocumentDetail} @action = @0, @formNo = @1`,
        [action, formNo],
      );
      return documentDetails ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/RqccDocumentDetail',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `action : ${action}, formNo : ${formNo}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async CandidatTypeList(
    loggedInUser: any,
    branchCode: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let typeList: any = await companyDb.query(
        `EXEC ${constant.P_GetCandidateTypeMaster} @branchCode = @0`,
        [branchCode == 'null' ? null : branchCode],
      );
      return typeList ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/CandidatTypeList',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `branchCode : ${branchCode}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async GetList(
    loggedInUser: any,
    action: string = '',
    userId: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let list: any = await companyDb.query(
        `EXEC ${constant.P_GetList} @action = @0, @userId = @1`,
        [action, userId],
      );
      return list ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/GetList',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `action : ${action}, userId : ${userId}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async formlist(
    loggedInUser: any,
    action: string = '',
    role: string = '',
    branchCode: string = '',
    desig: string = '',
    month: string = '',
    year: string = '',
    userId: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let list: any = await companyDb.query(
        `EXEC ${constant.P_GetFormListRoleWise} @action = @0, @role = @1, @branchCode = @2, @desig = @3, @month = @4, @year = @5, @userId = @6`,
        [action, role, branchCode, desig, month, year, userId],
      );
      return list ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/formlist',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `action : ${action}, role : ${role}, branchCode : ${branchCode}, desig : ${desig}, month : ${month} year : ${year}, userId : ${userId}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async esiverificationlist(
    loggedInUser: any,
    action: string = '',
    role: string = '',
    branchCode: string = '',
    fromDate: string = '',
    toDate: string = '',
    userId: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let formList: any = await companyDb.query(
        `EXEC ${constant.P_GetEsiVerificationFormList} @action = @0, @role = @1, @branchCode = @2, @fromDate = @3, @toDate = @4, @userId = @5`,
        [action, role, branchCode, fromDate, toDate, userId],
      );
      return formList ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/esiverificationlist',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `action : ${action}, role : ${role}, branchCode : ${branchCode}, fromDate : ${fromDate}, toDate : ${toDate}, userId : ${userId}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async formStatus(
    loggedInUser: any,
    action: string = '',
    role: string = '',
    formNo: string = '',
    userId: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let formStatuses: any = await companyDb.query(
        `EXEC ${constant.P_FormStatusDetails} @action = @0, @role = @1, @formNo = @2, @userId = @3`,
        [action, role, formNo, userId],
      );
      return formStatuses ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/formstatus',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: ` action : ${action}, role : ${role}, formNo : ${formNo}, userId : ${userId}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async filteredFormList(
    loggedInUser: any,
    role: string = '',
    formNo: string = '',
    filterText: string = '',
    userId: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let formList: any = await companyDb.query(
        `EXEC ${constant.P_GetFilteredFormStatusDetails} @role = @0, @formNo = @1, @filterText = @2, @userId = @3`,
        [role, formNo, filterText, userId],
      );
      return formList ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/filteredFormList',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `role : ${role}, formNo : ${formNo}, filterText : ${filterText}, userId : ${userId}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async empPicDetails(
    loggedInUser: any,
    action: string = '',
    formNo: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let picDetail: any = await companyDb.query(
        `EXEC ${constant.P_UpdateEmployeePicDetails} @action = @0, @formNo = @1`,
        [action, formNo],
      );
      return picDetail ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/empPicDetails',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `action : ${action}, formNo : ${formNo}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getUserDetails(
    loggedInUser: any,
    action: string = '',
    agentCode: string = '',
    compCode: string = '',
    searchText: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      const resultSets = await getResultSets(
        companyDb,
        constant.P_UserDetails,
        {
          action: action,
          agentCode: agentCode,
          compCode: compCode,
          searchText: searchText,
        },
      );
      let res: any = resultSets;
      return res ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/getUserDetails',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `action : ${action}, agentCode : ${agentCode}, compCode : ${compCode}, searchText : ${searchText}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async isUserExist(
    loggedInUser: any,
    action: string = '',
    checkFor: string = '',
    checkText: string = '',
    userId: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let userDetail: any = await companyDb.query(
        `EXEC ${constant.P_IsExistUser} @action = @0, @checFor = @1, @checkText = @2, @user_id = @3`,
        [action, checkFor, checkText, userId],
      );
      return { rowCount: userDetail.length };
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/isUserExist',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `action : ${action}, checkFor : ${checkFor}, checkText : ${checkText}, userId : ${userId}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async checkBasicDetails(
    loggedInUser: any,
    checkFor: string = '',
    checkString: string = '',
    name: string = '',
    formNo: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let basicDetail: any = await companyDb.query(
        `EXEC ${constant.P_CheckBasicDetails} @checFor = @0, @checkText = @1, @name = @2`,
        [checkFor, checkString, name],
      );
      return { rowCount: basicDetail != undefined ? basicDetail.length : 0 };
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/checkBasicDetails',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `checkFor : ${checkFor}, checkString : ${checkString}, name : ${name}, formNo : ${formNo}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async assessmentDetails(
    loggedInUser: any,
    action: string = '',
    loginName: string = '',
    assessmentType: string = '',
    assessmentCode: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let assessmentDetail: any = await companyDb.query(
        `EXEC ${constant.P_AssessmentDetails} @action = @0, @loginName = @1, @assessmentType = @2, @assessmentCode = @3`,
        [action, loginName, assessmentType, assessmentCode],
      );
      return assessmentDetail ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/assessmentDetails',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `action : ${action}, loginName : ${loginName}, assessmentType : ${assessmentType}, assessmentCode : ${assessmentCode}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getCondoDetails(
    loggedInUser: any,
    action: string = '',
    formNo: string = '',
    branchCode: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let assessmentDetail: any = await companyDb.query(
        `EXEC ${constant.P_getCondoDetails} @action = @0, @formNo = @1, @branchCode = @2`,
        [action, formNo, branchCode],
      );
      return assessmentDetail ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/getCondoDetails',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `action : ${action}, formNo : ${formNo}, branchCode : ${branchCode}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getFileSequence(
    loggedInUser: any,
    formNo: string = '',
    docTypeId: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let assessmentDetail: any = await companyDb.query(
        `EXEC ${constant.P_GetFileSequence} @formNo = @0, @docTypeId = @1`,
        [formNo, docTypeId],
      );
      return assessmentDetail ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/getFileSequence',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `formNo : ${formNo}, docTypeId : ${docTypeId}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async industryList(
    loggedInUser: any,
    action: string = '',
    formNo: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let industryList: any[] = await companyDb.query(
        `EXEC ${constant.P_GetIndustryList} @action = @0, @formNo = @1`,
        [action, formNo],
      );
      return industryList ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/industryList',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `action : ${action}, formNo : ${formNo}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async userWiseBranchList(
    loggedInUser: any,
    userId: string = '',
    compCode: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let branchList: any = await companyDb.query(
        `EXEC ${constant.P_UserWiseBranchList} @userId = @0, @compCode = @1`,
        [userId, compCode],
      );
      return branchList ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/userWiseBranchList',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `userId : ${userId}, compCode : ${compCode}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getSearchedApplications(
    loggedInUser: any,
    applicationDetail: any = {},
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let applications: any = await companyDb.query(
        `EXEC ${constant.P_SearchedApplications} @Action = @0, @RegNo = @1, @FormNo = @2, @Name = @3, @Dob = @4, @MobileNo = @5, @MeetAllCrt = @6, @User_ID = @7`,
        [
          applicationDetail.action,
          applicationDetail.regNo,
          applicationDetail.formNo,
          applicationDetail.name,
          applicationDetail.dob,
          applicationDetail.mobileNo,
          applicationDetail.meetAllCrt,
          applicationDetail.userId,
        ],
      );
      return applications ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/getSearchedApplications',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `${JSON.stringify(applicationDetail)}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }
  async getSchemeDetails(
    loggedInUser: any,
    action: string = '',
    companyCode: string = '',
    branchCode: string = '',
    desigCode: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      const schemeDetail = await getResultSets(
        companyDb,
        constant.P_SchemeMaster,
        {
          action: 'schemedetails',
          companyCode: companyCode,
          branchCode: branchCode,
          desig_code: desigCode,
        },
      );
      let res: any = schemeDetail;
      return res ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/getSchemeDetails',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `action : schemedetails, companyCode : ${companyCode}, branchCode : ${branchCode}, desigCode : ${desigCode}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async postUanStatusDetail(
    loggedInUser: any,
    uanDetail: any = {},
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      const uanStatusDetail = await getResultSets(
        companyDb,
        constant.P_UANStatusDetail,
        {
          action: uanDetail.action,
          formNo: uanDetail.formNo,
          branchCode: uanDetail.branchCode,
          aadharNo: uanDetail.aadharNo,
          aadharName: uanDetail.aadharName,
          aadharDob: uanDetail.aadharDob,
          uanNo: uanDetail.uanNo,
          status: uanDetail.status,
          userId: uanDetail.userId,
        },
      );
      let res: any = uanStatusDetail;
      return res ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/postUanStatusDetail',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `${JSON.stringify(uanDetail)}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async postApproveRejectElectronicDetail(
    loggedInUser: any,
    action: string = '',
    formNo: string = '',
    defaultImage: string = '',
    remark: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      const electronicDetail = await getResultSets(
        companyDb,
        constant.P_ApproveRejectRqccElectronicDetail,
        {
          action: action,
          formNo: formNo,
          defaultImage: defaultImage,
          remark: remark,
        },
      );
      let res: any = electronicDetail;
      return res ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/postApproveRejectElectronicDetail',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `action : ${action}, formNo : ${formNo}, defaultImage : ${defaultImage}, remark : ${remark}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getReportList(loggedInUser: any, userId: string = ''): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      const resultsets = await getResultSets(
        companyDb,
        constant.P_getReportList,
        {
          action: 'reportlist',
          userId: userId,
        },
      );
      let res: any = resultsets[0];
      return res ?? [];
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'common/getReportList',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `action : reportlist, userId : ${userId}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getAppToken(loggedInUser: any, appName: string = ''): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(clientSecret);
      let resultSet: any = await companyDb.query(
        `EXEC ${constant.P_Web_App_Token} @appname = @0`,
        [appName],
      );
     
      if (resultSet[0].key_expired == 1) {
        try {
          const response = await axios.get(
            'http://10.10.1.222:81/api/common/UpdateAppToken',
          );
          // You can process the response here if needed
          let responseData: any = response.data;
          let jsonObject: any = { status: responseData };
          var jsonParsed: any = JSON.parse(jsonObject.status);
          resultSet[0].key_expired = 0;
          resultSet[0].expirydate = jsonParsed[0].expirydate;
          resultSet[0].token = jsonParsed[0].token;
        } catch (error) {
          throw error;
        }
      } else {
        let res: any = resultSet[0];
        return res;
      }
    } catch (error: any) {
      // Logger.error({
      //   clientId: 'sis',
      //   src: 'common/getAppToken',
      //   error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
      //   requestPayload: `appName : ${appName}`,
      //   loggedBy: '',
      // });
      if(error.name != undefined && error.name =='QueryFailedError')
      {
        return {
          isError: true,
          errMsg: error.message,
        };
      }
      else {
        let customError:any={
          isError: true,
          errMsg: error.message,
        }
        throw customError;
      }
    }
  }

  async updateAppToken(loggedInUser: any, appName: string = ''): Promise<any> {
    try {
          let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://siscoresyncapi.sisgroup.in/api/Authentication/GetToken_New?AccessToken=0vCKhdKs7dcM4fRoEkqHXIj4zoQgmO3c&SecretKey=JCulZVbUjDx6yFYuK1ywMR76lOdVbZq9',
            headers: { }
          };

        const response = await axios.request(config);
        let token:string = response.data.token;
        let expireIn:string = response.data.expires_in

      let companyDb = await GetCompanyDb(clientSecret);

          let updatedDetail: any = await companyDb.query(
              `EXEC ${constant.P_Web_App_Token_Update} @appname = @0, @token = @1, @expires_in = @2`,
              [
                appName,
                token,
                expireIn
              ],
            );
        let res: any = updatedDetail != undefined?updatedDetail[0]: { message: 'Record updated' };
        return res;
    } catch (error: any) {
      // Logger.error({
      //   clientId: 'sis',
      //   src: 'common/updateAppToken',
      //   error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
      //   requestPayload: `appName : ${appName}`,
      //   loggedBy: '',
      // });
      if(error.name != undefined && error.name =='QueryFailedError')
      {
        return {
          isError: true,
          errMsg: error.message,
        };
      }
      else {
        let customError:any={
          isError: true,
          errMsg: error.message,
        }
        throw customError;
      }
    }
  }

  async getMachines(): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(clientSecret);
      const resultSets = await getResultSets(
        companyDb,
        constant.Proc_machines,
        {},
      );
      let res: any = { recordsets: resultSets };
      return res;
    } catch (error: any) {
      // Logger.error({
      //   clientId: 'sis',
      //   src: 'common/getMachines',
      //   error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
      //   requestPayload: ``,
      //   loggedBy: '',
      // });
      if(error.name != undefined && error.name =='QueryFailedError')
      {
        return {
          isError: true,
          errMsg: error.message,
        };
      }
      else {
        let customError:any={
          isError: true,
          errMsg: error.message,
        }
        throw customError;
      }
    }
  }

    async getInstalledMachines(): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(clientSecret);
      const resultSets = await getResultSets(
        companyDb,
        constant.proc_started_machine,
        {},
      );
      let res: any = { recordsets: resultSets };
      return res;
    } catch (error: any) {
      // Logger.error({
      //   clientId: 'sis',
      //   src: 'common/getMachines',
      //   error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
      //   requestPayload: ``,
      //   loggedBy: '',
      // });
      if(error.name != undefined && error.name =='QueryFailedError')
      {
        return {
          isError: true,
          errMsg: error.message,
        };
      }
      else {
        let customError:any={
          isError: true,
          errMsg: error.message,
        }
        throw customError;
      }
    }
  }

    async getRecruitmentCount(): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(clientSecret);
      const resultSets = await getResultSets(
        companyDb,
        constant.p_new_recruitment,
        {},
      );
      let res: any = { recordsets: resultSets };
      return res;
    } catch (error: any) {
      // Logger.error({
      //   clientId: 'sis',
      //   src: 'common/getMachines',
      //   error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
      //   requestPayload: ``,
      //   loggedBy: '',
      // });
      if(error.name != undefined && error.name =='QueryFailedError')
      {
        return {
          isError: true,
          errMsg: error.message,
        };
      }
      else {
        let customError:any={
          isError: true,
          errMsg: error.message,
        }
        throw customError;
      }
    }
  }

}
