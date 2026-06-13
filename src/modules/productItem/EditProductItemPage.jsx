import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import useProductItemDetail from "../../hooks/useProductItemDetail";
import useUpdateProductItem from "../../hooks/useUpdateProductItem";
import { updateProductItem } from "./productItemSlice";
import Swal from "sweetalert2";
import {
  Package,
  Hash,
  Tag,
  DollarSign,
  CheckCircle,
  XCircle,
  Save,
  AlertCircle,
} from "lucide-react";
import StepNav from "../../components/StepNav";

const EditProductItemPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const productListId = searchParams.get("product_list_id") || "";
  const productListName = searchParams.get("product_list_name") || "";
  const navigate = useNavigate();
  const { selectedProductItem, isLoading } = useProductItemDetail(id);
  const { handleUpdate, isLoading: isUpdating } = useUpdateProductItem();
  const [form, setForm] = useState({
    sku: "",
    name: "",
    price: "",
    is_active: true,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedProductItem) {
      setForm({
        sku: selectedProductItem.sku || "",
        name: selectedProductItem.name || "",
        price: selectedProductItem.price ?? "",
        is_active:
          selectedProductItem.is_active !== undefined
            ? selectedProductItem.is_active
            : true,
      });
    }
  }, [selectedProductItem]);

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

  const validateForm = () => {
    const newErrors = {};
    if (!form.sku.trim()) {
      newErrors.sku = "SKU is required";
    }
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (
      form.price === "" ||
      isNaN(parseFloat(form.price)) ||
      parseFloat(form.price) < 0
    ) {
      newErrors.price = "Valid price is required";
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
        sku: form.sku.trim(),
        name: form.name.trim(),
        price: parseFloat(form.price),
        is_active: form.is_active,
      };
      const res = await handleUpdate(id, payload);
      if (updateProductItem.fulfilled.match(res)) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Product item updated successfully.",
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {
          navigate(
            `/admin/product-items?product_list_id=${productListId}&product_list_name=${encodeURIComponent(productListName)}`,
          );
        }, 1500);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: res.payload?.message || "Failed to update product item.",
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-flex items-center space-x-2">
                <svg
                  className="animate-spin h-6 w-6 text-emerald-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-gray-600 text-lg">
                  Loading product item data...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedProductItem) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Product Item Not Found
              </h3>
              <p className="text-gray-600 mb-4">
                The product item you're trying to edit doesn't exist.
              </p>
              <button
                onClick={() =>
                  navigate(
                    `/admin/product-items?product_list_id=${productListId}&product_list_name=${encodeURIComponent(productListName)}`,
                  )
                }
                className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Product Items
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
          <StepNav
            steps={[
              { label: "Product Lists", path: "/admin/product-lists" },
              {
                label: productListName || "Product Items",
                path: `/admin/product-items?product_list_id=${productListId}&product_list_name=${encodeURIComponent(productListName)}`,
              },
              { label: "Edit Item" },
            ]}
          />
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-blue-100 rounded-lg">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Edit Product Item
              </h1>
              <p className="text-gray-600 mt-1">
                Update product item information
                {productListName && (
                  <span>
                    {" "}
                    for <span className="font-medium text-gray-500">{productListName}</span>
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="sku"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    SKU
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Hash className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="sku"
                      name="sku"
                      value={form.sku}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                        errors.sku ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter SKU"
                    />
                  </div>
                  {errors.sku && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.sku}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
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
                      placeholder="Enter product item name"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="max-w-xs">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Price
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                      errors.price ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.price}
                  </p>
                )}
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
                  <label
                    htmlFor="is_active"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
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
                  Active product items are visible and available for use
                </p>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/admin/product-items?product_list_id=${productListId}&product_list_name=${encodeURIComponent(productListName)}`,
                    )
                  }
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
                      <svg
                        className="animate-spin h-4 w-4 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Product Item
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

export default EditProductItemPage;
