import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '../helpers/s3Client';
import { PassThrough } from 'stream';
import moment from 'moment';
import fs from 'fs';
const { blobBucketName } = process.env;
export class BlobFileService {
  async uploadFile(
    applicationNo: string,
    file: Express.Multer.File,
  ): Promise<any> {
    try {
      let year = moment().format('YYYY'); // e.g. 2026
      let month = moment().format('MM');
      let fileName: string = file.originalname;
      let filePath: string = `SIS/${year}/${month}/${applicationNo}/${fileName}`;
      const params = {
        Bucket: blobBucketName, // ✅ correct
        Key: filePath, // ✅ correct path
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      const command = new PutObjectCommand(params);
      let uploadedFile: any = await s3Client.send(command);
      uploadedFile.actualFilePath = `${filePath}`;
      return { filePath: uploadedFile.actualFilePath, eTag: uploadedFile.ETag };
    } catch (err) {
      console.error('Error uploading in s3 :', err);
      return err;
    }
  }

  async uploadDaynamFile(file: any): Promise<any> {
    try {
      let year = moment().format('YYYY'); // e.g. 2026
      let month = moment().format('MM');
      let applicationNo: string = file.originalFilename.split('-')[0];
      let fileName: string = file.originalFilename;
      let filePath: string = `SIS/${year}/${month}/${applicationNo}/${fileName}`;
      const params = {
        Bucket: blobBucketName,
        Key: filePath,
        Body: fs.createReadStream(file.filepath),
        contentLength: file.size,
        ContentType: 'image/jpeg',
      };
      const command = new PutObjectCommand(params);
      let uploadedFile: any = await s3Client.send(command);
      uploadedFile.actualFilePath = `${filePath}`;
      return { filePath: uploadedFile.actualFilePath, eTag: uploadedFile.ETag };
    } catch (err) {
      console.error('Error uploading in s3 :', err);
      return err;
    }
  }

  async uploadPdfFile(fileName: string, filePath: string): Promise<any> {
    try {
      let year = moment().format('YYYY'); // e.g. 2026
      let month = moment().format('MM');
      let applicationNo: string = fileName.split('-')[0];
      let s3filePath: string = `SIS/${year}/${month}/${applicationNo}/${fileName}`;
      const stats = fs.statSync(filePath);
      const params = {
        Bucket: blobBucketName,
        Key: s3filePath,
        Body: fs.createReadStream(filePath),
        ContentLength: stats.size,
        ContentType: 'application/pdf',
      };
      const command = new PutObjectCommand(params);
      let uploadedFile: any = await s3Client.send(command);
      uploadedFile.actualFilePath = `${s3filePath}`;
      return { filePath: uploadedFile.actualFilePath, eTag: uploadedFile.ETag };
    } catch (err) {
      console.error('Error uploading in s3 :', err);
      return err;
    }
  }

  async getImageBuffer(filePath: string) {
    const command = new GetObjectCommand({
      Bucket: blobBucketName,
      Key: filePath,
    });

    const response = await s3Client.send(command);

    // Convert stream to buffer
    const chunks: Uint8Array[] = [];
    const stream = response.Body as any;

    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  }

  async getFileUrl(filePath: string): Promise<any> {
    const command = new GetObjectCommand({
      Bucket: blobBucketName,
      Key: filePath,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // 1 hour
    });
    return signedUrl;
  }
}
