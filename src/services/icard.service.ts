import { GetCompanyDb } from '../_dbs/mssql/pgConnection';
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

let options: any = {
  excludeExtraneousValues: true,
};

export class ICardService {
  async getCardPrintDetails(
    loggedInUser: any,
    formNo: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let cardDetail: any = await companyDb.query(
        `EXEC ${constant.P_GetCardPrintDetails} @formNo = @0`,
        [formNo],
      );
      return cardDetail;
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

  async generateEmployeeRegNo(
    loggedInUser: any,
    empDetails: any,
  ): Promise<any> {
    try {
      if (empDetails.basicDetails[0].lsm_status != 'Approve') {
        return {
          status: `{"result":[{"candidateNo":"${empDetails.basicDetails[0].form_No}","prospectusNo":"${empDetails.basicDetails[0].prospectus_no}","isError":true,"errorMsg":"UAN verification is pending for (Form No- ${empDetails.basicDetails[0].form_No}),(Prospectus No- ${empDetails.basicDetails[0].prospectus_no})","regNo":""}]}`,
        };
      }
      if (empDetails.bankDetails[0].is_verified != 1) {
        let strMessage: string;
        if (empDetails.bankDetails[0].is_verified == 0) {
          strMessage = 'Bank Account verification is pending for ';
        } else if (empDetails.bankDetails[0].is_verified == 2) {
          strMessage =
            'Bank Account verification is rejected and reopen for update at stage for ';
        } else {
          strMessage =
            'Bank Account detail not listed for verification yet. Please try after some time or check for entered detail for ';
        }

        return {
          status: `{"result":[{"candidateNo":"${empDetails.basicDetails[0].form_No}","prospectusNo":"${empDetails.basicDetails[0].prospectus_no}","isError":true,"errorMsg":"${strMessage} (Form No- ${empDetails.basicDetails[0].form_No}),(Prospectus No- ${empDetails.basicDetails[0].prospectus_no})","regNo":""}]}`,
        };
      }
      let config = {
        method: 'get',
        url: 'http://10.10.1.222:81/api/common/GetAppToken',
        headers: {
          'content-type': 'text/plain',
          'appname': 'Coresyncapi',
        },
      };

      axios
        .request(config)
        .then((response) => {
          let tokenKey: string = response[0].token;
          let configReq2 = {
            method: 'post',
            url: 'https://siscoresyncapi.sisgroup.in/api/ark',
            headers: {
              'content-type': 'application/json; charset=utf-8',
              'Authorization': tokenKey,
            },
            data: JSON.stringify(empDetails),
          };

          axios
            .request(configReq2)
            .then((response) => {
              return { status: response.data };
            })
            .catch((error) => {
              if (error.driverError || error.name == 'RequestError') {
                Logger.error({
                  clientId: '',
                  src: `api/card/GenerateEmployeeRegNo, having FormNo ${empDetails.formNo}`,
                  error: error.message,
                });
                error = new CustomError('InternalServerError');
              }
              throw error;
            });
        })
        .catch((error) => {
          if (error.driverError || error.name == 'RequestError') {
            Logger.error({
              clientId: '',
              src: 'common/GetAppToken',
              error: error.message,
            });
            error = new CustomError('InternalServerError');
          }
          throw error;
        });
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'card/generateEmployeeRegNo',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }
}
