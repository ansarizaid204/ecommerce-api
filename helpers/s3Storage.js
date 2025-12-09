const {
  PutObjectCommand,
  DeleteObjectCommand,
  S3Client,
} = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
const mime = require("mime-types");
const config = require("../config/config");

const s3Client = new S3Client({
  region: config?.aws?.region,
  credentials: {
    accessKeyId: config?.aws?.accessKey,
    secretAccessKey: config?.aws?.secretKey,
  },
});

async function uploadFile(file, mediaPath) {
  const extension = mime.extension(file.mimetype);

  if (!extension) {
    throw new Error("Unsupported file type");
  }
  // Create a unique key: products/UUID-timestamp.jpg

  const fileName = `${uuidv4()}-${Date.now()}.${extension}`;
  const key = `${mediaPath}/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: config?.aws?.bucketName,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  const response = await s3Client.send(command);

  return fileName;
}

async function deleteFile(fullPath) {
  const command = new DeleteObjectCommand({
    Bucket: config?.aws?.bucketName,
    Key: fullPath,
  });

  try {
    await s3Client.send(command);
  } catch (error) {}
}

module.exports = {
  uploadFile,
  deleteFile,
};
