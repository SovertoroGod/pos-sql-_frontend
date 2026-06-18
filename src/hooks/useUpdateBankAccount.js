import { useDispatch, useSelector } from "react-redux";
import { updateBankAccount } from "../modules/bankAccount/bankAccountSlice";

const useUpdateBankAccount = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.bankAccount);
  const handleUpdate = (id, data) => {
    return dispatch(updateBankAccount({ id, data }));
  };
  return { handleUpdate, isLoading };
};

export default useUpdateBankAccount;