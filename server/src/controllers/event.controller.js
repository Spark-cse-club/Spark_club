import Event from "../models/Event.js";

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


// CREATE EVENT
export const createEvent = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    startDate,
    endDate,
    category = "other",
    venue,
    registrationLink,
  } = req.body;

  if (!title || !description || !startDate || !endDate || !venue) {
    throw new ApiError(
      400,
      "Title, description, start date, end date and venue are required"
    );
  }

  const allowedCategories = ["dsa", "aptitude", "other"];

  if (!allowedCategories.includes(category.toLowerCase())) {
    throw new ApiError(
      400,
      "Category must be dsa, aptitude or other"
    );
  }

  let poster = {
    url: null,
    publicId: null,
  };

  // Upload poster to Cloudinary
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer);

    poster = {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  const event = await Event.create({
    title,
    description,
    startDate,
    endDate,
    category : category.toLowerCase(),
    venue,
    registrationLink,
    poster,
    createdBy: req.user.userId,
  });

  await invalidateCache(["events:all"]);

  return res.status(201).json(
    new ApiResponse(
      201,
      event,
      "Event created successfully"
    )
  );
});


// GET ALL EVENTS
export const getAllEvents = asyncHandler(async (req, res) => {
  const cacheKey = "events:all";

  const cachedEvents = await getCachedData(cacheKey);

  if(cachedEvents !== null){
    return res.status(200).json(
      new ApiResponse(
        200,
        cachedEvents,
        "Events fetched successfully"
      )
    );
  }

  const events = await Event
    .find()
    .populate("createdBy", "name role")
    .sort({ startDate: 1  });

  await setCachedData(cacheKey, events, 600);

  return res.status(200).json(
    new ApiResponse(
      200,
      events,
      "Events fetched successfully"
    )
  );
});


// GET SINGLE EVENT
export const getEventById = asyncHandler(async (req, res) => {
  const eventId = req.params.id;
  const cacheKey = `events:${eventId}`;

  const cachedEvent = await getCachedData(cacheKey);

  if (cachedEvent !== null) {
    return res.status(200).json(
      new ApiResponse(
        200, 
        cachedEvent, 
        "Event fetched successfully"
      )
    );
  }

  const event = await Event
    .findById(eventId)
    .populate("createdBy", "name email role");

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  await setCachedData(cacheKey, event, 600);

  return res.status(200).json(
    new ApiResponse(
      200,
      event,
      "Event fetched successfully"
    )
  );
});


// UPDATE EVENT
export const updateEvent = asyncHandler(async (req, res) => {
  const eventId = req.params.id;
  const event = await Event.findById(eventId);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  const {
    title,
    description,
    startDate,
    endDate,
    venue,
    category,
    registrationLink,
  } = req.body;

  if (title !== undefined) {
    event.title = title;
  }

  if (description !== undefined) {
    event.description = description;
  }

  if (startDate !== undefined) {
    event.startDate = startDate;
  }

  if (endDate !== undefined) {
    event.endDate = endDate;
  }

  if (venue !== undefined) {
    event.venue = venue;
  }

  if (category !== undefined) {
    event.category = category;
  }

  if (registrationLink !== undefined) {
    event.registrationLink = registrationLink;
  }


  // Replace poster
  if (req.file) {
    const oldPublicId = event.poster?.publicId;

    const result = await uploadToCloudinary(
      req.file.buffer
    );

    event.poster = {
      url: result.secure_url,
      publicId: result.public_id,
    };

    // Delete old poster
    if (oldPublicId) {
      await deleteFromCloudinary(oldPublicId);
    }
  }

  await event.save();

  await invalidateCache([
    "events:all",
    `events:${eventId}`,
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      event,
      "Event updated successfully"
    )
  );
});


// DELETE EVENT
export const deleteEvent = asyncHandler(async (req, res) => {
  const EventId = req.params.id;
  const event = await Event.findById(EventId);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  // Delete poster from Cloudinary
  if (event.poster?.publicId) {
    await deleteFromCloudinary(
      event.poster.publicId
    );
  }

  // Delete event from MongoDB
  await event.deleteOne();

  await invalidateCache([
    "events:all",
    `events:${EventId}`,
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Event deleted successfully"
    )
  );
});