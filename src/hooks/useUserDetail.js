import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserById } from '../modules/users/userSlice';
import { getAllBranches } from "../modules/branches/branchSlice";

const useUserDetail = (userId) => {
  const dispatch = useDispatch();
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
      // console.log("Found match:", found);
    }
  }, [selectedUser, branches]);

  const isLoading = !selectedUser;

  return {
    selectedUser,
    isLoading,
    branches,
  };
};

export default useUserDetail;
