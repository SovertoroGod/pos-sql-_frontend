import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserById } from '../modules/users/userSlice';

const useUserDetail = (userId) => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.users);

  useEffect(() => {
    if (userId) {
      dispatch(getUserById(userId));
    }
  }, [dispatch, userId]);

  const isLoading = !selectedUser;

  return {
    selectedUser,
    isLoading,
  };
};

export default useUserDetail;
