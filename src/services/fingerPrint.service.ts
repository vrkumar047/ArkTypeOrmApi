import { GetCompanyDb } from '../_dbs/mssql/sqlConnection';
import { plainToClass } from 'class-transformer';
import constant from '../_dbs/mssql/constant';
import Logger from '../utils/logger';
import { CustomError } from '../helpers/customError';
import { Config } from '../helpers/config';
import * as path from 'path';
import * as http from 'http';
import * as fs from 'fs';
import moment from 'moment';
import axios from 'axios';
import * as crypto from 'crypto';
import * as request from 'request';
import * as QRCode from 'qrcode';
import { JSDOM } from 'jsdom';
import htmlPdf from 'html-pdf';
import dotenv from 'dotenv';
dotenv.config();
const { baseApi } = process.env;

let options: any = {
  excludeExtraneousValues: true,
};

export class FingerPrintService {
  async addFingerPrint(loggedInUser: any, fingerDetail: any): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let addeFingerDetail: any = await companyDb.query(
        `EXEC ${constant.P_CandidateFingerPrint} @action = @0, @formNo = @1, @fingerIndex = @2, @fingerData = @3, @userId = @4`,
        [
          fingerDetail.action,
          fingerDetail.formNo,
          fingerDetail.fingerIndex,
          fingerDetail.fingerData,
          fingerDetail.userId,
        ],
      );
      return addeFingerDetail;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'fingerprint/addFingerPrint',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `${JSON.stringify(fingerDetail)}`,
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
