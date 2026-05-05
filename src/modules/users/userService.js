import axiosClient from "../../api/axiosClient";

// Normalize role to uppercase to match backend enum
const normalizeRole = (role) => {
  if (!role) return role;
  return role.toUpperCase();
};

// Transform user data to match backend schema
const transformUserData = (data) => {
  return {
    ...data,
    role: normalizeRole(data.role),
  };
};

const getAllUsers = async (params) => {
  const response = await axiosClient.get("/admin/users", { params });
  return response.data;
};
const getUserById = async (id) => {
  const response = await axiosClient.get(`/admin/users/${id}`);
  return response.data;
};

const updateUser = async ({ id, data }) => {
  const normalizedData = transformUserData(data);
  const response = await axiosClient.patch(`/admin/users/${id}`, normalizedData);
  return response.data;
};

const deleteUser = async (id) => {
  const response = await axiosClient.delete(`/admin/users/${id}`);
  return response.data;
};

const createUser = async (data) => {
  const normalizedData = transformUserData(data);
  const response = await axiosClient.post("/auth/register", normalizedData);
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