import axiosClient from "../../api/axiosClient";

const getAllBankAccounts = async (params) => {
  const response = await axiosClient.get("/admin/bank-accounts", { params });
  return response.data;
};

const getBankAccountById = async (id) => {
  const response = await axiosClient.get(`/admin/bank-accounts/${id}`);
  return response.data;
};

const createBankAccount = async (data) => {
  const response = await axiosClient.post("/admin/bank-accounts", data);
  return response.data;
};

const updateBankAccount = async (id, data) => {
  const response = await axiosClient.patch(`/admin/bank-accounts/${id}`, data);
  return response.data;
};

const getBankAccountHistory = async (id, params) => {
  const response = await axiosClient.get(`/admin/bank-accounts/${id}/history`, { params });
  return response.data;
};

const getBankAccountsForManager = async (params) => {
  const response = await axiosClient.get("/manager/bank-accounts", { params });
  return response.data;
};

const getBankAccountHistoryForManager = async (id, params) => {
  const response = await axiosClient.get(`/manager/bank-accounts/${id}/history`, { params });
  return response.data;
};

const bankAccountServices = {
  getAllBankAccounts,
  getBankAccountById,
  createBankAccount,
  updateBankAccount,
  getBankAccountHistory,
  getBankAccountsForManager,
  getBankAccountHistoryForManager,
};

export default bankAccountServices;