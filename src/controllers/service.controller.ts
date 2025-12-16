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
        let states: any[] = [];
        if (!res.locals.data) {
          states = await serviceService.empBasicDetails(
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
