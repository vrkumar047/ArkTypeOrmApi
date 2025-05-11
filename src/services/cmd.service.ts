import { GetCompanyDb } from '../_dbs/mssql/pgConnection';
import { plainToClass } from 'class-transformer';
import constant from '../_dbs/mssql/constant';
import Logger from '../utils/logger';
import { CustomError } from '../helpers/customError';
import { Config } from '../helpers/config';
import * as path from 'path';
import * as child_process from 'child_process';
import xmlbuilder from 'xmlbuilder';

let options: any = {
  excludeExtraneousValues: true,
};

export class CmdService {
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
}
