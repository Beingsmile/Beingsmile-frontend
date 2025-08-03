import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addComment, addReply, getComments } from "../api/comments";

export const useGetComments = (campaignId) => {
  return useQuery({
    queryKey: ['campaignComments', campaignId],
    queryFn: () => getComments(campaignId),
  });
};

export const useAddComment = (campaignId) => {
  const queryClient = useQueryClient(); // Moved inside the hook
  
  return useMutation({
    mutationFn: ({ text, user }) => 
      addComment(campaignId, text, user),
    onSuccess: () => {
      queryClient.invalidateQueries(['campaignComments', campaignId]);
    }
  });
};

export const useAddReply = (campaignId) => {
  const queryClient = useQueryClient(); // Moved inside the hook
  
  return useMutation({
    mutationFn: ({ commentId, text, currentUser }) =>
      addReply({ campaignId, commentId, text, currentUser }),
    onSuccess: () => {
      queryClient.invalidateQueries(['campaignComments', campaignId]);
    }
  });
};