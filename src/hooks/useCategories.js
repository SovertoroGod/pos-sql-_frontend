import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories } from "../modules/category/categorySlice";

const useCategories = () => {
  const dispatch = useDispatch();

  const { categories, metadata, isLoading, message } = useSelector(
    (state) => state.category
  );

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    type: "parent",
    is_active: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    dispatch(getAllCategories(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]:
        name === "is_active"
          ? value === ""
            ? ""
            : value === "true"
          : value,
      page: 1,
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  useEffect(() => {
    if (message) {
      console.log("message from useCategories:", message);
    }
  }, [message]);

  return {
    categories,
    metadata,
    isLoading,
    filters,

    setFilters,
    handleFilterChange,
    handlePageChange,
  };
};

export default useCategories;