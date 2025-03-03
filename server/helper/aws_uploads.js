const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
require("../../config/config");
const s3Client = new S3Client({
    region: "eu-north-1",
    endpoint: "https://s3.eu-north-1.amazonaws.com",
    credentials: {
        accessKeyId: global.gConfig.awsS3.accessKeyId,
        secretAccessKey: global.gConfig.awsS3.secretAccessKey
    }
});

async function uploadFileToS3(filePath, bucketName, folderName, fileName) {
    try {
        const fileContent = fs.readFileSync(filePath);
        folderName = folderName.replace(/^\/+|\/+$/g, "");
        const keyName = `${folderName}/${fileName}`;
        console.log(keyName);

        const params = {
            Bucket: bucketName,
            Key: keyName,
            Body: fileContent,
            ACL: "public-read"
        };

        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        return {
            success: true,
            message: "File uploaded successfully",
            url: `https://${bucketName}.s3.${s3Client.config.region}.amazonaws.com/${keyName}`
        };
    } catch (error) {
        throw error;
    }
}

module.exports = { uploadFileToS3 }