import ApiError from "../utils/ApiError.js";

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {

    if(!req.user){
      throw new ApiError(401,"Authentication required")
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, "You are not authorized for this action");
    }

    next();
    
  }
}
 
export default authorizeRoles;
