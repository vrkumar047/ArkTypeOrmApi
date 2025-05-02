import * as sql from 'mssql';
import { GetCompanyDb, getResultSets } from '../_dbs/mssql/pgConnection';
import { DataSource, ILike, Like, In, Not, Raw } from 'typeorm';
import constant from '../_dbs/mssql/constant';
import { plainToClass } from 'class-transformer';
import { JWT } from '../helpers/jwt';
import { Encrypt } from '../helpers/encrypt';
import { CustomError } from '../helpers/customError';
import ErrorMessage from '../_configs/errors/customError.json';
import appConfig from '../_configs/app/appConfig.json';
import dotenv from 'dotenv';
import Logger from '../utils/logger';
import moment from 'moment';
const jwt = new JWT();
dotenv.config();
const { refreshTokenExpireTime } = process.env;
export class AuthService {
  async checkuser(userName: string, password: string): Promise<any> {
    try {
      let companyDb = await GetCompanyDb();
      // let user: any[] = await companyDb.manager.query(
      //   `exec ${constant.P_GetUser} @UserName = @0`,
      //   [userName],
      // ); //---------------------------- this will return single and first result set only
      // return user;

      const resultSets = await getResultSets(companyDb, constant.P_GetUser, {
        UserName: userName,
      }); //---------------------------- this will return multiple result sets
      console.log(resultSets);
      return resultSets;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          src: 'account/checkuser',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async getLoginDetail(clientId: string, userName: string): Promise<any> {
    try {
      let masterDb = await GetCompanyDb();
      let userLogin: any | null = await masterDb.manager.findOne('', {
        where: {
          clientId: clientId,
          userName: userName,
        },
      });
      if (!userLogin) {
        let err = new CustomError('UserNotFound');
        throw err;
      }
      if (userLogin.isBlocked == 1) {
        let err = new CustomError('UserBlocked');
        throw err;
      }
      if (userLogin.isActive == 0) {
        let err = new CustomError('UserInActive');
        throw err;
      }

      let client: any | null = await masterDb.manager.findOne('', {
        where: { clientId },
      });
      let compConfig: any = client != undefined ? client.clientConfig : {};
      //  let compdb: string = compConfig.dbName;
      let configDetail: any = {
        userId: userLogin.userId,
        hst: compConfig.dbHost,
        usrname: compConfig.dbUser,
        pwd: compConfig.dbPassword,
        name: compConfig.dbName,
        pt: compConfig.dbPort,
        loginAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      };

      let secret: string = Encrypt.encrypt(JSON.stringify(configDetail));
      let companyDb = await GetCompanyDb();
      let userRepo = companyDb.getRepository('');
      let user: any = await userRepo.findOne({
        where: { userId: userLogin.userId },
      });
      let userRoles: any = await companyDb
        .getRepository('')
        .createQueryBuilder('ur')
        .innerJoin('', 'rl', 'ur.roleId = rl.roleId')
        .select([
          'ur.userId as "userId"',
          'rl.roleId as "roleId"',
          'rl.roleName as "roleName"',
        ])
        .where('ur.userId = :userId and ur.isActive = :isActive', {
          userId: user.userId,
          isActive: 1,
        })
        .getRawMany();
      let roles: any[] = [];
      for (let userRole of userRoles) {
        roles.push({ roleId: userRole.roleId, roleName: userRole.roleName });
      }
      user.clientId = clientId;
      let modules: any[] = await companyDb.query(
        `select * from ${constant.P_GetUser}(0)`,
        [],
      );
      let userClaims = this.getModulePermissions(modules, userLogin.userClaim);
      let token = jwt.generateToken(user, userClaims, secret);
      let refreshToken = jwt.generateRefreshToken(<string>userLogin.userId);
      let userInfo: any = {};
      userInfo.userId = user.userId;
      userInfo.clientId = user.clientId;
      userInfo.firstName = user.firstName;
      userInfo.lastName = user.lastName;
      userInfo.fullName = user.fullName;
      userInfo.roles = roles;
      userInfo.mobile = user.mobile;
      userInfo.emailId = user.emailId;
      userInfo.token = token;
      userInfo.refreshToken = refreshToken;
      userInfo.tokenExpiredAt = new Date();

      userLogin.refreshToken = refreshToken;
      let currentDate = new Date();
      userLogin.tokenExpireAt = new Date(
        currentDate.getTime() +
          parseInt(<string>refreshTokenExpireTime) * 60 * 60 * 1000,
      );
      userLogin.lastLoginAt = currentDate;
      userLogin.wrongCredentialCounter = 0;
      let userLoginRepo = await masterDb.getRepository('');
      let updatedUserLogin = await userLoginRepo.save(userLogin);

      // let loginDetail = plainToClass(any, userInfo, {
      //   excludeExtraneousValues: true,
      // });
      // return loginDetail;
      return userInfo;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: clientId,
          src: 'auth/getLoginDetail',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async refreshToken(refreshToken: string, token: string): Promise<any> {
    try {
      let masterDb = await GetCompanyDb();
      let userLogin: any | null = await masterDb.manager.findOne('', {
        where: {
          refreshToken: refreshToken != undefined ? refreshToken : '',
        },
      });
      if (userLogin == undefined) {
        let err = new CustomError('InvalidRefreshToken');
        throw err;
      }
      let decoded = await jwt.getClaimFromToken(token);
      if (!decoded) {
        let err = new CustomError('Unauthorized');
        throw err;
      }
      // decoded.payload.emailId      //----------- to verify emailId
      // decoded.payload.userId      //----------- to verify userId
      // decoded.header.kid      //----------- to verify kid
      if (decoded.payload.userId != userLogin.userId) {
        let err = new CustomError('Unauthorized');
        throw err;
      }
      if (decoded.payload.jti != userLogin.userId) {
        let err = new CustomError('Unauthorized');
        throw err;
      }
      let loginRes: any = await this.getLoginDetail(
        <string>userLogin.clientId,
        <string>userLogin.userName,
      );
      return loginRes;
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'auth/refreshToken',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  getModulePermissions(modules: any[], userPermissions: any[]) {
    let modulePermissions: any[] = [];
    for (let mdls of modules) {
      let module: any = userPermissions.find(
        (x) => x.moduleId == mdls.moduleId,
      );
      if (module) {
        delete mdls.roleId;
        mdls.create = module.create;
        mdls.read = module.read;
        mdls.update = module.update;
        mdls.delete = module.delete;
        mdls.download = module.download;
      } else {
        mdls.create = 0;
        mdls.read = 0;
        mdls.update = 0;
        mdls.delete = 0;
        mdls.download = 0;
      }
      modulePermissions.push(mdls);
    }
    return modulePermissions;
  }
}
