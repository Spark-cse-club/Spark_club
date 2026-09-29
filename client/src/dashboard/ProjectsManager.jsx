import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiCode } from "react-icons/fi";
import { toast } from "react-toastify";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../api/api.js";
import Modal from "../components/Modal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import ImageUpload from "../components/ImageUpload.jsx";
import Loader from "../components/Loader.jsx";
import "./ProjectsManager.css";

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    startDate: "",
    endDate: "",
    category: "software",
    githubLink: "",
    image: null,
  });
  const [saving, setSaving] = useState(false);

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchProjects = () => {
    setLoading(true);
    getProjects()
      .then((res) => setProjects(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openAddModal = () => {
    setFormData({
      projectName: "",
      description: "",
      startDate: "",
      endDate: "",
      category: "software",
      githubLink: "",
      image: null,
    });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setCurrentProject(project);
    setFormData({
      projectName: project.projectName,
      description: project.description,
      startDate: new Date(project.startDate).toISOString().slice(0, 10),
      endDate: project.endDate
        ? new Date(project.endDate).toISOString().slice(0, 10)
        : "",
      category: project.category,
      githubLink: project.githubLink || "",
      image: project.image?.url || null,
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
        if (key === "image" && formData[key] instanceof File) {
          data.append("image", formData[key]);
        } else if (
          key !== "image" &&
          formData[key] !== null &&
          formData[key] !== ""
        ) {
          data.append(key, formData[key]);
        }
      });

      if (isEdit) {
        await updateProject(currentProject._id, data);
        toast.success("Project updated successfully");
      } else {
        await createProject(data);
        toast.success("Project created successfully");
      }
      setIsModalOpen(false);
      fetchProjects();
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
      await deleteProject(deletingId);
      toast.success("Project deleted");
      setDeleteOpen(false);
      fetchProjects();
    } catch (err) {
      toast.error("Failed to delete project");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="projects-manager-header">
        <h1 className="projects-manager-title">Projects Management</h1>
        <button className="projects-manager-btn projects-manager-btn-primary" onClick={openAddModal}>
          <FiPlus /> Add Project
        </button>
      </div>

      <div className="projects-manager-table-wrapper">
        <table className="projects-manager-data-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Category</th>
              <th>Start Date</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="projects-manager-empty-row"
                >
                  No projects found
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project._id}>
                  <td>
                    <div className="projects-manager-project-info">
                      {project.image?.url ? (
                        <img
                          src={project.image.url}
                          alt=""
                          className="projects-manager-project-image"
                        />
                      ) : (
                        <div className="projects-manager-project-icon">
                          <FiCode />
                        </div>
                      )}
                      <span className="projects-manager-project-title">
                        {project.projectName}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="projects-manager-badge">{project.category}</span>
                  </td>
                  <td>{new Date(project.startDate).toLocaleDateString()}</td>
                  <td style={{ textAlign: "right" }}>
                    <div className="projects-manager-actions">
                      <button
                        className="projects-manager-btn-icon"
                        onClick={() => openEditModal(project)}
                        title="Edit"
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button
                        className="projects-manager-btn-icon projects-manager-btn-delete"
                        onClick={() => confirmDelete(project._id)}
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
        title={isEdit ? "Edit Project" : "Add Project"}
      >
        <form
          onSubmit={handleSubmit}
          className="projects-manager-form"
        >
          <div className="projects-manager-form-group">
            <label className="projects-manager-form-label">Project Name *</label>
            <input
              type="text"
              name="projectName"
              className="projects-manager-form-input"
              value={formData.projectName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="projects-manager-form-group">
            <label className="projects-manager-form-label">Description *</label>
            <textarea
              name="description"
              className="projects-manager-form-textarea"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="projects-manager-form-grid">
            <div className="projects-manager-form-group">
              <label className="projects-manager-form-label">Category *</label>
              <select
                name="category"
                className="projects-manager-form-select"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="software">Software</option>
                <option value="hardware">Hardware</option>
              </select>
            </div>
            <div className="projects-manager-form-group">
              <label className="projects-manager-form-label">GitHub Link</label>
              <input
                type="url"
                name="githubLink"
                className="projects-manager-form-input"
                value={formData.githubLink}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="projects-manager-form-grid">
            <div className="projects-manager-form-group">
              <label className="projects-manager-form-label">Start Date *</label>
              <input
                type="date"
                name="startDate"
                className="projects-manager-form-input"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="projects-manager-form-group">
              <label className="projects-manager-form-label">End Date</label>
              <input
                type="date"
                name="endDate"
                className="projects-manager-form-input"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="projects-manager-form-group">
            <label className="projects-manager-form-label">Project Image</label>
            <ImageUpload
              value={formData.image}
              onChange={(file) => setFormData({ ...formData, image: file })}
            />
          </div>
          <div className="projects-manager-modal-actions">
            <button
              type="button"
              className="projects-manager-btn projects-manager-btn-ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="projects-manager-btn projects-manager-btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save Project"}
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
