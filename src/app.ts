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
dotenv.config();

const {
  http_port,
  tcp_port,
  mqtt_host,
  mqtt_port,
  mqtt_user,
  mqtt_pwd,
  device_topic,
  clientId,
} = process.env;
app.use('/api', route);
app.post('/api/fileupload/upload', (req, res) => {
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
app.use(CustomResponse);
//--------------------------------------------------------------------------------------------- HTTP Server
const httpServer = createServer(app);

httpServer.listen(http_port, async () => {
  console.log(`HTTP server is running on http://localhost:${http_port}`);
  //connectMqtt();
});
//--------------------------------------------------------------------------------------------- end HTTP Server
