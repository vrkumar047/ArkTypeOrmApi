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
import * as crypto from 'crypto';
import * as request from 'request';

let options: any = {
  excludeExtraneousValues: true,
};

export class DashboardService {
  async dashboardList(
    loggedInUser: any,
    action: string = '',
    userId: string = '',
    companyCode: string = '',
    branchCode: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let result: any = await companyDb.query(
        `exec ${constant.P_GetHoDashboardList} @action = @0, @userId = @1, @companyCode = @2, @branchCode = @3`,
        [action, userId, companyCode, branchCode],
      );
      return result;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'dashboard/dashboardList',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async dashboardDetails(
    loggedInUser: any,
    dashBoardDetail: any = {},
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      const resultSets: any = await getResultSets(
        companyDb,
        constant.P_GetFilteredHODashboardData,
        {
          userId: dashBoardDetail.userId,
          mode: dashBoardDetail.mode,
          companyCode: dashBoardDetail.companyCode,
          zoneCode: dashBoardDetail.zoneCode,
          regionCode: dashBoardDetail.regionCode,
          branchCode: dashBoardDetail.branchCode,
          branchType: dashBoardDetail.branchType,
          desigCode: dashBoardDetail.desigCode,
          formStatus: dashBoardDetail.formStatus,
          startDate: dashBoardDetail.startDate,
          endDate: dashBoardDetail.endDate,
          period: dashBoardDetail.period,
        },
      );
      let res: any = resultSets[0];
      return res;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'dashboard/dashboardDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async activeBranchList(
    loggedInUser: any,
    companyCode: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let result: any = await companyDb.query(
        `exec ${constant.P_GetActiveBranchList} @companyCode = @0`,
        [companyCode],
      );
      return result;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'dashboard/activeBranchList',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async branchCameraDetails(
    loggedInUser: any,
    companyCode: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let result: any = await companyDb.query(
        `exec ${constant.P_GetLiveCameraDetails} @companyCode = @0`,
        [companyCode],
      );
      return result;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'dashboard/branchCameraDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async downloadReport(
    loggedInUser: any,
    reportDetail: any = {},
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let result: any = await companyDb.query(
        `exec ${constant.P_GetLiveCameraDetails} @UserId = @0, @Company = @1, @Zone = @2, @Region = @3, @Branch = @4, @Desig = @5, @fromDate = @6, @toDate = @7`,
        [
          reportDetail.userId,
          reportDetail.company,
          reportDetail.zone,
          reportDetail.region,
          reportDetail.branch,
          reportDetail.desig,
          reportDetail.fromDate,
          reportDetail.toDate,
        ],
      );

      return result;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'dashboard/downloadReport',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async downloadVerifiedESI(
    loggedInUser: any,
    reportDetail: any = {},
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let result: any = await companyDb.query(
        `exec ${constant.P_GetEsiVerificationFormList} @action = @0, @role = @1, @branchCode = @2, @fromDate = @3, @toDate = @4, @userId = @5`,
        [
          reportDetail.action,
          reportDetail.role,
          reportDetail.branchCode,
          reportDetail.fromDate,
          reportDetail.toDate,
          reportDetail.userId,
        ],
      );

      return result;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'dashboard/downloadVerifiedESI',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }
}
