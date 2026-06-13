import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getManagerDashboard } from "../modules/managerDashboard/managerDashboardSlice";

const useManagerDashboard = () => {
  const dispatch = useDispatch();

  const { stats, isLoading } = useSelector(
    (state) => state.managerDashboard,
  );

  useEffect(() => {
    dispatch(getManagerDashboard());
  }, [dispatch]);

  return { stats, isLoading };
};

export default useManagerDashboard;
