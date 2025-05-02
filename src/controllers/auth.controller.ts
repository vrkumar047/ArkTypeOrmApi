import { Request, Response, NextFunction } from 'express';
import { GetCompanyDb } from '../_dbs/mssql/pgConnection';
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
      let userName: string = req.body.userName;
      let password: string = req.body.password;
      let userDetail: any = await authService.checkuser(userName, password);
      res.locals.data = userDetail;
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async logOut(req: Request, res: Response, next: NextFunction) {
    try {
      let clientId: string = req.body.clientId;
      let userName: string = req.body.userName;
      let password: string = req.body.password;
      let userDetail: any = await authService.checkuser(userName, password);
      res.locals.data = userDetail;
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async isLogedIn(req: Request, res: Response, next: NextFunction) {
    try {
      let userName: string = req.body.userName;
      let password: string = req.body.password;
      let userDetail: any = await authService.checkuser(userName, password);
      res.locals.data = userDetail;
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
