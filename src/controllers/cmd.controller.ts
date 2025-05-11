import { Request, Response, NextFunction } from 'express';
import { CmdService } from '../services/cmd.service';
const cmdService = new CmdService();

export class CmdController {
  async execBat(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let countryCode: string = req.params.countryCode;
      if (loggedInUser) {
        let res: any = await cmdService.execBat(loggedInUser);

        res.locals.data = res;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }
  async pingCamera(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let companyCode: string = req.params.companyCode;
      if (loggedInUser) {
        let res: any = await cmdService.pingCamera(loggedInUser, companyCode);

        res.locals.data = res;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async execCommand(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let ip: string = req.params.ip;
      let userId: string = req.params.userid;
      let pwd: string = req.params.pwd;
      let branchCode: string = req.params.branchCode;
      //  if (loggedInUser) {
      let res: any = await cmdService.execCommand(ip, userId, pwd, branchCode);

      res.locals.data = res;
      // } else {
      //   res.locals.error = 'Unauthorized';
      // }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async closeBat(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let pid: string = req.params.pid;
      //   if (loggedInUser) {
      let res: any = await cmdService.closeBat(pid);

      res.locals.data = res;
      // } else {
      //   res.locals.error = 'Unauthorized';
      // }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async closeCommand(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let pid: string = req.params.pid;
      //   if (loggedInUser) {
      let res: any = await cmdService.closeCommand();

      res.locals.data = res;
      // } else {
      //   res.locals.error = 'Unauthorized';
      // }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }
}
