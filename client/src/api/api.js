import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

/* ──── AUTH ──────────────────────────────────────────────────── */
export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const logoutUser = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const refreshAccessToken = async () => {
  const res = await api.post("/auth/refresh");
  return res.data;
};

/* ──── EVENTS ────────────────────────────────────────────────── */
export const getEvents = async () => {
  const res = await api.get("/events");
  return res.data;
};

export const getEventById = async (id) => {
  const res = await api.get(`/events/${id}`);
  return res.data;
};

export const createEvent = async (data) => {
  const res = await api.post("/events/create", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateEvent = async (id, data) => {
  const res = await api.patch(`/events/${id}/edit`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteEvent = async (id) => {
  const res = await api.delete(`/events/${id}/delete`);
  return res.data;
};

/* ──── PROJECTS ──────────────────────────────────────────────── */
export const getProjects = async () => {
  const res = await api.get("/projects");
  return res.data;
};

export const getProjectById = async (id) => {
  const res = await api.get(`/projects/${id}`);
  return res.data;
};

export const createProject = async (data) => {
  const res = await api.post("/projects/create", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateProject = async (id, data) => {
  const res = await api.patch(`/projects/${id}/edit`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteProject = async (id) => {
  const res = await api.delete(`/projects/${id}/delete`);
  return res.data;
};

/* ──── GALLERY ───────────────────────────────────────────────── */
export const getGallery = async () => {
  const res = await api.get("/gallery");
  return res.data;
};

export const getGalleryById = async (id) => {
  const res = await api.get(`/gallery/${id}`);
  return res.data;
};

export const createGallery = async (data) => {
  const res = await api.post("/gallery/create", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateGallery = async (id, data) => {
  const res = await api.patch(`/gallery/${id}/edit`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteGallery = async (id) => {
  const res = await api.delete(`/gallery/${id}/delete`);
  return res.data;
};

export const updateGalleryImage = async (galleryId, imageId, data) => {
  const res = await api.patch(`/gallery/${galleryId}/images/${imageId}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteGalleryImage = async (galleryId, imageId) => {
  const res = await api.delete(`/gallery/${galleryId}/images/${imageId}`);
  return res.data;
};

/* ──── ACHIEVEMENTS ──────────────────────────────────────────── */
export const getAchievements = async () => {
  const res = await api.get("/achievements");
  return res.data;
};

export const getAchievementById = async (id) => {
  const res = await api.get(`/achievements/${id}`);
  return res.data;
};

export const createAchievement = async (data) => {
  const res = await api.post("/achievements/create", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateAchievement = async (id, data) => {
  const res = await api.patch(`/achievements/${id}/edit`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteAchievement = async (id) => {
  const res = await api.delete(`/achievements/${id}/delete`);
  return res.data;
};

export const updateAchievementImage = async (achievementId, imageId, data) => {
  const res = await api.patch(
    `/achievements/${achievementId}/images/${imageId}`,
    data,
    { 
      headers: 
      { 
        "Content-Type": "multipart/form-data" 
      } 
    }
  );
  return res.data;
};

export const deleteAchievementImage = async (achievementId, imageId) => {
  const res = await api.delete(`/achievements/${achievementId}/images/${imageId}`);
  return res.data;
};

/* ──── TEAM – CORE ───────────────────────────────────────────── */
export const getCoreTeam = async () => {
  const res = await api.get("/teams/core");
  return res.data;
};

export const getCoreTeamById = async (id) => {
  const res = await api.get(`/teams/core/${id}`);
  return res.data;
};

export const createCoreTeamMember = async (data) => {
  const res = await api.post("/teams/core/create", data, {
    headers: { 
      "Content-Type": "multipart/form-data" 
    },
  });
  return res.data;
};

export const updateCoreTeamMember = async (id, data) => {
  const res = await api.patch(`/teams/core/${id}/edit`, data, {
    headers: { 
      "Content-Type": "multipart/form-data" 
    },
  });
  return res.data;
};

export const deleteCoreTeamMember = async (id) => {
  const res = await api.delete(`/teams/core/${id}/delete`);
  return res.data;
};

/* ──── TEAM – FACULTY ────────────────────────────────────────── */
export const getFaculty = async () => {
  const res = await api.get("/teams/faculty");
  return res.data;
};

export const getFacultyById = async (id) => {
  const res = await api.get(`/teams/faculty/${id}`);
  return res.data;
};

export const createFaculty = async (data) => {
  const res = await api.post("/teams/faculty/create", data, {
    headers: { 
      "Content-Type": "multipart/form-data" 
    },
  });
  return res.data;
};

export const updateFaculty = async (id, data) => {
  const res = await api.patch(`/teams/faculty/${id}`, data, {
    headers: { 
      "Content-Type": "multipart/form-data" 
    },
  });
  return res.data;
};

export const deleteFaculty = async (id) => {
  const res = await api.delete(`/teams/faculty/${id}`);
  return res.data;
};

/* ──── CONTACT ───────────────────────────────────────────────── */
export const sendContact = async (data) => {
  const res = await api.post("/contact", data);
  return res.data;
};

/* getStats */
export const getStats = async () => {
  const response = await api.get("/stats");
  return response.data;
};