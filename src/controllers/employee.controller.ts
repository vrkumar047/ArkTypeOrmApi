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

  async getOtpDetail(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let formNo: string = req.params.formNo ?? '';
      let otpNo: number =
        req.params.otpNo != undefined ? parseInt(req.params.otpNo) : 0;
      let userId: string = req.params.userId ?? '';

      if (loggedInUser) {
        let data: any = await employeeService.getOtpDetail(
          loggedInUser,
          action,
          formNo,
          otpNo,
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

  async addEducationDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let eduDetail: any = {};

      eduDetail.action = req.body.action ?? '';
      eduDetail.formNo = req.body.formNo ?? '';
      eduDetail.classCode = req.body.classCode ?? 0;
      eduDetail.passingYear = req.body.passingYear ?? '';
      eduDetail.markPc = req.body.markPc ?? 0;
      eduDetail.board = req.body.board ?? '';
      eduDetail.institute = req.body.institute ?? '';
      eduDetail.remarks = req.body.remarks ?? '';
      eduDetail.condoRemark = req.body.condoRemark ?? '';
      eduDetail.userId = req.body.userId ?? '';

      if (loggedInUser) {
        let data: any = await employeeService.addEducationDetails(
          loggedInUser,
          eduDetail,
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

  async removeEducationDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let formNo: string = req.params.formNo ?? '';
      let classCode: number =
        req.body.classCode != undefined ? parseInt(req.params.classCode) : 0;

      if (loggedInUser) {
        let data: any = await employeeService.removeEducationDetails(
          loggedInUser,
          action,
          formNo,
          classCode,
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

  async addLanguageDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let languageDetail: any = {
        action: req.body.action ?? '',
        formNo: req.body.formNo ?? '',
        lngId: req.body.lngId != undefined ? parseInt(req.body.lngId) : 0,
        proficiency: req.body.proficiency ?? '',
        canRead: req.body.canRead != undefined ? parseInt(req.body.canRead) : 0,
        canWrite:
          req.body.canWrite != undefined ? parseInt(req.body.canWrite) : 0,
        canSpeak:
          req.body.canSpeak != undefined ? parseInt(req.body.canSpeak) : 0,
        userId: req.body.userId ?? '',
      };

      if (loggedInUser) {
        let data: any = await employeeService.addLanguageDetails(
          loggedInUser,
          languageDetail,
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

  async addCvExpDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let expDetail: any = {
        action: req.body.action ?? '',
        formNo: req.body.formNo ?? '',
        org: req.body.org ?? '',
        orgType: req.body.orgType ?? '',
        empId: req.body.empId ?? '',
        uanPFNo: req.body.uanPFNo ?? '',
        esiNo: req.body.esiNo ?? '',
        lastRank: req.body.lastRank ?? '',
        isBhCert: req.body.isBhCert ?? '',
        isEsiVeri:
          req.body.isEsiVeri != undefined ? parseInt(req.body.isEsiVeri) : 0,
        isExpFromUan:
          req.body.isExpFromUan != undefined
            ? parseInt(req.body.isExpFromUan)
            : 0,
        fromDate: req.body.fromDate ?? '',
        toDate: req.body.toDate ?? '',
        remarks: req.body.remarks ?? '',
        userId: req.body.userId ?? '',
      };

      if (loggedInUser) {
        let data: any = await employeeService.addCvExpDetails(
          loggedInUser,
          expDetail,
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

  async removeCvExpDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let formNo: string = req.params.formNo ?? '';
      let orgType: number =
        req.body.orgType != undefined ? parseInt(req.params.orgType) : 0;

      if (loggedInUser) {
        let data: any = await employeeService.removeCvExpDetails(
          loggedInUser,
          action,
          formNo,
          orgType,
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

  async addExManExpDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let exManDetail: any = {
        action: req.body.action ?? '',
        formNo: req.body.formNo ?? '',
        serviceType: req.body.serviceType ?? '',
        org: req.body.org ?? '',
        serviceId: req.body.serviceId ?? '',
        uanPFNo: req.body.uanPFNo ?? '',
        esiNo: req.body.esiNo ?? '',
        lastRank: req.body.lastRank ?? '',
        fromDate: req.body.fromDate ?? '',
        toDate: req.body.toDate ?? '',
        remarks: req.body.remarks ?? '',
        userId: req.body.userId ?? '',
      };

      if (loggedInUser) {
        let data: any = await employeeService.addExManExpDetails(
          loggedInUser,
          exManDetail,
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

  async removeExManExpDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let formNo: string = req.params.formNo ?? '';
      let serviceType: string = req.params.serviceType ?? '';
      let org: string = req.params.org ?? '';

      if (loggedInUser) {
        let data: any = await employeeService.removeExManExpDetails(
          loggedInUser,
          action,
          formNo,
          serviceType,
          org,
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

  async addEsiServerDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let esiDetail: any = {
        action: req.body.action ?? '',
        formNo: req.body.formNo ?? '',
        empName: req.body.empName ?? '',
        uhidNo: req.body.uhidNo ?? '',
        esiNo: req.body.esiNo ?? '',
        insNo: req.body.insNo ?? '',
        phoneNo: req.body.phoneNo ?? '',
        aadharNo: req.body.aadharNo ?? '',
        dobDDMMMYYYY: req.body.dobDDMMMYYYY ?? '',
        regDateDDMMMYYYY: req.body.regDateDDMMMYYYY ?? '',
        firstRegDateDDMMMYYYY: req.body.firstRegDateDDMMMYYYY ?? '',
        currentRegDateDDMMMYYYY: req.body.currentRegDateDDMMMYYYY ?? '',
        oldestEsiDateDDMMMYYYY: req.body.oldestEsiDateDDMMMYYYY ?? '',
        userId: req.body.userId ?? '',
      };

      if (loggedInUser) {
        let data: any = await employeeService.addEsiServerDetails(
          loggedInUser,
          esiDetail,
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

  async removeEsiServerDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let formNo: string = req.params.formNo ?? '';
      let esiNo: string = req.params.esiNo ?? '';

      if (loggedInUser) {
        let data: any = await employeeService.removeEsiServerDetails(
          loggedInUser,
          action,
          formNo,
          esiNo,
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

  async addFamilyDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let familyDetail: any = {
        action: req.body.action ?? '',
        formNo: req.body.formNo ?? '',
        name: req.body.name ?? '',
        dob: req.body.dob ?? '',
        relation: req.body.relation ?? '',
        isDpndnt:
          req.body.isDpndnt != undefined ? parseInt(req.body.isDpndnt) : 0,
        isNmnee: req.body.isNmnee != undefined ? parseInt(req.body.isNmnee) : 0,
        nomineePerc:
          req.body.nomineePerc != undefined
            ? parseInt(req.body.nomineePerc)
            : 0,
        age: req.body.age != undefined ? parseInt(req.body.age) : 0,
        userId: req.body.userId ?? '',
      };

      if (loggedInUser) {
        let data: any = await employeeService.addFamilyDetails(
          loggedInUser,
          familyDetail,
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

  async removeFamilyDetail(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let formNo: string = req.params.formNo ?? '';
      let name: string = req.params.name ?? '';

      if (loggedInUser) {
        let data: any = await employeeService.removeFamilyDetail(
          loggedInUser,
          action,
          formNo,
          name,
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

  async addPhysicalDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let physicalDetail: any = {
        action: req.body.action ?? '',
        formNo: req.body.formNo ?? '',
        heightCm:
          req.body.heightCm != undefined ? parseFloat(req.body.heightCm) : 0,
        heightFt:
          req.body.heightFt != undefined ? parseFloat(req.body.heightFt) : 0,
        chestCm:
          req.body.chestCm != undefined ? parseFloat(req.body.chestCm) : 0,
        chestFt:
          req.body.chestFt != undefined ? parseFloat(req.body.chestFt) : 0,
        weightKg:
          req.body.weightKg != undefined ? parseFloat(req.body.weightKg) : 0,
        head: req.body.head != undefined ? parseFloat(req.body.head) : 0,
        heal: req.body.heal != undefined ? parseFloat(req.body.heal) : 0,
        shirtChest:
          req.body.shirtChest != undefined
            ? parseFloat(req.body.shirtChest)
            : 0,
        shirtSholder:
          req.body.shirtSholder != undefined
            ? parseFloat(req.body.shirtSholder)
            : 0,
        shirtSleev:
          req.body.shirtSleev != undefined
            ? parseFloat(req.body.shirtSleev)
            : 0,
        shirtLength:
          req.body.shirtLength != undefined
            ? parseFloat(req.body.shirtLength)
            : 0,
        paintWaist:
          req.body.paintWaist != undefined
            ? parseFloat(req.body.paintWaist)
            : 0,
        paintHip:
          req.body.paintHip != undefined ? parseFloat(req.body.paintHip) : 0,
        paintLength:
          req.body.paintLength != undefined
            ? parseFloat(req.body.paintLength)
            : 0,
        capSize:
          req.body.capSize != undefined ? parseFloat(req.body.capSize) : 0,
        shoeSize:
          req.body.shoeSize != undefined ? parseInt(req.body.shoeSize) : 0,
        fullPicture: req.body.fullPicture ?? '',
        condonation: req.body.condonation ?? '',
        isVrified:
          req.body.isVrified != undefined ? parseInt(req.body.isVrified) : 0,
        rqccAgent: req.body.rqccAgent ?? '',
        verifiedOn: req.body.verifiedOn ?? '',
        userId: req.body.userId ?? '',
      };

      if (loggedInUser) {
        let data: any = await employeeService.addPhysicalDetails(
          loggedInUser,
          physicalDetail,
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

  async removePhysicalDetail(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let formNo: string = req.params.formNo ?? '';

      if (loggedInUser) {
        let data: any = await employeeService.removePhysicalDetail(
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

  async addBankDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let bankDetail: any = {
        action: req.body.action ?? '',
        formNo: req.body.formNo ?? '',
        ifscCode: req.body.ifscCode ?? '',
        bankName: req.body.bankName ?? '',
        accountNo: req.body.accountNo ?? '',
        bankBranch: req.body.bankBranch ?? '',
        bankBranchAddress: req.body.bankBranchAddress ?? '',
        bankDetail: req.body.bankDetail ?? '',
        bankUpdatedInERP:
          req.body.bankUpdatedInERP != undefined
            ? parseInt(req.body.bankUpdatedInERP)
            : 0,
        userId: req.body.userId ?? '',
      };
      if (loggedInUser) {
        let data: any = await employeeService.addBankDetails(
          loggedInUser,
          bankDetail,
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

  async removeBankDetail(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let formNo: string = req.params.formNo ?? '';

      if (loggedInUser) {
        let data: any = await employeeService.removeBankDetail(
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
}
