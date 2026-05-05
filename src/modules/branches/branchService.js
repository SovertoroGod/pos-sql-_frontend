import axiosClient from "../../api/axiosClient";

const getAllBranches = async (params) => {
  const response = await axiosClient.get("/admin/branches", {
    params,
  });
  return response.data;
};

const getBranchById = async (id) => {
  const response = await axiosClient.get(`/admin/branches/${id}`);
  return response.data;
};

const getAllBranchesForUsers = async (params) => {
  const response = await axiosClient.get("/branches", {
    params,
  });
  return response.data;
};

const createBranch = async (data) => {
  const response = await axiosClient.post("/admin/branches", data);
  return response.data;
};

const updateBranch = async (id, data) => {
  const response = await axiosClient.put(`/admin/branches/${id}`, data);
  return response.data;
};

const deleteBranch = async (id) => {
  const response = await axiosClient.delete(`/admin/branches/${id}`);
  return response.data;
};

const branchServices = {
  getAllBranches,
  getAllBranchesForUsers,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
};

export default branchServices;
