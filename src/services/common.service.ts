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
}
