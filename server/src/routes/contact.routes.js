
import express from "express";

import {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact
} from "../controllers/contact.controller.js";


import authMiddleware from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";


const router = express.Router();

// Public: submit contact form
router.post("/", createContact);

router.get(
  "/",
  authMiddleware,
  authorizeRoles("president", "vice_president"),
  getAllContacts
);

router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("president", "vice_president"),
  getContactById
);

router.patch(
  "/:id/status",
  authMiddleware,
  authorizeRoles("president", "vice_president"),
  updateContactStatus
);

// President / VP can delete
router.delete(
  "/:id/delete",
  authMiddleware,
  authorizeRoles("president", "vice_president"),
  deleteContact
);

export default router;