import axioInstance from "./axiosInstance"

const createUser = async (userData) => {
  const res = await axioInstance.post("/auth/register", userData);
  return res.data;
}

export default createUser;