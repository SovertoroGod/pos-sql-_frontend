import { useState, useEffect } from "react";
import posService from "../modules/pos/posService";

const useCashierDashboard = () => {
  const [productUnits, setProductUnits] = useState([]);
  const [metadata, setMetadata] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    is_active: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const params = {};
        if (filters.page) params.page = filters.page;
        if (filters.limit) params.limit = filters.limit;
        if (filters.is_active !== "") params.is_active = filters.is_active;
        if (filters.startDate) params.startDate = filters.startDate;
        if (filters.endDate) params.endDate = filters.endDate;

        const res = await posService.getCashierProductUnits(params);
        setProductUnits(res.data || []);
        setMetadata(res._metadata || {});
      } catch {
        setProductUnits([]);
        setMetadata({});
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const clearFilters = () => {
    setFilters({ page: 1, limit: 10, is_active: "", startDate: "", endDate: "" });
  };

  const hasActiveFilters = filters.is_active || filters.startDate || filters.endDate;

  return {
    productUnits,
    metadata,
    isLoading,
    filters,
    hasActiveFilters,
    handleFilterChange,
    handlePageChange,
    clearFilters,
  };
};

export default useCashierDashboard;
