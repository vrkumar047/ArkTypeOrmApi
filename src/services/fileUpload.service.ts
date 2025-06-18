import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { existsSync, mkdirSync } from 'fs';
import moment from 'moment';
import { CustomError } from '../helpers/validatorCustomError';
import dotenv from 'dotenv';
dotenv.config();
const { clientId } = process.env;

export class FileUploadService {
  //#region ---------------------------------------------------------------- document image storage
  fileStorage = multer.diskStorage({
    destination: function (req: any, file: any, cb) {
      let mmyy: string = moment().format('MMYY');
      let folderPath: string = path.join(
        __dirname,
        `../../Uploads/files/${clientId}/${mmyy}`,
      );
      if (!existsSync(folderPath)) {
        mkdirSync(folderPath, { recursive: true });
      }
      cb(null, folderPath);
    },
    filename: function (req: any, file: any, cb) {
      let splitedFileName: string[] = file.originalname.split('.');
      let fileExt: string = splitedFileName[splitedFileName.length - 1];
      //let newFileName: string = req.params.formNo.replace('/', '-');
      let newFileName: string = `${moment().format('HHmmss')}`;
      //cb(null, `${newFileName}_doc_${req.params.docCode}.${fileExt}`);
      cb(null, `${newFileName}_doc_1.${fileExt}`);
    },
  });

  fileFilters = (req: any, file: any, cb: any) => {
    if (
      file.mimetype == 'image/jpeg' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/gif'
    ) {
      cb(null, true);
    } else {
      cb(null, false, new Error('Wrong MIME Type'));
      req.modelError = {
        details: [
          {
            message: 'Unsupported file extension',
          },
        ],
      };
    }
  };

  uploadFile = multer({
    storage: this.fileStorage,
    limits: {
      fileSize: 1024 * 1024 * 10,
    },
    fileFilter: this.fileFilters,
  }).any();

  uploadDocumentFile = (req: any, res: any) => {
    return new Promise((resolve, reject) => {
      this.uploadFile(req, res, (err) => {
        let fileDetail: any,
          actualFilePath: string = '',
          actualFileName: string = '',
          originalName: string = '';
        if (err) {
          return reject(err);
        }
        if (req.modelError) {
          return res.status(422).json({
            status: 'fail',
            error: req.modelError,
          });
        } else if (req.file) {
          fileDetail = req.file;
          let filePath: string = '';
          if (fileDetail != undefined) {
            originalName =
              fileDetail.originalname != undefined
                ? fileDetail.originalname
                : '';
            filePath = fileDetail.path.replace(/\\/g, '/');
            let arrFileName: string[] = filePath.split('/');
            actualFileName = arrFileName[arrFileName.length - 1];
            let mmyy: string = moment().format('MMYY');
            actualFilePath = `docfile/${clientId}/${mmyy}/${actualFileName}`;
          }
          resolve({
            actualFilePath: actualFilePath,
            originalFileName: originalName,
          });
        }
      });
    });
  };
  //#endregion ---------------------------------------------------------------- document image storage

  //#region ---------------------------------------------------------------- application user member image storage
  userImageStorage = multer.diskStorage({
    destination: function (req: any, file: any, cb) {
      cb(null, path.join(__dirname, `../../uploads/users/${req.clientId}/`));
    },
    filename: function (req: any, file: any, cb) {
      let splitedFileName: string[] = file.originalname.split('.');
      let fileExt: string = splitedFileName[splitedFileName.length - 1];
      let dt = new Date();
      let dateString: string =
        dt.getFullYear().toString() +
        (dt.getMonth() + 1).toString() +
        dt.getDate().toString() +
        dt.getHours().toString() +
        dt.getMinutes().toString() +
        dt.getSeconds().toString() +
        dt.getMilliseconds().toString();
      var newFileName = 'img' + dateString;
      cb(null, newFileName + '.' + fileExt);
    },
  });

  userImageFilters = (req: any, file: any, cb: any) => {
    if (
      file.mimetype == 'image/jpeg' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/gif'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      req.modelError = {
        details: [
          {
            message: 'Unsupported file extension',
          },
        ],
      };
    }
  };

  userImage = multer({
    storage: this.userImageStorage,
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
    fileFilter: this.userImageFilters,
  }).single('userProfilePicture');

  uploadUserImage = (req: any, res: any) => {
    return new Promise((resolve, reject) => {
      this.userImage(req, res, (err) => {
        let fileDetail: any,
          actualFilePath: string = '',
          actualFileName: string = '',
          originalName: string = '';
        if (err) {
          return reject(err);
        }
        if (req.modelError) {
          return res.status(422).json({
            status: 'fail',
            error: req.modelError,
          });
        } else if (req.file) {
          fileDetail = req.file;
          let filePath: string = '';
          if (fileDetail != undefined) {
            originalName =
              fileDetail.originalname != undefined
                ? fileDetail.originalname
                : '';
            filePath = fileDetail.path.replace(/\\/g, '/');
            let arrFileName: string[] = filePath.split('/');
            actualFileName = arrFileName[arrFileName.length - 1];
            actualFilePath = `userprofilepic/${actualFileName}`;
          }
          resolve({
            actualFilePath: actualFilePath,
            originalFileName: originalName,
          });
        }
      });
    });
  };
  //#endregion ---------------------------------------------------------------- end application user image storage

  //#region ---------------------------------------------------------------- residents image storage
  residentImageStorage = multer.diskStorage({
    destination: function (req: any, file: any, cb) {
      cb(null, path.join(__dirname, '../../uploads/residents/'));
    },
    filename: function (req: any, file: any, cb) {
      let dt = new Date();
      let splitedFileName: string[] = file.originalname.split('.');
      let fileExt: string = splitedFileName[splitedFileName.length - 1];
      let datestring: string =
        dt.getFullYear().toString() +
        (dt.getMonth() + 1).toString() +
        dt.getDate().toString() +
        dt.getHours().toString() +
        dt.getMinutes().toString() +
        dt.getSeconds().toString() +
        dt.getMilliseconds().toString();
      var newFileName = 'img' + datestring;
      cb(null, newFileName + '.' + fileExt);
    },
  });

  residentImageFilters = (req: any, file: any, cb: any) => {
    if (
      file.mimetype == 'image/jpeg' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/gif'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      req.uploadError = 'Extension error';
      return cb(null, false, new Error('Extension error'));
    }
  };

  uploadResidentImage = multer({
    storage: this.residentImageStorage,
    limits: {
      fileSize: 1024 * 1024 * 15,
    },
    fileFilter: this.residentImageFilters,
  }).single('residentImg');
  //#endregion ---------------------------------------------------------------- end residents image storage

  //#region ---------------------------------------------------------------- vehicles image storage
  vehicleImageStorage = multer.diskStorage({
    destination: function (req: any, file: any, cb) {
      try {
        const destinationPath = path.join(
          __dirname,
          `../../uploads/vehicles/${req.clientId}/`,
        );
        if (!fs.existsSync(destinationPath)) {
          fs.mkdirSync(destinationPath, { recursive: true });
        }
        cb(null, destinationPath);
      } catch (err: any) {
        console.log(`Error while vehicle image uploading :- ${err.message}`);
        cb(err, 'error while vehicle image uploading to specific path');
      }
    },
    filename: function (req: any, file: any, cb) {
      try {
        let dt = new Date();
        let fileExt: string = path.extname(file.originalname);
        let datestring: string =
          dt.getFullYear().toString() +
          (dt.getMonth() + 1).toString() +
          dt.getDate().toString() +
          dt.getHours().toString() +
          dt.getMinutes().toString() +
          dt.getSeconds().toString() +
          dt.getMilliseconds().toString();
        const newFileName: string = 'img' + datestring;
        if (newFileName != '') {
          cb(null, newFileName + fileExt);
        } else {
          cb(null, 'fileName is blank');
        }
      } catch (err: any) {
        console.log(
          `Error while vehicle image uploading (name generation part) :- ${err.message}`,
        );
        cb(err, 'error while vehicle image name generation');
      }
    },
  });

  vehicleImageFilters = (req: any, file: any, cb: any) => {
    try {
      if (
        file.mimetype == 'image/jpeg' ||
        file.mimetype == 'image/jpg' ||
        file.mimetype == 'image/png' ||
        file.mimetype == 'image/gif'
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        req.uploadError = 'Extension error';
        return cb(null, false, new Error('Extension error'));
      }
    } catch (err: any) {
      console.log(
        `Error while vehicle image uploading (extension part) :- ${err.message}`,
      );
    }
  };

  // uploadVehicleImage = multer({
  //   storage: this.vehicleImageStorage,
  //   fileFilter: this.residentImageFilters,
  // }).single('vehicleImg');

  uploadVehicleImage = (req, res, next) => {
    const upload = multer({
      storage: this.vehicleImageStorage,
      fileFilter: this.residentImageFilters,
    }).single('vehicleImg');

    // Use a Promise to handle multer's callback
    new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) {
          console.log(`error while saving image in multer :- ${err.message}`);
          return reject(err); // Reject the promise with the error
        }
        resolve(''); // Resolve the promise if no error
      });
    })
      .then(() => next()) // Proceed to the next middleware if successful
      .catch((error) => {
        console.log(
          `error while saving image in multer catch block :- ${error.message}`,
        );
        // Handle errors
        res.status(400).json({ error: error.message || 'File upload failed.' });
      });
  };
  //#endregion ---------------------------------------------------------------- end vehicles image storage

  //#region ---------------------------------------------------------------- staff picture storage
  staffPictureStorage = multer.diskStorage({
    destination: function (req: any, file: any, cb) {
      cb(
        null,
        path.join(__dirname, `../../uploads/staffs/pictures/${req.clientId}/`),
      );
    },
    filename: function (req: any, file: any, cb) {
      let dt = new Date();
      let splitedFileName: string[] = file.originalname.split('.');
      let fileExt: string = splitedFileName[splitedFileName.length - 1];
      let datestring: string =
        dt.getFullYear().toString() +
        (dt.getMonth() + 1).toString() +
        dt.getDate().toString() +
        dt.getHours().toString() +
        dt.getMinutes().toString() +
        dt.getSeconds().toString() +
        dt.getMilliseconds().toString();
      var newFileName = 'img' + datestring;
      cb(null, newFileName + '.' + fileExt);
    },
  });

  staffPictureFilters = (req: any, file: any, cb: any) => {
    if (
      file.mimetype == 'image/jpeg' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/gif'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      req.uploadError = 'Extension error';
      return cb(null, false, new Error('Extension error'));
    }
  };

  staffPicture = multer({
    storage: this.staffPictureStorage,
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
    fileFilter: this.staffPictureFilters,
  }).single('staffPicture');

  uploadStaffPicture = (req: any, res: any) => {
    return new Promise((resolve, reject) => {
      try {
        this.staffPicture(req, res, (err) => {
          let fileDetail: any,
            actualFilePath: string = '',
            actualFileName: string = '',
            originalName: string = '';
          if (err) {
            return reject(err);
          }
          if (req.modelError) {
            return res.status(422).json({
              status: 'fail',
              error: req.modelError,
            });
          } else if (req.file) {
            fileDetail = req.file;
            let filePath: string = '';
            if (fileDetail != undefined) {
              originalName =
                fileDetail.originalname != undefined
                  ? fileDetail.originalname
                  : '';
              filePath = fileDetail.path.replace(/\\/g, '/');
              let arrFileName: string[] = filePath.split('/');
              actualFileName = arrFileName[arrFileName.length - 1];
              actualFilePath = `staffpic/${actualFileName}`;
            }
            resolve({
              actualFilePath: actualFilePath,
              originalFileName: originalName,
            });
          }
        });
      } catch (err: any) {
        reject(err);
      }
    });
  };
  //#endregion ---------------------------------------------------------------- end staff picture storage

  //#region ---------------------------------------------------------------- staff picture storage
  staffIdProofStorage = multer.diskStorage({
    destination: function (req: any, file: any, cb) {
      cb(
        null,
        path.join(__dirname, `../../uploads/staffs/idproofs/${req.clientId}/`),
      );
    },
    filename: function (req: any, file: any, cb) {
      let dt = new Date();
      let splitedFileName: string[] = file.originalname.split('.');
      let fileExt: string = splitedFileName[splitedFileName.length - 1];
      let datestring: string =
        dt.getFullYear().toString() +
        (dt.getMonth() + 1).toString() +
        dt.getDate().toString() +
        dt.getHours().toString() +
        dt.getMinutes().toString() +
        dt.getSeconds().toString() +
        dt.getMilliseconds().toString();
      var newFileName = 'staffpic' + datestring;
      cb(null, newFileName + '.' + fileExt);
    },
  });

  staffIdProofFilters = (req: any, file: any, cb: any) => {
    if (
      file.mimetype == 'image/jpeg' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/gif' ||
      file.mimetype == 'application/pdf'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      req.uploadError = 'Extension error';
      return cb(null, false, new Error('Extension error'));
    }
  };

  staffIdProof = multer({
    storage: this.staffIdProofStorage,
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
    fileFilter: this.staffPictureFilters,
  }).single('staffIdProof');

  uploadStaffIdProof = (req: any, res: any) => {
    return new Promise((resolve, reject) => {
      try {
        this.staffIdProof(req, res, (err) => {
          let fileDetail: any,
            actualFilePath: string = '',
            actualFileName: string = '',
            originalName: string = '';
          if (err) {
            return reject(err);
          }
          if (req.modelError) {
            return res.status(422).json({
              status: 'fail',
              error: req.modelError,
            });
          } else if (req.file) {
            fileDetail = req.file;
            let filePath: string = '';
            if (fileDetail != undefined) {
              originalName =
                fileDetail.originalname != undefined
                  ? fileDetail.originalname
                  : '';
              filePath = fileDetail.path.replace(/\\/g, '/');
              let arrFileName: string[] = filePath.split('/');
              actualFileName = arrFileName[arrFileName.length - 1];
              actualFilePath = `staffidprf/${actualFileName}`;
            }
            resolve({
              actualFilePath: actualFilePath,
              originalFileName: originalName,
            });
          }
        });
      } catch (err: any) {
        reject(err);
      }
    });
  };
  //#endregion ---------------------------------------------------------------- end staff picture storage
}
