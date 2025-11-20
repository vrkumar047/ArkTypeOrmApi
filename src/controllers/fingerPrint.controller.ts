import { Request, Response, NextFunction } from 'express';
import { FingerPrintService } from '../services/fingerPrint.service';
const fingerPrintService = new FingerPrintService();
export class FingerPrintController {
  async addFingerPrint(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let cardDetail: any = req.body;
      if (loggedInUser) {
        let printedCardDetail: any = await fingerPrintService.addFingerPrint(
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
