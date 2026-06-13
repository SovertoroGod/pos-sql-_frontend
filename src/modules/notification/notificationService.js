import axiosClient from "../../api/axiosClient";

const getMyNotifications = async (params) => {
  const response = await axiosClient.get("/notifications", { params });
  return response.data;
};

const markAsRead = async (id) => {
  const response = await axiosClient.patch(`/notifications/${id}/read`);
  return response.data;
};

const markAllAsRead = async () => {
  const response = await axiosClient.patch("/notifications/read-all");
  return response.data;
};

const notificationServices = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
};

export default notificationServices;
