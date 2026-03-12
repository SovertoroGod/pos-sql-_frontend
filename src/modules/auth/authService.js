import axiosClient from "../../api/axiosClient";

const login = async (userData) => {
    const response = await axiosClient.post("/auth/login", userData);
    return response.data.data;
};

const authServices = {
    login
};

export default authServices;