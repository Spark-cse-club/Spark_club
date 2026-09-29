import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiUser } from "react-icons/fi";
import { toast } from "react-toastify";
import {
  getCoreTeam, 
  createCoreTeamMember, 
  updateCoreTeamMember, 
  deleteCoreTeamMember,

  getFaculty, 
  createFaculty, 
  updateFaculty, 
  deleteFaculty
} from "../api/api.js";
import Modal from "../components/Modal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import ImageUpload from "../components/ImageUpload.jsx";
import Loader from "../components/Loader.jsx";
import "./TeamManager.css";

export default function TeamManager() {
  const [activeTab, setActiveTab] = useState("core");
  
  // Data states
  const [coreTeam, setCoreTeam] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [saving, setSaving] = useState(false);

  // Forms
  const [coreForm, setCoreForm] = useState({
    name: "", role: "event_head", year: "", registrationNumber: "", department: "",
    bio: "", skills: "", linkedin: "", github: "", leetcode: "", portfolio: "",
    resume: "", displayOrder: 0, image: null
  });

  const [facultyForm, setFacultyForm] = useState({
    name: "", designation: "", department: "", email: "", bio: "", linkedin: "",
    displayOrder: 0, image: null
  });

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coreRes, facultyRes] = await Promise.all([getCoreTeam(), getFaculty()]);
      setCoreTeam(coreRes.data || []);
      setFaculty(facultyRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    if (activeTab === "core") {
      setCoreForm({
        name: "", role: "event_head", year: "", registrationNumber: "", department: "",
        bio: "", skills: "", linkedin: "", github: "", leetcode: "", portfolio: "",
        resume: "", displayOrder: 0, image: null
      });
    } else {
      setFacultyForm({
        name: "", designation: "", department: "", email: "", bio: "", linkedin: "",
        displayOrder: 0, image: null
      });
    }
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setCurrentItem(item);
    if (activeTab === "core") {
      setCoreForm({
        name: item.name, role: item.role, year: item.year,
        registrationNumber: item.registrationNumber, department: item.department,
        bio: item.bio || "", skills: item.skills?.join(", ") || "",
        linkedin: item.linkedin || "", github: item.github || "",
        leetcode: item.leetcode || "", portfolio: item.portfolio || "",
        resume: item.resume || "", displayOrder: item.displayOrder || 0,
        image: item.image?.url || null
      });
    } else {
      setFacultyForm({
        name: item.name, designation: item.designation, department: item.department,
        email: item.email || "", bio: item.bio || "", linkedin: item.linkedin || "",
        displayOrder: item.displayOrder || 0, image: item.image?.url || null
      });
    }
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleCoreChange = (e) => setCoreForm({ ...coreForm, [e.target.name]: e.target.value });
  const handleFacultyChange = (e) => setFacultyForm({ ...facultyForm, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const data = new FormData();
      if (activeTab === "core") {
        Object.keys(coreForm).forEach(key => {
          if (key === 'image' && coreForm[key] instanceof File) {
            data.append('image', coreForm[key]);
          } else if (key === 'skills' && coreForm[key]) {
             // Split comma separated skills
             const skillsArray = coreForm[key].split(",").map(s => s.trim()).filter(Boolean);
             skillsArray.forEach(skill => data.append('skills[]', skill));
          } else if (key !== 'image' && key !== 'skills' && coreForm[key] !== null && coreForm[key] !== "") {
            data.append(key, coreForm[key]);
          }
        });

        if (isEdit) {
          await updateCoreTeamMember(currentItem._id, data);
          toast.success("Team member updated");
        } else {
          await createCoreTeamMember(data);
          toast.success("Team member added");
        }
      } else {
        Object.keys(facultyForm).forEach(key => {
          if (key === 'image' && facultyForm[key] instanceof File) {
            data.append('image', facultyForm[key]);
          } else if (key !== 'image' && facultyForm[key] !== null && facultyForm[key] !== "") {
            data.append(key, facultyForm[key]);
          }
        });

        if (isEdit) {
          await updateFaculty(currentItem._id, data);
          toast.success("Faculty updated");
        } else {
          await createFaculty(data);
          toast.success("Faculty added");
        }
      }
      setIsModalOpen(false);
      fetchData();
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
      if (activeTab === "core") {
        await deleteCoreTeamMember(deletingId);
      } else {
        await deleteFaculty(deletingId);
      }
      toast.success("Deleted successfully");
      setDeleteOpen(false);
      fetchData();
    } catch (err) {
      toast.error("Failed to delete");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="team-manager-header">
        <h1 className="team-manager-title">Team Management</h1>
        <button className="team-manager-btn team-manager-btn-primary" onClick={openAddModal}>
          <FiPlus /> Add {activeTab === "core" ? "Member" : "Faculty"}
        </button>
      </div>

      <div className="team-manager-filter-tabs">
        <button className={`team-manager-filter-tab ${activeTab === "core" ? "active" : ""}`} onClick={() => setActiveTab("core")}>
          Core Team
        </button>
        <button className={`team-manager-filter-tab ${activeTab === "faculty" ? "active" : ""}`} onClick={() => setActiveTab("faculty")}>
          Faculty Advisors
        </button>
      </div>

      <div className="team-manager-table-wrapper">
        <table className="team-manager-data-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>{activeTab === "core" ? "Role" : "Designation"}</th>
              <th>Department</th>
              <th>Order</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(activeTab === "core" ? coreTeam : faculty).length === 0 ? (
              <tr>
                <td colSpan="5" className="team-manager-empty-row">No records found</td>
              </tr>
            ) : (
              (activeTab === "core" ? coreTeam : faculty).map(item => (
                <tr key={item._id}>
                  <td>
                    <div className="team-manager-profile-info">
                      {item.image?.url ? (
                        <img src={item.image.url} alt="" className="team-manager-profile-image" />
                      ) : (
                        <div className="team-manager-profile-icon">
                          <FiUser />
                        </div>
                      )}
                      <div>
                        <span className="team-manager-profile-name">{item.name}</span>
                        {activeTab === "core" && <span className="team-manager-profile-sub">{item.registrationNumber}</span>}
                        {activeTab === "faculty" && <span className="team-manager-profile-sub">{item.email}</span>}
                      </div>
                    </div>
                  </td>
                  <td><span className="team-manager-badge">{activeTab === "core" ? item.role : item.designation}</span></td>
                  <td>{item.department}</td>
                  <td>{item.displayOrder}</td>
                  <td style={{ textAlign: "right" }}>
                    <div className="team-manager-actions">
                      <button className="team-manager-btn-icon" onClick={() => openEditModal(item)} title="Edit"><FiEdit2 size={14} /></button>
                      <button className="team-manager-btn-icon team-manager-btn-delete" onClick={() => confirmDelete(item._id)} title="Delete"><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEdit ? `Edit ${activeTab === "core" ? "Member" : "Faculty"}` : `Add ${activeTab === "core" ? "Member" : "Faculty"}`} size="lg">
        <form onSubmit={handleSubmit} className="team-manager-form">
          
          {activeTab === "core" ? (
            <>
              <div className="team-manager-form-grid">
                <div className="team-manager-form-group">
                  <label className="team-manager-form-label">Name *</label>
                  <input type="text" name="name" className="team-manager-form-input" value={coreForm.name} onChange={handleCoreChange} required />
                </div>
                <div className="team-manager-form-group">
                  <label className="team-manager-form-label">Role *</label>
                  <select name="role" className="team-manager-form-select" value={coreForm.role} onChange={handleCoreChange} required>
                    <option value="president">President</option>
                    <option value="vice_president">Vice President</option>
                    <option value="secretary">Secretary</option>
                    <option value="technical_head">Technical Head</option>
                    <option value="event_head">Event Head</option>
                    <option value="web_head">Web Head</option>
                    <option value="app_head">App Head</option>
                    <option value="dsa_aptitude_head">DSA & Aptitude Head</option>
                    <option value="media_head">Media Head</option>
                    <option value="sports_head">Sports Head</option>
                  </select>
                </div>
              </div>

              <div className="team-manager-form-grid">
                <div className="team-manager-form-group">
                  <label className="team-manager-form-label">Registration Number *</label>
                  <input type="text" name="registrationNumber" className="team-manager-form-input" value={coreForm.registrationNumber} onChange={handleCoreChange} required />
                </div>
                <div className="team-manager-form-group">
                  <label className="team-manager-form-label">Department *</label>
                  <input type="text" name="department" className="team-manager-form-input" value={coreForm.department} onChange={handleCoreChange} required />
                </div>
              </div>

              <div className="team-manager-form-grid">
                <div className="team-manager-form-group">
                  <label className="team-manager-form-label">Year *</label>
                  <input type="text" name="year" className="team-manager-form-input" value={coreForm.year} onChange={handleCoreChange} placeholder="e.g., 3rd Year" required />
                </div>
                <div className="team-manager-form-group">
                  <label className="team-manager-form-label">Display Order</label>
                  <input type="number" name="displayOrder" className="team-manager-form-input" value={coreForm.displayOrder} onChange={handleCoreChange} />
                </div>
              </div>

              <div className="team-manager-form-group">
                <label className="team-manager-form-label">Bio</label>
                <textarea name="bio" className="team-manager-form-textarea" value={coreForm.bio} onChange={handleCoreChange} rows="2" />
              </div>

              <div className="team-manager-form-group">
                <label className="team-manager-form-label">Skills (Comma separated)</label>
                <input type="text" name="skills" className="team-manager-form-input" value={coreForm.skills} onChange={handleCoreChange} placeholder="React, Node, Python..." />
              </div>

              <div className="team-manager-form-grid">
                <div className="team-manager-form-group">
                  <label className="team-manager-form-label">GitHub URL</label>
                  <input type="url" name="github" className="team-manager-form-input" value={coreForm.github} onChange={handleCoreChange} />
                </div>
                <div className="team-manager-form-group">
                  <label className="team-manager-form-label">LinkedIn URL</label>
                  <input type="url" name="linkedin" className="team-manager-form-input" value={coreForm.linkedin} onChange={handleCoreChange} />
                </div>
              </div>

              <div className="team-manager-form-group">
                <label className="team-manager-form-label">Profile Image {isEdit ? "" : "*"}</label>
                <ImageUpload 
                  value={coreForm.image} 
                  onChange={(file) => setCoreForm({ ...coreForm, image: file })} 
                />
              </div>
            </>
          ) : (
            // FACULTY FORM
            <>
              <div className="team-manager-form-grid">
                <div className="team-manager-form-group">
                  <label className="team-manager-form-label">Name *</label>
                  <input type="text" name="name" className="team-manager-form-input" value={facultyForm.name} onChange={handleFacultyChange} required />
                </div>
                <div className="team-manager-form-group">
                  <label className="team-manager-form-label">Designation *</label>
                  <input type="text" name="designation" className="team-manager-form-input" value={facultyForm.designation} onChange={handleFacultyChange} required />
                </div>
              </div>

              <div className="team-manager-form-grid">
                <div className="team-manager-form-group">
                  <label className="team-manager-form-label">Department *</label>
                  <input type="text" name="department" className="team-manager-form-input" value={facultyForm.department} onChange={handleFacultyChange} required />
                </div>
                <div className="team-manager-form-group">
                  <label className="team-manager-form-label">Email</label>
                  <input type="email" name="email" className="team-manager-form-input" value={facultyForm.email} onChange={handleFacultyChange} />
                </div>
              </div>

              <div className="team-manager-form-group">
                <label className="team-manager-form-label">Bio</label>
                <textarea name="bio" className="team-manager-form-textarea" value={facultyForm.bio} onChange={handleFacultyChange} rows="2" />
              </div>

              <div className="team-manager-form-grid">
                <div className="team-manager-form-group">
                  <label className="team-manager-form-label">LinkedIn URL</label>
                  <input type="url" name="linkedin" className="team-manager-form-input" value={facultyForm.linkedin} onChange={handleFacultyChange} />
                </div>
                <div className="team-manager-form-group">
                  <label className="team-manager-form-label">Display Order</label>
                  <input type="number" name="displayOrder" className="team-manager-form-input" value={facultyForm.displayOrder} onChange={handleFacultyChange} />
                </div>
              </div>

              <div className="team-manager-form-group">
                <label className="team-manager-form-label">Profile Image {isEdit ? "" : "*"}</label>
                <ImageUpload 
                  value={facultyForm.image} 
                  onChange={(file) => setFacultyForm({ ...facultyForm, image: file })} 
                />
              </div>
            </>
          )}

          <div className="team-manager-modal-actions">
            <button type="button" className="team-manager-btn team-manager-btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="team-manager-btn team-manager-btn-primary" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
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