import { useDispatch, useSelector } from "react-redux";
import { createProductUnit } from "../modules/productUnit/productUnitSlice";

const useCreateProductUnit = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.productUnit);

  const handleCreate = (data) => {
    return dispatch(createProductUnit(data));
  };

  return { handleCreate, isLoading };
};

export default useCreateProductUnit;
