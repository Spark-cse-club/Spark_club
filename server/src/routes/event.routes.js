import express from "express";

import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();


// PUBLIC
router.get("/", getAllEvents);

router.get("/:id", getEventById);

// CREATE
router.post(
  "/create",
  authMiddleware,
  authorizeRoles(
    "president",
    "vice_president",
    "technical_head"
  ),
  upload.single("poster"),
  createEvent
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
  upload.single("poster"),
  updateEvent
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
  deleteEvent
);


export default router;