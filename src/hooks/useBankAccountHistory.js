import { useState, useEffect, useCallback } from "react";
import bankAccountServices from "../modules/bankAccount/bankAccountService";

const useBankAccountHistory = (id, filters) => {
  const [account, setAccount] = useState(null);
  const [data, setData] = useState([]);
  const [aggregates, setAggregates] = useState([]);
  const [metadata, setMetadata] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await bankAccountServices.getBankAccountHistory(id, filters);
      setAccount(res.account || null);
      setData(res.data || []);
      setAggregates(res.aggregates || []);
      setMetadata(res._metadata || {});
    } catch (err) {
      console.error("Failed to fetch bank account history", err);
    } finally {
      setIsLoading(false);
    }
  }, [id, filters]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { account, data, aggregates, metadata, isLoading, refetch: fetchHistory };
};

export default useBankAccountHistory;
