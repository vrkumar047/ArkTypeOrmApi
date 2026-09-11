import { Request, Response, NextFunction } from 'express';
import { GetCompanyDb } from '../_dbs/mssql/sqlConnection';
//import { UserLogin } from '../entities/master/userLogin.entity';
import { AuthService } from '../services/auth.service';
import { PassThrough } from 'stream';
const authService = new AuthService();
export class AuthController {
  private authService: AuthService = new AuthService();

  async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      let UserName: string = req.body.UserName;
      let Pwd: string = req.body.Pwd;
      let userDetail: any = await authService.checkuser(UserName, Pwd);
      res.locals.data = userDetail;
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      let userDetail: any = req.body;
      let updatedUserDetail: any = await authService.signUp(userDetail);
      return res.json(updatedUserDetail);
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err
      });
    }
  }

  async logOut(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.body.action ?? '';
      let userId: string = req.body.userId ?? '';
      let loginStatus: any = await authService.updateLoginStatus(
        loggedInUser,
        action,
        userId,
      );
      res.locals.data = loginStatus;
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async isLogedIn(req: Request, res: Response, next: NextFunction) {
    try {
      const bearerToken = req.headers.authorization;
      let token: string = bearerToken.split(' ')[1];
      let aud = req.headers.origin;
      let isLoggedIn: any = await authService.isLogedIn(token, aud);
      res.locals.data = isLoggedIn;
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  // async refreshToken(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     let tokenDetail: any = req.body;
  //     let loginDetail: any = await authService.refreshToken(
  //       tokenDetail.refreshToken,
  //       tokenDetail.token,
  //     );
  //     res.locals.data = loginDetail;
  //   } catch (err) {
  //     res.locals.error = err;
  //   }
  //   next();
  // }
}
