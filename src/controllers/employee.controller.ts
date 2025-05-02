import { Request, Response, NextFunction } from 'express';
import { EmployeeService } from '../services/employee.service';
const employeeService = new EmployeeService();
export class EmployeeController {
  async getStates(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let countryCode: string = req.params.countryCode;
      if (loggedInUser) {
        let states: any[] = [];
        if (!res.locals.data) {
          states = await employeeService.getStates(loggedInUser, countryCode);
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
