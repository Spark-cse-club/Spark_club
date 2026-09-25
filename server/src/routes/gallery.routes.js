
import express from "express";

import {
  createGallery,
  getAllGallery,
  getGalleryById,
  updateGallery,
  deleteGallery,
  deleteGalleryImage,
  updateGalleryImage,
} from "../controllers/gallery.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

// Public
router.get("/", getAllGallery);
router.get("/:id", getGalleryById);

// Gallery CRUD
router.post(
  "/create",
  authMiddleware,
  authorizeRoles(
    "president", 
    "vice_president", 
    "secretary"
  ),
  upload.array("images", 4),
  createGallery
);

router.patch(
  "/:id/edit",
  authMiddleware,
  authorizeRoles(
    "president", 
    "vice_president", 
    "secretary"
  ),
  upload.array("images", 4),
  updateGallery
);

router.delete(
  "/:id/delete",
  authMiddleware,
  authorizeRoles(
    "president", 
    "vice_president", 
    "secretary"
  ),
  deleteGallery
);

// Specific image operations
router.delete(
  "/:galleryId/images/:imageId",
  authMiddleware,
  authorizeRoles(
    "president", 
    "vice_president", 
    "secretary"
  ),
  deleteGalleryImage
);

router.patch(
  "/:galleryId/images/:imageId",
  authMiddleware,
  authorizeRoles(
    "president", 
    "vice_president", 
    "secretary"
  ),
  upload.single("image"),
  updateGalleryImage
);

export default router;