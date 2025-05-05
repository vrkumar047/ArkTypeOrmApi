import { Request, Response } from 'express';
import Logger from '../utils/logger';
export const CustomResponse = (req: Request, res: Response) => {
  try {
    if (res.locals?.error != undefined && res.locals.error.error != undefined) {
      if (res.locals.error.error.indexOf('Conflict') != -1) {
        let error: any = res.locals.error;
        error.statusCode = 409;
        res.locals = {};
        res.status(error.statusCode).json(error);
      } else if (res.locals.error.error.indexOf('Token') != -1) {
        let error: any = res.locals.error;
        error.statusCode = 401;
        res.locals = {};
        res.status(error.statusCode).json(error);
      } else if (res.locals.error.error.indexOf('FailedGoogleLogin') != -1) {
        let error: any = res.locals.error;
        error.statusCode = 403;
        res.locals = {};
        res.status(error.statusCode).json(error);
      } else if (res.locals.error.error.indexOf('FailedLinkedInLogin') != -1) {
        let error: any = res.locals.error;
        error.statusCode = 403;
        res.locals = {};
        res.status(error.statusCode).json(error);
      } else {
        let error: any = res.locals.error;
        error.statusCode =
          res.locals.error.statusCode != undefined
            ? res.locals.error.statusCode
            : 500;
        res.locals = {};
        res.status(error.statusCode).json(error);
      }
    } else if (res.locals?.error != undefined) {
      let error: any = res.locals.error;
      error.statusCode =
        res.locals.error.statusCode != undefined
          ? res.locals.error.statusCode
          : 500;
      res.locals = {};
      res.status(error.statusCode).json(error);
    } else if (res.locals.data == undefined) {
      res.locals = {};
      res.status(404).json({
        statusCode: 404,
        status: 'fail',
        message: 'Not found',
      });
    } else {
      if (
        req.originalUrl == '/api/account/signIn' ||
        req.originalUrl == '/api/account/refreshToken'
      ) {
        let data: any = res.locals.data;
        let token: string = data[0][0].token;
        let refeshToken: string = data[0][0].refreshToken;
        delete data[0][0].token;
        delete data[0][0].refreshToken;
        delete data[0][0].hash_password;
        res.locals = {};
        res.status(200).json({
          statusCode: 200,
          status: 'success',
          token: token,
          refreshToken: refeshToken,
          data: data,
        });
      } else {
        let data: any = res.locals.data;
        res.locals = {};
        // res.status(200).json({
        //   statusCode: 200,
        //   status: 'success',
        //   data: data,
        // });
        res.status(200).json(data);
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
