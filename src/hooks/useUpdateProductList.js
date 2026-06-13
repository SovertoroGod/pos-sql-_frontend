import { useDispatch, useSelector } from "react-redux";
import { updateProductList } from "../modules/productList/productListSlice";

const useUpdateProductList = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.productList);

  const handleUpdate = (id, data) => {
    return dispatch(updateProductList({ id, data }));
  };

  return { handleUpdate, isLoading };
};

export default useUpdateProductList;
