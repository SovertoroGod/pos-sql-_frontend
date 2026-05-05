import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import { getAllBranchesForUser } from "../modules/branches/branchSlice";
import { createUser } from "../modules/users/userSlice";
const useCreateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.users);
  const { branchesForUser } = useSelector((state) => state.branches);
  const [branchSearch, setBranchSearch] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    role: "",
    branch_id: "",
  });
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(
        getAllBranchesForUser(branchSearch ? { search: branchSearch } : {}),
      );
    }, 300);
    return () => clearTimeout(timer);
  }, [dispatch, branchSearch]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createUser(form));
      navigate("/admin/users");
    } catch (error) {
      console.error("Create user error:", error);
    }
  };
  return {
    form,
    branchesForUser,
    isLoading,
    handleChange,
    handleSubmit,
    navigate,
    branchSearch,
    setBranchSearch,
  };
};

export default useCreateUser;