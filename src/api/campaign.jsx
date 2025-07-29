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