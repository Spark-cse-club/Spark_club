import { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiAward,
} from "react-icons/fi";
import { toast } from "react-toastify";

import {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from "../api/api.js";

import Modal from "../components/common/Modal.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import ImageUpload from "../components/common/ImageUpload.jsx";
import Loader from "../components/common/Loader.jsx";

import "./AchievementsManager.css";

const initialFormData = {
  title: "",
  description: "",
  category: "other",
  achievementDate: "",
  personName: "",
  teamName: "",
  organization: "",
  rank: "",
  link: "",
  images: [],
};

export default function AchievementsManager() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentAch, setCurrentAch] = useState(null);

  const [formData, setFormData] = useState(initialFormData);
  const [saving, setSaving] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  /* ========================================
     FETCH ACHIEVEMENTS
  ======================================== */

  const fetchAchievements = async () => {
    setLoading(true);

    try {
      const response = await getAchievements();
      setAchievements(response?.data || []);
    } catch (error) {
      console.error("Failed to fetch achievements:", error);
      setAchievements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  /* ========================================
     ADD
  ======================================== */

  const openAddModal = () => {
    setFormData({
      ...initialFormData,
      images: [],
    });

    setCurrentAch(null);
    setIsEdit(false);
    setIsModalOpen(true);
  };

  /* ========================================
     EDIT
  ======================================== */

  const openEditModal = (achievement) => {
    setCurrentAch(achievement);

    setFormData({
      title: achievement.title || "",
      description: achievement.description || "",
      category: achievement.category || "other",
      achievementDate: achievement.achievementDate
        ? new Date(achievement.achievementDate)
            .toISOString()
            .slice(0, 10)
        : "",
      personName: achievement.personName || "",
      teamName: achievement.teamName || "",
      organization: achievement.organization || "",
      rank: achievement.rank || "",
      link: achievement.link || "",
      images: achievement.images || [],
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

    if (!formData.achievementDate) {
      toast.error("Achievement date is required");
      return;
    }

    if (!isEdit && formData.images.length === 0) {
      toast.error(
        "At least one image is required for new achievement"
      );
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
      data.append(
        "achievementDate",
        formData.achievementDate
      );

      if (formData.personName) {
        data.append("personName", formData.personName);
      }

      if (formData.teamName) {
        data.append("teamName", formData.teamName);
      }

      if (formData.organization) {
        data.append(
          "organization",
          formData.organization
        );
      }

      if (formData.rank) {
        data.append("rank", formData.rank);
      }

      if (formData.link) {
        data.append("link", formData.link);
      }

      /*
        Only append new File objects.
        Existing Cloudinary image objects are not re-uploaded.
      */
      formData.images.forEach((image) => {
        if (image instanceof File) {
          data.append("images", image);
        }
      });

      if (isEdit) {
        await updateAchievement(
          currentAch._id,
          data
        );

        toast.success(
          "Achievement updated successfully"
        );
      } else {
        await createAchievement(data);

        toast.success(
          "Achievement created successfully"
        );
      }

      setIsModalOpen(false);
      setCurrentAch(null);
      setFormData(initialFormData);

      await fetchAchievements();
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
      await deleteAchievement(deletingId);

      toast.success("Achievement deleted");

      setDeleteOpen(false);
      setDeletingId(null);

      await fetchAchievements();
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete achievement"
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
    <div className="achievements-manager">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="achievements-manager-header">
        <h1 className="achievements-manager-title">
          Achievements Management
        </h1>

        <button
          type="button"
          className="achievements-manager-btn achievements-manager-btn-primary"
          onClick={openAddModal}
        >
          <FiPlus />
          Add Achievement
        </button>
      </div>

      {/* ========================================
          TABLE
      ======================================== */}

      <div className="achievements-manager-table-wrapper">
        <table className="achievements-manager-data-table">
          <thead>
            <tr>
              <th>Achievement</th>
              <th>Category</th>
              <th>Date</th>
              <th>Images</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {achievements.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="achievements-manager-empty-row"
                >
                  No achievements found
                </td>
              </tr>
            ) : (
              achievements.map((achievement) => (
                <tr key={achievement._id}>

                  {/* Achievement */}
                  <td>
                    <div className="achievements-manager-item-info">

                      {achievement.images?.length > 0 &&
                      achievement.images[0]?.url ? (
                        <img
                          src={achievement.images[0].url}
                          alt={
                            achievement.title ||
                            "Achievement"
                          }
                          className="achievements-manager-image"
                        />
                      ) : (
                        <div className="achievements-manager-image-placeholder">
                          <FiAward />
                        </div>
                      )}

                      <div>
                        <span className="achievements-manager-item-title">
                          {achievement.title}
                        </span>

                        {achievement.personName && (
                          <span className="achievements-manager-item-meta">
                            {achievement.personName}
                          </span>
                        )}

                        {achievement.teamName && (
                          <span className="achievements-manager-item-meta">
                            {achievement.teamName}
                          </span>
                        )}
                      </div>

                    </div>
                  </td>

                  {/* Category */}
                  <td>
                    <span className="achievements-manager-badge">
                      {achievement.category
                        ?.replace("_", " ")}
                    </span>
                  </td>

                  {/* Date */}
                  <td>
                    <span className="achievements-manager-date">
                      {achievement.achievementDate
                        ? new Date(
                            achievement.achievementDate
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "-"}
                    </span>
                  </td>

                  {/* Images */}
                  <td>
                    <span className="achievements-manager-image-count">
                      {achievement.images?.length || 0} / 4
                    </span>
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="achievements-manager-actions">

                      <button
                        type="button"
                        className="achievements-manager-btn-icon"
                        onClick={() =>
                          openEditModal(achievement)
                        }
                        title="Edit"
                      >
                        <FiEdit2 size={14} />
                      </button>

                      <button
                        type="button"
                        className="achievements-manager-btn-icon achievements-manager-btn-delete"
                        onClick={() =>
                          confirmDelete(
                            achievement._id
                          )
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
            ? "Edit Achievement"
            : "Add Achievement"
        }
        size="lg"
      >
        <form
          onSubmit={handleSubmit}
          className="achievements-manager-form"
        >

          {/* Title */}
          <div className="achievements-manager-form-group">
            <label className="achievements-manager-form-label">
              Title *
            </label>

            <input
              type="text"
              name="title"
              className="achievements-manager-form-input"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter achievement title"
              required
            />
          </div>

          {/* Description */}
          <div className="achievements-manager-form-group">
            <label className="achievements-manager-form-label">
              Description *
            </label>

            <textarea
              name="description"
              className="achievements-manager-form-textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the achievement..."
              required
            />
          </div>

          {/* Category + Date */}
          <div className="achievements-manager-form-grid">

            <div className="achievements-manager-form-group">
              <label className="achievements-manager-form-label">
                Category *
              </label>

              <select
                name="category"
                className="achievements-manager-form-select"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="placement">
                  Placement
                </option>

                <option value="competition">
                  Competition
                </option>

                <option value="hackathon">
                  Hackathon
                </option>

                <option value="exam">
                  Exam
                </option>

                <option value="open_source">
                  Open Source
                </option>

                <option value="research">
                  Research
                </option>

                <option value="certification">
                  Certification
                </option>

                <option value="internship">
                  Internship
                </option>

                <option value="award">
                  Award
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </div>

            <div className="achievements-manager-form-group">
              <label className="achievements-manager-form-label">
                Achievement Date *
              </label>

              <input
                type="date"
                name="achievementDate"
                className="achievements-manager-form-input"
                value={formData.achievementDate}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          {/* Person + Team */}
          <div className="achievements-manager-form-grid">

            <div className="achievements-manager-form-group">
              <label className="achievements-manager-form-label">
                Person Name
              </label>

              <input
                type="text"
                name="personName"
                className="achievements-manager-form-input"
                value={formData.personName}
                onChange={handleChange}
                placeholder="Person name"
              />
            </div>

            <div className="achievements-manager-form-group">
              <label className="achievements-manager-form-label">
                Team Name
              </label>

              <input
                type="text"
                name="teamName"
                className="achievements-manager-form-input"
                value={formData.teamName}
                onChange={handleChange}
                placeholder="Team name"
              />
            </div>

          </div>

          {/* Organization + Rank */}
          <div className="achievements-manager-form-grid">

            <div className="achievements-manager-form-group">
              <label className="achievements-manager-form-label">
                Organization
              </label>

              <input
                type="text"
                name="organization"
                className="achievements-manager-form-input"
                value={formData.organization}
                onChange={handleChange}
                placeholder="Organization"
              />
            </div>

            <div className="achievements-manager-form-group">
              <label className="achievements-manager-form-label">
                Rank / Position
              </label>

              <input
                type="text"
                name="rank"
                className="achievements-manager-form-input"
                value={formData.rank}
                onChange={handleChange}
                placeholder="e.g. 1st, Winner"
              />
            </div>

          </div>

          {/* External Link */}
          <div className="achievements-manager-form-group">
            <label className="achievements-manager-form-label">
              External Link
            </label>

            <input
              type="url"
              name="link"
              className="achievements-manager-form-input"
              value={formData.link}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          {/* Images */}
          <div className="achievements-manager-form-group">
            <label className="achievements-manager-form-label">
              Images (Max 4)
            </label>

            <ImageUpload
              multiple={true}
              maxFiles={4}
              value={formData.images}
              onChange={handleImagesChange}
            />
          </div>

          {/* Actions */}
          <div className="achievements-manager-modal-actions">

            <button
              type="button"
              className="achievements-manager-btn achievements-manager-btn-ghost"
              onClick={() =>
                setIsModalOpen(false)
              }
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="achievements-manager-btn achievements-manager-btn-primary"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : isEdit
                ? "Update Achievement"
                : "Save Achievement"}
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
