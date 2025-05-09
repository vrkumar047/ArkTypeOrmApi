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
}
