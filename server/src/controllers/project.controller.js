import Project from "../models/Project.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";

import {
  getCachedData,
  setCachedData,
  invalidateCache,
} from "../utils/cacheHelpers.js";

// create project
export const createProject = asyncHandler( async(req, res) => {
  const {
    projectName,
    description,
    category,
    startDate,
    endDate,
    githubLink,
  } = req.body;

  if(!projectName || !description || !category || !startDate) {
    throw new ApiError(
      400,
      "Project name, description, category and start date are required"
    );
  }

  let image = {
    url : null,
    publicId : null,
  };

  // upload image to cloudinary
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer);

    image = {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  const project = await Project.create({
    projectName,
    description,
    category: category.toLowerCase(),
    startDate,
    endDate: endDate || null,
    githubLink: githubLink || null,
    image,
    createdBy: req.user.userId,
  });

  await invalidateCache(["projects:all"]);

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        project,
        "Project created successfully"
      )
    );
});

// get all project
export const getAllProjects = asyncHandler( async(req, res) => {
  const cacheKey = "projects:all";

  const cachedData = await getCachedData(cacheKey);

  if(cachedData !== null){
    return res.status(200)
      .json(new ApiResponse
        ( 200, cachedData, "Projects fetched successfully" )
      );
  }

  const projects = await Project
    .find()
    .populate("createdBy", "name role")
    .sort({ startDate : -1 });

  await setCachedData(cacheKey, projects, 600);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        projects,
        "Projects fetched successfully"
      )
    );  
});

// get single projects
export const getProjectById = asyncHandler( async(req, res) => {

  const project = await Project
    .findById(req.params.id)
    .populate("createdBy", "name email role");

  if (!project) {
    throw new ApiError(
      404, "Project not found"
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      project,
      "Project fetched successfully"
    )
  );
})

// UPDATE PROJECT
export const updateProject = asyncHandler(async (req, res) => {
  const projectId = req.params.id;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const {
    projectName,
    description,
    category,
    startDate,
    endDate,
    githubLink,
  } = req.body;

  if (projectName !== undefined) {
    project.projectName = projectName;
  }

  if (description !== undefined) {
    project.description = description;
  }

  if (category !== undefined) {
    project.category = category.toLowerCase();
  }

  if (startDate !== undefined) {
    project.startDate = startDate;
  }

  if (endDate !== undefined) {
    project.endDate = endDate || null;
  }

  if (githubLink !== undefined) {
    project.githubLink = githubLink || null;
  }

  // Replace image
  if (req.file) {
    const oldPublicId = project.image?.publicId;

    const result = await uploadToCloudinary(req.file.buffer);

    project.image = {
      url: result.secure_url,
      publicId: result.public_id,
    };

    // Delete old image
    if (oldPublicId) {
      await deleteFromCloudinary(oldPublicId);
    }
  }

  await project.save();

  await invalidateCache(["projects:all"]);

  return res.status(200).json(
    new ApiResponse(
      200,
      project,
      "Project updated successfully"
    )
  );
});


// DELETE PROJECT
export const deleteProject = asyncHandler(async (req, res) => {
  const projectId = req.params.id;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Delete image from Cloudinary
  if (project.image?.publicId) {
    await deleteFromCloudinary(
      project.image.publicId
    );
  }

  // Delete project from MongoDB
  await project.deleteOne();

  await invalidateCache(["projects:all"]);

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Project deleted successfully"
    )
  );
});
