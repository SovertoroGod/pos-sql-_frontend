import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllStockTransfersForManager } from "../modules/stockTransfer/stockTransferSlice";

const useManagerStockTransfers = () => {
  const dispatch = useDispatch();

  const { stockTransfers, metadata, isLoading } = useSelector(
    (state) => state.stockTransfer,
  );

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
    from_branch_id: "",
    to_branch_id: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    dispatch(getAllStockTransfersForManager(filters));
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

  return {
    stockTransfers,
    metadata,
    isLoading,
    filters,
    setFilters,
    handleFilterChange,
    handlePageChange,
  };
};

export default useManagerStockTransfers;
