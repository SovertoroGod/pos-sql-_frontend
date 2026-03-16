import axiosClient from "../../api/axiosClient";

const getAllUsers = async (params) => {
    const response = await axiosClient.get("/admin/getAllUsers", { params });
    return response.data;
}
const getUserById = async (id) => {
    const response = await axiosClient.get(`/admin/get-user/${id}`);
    return response.data;
}

const updateUser = async ({ id, data }) => {
  const response = await axiosClient.patch(`/admin/update-user/${id}`, data);
  return response.data;
};

const deleteUser = async (id) => {
  const response = await axiosClient.delete(`/admin/delete-user/${id}`);
  return response.data;
};

const userService = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};

export default userService;