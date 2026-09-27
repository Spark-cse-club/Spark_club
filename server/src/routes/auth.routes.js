
import express from "express"

import authMiddleware from "../middleware/auth.middleware.js";

import { 
  loginUser, 
  refreshAccessToken,
  logoutUser, 
  getCurrentUser
} from "../controllers/auth.controller.js";

const router  = express.Router();

router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);

router.get("/me", authMiddleware, getCurrentUser);

export default router;