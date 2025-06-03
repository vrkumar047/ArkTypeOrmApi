import Joi from 'joi';
import { CustomError } from '../helpers/validatorCustomError';

const AddEmployee = Joi.object({
  head: Joi.string()
    .required()
    .error((errors) => CustomError('head', errors)),
  branchCode: Joi.string()
    .required()
    .error((errors) => CustomError('branchCode', errors)),
  updateBit: Joi.number()
    .required()
    .error((errors) => CustomError('updateBit', errors)),
  prspctNo: Joi.string()
    .required()
    .error((errors) => CustomError('prspctNo', errors)),
  schemeId: Joi.string()
    .required()
    .error((errors) => CustomError('schemeId', errors)),
  firstName: Joi.string()
    .required()
    .error((errors) => CustomError('firstName', errors)),

  middleName: Joi.string()
    .required()
    .allow(null)
    .allow('')
    .error((errors) => CustomError('middleName', errors)),
  lastName: Joi.string()
    .required()
    .allow(null)
    .allow('')
    .error((errors) => CustomError('lastName', errors)),
  designation: Joi.string()
    .required()
    .error((errors) => CustomError('designation', errors)),
  candidateType: Joi.number()
    .required()
    .error((errors) => CustomError('candidateType', errors)),
  physical_category: Joi.string()
    .required()
    .error((errors) => CustomError('physical_category', errors)),
  feeType: Joi.number()
    .required()
    .error((errors) => CustomError('feeType', errors)),
  gender: Joi.string()
    .required()
    .error((errors) => CustomError('gender', errors)),
  dob: Joi.string()
    .required()
    .error((errors) => CustomError('dob', errors)),
  ageYear: Joi.number()
    .required()
    .error((errors) => CustomError('ageYear', errors)),
  ageMonth: Joi.number()
    .required()
    .error((errors) => CustomError('ageMonth', errors)),
  ageDays: Joi.number()
    .required()
    .error((errors) => CustomError('ageDays', errors)),
  motherName: Joi.string()
    .required()
    .error((errors) => CustomError('motherName', errors)),
  fatherName: Joi.string()
    .required()
    .error((errors) => CustomError('fatherName', errors)),
  mobileNo: Joi.string()
    .required()
    .error((errors) => CustomError('mobileNo', errors)),
  emailId: Joi.string()
    .required()
    .error((errors) => CustomError('emailId', errors)),
  casteCategory: Joi.number()
    .required()
    .error((errors) => CustomError('casteCategory', errors)),
  nationlity: Joi.string()
    .required()
    .error((errors) => CustomError('nationlity', errors)),
  religion: Joi.string()
    .required()
    .error((errors) => CustomError('religion', errors)),
  casteId: Joi.number()
    .required()
    .error((errors) => CustomError('casteId', errors)),
  martStatus: Joi.string()
    .required()
    .error((errors) => CustomError('martStatus', errors)),
  spouseName: Joi.string()
    .required()
    .error((errors) => CustomError('spouseName', errors)),
  bldGroup: Joi.string()
    .required()
    .error((errors) => CustomError('bldGroup', errors)),
  batchNo: Joi.string()
    .required()
    .error((errors) => CustomError('batchNo', errors)),
  voterId: Joi.string()
    .required()
    .error((errors) => CustomError('voterId', errors)),
  noVoterId: Joi.number()
    .required()
    .error((errors) => CustomError('noVoterId', errors)),
  residenceState: Joi.string()
    .required()
    .error((errors) => CustomError('residenceState', errors)),
  voterState: Joi.string()
    .required()
    .error((errors) => CustomError('voterState', errors)),
  voterPc: Joi.string()
    .required()
    .error((errors) => CustomError('voterPc', errors)),
  voterAc: Joi.string()
    .required()
    .error((errors) => CustomError('voterAc', errors)),
  aadharNo: Joi.string()
    .required()
    .error((errors) => CustomError('aadharNo', errors)),
  aadharName: Joi.string()
    .required()
    .error((errors) => CustomError('aadharName', errors)),
  aadharDob: Joi.string()
    .required()
    .error((errors) => CustomError('aadharDob', errors)),
  UANNo: Joi.string()
    .required()
    .error((errors) => CustomError('UANNo', errors)),
  ESINo: Joi.string()
    .required()
    .error((errors) => CustomError('ESINo', errors)),
  Otp: Joi.number()
    .required()
    .error((errors) => CustomError('Otp', errors)),
  presAddress: Joi.string()
    .required()
    .error((errors) => CustomError('presAddress', errors)),
  presAddress_Country: Joi.string()
    .required()
    .error((errors) => CustomError('presAddress_Country', errors)),
  presAddress_State: Joi.string()
    .required()
    .error((errors) => CustomError('presAddress_State', errors)),
  presAddress_District: Joi.string()
    .required()
    .error((errors) => CustomError('presAddress_District', errors)),
  presAddress_City: Joi.string()
    .required()
    .error((errors) => CustomError('presAddress_City', errors)),
  presAddress_PinCode: Joi.number()
    .required()
    .error((errors) => CustomError('presAddress_PinCode', errors)),
  permaAddress: Joi.string()
    .required()
    .error((errors) => CustomError('permaAddress', errors)),
  permaAddress_Country: Joi.string()
    .required()
    .error((errors) => CustomError('permaAddress_Country', errors)),
  permaAddress_State: Joi.string()
    .required()
    .error((errors) => CustomError('permaAddress_State', errors)),

  permaAddress_District: Joi.string()
    .required()
    .error((errors) => CustomError('permaAddress_District', errors)),
  permaAddress_City: Joi.string()
    .required()
    .error((errors) => CustomError('permaAddress_City', errors)),
  permaAddress_PinCode: Joi.number()
    .required()
    .error((errors) => CustomError('permaAddress_PinCode', errors)),
  isAllowNoExp: Joi.number()
    .required()
    .error((errors) => CustomError('isAllowNoExp', errors)),
  isAllowNoTest: Joi.number()
    .required()
    .error((errors) => CustomError('isAllowNoTest', errors)),
  isMachineExmpted: Joi.number()
    .required()
    .error((errors) => CustomError('isMachineExmpted', errors)),
  isCondoExmpted: Joi.number()
    .required()
    .error((errors) => CustomError('isCondoExmpted', errors)),
  isAssessmentExmpted: Joi.number()
    .required()
    .error((errors) => CustomError('isAssessmentExmpted', errors)),
  identityMark: Joi.string()
    .required()
    .error((errors) => CustomError('identityMark', errors)),
  userId: Joi.string()
    .required()
    .error((errors) => CustomError('userId', errors)),
});

export { AddEmployee };
