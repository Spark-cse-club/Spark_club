
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { 
  generateAccessToken, 
  generateRefreshToken 
} from "../utils/generateToken.js";

import User from "../models/User.js";

import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

/// this is a login controller
export const loginUser = asyncHandler( async(req, res) => {
  const { email, password } = req.body;

  // check imput
  if(!email || !password){
    throw new ApiError(400, "Email and Password are required");
  }

  const user = await User.findOne({ email })

  // user not exist 
  if(!user) {
    throw new ApiError(401, "Invalid credentials")
  }

  // password compare
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  // password is not correct 
  if(!isPasswordCorrect){
    throw new ApiError(401, "Invalid Credential");
  }

  // generate tokens
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = { 
    httpOnly : true, 
    secure : isProduction,
    sameSite : isProduction ? "none" : "lax",
    maxAge : 7 * 24 * 60 * 60 * 1000, 
  };

  // send response
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200, 
        {
          user : {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },

        "Login Successful"
      )
    );
});

/// for generating accessToken
export const refreshAccessToken = asyncHandler( async(req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  // if not found 
  if(!refreshToken){
    throw new ApiError(401, "Refresh token required");
  }

  // verify token
  const decoded = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  // fetch user from database
  const user = await User.findById(decoded.userId);

  if(!user){
    throw new ApiError(401,"Invalid refresh token");
  }

  // new AccessToken
  const newAccessToken = generateAccessToken(
    user._id,
    user.role
  );

  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  // response
  return res
    .status(200)
    .cookie("accessToken", newAccessToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        null,
        "Access token refreshed successfully"
      )
    );
});

// for logout controller
export const logoutUser = asyncHandler( async(req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = {
    httpOnly : true,
    secure : isProduction,
    sameSite : isProduction ? "none" : "lax",
  };

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(
      new ApiResponse(
        200,
        null,
        "Logout SuccessFul"
      )
    );
});

