
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

import Contact from "../models/Contact.js";

// create a contact message public
export const createContact = asyncHandler(async (req, res) => {
  const { 
    name, 
    email, 
    subject, 
    message 
  } = req.body;

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    throw new ApiError(400, "All fields are required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email.trim())) {
    throw new ApiError(400, "Invalid email address");
  }

  const contact = await Contact.create({
    name,
    email,
    subject,
    message,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      contact,
      "Message sent successfully"
    )
  );

});

// Get all contact messages (Admin)
export const getAllContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact
    .find()
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      contacts,
      "Contact messages fetched successfully"
    )
  );
});

// Get contact message by ID (Admin)
export const getContactById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const contact = await Contact.findById(id);

  if (!contact) {
    throw new ApiError(404, "Contact message not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      contact,
      "Contact message fetched successfully"
    )
  );
});

// Update contact message status (Admin)
export const updateContactStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ["unread", "read", "replied"];

  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, "Invalid contact status");
  }

  const contact = await Contact.findByIdAndUpdate(
    id,
    { $set: { status } },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!contact) {
    throw new ApiError(404, "Contact message not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      contact,
      "Contact status updated successfully"
    )
  );
});

// Delete contact message (Admin)
export const deleteContact = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const contact = await Contact.findByIdAndDelete(id);

  if (!contact) {
    throw new ApiError(404, "Contact message not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Contact message deleted successfully"
    )
  );
});