import { Request, Response, NextFunction } from 'express';
import { ScoreService } from '../services/score.service';
const scoreService = new ScoreService();
export class ScoreController {
  async calculateScore(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let formNo: string = req.params.formNo ?? '';
      let desigCode: string = req.params.desigCode ?? '';
      if (loggedInUser) {
        let cardDetail: any = await scoreService.calculateScore(
          loggedInUser,
          formNo,
          desigCode,
        );
        res.locals.data = cardDetail;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async getScoerAndWeihttagePercent(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      let loggedInUser: any = req['currentUser'];
      let formNo: string = req.params.formNo ?? '';
      let desigCode: string = req.params.desigCode ?? '';
      if (loggedInUser) {
        let cardDetail: any = await scoreService.calculateScore(
          loggedInUser,
          formNo,
          desigCode,
        );
        res.locals.data = cardDetail;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async getScoreDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let formNo: string = req.params.formNo ?? '';
      if (loggedInUser) {
        let scoreDetail: any = await scoreService.getScoreDetails(
          loggedInUser,
          action,
          formNo,
        );
        res.locals.data = scoreDetail;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async getCondonationDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let action: string = req.params.action ?? '';
      let formNo: string = req.params.formNo ?? '';
      let branchCode: string = req.params.branchCode ?? '';
      let unitCode: string = req.params.unitCode ?? '';
      let desigCode: string = req.params.desigCode ?? '';
      if (loggedInUser) {
        let cardDetail: any = await scoreService.getCondonationDetails(
          loggedInUser,
          action,
          formNo,
          branchCode,
          unitCode,
          desigCode,
        );
        res.locals.data = cardDetail;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async addScoreDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let scoreDetail: any = req.body;
      if (loggedInUser) {
        let addedScoreDetail: any = await scoreService.addScoreDetails(
          loggedInUser,
          scoreDetail,
        );
        res.locals.data = addedScoreDetail;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async applyCondonation(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let cardDetail: any = req.body;
      if (loggedInUser) {
        let printedCardDetail: any = await scoreService.applyCondonation(
          loggedInUser,
          cardDetail,
        );
        res.locals.data = printedCardDetail;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }
}
