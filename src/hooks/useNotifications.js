import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
} from "../modules/notification/notificationSlice";

const useNotifications = (initialFilters = {}) => {
  const dispatch = useDispatch();

  const { notifications, unreadCount, metadata, isLoading } = useSelector(
    (state) => state.notification,
  );

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    is_read: "",
    type: "",
    ...initialFilters,
  });

  useEffect(() => {
    dispatch(getMyNotifications(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1,
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleMarkAsRead = useCallback(
    (id) => {
      dispatch(markAsRead(id));
    },
    [dispatch],
  );

  const handleMarkAllAsRead = useCallback(() => {
    dispatch(markAllAsRead());
  }, [dispatch]);

  const fetchNotifications = useCallback(
    (fetchFilters) => {
      dispatch(getMyNotifications(fetchFilters));
    },
    [dispatch],
  );

  return {
    notifications,
    unreadCount,
    metadata,
    isLoading,
    filters,
    handleFilterChange,
    handlePageChange,
    handleMarkAsRead,
    handleMarkAllAsRead,
    fetchNotifications,
  };
};

export default useNotifications;
