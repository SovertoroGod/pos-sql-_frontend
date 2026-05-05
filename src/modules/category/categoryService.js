import axiosClient from "../../api/axiosClient"

const createCategory = async (data) => {
    const response = await axiosClient.post("/admin/categories", data);
    return response.data;
}

const categoryServices = {
    createCategory
}

export default categoryServices;