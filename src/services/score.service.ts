import { GetCompanyDb, getResultSets } from '../_dbs/mssql/sqlConnection';
import { plainToClass } from 'class-transformer';
import constant from '../_dbs/mssql/constant';
import Logger from '../utils/logger';
import { CustomError } from '../helpers/customError';
import { Config } from '../helpers/config';
import * as path from 'path';
import * as http from 'http';
import * as fs from 'fs';
import moment from 'moment';
import axios from 'axios';
import * as crypto from 'crypto';
import * as request from 'request';
import * as QRCode from 'qrcode';
import * as math from 'mathjs';
import { JSDOM } from 'jsdom';
import htmlPdf from 'html-pdf';
import dotenv from 'dotenv';
dotenv.config();
const { baseApi } = process.env;

let options: any = {
  excludeExtraneousValues: true,
};

async function CalculateScoreForCenter(recordDetails) {
  let scoreMaster: any = recordDetails[0];
  let generalDetails: any = recordDetails[1][0];
  let cvExpDetails: any = recordDetails[2];
  let exManExpDetails: any = recordDetails[3];
  let eduDetails: any = recordDetails[4];
  let stdDetails: any = recordDetails[5][0];
  let maxScore: any;
  let diff: number = 0;
  let empAgeScore: any = 0;
  let empEduScore: any = 0;
  let empExpScore: any = 0;
  let empHtScore: any = 0;
  let empWtScore: any = 0;
  let empChtScore: any = 0;
  let lessScore: any = 0;
  let addScore: any = 0;
  let maxEdu: any = 0;
  let totalCvExpOfEmp: any = 0;
  let totalExMExpOfEmp: any = 0;
  let totalExpInMonth: any = 0;

  let age_weightage: any = 0;
  let edu_weightage: any = 0;
  let exp_weightage: any = 0;
  let hgt_weightage: any = 0;
  let wht_weightage: any = 0;
  let chst_weightage: any = 0;

  let totalEmpScore: number = 0;
  let totalEmpScore_whtage: number = 0;

  let result: any = {
    isError: false,
    errMsg: '',
    score: {
      empAgeScore: 0,
      empEduScore: 0,
      empExpScore: 0,
      empHtScore: 0,
      empWtScore: 0,
      empChtScore: 0,
      totalScore: 0,
    },
    weightage: {
      age_weightage: 0,
      edu_weightage: 0,
      exp_weightage: 0,
      hgt_weightage: 0,
      wht_weightage: 0,
      chst_weightage: 0,
      totalWeightage: 0,
    },
  };

  let ageScoreDetails: any = scoreMaster.find((x) => x.parameterType == 'Age');
  let eduScoreDetails: any = scoreMaster.find(
    (x) => x.parameterType == 'Education',
  );
  let expScoreDetails: any = scoreMaster.find(
    (x) => x.parameterType == 'Experience',
  );
  let heightScoreDetails: any = scoreMaster.find(
    (x) => x.parameterType == 'Height',
  );
  let weightScoreDetails: any = scoreMaster.find(
    (x) => x.parameterType == 'Weight',
  );
  let chestScoreDetails: any = scoreMaster.find(
    (x) => x.parameterType == 'Chest',
  );

  /* Civilian Experience change by samant on 29-Apr-2019*/
  if (cvExpDetails.length != undefined && cvExpDetails.length != 0) {
    let totalExpInMonth: any = 0;
    cvExpDetails.forEach((element) => {
      if (element.fromdate != undefined && element.todate != undefined) {
        totalExpInMonth += moment(element.todate).diff(
          moment(element.fromdate),
          'month',
        );
        //totalExpInMonth +=  element.exp_month;
      }
    });

    totalCvExpOfEmp = math.round(totalExpInMonth.toFixed(1), 1);
  }
  /* Ex-Man experiance change by Samant on 29-Apr-2019 */
  if (exManExpDetails.length != undefined && exManExpDetails.length != 0) {
    let totalExpInMonth: any = 0;
    exManExpDetails.forEach((element) => {
      if (element.fromdate != undefined && element.todate != undefined) {
        totalExpInMonth += moment(element.todate).diff(
          moment(element.fromdate),
          'month',
        );
        //totalExpInMonth += element.exp_month;
      }
    });
    totalExMExpOfEmp = math.round(totalExpInMonth.toFixed(1), 1);
  }

  try {
    //New Calculation
    /* #region -------------------------------------------------------Age score calculation */
    maxScore = ageScoreDetails.maxScore;
    let empAge: number = generalDetails.ageInYear;
    let ageCondoAllow: boolean = false;
    lessScore = 0;
    addScore = 0;
    if (empAge >= stdDetails.std_min_age && empAge <= stdDetails.std_max_age) {
      lessScore = 0;
    } else if (empAge < stdDetails.min_age) {
      lessScore = maxScore;
    } else if (empAge > stdDetails.max_age) {
      lessScore = maxScore;
    } else if (empAge < stdDetails.std_min_age) {
      diff = stdDetails.std_min_age - empAge;
      lessScore = math.round(Number((diff / 5).toFixed(1)), 1);
    } else if (empAge > stdDetails.std_max_age) {
      diff = empAge - stdDetails.std_max_age;
      lessScore = math.round(Number((diff / 5).toFixed(1)), 1);
    }

    if (ageCondoAllow) {
      lessScore = 0;
    }

    empAgeScore = maxScore - lessScore;
    empAgeScore = empAgeScore < 0 ? 0 : empAgeScore;
    age_weightage = math.round(
      empAgeScore * Number((ageScoreDetails.weightagePercent / 100).toFixed(1)),
      1,
    );

    /* #endregion ----------------------------------------------------end Age score calculation */
    /* #region ---------------------------------------------------Education score calculation */
    maxScore = eduScoreDetails.maxScore;
    lessScore = 0;
    addScore = 0;

    if (eduDetails.length != undefined && eduDetails.length != 0) {
      eduDetails.forEach((element) => {
        if (element.class_code > maxEdu) {
          maxEdu = element.class_code;
        }
      });
    }
    if (true) {
      if (maxEdu < stdDetails.min_edu) {
        lessScore = maxScore;
        addScore = 0;
      } else if (maxEdu >= stdDetails.min_edu && maxEdu < stdDetails.std_edu) {
        lessScore = stdDetails.std_edu - maxEdu;
        addScore = 0;
      } else if (maxEdu >= stdDetails.std_edu) {
        lessScore = 0;
        addScore = maxEdu - stdDetails.std_edu;
      }

      addScore = addScore > 2 ? 2 : addScore;
      empEduScore = maxScore + addScore - lessScore;
      empEduScore = empEduScore < 0 ? 0 : empEduScore;

      // --if Condonation
      let eduCondoAllow: boolean;
      if (eduCondoAllow) {
        empEduScore = maxScore;
      }
      //-----if ExMan
      empEduScore =
        generalDetails.candidateType == 'Ex-Service Man' &&
        empEduScore < maxScore
          ? 10
          : empEduScore;
      edu_weightage = math.round(
        empEduScore *
          Number((eduScoreDetails.weightagePercent / 100).toFixed(1)),
        1,
      );
    }
    /* #endregion ----------------------------------------------------end Education score calculation */
    /* #region -----------------------------------------------Experience score calculation */
    maxScore = expScoreDetails.maxScore;
    lessScore = 0;
    addScore = 0;

    totalExpInMonth = totalCvExpOfEmp + totalExMExpOfEmp;
    if (totalExpInMonth < stdDetails.min_exp * 12) {
      lessScore = maxScore;
      addScore = 0;
    } else if (
      totalExpInMonth >= stdDetails.min_exp * 12 &&
      totalExpInMonth < stdDetails.std_exp * 12
    ) {
      lessScore = math.round(
        (stdDetails.std_exp * 12 - totalExpInMonth) / 6,
        1,
      );
      addScore = 0;
    } else if (totalExpInMonth > stdDetails.std_exp * 12) {
      lessScore = 0;

      addScore = math.round((totalExpInMonth / 12 - stdDetails.std_exp) / 2, 1);

      /* addScore = (addScore > 5)?5:addScore;*/
    }
    addScore = addScore > 3 ? 3 : addScore;

    empExpScore = maxScore + addScore - lessScore;
    empExpScore = empExpScore < 0 ? 0 : empExpScore;

    //----applying condonation
    let isExpAllow: boolean = false;
    empExpScore = isExpAllow ? maxScore : empExpScore;

    exp_weightage = math.round(
      empExpScore * Number((expScoreDetails.weightagePercent / 100).toFixed(1)),
      1,
    );
    /* #endregion -----------------------------------------------end Experience score calculation */
    /* #region -------------------------------------------------Height,Weight,Chest experience calculation */
    let tp_to_complete: boolean = true;
    if (tp_to_complete) {
      /* #region ------------------------------Height calculation */

      maxScore = heightScoreDetails.maxScore;
      lessScore = 0;
      addScore = 0;

      if (generalDetails.height < stdDetails.min_ht) {
        lessScore = maxScore;
        addScore = 0;
      } else if (generalDetails.height >= stdDetails.std_ht) {
        let htDiff: number = generalDetails.height - stdDetails.std_ht;
        htDiff = math.round(htDiff / 2.5, 1);
        addScore = htDiff;
        lessScore = 0;
      } else if (
        generalDetails.height >= stdDetails.min_ht &&
        generalDetails.height < stdDetails.std_ht
      ) {
        let htDiff: number = stdDetails.std_ht - generalDetails.height;
        htDiff = math.round(htDiff / 2.5, 1);
        addScore = 0;
        lessScore = htDiff;
      }
      addScore = addScore > 3 ? 3 : addScore;
      empHtScore = maxScore + addScore - lessScore;
      empHtScore = empHtScore < 0 ? 0 : empHtScore;
      //-----if ExMan
      empHtScore =
        generalDetails.candidateType == 'Ex-Service Man' &&
        empHtScore < maxScore
          ? 10.0
          : empHtScore;

      let isallowhtCondo: boolean = false;
      empHtScore = isallowhtCondo ? maxScore : empHtScore;
      hgt_weightage = math.round(
        empHtScore *
          Number((heightScoreDetails.weightagePercent / 100.0).toFixed(1)),
        1,
      );
      /* #endregion -----------------------end height calculation */

      /* #region ------------------------------Weight calculation */
      maxScore = weightScoreDetails.maxScore;
      lessScore = 0;
      addScore = 0;

      let std_min_wt: number =
        generalDetails.height - 100 - (generalDetails.height - 100) * 0.1;

      let std_max_wt: number =
        generalDetails.height - 100 + (generalDetails.height - 100) * 0.1;

      let max_wt: number = std_min_wt + std_max_wt * 0.25;

      if (generalDetails.weight < stdDetails.min_wt) {
        lessScore = maxScore;
      } else if (
        generalDetails.weight >= std_min_wt &&
        generalDetails.weight <= std_max_wt
      ) {
        lessScore = 0;
      } else {
        if (generalDetails.weight < std_min_wt) {
          lessScore = (std_min_wt - generalDetails.weight) / 2.5;
        } else if (generalDetails.weight > std_max_wt) {
          lessScore = (generalDetails.weight - std_max_wt) / 2.5;
        }
      }

      addScore = addScore > 2 ? 2 : addScore;
      empWtScore = maxScore + addScore - lessScore;
      empWtScore = empWtScore < 0 ? 0 : empWtScore;

      //-------- applying condo

      let alwWtCondo: boolean = false;
      empWtScore = alwWtCondo ? maxScore : empWtScore;
      wht_weightage = math.round(
        empWtScore *
          Number((weightScoreDetails.weightagePercent / 100).toFixed(1)),
        1,
      );
      /* #endregion -----------------------end weight calculation */
      /* #region ------------------------------Chest calculation */
      maxScore = chestScoreDetails.maxScore;
      lessScore = 0;
      addScore = 0;

      if (generalDetails.gender == 'Female') {
        empChtScore = 10;
      } else if (generalDetails.gender == 'Male') {
        if (generalDetails.chest < stdDetails.min_chst) {
          addScore = 0;
          lessScore = maxScore;
        } else if (
          generalDetails.chest >= stdDetails.min_chst &&
          generalDetails.chest < stdDetails.std_chst
        ) {
          let chtDiff: number = math.round(
            stdDetails.std_chst - generalDetails.chest,
            1,
          );
          addScore = 0;
          lessScore = chtDiff;
        } else if (generalDetails.chest >= stdDetails.std_chst) {
          let chtDiff: number = math.round(
            generalDetails.chest - stdDetails.std_chst,
            1,
          );
          addScore = chtDiff;
          lessScore = 0;
        }

        addScore = addScore > 1 ? 1 : addScore;
        empChtScore = maxScore + addScore - lessScore;
        empChtScore = empChtScore < 0 ? 0 : empChtScore;
      }
      //------------applying condo;
      let alwchtcondo: boolean = false;
      empChtScore = alwchtcondo ? maxScore : empChtScore;
      chst_weightage = math.round(
        empChtScore *
          Number((chestScoreDetails.weightagePercent / 100).toFixed(1)),
        1,
      );
      /* #endregion -----------------------end chest calculation */

      totalEmpScore =
        empAgeScore +
        empEduScore +
        empExpScore +
        empHtScore +
        empWtScore +
        empChtScore;
      totalEmpScore_whtage =
        age_weightage +
        edu_weightage +
        exp_weightage +
        hgt_weightage +
        wht_weightage +
        chst_weightage;
    }

    /* #endregion -------------------------------------------------end Height,Weight,Chest calculation */
    if (totalEmpScore_whtage >= 8.5) {
      if (
        empAgeScore < 0 &&
        empEduScore < 0 &&
        empExpScore < 0 &&
        empHtScore < 0 &&
        empWtScore < 0 &&
        empChtScore < 0
      ) {
        result.isError = true;
      } else {
        result.score.empAgeScore = math.round(empAgeScore, 1);
        result.score.empEduScore = math.round(empEduScore, 1);
        result.score.empExpScore = math.round(empExpScore, 1);
        result.score.empHtScore = math.round(empHtScore, 1);
        result.score.empWtScore = math.round(empWtScore, 1);
        result.score.empChtScore = math.round(empChtScore, 1);
        result.score.totalScore = math.round(
          empAgeScore +
            empEduScore +
            empExpScore +
            empHtScore +
            empWtScore +
            empChtScore,
          1,
        );
        result.weightage.age_weightage = math.round(age_weightage, 1);
        result.weightage.edu_weightage = math.round(edu_weightage, 1);
        result.weightage.exp_weightage = math.round(exp_weightage, 1);
        result.weightage.hgt_weightage = math.round(hgt_weightage, 1);
        result.weightage.wht_weightage = math.round(wht_weightage, 1);
        result.weightage.chst_weightage = math.round(chst_weightage, 1);
        result.weightage.totalWeightage = math.round(
          age_weightage +
            edu_weightage +
            exp_weightage +
            hgt_weightage +
            wht_weightage +
            chst_weightage,
          1,
        );
      }
    } else {
      result.score.empAgeScore = math.round(empAgeScore, 1);
      result.score.empEduScore = math.round(empEduScore, 1);
      result.score.empExpScore = math.round(empExpScore, 1);
      result.score.empHtScore = math.round(empHtScore, 1);
      result.score.empWtScore = math.round(empWtScore, 1);
      result.score.empChtScore = math.round(empChtScore, 1);
      result.score.totalScore = math.round(
        empAgeScore +
          empEduScore +
          empExpScore +
          empHtScore +
          empWtScore +
          empChtScore,
        1,
      );
      result.weightage.age_weightage = math.round(age_weightage, 1);
      result.weightage.edu_weightage = math.round(edu_weightage, 1);
      result.weightage.exp_weightage = math.round(exp_weightage, 1);
      result.weightage.hgt_weightage = math.round(hgt_weightage, 1);
      result.weightage.wht_weightage = math.round(wht_weightage, 1);
      result.weightage.chst_weightage = math.round(chst_weightage, 1);
      result.weightage.totalWeightage = math.round(
        age_weightage +
          edu_weightage +
          exp_weightage +
          hgt_weightage +
          wht_weightage +
          chst_weightage,
        1,
      );
    }
  } catch (ex) {
    result.isError = true;
    result.errMsg = ex;
  }
  return result;
}

async function calculateScore(recordDetails) {
  let stdDetails: any = recordDetails[5][0];

  let result: any = {
    isError: false,
    errMsg: '',
    score: {
      empAgeScore: 0,
      empEduScore: 0,
      empExpScore: 0,
      empHtScore: 0,
      empWtScore: 0,
      empChtScore: 0,
      totalScore: 0,
    },
    weightage: {
      age_weightage: 0,
      edu_weightage: 0,
      exp_weightage: 0,
      hgt_weightage: 0,
      wht_weightage: 0,
      chst_weightage: 0,
      totalWeightage: 0,
    },
  };

  try {
    if (stdDetails.isBranch) {
      result = await CalculateScoreForCenter(recordDetails);
    } else {
      let scoreMaster: any = recordDetails[0];
      let generalDetails: any = recordDetails[1][0];
      let cvExpDetails: any = recordDetails[2];
      let exManExpDetails: any = recordDetails[3];
      let eduDetails: any = recordDetails[4];

      let maxScore: number = 0;
      let diff: number = 0;
      let empAgeScore: number = 0;
      let empEduScore: number = 0;
      let empExpScore: number = 0;
      let empHtScore: number = 0;
      let empWtScore: number = 0;
      let empChtScore: number = 0;
      let lessScore: number;
      let addScore: number;
      let maxEdu: number = 0;
      let totalCvExpOfEmp: number;
      let totalExMExpOfEmp: number = 0;
      let totalExpInMonth: number = 0;

      let age_weightage: number = 0;
      let edu_weightage: number = 0;
      let exp_weightage: number = 0;
      let hgt_weightage: number = 0;
      let wht_weightage: number = 0;
      let chst_weightage: number = 0;

      let totalEmpScore: number = 0;
      let totalEmpScore_whtage = 0;

      let ageScoreDetails: any = scoreMaster.find(
        (x) => x.parameterType == 'Age',
      );
      let eduScoreDetails: any = scoreMaster.find(
        (x) => x.parameterType == 'Education',
      );
      let expScoreDetails: any = scoreMaster.find(
        (x) => x.parameterType == 'Experience',
      );
      let heightScoreDetails: any = scoreMaster.find(
        (x) => x.parameterType == 'Height',
      );
      let weightScoreDetails: any = scoreMaster.find(
        (x) => x.parameterType == 'Weight',
      );
      let chestScoreDetails: any = scoreMaster.find(
        (x) => x.parameterType == 'Chest',
      );

      /*Change by samant on 29-Apr-2019 remove /12 as exp is in month*/
      if (cvExpDetails.length != undefined && cvExpDetails.length != 0) {
        let totalExpInMonth: number = 0;
        cvExpDetails.forEach((element) => {
          if (element.fromdate != undefined && element.todate != undefined) {
            totalExpInMonth += moment(element.todate).diff(
              moment(element.fromdate),
              'month',
            );
            //totalExpInMonth += element.exp_month;
          }
        });

        totalCvExpOfEmp = math.round(Number(totalExpInMonth.toFixed(1)), 1);
      }
      /*Change by samant on 29-Apr-2019 remove /12 as exp is in month and Exp data set changhe from Civilian to Ex-Man*/
      if (exManExpDetails.length != undefined && exManExpDetails.length != 0) {
        let totalExpInMonth: number = 0;
        exManExpDetails.forEach((element) => {
          if (element.fromdate != undefined && element.todate != undefined) {
            totalExpInMonth += moment(element.todate).diff(
              moment(element.fromdate),
              'month',
            );
            //totalExpInMonth += element.exp_month;
          }
        });
        totalExMExpOfEmp = math.round(Number(totalExpInMonth.toFixed(1)), 1);
      }
      //New Calculation
      /* #region -------------------------------------------------------Age score calculation */
      maxScore = ageScoreDetails.maxScore;
      lessScore = 0;
      addScore = 0;

      let empAge: number = generalDetails.ageInYear;
      let ageCondoAllow: boolean = false;
      if (empAge >= stdDetails.min_age && empAge <= stdDetails.max_age) {
        lessScore = 0;
      } else if (empAge < stdDetails.min_age) {
        diff = stdDetails.min_age - empAge;
        lessScore = math.round(Number((diff / 5).toFixed(1)), 1);
      } else if (empAge < stdDetails.std_min_age) {
        diff = stdDetails.std_min_age - empAge;
        lessScore = math.round(Number((diff / 5).toFixed(1)), 1);
      } else if (empAge > stdDetails.max_age) {
        diff = empAge - stdDetails.max_age;
        lessScore = math.round(Number((diff / 5).toFixed(1)), 1);
      } else if (empAge > stdDetails.std_max_age) {
        diff = empAge - stdDetails.std_max_age;
        lessScore = math.round(Number((diff / 5).toFixed(1)), 1);
      }

      if (ageCondoAllow) {
        lessScore = 0;
      }

      empAgeScore = maxScore - lessScore;
      empAgeScore = empAgeScore < 0 ? 0 : empAgeScore;
      age_weightage = math.round(
        empAgeScore *
          Number((ageScoreDetails.weightagePercent / 100).toFixed(1)),
        1,
      );

      /* #endregion ----------------------------------------------------end Age score calculation */
      /* #region ---------------------------------------------------Education score calculation */
      maxScore = eduScoreDetails.maxScore;
      lessScore = 0;
      addScore = 0;

      if (eduDetails.length != undefined && eduDetails.length != 0) {
        eduDetails.forEach((element) => {
          if (element.class_code > maxEdu) {
            maxEdu = element.class_code;
          }
        });
      }
      if (true) {
        if (maxEdu < stdDetails.min_edu) {
          lessScore = maxScore;
          addScore = 0;
        } else if (
          maxEdu >= stdDetails.min_edu &&
          maxEdu < stdDetails.std_edu
        ) {
          lessScore = stdDetails.std_edu - maxEdu;
          addScore = 0;
        } else if (maxEdu >= stdDetails.std_edu) {
          lessScore = 0;
          addScore = maxEdu - stdDetails.std_edu;
        }

        addScore = addScore > 2 ? 2 : addScore;
        empEduScore = maxScore - lessScore + addScore;
        empEduScore = empEduScore < 0 ? 0 : empEduScore;

        // --if Condonation
        let eduCondoAllow: boolean;
        if (eduCondoAllow) {
          empEduScore = maxScore;
        }
        //-----if ExMan
        empEduScore =
          generalDetails.candidateType == 'Ex-Service Man' &&
          empEduScore < maxScore
            ? 10
            : empEduScore;
        edu_weightage = math.round(
          empEduScore *
            Number((eduScoreDetails.weightagePercent / 100).toFixed(1)),
          1,
        );
      }
      /* #endregion ----------------------------------------------------end Education score calculation */
      /* #region -----------------------------------------------Experience score calculation */
      maxScore = expScoreDetails.maxScore;
      lessScore = 0;
      addScore = 0;

      totalExpInMonth = totalCvExpOfEmp + totalExMExpOfEmp;
      if (totalExpInMonth < stdDetails.min_exp * 12) {
        lessScore = maxScore;
        addScore = 0;
      } else if (
        totalExpInMonth >= stdDetails.min_exp * 12 &&
        totalExpInMonth < stdDetails.std_exp * 12
      ) {
        lessScore = math.round(
          (stdDetails.std_exp * 12 - totalExpInMonth) / 6,
          1,
        );
        addScore = 0;
      } else if (totalExpInMonth > stdDetails.std_exp * 12) {
        lessScore = 0;

        addScore = math.round(
          (totalExpInMonth / 12 - stdDetails.std_exp) / 2,
          1,
        );

        //addScore = (addScore > 5)?5:addScore;
      }
      addScore = addScore > 3 ? 3 : addScore;

      empExpScore = maxScore - lessScore + addScore;
      empExpScore = empExpScore < 0 ? 0 : empExpScore;
      // For TA / TC
      //empExpScore = 10;

      //----applying condonation
      let isExpAllow = false;
      empExpScore = isExpAllow ? maxScore : empExpScore;

      exp_weightage = math.round(
        empExpScore *
          Number((expScoreDetails.weightagePercent / 100).toFixed(1)),
        1,
      );
      /* #region -------------------------------------------------exMan experience calculation */
      //Comment by Samant for Ex-Man
      // let tp_to_complete = 0;
      // let i_less_tp = 0;
      // if(tp_to_complete >= i_less_tp && generalDetails.candidateType == 'Ex-Service Man')
      // {
      // //Ex-Man
      // lessScore=0;
      // addScore =0;

      // totalExpInMonth + 10;
      // if(totalExpInMonth < (stdDetails.min_exp*12))
      // {
      // lessScore = maxScore;
      // addScore = 0;
      // }
      // else if(totalExpInMonth >= (stdDetails.min_exp*12) && totalExpInMonth < (stdDetails.std_exp*12))
      // {
      // lessScore = math.round((((stdDetails.std_exp*12)-totalExpInMonth)/6),1);
      // addScore = 0;
      // }
      // else if(totalExpInMonth > (stdDetails.std_exp*12))
      // {
      // lessScore = 0;
      // addScore = math.round((((totalExpInMonth/12)-stdDetails.std_exp)/2),1);
      // addScore = (addScore > 3)?3:addScore;
      // }
      // empExpScore = maxScore - lessScore + addScore;
      // //-------
      // empExpScore = (empExpScore < 0)?0:empExpScore;
      // //-----------applly condonation
      // let bln_isExp_allow = false;
      // empExpScore =(empExpScore)?maxScore:empExpScore;
      // exp_weightage =  math.round(empExpScore * (expScoreDetails.weightagePercent/100).toFixed(1), 1);
      // }
      /* #endregion -------------------------------------------------exMan experience calculation */
      /* #endregion -----------------------------------------------end Experience score calculation */

      /* #region -------------------------------------------------Height,Weight,Chest experience calculation */
      let tp_to_complete: boolean = true;
      if (tp_to_complete) {
        /* #region ------------------------------Height calculation */

        maxScore = heightScoreDetails.maxScore;
        if (generalDetails.height < stdDetails.min_ht) {
          lessScore = maxScore;
          addScore = 0;
        } else if (generalDetails.height >= stdDetails.std_ht) {
          let htDiff = generalDetails.height - stdDetails.std_ht;
          htDiff = math.round(htDiff / 2.5, 1);
          addScore = htDiff;
          lessScore = 0;
        } else if (
          generalDetails.height >= stdDetails.min_ht &&
          generalDetails.height < stdDetails.std_ht
        ) {
          let htDiff = stdDetails.std_ht - generalDetails.height;
          htDiff = math.round(htDiff / 2.5, 1);
          addScore = 0;
          lessScore = htDiff;
        }
        addScore = addScore > 3 ? 3 : addScore;
        empHtScore = maxScore + addScore - lessScore;
        empHtScore = empHtScore < 0 ? 0 : empHtScore;
        let isallowhtCondo = false;
        empHtScore = isallowhtCondo ? maxScore : empHtScore;
        hgt_weightage = math.round(
          empHtScore *
            Number((heightScoreDetails.weightagePercent / 100.0).toFixed(1)),
          1,
        );
        /* #endregion -----------------------end height calculation */

        /* #region ------------------------------Weight calculation */
        maxScore = weightScoreDetails.maxScore;
        lessScore = 0;
        addScore = 0;
        let std_min_wt =
          generalDetails.height - 100 - (generalDetails.height - 100) * 0.1;

        let std_max_wt =
          generalDetails.height - 100 + (generalDetails.height - 100) * 0.1;

        let max_wt = std_min_wt + std_max_wt * 0.25;

        if (std_min_wt < stdDetails.min_wt) {
          std_min_wt = stdDetails.min_wt;
        }
        if (generalDetails.weight < stdDetails.min_wt) {
          lessScore = maxScore;
          addScore = 0;
        } else if (
          generalDetails.weight >= stdDetails.min_wt &&
          generalDetails.weight < std_min_wt
        ) {
          let wtDiff = (std_min_wt - generalDetails.height / std_min_wt) * 100;
          lessScore = math.round(wtDiff / 5, 1);
          addScore = 0;
        } else if (
          generalDetails.weight >= std_max_wt &&
          generalDetails.weight < max_wt
        ) {
          let wtDiff =
            ((generalDetails.weight - std_min_wt) / std_min_wt) * 100;
          lessScore = 0;
          addScore = math.round(wtDiff / 5, 1);
        }
        addScore = addScore > 2 ? 2 : addScore;
        empWtScore = maxScore + addScore + lessScore;
        empWtScore = empWtScore < 0 ? 0 : empWtScore;

        //-------- applying condo

        let alwWtCondo = false;
        empWtScore = alwWtCondo ? maxScore : empWtScore;
        wht_weightage = math.round(
          empWtScore *
            Number((weightScoreDetails.weightagePercent / 100).toFixed(1)),
          1,
        );
        /* #endregion -----------------------end weight calculation */
        /* #region ------------------------------Chest calculation */
        maxScore = chestScoreDetails.maxScore;
        if (generalDetails.gender == 'Female') {
          empChtScore = 10;
        } else if (generalDetails.gender == 'Male') {
          if (generalDetails.chest < stdDetails.min_chst) {
            addScore = 0;
            lessScore = maxScore;
          } else if (
            generalDetails.chest >= stdDetails.min_chst &&
            generalDetails.chest < stdDetails.std_chst
          ) {
            let chtDiff = math.round(
              stdDetails.std_chst - generalDetails.chest,
              1,
            );
            addScore = 0;
            lessScore = chtDiff;
          } else if (generalDetails.chest >= stdDetails.std_chst) {
            let chtDiff = math.round(
              generalDetails.chest - stdDetails.std_chst,
              1,
            );
            addScore = chtDiff;
            lessScore = 0;
          }

          addScore = addScore > 1 ? 1 : addScore;
          empChtScore = maxScore + addScore - lessScore;
          empChtScore = empChtScore < 0 ? 0 : empChtScore;
        }
        //------------applying condo;
        let alwchtcondo = false;
        empChtScore = alwchtcondo ? maxScore : empChtScore;
        chst_weightage = math.round(
          empChtScore *
            Number((chestScoreDetails.weightagePercent / 100).toFixed(1)),
          1,
        );
        /* #endregion -----------------------end chest calculation */

        totalEmpScore =
          empAgeScore +
          empEduScore +
          empExpScore +
          empHtScore +
          empWtScore +
          empChtScore;
        totalEmpScore_whtage =
          age_weightage +
          edu_weightage +
          exp_weightage +
          hgt_weightage +
          wht_weightage +
          chst_weightage;
      }

      /* #endregion -------------------------------------------------end Height,Weight,Chest calculation */

      if (
        totalEmpScore_whtage >= 8.5 &&
        generalDetails.candidateType == 'Civilian'
      ) {
        if (
          empAgeScore < 0 &&
          empEduScore < 0 &&
          empExpScore < 0 &&
          empHtScore < 0 &&
          empWtScore < 0 &&
          empChtScore < 0
        ) {
          result.isError = true;
        } else {
          result.score.empAgeScore = empAgeScore;
          result.score.empEduScore = empEduScore;
          result.score.empExpScore = empExpScore;
          result.score.empHtScore = empHtScore;
          result.score.empWtScore = empWtScore;
          result.score.empChtScore = empChtScore;
          result.score.totalScore =
            empAgeScore +
            empEduScore +
            empExpScore +
            empHtScore +
            empWtScore +
            empChtScore;
          result.weightage.age_weightage = age_weightage;
          result.weightage.edu_weightage = edu_weightage;
          result.weightage.exp_weightage = exp_weightage;
          result.weightage.hgt_weightage = hgt_weightage;
          result.weightage.wht_weightage = wht_weightage;
          result.weightage.chst_weightage = chst_weightage;
          result.weightage.totalWeightage =
            age_weightage +
            edu_weightage +
            exp_weightage +
            hgt_weightage +
            wht_weightage +
            chst_weightage;
        }
      } else if (generalDetails.candidateType == 'Ex-Service Man') {
        result.score.empAgeScore = empAgeScore;
        result.score.empEduScore = empEduScore;
        result.score.empExpScore = empExpScore;
        result.score.empHtScore = empHtScore;
        result.score.empWtScore = empWtScore;
        result.score.empChtScore = empChtScore;
        result.score.totalScore =
          empAgeScore +
          empEduScore +
          empExpScore +
          empHtScore +
          empWtScore +
          empChtScore;
        result.weightage.age_weightage = age_weightage;
        result.weightage.edu_weightage = edu_weightage;
        result.weightage.exp_weightage = exp_weightage;
        result.weightage.hgt_weightage = hgt_weightage;
        result.weightage.wht_weightage = wht_weightage;
        result.weightage.chst_weightage = chst_weightage;
        result.weightage.totalWeightage =
          age_weightage +
          edu_weightage +
          exp_weightage +
          hgt_weightage +
          wht_weightage +
          chst_weightage;
      }
    }
  } catch (ex) {
    result.isError = true;
    result.errMsg = ex;
  }

  return result;
}

export class ScoreService {
  async calculateScore(
    loggedInUser: any,
    formNo: string,
    desigCode: string,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      const recordDetails = await getResultSets(
        companyDb,
        constant.P_ScoreMaster,
        {
          action: 'getdetails',
          formNo: formNo,
          desigCode: desigCode,
        },
      );
      let result: any = await calculateScore(recordDetails);
      return result;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'score/calculateScore',
        error: `Error :- ${error.message ?? ''}, Detail :- ${error.detail ?? ''}`,
        requestPayload: `formNo : ${formNo}, desigCode : ${desigCode}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getScoerAndWeihtagePercent(
    loggedInUser: any,
    formNo: string,
    desigCode: string,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let scoreDetail: any = await companyDb.query(
        `EXEC ${constant.P_ScoreMaster} @action = @0, @formNo = @1, @desigCode = @2`,
        ['scoredetails', formNo, desigCode],
      );
      return scoreDetail;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'score/getScoerAndWeihtagePercent',
        error: `Error :- ${error.message ?? ''}, Detail :- ${error.detail ?? ''}`,
        requestPayload: `formNo : ${formNo}, desigCode : ${desigCode}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getScoreDetails(
    loggedInUser: any,
    action: string,
    formNo: string,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let scoreDetail = await getResultSets(
        companyDb,
        constant.P_ScoreDetails,
        {
          action: action,
          formNo: formNo,
        },
      );
      return scoreDetail;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'score/getScoreDetails',
        error: `Error :- ${error.message ?? ''}, Detail :- ${error.detail ?? ''}`,
        requestPayload: `action : ${action}, formNo : ${formNo}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async getCondonationDetails(
    loggedInUser: any,
    action: string,
    formNo: string,
    branchCode: string,
    unitCode: string,
    customerName: string,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let condoDetail = await getResultSets(
        companyDb,
        constant.P_CondonationDetail,
        {
          action: action,
          formNo: formNo,
          branchCode: branchCode,
          unitCode: unitCode,
          customerName: customerName,
        },
      );
      return condoDetail;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'score/getCondonationDetails',
        error: `Error :- ${error.message ?? ''}, Detail :- ${error.detail ?? ''}`,
        requestPayload: `action : ${action}, formNo : ${formNo}, branchCode : ${branchCode}, unitCode : ${unitCode}, customerName : ${customerName}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async addScoreDetails(loggedInUser: any, scoreDetail: any): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let addedScoreDetail: any = await companyDb.query(
        `EXEC ${constant.P_ScoreDetails} @action = @0,
         @formNo = @1,
         @ageScore = @2, 
         @eduScore = @3, 
         @expScore = @4, 
         @heightScore = @5,
         @weightScore = @6,
         @chestScore = @7,
         @ageWeightage = @8,
         @eduWeightage = @9,
         @expWeightage = @10,
         @heightWeightage = @11,
         @weightWeightage = @12,
         @chestWeightage = @13,
         @totalScore = @14,
         @totalWhtage = @15,
         @result = @16,
         @rank = @17, 
         @userId = @18`,
        [
          scoreDetail.action,
          scoreDetail.formNo,
          scoreDetail.ageScore,
          scoreDetail.eduScore,
          scoreDetail.expScore,
          scoreDetail.heightScore,
          scoreDetail.weightScore,
          scoreDetail.chestScore,
          scoreDetail.ageWeightage,
          scoreDetail.eduWeightage,
          scoreDetail.expWeightage,
          scoreDetail.heightWeightage,
          scoreDetail.weightWeightage,
          scoreDetail.chestWeightage,
          scoreDetail.totalScore,
          scoreDetail.totalWhtage,
          scoreDetail.result,
          scoreDetail.rank,
          scoreDetail.userId,
        ],
      );
      return { result: 'Record Inserted' };
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'score/addScoreDetails',
        error: `Error :- ${error.message ?? ''}, Detail :- ${error.detail ?? ''}`,
        requestPayload: `${JSON.stringify(scoreDetail)}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }

  async applyCondonation(loggedInUser: any, condoDetail: any): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let addedCondoDetail = await getResultSets(
        companyDb,
        constant.P_CondonationDetail,
        {
          action: condoDetail.action,
          formNo: condoDetail.formNo,
          branchCode: condoDetail.branchCode,
          unitCode: condoDetail.unitCode,
          customerName: condoDetail.customerName,
          condoReason: condoDetail.condoReason,
          condoRemark: condoDetail.condoRemark,
          ageScore: condoDetail.ageScore,
          eduScore: condoDetail.eduScore,
          expScore: condoDetail.expScore,
          heightScore: condoDetail.heightScore,
          weightScore: condoDetail.weightScore,
          chestScore: condoDetail.chestScore,
          ageWeightage: condoDetail.ageWeightage,
          eduWeightage: condoDetail.eduWeightage,
          expWeightage: condoDetail.expWeightage,
          heightWeightage: condoDetail.heightWeightage,
          weightWeightage: condoDetail.weightWeightage,
          chestWeightage: condoDetail.chestWeightage,
          totalScore: condoDetail.totalScore,
          totalWhtage: condoDetail.totalWhtage,
          result: condoDetail.result,
          rank: condoDetail.rank,
          userId: condoDetail.userId,
        },
      );
      return addedCondoDetail;
    } catch (error: any) {
      Logger.error({
        clientId: loggedInUser.clientId,
        src: 'score/applyCondonation',
        error: `Error :- ${error.message ?? ''}, Detail :- ${error.detail ?? ''}`,
        requestPayload: `${JSON.stringify(condoDetail)}`,
        loggedBy: loggedInUser.userId,
      });
      error =
        error.driverError || error.name == 'RequestError'
          ? new CustomError('InternalServerError')
          : error;
      throw error;
    }
  }
}
