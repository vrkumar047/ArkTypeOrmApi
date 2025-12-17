import { Request, Response, NextFunction } from 'express';
import { ServiceService } from '../services/service.service';
const serviceService = new ServiceService();
export class ServiceController {
  async empBasicDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let formNo: string = req.params.formNo ?? '';
      if (loggedInUser) {
        let basidDetails: any[] = [];
        basidDetails = await serviceService.empBasicDetails(
          loggedInUser,
          action,
          formNo,
        );
        res.locals.data = basidDetails;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }
  async getArkData(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let data: any = {};
      data.action = req.params.action ?? '';
      data.fromDate = req.params.fromDate ?? '';
      data.toDate = req.params.toDate ?? '';
      if (loggedInUser) {
        let dataDetail: any = {};
        dataDetail = await serviceService.getArkData(loggedInUser, data);
        res.locals.data = dataDetail;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }
  async postArkData(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let formNo: string = req.params.formNo ?? '';
      if (loggedInUser) {
        let states: any[] = [];
        if (!res.locals.data) {
          states = await serviceService.postArkData(
            loggedInUser,
            action,
            formNo,
          );
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
