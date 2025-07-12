import axioInstance from "./axiosInstance"

export const createUser = async (userData) => {
  const res = await axioInstance.post("/auth/register", userData);
  return res.data;
}

export const loginUser = async ({ email }) => {
  const res = await axioInstance.post("/auth/login", { email });
  return res.data;
}