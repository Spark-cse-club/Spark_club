import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiImage } from "react-icons/fi";
import { toast } from "react-toastify";
import {
  getGallery,
  createGallery,
  updateGallery,
  deleteGallery,
} from "../api/api.js";
import Modal from "../components/Modal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import ImageUpload from "../components/ImageUpload.jsx";
import Loader from "../components/Loader.jsx";

export default function GalleryManager() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentGallery, setCurrentGallery] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "event",
    eventName: "",
    eventDate: "",
    images: [],
  });
  const [saving, setSaving] = useState(false);

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchGalleries = () => {
    setLoading(true);
    getGallery()
      .then((res) => setGalleries(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  const openAddModal = () => {
    setFormData({
      title: "",
      description: "",
      category: "event",
      eventName: "",
      eventDate: "",
      images: [],
    });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const openEditModal = (gallery) => {
    setCurrentGallery(gallery);
    setFormData({
      title: gallery.title,
      description: gallery.description || "",
      category: gallery.category,
      eventName: gallery.eventName || "",
      eventDate: gallery.eventDate
        ? new Date(gallery.eventDate).toISOString().slice(0, 10)
        : "",
      images: gallery.images?.map((img) => img.url) || [], // for preview
    });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "images") {
          // If editing and no new files selected, backend might handle it or we skip
          // If new files selected (they are File objects)
          if (
            formData.images.length > 0 &&
            formData.images[0] instanceof File
          ) {
            formData.images.forEach((file) => data.append("images", file));
          }
        } else if (formData[key] !== null && formData[key] !== "") {
          data.append(key, formData[key]);
        }
      });

      if (isEdit) {
        await updateGallery(currentGallery._id, data);
        toast.success("Gallery item updated successfully");
      } else {
        if (
          formData.images.length === 0 ||
          !(formData.images[0] instanceof File)
        ) {
          toast.error("At least one image is required for new gallery item");
          setSaving(false);
          return;
        }
        await createGallery(data);
        toast.success("Gallery item created successfully");
      }
      setIsModalOpen(false);
      fetchGalleries();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id) => {
    setDeletingId(id);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await deleteGallery(deletingId);
      toast.success("Gallery item deleted");
      setDeleteOpen(false);
      fetchGalleries();
    } catch (err) {
      toast.error("Failed to delete gallery item");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ fontSize: "1.5rem" }}>Gallery Management</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          <FiPlus /> Add Gallery Item
        </button>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Event Info</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {galleries.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  No gallery items found
                </td>
              </tr>
            ) : (
              galleries.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      {item.images?.length > 0 ? (
                        <img
                          src={item.images[0].url}
                          alt=""
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 8,
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            background: "var(--accent-bg)",
                            color: "var(--accent)",
                            borderRadius: 8,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FiImage />
                        </div>
                      )}
                      <div>
                        <span style={{ fontWeight: 600, display: "block" }}>
                          {item.title}
                        </span>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          {item.images?.length} images
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge">{item.category}</span>
                  </td>
                  <td>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {item.eventName && <div>{item.eventName}</div>}
                      {item.eventDate && (
                        <div>
                          {new Date(item.eventDate).toLocaleDateString()}
                        </div>
                      )}
                      {!item.eventName && !item.eventDate && <span>-</span>}
                    </div>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        className="btn-icon"
                        onClick={() => openEditModal(item)}
                        title="Edit"
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button
                        className="btn-icon"
                        style={{ color: "#ef4444" }}
                        onClick={() => confirmDelete(item._id)}
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEdit ? "Edit Gallery Item" : "Add Gallery Item"}
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-textarea"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="event">Event</option>
                <option value="workshop">Workshop</option>
                <option value="hackathon">Hackathon</option>
                <option value="competition">Competition</option>
                <option value="celebration">Celebration</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Event Date</label>
              <input
                type="date"
                name="eventDate"
                className="form-input"
                value={formData.eventDate}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Event Name</label>
            <input
              type="text"
              name="eventName"
              className="form-input"
              value={formData.eventName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Images (Max 4)</label>
            <ImageUpload
              multiple={true}
              maxFiles={4}
              value={formData.images}
              onChange={(files) => setFormData({ ...formData, images: files })}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setIsModalOpen(false)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "var(--radius-full)",
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--text-secondary)",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save Gallery Item"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={saving}
      />
    </div>
  );
}
