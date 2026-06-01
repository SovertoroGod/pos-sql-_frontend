import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getCategoryById,
  getAllCategories,
  updateCategory,
  resetCategoryState,
} from "../modules/category/categorySlice";

const useUpdateSubCategory = (id) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedCategory, categories, isLoading } = useSelector(
    (state) => state.category
  );

  const [form, setForm] = useState({
    name: "",
    parent_id: "",
    description: "",
    is_active: true,
  });
  const [errors, setErrors] = useState({});
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    dispatch(getCategoryById(id));
    dispatch(getAllCategories());
    return () => {
      dispatch(resetCategoryState());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedCategory && selectedCategory.id === Number(id)) {
      setForm({
        name: selectedCategory.name || "",
        parent_id: selectedCategory.parent_id || "",
        description: selectedCategory.description || "",
        is_active: selectedCategory.is_active ?? true,
      });
      setIsFetching(false);
    }
  }, [selectedCategory, id]);

  const parentCategory = categories?.find(
    (c) => String(c.id) === String(form.parent_id)
  );

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) {
      newErrors.name = "Subcategory name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill in all required fields",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    const result = await dispatch(updateCategory({ id, data: form }));

    if (updateCategory.fulfilled.match(result)) {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: result.payload?.message || "Subcategory updated successfully",
        confirmButtonColor: "#22c55e",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => {
        navigate("/admin/categories");
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: result.payload || "Failed to update subcategory",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleCancel = () => {
    navigate("/admin/categories");
  };

  return {
    form,
    errors,
    isLoading: isLoading || isFetching,
    parentCategory,
    handleChange,
    handleSubmit,
    handleCancel,
  };
};

export default useUpdateSubCategory;
