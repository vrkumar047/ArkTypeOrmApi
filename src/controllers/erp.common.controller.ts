import { Request, Response, NextFunction } from 'express';
import { CommonService } from '../services/common.service';
const commonService = new CommonService();
export class ErpCommonController {
  async getDashboardDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action;
      let role: string = req.params.role;
      let userId: string = req.params.userId;
      if (loggedInUser) {
        let data: any = await commonService.getDashboardDetails(
          loggedInUser,
          action,
          role,
          userId,
        );
        res.locals.data = data;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }
}
