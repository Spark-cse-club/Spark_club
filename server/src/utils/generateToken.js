
import jwt from "jsonwebtoken";

export const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn : process.env.JWT_EXPIRES_IN,
    }
  )
}

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn : process.env.JWT_EXPIRES_IN,
    }
  );
};