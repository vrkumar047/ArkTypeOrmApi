import { GetCompanyDb, getResultSets } from '../_dbs/mssql/pgConnection';
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
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getDashboardDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getBasicTableDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      let res: any = resultSets[0];
      return res;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getProspectusNo',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      const resultSets = await getResultSets(
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
      let res: any = resultSets[0];
      return res;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getAddressDetail',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      let res: any = resultSets[0];
      return res;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getState',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      let res: any = resultSets[0];
      return res;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getConstituency',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async getCasteCategory(loggedInUser: any, stateCode: string): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let casteCategory: any = await companyDb.query(
        'select id,CategoryName from tbl_CasteCategoryMaster_New (nolock) where isActive =1',
        [],
      );
      return casteCategory;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          agencyId: loggedInUser.clientId,
          src: 'common/getCasteCategory',
          error: error.message,
        });
        let err = new CustomError('InternalServerError');
        throw err;
      } else {
        throw error;
      }
    }
  }

  async getCaste(
    loggedInUser: any,
    casteCategory: string,
    stateCode: string,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let casteRes: any = await companyDb.query(
        `select id,CasteCategory,caste_name as CasteName from tbl_CasteDetail_New (nolock) where StateCode = '${stateCode}' and CasteCategory= '${casteCategory}' and isActive=1`,
        [],
      );
      return casteRes;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getCaste',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      let res: any = resultSets[0];
      return res;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getFeeBatchAndSchemeList',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      return reasonList;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getReasonList',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      return documentList;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getDocumentList',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      return documentList;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getRequiredDocument',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
        `EXEC ${constant.Proc_DocumentRequired} @Post = @0, @CandType = @1`,
        [post, candidateType],
      );
      return documentList;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getDocumentList',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      return documentList;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getApplicableDocType',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      return documentList;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getDocumentForVerify',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
        `EXEC ${constant.Proc_DocumentRequired} @Post = @0, @CandType = @1`,
        [post, candidateType],
      );
      return documentList;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getMandatoryDocList',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      return eduDetails;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getEducationDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      return languageDetails;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getLanguageDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      return expDetails;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getExperienceDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      return exManExpDetails;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getExManExperienceDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      return esiDetails;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getEsiServerDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      return familyDetails;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getFamilyDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      return physicalDetails;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getPhysicalDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      return bankDetails;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getBankDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      return bankDetails;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getBankDetailsIFSCWise',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getDesignationList',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getTempDeploymentFormList',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getUnApprovedDocuments',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getTempDeploymentApplicationDetail',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      return documentStatus;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/updateTempDeploymentDocumentStatus',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      return documentDetails;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/RqccDocumentDetail',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
        [branchCode],
      );
      return typeList;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/CandidatTypeList',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      return list;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/GetList',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      return list;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/formlist',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      return formList;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/esiverificationlist',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      return formStatuses;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/formstatus',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      return formList;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/filteredFormList',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async empPicDetails(
    loggedInUser: any,
    action: string = '',
    formNo: string = '',
    filterText: string = '',
    userId: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let picDetail: any = await companyDb.query(
        `EXEC ${constant.P_UpdateEmployeePicDetails} @action = @0, @formNo = @1`,
        [action, formNo],
      );
      return picDetail;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/empPicDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      let res: any = resultSets[0];
      return res;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getUserDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/isUserExist',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
        `EXEC ${constant.P_CheckBasicDetails} @checFor = @0, @checkText = @1, @name = @2, @formNo = @3`,
        [checkFor, checkString, name, formNo],
      );
      return { rowCount: basicDetail.length };
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/checkBasicDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      return assessmentDetail;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/assessmentDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      return assessmentDetail;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getCondoDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      return assessmentDetail;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getFileSequence',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      let industryList: any = await companyDb.query(
        `EXEC ${constant.P_GetIndustryList} @action = @0, @formNo = @1`,
        [action, formNo],
      );
      return industryList;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/industryList',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      return branchList;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/userWiseBranchList',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      return applications;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getSearchedApplications',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
          desigCode: desigCode,
        },
      );
      let res: any = schemeDetail[0];
      return res;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getSchemeDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      let res: any = uanStatusDetail[0];
      return res;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/postUanStatusDetail',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
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
      let res: any = electronicDetail[0];
      return res;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/postApproveRejectElectronicDetail',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async getReportList(loggedInUser: any, userId: string = ''): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      const electronicDetail = await getResultSets(
        companyDb,
        constant.P_getReportList,
        {
          action: 'reportlist',
          userId: userId,
        },
      );
      let res: any = electronicDetail[0];
      return res;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getReportList',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async getAppToken(loggedInUser: any, appName: string = ''): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let resultSet: any = await companyDb.query(
        `EXEC ${constant.P_SearchedApplications} @appname = @0`,
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
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getAppToken',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async updateAppToken(loggedInUser: any, appName: string = ''): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let resultSet: any = await companyDb.query(
        `EXEC ${constant.P_SearchedApplications} @appname = @0`,
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
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getAppToken',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }
}
