import AWS from "aws-sdk";
import { S3_ACCESSKEY, S3_SECRET_ACCESSKEY } from "@env";

AWS.config.update({
  accessKeyId: S3_ACCESSKEY,
  secretAccessKey: S3_SECRET_ACCESSKEY,
  region: "eu-west-3",
});

const s3 = new AWS.S3();

const uploadImageToS3 = async (
  fileData: Blob,
  filename: string,
  mimetype: string | undefined
) => {
  try {
    const params = {
      Bucket: "roomsy-booking",
      Key: filename,
      Body: fileData,
      ContentType: mimetype,
      ACL: "public-read",
    };

    const data = await s3.upload(params).promise();

    console.log("File uploaded successfully:", data.Location);
    return data.Location; // Return the uploaded file URL
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export default uploadImageToS3;
