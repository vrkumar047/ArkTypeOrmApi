import ErrorMessage from '../_configs/errors/customError.json';
export class CustomError {
  statusCode?: number;
  status: string;
  error: string;
  message?: string;

  constructor(error: string, message: string = '') {
    if (error == 'Unauthorized') this.statusCode = 403;
    else if (error == 'UnprocessableEntity') this.statusCode = 422;
    else if (error == 'RecordNotFound') this.statusCode = 500;
    else if (error == 'IncorrectPassword') this.statusCode = 401;
    else if (error == 'UserBlocked') this.statusCode = 403;
    else if (error == 'UserInActive') this.statusCode = 403;
    else if (error == 'InternalServerError') this.statusCode = 500;
    else if (error == 'InvalidToken') this.statusCode = 401;
    else if (error == 'TokenExpired') this.statusCode = 401;
    else if (error == 'UsedToken') this.statusCode = 401;
    else if (error == 'NoAccessToken') this.statusCode = 401;
    else if (error == 'InvalidRefreshToken') this.statusCode = 401;
    else if (error == 'RefreshTokenExpired') this.statusCode = 401;
    else if (error.indexOf('Conflict') != -1) this.statusCode = 409;
    else if (error == 'NoPrivileges') this.statusCode = 421;
    else if (error == 'NotPermitted') this.statusCode = 403;

    this.status = 'fail';
    this.error = error;
    this.message = message != '' ? message : ErrorMessage[error];
  }
}
