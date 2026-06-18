import { useState, useEffect, useCallback } from "react";
import bankAccountServices from "../modules/bankAccount/bankAccountService";

const useManagerBankAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [metadata, setMetadata] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
  });

  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await bankAccountServices.getBankAccountsForManager(filters);
      setAccounts(res.data || []);
      setMetadata(res._metadata || {});
    } catch (err) {
      console.error("Failed to fetch bank accounts", err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  return { accounts, metadata, isLoading, filters, handlePageChange };
};

export default useManagerBankAccounts;
