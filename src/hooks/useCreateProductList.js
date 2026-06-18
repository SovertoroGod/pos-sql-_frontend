import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProductList } from "../modules/productList/productListSlice";
import { getAllCategories } from "../modules/category/categorySlice";

const useCreateProductList = () => {
  const dispatch = useDispatch();
  const { isLoading, message } = useSelector((state) => state.productList);
  const { categories } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(getAllCategories({ limit: 99999 }));
  }, [dispatch]);

  const handleCreate = (data) => {
    return dispatch(createProductList(data));
  };

  return { handleCreate, isLoading, message, categories };
};

export default useCreateProductList;
