import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { getCachedData, setCachedData } from "../utils/cacheHelpers.js";

import Event from "../models/Event.js";
import CoreTeam from "../models/CoreTeam.js";
import Gallery from "../models/Gallery.js";
import Achievement from "../models/Achievement.js";
import Project from "../models/Project.js";


export const getStats = asyncHandler(async (req, res) => {
  const cacheKey = "stats:all";

  const cachedStats = await getCachedData(cacheKey);
  
  if(cachedStats !== null){
    return res.status(200).json(
      new ApiResponse(
        200,
        cachedStats,
        "Stats fetched successfully"
      )
    );
  }

  const [events, projects, achievements, gallery, team] =
    await Promise.all([
      Event.countDocuments(),
      Project.countDocuments(),
      Achievement.countDocuments(),
      Gallery.countDocuments(),
      CoreTeam.countDocuments(),
    ]);

  await setCachedData(cacheKey, cachedStats, 600);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        events,
        projects,
        achievements,
        gallery,
        team,
      },
      "Dashboard stats fetched successfully"
    )
  );
});