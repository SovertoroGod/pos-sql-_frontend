import axiosClient from "../../api/axiosClient";

const getAllProductUnitLogs = async (params) => {
  const response = await axiosClient.get("/admin/product-unit-logs", { params });
  return response.data;
};

const productUnitLogServices = {
  getAllProductUnitLogs,
};

export default productUnitLogServices;
