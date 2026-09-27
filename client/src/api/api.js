import axios from "axios";

const api = axios.create({
  baseURL : import.meta.env.VITE_API_URL,
  withCredentials : true,
});


/// Auth APIs ///

export const loginUser = async(data) => {
  const response = await api.post(
    "/auth/login", data
  );

  return response.data;
};

export const logoutUser = async () => {
  const response = api.post(
    "/auth/logout"
  );

  return (await response).data;
};

export const getCurrentUser = async () => {
  const response = await api.get(
    "/auth/me"
  );
  
  return response.data;
};

export const refreshAccessToken = async () => {
  const response = await api.post(
    "/auth/refresh"
  );

  return response.data;
};

///// Events ////
export const getEvents = async () => {
  const response = await api.get(
    "/events"
  );

  return response.data;
};

export const getEventById = async (id) => {
  const response = await api.get(
    `/events/${id}`
  );

  return response.data;
};

export const createEvent = async (data) => {
  const response = await api.post(
    "/events/create", data
  );

  return response.data;
};

export const updateEvent = async (id, data) => {
  const response = await api.patch(
    `/events/${id}/edit`, data
  );

  return response.data;
};

export const deleteEvent = async (id) => {
  const response = await api.delete(
    `/events/${id}/delete`
  );

  return response.data;
};

///// Projects /////
export const getProjects = async() => {

}

export const getProjectById  = async(id) => {

}

export const createProject = async(data) => {

}

export const updateProject = async(id, data) => {

}

export const deleteProject = (id) => {

}

///// Gallery   ////
export const getGallery = async() => {

}

export const getGalleryById = async(id) => {

}

export const createGallery = async(data) => {

}

export const updateGallery = async(id, data) => {

}

export const deleteGallery = async(id) => {

}

export const updateGalleryImage = async(id, imageId, data) => {

}
export const deleteGalleryImage = async(id, imageId) => {

}

// Achievements ////
export const getAchievements = async() => {

}

export const getAchievementById = (id) => {

}

export const createAchievement = async(data) => {

}

export const updateAchievement = async(id, data) => {

}

export const deleteAchievement = async(id) => {

}

export const updateAchievementImage = async(id, imageId, data) => {

}

export const deleteAchievementImage = async(id, imageId) => {

}

// Team   /// 
export const getTeam = async() => {

}

export const getTeamById = async(id) => {

}

export const createTeamMember = async(data) => {

}

export const updateTeamMember = async(id, data) => {

}

export const deleteTeamMember = async(id) => {

}

export const updateTeamImage = async(id, data) => {

}