import axiosInstance from './axiosInstance';

// ── Campaign CRUD ─────────────────────────────────────────────────────────────
export const createCampaign = async (campaignData) => {
  const response = await axiosInstance.post('/campaigns/create', campaignData);
  return response.data;
};

export const getCampaignById = async (id) => {
  const response = await axiosInstance.get(`/campaigns/${id}`);
  return response.data;
};

export const updateCampaign = async (id, data) => {
  const response = await axiosInstance.patch(`/campaigns/${id}`, data);
  return response.data;
};

export const deleteCampaign = async (id) => {
  const response = await axiosInstance.delete(`/campaigns/${id}`);
  return response.data;
};

// ── Discovery ─────────────────────────────────────────────────────────────────
export const getCampaigns = async (params = {}) => {
  const response = await axiosInstance.get('/campaigns/search', { params });
  return response.data;
};

export const getFeaturedCampaigns = async () => {
  const response = await axiosInstance.get('/campaigns/featured');
  return response.data;
};

export const getTrendingCampaigns = async (limit = 6) => {
  const response = await axiosInstance.get('/campaigns/trending', { params: { limit } });
  return response.data;
};

export const getNewestCampaigns = async (limit = 6) => {
  const response = await axiosInstance.get('/campaigns/newest', { params: { limit } });
  return response.data;
};

// ── User campaigns ────────────────────────────────────────────────────────────
export const getUserCampaigns = async (page = 1) => {
  const response = await axiosInstance.get('/campaigns/my-campaigns', { params: { page } });
  return response.data;
};

export const getSavedCampaigns = async () => {
  const response = await axiosInstance.get('/campaigns/saved');
  return response.data;
};

// ── Engagement ────────────────────────────────────────────────────────────────
export const toggleRecommend = async (id) => {
  const response = await axiosInstance.post(`/campaigns/${id}/recommend`);
  return response.data;
};

export const toggleSave = async (id) => {
  const response = await axiosInstance.post(`/campaigns/${id}/save`);
  return response.data;
};

export const toggleSubscribe = async (id, emailAlso = false) => {
  const response = await axiosInstance.post(`/campaigns/${id}/subscribe`, { email: emailAlso });
  return response.data;
};

// ── Updates ───────────────────────────────────────────────────────────────────
export const getCampaignUpdates = async (id) => {
  const response = await axiosInstance.get(`/campaigns/${id}/updates`);
  return response.data;
};

export const submitCampaignUpdate = async (id, data) => {
  const response = await axiosInstance.post(`/campaigns/${id}/updates`, data);
  return response.data;
};

// ── Documents ─────────────────────────────────────────────────────────────────
export const uploadAdditionalDocuments = async (id, documents) => {
  const response = await axiosInstance.post(`/campaigns/${id}/documents`, { documents });
  return response.data;
};

// ── Comments ──────────────────────────────────────────────────────────────────
export const getComments = async (id, page = 1) => {
  const response = await axiosInstance.get(`/campaigns/${id}/comments`, { params: { page, limit: 10 } });
  return response.data;
};

export const addComment = async (id, text) => {
  const response = await axiosInstance.post(`/campaigns/${id}/comments`, { text });
  return response.data;
};

export const addReply = async (campaignId, commentId, text) => {
  const response = await axiosInstance.post(`/campaigns/${campaignId}/comments/${commentId}/replies`, { text });
  return response.data;
};

// ── Platform Settings (public) ────────────────────────────────────────────────
export const getPlatformSettings = async () => {
  const response = await axiosInstance.get('/campaigns/platform-settings');
  return response.data;
};
