import { Request, Response, NextFunction } from 'express';
import { ICardService } from '../services/icard.service';
const icardService = new ICardService();
export class ICardController {
  async generateQrCode(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let qrDetail: any = req.body;
      if (loggedInUser) {
        let printedCardDetail: any = await icardService.generateQrCode(
          loggedInUser,
          qrDetail,
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

  async convertPdf(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let cardDetail: any = req.body;
      if (loggedInUser) {
        let printedCardDetail: any = await icardService.convertPdf(
          loggedInUser,
          cardDetail,
        );
        console.log('controller response');
        console.log(printedCardDetail);
        res.locals.data = printedCardDetail;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async convertPdfFromBS64(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let empDetail: any = req.body;
      if (loggedInUser) {
        let printedCardDetail: any = await icardService.convertPdfFromBS64(
          loggedInUser,
          empDetail,
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

    async generateNewICardPdf(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let empDetail: any = req.body.empDetail;
      if (loggedInUser) {
        let printedCardDetail: any = await icardService.convertPdfFromBS64New(
          loggedInUser,
          empDetail,
        );
        console.log('controller response');
        console.log(printedCardDetail);
        res.locals.data = printedCardDetail;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async downloadIcard(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let formNo: string = req.body.formNo;
      if (loggedInUser) {
        let printedCardDetail: any = await icardService.downloadICard(
          loggedInUser,
          formNo,
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

  async getCardPrintDetails(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let formNo: string = req.params.formNo;
      if (loggedInUser) {
        let states: any[] = [];
        if (!res.locals.data) {
          states = await icardService.getCardPrintDetails(loggedInUser, formNo);
        } else {
          states = JSON.parse(res.locals.data);
        }

        res.locals.data = states;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async generateEmployeeRegNo(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let empDetails: string = req.body.empDetails;
      if (!loggedInUser) {
        let regDetail: any;
        if (!res.locals.data) {
          regDetail = await icardService.generateEmployeeRegNo(
            loggedInUser,
            empDetails,
          );
        } else {
          regDetail = JSON.parse(res.locals.data);
        }

        res.locals.data = regDetail;
        return res.json(res.locals.data);
      } else {
                return res.status(500).json({
          isError: true,
          errMsg: "Unauthorized",
        });
      }
    } catch (err:any) {
            return res.status(500).json({
        isError: true,
        errMsg: err.message,
      });
    }
  }

  async getCardStatus(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      let regNo: string = req.params.regNo;
      let userId: string = req.params.userId;

      if (loggedInUser) {
        let cardDetail: any = await icardService.getCardStatus(
          loggedInUser,
          regNo,
          userId,
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
        let printedCardDetail: any = await icardService.postPrintCard(
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

      async getCardPrintDetailsWithRegNo(req: Request, res: Response, next: NextFunction) {
      try {
        let loggedInUser: any = req['currentUser'];
        let regNo: string = req.params.regNo ?? '';
  
        
        if (loggedInUser) {
          let data: any = await icardService.getCardPrintDetailsWithRegNo(loggedInUser, regNo);
          res.locals.data = data;
        } else {
          res.locals.error = 'Unauthorized';
        }
      } catch (err) {
        res.locals.error = err;
      }
      next();
    }
}
