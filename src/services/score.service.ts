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
import axios from 'axios';
import * as crypto from 'crypto';
import * as request from 'request';
import * as QRCode from 'qrcode';
import * as math from 'mathjs';
import { JSDOM } from 'jsdom';
import htmlPdf from 'html-pdf';
import dotenv from 'dotenv';
dotenv.config();
const { baseApi } = process.env;

let options: any = {
  excludeExtraneousValues: true,
};

export class ScoreService {
  async calculateScore(loggedInUser: any, scoreDetail: any): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      const recordDetails = await getResultSets(
        companyDb,
        constant.P_uploadFormFiles,
        {
          action: scoreDetail.action,
          formNo: scoreDetail.formNo,
          desigCode: scoreDetail.desigCode,
        },
      );
      let result: any;
      // let result: any = calculateScore(recordDetails);
      return result;
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'score/calculateScore',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async postPrintCard(loggedInUser: any, cardDetail: any): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let printCardDetail: any = await companyDb.query(
        `EXEC ${constant.P_CardPrint} @Action = @0, @RegNo = @1, @MobileNo = @2, @Otp = @3, @IsCardGenerated = @4, @EmpImage = @5, @UserId = @6`,
        [
          cardDetail.action,
          cardDetail.regNo,
          cardDetail.mobileNo,
          cardDetail.otp,
          cardDetail.isCardGenerated,
          cardDetail.empImage,
          cardDetail.userId,
        ],
      );
      return printCardDetail;
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'card/getCardPrintDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }
}
