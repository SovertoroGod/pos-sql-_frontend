import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserById, updateUser } from '../modules/users/userSlice';
import { getAllBranchesForUser } from "../modules/branches/branchSlice";

const useEditUser = (userId) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedUser, isLoading } = useSelector((state) => state.users);
  const { branchesForUser } = useSelector((state) => state.branches);
  const [branchSearch, setBranchSearch] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    username: "",
    email: "",
    role: "",
    branch_id: "",
    is_active: true,
  });

  // Fetch user data when component mounts or userId changes
  useEffect(() => {
    if (userId) {
      dispatch(getUserById(userId));
    }
  }, [dispatch, userId]);

  // Update form when selectedUser data is available
  useEffect(() => {
    if (selectedUser) {
      setForm({
        ...selectedUser,
        role: selectedUser.role?.toLowerCase() || "",
        is_active: Boolean(selectedUser.is_active),
      });
    }
  }, [selectedUser]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(
        getAllBranchesForUser(branchSearch ? { search: branchSearch } : {}),
      );
    }, 300);
    return () => clearTimeout(timer);
  }, [dispatch, branchSearch]);

  // Handle form input changes
  const handleChange = (e) => {
const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "is_active" ? value === "true" : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(
        updateUser({ id: userId, data: form }),
      ).unwrap();
      return { success: true, data: result };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: error.message || error };
    }
  };

  // Navigate back to user detail
  const handleCancel = () => {
    navigate(`/admin/users/${userId}`);
  };

  // Reset form to initial state
  const resetForm = () => {
    setForm({
      full_name: "",
      username: "",
      email: "",
      role: "",
      branch_id: "",
      is_active: true,
    });
  };

  return {
    // Data
    selectedUser,
    form,
    isLoading,
    branchesForUser,
    branchSearch,
    setBranchSearch,

    // Actions
    handleChange,
    handleSubmit,
    handleCancel,
    resetForm,
  };
};

export default useEditUser