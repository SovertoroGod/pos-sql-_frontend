import axiosClient from "../../api/axiosClient";

const getSubcategories = async () => {
  const response = await axiosClient.get("/branches/categories", {
    params: { type: "sub", limit: 100 },
  });
  return response.data;
};

const getProductLists = async (categoryId) => {
  const response = await axiosClient.get("/branches/product-lists", {
    params: { category_id: categoryId, limit: 100 },
  });
  return response.data;
};

const getProductItems = async (params) => {
  const response = await axiosClient.get("/branches/product-items", {
    params: { ...params, limit: 100 },
  });
  return response.data;
};

const getProductUnitsForBranch = async () => {
  const response = await axiosClient.get("/branches/product-units", {
    params: { limit: 1000 },
  });
  return response.data;
};

const getBankAccounts = async () => {
  const response = await axiosClient.get("/branches/bank-accounts");
  return response.data;
};

const findCustomers = async (phone) => {
  const response = await axiosClient.get("/branches/customers", {
    params: { phone, limit: 10 },
  });
  return response.data;
};

const createCustomer = async (data) => {
  const response = await axiosClient.post("/branches/customers", data);
  return response.data;
};

const searchCustomers = async (query) => {
  const response = await axiosClient.get("/branches/customers/search", {
    params: { q: query },
  });
  return response.data;
};

const createVoucher = async (data) => {
  const response = await axiosClient.post("/branches/vouchers", data);
  return response.data;
};

const getVouchers = async (params) => {
  const response = await axiosClient.get("/branches/vouchers", { params });
  return response.data;
};

const getVoucherById = async (id) => {
  const response = await axiosClient.get(`/branches/vouchers/${id}`);
  return response.data;
};

const getDebts = async (params) => {
  const response = await axiosClient.get("/branches/debts", { params });
  return response.data;
};

const getDebtById = async (id) => {
  const response = await axiosClient.get(`/branches/debts/${id}`);
  return response.data;
};

const repayDebt = async (id, data) => {
  const response = await axiosClient.post(`/branches/debts/${id}/repay`, data);
  return response.data;
};

const posService = {
  getSubcategories,
  getProductLists,
  getProductItems,
  getProductUnitsForBranch,
  getBankAccounts,
  findCustomers,
  searchCustomers,
  createCustomer,
  createVoucher,
  getVouchers,
  getVoucherById,
  getDebts,
  getDebtById,
  repayDebt,
};

export default posService;
