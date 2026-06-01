import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategoryById, getSubcategoriesByParentId } from "../modules/category/categorySlice";

const useCategoryDetail = (id) => {
  const dispatch = useDispatch();
  const { selectedCategory, subcategories, message, isLoading } = useSelector(
    (state) => state.category,
  );

  useEffect(() => {
    if (id) {
      dispatch(getCategoryById(id));
      dispatch(getSubcategoriesByParentId(id));
    }
  }, [dispatch, id]);

  return {
    selectedCategory,
    subcategories,
    message,
    isLoading,
  };
};

export default useCategoryDetail;
