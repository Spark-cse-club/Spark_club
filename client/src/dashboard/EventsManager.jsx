import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiCalendar } from "react-icons/fi";
import { toast } from "react-toastify";
import { getEvents, createEvent, updateEvent, deleteEvent } from "../api/api.js";

import Modal from "../components/common/Modal.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import ImageUpload from "../components/common/ImageUpload.jsx";
import Loader from "../components/common/Loader.jsx";
import "./EventsManager.css";

export default function EventsManager() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "", description: "", startDate: "", endDate: "",
    category: "other", venue: "", registrationLink: "", poster: null
  });
  const [saving, setSaving] = useState(false);

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchEvents = () => {
    setLoading(true);
    getEvents().then(res => setEvents(res.data || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openAddModal = () => {
    setFormData({ title: "", 
      description: "", 
      startDate: "", 
      endDate: "", 
      category: "other", 
      venue: "", 
      registrationLink: "",
      poster: null 
    });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    setCurrentEvent(event);
    setFormData({
      title: event.title, 
      description: event.description,
      startDate: new Date(event.startDate).toISOString().slice(0, 16),
      endDate: new Date(event.endDate).toISOString().slice(0, 16),
      category: event.category, 
      venue: event.venue,
      registrationLink: event.registrationLink || "",
      poster: event.poster?.url || null
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
        if (key === 'poster' && formData[key] instanceof File) {
          data.append('poster', formData[key]);
        } else if (key !== 'poster' && formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      if (isEdit) {
        await updateEvent(currentEvent._id, data);
        toast.success("Event updated successfully");
      } else {
        await createEvent(data);
        toast.success("Event created successfully");
      }
      setIsModalOpen(false);
      fetchEvents();
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
      await deleteEvent(deletingId);
      toast.success("Event deleted");
      setDeleteOpen(false);
      fetchEvents();
    } catch (err) {
      toast.error("Failed to delete event");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="events-manager-header">
        <h1 className="events-manager-title">Events Management</h1>
        <button className="events-manager-btn events-manager-btn-primary" onClick={openAddModal}>
          <FiPlus /> Add Event
        </button>
      </div>

      <div className="events-manager-table-wrapper">
        <table className="events-manager-data-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Category</th>
              <th>Date</th>
              <th>Venue</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan="5" className="events-manager-empty-row">No events found</td>
              </tr>
            ) : (
              events.map(event => (
                <tr key={event._id}>
                  <td>
                    <div className="events-manager-event-info">
                      {event.poster?.url ? (
                        <img src={event.poster.url} alt="" className="events-manager-event-image" />
                      ) : (
                        <div className="events-manager-event-icon">
                          <FiCalendar />
                        </div>
                      )}
                      <span className="events-manager-event-title">{event.title}</span>
                    </div>
                  </td>
                  <td><span className="events-manager-badge">{event.category}</span></td>
                  <td>{new Date(event.startDate).toLocaleDateString()}</td>
                  <td>{event.venue}</td>
                  <td style={{ textAlign: "right" }}>
                    <div className="events-manager-actions">
                      <button className="events-manager-btn-icon" onClick={() => openEditModal(event)} title="Edit"><FiEdit2 size={14} /></button>
                      <button className="events-manager-btn-icon events-manager-btn-delete" onClick={() => confirmDelete(event._id)} title="Delete"><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEdit ? "Edit Event" : "Add Event"}>
        <form onSubmit={handleSubmit} className="events-manager-form">
          <div className="events-manager-form-group">
            <label className="events-manager-form-label">Title *</label>
            <input type="text" name="title" className="events-manager-form-input" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="events-manager-form-group">
            <label className="events-manager-form-label">Description *</label>
            <textarea name="description" className="events-manager-form-textarea" value={formData.description} onChange={handleChange} required />
          </div>
          <div className="events-manager-form-grid">
            <div className="events-manager-form-group">
              <label className="events-manager-form-label">Start Date *</label>
              <input type="datetime-local" name="startDate" className="events-manager-form-input" value={formData.startDate} onChange={handleChange} required />
            </div>
            <div className="events-manager-form-group">
              <label className="events-manager-form-label">End Date *</label>
              <input type="datetime-local" name="endDate" className="events-manager-form-input" value={formData.endDate} onChange={handleChange} required />
            </div>
          </div>
          <div className="events-manager-form-grid">
            <div className="events-manager-form-group">
              <label className="events-manager-form-label">Category *</label>
              <select name="category" className="events-manager-form-select" value={formData.category} onChange={handleChange} required>
                <option value="dsa">DSA</option>
                <option value="aptitude">Aptitude</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="events-manager-form-group">
              <label className="events-manager-form-label">Venue *</label>
              <input type="text" name="venue" className="events-manager-form-input" value={formData.venue} onChange={handleChange} required />
            </div>
          </div>
          <div className="events-manager-form-group">
            <label className="events-manager-form-label">Registration Link</label>
            <input type="url" name="registrationLink" className="events-manager-form-input" value={formData.registrationLink} onChange={handleChange} />
          </div>
          <div className="events-manager-form-group">
            <label className="events-manager-form-label">Poster Image</label>
            <ImageUpload 
              value={formData.poster} 
              onChange={(file) => setFormData({ ...formData, poster: file })} 
            />
          </div>
          <div className="events-manager-modal-actions">
            <button type="button" className="events-manager-btn events-manager-btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="events-manager-btn events-manager-btn-primary" disabled={saving}>{saving ? "Saving..." : "Save Event"}</button>
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
