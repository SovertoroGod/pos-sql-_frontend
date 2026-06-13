import axiosClient from "../../api/axiosClient";

const getAllStockTransfers = async (params) => {
  const response = await axiosClient.get("/admin/stock-transfers", { params });
  return response.data;
};

const getStockTransferById = async (id) => {
  const response = await axiosClient.get(`/admin/stock-transfers/${id}`);
  return response.data;
};

const createStockTransfer = async (data) => {
  const response = await axiosClient.post("/stock-transfers", data);
  return response.data;
};

const cancelStockTransfer = async (id) => {
  const response = await axiosClient.patch(`/stock-transfers/${id}/cancel`);
  return response.data;
};

const receiveStockTransfer = async (id) => {
  const response = await axiosClient.patch(`/stock-transfers/${id}/receive`);
  return response.data;
};

const stockTransferServices = {
  getAllStockTransfers,
  getStockTransferById,
  createStockTransfer,
  cancelStockTransfer,
  receiveStockTransfer,
};

export default stockTransferServices;
