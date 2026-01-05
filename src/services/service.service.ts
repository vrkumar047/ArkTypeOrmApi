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
import * as crypto from 'crypto';
import * as request from 'request';

let options: any = {
  excludeExtraneousValues: true,
};

export class ServiceService {
  async empBasicDetails(
    loggedInUser: any,
    action: string,
    formNo: string,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      const resultSets = await getResultSets(
        companyDb,
        constant.P_GetEmpDetailForRegNo,
        {
          action: action,
          formNo: formNo,
          userId: loggedInUser.userId,
        },
      );

      let res: any = {
        basicDetails: resultSets[0],
        educationDetails: resultSets[1],
        experienceDetails: resultSets[2],
        physicalDetails: resultSets[3],
        scoreDetails: resultSets[4],
        familyDetails: resultSets[5],
        bankDetails: resultSets[6],
        fingerDetail: resultSets[7],
        documentDetail: resultSets[8],
      };
      return res;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'services/empBasicDetails',
        error: `Error :- ${error.message ?? ''}, Detail :- ${error.detail ?? ''}`,
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
  async getArkData(loggedInUser: any, data: any): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      const resultSets = await getResultSets(companyDb, constant.P_GetArkData, {
        action: data.action,
        fromDate: data.fromDate,
        toDate: data.toDate,
        userId: loggedInUser.userId,
      });

      let res: any = {
        data: resultSets[0],
        // educationDetails: resultSets[1],
        // experienceDetails: resultSets[2],
        // physicalDetails: resultSets[3],
        // scoreDetails: resultSets[4],
        // familyDetails: resultSets[5],
        // bankDetails: resultSets[6],
        // fingerDetail: resultSets[7],
        // documentDetail: resultSets[8],
      };
      return res;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'services/getArkData',
        error: `Error :- ${error.message ?? ''}, Detail :- ${error.detail ?? ''}`,
        requestPayload: `${JSON.stringify(data)}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }
  async postArkData(
    loggedInUser: any,
    action: string,
    formNo: string,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      const resultSets = await getResultSets(
        companyDb,
        constant.P_GetEmpDetailForRegNo,
        {
          action: action,
          formNo: formNo,
          userId: loggedInUser.userId,
        },
      );

      let res: any = {
        basicDetails: resultSets[0],
        educationDetails: resultSets[1],
        experienceDetails: resultSets[2],
        physicalDetails: resultSets[3],
        scoreDetails: resultSets[4],
        familyDetails: resultSets[5],
        bankDetails: resultSets[6],
        fingerDetail: resultSets[7],
        documentDetail: resultSets[8],
      };
      return res;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'services/postArkData',
        error: `Error :- ${error.message ?? ''}, Detail :- ${error.detail ?? ''}`,
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
}
