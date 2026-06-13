import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductItemById } from "../modules/productItem/productItemSlice";

const useProductItemDetail = (id) => {
  const dispatch = useDispatch();
  const { selectedProductItem, isLoading } = useSelector(
    (state) => state.productItem,
  );

  useEffect(() => {
    if (id) {
      dispatch(getProductItemById(id));
    }
  }, [dispatch, id]);

  return { selectedProductItem, isLoading };
};

export default useProductItemDetail;
