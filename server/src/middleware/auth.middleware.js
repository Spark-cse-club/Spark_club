import jwt from "jsonwebtoken";

import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const authMiddleware = asyncHandler( async(req, res, next) => {
  const token = req.cookies?.accessToken;

  if(!token){
    throw new ApiError(401, "Authentication required");
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  
  req.user = decoded;

  next();
  
});

export default authMiddleware;
