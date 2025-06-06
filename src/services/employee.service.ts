import { GetCompanyDb, getResultSets } from '../_dbs/mssql/pgConnection';
import { plainToClass } from 'class-transformer';
import constant from '../_dbs/mssql/constant';
import Logger from '../utils/logger';
import { CustomError } from '../helpers/customError';
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
      if (error.driverError) {
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
        `EXEC ${constant.P_getFormNo} @head = @0, @BranchCode = @1, @Update = @2`,
        [
          employeeDetail.head,
          employeeDetail.branchCode,
          employeeDetail.updateBit,
        ],
      );
      if (formNo) {
        if (formNo.Code == 'update') {
          formNO = employeeDetail.head;
          action = 'update';
        } else {
          formNO = formNo.Code.Code;
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
          let res: any = resultSets[0];
        } catch (errEmp: any) {}
      }
    } catch (error: any) {
      if (error.driverError) {
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

  async getOtpDetail(
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
      if (error.driverError) {
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
      let otpDetail: any = await companyDb.query(
        `EXEC ${constant.P_EducationDetails} @action = @0, @formNo = @1, @classCode = @2, @passingYear = @3, @markPc = @4, @board = @5, @institute = @6, @remarks = @7, @condoRemark = @8, @userId = @10`,
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
      return otpDetail;
    } catch (error: any) {
      if (error.driverError) {
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
      let otpDetail: any = await companyDb.query(
        `EXEC ${constant.P_EducationDetails} @action = @0, @formNo = @1, @classCode = @2`,
        [action, formNo, classCode],
      );
      return otpDetail;
    } catch (error: any) {
      if (error.driverError) {
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
        `EXEC ${constant.P_EducationDetails} @action = @0, @formNo = @1, @lngId = @2, @proficiency = @3, @canRead = @4, @canWrite = @5, @canSpeak = @6, @userId = @7`,
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
      if (error.driverError) {
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
        `EXEC ${constant.P_CivilianDetails} @action = @0, @formNo = @1, @org = @2, @orgType = @3, @empId = @4, @uanPFNo = @5, @esiNo = @6, @lastRank = @7, @isBhCert = @8, @isEsiVeri = @9, @isExpFromUan = @10, @fromDate = @11, @toDate = @12, @remarks = @13, @userId = @14`,
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
      if (error.driverError) {
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
      if (error.driverError) {
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
      if (error.driverError) {
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
      if (error.driverError) {
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
      if (error.driverError) {
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
      if (error.driverError) {
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
}
