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

  async getCaste(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let casteCategory: string =
        req.params.casteCategory != 'casteCategory'
          ? req.params.casteCategory
          : '';
      let stateCode: string =
        req.params.stateCode != 'stateCode' ? req.params.stateCode : '';

      if (loggedInUser) {
        let data: any = await commonService.getCaste(
          loggedInUser,
          casteCategory,
          stateCode,
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

  async getCasteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let stateCode: string =
        req.params.stateCode != 'stateCode' ? req.params.stateCode : '';
      if (loggedInUser) {
        let data: any = await commonService.getCasteCategory(
          loggedInUser,
          stateCode,
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

  async getReasonList(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      if (loggedInUser) {
        let data: any = await commonService.getReasonList(loggedInUser, action);
        res.locals.data = data;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async getDocumentList(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let post: string = req.params.post ?? '';
      let candType: string = req.params.candType ?? '';
      if (loggedInUser) {
        let data: any = await commonService.getDocumentList(
          loggedInUser,
          post,
          candType,
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

  async getRequiredDocument(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let docType: number =
        req.params.docType != undefined ? parseInt(req.params.docType) : 0;
      let post: string = req.params.post ?? '';
      let candType: string = req.params.candType ?? '';
      if (loggedInUser) {
        let data: any = await commonService.getRequiredDocument(
          loggedInUser,
          docType,
          post,
          candType,
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

  async getRequiredDocs(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let post: string = req.params.post ?? '';
      let candType: string = req.params.candType ?? '';
      if (loggedInUser) {
        let data: any = await commonService.getRequiredDocs(
          loggedInUser,
          post,
          candType,
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

  async getApplicableDocType(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let docCode: number =
        req.params.docCode != undefined ? parseInt(req.params.docCode) : 0;
      if (loggedInUser) {
        let data: any = await commonService.getApplicableDocType(
          loggedInUser,
          docCode,
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

  async getDocumentForVerify(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let post: string = req.params.post ?? '';
      let candType: string = req.params.candType ?? '';
      let isBranch: number =
        req.params.isBranch != undefined ? parseInt(req.params.isBranch) : 0;
      if (loggedInUser) {
        let data: any = await commonService.getDocumentForVerify(
          loggedInUser,
          post,
          candType,
          isBranch,
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

  async getMandatoryDocList(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let post: string = req.params.post ?? '';
      let candType: string = req.params.candType ?? '';
      if (loggedInUser) {
        let data: any = await commonService.getMandatoryDocList(
          loggedInUser,
          post,
          candType,
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

  async getEducationDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let formNo: string = req.params.formNo ?? '';
      if (loggedInUser) {
        let data: any = await commonService.getEducationDetails(
          loggedInUser,
          action,
          formNo,
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

  async getLanguageDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let formNo: string = req.params.formNo ?? '';
      if (loggedInUser) {
        let data: any = await commonService.getLanguageDetails(
          loggedInUser,
          action,
          formNo,
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

  async getExperienceDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let formNo: string = req.params.formNo ?? '';
      if (loggedInUser) {
        let data: any = await commonService.getExperienceDetails(
          loggedInUser,
          action,
          formNo,
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

  async getExManExperienceDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let formNo: string = req.params.formNo ?? '';
      if (loggedInUser) {
        let data: any = await commonService.getExManExperienceDetails(
          loggedInUser,
          action,
          formNo,
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

  async getEsiServerDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let formNo: string = req.params.formNo ?? '';
      let esiNo: string = req.params.esiNo ?? '';
      let userId: string = req.params.userId ?? '';
      if (loggedInUser) {
        let data: any = await commonService.getEsiServerDetails(
          loggedInUser,
          action,
          formNo,
          esiNo,
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

  async getFamilyDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let formNo: string = req.params.formNo ?? '';
      if (loggedInUser) {
        let data: any = await commonService.getFamilyDetails(
          loggedInUser,
          action,
          formNo,
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

  async getPhysicalDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let formNo: string = req.params.formNo ?? '';
      if (loggedInUser) {
        let data: any = await commonService.getPhysicalDetails(
          loggedInUser,
          action,
          formNo,
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

  async getBankDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let formNo: string = req.params.formNo ?? '';
      if (loggedInUser) {
        let data: any = await commonService.getBankDetails(
          loggedInUser,
          action,
          formNo,
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

  async getBankDetailsIFSCWise(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      let loggedInUser: any = req['currentUser'];
      let ifscCode: string = req.params.ifscCode ?? '';
      if (loggedInUser) {
        let data: any = await commonService.getBankDetailsIFSCWise(
          loggedInUser,
          ifscCode,
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

  async getDesignationList(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let branchCode: string = req.params.branchCode ?? '';
      let userId: string = req.params.userId ?? '';

      if (loggedInUser) {
        let data: any = await commonService.getDesignationList(
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

  async getTempDeploymentFormList(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      let loggedInUser: any = req['currentUser'];
      let userId: string = req.params.userId ?? '';

      if (loggedInUser) {
        let data: any = await commonService.getTempDeploymentFormList(
          loggedInUser,
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

  async getUnApprovedDocuments(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      let loggedInUser: any = req['currentUser'];
      let formNo: number =
        req.params.formNo != undefined ? parseInt(req.params.formNo) : 0;

      if (loggedInUser) {
        let data: any = await commonService.getUnApprovedDocuments(
          loggedInUser,
          formNo,
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

  async getTempDeploymentApplicationDetail(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      let loggedInUser: any = req['currentUser'];
      let formNo: number =
        req.params.formNo != undefined ? parseInt(req.params.formNo) : 0;

      if (loggedInUser) {
        let data: any = await commonService.getTempDeploymentApplicationDetail(
          loggedInUser,
          formNo,
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

  async updateTempDeploymentDocumentStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      let loggedInUser: any = req['currentUser'];
      let docsStatus: string = req.body.docsStatus ?? '';
      let userId: string = req.body.userId ?? '';

      if (loggedInUser) {
        let data: any = await commonService.updateTempDeploymentDocumentStatus(
          loggedInUser,
          docsStatus,
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

  async RqccDocumentDetail(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let formNo: string = req.params.formNo ?? '';

      if (loggedInUser) {
        let data: any = await commonService.RqccDocumentDetail(
          loggedInUser,
          action,
          formNo,
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

  async CandidatTypeList(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let branchCode: string = req.params.branchCode ?? '';

      if (loggedInUser) {
        let data: any = await commonService.CandidatTypeList(
          loggedInUser,
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

  async GetList(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let userId: string = req.params.userId ?? '';

      if (loggedInUser) {
        let data: any = await commonService.GetList(
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

  async formlist(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let role: string = req.params.role ?? '';
      let branchCode: string = req.params.branchCode ?? '';
      let desig: string = req.params.desig ?? '';
      let month: string = req.params.month ?? '';
      let year: string = req.params.year ?? '';
      let userId: string = req.params.userId ?? '';

      if (loggedInUser) {
        let data: any = await commonService.formlist(
          loggedInUser,
          action,
          role,
          branchCode,
          desig,
          month,
          year,
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
