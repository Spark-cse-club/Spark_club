
import express from "express";

import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

// PUBLIC
router.get("/", getAllProjects);

router.get("/:id", getProjectById);

// CREATE
router.post(
  "/create",
  authMiddleware,
  authorizeRoles(
    "president",
    "vice_president",
    "technical_head"
  ),
  upload.single("image"),
  createProject
);


// UPDATE
router.patch(
  "/:id/edit",
  authMiddleware,
  authorizeRoles(
    "president",
    "vice_president",
    "technical_head"
  ),
  upload.single("image"),
  updateProject
);

// DELETE
router.delete(
  "/:id/delete",
  authMiddleware,
  authorizeRoles(
    "president",
    "vice_president",
    "technical_head"
  ),
  deleteProject
);

export default router;
