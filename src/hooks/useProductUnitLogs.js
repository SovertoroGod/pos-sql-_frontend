import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductUnitLogs } from "../modules/productUnitLog/productUnitLogSlice";

const useProductUnitLogs = () => {
  const dispatch = useDispatch();

  const { productUnitLogs, metadata, isLoading, message } = useSelector(
    (state) => state.productUnitLog,
  );

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    type: "",
    product_unit_id: "",
    from_branch_id: "",
    to_branch_id: "",
    created_by: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    dispatch(getAllProductUnitLogs(filters));
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

  useEffect(() => {
    if (message) {
      console.log("message from useProductUnitLogs:", message);
    }
  }, [message]);

  return {
    productUnitLogs,
    metadata,
    isLoading,
    filters,
    setFilters,
    handleFilterChange,
    handlePageChange,
  };
};

export default useProductUnitLogs;
