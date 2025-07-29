import axiosInstance from "./axiosInstance"

export const createUser = async (userData) => {
  const res = await axiosInstance.post("/auth/register", userData);
  return res.data;
}

export const loginUser = async ({ email }) => {
  const res = await axiosInstance.post("/auth/login", { email });
  return res.data;
}