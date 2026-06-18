import { useDispatch, useSelector } from "react-redux";
import { getBankAccountById } from "../modules/bankAccount/bankAccountSlice";
import { useEffect } from "react";

const useBankAccountDetail = (id) => {
  const dispatch = useDispatch();
  const { selectedBankAccount, isLoading } = useSelector((state) => state.bankAccount);
  useEffect(() => {
    if (id) {
      dispatch(getBankAccountById(id));
    }
  }, [dispatch, id]);
  return { selectedBankAccount, isLoading };
};

export default useBankAccountDetail;