import { GetCompanyDb } from '../_dbs/mssql/sqlConnection';
import { plainToClass } from 'class-transformer';
import constant from '../_dbs/mssql/constant';
import Logger from '../utils/logger';
import { CustomError } from '../helpers/customError';
import { Config } from '../helpers/config';
import * as path from 'path';
import * as http from 'http';
import * as fs from 'fs';
import { stat } from 'fs/promises';
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

export class ICardService {
  async generateQrCode(loggedInUser: any, qrDetail: any): Promise<any> {
    try {
      let qrCodeString: string = `${qrDetail.fullName}\n${qrDetail.regNo}\n${qrDetail.lastEdu}${qrDetail.height},${qrDetail.weight},${qrDetail.bloodGroup}\n${qrDetail.doj}\n${qrDetail.expInMonth}\n${qrDetail.branchName}\n${qrDetail.cardExpiryDate}`;
      let segment: any = [{ data: qrCodeString.toUpperCase(), mode: 'Kanji' }];
      // await QRCode.toDataURL(segment, function (err: any, url: any) {
      //   if (err) {
      //     throw err;
      //   } else {
      //     return { url: url };
      //   }
      // });
      let url: string = await QRCode.toDataURL(segment);
      return { url: url };
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'card/generateQrCode',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `${JSON.stringify(qrDetail)}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async convertPdf(loggedInUser: any, cardDetail: any): Promise<any> {
    try {
      let empDetail: any = cardDetail.empDetail;
      let empImage: string = baseApi + cardDetail.empImage;
      let empQrCode: string = cardDetail.empQrCode;
      let empSing: string = baseApi + cardDetail.empSign;
      let filePath: string = path.join(
        __dirname,
        '../../Uploads/public/Icard.html',
      );
      let html: string = await fs.readFileSync(filePath, 'utf8');
      let htmlDOM: any = new JSDOM(html);
      htmlDOM.window.document.querySelector('#empImg').src = empImage;
      htmlDOM.window.document.querySelector('#empQrCode').src = empQrCode;
      htmlDOM.window.document.querySelector('#empSignImg').src = empSing;
      // htmlDOM.window.document.querySelector('#logopng').src = logopath;
      htmlDOM.window.document.querySelector('#empName').innerHTML =
        empDetail.emp_Name.toUpperCase();
      htmlDOM.window.document.querySelector('#empDesig').innerHTML =
        empDetail.desig;
      htmlDOM.window.document.querySelector('#empRegNo').innerHTML =
        empDetail.reg_no;
      htmlDOM.window.document.querySelector('#empBldGrp').innerHTML =
        empDetail.blood_group;
      htmlDOM.window.document.querySelector('#icrdIssueDate').innerHTML =
        empDetail.validFrom;
      htmlDOM.window.document.querySelector('#iCrdVldUpto').innerHTML =
        empDetail.validUpto;
      html = htmlDOM.serialize();

      let options: any = {
        format: 'Letter',
        orientation: 'portrait',
        height: '214',
        width: '331',
      };
      let icardName: string = empDetail.form_No.replace('/', '-');
      let pdfFilePath: string = path.join(
        './Uploads/icard',
        `${icardName}_Icard.pdf`,
      );
      console.log(pdfFilePath);
      let result: any = await new Promise((resolve, reject) => {
        htmlPdf
          .create(html, options)
          .toFile(pdfFilePath, (err: any, result: any) => {
            if (err) {
              Logger.error({
                clientId: '',
                src: 'card/convertPdf, htmlPdf',
                error: err.message,
              });
              reject(err);
            } else {
              resolve(result);
            }
          });
      });
      //const fileName = result.filename ?? '';
      return { filename: `${icardName}_Icard.pdf` };
      //-----------------------------------------------
      // let companyDb = await GetCompanyDb(loggedInUser.secret);
      // let cardDetail: any = await companyDb.query(
      //   `EXEC ${constant.P_GetCardPrintDetails} @formNo = @0`,
      //   [formNo],
      // );
      // return cardDetail;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'card/convertPdf',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `${JSON.stringify(cardDetail)}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async convertPdfFromBS64(loggedInUser: any, empDetail: any): Promise<any> {
    try {
      let empImage: string = baseApi + empDetail.empImage;
      let empQrCode: string = empDetail.empQrCode;
      let empSing: string = baseApi + empDetail.empSign;
      let html: string = fs.readFileSync('./Uploads/public/Icard.html', 'utf8');
      let htmlDOM: any = new JSDOM(html);
      htmlDOM.window.document.querySelector('#empImg').src = empImage;
      htmlDOM.window.document.querySelector('#empQrCode').src = empQrCode;
      htmlDOM.window.document.querySelector('#empSignImg').src = empSing;
      // htmlDOM.window.document.querySelector('#logopng').src = logopath;
      htmlDOM.window.document.querySelector('#empName').innerHTML =
        empDetail.emp_Name.toUpperCase();
      htmlDOM.window.document.querySelector('#empDesig').innerHTML =
        empDetail.desig;
      htmlDOM.window.document.querySelector('#empRegNo').innerHTML =
        empDetail.reg_no;
      htmlDOM.window.document.querySelector('#empBldGrp').innerHTML =
        empDetail.blood_group;
      htmlDOM.window.document.querySelector('#icrdIssueDate').innerHTML =
        empDetail.validFrom;
      htmlDOM.window.document.querySelector('#iCrdVldUpto').innerHTML =
        empDetail.validUpto;
      html = htmlDOM.serialize();

      let options: any = {
        format: 'Letter',
        orientation: 'portrait',
        height: '214',
        width: '331',
      };
      let icardName: string = empDetail.form_No.replace('/', '-');
      htmlPdf
        .create(html, options)
        .toFile(
          './Uploads/icard/' + icardName + '_Icard.pdf',
          function (err, result) {
            if (err) {
              throw err;
            } else {
              let fileName: any = result.filename.split('\\').reverse()[0];
              return { filename: fileName };
            }
          },
        );
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'card/convertPdfFromBS64',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `${JSON.stringify(empDetail)}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async downloadICard(loggedInUser: any, cardDetail: any): Promise<any> {
    try {
      var filePath = path.join(__dirname, '../Uploads/icard/testicard.pdf');
      // var file = fs.createReadStream('./Uploads/pdfs/testicard.pdf');
      // var stat = fs.statSync('./Uploads/pdfs/testicard.pdf');
      // res.setHeader('Content-Length', stat.size);
      // res.setHeader('Content-Type', 'application/pdf');
      // res.setHeader('Content-Disposition', 'attachment; filename=icard.pdf');
      // file.pipe(res);

      // fs.readFile(filePath , function (err,data){
      //     res.contentType("application/pdf");
      //     res.send(data);
      // });
      return filePath;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'card/downloadICard',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `${JSON.stringify(cardDetail)}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

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
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'card/getCardPrintDetails',
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

  async generateEmployeeRegNo(
    loggedInUser: any,
    empDetails: any,
  ): Promise<any> {
    try {
      if (
        empDetails.basicDetails != undefined &&
        empDetails.bankDetails != undefined
      ) {
        if (empDetails.basicDetails[0].lsm_status != 'Approve') {
          return {
            status: [
              {
                candidateNo: `${empDetails.basicDetails[0].form_No}`,
                prospectusNo: `${empDetails.basicDetails[0].prospectus_no}`,
                isError: true,
                errorMsg: `UAN verification is pending for (Form No- ${empDetails.basicDetails[0].form_No}),(Prospectus No- ${empDetails.basicDetails[0].prospectus_no})`,
                regNo: '',
              },
            ],
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
            status: [
              {
                candidateNo: `${empDetails.basicDetails[0].form_No}`,
                prospectusNo: `${empDetails.basicDetails[0].prospectus_no}`,
                isError: true,
                errorMsg: `${strMessage} (Form No- ${empDetails.basicDetails[0].form_No}),(Prospectus No- ${empDetails.basicDetails[0].prospectus_no})`,
                regNo: '',
              },
            ],
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

        const tokenResponse = await axios.request(config).catch((error) => {
          Logger.error({
            clientId: loggedInUser.clientId,
            src: 'common/GetAppToken',
            error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
            requestPayload: `formNo:${empDetails.formNo}`,
            loggedBy: loggedInUser.userId,
          });
          error =
            error.driverError || error.name == 'RequestError'
              ? new CustomError('InternalServerError')
              : error;
          throw error;
        });
        let tokenKey: string = tokenResponse.data[0].token;
        let configReq2 = {
          method: 'post',
          url: 'https://siscoresyncapi.sisgroup.in/api/ark',
          headers: {
            'content-type': 'application/json; charset=utf-8',
            'Authorization': tokenKey,
          },
          data: JSON.stringify(empDetails),
        };
        const arkResponse: any = await axios
          .request(configReq2)
          .catch((error) => {
            Logger.error({
              clientId: loggedInUser.clientId,
              src: 'https://siscoresyncapi.sisgroup.in/api/ark',
              error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
              requestPayload: `formNo:${empDetails.formNo}`,
              loggedBy: loggedInUser.userId,
            });
            error =
              error.driverError || error.name == 'RequestError'
                ? new CustomError('InternalServerError')
                : error;
            throw error;
          });
        return {
          status: arkResponse.data.result,
        };
      } else {
        return {
          status: [
            {
              isError: true,
              errorMsg: 'Invalid Detail',
            },
          ],
        };
      }
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'card/generateEmployeeRegNo',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `${JSON.stringify(empDetails)}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getCardStatus(
    loggedInUser: any,
    regNo: string,
    userId: string,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let cardDetail: any = await companyDb.query(
        `EXEC ${constant.P_GetICardStatus} @RegNo = @0, @UserId = @1`,
        [regNo, userId],
      );
      return cardDetail;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'card/getCardStatus',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `regNo : ${regNo}, userId : ${userId}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
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
      if (!printCardDetail) {
        printCardDetail = { message: 'Record updated' };
      }
      return printCardDetail;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'card/postPrintCard',
        error: `{"Error":"${error.name == 'RequestError' ? error.name : error.message}", "Detail":${error.name == 'RequestError' ? JSON.stringify(error.precedingErrors) : '"' + error.detail + '"'}}`,
        requestPayload: `${JSON.stringify(cardDetail)}`,
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
