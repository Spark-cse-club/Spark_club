import cloudinary from "../config/cloudinary.js";

const deleteFromCloudinary = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      {
        resource_type : "image"
      },
      (error, result) => {
        if(error) reject(error);
        else resolve(result);
      }
    );
  });
};

export default deleteFromCloudinary;