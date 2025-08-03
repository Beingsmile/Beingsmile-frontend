import axiosInstance from "./axiosInstance";

export const getComments = async (campaignId) => {
  const res = await axiosInstance.get(`/campaigns/${campaignId}/comments`);
  return res.data;
};

export const addComment = async (campaignId, text, user) => {
  const res = await axiosInstance.post(`/campaigns/${campaignId}/comments`, {
    text,
    user: user._id,
    name: user.name,
  });
  return res.data;
};

export const addReply = async ({
  campaignId,
  commentId,
  text,
  currentUser,
}) => {
  const res = await axiosInstance.post(
    `/api/campaigns/${campaignId}/comments/${commentId}/replies`,
    {
      text,
      userId: currentUser._id,
      username: currentUser.username,
    }
  );
  return res.data;
};
