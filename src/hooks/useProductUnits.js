import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductUnits } from "../modules/productUnit/productUnitSlice";

const useProductUnits = (initialProductItemId, initialBranchId) => {
  const dispatch = useDispatch();

  const { productUnits, metadata, isLoading, message } = useSelector(
    (state) => state.productUnit,
  );

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    product_item_id: initialProductItemId || "",
    branch_id: initialBranchId || "",
    is_active: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    dispatch(getAllProductUnits(filters));
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
      console.log("message from useProductUnits:", message);
    }
  }, [message]);

  return {
    productUnits,
    metadata,
    isLoading,
    filters,
    setFilters,
    handleFilterChange,
    handlePageChange,
  };
};

export default useProductUnits;
