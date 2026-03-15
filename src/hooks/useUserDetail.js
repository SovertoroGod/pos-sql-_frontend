import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllUsers,
  getUserById,
  updateUser,
} from "../modules/users/userSlice";
import { getAllBranches } from "../modules/branches/branchSlice";
import { useNavigate } from "react-router-dom";

const useUserDetail = (userId) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedUser } = useSelector((state) => state.users);
  const { branches } = useSelector((state) => state.branches);

  useEffect(() => {
    if (userId) {
      dispatch(getUserById(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    dispatch(getAllBranches());
  }, [dispatch]);

  useEffect(() => {
    if (selectedUser && branches.length > 0) {
      const found = branches.find(
        (b) => String(b.id) === String(selectedUser.branch_id),
      );
    }
  }, [selectedUser, branches]);

  const isLoading = !selectedUser;

const deactivateUser = async () => {
  const confirmDelete = window.confirm(
    "Are you sure want to deactivate this user?",
  );

  if (!confirmDelete) return;

  try {
    await dispatch(
      updateUser({
        id: selectedUser.id,
        data: { is_active: false },
      }),
    );

    navigate("/admin/users");
  } catch (error) {
    console.error("Deactivate error:", error);
  }
};


  return {
    selectedUser,
    isLoading,
    branches,
    deactivateUser,
  };
};

export default useUserDetail;
