import { GetCompanyDb, getResultSets } from '../_dbs/mssql/sqlConnection';
import { plainToClass } from 'class-transformer';
import constant from '../_dbs/mssql/constant';
import Logger from '../utils/logger';
import { CustomError } from '../helpers/customError';
import { Config } from '../helpers/config';
import * as path from 'path';
import * as http from 'http';
import * as fs from 'fs';
import ExcelJS from 'exceljs';
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
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'dashboard/dashboardList',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `action : ${action}, userId : ${userId}, companyCode : ${companyCode}, branchCode : ${branchCode}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
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
      let res: any = resultSets;
      return res;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'dashboard/dashboardDetails',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `${JSON.stringify(dashBoardDetail)}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
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
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'dashboard/activeBranchList',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `companyCode : ${companyCode}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
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
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'dashboard/branchCameraDetails',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `companyCode : ${companyCode}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
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
        `exec ${reportDetail.procName} @UserId = @0, @Company = @1, @Zone = @2, @Region = @3, @Branch = @4, @Desig = @5, @fromDate = @6, @toDate = @7`,
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
//#region--------------------------------------------------------- getting json data to into excel
                  const resObj = result;

                  const workbook = new ExcelJS.Workbook();
                  const worksheet = workbook.addWorksheet('Report');

                  if (resObj.length > 0) {

                    // Get column names dynamically
                    const columns = Object.keys(resObj[0]);

                    worksheet.columns = columns.map((column) => ({
                      header: column,
                      key: column,
                      width: 20
                    }));

                    // Add JSON/SQL result to Excel
                    resObj.forEach((row: Record<string, any>) => {
                      worksheet.addRow(row);
                    });

                    // Header formatting
                    worksheet.getRow(1).font = {
                      bold: true
                    };
                  }

                  const outputFileName = `reportfiles/${reportDetail.reportName}.xlsx`;

                  await workbook.xlsx.writeFile(
                    `./Uploads/${outputFileName}`
                  );
//#endregion--------------------------------------------------------- end getting json data to into excel
      return {
        res: outputFileName
      };

    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'dashboard/downloadReport',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `${JSON.stringify(reportDetail)}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
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
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'dashboard/downloadVerifiedESI',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `${JSON.stringify(reportDetail)}`,
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
