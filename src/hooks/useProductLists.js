import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductLists } from "../modules/productList/productListSlice";

const useProductLists = () => {
  const dispatch = useDispatch();

  const { productLists, metadata, isLoading, message } = useSelector(
    (state) => state.productList,
  );

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    category_id: "",
    is_active: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    dispatch(getAllProductLists(filters));
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
      console.log("message from useProductLists:", message);
    }
  }, [message]);

  return {
    productLists,
    metadata,
    isLoading,
    filters,
    setFilters,
    handleFilterChange,
    handlePageChange,
  };
};

export default useProductLists;
