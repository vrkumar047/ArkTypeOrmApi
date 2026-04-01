import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
const { blobUrl,blobAccessKey,blobSecretKey,blobBucketName } = process.env;

export const s3Client = new S3Client({
  region: "us-east-1", // can be anything for Nutanix
  endpoint: blobUrl,
  credentials: {
    accessKeyId: blobAccessKey,
    secretAccessKey: blobSecretKey,
  },
  forcePathStyle: true, // IMPORTANT for Nutanix
});