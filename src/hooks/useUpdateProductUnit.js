import { useDispatch, useSelector } from "react-redux";
import { updateProductUnit } from "../modules/productUnit/productUnitSlice";

const useUpdateProductUnit = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.productUnit);

  const handleUpdate = (id, data) => {
    return dispatch(updateProductUnit({ id, data }));
  };

  return { handleUpdate, isLoading };
};

export default useUpdateProductUnit;
