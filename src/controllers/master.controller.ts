import { Request, Response, NextFunction } from "express";
import { GetCompanyDb } from "../_dbs/mssql/sqlConnection";
import { MasterService } from "../services/master.service";
import { PassThrough } from "stream";
const masterService = new MasterService();
export class MasterController {
  async userDetail(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req["currentUser"];
      let userDetail: any = req.body;
      let updatedUserDetail: any = await masterService.userDetail(
        loggedInUser,
        userDetail
      );
      res.locals.data = updatedUserDetail;
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async roleDetail(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req["currentUser"];
      let roleDetail: any = req.body;
      let updatedRoleDetail: any = await masterService.roleDetail(
        loggedInUser,
        roleDetail
      );
      res.locals.data = updatedRoleDetail;
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async userBranchMapping(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req["currentUser"];
      let mappingDetail: any = req.body;
      let updatedMappingDetail: any = await masterService.userBranchMapping(
        loggedInUser,
        mappingDetail
      );
      res.locals.data = updatedMappingDetail;
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async documentMapping(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req["currentUser"];
      let mappingDetail: any = req.body;
      let updatedMappingDetail: any = await masterService.documentMapping(
        loggedInUser,
        mappingDetail
      );
      res.locals.data = updatedMappingDetail;
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async documentManagement(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req["currentUser"];
      let docDetail: any = req.body;
      let updatedDocDetail: any = await masterService.documentManagement(
        loggedInUser,
        docDetail
      );
      res.locals.data = updatedDocDetail;
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async branchMaster(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req["currentUser"];
      let branchDetail: any = req.body;
      let updatedBranchDetail: any = await masterService.branchMaster(
        loggedInUser,
        branchDetail
      );
      res.locals.data = updatedBranchDetail;
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async documentMaster(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req["currentUser"];
      let docDetail: any = req.body;
      let updatedDocDetail: any = await masterService.documentMaster(
        loggedInUser,
        docDetail
      );
      res.locals.data = updatedDocDetail;
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async designationMaster(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req["currentUser"];
      let desigDetail: any = req.body;
      let updatedDesigDetail: any = await masterService.designationMaster(
        loggedInUser,
        desigDetail
      );
      res.locals.data = updatedDesigDetail;
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async schemeMaster(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req["currentUser"];
      let schemeDetail: any = req.body;
      if (loggedInUser) {
        let data: any = await masterService.schemeMaster(
          loggedInUser,
          schemeDetail
        );
        res.locals.data = data;
      } else {
        res.locals.error = "Unauthorized";
      }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async addProspectus(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req["currentUser"];
      let prospectusDtail: any = req.body;
      if (req.headers["apikey"] == "nQq6YcozSX15Nv3") {
        let updatedProspectusDetail: any = await masterService.addProspectus(
          loggedInUser,
          prospectusDtail
        );
        res.locals.data = updatedProspectusDetail;
        return res.json(res.locals.data);
      } else {
        return res.status(500).json({
          isError: true,
          errMsg: "Unauthorized",
        });
      }
    } catch (err: any) {
      return res.status(500).json({
        isError: true,
        errMsg: err.message,
      });
    }
  }

  async addBatchForTATC(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req["currentUser"];
      let batchDetail: any = req.body;
      if (req.headers["apikey"] == "nQq6YcozSX15Nv3") {
        let addedBatch: any = await masterService.addBatchForTATC(
          loggedInUser,
          batchDetail
        );
        res.locals.data = addedBatch;
        return res.json(res.locals.data);
      } else {
        return res.status(500).json({
          isError: true,
          errMsg: "Unauthorized",
        });
      }
    } catch (err: any) {
      return res.status(500).json({
        isError: true,
        errMsg: err.message,
      });
    }
  }

  async addTrainingFeeForTATC(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req["currentUser"];
      let trainingFeeDetail: any = req.body;
      if (req.headers["apikey"] == "nQq6YcozSX15Nv3") {
        let addedTrainingFee: any = await masterService.addTrainingFeeForTATC(
          loggedInUser,
          trainingFeeDetail
        );
        res.locals.data = addedTrainingFee;
        return res.json(res.locals.data);
      } else {
        return res.status(500).json({
          isError: true,
          errMsg: "Unauthorized",
        });
      }
    } catch (err: any) {
      return res.status(500).json({
        isError: true,
        errMsg: err.message,
      });
    }
  }

  async addBankMaster(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req["currentUser"];
      let bankDetail: any = req.body;
      if (req.headers["apikey"] == "nQq6YcozSX15Nv3") {
        let addedBank: any = await masterService.addBankMaster(
          loggedInUser,
          bankDetail
        );
        res.locals.data = addedBank;
        return res.json(res.locals.data);
      } else {
        return res.status(500).json({
          isError: true,
          errMsg: "Unauthorized",
        });
      }
    } catch (err: any) {
      return res.status(500).json({
        isError: true,
        errMsg: err.message,
      });
    }
  }

  async addDesignationMaster(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req["currentUser"];
      let desigDetail: any = req.body;
      if (req.headers["apikey"] == "nQq6YcozSX15Nv3") {
        let addedBank: any = await masterService.addDesignationMaster(
          loggedInUser,
          desigDetail
        );
        res.locals.data = addedBank;
        return res.json(res.locals.data);
      } else {
        return res.status(500).json({
          isError: true,
          errMsg: "Unauthorized",
        });
      }
    } catch (err: any) {
      return res.status(500).json({
        isError: true,
        errMsg: err.message,
      });
    }
  }

  async addDistrictMaster(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req["currentUser"];
      let districtDetail: any = req.body;
      if (req.headers["apikey"] == "nQq6YcozSX15Nv3") {
        let addedDistrict: any = await masterService.addDistrictMaster(
          loggedInUser,
          districtDetail
        );
        res.locals.data = addedDistrict;
        return res.json(res.locals.data);
      } else {
        return res.status(500).json({
          isError: true,
          errMsg: "Unauthorized",
        });
      }
    } catch (err: any) {
      return res.status(500).json({
        isError: true,
        errMsg: err.message,
      });
    }
  }

  async addStateMaster(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req["currentUser"];
      let stateDetail: any = req.body;
      if (req.headers["apikey"] == "nQq6YcozSX15Nv3") {
        let addedState: any = await masterService.addStateMaster(
          loggedInUser,
          stateDetail
        );
        res.locals.data = addedState;
        return res.json(res.locals.data);
      } else {
        return res.status(500).json({
          isError: true,
          errMsg: "Unauthorized",
        });
      }
    } catch (err: any) {
      return res.status(500).json({
        isError: true,
        errMsg: err.message,
      });
    }
  }
  async addCityMaster(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req["currentUser"];
      let cityDetail: any = req.body;
      if (req.headers["apikey"] == "nQq6YcozSX15Nv3") {
        let addedcity: any = await masterService.addCityMaster(
          loggedInUser,
          cityDetail
        );
        res.locals.data = addedcity;
        return res.json(res.locals.data);
      } else {
        return res.status(500).json({
          isError: true,
          errMsg: "Unauthorized",
        });
      }
    } catch (err: any) {
      return res.status(500).json({
        isError: true,
        errMsg: err.message,
      });
    }
  }

  async addBranchMaster(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req["currentUser"];
      let branchDetail: any = req.body;
      if (req.headers["apikey"] == "nQq6YcozSX15Nv3") {
        let addedBranch: any = await masterService.addBranchMaster(
          loggedInUser,
          branchDetail
        );
        res.locals.data = addedBranch;
        return res.json(res.locals.data);
      } else {
        return res.status(500).json({
          isError: true,
          errMsg: "Unauthorized",
        });
      }
    } catch (err: any) {
      return res.status(500).json({
        isError: true,
        errMsg: err.message,
      });
    }
  }

  async addUnitMaster(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req["currentUser"];
      let unitDetail: any = req.body;
      if (req.headers["apikey"] == "nQq6YcozSX15Nv3") {
        let addedUnit: any = await masterService.addUnitMaster(
          loggedInUser,
          unitDetail
        );
        res.locals.data = addedUnit;
        return res.json(res.locals.data);
      } else {
        return res.status(500).json({
          isError: true,
          errMsg: "Unauthorized",
        });
      }
    } catch (err: any) {
      return res.status(500).json({
        isError: true,
        errMsg: err.message,
      });
    }
  }

  async addPincodeMaster(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req["currentUser"];
      let pincodeDetail: any = req.body;
      if (req.headers["apikey"] == "nQq6YcozSX15Nv3") {
        let addedPincode: any = await masterService.addPincodeMaster(
          loggedInUser,
          pincodeDetail
        );
        res.locals.data = addedPincode;
        return res.json(res.locals.data);
      } else {
        return res.status(500).json({
          isError: true,
          errMsg: "Unauthorized",
        });
      }
    } catch (err: any) {
      return res.status(500).json({
        isError: true,
        errMsg: err.message,
      });
    }
  }

  async getProspectusStatus(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req["currentUser"];
      let prospectusNo: any = req.query.ProspectusNo ?? "";
      if (req.headers["apikey"] == "nQq6YcozSX15Nv3") {
        let prospectusDetail: any = await masterService.getProspectusStatus(
          loggedInUser,
          prospectusNo
        );
        res.locals.data = prospectusDetail;
        return res.json(res.locals.data);
      } else {
        return res.status(500).json({
          isError: true,
          errMsg: "Unauthorized",
        });
      }
    } catch (err: any) {
      return res.status(500).json({
        isError: true,
        errMsg: err.message,
      });
    }
  }

  async getVendorBranchList(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.headers["apikey"] == "nQq6YcozSX15Nv3") {
        let userName: string = req.params.username ?? "";
        let password: string = req.params.password ?? "";
        let vendorBranchs: any = await masterService.getVendorBranchList(
          userName,
          password
        );
        res.locals.data = vendorBranchs;
        return res.json(res.locals.data);
      } else {
        return res.status(500).json({
          isError: true,
          errMsg: "Unauthorized",
        });
      }
    } catch (err: any) {
      return res.status(500).json({
        isError: true,
        errMsg: err.message,
      });
    }
  }
  async getTempDevicePassword(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.headers["apikey"] == "nQq6YcozSX15Nv3") {
        let userName: string = req.params.username ?? "";
        let password: string = req.params.password ?? "";
        let deviceID: string = req.params.deviceID ?? "";
        let vendorDetails: any = await masterService.getTempDevicePassword(
          userName,
          password,
          deviceID
        );
        res.locals.data = vendorDetails;
        return res.json(res.locals.data);
      } else {
        return res.status(500).json({
          isError: true,
          errMsg: "Unauthorized",
        });
      }
    } catch (err: any) {
      return res.status(500).json({
        isError: true,
        errMsg: err.message,
      });
    }
  }

  async getDevicePasswordReset(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (req.headers["apikey"] == "nQq6YcozSX15Nv3") {
        let userName: string = req.params.username ?? "";
        let password: string = req.params.password ?? "";
        let deviceId: string = req.params.deviceID ?? "";
        let vendorDetails: any = await masterService.getDevicePasswordReset(
          userName,
          password,
          deviceId
        );
        res.locals.data = vendorDetails;
        return res.json(res.locals.data);
      } else {
        return res.status(500).json({
          isError: true,
          errMsg: "Unauthorized",
        });
      }
    } catch (err: any) {
      return res.status(500).json({
        isError: true,
        errMsg: err.message,
      });
    }
  }

  async getUpdateMachineId(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.headers["apikey"] == "nQq6YcozSX15Nv3") {
        let userName: string = req.params.username ?? "";
        let password: string = req.params.password ?? "";
        let branchCode: string = req.params.branchCode ?? "";
        let deviceId: string = req.params.deviceID ?? "";
        let vendorDetails: any = await masterService.getUpdateMachineId(
          userName,
          password,
          branchCode,
          deviceId
        );
        res.locals.data = vendorDetails;
        return res.json(res.locals.data);
      } else {
        return res.status(500).json({
          isError: true,
          errMsg: "Unauthorized",
        });
      }
    } catch (err: any) {
      return res.status(500).json({
        isError: true,
        errMsg: err.message,
      });
    }
  }

  async Measurement(req: Request, res: Response, next: NextFunction) {
    try {
      // if (req.headers["apikey"] == "nQq6YcozSX15Nv3") {
      let measurementDetails: any = req.body;
      let data = measurementDetails.datas[0];
      let measurementData: any = {};
      if (
        measurementDetails.action == "webResults" &&
        measurementDetails.deviceID
      ) {
        measurementData.action = measurementDetails.action;
        measurementData.deviceId = measurementDetails.deviceID;
        measurementData.uid = data.UID;
        measurementData.occurTime = data.occurTime;
        measurementData.timestamp = data.timestamp;
        measurementData.height = parseFloat(data.BMI.height);
        measurementData.weight = parseFloat(data.BMI.weight);
        measurementData.bmi = parseFloat(data.BMI.bmi);
        measurementData.macAdd = "";
      } else if (measurementDetails.deviceModel && measurementDetails.unitNo) {
        measurementData.action = "webResults";
        measurementData.deviceId = measurementDetails.deviceNo;
        measurementData.uid = data.userID;
        measurementData.occurTime = data.measureTime;
        measurementData.timestamp = data.measureTime;
        measurementData.height = parseFloat(data.height);
        measurementData.weight = parseFloat(data.weight);
        measurementData.bmi = parseFloat(data.bmi);
        measurementData.macAdd = measurementDetails.macAddr;
      } else {
        measurementData.action = "webResults";
        measurementData.deviceId = "";
        measurementData.uid = "";
        measurementData.occurTime = "";
        measurementData.timestamp = "";
        measurementData.height = 0;
        measurementData.weight = 0;
        measurementData.bmi = 0;
        measurementData.macAdd = "";
      }
      let updatedDetail: any = await masterService.updateMeasurement(
        measurementData
      );
      res.locals.data = updatedDetail;
      return res.json(res.locals.data);
      // } else {
      //   return res.status(500).json({
      //     isError: true,
      //     errMsg: "Unauthorized",
      //   });
      // }
    } catch (err: any) {
      return res.status(200).json({"retCode":"0", "msg":"failed", "control":"0"});
    }
  }

    async getRemotePassword(req: Request, res: Response, next: NextFunction) {
    try {
      // if (req.headers["apikey"] == "nQq6YcozSX15Nv3") {
      let deviceId: string = req.body.deviceNo??'';
      if (!deviceId) {
      return res.status(400).json({ reCode: "400", remsg: "Device ID is missing", data: { password: "" } });
     }

      let updatedDetail: any = await masterService.getRemotePassword(
        deviceId
      );
      res.locals.data = updatedDetail;
      return res.json(res.locals.data);
      // } else {
      //   return res.status(500).json({
      //     isError: true,
      //     errMsg: "Unauthorized",
      //   });
      // }
    } catch (err: any) {
      return res.status(500).json({
      reCode: "500",
      remsg: "Internal server error",
      data: { password: "" }
    });
    }
  }
    async dbUser(req: Request, res: Response, next: NextFunction) {
    try {
      // if (req.headers["apikey"] == "nQq6YcozSX15Nv3") {
      let requestDetail: any = req.body;

      let updatedDetail: any = await masterService.dbUser(
        requestDetail
      );
      res.locals.data = updatedDetail;
      return res.json(res.locals.data);
      // } else {
      //   return res.status(500).json({
      //     isError: true,
      //     errMsg: "Unauthorized",
      //   });
      // }
    } catch (err: any) {
      return res.json({ Result: "failed" });
    }
  }
  async getTempDeployment(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req["currentUser"];
      let action: string = req.params.action;
      let userId: string = req.params.userId;
      let deploymentDetail: any = await masterService.getTempDeployment(
        loggedInUser,
        action,
        userId
      );
      res.locals.data = deploymentDetail;
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async updateTempDeploymentStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      let loggedInUser: any = req["currentUser"];
      let statusDetail: any = req.body;
      let updateDetail: any = await masterService.updateTempDeploymentStatus(
        loggedInUser,
        statusDetail
      );
      res.locals.data = updateDetail;
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async addTempDeployment(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req["currentUser"];
      let deploymentDetail: any = req.body;
      if (loggedInUser) {
        let addDeploymentDetail: any = await masterService.addTempDeployment(
          loggedInUser,
          deploymentDetail
        );
        res.locals.data = addDeploymentDetail;
      } else {
        res.locals.error = "Unauthorized";
      }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async updateTempDeployment(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req["currentUser"];
      let deploymentDetail: any = req.body;
      if (loggedInUser) {
        let updatedDeploymentDetail: any =
          await masterService.updateTempDeployment(
            loggedInUser,
            deploymentDetail
          );
        res.locals.data = updatedDeploymentDetail;
      } else {
        res.locals.error = "Unauthorized";
      }
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
      let loggedInUser: any = req["currentUser"];
      let regNo: string = req.params.RegNo;
      let empDetail: any = await masterService.getEmployeeDetails(
        loggedInUser,
        regNo
      );
      res.locals.data = empDetail;
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

    async employeeDetail(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req["currentUser"];
      let regNo: string = req.params.RegNo;
      let empDetail: any = await masterService.employeeDetail(
        loggedInUser,
        regNo
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
}
