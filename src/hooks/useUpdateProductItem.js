import { useDispatch, useSelector } from "react-redux";
import { updateProductItem } from "../modules/productItem/productItemSlice";

const useUpdateProductItem = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.productItem);

  const handleUpdate = (id, data) => {
    return dispatch(updateProductItem({ id, data }));
  };

  return { handleUpdate, isLoading };
};

export default useUpdateProductItem;
