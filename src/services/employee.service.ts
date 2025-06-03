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
          src: 'common/getFormNo',
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
    } catch (err: any) {
      return { isError: true, errMsg: err.message };
    }
  }
}
