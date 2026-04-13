import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import { getAllBranches } from "../modules/branches/branchSlice";
import { createUser } from "../modules/users/userSlice";
const useCreateUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading } = useSelector((state) => state.users);
    const { branches } = useSelector((state) => state.branches);
    const [form, setForm] = useState({
        full_name: "",
        username: "",
        email: "",
        password: "",
        role: "",
        branch_id: ""
    }); 
    useEffect(() => {
        dispatch(getAllBranches());
    }, [dispatch]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(createUser(form));
            navigate("/admin/users")
        } catch (error) {
            console.error("Create user error:",error)
        }
    };
    return {
        form,
        branches,
        isLoading,
        handleChange,
        handleSubmit,
        navigate
    }
}

export default useCreateUser;