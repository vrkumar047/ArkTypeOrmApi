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
  generateUniqueResidenceId(format: string, unitId: number, floorNo: number) {
    return `${format}${unitId.toString().padStart(2, '00')}${floorNo.toString().padStart(2, '00')}${Math.floor(Math.random() * 1000)}`;
  }
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

  async getSnapShot2(loggedInUser: any): Promise<any> {
    try {
      var options = {
        uri: 'http://192.168.1.12/cgi-bin/snapshot.cgi?1',
        encoding: 'binary',
        auth: {
          user: 'admin',
          pass: 'admin@12345',
          sendImmediately: false,
        },
      };

      request.get(
        options,
        async function (error: any, response: any, body: any) {
          if (response.statusCode == 200) {
            const imageData = Buffer.from(response.body, 'binary');
            let filePath: string = path.join(
              __dirname,
              `../../uploads/snapshots/image_${moment().format('DDMMYYYYHHMMss')}.jpg`,
            );
            fs.writeFile(filePath, imageData, (err) => {
              if (err) throw err;
              console.log('Image saved successfully!');
            });
          } else {
            console.log('Code : ' + response.statusCode);
          }
        },
      );
    } catch (err) {
      return null;
    }
  }

  async getVisitPurposes(loggedInUser: any): Promise<any[]> {
    try {
      let companyDb = await GetCompanyDb();
      let purposes: any[] = await companyDb.manager.find('', {
        where: {
          isActive: 1,
        },
      });
      // let puposeRes = purposes.map((value) =>
      //   plainToClass(VisitPurposeResponse, value, options),
      // );
      // return puposeRes;
      return purposes;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getVisitPurpose',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async getDevicesForClient(loggedInUser: any): Promise<any[]> {
    try {
      let companyDb = await GetCompanyDb();
      let devices: any[] = await companyDb.manager.query(
        `select * from ${constant.P_GetUser}()`,
        [],
      );
      return devices;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getDevicesForClient',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async getCountries(loggedInUser: any): Promise<any[]> {
    let companyDb = await GetCompanyDb();
    let countries: any[] = await companyDb.manager.find('', {
      where: {
        isActive: 1,
      },
    });
    // let countryRes = countries.map((value) =>
    //   plainToClass(CountryResponse, value, options),
    // );
    // return countryRes;

    return countries;
  }

  async getStates(loggedInUser: any, countryCode: string): Promise<any[]> {
    try {
      let companyDb = await GetCompanyDb();
      let states: any[] = await companyDb.manager.find('', {
        where: {
          countryCode: countryCode ?? '',
          isActive: 1,
        },
      });
      // await redis.set('IN', JSON.stringify(states), 'EX', 3600);
      // let stateRes = states.map((value) =>
      //   plainToClass(StateResponse, value, options),
      // );
      // return stateRes;
      return states;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getStates',
          error: error.message,
        });
      }
      let err = new CustomError('InternalServerError');
      throw err;
    }
  }

  async getIdProofTypes(loggedInUser: any): Promise<any[]> {
    try {
      let companyDb = await GetCompanyDb();
      let proofTypes: any[] = await companyDb.manager.find('', {
        where: {
          isActive: 1,
        },
      });
      // let proofTypeRes = proofTypes.map((value) =>
      //   plainToClass(IdProofTypeResponse, value, options),
      // );
      // return proofTypeRes;
      return proofTypes;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'common/getIdProofTypes',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }
}
