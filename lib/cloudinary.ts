import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadMedia(file: Buffer, fileName: string, folder: string, isImage: boolean) {
  let bufferToUpload = file;
  let finalFileName = fileName;

  if (isImage) {
    // Convert to webp
    bufferToUpload = await sharp(file)
      .webp({ quality: 80 })
      .toBuffer();
    
    // Ensure filename ends with .webp
    finalFileName = fileName.replace(/\.[^/.]+$/, "") + ".webp";
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        public_id: finalFileName.replace(/\.[^/.]+$/, ""),
        resource_type: isImage ? 'image' : 'video',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    uploadStream.end(bufferToUpload);
  });
}

export default cloudinary;
