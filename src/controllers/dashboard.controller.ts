import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service';
const dashboardService = new DashboardService();
export class DashboardController {
  async getStates(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let countryCode: string = req.params.countryCode;
      if (loggedInUser) {
        let states: any[] = [];
        if (!res.locals.data) {
          states = await dashboardService.getStates(loggedInUser, countryCode);
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
