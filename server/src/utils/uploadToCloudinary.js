
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (buffer) => {
  return new Promise(
    (resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder : "spark-club/events",
        },
        (error,result) => {
          if(error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);    
    }
  );
};


export default uploadToCloudinary;
