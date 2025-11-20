import { Request, Response, NextFunction } from 'express';
import { ScoreService } from '../services/score.service';
const scoreService = new ScoreService();
export class ScoreController {
  async calculateScore(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let formNo: string = req.params.formNo ?? '';
      let desigCode: string = req.params.desigCode ?? '';
      let scoreDetail: any;
      scoreDetail.action = 'getdetails';
      scoreDetail.formNo = formNo;
      scoreDetail.desigCode = desigCode;
      if (loggedInUser) {
        let cardDetail: any = await scoreService.calculateScore(
          loggedInUser,
          scoreDetail,
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

  async postPrintCard(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let cardDetail: any = req.body;
      if (loggedInUser) {
        let printedCardDetail: any = await scoreService.postPrintCard(
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
