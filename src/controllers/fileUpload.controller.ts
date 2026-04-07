import { Request, Response, NextFunction } from 'express';
import { FileUploadService } from '../services/fileUpload.service';
import { BlobFileService } from '../services/blobFile.service';
import { forEach } from 'lodash';
const fileUploadService = new FileUploadService();
const blobFileService = new BlobFileService();
export class FileUploadController {
  async uploadDocumentFile(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      if (loggedInUser) {
        req['clientId'] = loggedInUser.clientId;
        // let documentDetail: any = await fileUploadService.uploadDocumentFile(
        //   loggedInUser,
        //   req,
        //   res,
        // );
        let docsList: any[] = JSON.parse(req.body.docsList);
        let documentDetail: any = await blobFileService.uploadFile(
          req.params.formNo,
          req.file,
        );
        if (documentDetail && documentDetail.filePath.indexOf('SIS') != -1) {
          documentDetail.formNo = req.params.formNo;
          documentDetail.docCode = req.params.docCode;
        } else {
          throw Error('Unable to upload file');
        }
        let uploadedDocList = await fileUploadService.saveDocumentFile(
          loggedInUser,
          docsList,
          documentDetail,
        );
        res.locals.data = uploadedDocList;
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
        let fileUrl: string = req.body.fileUrl;
        let docList: any[] = req.body.docsList ?? [];
        let userImage: any[] = await fileUploadService.captureDocument(
          loggedInUser,
          formNo,
          docId,
          fileName,
          docList,
        );
        if (userImage.length > 0) {
          userImage.forEach((e) => {
            e.fileUrl = fileUrl;
          });
        }
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

  async uploadFileToS3(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      // if (loggedInUser) {
      let applicationNo: string = req.body.applicationNo;
      if (!req.file) throw new Error('No file uploaded');
      if (applicationNo == undefined || applicationNo == '')
        throw new Error('Application No. is required');
      let uploadedFile: any = await blobFileService.uploadFile(
        applicationNo,
        req.file,
      );
      res.locals.data = uploadedFile;
      // } else {
      //   res.locals.error = 'Unauthorized';
      // }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async getSignedUrl(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: any = req['currentUser'];
      // if (loggedInUser) {
      let filePath: string = req.body.filePath;
      if (filePath == undefined || filePath == '')
        throw new Error('File path is required');
      let signedUrl: any = await blobFileService.getFileUrl(filePath);
      res.locals.data = signedUrl;
      // } else {
      //   res.locals.error = 'Unauthorized';
      // }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }
}
