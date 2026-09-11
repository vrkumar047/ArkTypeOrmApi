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

  async otpDetail(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let formNo: string = req.params.formNo ?? '';
      let otpNo: number =
        req.params.otpNo != undefined ? parseInt(req.params.otpNo) : 0;
      let userId: string = req.params.userId ?? '';

      if (loggedInUser) {
        let data: any = await employeeService.otpDetail(
          loggedInUser,
          action,
          formNo,
          otpNo,
          userId,
        );
        res.locals.data = data[0].status;
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
        weightKg:
          req.body.weightKg != undefined ? parseFloat(req.body.weightKg) : 0,
        bmi: req.body.bmi != undefined ? parseFloat(req.body.bmi) : 0,
        recordId:
          req.body.recordId != undefined ? parseFloat(req.body.recordId) : 0,
        // chestCm:
        //   req.body.chestCm != undefined ? parseFloat(req.body.chestCm) : 0,
        // chestFt:
        //   req.body.chestFt != undefined ? parseFloat(req.body.chestFt) : 0,
        // head: req.body.head != undefined ? parseFloat(req.body.head) : 0,
        // heal: req.body.heal != undefined ? parseFloat(req.body.heal) : 0,
        shirtChest:
          req.body.shirtChest != undefined
            ? parseFloat(req.body.shirtChest)
            : 0,
        shirtShoulder:
          req.body.shirtShoulder != undefined
            ? parseFloat(req.body.shirtShoulder)
            : 0,
        shirtSleeve:
          req.body.shirtSleeve != undefined
            ? parseFloat(req.body.shirtSleeve)
            : 0,
        shirtLength:
          req.body.shirtLength != undefined
            ? parseFloat(req.body.shirtLength)
            : 0,
        pantWaist:
          req.body.pantWaist != undefined ? parseFloat(req.body.pantWaist) : 0,
        pantHip:
          req.body.pantHip != undefined ? parseFloat(req.body.pantHip) : 0,
        pantLength:
          req.body.pantLength != undefined
            ? parseFloat(req.body.pantLength)
            : 0,
        capSize:
          req.body.capSize != undefined ? parseFloat(req.body.capSize) : 0,
        shoeSize:
          req.body.shoeSize != undefined ? parseInt(req.body.shoeSize) : 0,
        fullPicture: req.body.fullPicture ?? '',
        condonation: req.body.condonation ?? '',
        isVerified:
          req.body.isVerified != undefined ? parseInt(req.body.isVerified) : 0,
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

  async updateFormStatus(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let formDetail: any = {
        action: req.params.action ?? '',
        formNo: req.params.formNo ?? '',
        formName: req.params.formName ?? '',
        status: req.params.status ?? '',
        userId: req.params.userId ?? '',
      };
      if (loggedInUser) {
        let data: any = await employeeService.updateFormStatus(
          loggedInUser,
          formDetail,
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

  async getEmployeeBasicDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let formNo: string = req.params.formNo ?? '';

      if (loggedInUser) {
        let data: any = await employeeService.getEmployeeBasicDetails(
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

  async getUploadedFormDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let formNo: string = req.params.formNo ?? '';

      if (loggedInUser) {
        let data: any = await employeeService.getUploadedFormDetails(
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

  async removedocument(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let formNo: string = req.params.formNo ?? '';
      let docTypeId: string = req.params.docTypeId ?? '';
      let docId: string = req.params.docId ?? '';

      if (loggedInUser) {
        let data: any = await employeeService.removedocument(
          loggedInUser,
          action,
          formNo,
          docTypeId,
          docId,
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

  async getEduLangDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let formNo: string = req.params.formNo ?? '';

      if (loggedInUser) {
        let data: any = await employeeService.getEduLangDetails(
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

  async getExpExMEsiDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let formNo: string = req.params.formNo ?? '';

      if (loggedInUser) {
        let data: any = await employeeService.getExpExMEsiDetails(
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

  async getBMIDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let formNo: string = req.params.formNo ?? '';

      if (loggedInUser) {
        let data: any = await employeeService.getBMIDetails(
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

  async updateRqccDocument(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let documentDetail: any = {
        action: req.body.action ?? '',
        formNo: req.body.formNo ?? '',
        appForm: req.body.appForm != undefined ? parseInt(req.body.appForm) : 0,
        identityProof:
          req.body.identityProof != undefined
            ? parseInt(req.body.identityProof)
            : 0,
        addressProof:
          req.body.addressProof != undefined
            ? parseInt(req.body.addressProof)
            : 0,
        expProof:
          req.body.expProof != undefined ? parseInt(req.body.expProof) : 0,
        ageProof:
          req.body.ageProof != undefined ? parseInt(req.body.ageProof) : 0,
        eduProof:
          req.body.eduProof != undefined ? parseInt(req.body.eduProof) : 0,
        driverProof:
          req.body.driverProof != undefined
            ? parseInt(req.body.driverProof)
            : 0,
        gunmanProof:
          req.body.gunmanProof != undefined
            ? parseInt(req.body.gunmanProof)
            : 0,
        exMProof:
          req.body.exMProof != undefined ? parseInt(req.body.exMProof) : 0,
        bankAccProof:
          req.body.bankAccProof != undefined
            ? parseInt(req.body.bankAccProof)
            : 0,
        OthersProof:
          req.body.OthersProof != undefined
            ? parseInt(req.body.OthersProof)
            : 0,
        fireMProof:
          req.body.fireMProof != undefined ? parseInt(req.body.fireMProof) : 0,
        aadharCnLProof:
          req.body.aadharCnLProof != undefined
            ? parseInt(req.body.aadharCnLProof)
            : 0,
        uanNoProof:
          req.body.uanNoProof != undefined ? parseInt(req.body.uanNoProof) : 0,
        casteCertProof:
          req.body.casteCertProof != undefined
            ? parseInt(req.body.casteCertProof)
            : 0,
        expFromUAN:
          req.body.expFromUAN != undefined ? parseInt(req.body.expFromUAN) : 0,
        expFromESI:
          req.body.expFromESI != undefined ? parseInt(req.body.expFromESI) : 0,
        withPhysical:
          req.body.withPhysical != undefined
            ? parseInt(req.body.withPhysical)
            : 0,
        userId: req.body.userId ?? '',
      };

      if (loggedInUser) {
        let data: any = await employeeService.updateRqccDocument(
          loggedInUser,
          documentDetail,
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

  async updateApprovalStatus(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let statusDetail: any = {
        action: req.body.action ?? [],
        formLists: req.body.formLists ?? [],
        userId: req.body.userId ?? [],
      };

      if (loggedInUser) {
        let data: any = await employeeService.updateApprovalStatus(
          loggedInUser,
          statusDetail,
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

  async updateEmployeeDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let employeeDetail: any = {
        action: req.body.action ?? '',
        formNo: req.body.formNo ?? '',
        candType: req.body.candType ?? '',
        dob: req.body.dob ?? '',
        Aadhar_Dob: req.body.Aadhar_Dob ?? '',
        UanNo: req.body.UanNo ?? '',
        userId: req.body.userId ?? '',
      };

      if (loggedInUser) {
        let data: any = await employeeService.updateEmployeeDetails(
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

  async updateAllFormStatus(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let statusDetails: any = {
        action: req.body.action ?? '',
        form_no: req.body.form_no ?? '',
        basicDetail:
          req.body.basicDetail != undefined
            ? parseInt(req.body.basicDetail)
            : 0,
        documentDetail:
          req.body.documentDetail != undefined
            ? parseInt(req.body.documentDetail)
            : 0,
        educationDetail:
          req.body.educationDetail != undefined
            ? parseInt(req.body.educationDetail)
            : 0,
        experienceDetail:
          req.body.experienceDetail != undefined
            ? parseInt(req.body.experienceDetail)
            : 0,
        phyMeasurDetail:
          req.body.phyMeasurDetail != undefined
            ? parseInt(req.body.phyMeasurDetail)
            : 0,
        assessmentDetail:
          req.body.assessmentDetail != undefined
            ? parseInt(req.body.assessmentDetail)
            : 0,
        scoreDetail:
          req.body.scoreDetail != undefined
            ? parseInt(req.body.scoreDetail)
            : 0,
        electronicDetail:
          req.body.electronicDetail != undefined
            ? parseInt(req.body.electronicDetail)
            : 0,
        familyDetail:
          req.body.familyDetail != undefined
            ? parseInt(req.body.familyDetail)
            : 0,
        bankDetail:
          req.body.bankDetail != undefined ? parseInt(req.body.bankDetail) : 0,
        printCardDetail:
          req.body.printCardDetail != undefined
            ? parseInt(req.body.printCardDetail)
            : 0,
        rqccDocVerified:
          req.body.rqccDocVerified != undefined
            ? parseInt(req.body.rqccDocVerified)
            : 0,
        rqccPhyVerified:
          req.body.rqccPhyVerified != undefined
            ? parseInt(req.body.rqccPhyVerified)
            : 0,
        userId: req.body.userId ?? '',
      };

      if (loggedInUser) {
        let data: any = await employeeService.updateAllFormStatus(
          loggedInUser,
          statusDetails,
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

  async updateRegNo(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let regNoDetails: any = {
        formNo: req.body.formNo ?? '',
        regNo: req.body.regNo ?? '',
        userId: req.body.userId ?? '',
      };

      if (loggedInUser) {
        let data: any = await employeeService.updateRegNo(
          loggedInUser,
          regNoDetails,
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

  async updateApprovalStatusDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      let loggedInUser: any = req['currentUser'];
      let statusDetails: any = {
        action: req.body.action ?? '',
        formNo: req.body.formNo ?? '',
        name: req.body.name ?? '',
        dob: req.body.dob ?? '',
        uanNo: req.body.uanNo ?? '',
        accountNo: req.body.accountNo ?? '',
        status: req.body.status ?? '',
        statusReason:
          req.body.statusReason != undefined
            ? parseInt(req.body.statusReason)
            : 0,
        otherRemark: req.body.otherRemark ?? '',
        userId: req.body.userId ?? '',
      };

      if (loggedInUser) {
        let data: any = await employeeService.updateApprovalStatusDetails(
          loggedInUser,
          statusDetails,
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

  async sendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let otpDetail: any = {
        formNo: req.body.formNo ?? '',
        otpUrl: req.body.otpUrl ?? '',
      };

      if (loggedInUser) {
        let data: any = await employeeService.sendOtp(loggedInUser, otpDetail);
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
