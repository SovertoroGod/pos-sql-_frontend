import axiosClient from "../../api/axiosClient";

const getAll = async (params) => {
  const response = await axiosClient.get("/admin/issue-items", { params });
  return response.data;
};

const getAllForManager = async (params) => {
  const response = await axiosClient.get("/manager/issue-items", { params });
  return response.data;
};

const createIssueItem = async (data) => {
  const response = await axiosClient.post("/issue-items", data);
  return response.data;
};

const issueItemServices = {
  getAll,
  getAllForManager,
  createIssueItem,
};

export default issueItemServices;
