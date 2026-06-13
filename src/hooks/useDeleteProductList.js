import { useDispatch, useSelector } from "react-redux";
import { deleteProductList } from "../modules/productList/productListSlice";

const useDeleteProductList = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.productList);

  const handleDelete = (id) => {
    return dispatch(deleteProductList(id));
  };

  return { handleDelete, isLoading };
};

export default useDeleteProductList;
