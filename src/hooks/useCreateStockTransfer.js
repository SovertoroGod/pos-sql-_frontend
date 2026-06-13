import { useDispatch, useSelector } from "react-redux";
import { createStockTransfer } from "../modules/stockTransfer/stockTransferSlice";

const useCreateStockTransfer = () => {
  const dispatch = useDispatch();

  const { isLoading } = useSelector((state) => state.stockTransfer);

  const handleCreate = async (data) => {
    return dispatch(createStockTransfer(data));
  };

  return { handleCreate, isLoading };
};

export default useCreateStockTransfer;
