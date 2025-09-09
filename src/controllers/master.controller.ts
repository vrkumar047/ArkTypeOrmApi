import { Request, Response, NextFunction } from 'express';
import { GetCompanyDb } from '../_dbs/mssql/sqlConnection';
import { MasterService } from '../services/master.service';
import { PassThrough } from 'stream';
const masterService = new MasterService();
export class MasterController {
  async userDetail(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let userDetail: any = req.body;
      let updatedUserDetail: any = await masterService.userDetail(
        loggedInUser,
        userDetail,
      );
      res.locals.data = updatedUserDetail;
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async roleDetail(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let roleDetail: any = req.body;
      let updatedRoleDetail: any = await masterService.roleDetail(
        loggedInUser,
        roleDetail,
      );
      res.locals.data = updatedRoleDetail;
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async userBranchMapping(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let mappingDetail: any = req.body;
      let updatedMappingDetail: any = await masterService.userBranchMapping(
        loggedInUser,
        mappingDetail,
      );
      res.locals.data = updatedMappingDetail;
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async documentMapping(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let mappingDetail: any = req.body;
      let updatedMappingDetail: any = await masterService.documentMapping(
        loggedInUser,
        mappingDetail,
      );
      res.locals.data = updatedMappingDetail;
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async documentManagement(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let docDetail: any = req.body;
      let updatedDocDetail: any = await masterService.documentManagement(
        loggedInUser,
        docDetail,
      );
      res.locals.data = updatedDocDetail;
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async branchMaster(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let branchDetail: any = req.body;
      let updatedBranchDetail: any = await masterService.branchMaster(
        loggedInUser,
        branchDetail,
      );
      res.locals.data = updatedBranchDetail;
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async documentMaster(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let docDetail: any = req.body;
      let updatedDocDetail: any = await masterService.documentMaster(
        loggedInUser,
        docDetail,
      );
      res.locals.data = updatedDocDetail;
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async designationMaster(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let desigDetail: any = req.body;
      let updatedDesigDetail: any = await masterService.designationMaster(
        loggedInUser,
        desigDetail,
      );
      res.locals.data = updatedDesigDetail;
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  // async roleDetail(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     let loggedInUser: any = req['currentUser'];
  //     let roleDetail: any = req.body;
  //     let updatedRoleDetail: any = await masterService.roleDetail(
  //       loggedInUser,
  //       roleDetail,
  //     );
  //     res.locals.data = updatedRoleDetail;
  //   } catch (err) {
  //     res.locals.error = err;
  //   }
  //   next();
  // }

  async getEmployeeDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let regNo: string = req.params.RegNo;
      let empDetail: any = await masterService.getEmployeeDetails(
        loggedInUser,
        regNo,
      );
      res.locals.data = empDetail;
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  // async roleDetail(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     let loggedInUser: any = req['currentUser'];
  //     let roleDetail: any = req.body;
  //     let updatedRoleDetail: any = await masterService.roleDetail(
  //       loggedInUser,
  //       roleDetail,
  //     );
  //     res.locals.data = updatedRoleDetail;
  //   } catch (err) {
  //     res.locals.error = err;
  //   }
  //   next();
  // }

  // async roleDetail(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     let loggedInUser: any = req['currentUser'];
  //     let roleDetail: any = req.body;
  //     let updatedRoleDetail: any = await masterService.roleDetail(
  //       loggedInUser,
  //       roleDetail,
  //     );
  //     res.locals.data = updatedRoleDetail;
  //   } catch (err) {
  //     res.locals.error = err;
  //   }
  //   next();
  // }
}
