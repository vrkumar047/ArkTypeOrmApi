import { Request, Response, NextFunction } from 'express';
import { CmdService } from '../services/cmd.service';
const cmdService = new CmdService();
export class CmdController {
  async getStates(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let countryCode: string = req.params.countryCode;
      if (loggedInUser) {
        let states: any[] = [];
        if (!res.locals.data) {
          states = await cmdService.getStates(loggedInUser, countryCode);
        } else {
          states = JSON.parse(res.locals.data);
        }

        res.locals.data = states;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }
}
