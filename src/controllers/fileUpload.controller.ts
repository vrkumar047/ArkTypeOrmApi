import { Request, Response, NextFunction } from 'express';
import { FileUploadService } from '../services/fileUpload.service';
const fileUploadService = new FileUploadService();
export class FileUploadController {
  async uploadDocumentFile(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      //  if (loggedInUser) {
      // req['clientId'] = loggedInUser.clientId;
      let test = req.files;
      req['clientId'] = 'sis';
      let userImage: any = await fileUploadService.uploadDocumentFile(req, res);
      res.locals.data = userImage;
      // } else {
      //   res.locals.error = 'Unauthorized';
      // }
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
