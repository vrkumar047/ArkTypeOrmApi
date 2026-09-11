import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service';
const dashboardService = new DashboardService();
export class DashboardController {
  async dashboardList(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.body.action ?? '';
      let userId: string = req.body.userId ?? '';
      let companyCode: string = req.body.companyCode ?? '';
      let branchCode: string = req.body.branchCode ?? '';

      if (loggedInUser) {
        let data: any = await dashboardService.dashboardList(
          loggedInUser,
          action,
          userId,
          companyCode,
          branchCode,
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

  async dashboardDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let dashBoardDetail: any = {};
      dashBoardDetail.userId = req.body.userId ?? '';
      dashBoardDetail.mode = req.body.mode ?? '';
      dashBoardDetail.companyCode = req.body.companyCode ?? '';
      dashBoardDetail.zoneCode = req.body.zoneCode ?? '';
      dashBoardDetail.regionCode = req.body.regionCode ?? '';
      dashBoardDetail.branchCode = req.body.branchCode ?? '';
      dashBoardDetail.branchType = req.body.branchType ?? '';
      dashBoardDetail.desigCode = req.body.desigCode ?? '';
      dashBoardDetail.formStatus = req.body.formStatus ?? '';
      dashBoardDetail.startDate = req.body.startDate ?? '';
      dashBoardDetail.endDate = req.body.endDate ?? '';
      dashBoardDetail.period = req.body.period ?? '';

      if (loggedInUser) {
        let data: any = await dashboardService.dashboardDetails(
          loggedInUser,
          dashBoardDetail,
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

  async activeBranchList(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let companyCode: string = req.body.companyCode ?? '';

      if (loggedInUser) {
        let data: any = await dashboardService.activeBranchList(
          loggedInUser,
          companyCode,
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

  async branchCameraDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let companyCode: string = req.body.companyCode ?? '';

      if (loggedInUser) {
        let data: any = await dashboardService.branchCameraDetails(
          loggedInUser,
          companyCode,
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

  async downloadReport(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let reportDetail: any = {};

      reportDetail.reportName = req.body.reportName ?? '';
      reportDetail.procName = req.body.procName ?? '';
      reportDetail.formatUrl = req.body.formatUrl ?? '';
      reportDetail.userId = req.body.userId ?? '';
      reportDetail.company = req.body.company ?? '';
      reportDetail.zone = req.body.zone ?? '';
      reportDetail.region = req.body.region ?? '';
      reportDetail.branch = req.body.branch ?? '';
      reportDetail.desig = req.body.desig ?? '';
      reportDetail.fromDate = req.body.fromDate ?? '';
      reportDetail.toDate = req.body.toDate ?? '';

      if (loggedInUser) {
        let data: any = await dashboardService.downloadReport(
          loggedInUser,
          reportDetail,
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

  async downloadVerifiedESI(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let reportDetail: any = {};

      reportDetail.action = req.body.action ?? '';
      reportDetail.role = req.body.role ?? '';
      reportDetail.branchCode = req.body.branchCode ?? '';
      reportDetail.fromDate = req.body.fromDate ?? '';
      reportDetail.toDate = req.body.toDate ?? '';
      reportDetail.userId = req.body.userId ?? '';

      if (loggedInUser) {
        let data: any = await dashboardService.downloadVerifiedESI(
          loggedInUser,
          reportDetail,
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
