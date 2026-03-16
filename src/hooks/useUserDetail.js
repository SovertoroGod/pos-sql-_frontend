import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../modules/users/userSlice";
import { getAllBranches } from "../modules/branches/branchSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You want to deactivate this user?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, deactivate!",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  try {
    const result = await dispatch(deleteUser(selectedUser.id));

    // Check if the action was rejected
    if (deleteUser.rejected.match(result)) {
      throw new Error(result.payload || "User not exit or deactivated");
    }

    await Swal.fire({
      title: "Deactivated!",
      text: "User has been deactivated successfully.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });

    navigate(`/admin/users`);
  } catch (error) {
    // Show the actual error message from backend response
    console.log(error, "hehehe from deactivate");
    const errorMessage = "User not exit or deactivated";

    await Swal.fire({
      title: "Error!",
      text: errorMessage,
      icon: "error",
      confirmButtonColor: "#ef4444",
    });
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
