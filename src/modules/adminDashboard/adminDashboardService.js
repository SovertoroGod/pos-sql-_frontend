import axiosClient from "../../api/axiosClient";

const getDashboardStats = async () => {
  const response = await axiosClient.get("/admin/dashboard/stats");
  return response.data;
};

export default { getDashboardStats };
