import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useCreateProductItem from "../../hooks/useCreateProductItem";
import Swal from "sweetalert2";
import {
  Package,
  Hash,
  Tag,
  DollarSign,
  Save,
} from "lucide-react";
import StepNav from "../../components/StepNav";

const CreateProductItemPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productListId = searchParams.get("product_list_id") || "";
  const productListName = searchParams.get("product_list_name") || "";
  const { handleCreate, isLoading } = useCreateProductItem();
  const [form, setForm] = useState({
    sku: "",
    name: "",
    price: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
    if (!form.price || isNaN(parseFloat(form.price)) || parseFloat(form.price) < 0) {
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

    try {
      const payload = {
        product_list_id: parseInt(productListId),
        sku: form.sku.trim(),
        name: form.name.trim(),
        price: parseFloat(form.price),
      };
      const res = await handleCreate(payload);
      if (res.meta.requestStatus === "fulfilled") {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Product item created successfully.",
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
          text: res.payload?.message || "Failed to create product item.",
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
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <StepNav
            steps={[
              { label: "Product Lists", path: "/admin/product-lists" },
              {
                label: productListName || "Product Items",
                path: `/admin/product-items?product_list_id=${productListId}&product_list_name=${encodeURIComponent(productListName)}`,
              },
              { label: "Create Item" },
            ]}
          />
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-emerald-100 rounded-lg">
              <Package className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Create Product Item
              </h1>
              <p className="text-gray-600 mt-1">
                Add a new product item
                {productListName && (
                  <span>
                    {" "}
                    to <span className="font-medium text-gray-500">{productListName}</span>
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
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Hash className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="sku"
                      id="sku"
                      value={form.sku}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                        errors.sku ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="e.g. PROD-001"
                    />
                  </div>
                  {errors.sku && (
                    <p className="mt-1 text-sm text-red-600">{errors.sku}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={form.name}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="e.g. Wireless Mouse"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
              </div>

              <div className="max-w-xs">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="price"
                    id="price"
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
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>

              <div className="pt-6 border-t border-gray-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/admin/product-items?product_list_id=${productListId}&product_list_name=${encodeURIComponent(productListName)}`,
                    )
                  }
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Product Item
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

export default CreateProductItemPage;
