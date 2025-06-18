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

  async userProfilePicture(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      if (loggedInUser) {
        let userImage: any = await fileUploadService.uploadUserImage(req, res);
        res.locals.data = userImage;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async staffPicture(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      if (loggedInUser) {
        let staffPic: any = await fileUploadService.uploadStaffPicture(
          req,
          res,
        );
        res.locals.data = staffPic;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async staffIdProof(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      if (loggedInUser) {
        let userImage: any = await fileUploadService.uploadStaffIdProof(
          req,
          res,
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
