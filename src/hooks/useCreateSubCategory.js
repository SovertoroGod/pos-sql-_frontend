import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createCategory } from "../modules/category/categorySlice";

const useCreateSubCategory = (parentId) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, categories } = useSelector((state) => state.category);

  const parentCategory = categories?.find(
    (c) => String(c.id) === String(parentId)
  );

  const [form, setForm] = useState({
    name: "",
    parent_id: parentId || "",
    description: "",
    is_active: true,
  });

  const [errors, setErrors] = useState({});

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

  const resetForm = () => {
    setForm({
      name: "",
      parent_id: parentId || "",
      description: "",
      is_active: true,
    });
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

    const result = await dispatch(createCategory(form));

    if (createCategory.fulfilled.match(result)) {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: result.payload?.message || "Subcategory created successfully",
        confirmButtonColor: "#22c55e",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => {
        navigate("/admin/categories");
      });
      resetForm();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: result.payload || "Failed to create subcategory",
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
    isLoading,
    parentCategory,
    handleChange,
    handleSubmit,
    handleCancel,
    resetForm,
  };
};

export default useCreateSubCategory;
