import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { getAllUsers, getUserById, setFilters } from "../modules/users/userSlice";
import { getAllBranches } from "../modules/branches/branchSlice";

const useUsers = () => {
  const dispatch = useDispatch();
  const { users, metadata, filters, isLoading, selectedUser } = useSelector(
    (state) => state.users,
  );
  const { branches } = useSelector((state) => state.branches);
  const [search, setSearch] = useState({
    full_name: "",
    username: "",
    email: "",
    role: "",
    is_active: "",
    startDate: "",
    endDate: "",
    branch_id: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Store previous search state to compare
  const [previousSearch, setPreviousSearch] = useState(search);

  useEffect(() => {
    dispatch(getAllBranches());
  }, [dispatch]);

  // Fetch users when filters change
  useEffect(() => {
    dispatch(getAllUsers(filters));
  }, [dispatch, filters]);
  useEffect(() => {
    if (selectedUser && branches.length > 0) {
      const found = branches.find(
        (b) => String(b.id) === String(selectedUser.branch_id),
      );
    }
  }, [selectedUser, branches]);

  // Debounced search with smart comparison
  // useEffect(() => {
  //   const delay = setTimeout(() => {
  //     // Check if search actually changed
  //     // const searchChanged =
  //     //   JSON.stringify(search) !== JSON.stringify(previousSearch);
  //     const searchChanged = Object.keys(search).some(
  //       (key) => search[key] !== previousSearch[key],
  //     );

  //     if (searchChanged) {
  //       dispatch(setFilters({ ...search, page: 1 }));
  //       setPreviousSearch(search);
  //     }
  //   }, 500);

  //   return () => clearTimeout(delay);
  // }, [search, previousSearch, dispatch]);

  // const handleSearch = (e) => {
  //   setSearch({
  //     ...search,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  const handleSearch = (e) => {
    const { name, value } = e.target;

    const newSearch = {
      ...search,
      [name]: value,
    };

    setSearch(newSearch);
    dispatch(setFilters({ ...newSearch, page: 1 }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    const reset = {
      full_name: "",
      username: "",
      email: "",
      role: "",
      is_active: "",
      startDate: "",
      endDate: "",
      branch_id: "",
    };

    setSearch(reset);
    dispatch(setFilters({ ...reset, page: 1 }));
  };

  const updateFilters = (name, value) => {
    dispatch(setFilters({ [name]: value, page: 1 }));
  };

  const changePage = (page) => {
    dispatch(setFilters({ page }));
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: "bg-red-100 text-red-700 border-red-200",
      manager: "bg-purple-100 text-purple-700 border-purple-200",
      cashier: "bg-green-100 text-green-700 border-green-200",
    };
    return colors[role] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const hasActiveFilters = Object.values(search).some(
    (value) => value.trim() !== "",
  );

  return {
    // Data
    users,
    metadata,
    filters,
    isLoading,

    // Search state
    search,
    showFilters,
    hasActiveFilters,

    // Actions
    handleSearch,
    changePage,
    toggleFilters,
    clearFilters,
    updateFilters,

    // Utilities
    getRoleBadgeColor,

    branches,
  };
};

export default useUsers;