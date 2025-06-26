import { GetCompanyDb, getResultSets } from '../_dbs/mssql/pgConnection';
import { plainToClass } from 'class-transformer';
import constant from '../_dbs/mssql/constant';
import Logger from '../utils/logger';
import { CustomError } from '../helpers/customError';
import { create } from 'xmlbuilder2';
import PDFDocument from 'pdfkit';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { existsSync, mkdirSync } from 'fs';
import moment from 'moment';
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

  async setFileSequence(
    loggedInUser: any,
    formNo: string,
    docId: number,
    seq: number,
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let fileSequence: any = await companyDb.query(
        `EXEC ${constant.P_SetFileSequence} @formNo = @0, @docId = @1, @sequence = @2`,
        [formNo, docId, seq],
      );
      return fileSequence;
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'fileupload/setFileSequence',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async captureDocument(
    loggedInUser: any,
    formNo: string,
    docId: number,
    fileName: string,
    docsList: any[] = [],
  ): Promise<any> {
    try {
      const xmlDoc = create().ele('docList');

      docsList.forEach((doc) => {
        const leafNode = xmlDoc.ele('doc');
        leafNode.ele('formNo').txt(formNo);
        leafNode.ele('docTypeId').txt(doc.docTypeId);
        leafNode.ele('docId').txt(docId.toString());
        leafNode.ele('authority').txt(doc.authority);
        leafNode.ele('docNo').txt(doc.docNo);
        leafNode.ele('remarks').txt(doc.remarks);
        leafNode.ele('validFrom').txt(doc.validFrom);
        leafNode.ele('validTo').txt(doc.validTo);
        leafNode.ele('licenseType').txt(doc.licenseType);
        leafNode.ele('issuingState').txt(doc.issuingState);
        leafNode.ele('areaOfUse').txt(doc.areaOfUse);
        leafNode.ele('placeOfUse').txt(doc.placeOfUse);
        leafNode.ele('file_path').txt(fileName);
      });

      let xmlString: string = xmlDoc.end({ headless: true, prettyPrint: true });
      xmlString = xmlString.replace(/[\r\n]+/g, '').trim();

      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let documentDetail: any = await companyDb.query(
        `EXEC ${constant.P_UpdateUploadedFileList} @action = @0, @docsList = @1`,
        ['insert', xmlString],
      );
      return documentDetail;
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'fileupload/captureDocument',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }

  async generatePdf(loggedInUser: any, formNo: string): Promise<any> {
    try {
      let _filePath: string = '';
      var _docname: string = '';
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let totalUploadedFormList: any[] = await companyDb.query(
        `EXEC ${constant.P_GetUploadedFiles} @formNo = @0`,
        [formNo],
      );
      let uploadedFormList: any[] = [];
      if (totalUploadedFormList && totalUploadedFormList.length > 0) {
        for (let i = 0; i < totalUploadedFormList.length; i++) {
          var prevdocid = 0;
          var prevfilename = '';
          var doc_used = 0;
          _docname = '';

          if (i == 0) {
            prevdocid = totalUploadedFormList[i].doc_id;
            prevfilename = totalUploadedFormList[i].file_path;
            var obj = totalUploadedFormList[i];
            obj.file_sequence = uploadedFormList.length + 1;
            _docname = totalUploadedFormList[i].document_type;
            for (var j = i + 1; j < totalUploadedFormList.length; j++) {
              if (totalUploadedFormList[j].doc_id == prevdocid) {
                _docname =
                  _docname + totalUploadedFormList[j].document_type + ', ';
              }
            }
            obj.document_type = _docname;
            uploadedFormList.push(obj);
          } else {
            doc_used = 0;
            for (var k = 0; k < uploadedFormList.length; k++) {
              if (
                uploadedFormList[k].doc_id == totalUploadedFormList[i].doc_id
              ) {
                doc_used = 1;
              }
            }

            prevdocid = totalUploadedFormList[i - 1].doc_id;
            prevfilename = totalUploadedFormList[i - 1].file_path;
            if (
              totalUploadedFormList[i].doc_id != prevdocid &&
              totalUploadedFormList[i].file_path != prevfilename &&
              doc_used != 1
            ) {
              var obj = totalUploadedFormList[i];
              obj.file_sequence = uploadedFormList.length + 1;
              _docname = totalUploadedFormList[i].document_type;
              //Merge All Doc names
              for (var j = i + 1; j < totalUploadedFormList.length; j++) {
                if (
                  totalUploadedFormList[j].doc_id ==
                  totalUploadedFormList[i].doc_id
                ) {
                  _docname =
                    _docname + ', ' + totalUploadedFormList[j].document_type;
                }
              }
              obj.document_type = _docname;

              uploadedFormList.push(obj);
            }
            //console.log('My Seq : ' + uploadedFormList.length+1);
          }
        }
      }
      try {
        var doc = new PDFDocument({
          layout: 'portrait',
          size: 'A4', // 'A4' [450,500]
          margin: 5,
        });
        let mmyy: string = moment().format('MMYY');
        let folderPath: string = path.join(
          __dirname,
          `../../Uploads/pdfs/${clientId}/${mmyy}`,
        );
        if (!existsSync(folderPath)) {
          mkdirSync(folderPath, { recursive: true });
        }
        var encodedFormNo = formNo.replace('/', '-');
        _filePath = `docpdf/${clientId}/${mmyy}/${encodedFormNo}_doc.pdf`;
        var inputFilePath = path.join(`${folderPath}/${_filePath}`);
        // if (!fs.existsSync(inputFilePath)) {
        //   _filePath = encodedFormNo + '_doc_1.pdf';
        // }

        doc.pipe(fs.createWriteStream(inputFilePath));
        for (var i = 0; i < uploadedFormList.length; i++) {
          try {
            // var filePath = './Uploads/files/' + uploadedFormList[i].file_path;
            let filePath: string = uploadedFormList[i].file_path;
            filePath = filePath.replace('docfile', './Uploads/files');
            _docname = uploadedFormList[i].document_name;
            //console.log(filePath + _docname);
            if (i == 0) {
              doc
                .image(filePath, 0, 15, {
                  fit: [595.28, 841.89],
                  align: 'center',
                  valign: 'center',
                })
                .text(
                  uploadedFormList[i].document_type + ' : ' + _docname,
                  5,
                  5,
                ); //doc.image(filePath, 0, 15, {width: 300});
              this.setFileSequence(
                loggedInUser,
                uploadedFormList[i].form_no,
                uploadedFormList[i].doc_id,
                uploadedFormList[i].file_sequence,
              );
            } else {
              doc
                .addPage()
                .image(filePath, 0, 15, {
                  fit: [595.28, 841.89],
                  align: 'center',
                  valign: 'center',
                })
                .text(
                  uploadedFormList[i].document_type + ' : ' + _docname,
                  5,
                  5,
                ); //.image(filePath, 0, 15, {width: 300});
              this.setFileSequence(
                loggedInUser,
                uploadedFormList[i].form_no,
                uploadedFormList[i].doc_id,
                uploadedFormList[i].file_sequence,
              );
            }
          } catch (pgErr) {
            throw pgErr;
          }
        }
        doc.flushPages();
        doc.end();
        let datetime = new Date().toLocaleString();

        let companyDb = await GetCompanyDb(loggedInUser.secret);
        let pdfDetails: any = await companyDb.query(
          `EXEC ${constant.P_FileDetailsFormWise} @action = @0, @formNo = @1, @filePath = @2, @userId = @3`,
          ['updatepdfdetails', formNo, _filePath, loggedInUser.userId],
        );
        return pdfDetails;
      } catch (err) {
        throw err;
      }
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'fileupload/generatePdf',
          error: error.message,
        });
        error = new CustomError('InternalServerError');
      }
      throw error;
    }
  }
}
