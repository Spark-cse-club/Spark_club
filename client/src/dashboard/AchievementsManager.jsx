import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiAward } from "react-icons/fi";
import { toast } from "react-toastify";
import { 
  getAchievements, 
  createAchievement, 
  updateAchievement, 
  deleteAchievement 
} from "../api/api.js";
import Modal from "../components/Modal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import ImageUpload from "../components/ImageUpload.jsx";
import Loader from "../components/Loader.jsx";


export default function AchievementsManager() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentAch, setCurrentAch] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "", description: "", category: "other", achievementDate: "",
    personName: "", teamName: "", organization: "", rank: "", link: "", images: []
  });
  const [saving, setSaving] = useState(false);

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchAchievements = () => {
    setLoading(true);
    getAchievements().then(res => setAchievements(res.data || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const openAddModal = () => {
    setFormData({ 
      title: "", description: "", category: "other", achievementDate: "",
      personName: "", teamName: "", organization: "", rank: "", link: "", images: [] 
    });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const openEditModal = (ach) => {
    setCurrentAch(ach);
    setFormData({
      title: ach.title, description: ach.description, category: ach.category,
      achievementDate: new Date(ach.achievementDate).toISOString().slice(0, 10),
      personName: ach.personName || "", teamName: ach.teamName || "",
      organization: ach.organization || "", rank: ach.rank || "", link: ach.link || "",
      images: ach.images?.map(img => img.url) || [] // for preview
    });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'images') {
          // If editing and no new files selected, backend might handle it or we skip
          // If new files selected (they are File objects)
          if (formData.images.length > 0 && formData.images[0] instanceof File) {
            formData.images.forEach(file => data.append('images', file));
          }
        } else if (formData[key] !== null && formData[key] !== "") {
          data.append(key, formData[key]);
        }
      });

      if (isEdit) {
        await updateAchievement(currentAch._id, data);
        toast.success("Achievement updated successfully");
      } else {
        if (formData.images.length === 0 || !(formData.images[0] instanceof File)) {
           toast.error("At least one image is required for new achievement");
           setSaving(false);
           return;
        }
        await createAchievement(data);
        toast.success("Achievement created successfully");
      }
      setIsModalOpen(false);
      fetchAchievements();
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
      await deleteAchievement(deletingId);
      toast.success("Achievement deleted");
      setDeleteOpen(false);
      fetchAchievements();
    } catch (err) {
      toast.error("Failed to delete achievement");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem" }}>Achievements Management</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          <FiPlus /> Add Achievement
        </button>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Achievement</th>
              <th>Category</th>
              <th>Date</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {achievements.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "2rem" }}>No achievements found</td>
              </tr>
            ) : (
              achievements.map(ach => (
                <tr key={ach._id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      {ach.images?.length > 0 ? (
                        <img src={ach.images[0].url} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: 40, height: 40, background: "var(--accent-bg)", color: "var(--accent)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <FiAward />
                        </div>
                      )}
                      <span style={{ fontWeight: 600 }}>{ach.title}</span>
                    </div>
                  </td>
                  <td><span className="badge">{ach.category.replace("_", " ")}</span></td>
                  <td>{new Date(ach.achievementDate).toLocaleDateString()}</td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                      <button className="btn-icon" onClick={() => openEditModal(ach)} title="Edit"><FiEdit2 size={14} /></button>
                      <button className="btn-icon" style={{ color: "#ef4444" }} onClick={() => confirmDelete(ach._id)} title="Delete"><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEdit ? "Edit Achievement" : "Add Achievement"}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input type="text" name="title" className="form-input" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea name="description" className="form-textarea" value={formData.description} onChange={handleChange} required />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select name="category" className="form-select" value={formData.category} onChange={handleChange} required>
                <option value="placement">Placement</option>
                <option value="competition">Competition</option>
                <option value="hackathon">Hackathon</option>
                <option value="exam">Exam</option>
                <option value="open_source">Open Source</option>
                <option value="research">Research</option>
                <option value="certification">Certification</option>
                <option value="internship">Internship</option>
                <option value="award">Award</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input type="date" name="achievementDate" className="form-input" value={formData.achievementDate} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Person Name</label>
              <input type="text" name="personName" className="form-input" value={formData.personName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Team Name</label>
              <input type="text" name="teamName" className="form-input" value={formData.teamName} onChange={handleChange} />
            </div>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Organization</label>
              <input type="text" name="organization" className="form-input" value={formData.organization} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Rank / Position</label>
              <input type="text" name="rank" className="form-input" value={formData.rank} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">External Link</label>
            <input type="url" name="link" className="form-input" value={formData.link} onChange={handleChange} />
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
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
            <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving..." : "Save Achievement"}</button>
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