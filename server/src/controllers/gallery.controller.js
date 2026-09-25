import Gallery from "../models/Gallery.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";

import {
  getCachedData,
  setCachedData,
  invalidateCache,
} from "../utils/cacheHelpers.js";


// create 
export const createGallery = asyncHandler(async( req, res) => {
  const {
    title,
    description, 
    category, 
    eventName, 
    eventDate
  } = req.body;

  if (!title || !category) {
    throw new ApiError(400, "Title and category are required");
  }

  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "At least one image is required");
  }

  if (req.files.length > 4) {
    throw new ApiError(400, "Maximum 4 images are allowed");
  }

  const uploadedImages = [];

  for (const file of req.files) {
    const result = await uploadToCloudinary(file.buffer);

    uploadedImages.push({
      url: result.secure_url,
      publicId: result.public_id,
    });
  }

   const gallery = await Gallery.create({
    title,
    description,
    category: category.toLowerCase(),
    eventName,
    eventDate,
    images: uploadedImages,
    createdBy: req.user.userId,
  });

  await invalidateCache(["gallery:all"]);

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        gallery,
        "Gallery created successfully"
      )
    );
});

// getAll
export const getAllGallery = asyncHandler( async(req, res) => {
  const cacheKey = "gallery:all";

  const cachedGallery = await getCachedData(cacheKey);

  if(cachedGallery!==null){
    return res.status(200)
      .json(new ApiResponse(
        200, cachedGallery, "Gallery fetched successfully"
      ))
  }

  const galleries = await Gallery
    .find()
    .populate("createdBy", "name role")
    .sort({ createdAt : -1 });

  await setCachedData(cacheKey, galleries, 600);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200, 
        galleries,
        "Gallery fetched successfully"
      )
    );
});

// get one gallery
export const getGalleryById = asyncHandler(async( req, res) => {

  const gallery = await Gallery
    .findById(req.params.id)
    .populate("createdBy", "name role");

  if(!gallery){
    throw new ApiError(404, "Gallery not found");
  }  

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        gallery,
        "Gallery fetched successfully"
      )
    );
});

// update gallery
export const updateGallery = asyncHandler( async(req, res) => {
  const galleryId = req.params.id;

  const gallery = await Gallery.findById(galleryId);

  if (!gallery) {
    throw new ApiError(404, "Gallery not found");
  }

  const {
    title,
    description,
    category,
    eventName,
    eventDate
  } =  req.body;

  if (title !== undefined) gallery.title = title;
  if (description !== undefined) gallery.description = description;
  if (category !== undefined) gallery.category = category.toLowerCase();
  if (eventName !== undefined) gallery.eventName = eventName;
  if (eventDate !== undefined) gallery.eventDate = eventDate;

  // replace images if new images are uploaded
  if (req.files && req.files.length > 0) {
    if (req.files.length > 4) {
      throw new ApiError(400, "Maximum 4 images are allowed");
    }

    // Delete old images from Cloudinary
    for (const image of gallery.images) {
      await deleteFromCloudinary(image.publicId);
    }

    const newImages = [];

    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer);

      newImages.push({
        url: result.secure_url,
        publicId: result.public_id,
      });
    }

    gallery.images = newImages;
  }

  await gallery.save();

  await invalidateCache(["gallery:all"]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200, 
        gallery, 
        "Gallery updated successFully"
      )
    )
});

// DELETE
export const deleteGallery = asyncHandler(async (req, res) => {
  const galleryId = req.params.id;

  const gallery = await Gallery.findById(galleryId);

  if (!gallery) {
    throw new ApiError(404, "Gallery not found");
  }

  // Delete all images from Cloudinary
  for (const image of gallery.images) {
    await deleteFromCloudinary(image.publicId);
  }

  await gallery.deleteOne();

  await invalidateCache(["gallery:all"]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200, 
        null, 
        "Gallery deleted successfully"
      )
    );
});

// Delete a specific image
export const deleteGalleryImage = asyncHandler(async(req, res) => {
  const { galleryId, imageId } = req.params;

  const gallery = await Gallery.findById(galleryId);

  if(!gallery){
    throw new ApiError(404, "Gallery not found");
  }

  const image = gallery.images.id(imageId);

  if(!image){
    throw new ApiError(404, "Image not Found");
  }

  if (gallery.images.length === 1) {
    throw new ApiError(
      400,
      "At least one image is required"
    );
  }
  // Delete from Cloudinary
  await deleteFromCloudinary(image.publicId);

  image.deleteOne();

  await gallery.save();

  await invalidateCache([ "gallery:all"]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        gallery,
        "Image deleted successfully"
      )
    );
});

// update / replace specific image
export const updateGalleryImage = asyncHandler(async(req, res) => {
  const { galleryId, imageId } = req.params;

  if (!req.file){
    throw new ApiError(
      400, "New image is required"
    )
  }

  const gallery = await Gallery.findById(galleryId);

  if (!gallery) {
    throw new ApiError(404, "Gallery not found");
  }

  const image = gallery.images.id(imageId);

  if (!image) {
    throw new ApiError(404, "Image not found");
  }

  // Upload new image
  const result = await uploadToCloudinary(req.file.buffer);

  // Delete old image from Cloudinary
  if (image.publicId) {
    await deleteFromCloudinary(image.publicId);
  }

  // Replace image details
  image.url = result.secure_url;
  image.publicId = result.public_id;

  await gallery.save();

  await invalidateCache(["gallery:all"]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        gallery,
        "Image Updated Successfully"
      )
    )
});
