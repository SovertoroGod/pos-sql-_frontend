import { useDispatch, useSelector } from "react-redux";
import { createBankAccount } from "../modules/bankAccount/bankAccountSlice";

const useBankAccountCreate = () => {
  const dispatch = useDispatch();
  const { isLoading, message } = useSelector((state) => state.bankAccount);
  const handleCreate = (data) => {
    return dispatch(createBankAccount(data));
  };
  return { handleCreate, isLoading, message };
};

export default useBankAccountCreate;