import { GetCompanyDb, getResultSets } from '../_dbs/mssql/pgConnection';
import { plainToClass } from 'class-transformer';
import constant from '../_dbs/mssql/constant';
import Logger from '../utils/logger';
import { CustomError } from '../helpers/customError';
import { create } from 'xmlbuilder2';
import { Config } from '../helpers/config';
import * as path from 'path';
import * as http from 'http';
import * as fs from 'fs';
import moment from 'moment';
import * as crypto from 'crypto';
import * as request from 'request';

let options: any = {
  excludeExtraneousValues: true,
};

export class EmployeeService {
  getRandomNumber(maxNo, minNo) {
    return Math.floor(Math.random() * (maxNo - minNo) + minNo);
  }
  async getFormNo(
    loggedInUser: any,
    head: string,
    branchCode: string,
    updateBit: number,
  ): Promise<any[]> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let formNo: any = await companyDb.query(
        `EXEC ${constant.P_getFormNo} @head = @0, @BranchCode = @1, @Update = @2`,
        [head, branchCode, updateBit],
      );
      return formNo;
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'employee/getFormNo',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async addEmployee(loggedInUser: any, employeeDetail: any): Promise<any> {
    try {
      let formNO: string;
      let action: string;
      let Otp: number = this.getRandomNumber(999999, 100000);
      let datetime = new Date().toLocaleString();
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let formNo: any = await companyDb.query(
        `EXEC ${constant.P_getFormNo} @head = @0, @BranchCode = @1, @Update = @2, @prospectus_no = @3`,
        [
          employeeDetail.head,
          employeeDetail.branchCode,
          employeeDetail.updateBit,
          employeeDetail.prspctNo,
        ],
      );
      if (formNo[0]) {
        if (formNo[0].Code == 'update') {
          formNO = employeeDetail.head;
          action = 'update';
        } else {
          formNO = formNo[0].Code;
          action = 'insert';
        }
        try {
          let resultSets: any[] = await getResultSets(
            companyDb,
            constant.P_AddNewEmployee,
            {
              action: action,
              form_No: formNO,
              branch_code: employeeDetail.branchCode,
              application_date: employeeDetail.appDate,
              prospectus_no: employeeDetail.prspctNo,
              scheme_id: employeeDetail.schemeId ?? null,
              first_name: employeeDetail.firstName,
              middle_name: employeeDetail.middleName,
              last_name: employeeDetail.lastName,
              applied_postid: employeeDetail.designation,
              candidate_typeid: employeeDetail.candidateType,
              physical_category: employeeDetail.physical_category,
              fee_type: employeeDetail.feeType,
              gender: employeeDetail.gender,
              dob: employeeDetail.dob,
              age_year: employeeDetail.ageYear,
              age_month: employeeDetail.ageMonth,
              age_days: employeeDetail.ageDays,
              mother_name: employeeDetail.motherName,
              father_name: employeeDetail.fatherName,
              mobile_no: employeeDetail.mobileNo,
              emailid: employeeDetail.emailId,
              caste_category: employeeDetail.casteCategory,
              nationality: employeeDetail.nationlity,
              religion: employeeDetail.religion,
              caste: employeeDetail.casteId,
              marital_status: employeeDetail.martStatus,
              spouse_name: employeeDetail.spouseName,
              blood_group: employeeDetail.bldGroup,
              batch_no: employeeDetail.batchNo,
              voterId: employeeDetail.voterId,
              noVoterId: employeeDetail.noVoterId,
              residenceState: employeeDetail.residenceState,
              voterState: employeeDetail.voterState,
              voterPc: employeeDetail.voterPc,
              voterAc: employeeDetail.voterAc,
              aadharNo: employeeDetail.aadharNo,
              aadhar_name: employeeDetail.aadharName,
              aadhar_dob: employeeDetail.aadharDob,
              uanno: employeeDetail.UANNo,
              esino: employeeDetail.ESINo,
              otp: employeeDetail.Otp,
              pres_address: employeeDetail.presAddress,
              pres_countryid: employeeDetail.presAddress_Country,
              pres_stateid: employeeDetail.presAddress_State,
              pers_districtid: employeeDetail.presAddress_District,
              pers_cityid: employeeDetail.presAddress_City,
              pres_pin: employeeDetail.presAddress_PinCode,
              perma_address: employeeDetail.permaAddress,
              perma_countryid: employeeDetail.permaAddress_Country,
              perma_stateid: employeeDetail.permaAddress_State,
              perma_districtid: employeeDetail.permaAddress_District,
              perma_cityid: employeeDetail.permaAddress_City,
              perma_pin: employeeDetail.permaAddress_PinCode,
              allownoexp: employeeDetail.isAllowNoExp,
              allownotest: employeeDetail.isAllowNoTest,
              machineExmpted: employeeDetail.isMachineExmpted,
              condoExmpted: employeeDetail.isCondoExmpted,
              assessmentExmpted: employeeDetail.isAssessmentExmpted,
              identityMark: employeeDetail.identityMark,
              created_by: employeeDetail.userId,
            },
          );
          let res: any = resultSets;
          return { isError: false, recordsets: res };
        } catch (errEmp: any) {}
      }
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'employee/addEmployee',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async otpDetail(
    loggedInUser: any,
    action: string,
    formNo: string,
    otpNo: number,
    userId: string,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let otpDetail: any = await companyDb.query(
        `EXEC ${constant.P_OtpDetails} @action = @0, @formNo = @1, @otpNo = @2, @userId = @3`,
        [action, formNo, otpNo, userId],
      );
      return otpDetail;
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'employee/getOtpDetail',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async addEducationDetails(loggedInUser: any, eduDetail: any): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let addedEduDetail: any = await companyDb.query(
        `EXEC ${constant.P_EducationDetails} @action = @0, @formNo = @1, @classCode = @2, @passingYear = @3, @markPc = @4, @board = @5, @institute = @6, @remarks = @7, @condoRemark = @8, @userId = @9`,
        [
          eduDetail.action,
          eduDetail.formNo,
          eduDetail.classCode,
          eduDetail.passingYear,
          eduDetail.markPc,
          eduDetail.board,
          eduDetail.institute,
          eduDetail.remarks,
          eduDetail.condoRemark,
          eduDetail.userId,
        ],
      );
      return addedEduDetail;
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'employee/addEducationDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async removeEducationDetails(
    loggedInUser: any,
    action: string,
    formNo: string,
    classCode: number,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let removedEduDetail: any = await companyDb.query(
        `EXEC ${constant.P_EducationDetails} @action = @0, @formNo = @1, @classCode = @2`,
        [action, formNo, classCode],
      );
      return removedEduDetail;
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'employee/removeEducationDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async addLanguageDetails(
    loggedInUser: any,
    languageDetail: any,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let addedLanguageDetail: any = await companyDb.query(
        `EXEC ${constant.P_LanguageDetails} @action = @0, @formNo = @1, @lngId = @2, @proficiency = @3, @read = @4, @write = @5, @speak = @6, @userId = @7`,
        [
          languageDetail.action,
          languageDetail.formNo,
          languageDetail.lngId,
          languageDetail.proficiency,
          languageDetail.canRead,
          languageDetail.canWrite,
          languageDetail.canSpeak,
          languageDetail.userId,
        ],
      );

      return addedLanguageDetail;
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'employee/addLanguageDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async addCvExpDetails(loggedInUser: any, expDetail: any): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let exprDetail: any = await companyDb.query(
        `EXEC ${constant.P_CivilianDetails} @action = @0, @formNo = @1, @org = @2, @org_type = @3, @empId = @4, @uanPfNo = @5, @esiNo = @6, @lastRank = @7, @isBhCert = @8, @isEsiVeri = @9, @expFromUan = @10, @fromDate = @11, @toDate = @12, @remarks = @13, @userId = @14`,
        [
          expDetail.action,
          expDetail.formNo,
          expDetail.org,
          expDetail.orgType,
          expDetail.empId,
          expDetail.uanPFNo,
          expDetail.esiNo,
          expDetail.lastRank,
          expDetail.isBhCert,
          expDetail.isEsiVeri,
          expDetail.isExpFromUan,
          expDetail.fromDate,
          expDetail.toDate,
          expDetail.remarks,
          expDetail.userId,
        ],
      );

      return exprDetail;
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'employee/addCvExpDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async removeCvExpDetails(
    loggedInUser: any,
    action: string,
    formNo: string,
    orgType: number,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let expDetail: any = await companyDb.query(
        `EXEC ${constant.P_CivilianDetails} @action = @0, @formNo = @1, @org_type = @2`,
        [action, formNo, orgType],
      );
      return expDetail;
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'employee/removeCvExpDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async addExManExpDetails(loggedInUser: any, exManDetail: any): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let addedExManDetail: any = await companyDb.query(
        `EXEC ${constant.P_ExManExpDetails} @action = @0, @formNo = @1, @serviceType = @2, @org = @3, @serviceId = @4, @uanPfNo = @5, @esiNo = @6, @lastRank = @7, @fromDate = @8, @toDate = @9, @remarks = @10, @userId = @11`,
        [
          exManDetail.action,
          exManDetail.formNo,
          exManDetail.serviceType,
          exManDetail.org,
          exManDetail.serviceId,
          exManDetail.uanPfNo,
          exManDetail.esiNo,
          exManDetail.lastRank,
          exManDetail.fromDate,
          exManDetail.toDate,
          exManDetail.remarks,
          exManDetail.userId,
        ],
      );

      return addedExManDetail;
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'employee/addExManExpDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async removeExManExpDetails(
    loggedInUser: any,
    action: string,
    formNo: string,
    serviceType: string,
    org: string,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let removedExManDetail: any = await companyDb.query(
        `EXEC ${constant.P_ExManExpDetails} @action = @0, @formNo = @1, @serviceType = @2, @org = @3`,
        [action, formNo, serviceType, org],
      );
      return removedExManDetail;
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'employee/removeExManExpDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async addEsiServerDetails(loggedInUser: any, esiDetail: any): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let addedEsiDetail: any = await companyDb.query(
        `EXEC ${constant.P_EsiServerDetails} @action = @0, @formNo = @1, @empName = @2, @uhidno = @3, @esiNo = @4, @insNo = @5, @phoneNo = @6, @aadharno = @7, @dob = @8, @regdate = @9, @first_dor = @10, @current_dor = @11, @oldesi_date = @12, @isCancel = @13, @userId = @14`,
        [
          esiDetail.action,
          esiDetail.formNo,
          esiDetail.empName,
          esiDetail.uhidNo,
          esiDetail.esiNo,
          esiDetail.insNo,
          esiDetail.phoneNo,
          esiDetail.aadharNo,
          esiDetail.dobDDMMMYYYY,
          esiDetail.regDateDDMMMYYYY,
          esiDetail.firstRegDateDDMMMYYYY,
          esiDetail.currentRegDateDDMMMYYYY,
          esiDetail.oldestEsiDateDDMMMYYYY,
          0,
          esiDetail.userId,
        ],
      );

      return addedEsiDetail;
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'employee/addEsiServerDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async removeEsiServerDetails(
    loggedInUser: any,
    action: string,
    formNo: string,
    esiNo: string,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let removedEsiDetail: any = await companyDb.query(
        `EXEC ${constant.P_EsiServerDetails} @action = @0, @formNo = @1, @esiNo = @2`,
        [action, formNo, esiNo],
      );

      return removedEsiDetail;
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'employee/removeEsiServerDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async addFamilyDetails(loggedInUser: any, familyDetail: any): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let addedFamilyDetail: any = await companyDb.query(
        `EXEC ${constant.P_FamilyDetails} @action = @0, @formNo = @1, @name = @2, @dateOfBirth = @3, @relation = @4, @isDependent = @5, @isNominee = @6, @nomineePc = @7, @age = @8, @userId = @9`,
        [
          familyDetail.action,
          familyDetail.formNo,
          familyDetail.name,
          familyDetail.dob,
          familyDetail.relation,
          familyDetail.isDpndnt,
          familyDetail.isNmnee,
          familyDetail.nomineePerc,
          familyDetail.age,
          familyDetail.userId,
        ],
      );

      return addedFamilyDetail;
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'employee/addFamilyDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async removeFamilyDetail(
    loggedInUser: any,
    action: string,
    formNo: string,
    name: string,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let removedFamilyDetail: any = await companyDb.query(
        `EXEC ${constant.P_FamilyDetails} @action = @0, @formNo = @1, @name = @2`,
        [action, formNo, name],
      );

      return removedFamilyDetail;
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'employee/removeFamilyDetail',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async addPhysicalDetails(
    loggedInUser: any,
    physicalDetail: any,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let addedPhysicalDetail: any = await companyDb.query(
        `EXEC ${constant.P_PhysicalDetails} @action = @0, @formNo = @1, @ht = @2, @htFt = @3, @chest = @4, @chestFt = @5, @wt = @6, @head = @7, @heal = @8,
         @shirtChest = @9, @shirtShoulder = @10, @shirtSleeve = @11, @shirtLength = @12, @pantWaist = @13, @pantHip = @14, @pantLength = @15, @cap = @16, @shoe = @17,
         @fullPicture = @18, @condonation = @19, @isVerified = @20, @RQCCAgent = @21, @verifiedOn = @22, @userId = @23`,
        [
          physicalDetail.action,
          physicalDetail.formNo,
          physicalDetail.heightCm,
          physicalDetail.heightFt,
          physicalDetail.chestCm,
          physicalDetail.chestFt,
          physicalDetail.weightKg,
          physicalDetail.head,
          physicalDetail.heal,
          physicalDetail.shirtChest,
          physicalDetail.shirtSholder,
          physicalDetail.shirtSleev,
          physicalDetail.shirtLength,
          physicalDetail.paintWaist,
          physicalDetail.paintHip,
          physicalDetail.paintLength,
          physicalDetail.capSize,
          physicalDetail.shoeSize,
          physicalDetail.fullPicture,
          physicalDetail.condonation,
          physicalDetail.isVrified,
          physicalDetail.rqccAgent,
          physicalDetail.verifiedOn,
          physicalDetail.userId,
        ],
      );

      return addedPhysicalDetail;
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'employee/addPhysicalDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async removePhysicalDetail(
    loggedInUser: any,
    action: string,
    formNo: string,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let removedPhysicalDetail: any = await companyDb.query(
        `EXEC ${constant.P_PhysicalDetails} @action = @0, @formNo = @1`,
        [action, formNo],
      );

      return removedPhysicalDetail;
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'employee/removePhysicalDetail',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async addBankDetails(loggedInUser: any, bankDetail: any): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let addedBankDetail: any = await companyDb.query(
        `EXEC ${constant.P_BankDetails} @action = @0, @formNo = @1, @ifscCode = @2, @bankName = @3, @accountNo = @4, @bankBranch = @5, @bankBranchAddress = @6, @bankDetail = @7, @bankUpdatedInErp = @8, @userId = @9`,
        [
          bankDetail.action,
          bankDetail.formNo,
          bankDetail.ifscCode,
          bankDetail.bankName,
          bankDetail.accountNo,
          bankDetail.bankBranch,
          bankDetail.bankBranchAddress,
          bankDetail.bankDetail,
          bankDetail.bankUpdatedInERP,
          bankDetail.userId,
        ],
      );

      return addedBankDetail;
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'employee/addBankDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async removeBankDetail(
    loggedInUser: any,
    action: string,
    formNo: string,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let removedPhysicalDetail: any = await companyDb.query(
        `EXEC ${constant.P_BankDetails} @action = @0, @formNo = @1`,
        [action, formNo],
      );

      return removedPhysicalDetail;
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'employee/removeBankDetail',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async updateFormStatus(loggedInUser: any, formDetail: any): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let updatedFormDetail: any = await companyDb.query(
        `EXEC ${constant.P_UpdateFormStatus} @action = @0, @formNo = @1, @formName = @2, @status = @3, @userId = @4`,
        [
          formDetail.action,
          formDetail.formNo,
          formDetail.formName,
          formDetail.status,
          formDetail.userId,
        ],
      );
      return updatedFormDetail;
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'employee/updateFormStatus',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async getEmployeeBasicDetails(
    loggedInUser: any,
    action: string,
    formNo: string,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      const basicDetails = await getResultSets(
        companyDb,
        constant.P_EmployeeBasicDetails,
        {
          action: action,
          formNO: formNo,
        },
      );
      let res: any = basicDetails;
      return res;
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'employee/getEmployeeBasicDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async getUploadedFormDetails(
    loggedInUser: any,
    action: string,
    formNo: string,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      const formDetails = await getResultSets(
        companyDb,
        constant.P_uploadFormFiles,
        {
          action: action,
          form_no: formNo,
        },
      );
      let res: any = formDetails;
      return res;
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'employee/getUploadedFormDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async removedocument(
    loggedInUser: any,
    action: string,
    formNo: string,
    docTypeId: string,
    docId: string,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      const removedDocument = await getResultSets(
        companyDb,
        constant.P_uploadFormFiles,
        {
          action: action,
          form_no: formNo,
          doc_type_id: docTypeId,
          doc_id: docId,
        },
      );
      let res: any = removedDocument;
      return res;
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'employee/removedocument',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async getEduLangDetails(loggedInUser: any, formNo: string): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      const langDetails = await getResultSets(
        companyDb,
        constant.P_GetEduLangDetails,
        {
          formNo: formNo,
        },
      );
      let res: any = langDetails;
      return res;
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'employee/getEduLangDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async getExpExMEsiDetails(loggedInUser: any, formNo: string): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      const esiDetails = await getResultSets(
        companyDb,
        constant.P_GetExpExMEsiDetails,
        {
          formNo: formNo,
        },
      );
      let res: any = esiDetails;
      return res;
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'employee/getExpExMEsiDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async updateRqccDocument(
    loggedInUser: any,
    documentDetail: any,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let rqccDocument: any = await companyDb.query(
        `EXEC ${constant.P_RqccDocumentDetail} @action = @0, @formNo = @1, @appForm = @2, @identityProof = @3, @addressProof = @4, @expProof = @5, @ageProof = @6
        , @eduProof = @7, @driverProof = @8, @gunmanProof = @9, @exMProof = @10, @bankAccProof = @11, @OthersProof = @12, @fireMProof = @13, @aadharCnLProof = @14, @uanNoProof = @15
        , @casteCertProof = @16, @expFromUan = @17, @expFromEsi = @18, @userId = @19, @withPhysical = @20`,
        [
          documentDetail.action,
          documentDetail.formNo,
          documentDetail.appForm,
          documentDetail.identityProof,
          documentDetail.addressProof,
          documentDetail.expProof,
          documentDetail.ageProof,
          documentDetail.eduProof,
          documentDetail.driverProof,
          documentDetail.gunmanProof,
          documentDetail.exMProof,
          documentDetail.bankAccProof,
          documentDetail.OthersProof,
          documentDetail.fireMProof,
          documentDetail.aadharCnLProof,
          documentDetail.uanNoProof,
          documentDetail.casteCertProof,
          documentDetail.expFromUAN,
          documentDetail.expFromESI,
          documentDetail.userId,
          documentDetail.withPhysical,
        ],
      );
      return rqccDocument;
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'employee/updateRqccDocument',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async updateApprovalStatus(
    loggedInUser: any,
    statusDetail: any,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let formLists: any = statusDetail.formLists;
      //       const doc = create({ version: '1.0' })
      //   .ele('root')
      //     .ele('user')
      //       .att('id', '123')
      //       .ele('name').txt('John Doe').up()
      //       .ele('email').txt('john@example.com')
      //     .up()
      //   .up()
      // .end({ prettyPrint: true });

      // console.log(doc);

      // let xmlNode: any = xmlBuilder.create('formList');
      // for (var i = 0; i <= formLists.length - 1; i++) {
      //   var leafNode = xmlNode.ele('emp');
      //   leafNode.ele('formNo', formLists[i].formNo);
      //   leafNode.ele('formStatus', formLists[i].formStatus);
      //   leafNode.ele('reason', formLists[i].reason);
      // }
      // xmlNode.end({ pretty: true });

      //let xmlString: string = xmlNode.toString();

      let xmlString: string = '';

      let rqccDocument: any = await companyDb.query(
        `EXEC ${constant.P_UpdateApprovalStatus} @action = @0, @formList = @1, @userId = @2`,
        [statusDetail.action, xmlString, statusDetail.userId],
      );

      // var formLists = req.body.formLists;

      // var sqlReq = new sql.Request(conn_pool);
      // sqlReq.input('action', sql.VarChar(50), req.body.action);
      // sqlReq.input('formList', sql.VarChar(sql.MAX), xmlString);
      // sqlReq.input('userId', sql.VarChar(50), req.body.userId);

      return rqccDocument;
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'employee/updateApprovalStatus',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async updateEmployeeDetails(
    loggedInUser: any,
    empDetails: any,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let updatedEmpDetails: any = await companyDb.query(
        `EXEC ${constant.P_UpdateEmployeeDetails} @action = @0, @form_no = @1, @candType = @2, @dob = @3, @dobInAaadhar = @4, @uanNo = @5, @userId = @6`,
        [
          empDetails.action,
          empDetails.formNo,
          empDetails.candType,
          empDetails.dob,
          empDetails.Aadhar_Dob,
          empDetails.UanNo,
          empDetails.userId,
        ],
      );
      return updatedEmpDetails;
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'employee/updateEmployeeDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async updateAllFormStatus(
    loggedInUser: any,
    statusDetails: any,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let updatedStatusDetails: any = await companyDb.query(
        `EXEC ${constant.P_UpdateAllFormStatus} @action = @0, @formNo = @1, @basic = @2, @document = @3, @education = @4, @experience = @5, @physical = @6
        , @assessment = @7, @score = @8, @electronic = @9, @family = @10, @bank = @11, @icard = @12, @rqccdoc = @13, @rqccPhy = @14, @userId = @15`,
        [
          statusDetails.action,
          statusDetails.form_no,
          statusDetails.basicDetail,
          statusDetails.documentDetail,
          statusDetails.educationDetail,
          statusDetails.experienceDetail,
          statusDetails.phyMeasurDetail,
          statusDetails.assessmentDetail,
          statusDetails.scoreDetail,
          statusDetails.electronicDetail,
          statusDetails.familyDetail,
          statusDetails.bankDetail,
          statusDetails.printCardDetail,
          statusDetails.rqccDocVerified,
          statusDetails.rqccPhyVerified,
          statusDetails.userId,
        ],
      );
      return updatedStatusDetails;
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'employee/updateAllFormStatus',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async updateRegNo(loggedInUser: any, regNoDetails: any): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let updatedRegNo: any = await companyDb.query(
        `EXEC ${constant.P_UpdateRegNo} @fromNo = @0, @regNo = @1, @userId = @2`,
        [regNoDetails.formNo, regNoDetails.regNo, regNoDetails.userId],
      );
      return updatedRegNo;
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'employee/updateRegNo',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async updateApprovalStatusDetails(
    loggedInUser: any,
    statusDetails: any,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let updatedStatusDetail: any = await companyDb.query(
        `EXEC ${constant.P_UpdateApprovalStatusDetails} @action = @0, @formNo = @1, @name = @2, @dob = @3, @uanNo = @4, @accountNo = @5, @status = @6, @statusReason = @7, @otherRemark = @8, @userId = @9`,
        [
          statusDetails.action,
          statusDetails.formNo,
          statusDetails.name,
          statusDetails.dob,
          statusDetails.uanNo,
          statusDetails.accountNo,
          statusDetails.status,
          statusDetails.statusReason,
          statusDetails.otherRemark,
          statusDetails.userId,
        ],
      );
      return updatedStatusDetail;
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'employee/updateApprovalStatusDetails',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }
}
