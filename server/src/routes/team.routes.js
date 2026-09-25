
import express from "express";

import {
  createCoreTeam,
  getAllCoreTeam,
  getCoreTeamById,
  updateCoreTeam,
  deleteCoreTeam,

  createFaculty,
  getAllFaculty,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
} from "../controllers/team.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import authorizeRoles  from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router  = express.Router();

///// core team routes
router.get("/core", getAllCoreTeam);
router.get("/core/:id", getCoreTeamById);

// president have permission only
router.post(
  "/core/create",
  authMiddleware,
  authorizeRoles("president"),
  upload.single("image"),
  createCoreTeam
);

router.patch(
  "/core/:id/edit",
  authMiddleware,
  authorizeRoles("president"),
  upload.single("image"),
  updateCoreTeam
);

router.delete(
  "/core/:id/delete",
  authMiddleware,
  authorizeRoles("president"),
  deleteCoreTeam
);

//// faculty 
router.get("/faculty", getAllFaculty);
router.get("/faculty/:id", getFacultyById);

// president CRUD
router.post(
  "/faculty/create",
  authMiddleware,
  authorizeRoles("president"),
  upload.single("image"),
  createFaculty
);

router.patch(
  "/faculty/:id",
  authMiddleware,
  authorizeRoles("president"),
  upload.single("image"),
  updateFaculty
);

router.delete(
  "/faculty/:id",
  authMiddleware,
  authorizeRoles("president"),
  deleteFaculty
);

export default router;
