import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllIssueItems } from "../modules/issueItem/issueItemSlice";

const useIssueItems = () => {
  const dispatch = useDispatch();

  const { issueItems, metadata, isLoading } = useSelector(
    (state) => state.issueItem,
  );

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    from_branch_id: "",
    product_item_id: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    dispatch(getAllIssueItems(filters));
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
    issueItems,
    metadata,
    isLoading,
    filters,
    setFilters,
    handleFilterChange,
    handlePageChange,
  };
};

export default useIssueItems;
