import { NextFunction, Request, Response } from 'express';
import { GetCompanyDb } from '../_dbs/mssql/pgConnection';

export const authorize = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let masterDb = await GetCompanyDb();
    const userRepo = masterDb.getRepository('');
    const user = await userRepo.findOne({
      where: { userId: req[' currentUser'].id },
    });
    console.log(user);
    if (!roles.includes('user')) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};
