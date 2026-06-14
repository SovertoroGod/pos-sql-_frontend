import axiosClient from "../../api/axiosClient";

const getAllProductUnits = async (params) => {
  const response = await axiosClient.get("/admin/product-units", { params });
  return response.data;
};

const getAllProductUnitsForManager = async (params) => {
  const response = await axiosClient.get("/manager/product-units", { params });
  return response.data;
};

const createProductUnit = async (data) => {
  const response = await axiosClient.post("/admin/product-units", data);
  return response.data;
};

const getProductUnitById = async (id) => {
  const response = await axiosClient.get(`/admin/product-units/${id}`);
  return response.data;
};

const updateProductUnit = async (id, data) => {
  const response = await axiosClient.patch(`/admin/product-units/${id}`, data);
  return response.data;
};

const productUnitServices = {
  getAllProductUnits,
  getAllProductUnitsForManager,
  createProductUnit,
  getProductUnitById,
  updateProductUnit,
};

export default productUnitServices;
