import { useDispatch, useSelector } from "react-redux";
import { createProductItem } from "../modules/productItem/productItemSlice";

const useCreateProductItem = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.productItem);

  const handleCreate = (data) => {
    return dispatch(createProductItem(data));
  };

  return { handleCreate, isLoading };
};

export default useCreateProductItem;
