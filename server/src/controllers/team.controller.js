import CoreTeam from "../models/CoreTeam.js";
import Faculty from "../models/Faculty.js";

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


//// Core Team controller

// create
export const createCoreTeam = asyncHandler( async(req, res) => {
  const { 
    name,
    role,
    year,
    registrationNumber,
    department,
    bio,
    skills,
    linkedin,
    github,
    leetcode,
    portfolio,
    resume,
    displayOrder,
  } = req.body;

  if(!name || !role || !year || !registrationNumber || !department) {
    throw new ApiError(400,"Name, role, year, registration number and department are required");
  }

  if(!req.file){
    throw new ApiError(400, "Profile image is required");
  }

  const result = await uploadToCloudinary(req.file.buffer);

  const coreTeam = await CoreTeam.create({
    name,
    role,
    year,
    registrationNumber,
    department,
    bio,
    skills,
    linkedin,
    github,
    leetcode,
    portfolio,
    resume,
    displayOrder,
    image: {
      url: result.secure_url,
      publicId: result.public_id,
    },
    createdBy: req.user.userId,
  });

  await invalidateCache(["coreTeam:all"]);

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        coreTeam,
        "Core team member created successfully"
      )
    );
});

// get All core team member for public
export const getAllCoreTeam = asyncHandler( async(req, res) => {
  const cacheKey = "coreTeam:all";

  const cachedData = await getCachedData(cacheKey);

  if(cachedData !== null){
    return res.status(200)
      .json( new ApiResponse(
        200, cachedData, "Core team fetched successfully"
      ));
  }

  const coreTeam = await CoreTeam
    .find()
    .populate("createdBy", "name role")
    .sort({ displayOrder : 1 });
   
  await setCachedData(cacheKey, coreTeam, 3600);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        coreTeam,
        "Core team fetched successfully"
      )
    );  
});

// get Single core Team member
export const getCoreTeamById = asyncHandler( async(req, res) => {
  const member = await CoreTeam
    .findById(req.params.id)
    .populate("createdBy", "name role");
  
  if(!member){
    throw new ApiError(
      404, "Core team member not found"
    )
  }  

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        member,
        "Core team member fetched successfully"
      )
    );
});

// update a core team memeber
export const updateCoreTeam = asyncHandler( async( req, res ) => {
  const member = await CoreTeam.findById(req.params.id);

  if(!member){
    throw new ApiError(
      404, "Core team member not found"
    );
  }

  const {
    name,
    role,
    year,
    registrationNumber,
    department,
    bio,
    skills,
    linkedin,
    github,
    leetcode,
    portfolio,
    resume,
    displayOrder,
  } = req.body;

  if (name !== undefined) member.name = name;
  if (role !== undefined) member.role = role;
  if (year !== undefined) member.year = year;
  if (registrationNumber !== undefined) {
    member.registrationNumber = registrationNumber;
  }
  if (department !== undefined) member.department = department;
  if (bio !== undefined) member.bio = bio;
  if (skills !== undefined) member.skills = skills;
  if (linkedin !== undefined) member.linkedin = linkedin;
  if (github !== undefined) member.github = github;
  if (leetcode !== undefined) member.leetcode = leetcode;
  if (portfolio !== undefined) member.portfolio = portfolio;
  if (resume !== undefined) member.resume = resume;
  if (displayOrder !== undefined) {
    member.displayOrder = displayOrder;
  }

  // replace old image
  if(req.file){
    const result = await uploadToCloudinary(req.file.buffer);

    await deleteFromCloudinary(member.image.publicId);

    member.image = {
      url : result.secure_url,
      publicId : result.public_id, 
    };
  }

  await member.save();

  await invalidateCache(["coreTeam:all"]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        member,
        "Core team member updated successfully"
      )
    );
});

// delete core team member
export const deleteCoreTeam = asyncHandler( async( req, res) => {
  const member = await CoreTeam.findById(req.params.id);

  if(!member){
    throw new ApiError(404, "Core team member not found");
  }

  // Delete profile image from Cloudinary
  await deleteFromCloudinary(member.image.publicId);

  await member.deleteOne();

  await invalidateCache(["coreTeam:all"]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Core team member deleted successfully"
      )
    );
});

//// Faculty controller

// create faculty
export const createFaculty = asyncHandler( async(req, res) => {

  const {
    name,
    designation,
    department,
    email,
    bio,
    linkedin,
    displayOrder,
  } = req.body;

  if (!name || !designation || !department) {
    throw new ApiError(
      400,
      "Name, designation and department are required"
    );
  }

  if (!req.file) {
    throw new ApiError(400, "Profile image is required");
  }

  const result = await uploadToCloudinary(req.file.buffer);

  const faculty = await Faculty.create({
    name,
    designation,
    department,
    email,
    bio,
    linkedin,
    displayOrder,
    image: {
      url: result.secure_url,
      publicId: result.public_id,
    },
    createdBy: req.user.userId,
  });

  await invalidateCache(["Faculty:all"]);

  return res
    .status(201)
    .json(new ApiResponse(
      201,
      faculty,
      "Faculty created successfully"
    ))
});

/// get All Faculty 
export const getAllFaculty = asyncHandler(async( req, res) => {
  const cacheKey = "Faculty:all";

  const cachedData = await setCachedData(cacheKey);

  if( cachedData !== null){
    return res.status(200)
      .json( new ApiResponse(
        200, cachedData, "Faculty fetched successfully"
      ));
  }

  const faculty = await Faculty
    .find()
    .populate("createdBy", "name role")
    .sort({ displayOrder: 1 });

  await setCachedData(cacheKey, faculty, 3600);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        faculty,
        "Faculty fetched successfully"
      )
    );  
});

/// get single faculty
export const getFacultyById = asyncHandler( async( req, res ) => {
  const faculty = await Faculty
    .findById(req.params.id)
    .populate("createdBy", "name role");

  if (!faculty) {
    throw new ApiError(404, "Faculty not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        faculty,
        "Faculty fetched successfully"
      )
    );
});

/// update faculty
export const updateFaculty = asyncHandler( async( req, res) => {
  const faculty = await Faculty.findById(req.params.id);

  if(!faculty){
    throw new ApiError(404, "Faculty not found");
  }
  
  const {
    name,
    designation,
    department,
    email,
    bio,
    linkedin,
    displayOrder,
  } = req.body;

  if (name !== undefined) faculty.name = name;
  if (designation !== undefined) faculty.designation = designation;
  if (department !== undefined) faculty.department = department;
  if (email !== undefined) faculty.email = email;
  if (bio !== undefined) faculty.bio = bio;
  if (linkedin !== undefined) faculty.linkedin = linkedin;

  if (displayOrder !== undefined) {
    faculty.displayOrder = displayOrder;
  }

  // replace profile image
  if(req.file){
    const result = await uploadToCloudinary(req.file.buffer);

    await deleteFromCloudinary(faculty.image.publicId);

    faculty.image = {
      url : result.secure_url,
      publicId : result.public_id,
    };
  }

  await faculty.save();

  await invalidateCache(["Faculty:all"]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        faculty,
        "Faculty updated successfully"
      )
    );
});


/// delete Faculty
export const deleteFaculty = asyncHandler( async(req, res) => {
  const faculty = await Faculty.findById(req.params.id);

  if (!faculty) {
    throw new ApiError(404, "Faculty not found");
  }

  // Delete profile image from Cloudinary
  await deleteFromCloudinary(faculty.image.publicId);

  await faculty.deleteOne();

  await invalidateCache(["Faculty:all"]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Faculty deleted successfully"
      )
    );
});
