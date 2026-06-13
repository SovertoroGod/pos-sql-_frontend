import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductListById } from "../modules/productList/productListSlice";

const useProductListDetail = (id) => {
  const dispatch = useDispatch();
  const { selectedProductList, isLoading } = useSelector(
    (state) => state.productList,
  );

  useEffect(() => {
    if (id) {
      dispatch(getProductListById(id));
    }
  }, [dispatch, id]);

  return { selectedProductList, isLoading };
};

export default useProductListDetail;
