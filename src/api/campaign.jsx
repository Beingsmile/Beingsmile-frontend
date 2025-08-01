import axiosInstance from './axiosInstance';

export const createCampaign = async (campaignData) => {
  const response = await axiosInstance.post('/campaigns', campaignData);
  return response.data;
};

// Browser and search campaigns
export const getCampaigns = async (params = {}) => {
  const response = await axiosInstance.get("/campaigns/search", { params });
  return response.data;
};

// get specific campaign by id
export const getCampaignById = async (id) => {
  const response = await axiosInstance.get(`/campaigns/${id}`);
  return response.data;
};