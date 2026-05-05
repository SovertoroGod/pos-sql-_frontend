import { useDispatch, useSelector } from "react-redux";
import { createCategory, resetCategoryState } from "../modules/category/categorySlice";
import { useEffect } from "react";

const useCreateCategory = () => {
    const dispatch = useDispatch();
    const { isLoading, categories } = useSelector((state) => state.category);
    
    const handleCreateCategory = async (data, onSuccess) => {
        const result = await dispatch(createCategory(data));
        if (createCategory.fulfilled.match(result)) {
            const res = result.payload;
            if (onSuccess) onSuccess(res.data);
        }
        return result;
    };
    
    useEffect(() => {
        return () => {
            dispatch(resetCategoryState());
        };
    }, [dispatch]);
    
    return { handleCreateCategory, isLoading, categories };
};

export default useCreateCategory;