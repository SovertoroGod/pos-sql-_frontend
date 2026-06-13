import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardStats } from "../modules/adminDashboard/adminDashboardSlice";

const useAdminDashboard = () => {
  const dispatch = useDispatch();

  const { stats, isLoading, message } = useSelector(
    (state) => state.adminDashboard,
  );

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      console.log("message from useAdminDashboard:", message);
    }
  }, [message]);

  return { stats, isLoading };
};

export default useAdminDashboard;
