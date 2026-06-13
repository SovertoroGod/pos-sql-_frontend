import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductItems } from "../modules/productItem/productItemSlice";

const useProductItems = (initialProductListId) => {
  const dispatch = useDispatch();

  const { productItems, metadata, isLoading, message } = useSelector(
    (state) => state.productItem,
  );

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    product_list_id: initialProductListId || "",
    is_active: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    dispatch(getAllProductItems(filters));
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
      console.log("message from useProductItems:", message);
    }
  }, [message]);

  return {
    productItems,
    metadata,
    isLoading,
    filters,
    setFilters,
    handleFilterChange,
    handlePageChange,
  };
};

export default useProductItems;
