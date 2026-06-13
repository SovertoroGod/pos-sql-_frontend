import axiosClient from "../../api/axiosClient";

const getAllProductItems = async (params) => {
  const response = await axiosClient.get("/admin/product-items", { params });
  return response.data;
};

const createProductItem = async (data) => {
  const response = await axiosClient.post("/admin/product-items", data);
  return response.data;
};

const getProductItemById = async (id) => {
  const response = await axiosClient.get(`/admin/product-items/${id}`);
  return response.data;
};

const updateProductItem = async (id, data) => {
  const response = await axiosClient.put(`/admin/product-items/${id}`, data);
  return response.data;
};

const productItemServices = {
  getAllProductItems,
  createProductItem,
  getProductItemById,
  updateProductItem,
};

export default productItemServices;
