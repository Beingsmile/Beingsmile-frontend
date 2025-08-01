import { useMutation, useQuery } from "@tanstack/react-query";
import { createCampaign, getCampaignById, getCampaigns } from "../api/campaign";

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
  });
};