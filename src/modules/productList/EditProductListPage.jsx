import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import useProductListDetail from "../../hooks/useProductListDetail";
import useUpdateProductList from "../../hooks/useUpdateProductList";
import { getAllCategories } from "../category/categorySlice";
import { updateProductList } from "./productListSlice";
import Swal from "sweetalert2";
import {
  List,
  ArrowLeft,
  Tag,
  FileText,
  FolderTree,
  CheckCircle,
  XCircle,
  Save,
  AlertCircle,
  Layers,
} from "lucide-react";

const EditProductListPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedProductList } = useProductListDetail(id);
  const { handleUpdate, isLoading } = useUpdateProductList();
  const { categories } = useSelector((state) => state.category);
  const [selectedParent, setSelectedParent] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    subcategory_id: "",
    is_active: true,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!categories) {
      dispatch(getAllCategories());
    }
  }, [dispatch, categories]);

  useEffect(() => {
    if (selectedProductList && categories) {
      const currentCategory = categories.find(
        (c) => c.id === selectedProductList.category_id,
      );
      let parentId = "";
      let subId = "";
      if (currentCategory) {
        if (currentCategory.parent_id) {
          parentId = String(currentCategory.parent_id);
          subId = String(currentCategory.id);
        } else {
          parentId = String(currentCategory.id);
        }
      }
      setSelectedParent(parentId);
      setForm({
        name: selectedProductList.name || "",
        description: selectedProductList.description || "",
        subcategory_id: subId,
        is_active:
          selectedProductList.is_active !== undefined
            ? selectedProductList.is_active
            : true,
      });
    }
  }, [selectedProductList, categories]);

  const parentCategories = categories?.filter((c) => !c.parent_id) || [];
  const subCategories =
    categories?.filter((c) => c.parent_id === parseInt(selectedParent)) || [];

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

  const handleParentChange = (e) => {
    const { value } = e.target;
    setSelectedParent(value);
    setForm((prev) => ({ ...prev, subcategory_id: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) {
      newErrors.name = "Product list name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

    setIsSubmitting(true);

    try {
      const payload = {
        name: form.name,
        description: form.description || undefined,
        category_id: form.subcategory_id ? parseInt(form.subcategory_id) : null,
        is_active: form.is_active,
      };
      const res = await handleUpdate(id, payload);
      if (updateProductList.fulfilled.match(res)) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Product list updated successfully.",
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {
          navigate("/admin/product-lists");
        }, 1500);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: res.payload?.message || "Failed to update product list.",
          confirmButtonColor: "#16a34a",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error?.message || "An unexpected error occurred.",
        confirmButtonColor: "#16a34a",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/product-lists");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-flex items-center space-x-2">
                <svg className="animate-spin h-6 w-6 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-gray-600 text-lg">Loading product list data...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedProductList) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Product List Not Found</h3>
              <p className="text-gray-600 mb-4">The product list you're trying to edit doesn't exist.</p>
              <button
                onClick={() => navigate("/admin/product-lists")}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Product Lists
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Product Lists
          </button>
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-blue-100 rounded-lg">
              <List className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Product List</h1>
              <p className="text-gray-600 mt-1">Update product list information</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter product list name"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="parentCategory" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FolderTree className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="parentCategory"
                      value={selectedParent}
                      onChange={handleParentChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
                    >
                      <option value="">— Select Category —</option>
                      {parentCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="subcategory_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Layers className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="subcategory_id"
                    name="subcategory_id"
                    value={form.subcategory_id}
                    onChange={handleChange}
                    disabled={!selectedParent}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <option value="">— Select Subcategory —</option>
                    {subCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-start pt-2 pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                    placeholder="Enter description (optional)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={form.is_active}
                    onChange={handleChange}
                    className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="is_active" className="text-sm text-gray-700 cursor-pointer">
                    <span className="flex items-center">
                      {form.is_active ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-600 mr-2" />
                          Inactive
                        </>
                      )}
                    </span>
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Active product lists are visible and available for use
                </p>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Product List
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductListPage;
