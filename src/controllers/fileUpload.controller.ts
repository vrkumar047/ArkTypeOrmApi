import { Request, Response, NextFunction } from 'express';
import { FileUploadService } from '../services/fileUpload.service';
const fileUploadService = new FileUploadService();
export class FileUploadController {
  async uploadDocumentFile(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      if (loggedInUser) {
        req['clientId'] = loggedInUser.clientId;
        let documentDetail: any = await fileUploadService.uploadDocumentFile(
          loggedInUser,
          req,
          res,
        );
        // let resp: any =
        //   typeof documentDetail === 'object'
        //     ? [documentDetail]
        //     : documentDetail;
        res.locals.data = documentDetail;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async captureDocument(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      if (loggedInUser) {
        let formNo: string = req.body.formNo;
        let docId: number = parseInt(req.body.docId ?? '0');
        let fileName: string = req.body.fileName;
        let docList: any[] = req.body.docsList ?? [];
        let userImage: any = await fileUploadService.captureDocument(
          loggedInUser,
          formNo,
          docId,
          fileName,
          docList,
        );
        res.locals.data = userImage;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async generatePdf(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      if (loggedInUser) {
        let formNo: string = req.body.formNo;
        let docId: number = parseInt(req.body.docId ?? '0');
        let fileName: string = req.body.fileName;
        let docList: any[] = req.body.docsList ?? [];
        let userImage: any = await fileUploadService.generatePdf(
          loggedInUser,
          formNo,
        );
        console.log(userImage);
        res.locals.data = userImage;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async captureImage(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      if (loggedInUser) {
        let formNo: string = req.body.formNo;
        let physicalDetail: any = {
          formNo: req.body.formNo,
          image1: req.body.images[0].img,
          image2: req.body.images[1].img,
          image3: req.body.images[2].img,
          image4: req.body.images[3].img,
          defImg: parseInt(req.body.defaultImg ?? '0'),
        };

        let userImage: any = await fileUploadService.captureImage(
          loggedInUser,
          physicalDetail,
        );
        res.locals.data = userImage;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async captureSingature(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      if (loggedInUser) {
        let fileDetail: any = req.body;
        console.log(`file detail :- `, fileDetail);
        let userImage: any = await fileUploadService.captureSingature(
          loggedInUser,
          fileDetail,
        );
        res.locals.data = userImage;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async getImageBase64(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      if (loggedInUser) {
        let formNo: string = req.params.formNo;
        let fileSeq: number = parseInt(req.params.fileSeq ?? '0');
        let userImage: any = await fileUploadService.getImageBase64(
          loggedInUser,
          formNo,
          fileSeq,
        );
        res.locals.data = userImage;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }
}
