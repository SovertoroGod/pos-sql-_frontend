import axiosClient from "../../api/axiosClient";

const getAllUsers = async (params) => {
  const response = await axiosClient.get("/admin/users", { params });
  return response.data;
};
const getUserById = async (id) => {
  const response = await axiosClient.get(`/admin/users/${id}`);
  return response.data;
};

const updateUser = async ({ id, data }) => {
  const response = await axiosClient.patch(`/admin/users/${id}`, data);
  return response.data;
};

const deleteUser = async (id) => {
  const response = await axiosClient.delete(`/admin/users/${id}`);
  return response.data;
};

const createUser = async (data) => {
  const response = await axiosClient.post("/auth/register", data);
  return response.data;
};

const userService = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
};

export default userService;