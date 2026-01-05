import * as sql from 'mssql';
import { GetCompanyDb, getResultSets } from '../_dbs/mssql/sqlConnection';
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
const {
  db_host,
  db_port,
  db_name,
  db_user,
  db_password,
  refreshTokenExpireTime,
} = process.env;
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
      if (JSON.stringify(resultSets) == '[[],[]]') {
        let err = new CustomError('UserNotFound');
        throw err;
      }
      if (JSON.stringify(resultSets[0]) == '[]') {
        let err = new CustomError('UserNotFound');
        throw err;
      }

      let alreadyLogin: number = resultSets[0][0].islogedin;
      let hashPassword: string = resultSets[0][0].hash_password;
      let comparePassword: boolean = Encrypt.comparePassword(
        password,
        hashPassword,
      );
      comparePassword = true;
      if (comparePassword) {
        let claimJson: any = JSON.parse(resultSets[1][0].claim);
        let roleName: string = resultSets[1][0].role_name;
        for (var i = 1; i < resultSets[1].length; i++) {
          roleName += ',' + resultSets[1][i].role_name;
          //-----
          var tempJson = JSON.parse(resultSets[1][i].claim);
          var key;
          for (key in tempJson.claims.web) {
            if (tempJson.claims.web.hasOwnProperty(key)) {
              if (tempJson.claims.web[key] == true) {
                claimJson.claims.web[key] = tempJson.claims.web[key];
              }
            }
          }
        }

        resultSets[0][0].claim = JSON.stringify(claimJson);
        resultSets[0][0].role_name = roleName;

        let configDetail: any = {
          userId: resultSets[0][0].user_id,
          hst: db_host,
          usrname: db_user,
          pwd: db_password,
          name: db_name,
          pt: db_port,
          loginAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        };

        let secret: string = Encrypt.encrypt(JSON.stringify(configDetail));

        let token = jwt.generateToken(resultSets[0][0], claimJson, secret);
        let refreshToken = jwt.generateRefreshToken(resultSets[0][0].user_id);

        //  let updatedUserLogin = await userLoginRepo.save(userLogin);  // update refresh token

        resultSets[0][0].token = token;
        resultSets[0][0].refreshToken = refreshToken;

        // let status: any = {};
        // status.action = 'LogedIn';
        // status.userId = userName;
        // // activity.LogInStatus(status);
      } else {
        throw new CustomError('IncorrectPassword');
      }

      //  console.log(resultSets);
      return resultSets;
    } catch (error: any) {
      Logger.error({
        clientId: 'unknown',
        src: 'account/checkuser',
        error: `Error :- ${error.message ?? ''}, Detail :- ${error.detail ?? ''}`,
        requestPayload: `userName : ${userName}, password : ${password}`,
        loggedBy: userName,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;

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
      //  let userClaims = this.getModulePermissions(modules, userLogin.userClaim);
      //  let token = jwt.generateToken(user, userClaims);
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
      //     userInfo.token = token;
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

  async updateLoginStatus(
    loggedInUser: any,
    action: string = '',
    userId: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let formStatuses: any = await companyDb.query(
        `EXEC ${constant.P_SetLogedInStatus} @Action = @0, @UserName = @1`,
        [action, userId],
      );
      return formStatuses[0];
    } catch (error: any) {
      if (error.driverError) {
        Logger.error({
          clientId: '',
          src: 'auth/updateLoginStatus',
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

  async isLogedIn(token: string, aud: string) {
    try {
      aud = aud != undefined ? aud : 'http://localhost:4200';
      var decoded = await jwt.validateToken(token, aud);
      if (decoded) {
        return { isLoggedIn: true };
      } else {
        return {
          isLoggedIn: false,
        };
      }
    } catch (error: any) {
      return {
        isLoggedIn: false,
      };
    }
  }
}
