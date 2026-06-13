import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductUnitById } from "../modules/productUnit/productUnitSlice";

const useProductUnitDetail = (id) => {
  const dispatch = useDispatch();
  const { selectedProductUnit, isLoading } = useSelector(
    (state) => state.productUnit,
  );

  useEffect(() => {
    if (id) {
      dispatch(getProductUnitById(id));
    }
  }, [dispatch, id]);

  return { selectedProductUnit, isLoading };
};

export default useProductUnitDetail;
