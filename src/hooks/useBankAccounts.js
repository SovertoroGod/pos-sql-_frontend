import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllBankAccounts } from "../modules/bankAccount/bankAccountSlice";

const useBankAccounts = (filters) => {
  const dispatch = useDispatch();
  const { bankAccounts, metadata, isLoading } = useSelector(
    (state) => state.bankAccount
  );

  useEffect(() => {
    dispatch(getAllBankAccounts(filters));
  }, [dispatch, filters]);

  return { bankAccounts, metadata, isLoading };
};

export default useBankAccounts;