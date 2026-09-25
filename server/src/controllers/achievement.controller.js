import Achievement from "../models/Achievement.js";

import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";

import {
  getCachedData,
  setCachedData,
  invalidateCache,
} from "../utils/cacheHelpers.js";


// create achievements
export const createAchievement = asyncHandler(async(req, res) => {
  const {
    title,
    description,
    category,
    achievementDate,
    personName,
    teamName,
    organization,
    rank,
    link,
  } = req.body;

  if(!title || !description || !category || !achievementDate ){
    throw new ApiError(
      400,
      "Title, description, category and achievement date are required"
    );
  }

  // 1-4 images are allowed only
  if(!req.files || req.files.length === 0){
    throw new ApiError(400, "At least one image is required");
  }

  if (req.files.length > 4) {
    throw new ApiError(400, "Maximum 4 images are allowed");
  }
  
  const uploadedImages = [];
  for(const file of req.files){
    const result = await uploadToCloudinary(file.buffer);

    uploadedImages.push({
      url: result.secure_url,
      publicId: result.public_id, 
    });
  }

  const achievement = await Achievement.create({
    title,
    description,
    category: category.toLowerCase(),
    achievementDate,
    personName,
    teamName,
    organization,
    rank,
    link,
    images: uploadedImages,
    createdBy: req.user.userId,
  });

  await invalidateCache(["achievements:all"]);

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        achievement,
        "Achievements created successfully"
      )
    );
});

// get single achievements details
export const getAchievementById = asyncHandler(async (req, res) => {

  const achievement = await Achievement
    .findById(req.params.id)
    .populate("createdBy", "name role");

  if (!achievement) {
    throw new ApiError(404, "Achievement not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        achievement,
        "Achievement fetched successfully"
      )
    );
});


//get alll achievements
export const getAllAchievement  = asyncHandler( async(req, res) => {
  const cacheKey = "achievements:all";
  const cachedData = await getCachedData(cacheKey);

  if(cachedData !==null){
    return res.status(200)
      .json(new ApiResponse(
        200, cachedData, "Achievements fetched successfully"
      ))
  }

  const achievements = await Achievement
    .find()
    .populate("createdBy", "name role")
    .sort({ achievementDate: -1 });

  await setCachedData(cacheKey, achievements, 1800);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        achievements,
        "Achievements fetched successfully"
      )
    );
});

// update a achievements
export const updateAchievement = asyncHandler( async( req,res) => {
  const achievement = await Achievement.findById(req.params.id);

  if(!achievement){
    throw new ApiError(
      404, "Achievement not found"
    );
  }

  const {
    title,
    description,
    category,
    achievementDate,
    personName,
    teamName,
    organization,
    rank,
    link,
  } = req.body;

  if (title !== undefined) achievement.title = title;
  if (description !== undefined) achievement.description = description;
  if (category !== undefined) {
    achievement.category = category.toLowerCase();
  }
  if (achievementDate !== undefined) {
    achievement.achievementDate = achievementDate;
  }
  if (personName !== undefined) achievement.personName = personName;
  if (teamName !== undefined) achievement.teamName = teamName;
  if (organization !== undefined) achievement.organization = organization;
  if (rank !== undefined) achievement.rank = rank;
  if (link !== undefined) achievement.link = link;
  
  /// image replace ka all
  if(req.files && req.files.length >0){
    if(req.files.length>4){
      throw new ApiError(400, "Maximum 4 images are allowed");
    }

    // delete old images from cloudinary 
    for(const image of achievement.images){
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

    achievement.images = newImages;
  }

  await achievement.save();

  await invalidateCache(["achievements:all"]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        achievement,
        "Achievement updated successfully"
      )
    );
});

/// delete achievements
export const deleteAchievement = asyncHandler(async (req, res) => {
  const achievement = await Achievement.findById(req.params.id)

  if(!achievement){
    throw new ApiError(
      404, "Achievement not found"
    );
  }

  // delete all images from cloudinary
  for (const image of achievement.images){
    await deleteFromCloudinary(image.publicId);
  }

  await achievement.deleteOne();

  await invalidateCache(["achievements:all"]);
  
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Achievement deleted successfully"
      )
    );
});

//delete a specific image
export const deleteAchievementImage = asyncHandler(async(req, res) => {
  const { achievementId, imageId } = req.params;

  const achievement = await Achievement.findById(achievementId);

  if(!achievement) {
    throw new ApiError(404,"Achievement not found");
  }

  const image = achievement.images.id(imageId);

  if(!image){
    throw new ApiError(404, "Image not found");
  }

  // Don't allow achievement to have 0 images
  if(achievement.images.length === 1){
    throw new ApiError(
      400, "At least one image is required"
    );
  }

  // Delete image from Cloudinary
  if (image.publicId) {
    await deleteFromCloudinary(image.publicId);
  }
  
  // remove only this image
  image.deleteOne();

  await achievement.save();

  await invalidateCache(["achievements:all"]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        achievement,
        "Image deleted successfully"
      )
    );
});

//replace specific images
export const updateAchievementImage = asyncHandler(async(req, res) => {
  const { achievementId, imageId } = req.params;
  
  if(!req.file){
    throw new ApiError(
      400, "New Image is required"
    );
  }

  const achievement = await Achievement.findById(achievementId);

  if (!achievement) {
    throw new ApiError(404, "Achievement not found");
  }

  const image = achievement.images.id(imageId);

  if (!image) {
    throw new ApiError(404, "Image not found");
  }

  // Upload new image
  const result = await uploadToCloudinary(req.file.buffer);

   // Delete old image
  if (image.publicId) {
    await deleteFromCloudinary(image.publicId);
  }
  
  // replace image details
  image.url = result.secure_url;
  image.publicId = result.public_id;

  await achievement.save();

  await invalidateCache(["achievements:all"]);
  
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        achievement,
        "Image updated successfully"
      )
    );
});
