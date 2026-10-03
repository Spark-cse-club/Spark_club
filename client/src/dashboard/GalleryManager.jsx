import { useEffect, useState } from "react";
import {
  FiEdit2,
  FiImage,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import { toast } from "react-toastify";

import {
  getGallery,
  createGallery,
  updateGallery,
  deleteGallery,
} from "../api/api.js";

import Modal from "../components/common/Modal.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import ImageUpload from "../components/common/ImageUpload.jsx";
import Loader from "../components/common/Loader.jsx";

import "./GalleryManager.css";

const categories = [
  "event",
  "workshop",
  "hackathon",
  "competition",
  "celebration",
  "other",
];

const initialFormData = {
  title: "",
  description: "",
  category: "event",
  eventName: "",
  eventDate: "",
  images: [],
};

export default function GalleryManager() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentGallery, setCurrentGallery] = useState(null);

  const [formData, setFormData] = useState(initialFormData);
  const [saving, setSaving] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  /* ========================================
     FETCH GALLERY
  ======================================== */

  const fetchGallery = async () => {
    setLoading(true);

    try {
      const response = await getGallery();
      setGallery(response?.data || []);
    } catch (error) {
      console.error("Failed to fetch gallery:", error);
      setGallery([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  /* ========================================
     ADD
  ======================================== */

  const openAddModal = () => {
    setFormData({
      ...initialFormData,
      images: [],
    });

    setCurrentGallery(null);
    setIsEdit(false);
    setIsModalOpen(true);
  };

  /* ========================================
     EDIT
  ======================================== */

  const openEditModal = (item) => {
    setCurrentGallery(item);

    setFormData({
      title: item.title || "",
      description: item.description || "",
      category: item.category || "event",
      eventName: item.eventName || "",
      eventDate: item.eventDate
        ? new Date(item.eventDate).toISOString().slice(0, 10)
        : "",
      images: item.images || [],
    });

    setIsEdit(true);
    setIsModalOpen(true);
  };

  /* ========================================
     FORM CHANGE
  ======================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* ========================================
     IMAGE CHANGE
  ======================================== */

  const handleImagesChange = (images) => {
    setFormData((previous) => ({
      ...previous,
      images,
    }));
  };

  /* ========================================
     SUBMIT
  ======================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }

    if (!isEdit && formData.images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    if (formData.images.length > 4) {
      toast.error("Maximum 4 images are allowed");
      return;
    }

    setSaving(true);

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);

      if (formData.eventName) {
        data.append("eventName", formData.eventName);
      }

      if (formData.eventDate) {
        data.append("eventDate", formData.eventDate);
      }

      /*
        New images are File objects.
        Existing images are Cloudinary objects.
      */
      formData.images.forEach((image) => {
        if (image instanceof File) {
          data.append("images", image);
        }
      });

      if (isEdit) {
        await updateGallery(currentGallery._id, data);
        toast.success("Gallery updated successfully");
      } else {
        await createGallery(data);
        toast.success("Gallery item created successfully");
      }

      setIsModalOpen(false);
      setFormData(initialFormData);
      setCurrentGallery(null);

      await fetchGallery();
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  /* ========================================
     DELETE
  ======================================== */

  const confirmDelete = (id) => {
    setDeletingId(id);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    setSaving(true);

    try {
      await deleteGallery(deletingId);

      toast.success("Gallery item deleted");

      setDeleteOpen(false);
      setDeletingId(null);

      await fetchGallery();
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete gallery item"
      );
    } finally {
      setSaving(false);
    }
  };

  /* ========================================
     LOADING
  ======================================== */

  if (loading) {
    return <Loader />;
  }

  /* ========================================
     UI
  ======================================== */

  return (
    <div className="gallery-manager">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="gallery-manager-header">
        <h1 className="gallery-manager-title">
          Gallery Management
        </h1>

        <button
          type="button"
          className="gallery-manager-btn gallery-manager-btn-primary"
          onClick={openAddModal}
        >
          <FiPlus />
          Add Gallery Item
        </button>
      </div>

      {/* ========================================
          TABLE
      ======================================== */}

      <div className="gallery-manager-table-wrapper">
        <table className="gallery-manager-data-table">
          <thead>
            <tr>
              <th>Gallery</th>
              <th>Category</th>
              <th>Event</th>
              <th>Images</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {gallery.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="gallery-manager-empty-row"
                >
                  No gallery items found
                </td>
              </tr>
            ) : (
              gallery.map((item) => (
                <tr key={item._id}>

                  {/* Gallery */}
                  <td>
                    <div className="gallery-manager-item-info">

                      {item.images?.length > 0 &&
                      item.images[0]?.url ? (
                        <img
                          src={item.images[0].url}
                          alt={item.title || "Gallery"}
                          className="gallery-manager-image"
                        />
                      ) : (
                        <div className="gallery-manager-image-placeholder">
                          <FiImage />
                        </div>
                      )}

                      <div>
                        <span className="gallery-manager-item-title">
                          {item.title}
                        </span>

                        <span className="gallery-manager-image-count">
                          {item.images?.length || 0}{" "}
                          {item.images?.length === 1
                            ? "image"
                            : "images"}
                        </span>
                      </div>

                    </div>
                  </td>

                  {/* Category */}
                  <td>
                    <span className="gallery-manager-badge">
                      {item.category}
                    </span>
                  </td>

                  {/* Event */}
                  <td>
                    <div className="gallery-manager-event-info">

                      {item.eventName && (
                        <div>{item.eventName}</div>
                      )}

                      {item.eventDate && (
                        <div>
                          {new Date(
                            item.eventDate
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      )}

                      {!item.eventName &&
                        !item.eventDate && (
                          <span>-</span>
                        )}

                    </div>
                  </td>

                  {/* Image Count */}
                  <td>
                    <span className="gallery-manager-image-count">
                      {item.images?.length || 0} / 4
                    </span>
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="gallery-manager-actions">

                      <button
                        type="button"
                        className="gallery-manager-btn-icon"
                        onClick={() =>
                          openEditModal(item)
                        }
                        title="Edit"
                      >
                        <FiEdit2 size={14} />
                      </button>

                      <button
                        type="button"
                        className="gallery-manager-btn-icon gallery-manager-btn-delete"
                        onClick={() =>
                          confirmDelete(item._id)
                        }
                        title="Delete"
                      >
                        <FiTrash2 size={14} />
                      </button>

                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ========================================
          ADD / EDIT MODAL
      ======================================== */}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          isEdit
            ? "Edit Gallery Item"
            : "Add Gallery Item"
        }
        size="lg"
      >
        <form
          onSubmit={handleSubmit}
          className="gallery-manager-form"
        >

          {/* Title */}
          <div className="gallery-manager-form-group">
            <label className="gallery-manager-form-label">
              Title *
            </label>

            <input
              type="text"
              name="title"
              className="gallery-manager-form-input"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter gallery title"
              required
            />
          </div>

          {/* Description */}
          <div className="gallery-manager-form-group">
            <label className="gallery-manager-form-label">
              Description *
            </label>

            <textarea
              name="description"
              className="gallery-manager-form-textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe this gallery item..."
              required
            />
          </div>

          {/* Category + Event Name */}
          <div className="gallery-manager-form-grid">

            <div className="gallery-manager-form-group">
              <label className="gallery-manager-form-label">
                Category *
              </label>

              <select
                name="category"
                className="gallery-manager-form-select"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category
                      .replace("_", " ")
                      .replace(/\b\w/g, (letter) =>
                        letter.toUpperCase()
                      )}
                  </option>
                ))}
              </select>
            </div>

            <div className="gallery-manager-form-group">
              <label className="gallery-manager-form-label">
                Event Name
              </label>

              <input
                type="text"
                name="eventName"
                className="gallery-manager-form-input"
                value={formData.eventName}
                onChange={handleChange}
                placeholder="e.g. DSA Showdown"
              />
            </div>

          </div>

          {/* Event Date */}
          <div className="gallery-manager-form-group">
            <label className="gallery-manager-form-label">
              Event Date
            </label>

            <input
              type="date"
              name="eventDate"
              className="gallery-manager-form-input"
              value={formData.eventDate}
              onChange={handleChange}
            />
          </div>

          {/* Images */}
          <div className="gallery-manager-form-group">
            <label className="gallery-manager-form-label">
              Images
            </label>

            <ImageUpload
              value={formData.images}
              onChange={handleImagesChange}
              multiple
              maxFiles={4}
            />
          </div>

          {/* Modal Actions */}
          <div className="gallery-manager-modal-actions">

            <button
              type="button"
              className="gallery-manager-btn gallery-manager-btn-ghost"
              onClick={() =>
                setIsModalOpen(false)
              }
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="gallery-manager-btn gallery-manager-btn-primary"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : isEdit
                ? "Update Gallery"
                : "Save Gallery"}
            </button>

          </div>

        </form>
      </Modal>

      {/* ========================================
          DELETE CONFIRMATION
      ======================================== */}

      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={saving}
      />

    </div>
  );
}