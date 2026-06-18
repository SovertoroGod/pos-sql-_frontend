import axiosClient from "../../api/axiosClient";

const getVouchers = async (params) => {
  const response = await axiosClient.get("/manager/vouchers", { params });
  return response.data;
};

const getVoucherById = async (id) => {
  const response = await axiosClient.get(`/manager/vouchers/${id}`);
  return response.data;
};

const cancelVoucher = async (id, reason) => {
  const response = await axiosClient.post(`/manager/vouchers/${id}/cancel`, { reason });
  return response.data;
};

const voucherService = { getVouchers, getVoucherById, cancelVoucher };

export default voucherService;
