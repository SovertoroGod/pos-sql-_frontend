import axiosClient from "../../api/axiosClient";

const getManagerDashboard = async () => {
  const response = await axiosClient.get("/manager/dashboard");
  return response.data;
};

export default { getManagerDashboard };
