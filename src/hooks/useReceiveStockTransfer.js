import { useDispatch, useSelector } from "react-redux";
import { receiveStockTransfer } from "../modules/stockTransfer/stockTransferSlice";

const useReceiveStockTransfer = () => {
  const dispatch = useDispatch();
  const { actionLoading } = useSelector((state) => state.stockTransfer);

  const handleReceive = (id) => {
    return dispatch(receiveStockTransfer(id));
  };

  return { handleReceive, isReceiving: actionLoading };
};

export default useReceiveStockTransfer;
