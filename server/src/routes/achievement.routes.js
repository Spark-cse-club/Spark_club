
import express from "express";

import {
  createAchievement,
  getAchievementById,
  getAllAchievement,
  updateAchievement,
  deleteAchievement,
  deleteAchievementImage,
  updateAchievementImage,
} from "../controllers/achievement.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";


const router  = express.Router();

//public routes
router.get("/", getAllAchievement);
router.get("/:id", getAchievementById);

// create
router.post(
  "/create",
  authMiddleware,
  authorizeRoles(
    "president",
    "vice_president",
    "secretary"
  ),
  upload.array("images", 4),
  createAchievement
);

//update karne ke liye
router.patch(
  "/:id/edit",
  authMiddleware,
  authorizeRoles(
    "president", 
    "vice_president",
    "secretary"),
  upload.array("images", 4),
  updateAchievement
);

//delete achievements
router.delete(
  "/:id/delete",
  authMiddleware,
  authorizeRoles(
    "president",
    "vice_president",
    "secretary"
  ),
  deleteAchievement
)

// update specific images ke liye
router.patch(
  "/:achievementId/images/:imageId",
  authMiddleware,
  authorizeRoles(
    "president",
    "vice_president", 
    "secretary"
  ),
  upload.single("image"),
  updateAchievementImage
);

// delete soecific image 
router.delete(
  "/:achievementId/images/:imageId",
  authMiddleware,
  authorizeRoles(
    "president",
    "vice_president",
    "secretary"
  ),
  deleteAchievementImage
)


export default router;