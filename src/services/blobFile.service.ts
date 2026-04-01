import {
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '../helpers/s3Client';
import moment from 'moment';
const { blobBucketName } = process.env;
export class BlobFileService {
  async uploadFile(
    applicationNo: string,
    file: Express.Multer.File,
  ): Promise<any> {
    try {
      let year = moment().format('YYYY'); // e.g. 2026
      let month = moment().format('M');
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

  async getFileUrl(filePath:string): Promise<any> {
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
