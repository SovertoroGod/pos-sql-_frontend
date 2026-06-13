import { useDispatch, useSelector } from "react-redux";
import { cancelStockTransfer } from "../modules/stockTransfer/stockTransferSlice";

const useCancelStockTransfer = () => {
  const dispatch = useDispatch();
  const { actionLoading } = useSelector((state) => state.stockTransfer);

  const handleCancel = (id) => {
    return dispatch(cancelStockTransfer(id));
  };

  return { handleCancel, isCancelling: actionLoading };
};

export default useCancelStockTransfer;
