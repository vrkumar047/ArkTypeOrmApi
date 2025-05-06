import { Request, Response, NextFunction } from 'express';
import { CommonService } from '../services/common.service';
const commonService = new CommonService();
export class CommonController {
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

  async getBasicTableDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action;
      let userId: string = req.params.userId;
      if (loggedInUser) {
        let data: any = await commonService.getBasicTableDetails(
          loggedInUser,
          action,
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

  async getProspectusNo(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action;
      let branchCode: string = req.params.branchCode;
      let userId: string = req.params.userId;
      if (loggedInUser) {
        let data: any = await commonService.getProspectusNo(
          loggedInUser,
          action,
          branchCode,
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

  async getAddressDetail(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action;
      let countryId: string = req.params.countryId;
      let stateId: string = req.params.stateId;
      let districtId: string = req.params.districtId;
      let cityId: string = req.params.cityId;
      let userId: string = req.params.userId;
      if (loggedInUser) {
        let data: any = await commonService.getAddressDetail(
          loggedInUser,
          action,
          countryId,
          stateId,
          districtId,
          cityId,
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

  async getState(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      if (loggedInUser) {
        let data: any = await commonService.getState(loggedInUser);
        res.locals.data = data;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async getConstituency(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action;
      let stateCode: string =
        req.params.stateCode != 'stateCode' ? req.params.stateCode : '';
      let pcCode: string =
        req.params.pcCode != 'pcCode' ? req.params.pcCode : '';
      if (loggedInUser) {
        let data: any = await commonService.getConstituency(
          loggedInUser,
          action,
          stateCode,
          pcCode,
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

  async getFeeBatchAndSchemeList(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      let loggedInUser: any = req['currentUser'];
      let tableName: string =
        req.params.tableName != 'tableName' ? req.params.tableName : '';
      let branchCode: string =
        req.params.branchCode != 'branchCode' ? req.params.branchCode : '';
      let desigCode: string =
        req.params.desigCode != 'desigCode' ? req.params.desigCode : '';
      if (loggedInUser) {
        let data: any = await commonService.getFeeBatchAndSchemeList(
          loggedInUser,
          tableName,
          branchCode,
          desigCode,
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
