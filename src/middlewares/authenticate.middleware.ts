import { NextFunction, Request, Response } from 'express';
import { JWT } from '../helpers/jwt';
import * as dotenv from 'dotenv';
dotenv.config();
const jwt = new JWT();

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let header = req.headers.authorization;
    let aud = req.headers.origin;
    if (!header) {
      return res.status(401).json({ status: 'fail', error: 'Unauthorized' });
    }
    if (!aud) {
      // comment this block to secure for specific domain
      aud = 'http://103.185.212.89:9785';
    }
    if (!aud) {
      return res.status(421).json({
        status: 'fail',
        error: 'No enough privileges to access endpoint',
      });
    }

    const token = header.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'fail', error: 'Unauthorized' });
    }
    const decoded = await jwt.validateToken(token, aud);
    if (!decoded) {
      return res.status(401).json({ status: 'fail', error: 'Unauthorized' });
    }
    let currentUser: any = {};
    currentUser.userId = decoded.userId;
    currentUser.clientId = decoded.clientId;
    currentUser.firstName = decoded.firstName;
    currentUser.lastName = decoded.lastName;
    currentUser.fullName = decoded.fullName;
    currentUser.mobile = decoded.mobile;
    currentUser.emailId = decoded.emailId;
    currentUser.secret = decoded.secret;
    currentUser.userClaims = decoded.userClaims;
    req['currentUser'] = currentUser;
    next();
  } catch (err: any) {
    if (err.name == 'TokenExpiredError') {
      return res.status(401).json({ status: 'fail', error: 'Invalid token' });
    } else {
      return res.status(401).json({ status: 'fail', error: err.message });
    }
  }
};
