import axios from 'axios';
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

  async esiverificationlist(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let role: string = req.params.role ?? '';
      let branchCode: string = req.params.branchCode ?? '';
      let fromDate: string = req.params.fromDate ?? '';
      let toDate: string = req.params.toDate ?? '';
      let userId: string = req.params.userId ?? '';

      if (loggedInUser) {
        let data: any = await commonService.esiverificationlist(
          loggedInUser,
          action,
          role,
          branchCode,
          fromDate,
          toDate,
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

  async formStatus(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let role: string = req.params.role ?? '';
      let formNo: string = req.params.formNo ?? '';
      let userId: string = req.params.userId ?? '';

      if (loggedInUser) {
        let data: any = await commonService.formStatus(
          loggedInUser,
          action,
          role,
          formNo,
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

  async filteredFormList(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let role: string = req.params.role ?? '';
      let formNo: string = req.params.formNo ?? '';
      let filterText: string = req.params.filterText ?? '';
      let userId: string = req.params.userId ?? '';

      if (loggedInUser) {
        let data: any = await commonService.filteredFormList(
          loggedInUser,
          role,
          formNo,
          filterText,
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

  async empPicDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let formNo: string = req.params.formNo ?? '';

      if (loggedInUser) {
        let data: any = await commonService.empPicDetails(
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

  async getUserDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let agentCode: string = req.params.agentCode ?? '';
      let compCode: string = req.params.compCode ?? '';
      let searchText: string = req.params.searchText ?? '';

      if (loggedInUser) {
        let data: any = await commonService.getUserDetails(
          loggedInUser,
          action,
          agentCode,
          compCode,
          searchText,
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

  async isUserExist(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let checkFor: string = req.params.checkFor ?? '';
      let checkString: string = req.params.checkString ?? '';
      let userId: string = req.params.userId ?? '';

      if (loggedInUser) {
        let data: any = await commonService.isUserExist(
          loggedInUser,
          action,
          checkFor,
          checkString,
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

  async checkBasicDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let checkFor: string = req.params.checkFor ?? '';
      let checkString: string = req.params.checkString ?? '';
      let name: string = req.params.name ?? '';
      let formNo: string = req.params.formNo ?? '';

      if (loggedInUser) {
        let data: any = await commonService.checkBasicDetails(
          loggedInUser,
          checkFor,
          checkString,
          name,
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

  async assessmentDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let loginName: string = req.params.loginName ?? '';
      let assessType: string = req.params.assessType ?? '';
      let assessCode: string = req.params.assessCode ?? '';

      if (loggedInUser) {
        let data: any = await commonService.assessmentDetails(
          loggedInUser,
          action,
          loginName,
          assessType,
          assessCode,
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

  async getCondoDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let formNo: string = req.params.formNo ?? '';
      let branchCode: string = req.params.branchCode ?? '';

      if (loggedInUser) {
        let data: any = await commonService.getCondoDetails(
          loggedInUser,
          action,
          formNo,
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

  async getFileSequence(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let formNo: string = req.params.formNo ?? '';
      let docTypeId: string = req.params.docTypeId ?? '';

      if (loggedInUser) {
        let data: any = await commonService.getFileSequence(
          loggedInUser,
          formNo,
          docTypeId,
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

  async industryList(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let formNo: string = req.params.formNo ?? '';

      if (loggedInUser) {
        let data: any = await commonService.industryList(
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

  async userWiseBranchList(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let userId: string = req.params.userId ?? '';
      let compCode: string = req.params.compCode ?? '';

      if (loggedInUser) {
        let data: any = await commonService.userWiseBranchList(
          loggedInUser,
          userId,
          compCode,
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

  async getSearchedApplications(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.body.action ?? '';
      let regNo: string = req.body.regNo ?? '';
      let formNo: string = req.body.formNo ?? '';
      let name: string = req.body.name ?? '';
      let dob: string = req.body.dob ?? '';
      let mobileNo: string = req.body.mobileNo ?? '';
      let meetAllCrt: number =
        req.body.meetAllCrt != undefined ? parseInt(req.body.meetAllCrt) : 0;
      let userId: string = req.body.user_id ?? '';

      let applicationDetail: any = {
        action: action,
        regNo: regNo,
        formNo: formNo,
        name: name,
        dob: dob,
        mobileNo: mobileNo,
        meetAllCrt: meetAllCrt,
        userId: userId,
      };

      if (loggedInUser) {
        let data: any = await commonService.getSearchedApplications(
          loggedInUser,
          applicationDetail,
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

  async getSchemeDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.body.action ?? '';
      let companyCode: string = req.body.companyCode ?? '';
      let branchCode: string = req.body.branchCode ?? '';
      let desigCode: string = req.body.desigCode ?? '';

      if (loggedInUser) {
        let data: any = await commonService.getSchemeDetails(
          loggedInUser,
          action,
          companyCode,
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

  async postUanStatusDetail(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.body.action ?? '';
      let formNo: string = req.body.formNo ?? '';
      let branchCode: string = req.body.branchCode ?? '';
      let aadharNo: string = req.body.aadharNo ?? '';
      let aadharName: string = req.body.aadharName ?? '';
      let aadharDob: string = req.body.aadharDob ?? '';
      let uanNo: string = req.body.uanNo ?? '';
      let status: string = req.body.status ?? '';
      let userId: string = req.body.userId ?? '';

      let uanDetail: any = {
        action: action,
        formNo: formNo,
        branchCode: branchCode,
        aadharNo: aadharNo,
        aadharName: aadharName,
        aadharDob: aadharDob,
        uanNo: uanNo,
        status: status,
        userId: userId,
      };

      if (loggedInUser) {
        let data: any = await commonService.postUanStatusDetail(
          loggedInUser,
          uanDetail,
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

  async postApproveRejectElectronicDetail(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.body.action ?? '';
      let formNo: string = req.body.formNo ?? '';
      let defaultImage: string = req.body.defaultImage ?? '';
      let remark: string = req.body.remark ?? '';

      if (loggedInUser) {
        let data: any = await commonService.postApproveRejectElectronicDetail(
          loggedInUser,
          action,
          formNo,
          defaultImage,
          remark,
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

  async getReportList(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let userId: string = req.params.userId ?? '';

      if (loggedInUser) {
        let data: any = await commonService.getReportList(loggedInUser, userId);
        res.locals.data = data;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async getAppToken(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let appName: any = req.headers.appname ?? '';
     // if (loggedInUser) {
        let data: any = await commonService.getAppToken(loggedInUser, appName);
        res.locals.data = data;
        return res.json(res.locals.data);
      // } else {
      //   res.locals.error = 'Unauthorized';
      // }
    } catch (err) {
      res.locals.error = err;
    }
   // next();
  }

  async updateAppToken(req: Request, res: Response, next: NextFunction) {
    try {
        let data: any = await commonService.updateAppToken(undefined,'Coresyncapi');
        res.locals.data = data;
        return res.json(res.locals.data);
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err
        });
    }
  }
    async getMachines(req: Request, res: Response, next: NextFunction) {
    try {
        let data: any = await commonService.getMachines();
        res.locals.data = data.recordsets[0];
        return res.json(res.locals.data);
    } catch (err:any) {
      return res.status(500).json({
                      isError: true,
                      errMsg: err.message
                  });
    }
  }
      async getInstalledMachines(req: Request, res: Response, next: NextFunction) {
    try {
        let data: any = await commonService.getInstalledMachines();
        res.locals.data = data.recordsets[0];
        return res.json(res.locals.data);
    } catch (err) {
      res.locals.error = err;
    }
    //next();
  }
      async getRecruitmentCount(req: Request, res: Response, next: NextFunction) {
    try {
        let data: any = await commonService.getRecruitmentCount();
        res.locals.data = data.recordsets[0];
        return res.json(res.locals.data);
    } catch (err) {
      res.locals.error = err;
    }
    //next();
  }
}
