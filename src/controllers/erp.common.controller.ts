import { Request, Response, NextFunction } from 'express';
import { CommonService } from '../services/common.service';
const commonService = new CommonService();
export class ErpCommonController {
  async getSnapShot(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      if (loggedInUser) {
        let data: any = await commonService.getSnapShot(loggedInUser);
        res.locals.data = data;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async getVisitPurposes(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      if (loggedInUser) {
        let visitPurposes: any[] = [];
        if (!res.locals.data) {
          visitPurposes = await commonService.getVisitPurposes(loggedInUser);
        } else {
          visitPurposes = JSON.parse(res.locals.data);
        }
        res.locals.data = visitPurposes;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async getCountries(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      if (loggedInUser) {
        let countries: any[] = [];
        if (!res.locals.data) {
          countries = await commonService.getCountries(loggedInUser);
        } else {
          countries = JSON.parse(res.locals.data);
        }
        res.locals.data = countries;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }
  async getStates(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let countryCode: string = req.params.countryCode;
      if (loggedInUser) {
        let states: any[] = [];
        if (!res.locals.data) {
          states = await commonService.getStates(loggedInUser, countryCode);
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

  async getDevicesForClient(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      if (loggedInUser) {
        let devices: any[] = [];
        devices = await commonService.getDevicesForClient(loggedInUser);
        res.locals.data = devices;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async getIdProofTypes(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      if (loggedInUser) {
        let idProofTypes: any[] = [];
        if (!res.locals.data) {
          idProofTypes = await commonService.getIdProofTypes(loggedInUser);
        } else {
          idProofTypes = JSON.parse(res.locals.data);
        }
        res.locals.data = idProofTypes;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  // async getCities(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     let loggedInUser: any = req['currentUser'];
  //     if (loggedInUser) {
  //       let states: StateResponse[] =
  //         await commonService.getCities(loggedInUser);
  //       res.locals.data = states;
  //     } else {
  //       res.locals.error = 'Unauthorized';
  //     }
  //   } catch (err) {
  //     res.locals.error = err;
  //   }
  //   next();
  // }
}
