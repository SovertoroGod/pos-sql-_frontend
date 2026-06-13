import axiosClient from "../../api/axiosClient";

const getAllProductLists = async (params) => {
  const response = await axiosClient.get("/admin/product-lists", { params });
  return response.data;
};

const getProductListById = async (id) => {
  const response = await axiosClient.get(`/admin/product-lists/${id}`);
  return response.data;
};

const createProductList = async (data) => {
  const response = await axiosClient.post("/admin/product-lists", data);
  return response.data;
};

const updateProductList = async (id, data) => {
  const response = await axiosClient.put(`/admin/product-lists/${id}`, data);
  return response.data;
};

const deleteProductList = async (id) => {
  const response = await axiosClient.delete(`/admin/product-lists/${id}`);
  return response.data;
};

const productListServices = {
  getAllProductLists,
  getProductListById,
  createProductList,
  updateProductList,
  deleteProductList,
};

export default productListServices;
