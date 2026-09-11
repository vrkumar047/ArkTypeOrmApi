import 'reflect-metadata';
import { createServer } from 'http';
import net from 'net';
import * as dotenv from 'dotenv';
import { CustomResponse } from './middlewares/response.middleware';
import { route } from './routes/route.index';
import { app } from './services/app.service';
import moment from 'moment';
import { IncomingForm } from 'formidable';
import path from 'path';
import fs from 'fs';
import { existsSync, mkdirSync } from 'fs';
import { BlobFileService } from './services/blobFile.service';
dotenv.config();
import { Readable } from 'stream';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const {
  http_port,
  alt_http_port,
  tcp_port,
  mqtt_host,
  mqtt_port,
  mqtt_user,
  mqtt_pwd,
  device_topic,
  clientId,
} = process.env;
const blobFileService = new BlobFileService();
app.use('/api', route);
app.use((req, res, next) => {
  res.removeHeader('X-Frame-Options'); // Remove completely
  // Or allow from same origin
  res.setHeader('X-Frame-Options', 'ALLOW-FROM http://localhost:61695');
  res.setHeader(
    'Content-Security-Policy',
    "frame-ancestors 'self' http://localhost:61695",
  );
  next();
});
//------ to removed '/api/fileupload/upload' if '/api/fileupload/uploadDocFile' and '/api/fileupload/uploadEmpImg' are start working
//#region ------------------------ uploading file to same server through dynamsoft
app.post('/api/fileupload/upload_old', (req, res) => {
  const form = new IncomingForm();

  form.parse(req, async (err, fields, files: any) => {
    if (err) {
      return res
        .status(400)
        .json({ error: 'Form parse error', details: err.message });
    }

    try {
      const uploadedFile = files.RemoteFile?.[0];

      if (!uploadedFile) {
        return res
          .status(400)
          .json({ error: 'No file uploaded under "RemoteFile"' });
      }
      fs.readFile(uploadedFile.filepath, (err, data) => {
        if (err) {
          return res.status(500).json({
            error: 'Error reading uploaded file',
            details: err.message,
          });
        }

        const mmyy = moment().format('MMYY');
        const filePath = `${clientId}/${mmyy}/${uploadedFile.originalFilename}`;
        const folderPath = path.join(
          __dirname,
          `../Uploads/files/${clientId}/${mmyy}`,
        );

        if (!existsSync(folderPath)) {
          mkdirSync(folderPath, { recursive: true });
        }

        const newPath = path.join(folderPath, uploadedFile.originalFilename);

        fs.writeFile(newPath, data, (err) => {
          if (err) {
            return res
              .status(500)
              .json({ error: 'Error saving file', details: err.message });
          }

          // Clean up temp file
          fs.unlink(uploadedFile.filepath, (unlinkErr) => {
            if (unlinkErr && unlinkErr.code !== 'ENOENT') {
              console.error('Error deleting temp file:', unlinkErr);
            }
          });

          res.status(200).json({
            status: 200,
            filePath: `docfile/${filePath}`,
          });
        });
      });
    } catch (e: any) {
      return res
        .status(500)
        .json({ error: 'Unexpected error', details: e.message });
    }
  });
});
//#endregion ------------------------ uploading file to same server through dynamsoft
//#region ------------------------ uploading file to S3 server through dynamsoft
app.post('/api/fileupload/upload', (req, res) => {
  const form = new IncomingForm();

  form.parse(req, async (err, fields, files: any) => {
    if (err) {
      return res
        .status(400)
        .json({ error: 'Form parse error', details: err.message });
    }

    try {
      const uploadedFile = files.RemoteFile?.[0];

      if (!uploadedFile) {
        return res
          .status(400)
          .json({ error: 'No file uploaded under "RemoteFile"' });
      }
      let uploadedBlobFile: any =
        await blobFileService.uploadDaynamFile(uploadedFile);
      if (!uploadedBlobFile && uploadedBlobFile.filePath.indexOf('SIS') != -1) {
        res.status(200).json({
          status: 200,
          eTag: uploadedBlobFile.eTag,
          filePath: uploadedBlobFile.filePath,
        });
      } else {
        throw Error('Unable to upload file');
      }
    } catch (e: any) {
      return res
        .status(500)
        .json({ error: 'Unexpected error', details: e.message });
    }
  });
});
//#endregion ------------------------ uploading file to S3 server through dynamsoft
//#region ------------------------ uploading file to same server through dynamsoft
app.post('/api/fileupload/uploadLocalDocFile', (req, res) => {
  const form = new IncomingForm();

  form.parse(req, async (err, fields, files: any) => {
    if (err) {
      return res
        .status(400)
        .json({ error: 'Form parse error', details: err.message });
    }

    try {
      const uploadedFile = files.RemoteFile?.[0];
      if (!uploadedFile) {
        return res
          .status(400)
          .json({ error: 'No file uploaded under "RemoteFile"' });
      }

      fs.readFile(uploadedFile.filepath, (err, data) => {
        if (err) {
          return res.status(500).json({
            error: 'Error reading uploaded file',
            details: err.message,
          });
        }

        const mmyy = moment().format('MMYY');
        const filePath = `${clientId}/${mmyy}/${uploadedFile.originalFilename}`;
        const folderPath = path.join(
          __dirname,
          `../Uploads/files/${clientId}/${mmyy}`,
        );

        if (!existsSync(folderPath)) {
          mkdirSync(folderPath, { recursive: true });
        }

        const newPath = path.join(folderPath, uploadedFile.originalFilename);

        fs.writeFile(newPath, data, (err) => {
          if (err) {
            return res
              .status(500)
              .json({ error: 'Error saving file', details: err.message });
          }

          // Clean up temp file
          fs.unlink(uploadedFile.filepath, (unlinkErr) => {
            if (unlinkErr && unlinkErr.code !== 'ENOENT') {
              console.error('Error deleting temp file:', unlinkErr);
            }
          });

          res.status(200).json({
            status: 200,
            filePath: `docfile/${filePath}`,
          });
        });
      });
    } catch (e: any) {
      return res
        .status(500)
        .json({ error: 'Unexpected error', details: e.message });
    }
  });
});
//#endregion ------------------------ uploading file to same server through dynamsoft
//#region ------------------------ uploading file to S3 server through dynamsoft
app.post('/api/fileupload/uploadDocFile', (req, res) => {
  const form = new IncomingForm();

  form.parse(req, async (err, fields, files: any) => {
    if (err) {
      return res
        .status(400)
        .json({ error: 'Form parse error', details: err.message });
    }

    try {
      const uploadedFile = files.RemoteFile?.[0];
      let uploadedBlobFile: any =
        await blobFileService.uploadDaynamFile(uploadedFile);
      if (uploadedBlobFile && uploadedBlobFile.filePath?.indexOf('SIS') != -1) {
        let fileUrl: string = await blobFileService.getFileUrl(
          uploadedBlobFile.filePath,
        );
        res.status(200).json({
          status: 200,
          eTag: uploadedBlobFile.eTag,
          filePath: uploadedBlobFile.filePath,
          fileUrl: fileUrl,
        });
      } else {
        throw Error('Unable to upload file');
      }
    } catch (e: any) {
      return res
        .status(500)
        .json({ error: 'Unexpected error', details: e.message });
    }
  });
});
//#endregion ------------------------ uploading file to same server through dynamsoft
app.post('/api/fileupload/uploadEmpImg', (req, res) => {
  const form = new IncomingForm();

  form.parse(req, (err, fields, files: any) => {
    if (err) {
      return res
        .status(400)
        .json({ error: 'Form parse error', details: err.message });
    }

    try {
      const uploadedFile = files.RemoteFile?.[0];

      if (!uploadedFile) {
        return res
          .status(400)
          .json({ error: 'No file uploaded under "RemoteFile"' });
      }

      fs.readFile(uploadedFile.filepath, (err, data) => {
        if (err) {
          return res.status(500).json({
            error: 'Error reading uploaded file',
            details: err.message,
          });
        }

        const mmyy = moment().format('MMYY');
        const filePath = `${clientId}/${mmyy}/${uploadedFile.originalFilename}`;
        const folderPath = path.join(
          __dirname,
          `../Uploads/picandsig/${clientId}/${mmyy}`,
        );

        if (!existsSync(folderPath)) {
          mkdirSync(folderPath, { recursive: true });
        }

        const newPath = path.join(folderPath, uploadedFile.originalFilename);

        fs.writeFile(newPath, data, (err) => {
          if (err) {
            return res
              .status(500)
              .json({ error: 'Error saving file', details: err.message });
          }

          // Clean up temp file
          fs.unlink(uploadedFile.filepath, (unlinkErr) => {
            if (unlinkErr && unlinkErr.code !== 'ENOENT') {
              console.error('Error deleting temp file:', unlinkErr);
            }
          });

          res.status(200).json({
            status: 200,
            filePath: `candimg/${filePath}`,
          });
        });
      });
    } catch (e: any) {
      return res
        .status(500)
        .json({ error: 'Unexpected error', details: e.message });
    }
  });
});

app.get('/testRequestTimeOut', async (req, res) => {
    await new Promise(resolve => setTimeout(resolve, 300000));
    res.json({ success: true });
});
app.use(CustomResponse);
//--------------------------------------------------------------------------------------------- HTTP Server
const httpServer = createServer(app);
//const altHttpServer = createServer(app);
httpServer.requestTimeout = 5 * 60 * 1000; // for 5 minute
httpServer.listen(http_port, async () => {
  console.log(`HTTP server is running on http://localhost:${http_port}`);
  //connectMqtt();
});

// altHttpServer.listen(alt_http_port, async () => {
//   console.log(`HTTP server is running on https://localhost:${alt_http_port}`);
//   //connectMqtt();
// });

//--------------------------------------------------------------------------------------------- end HTTP Serve r
//--------------------------------------------------------for handling global 'unhandledRejection' and 'uncaughtException' error
process.on('unhandledRejection', (reason, promise) => {
  console.error('========== UNHANDLED REJECTION ==========');
  console.error('Reason:', reason);
  console.error('Promise:', promise);

  if (reason instanceof Error) {
    console.error('Message:', reason.message);
    console.error('Stack:', reason.stack);
  }

  console.error('==========================================');
});

process.on('uncaughtException', (error) => {
  console.error('========== UNCAUGHT EXCEPTION ==========');
  console.error(error);
  console.error('Stack:', error.stack);
  console.error('========================================');
});
