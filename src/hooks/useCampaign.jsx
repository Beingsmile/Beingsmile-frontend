import { useMutation, useQuery } from "@tanstack/react-query";
import { 
  createCampaign, 
  getCampaignById, 
  getCampaigns, 
  getFeaturedCampaigns, 
  getTrendingCampaigns, 
  getNewestCampaigns,
  getUserCampaigns,
  getSavedCampaigns,
  getCampaignUpdates,
  getComments,
  getPlatformSettings
} from "../api/campaign";

// Create Campaign Hook
export const useCreateCampaign = () => {
  return useMutation({
    mutationFn: createCampaign,
  });
};

// Browse/Search Campaigns Hook
export const useBrowseCampaigns = (searchParams = {}) => {
  return useQuery({
    queryKey: ["campaigns", searchParams],
    queryFn: async () => getCampaigns(searchParams),
    keepPreviousData: true,
  });
};

// get campaign by id hook
export const useCampaignDetails = (id) => {
  return useQuery({
    queryKey: ["campaign", id],
    queryFn: async () => getCampaignById(id),
    keepPreviousData: true,
    enabled: !!id,
  });
};

// Featured Campaigns Hook
export const useFeaturedCampaigns = () => {
  return useQuery({
    queryKey: ['campaigns', 'featured'],
    queryFn: getFeaturedCampaigns,
  });
};

// Trending Campaigns Hook
export const useTrendingCampaigns = (limit = 6) => {
  return useQuery({
    queryKey: ['campaigns', 'trending', limit],
    queryFn: () => getTrendingCampaigns(limit),
  });
};

// Newest Campaigns Hook
export const useNewestCampaigns = (limit = 6) => {
  return useQuery({
    queryKey: ['campaigns', 'newest', limit],
    queryFn: () => getNewestCampaigns(limit),
  });
};

// User's own campaigns
export const useUserCampaigns = (page = 1) => {
  return useQuery({
    queryKey: ['campaigns', 'me', page],
    queryFn: () => getUserCampaigns(page),
  });
};

// User's saved campaigns
export const useSavedCampaigns = () => {
  return useQuery({
    queryKey: ['campaigns', 'saved'],
    queryFn: getSavedCampaigns,
  });
};

// Campaign Updates
export const useCampaignUpdates = (id) => {
  return useQuery({
    queryKey: ['campaign', id, 'updates'],
    queryFn: () => getCampaignUpdates(id),
    enabled: !!id,
  });
};

// Campaign Comments
export const useComments = (id, page = 1) => {
  return useQuery({
    queryKey: ['campaign', id, 'comments', page],
    queryFn: () => getComments(id, page),
    enabled: !!id,
  });
};

// Platform Settings (Public)
export const usePlatformSettings = () => {
  return useQuery({
    queryKey: ['platform', 'settings'],
    queryFn: getPlatformSettings,
  });
};
