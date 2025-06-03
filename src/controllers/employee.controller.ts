import { Request, Response, NextFunction } from 'express';
import { EmployeeService } from '../services/employee.service';
const employeeService = new EmployeeService();
export class EmployeeController {
  async getFormNo(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let head: string = req.params.head ?? '';
      let branchCode: string = req.params.branchCode ?? '';
      let updateBit: number =
        req.params.updateBit != undefined ? parseInt(req.params.updateBit) : 0;
      if (loggedInUser) {
        let data: any = await employeeService.getFormNo(
          loggedInUser,
          head,
          branchCode,
          updateBit,
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

  async addEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let employeeDetail: any = req.body;
      if (loggedInUser) {
        let data: any = await employeeService.addEmployee(
          loggedInUser,
          employeeDetail,
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
