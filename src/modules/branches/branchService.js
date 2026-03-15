import axiosClient from "../../api/axiosClient";

const getAllBranches = async () => {
  const response = await axiosClient.get("/admin/getAllBranches");
  return response.data;
};

const branchServices = {
  getAllBranches,
};

export default branchServices;
