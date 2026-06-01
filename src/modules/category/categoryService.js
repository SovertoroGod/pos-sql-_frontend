import axiosClient from "../../api/axiosClient"

const createCategory = async (data) => {
    const response = await axiosClient.post("/admin/categories", data);
    return response.data;
}

const getAllCategories = async (params) => {
  const response = await axiosClient.get("/admin/categories", { params });
  return response.data;
};

const getCategoryId = async (id) => {
  const response = await axiosClient.get(`/admin/categories/${id}`);
  return response.data;
};

const updateCategory = async (id, data) => {
  const response = await axiosClient.patch(`/admin/categories/${id}`, data);
  return response.data;
};

const categoryServices = {
  createCategory,
  getAllCategories,
  getCategoryId,
  updateCategory,
};

export default categoryServices;