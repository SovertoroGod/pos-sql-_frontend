import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStockTransferById } from "../modules/stockTransfer/stockTransferSlice";

const useStockTransferDetail = (id) => {
  const dispatch = useDispatch();

  const { selectedTransfer, isLoading } = useSelector(
    (state) => state.stockTransfer,
  );

  useEffect(() => {
    if (id) {
      dispatch(getStockTransferById(id));
    }
  }, [dispatch, id]);

  return { selectedTransfer, isLoading };
};

export default useStockTransferDetail;
