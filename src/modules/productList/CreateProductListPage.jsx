import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCreateProductList from "../../hooks/useCreateProductList";
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
  Layers,
} from "lucide-react";

const CreateProductListPage = () => {
  const navigate = useNavigate();
  const { handleCreate, isLoading, message, categories } = useCreateProductList();
  const [selectedParent, setSelectedParent] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    subcategory_id: "",
    is_active: true,
  });

  const parentCategories = categories?.filter((c) => !c.parent_id) || [];
  const subCategories = categories?.filter((c) => c.parent_id === parseInt(selectedParent)) || [];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleParentChange = (e) => {
    const { value } = e.target;
    setSelectedParent(value);
    setForm((prev) => ({ ...prev, subcategory_id: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description || undefined,
      category_id: form.subcategory_id || undefined,
      is_active: form.is_active,
    };
    const res = await handleCreate(payload);
    if (res.meta.requestStatus === "fulfilled") {
      Swal.fire({
        title: "Success!",
        text: "Product list created successfully.",
        icon: "success",
        confirmButtonColor: "#16a34a",
      });
      navigate("/admin/product-lists");
    } else {
      Swal.fire({
        title: "Error!",
        text: res.payload || message || "Failed to create product list.",
        icon: "error",
        confirmButtonColor: "#e3342f",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/admin/product-lists")}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Product Lists
          </button>
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-emerald-100 rounded-lg">
              <List className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create Product List</h1>
              <p className="text-gray-600 mt-1">Add a new product list to your system</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
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
                      required
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      placeholder="e.g. Summer Collection"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="parentCategory" className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white"
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
                <label htmlFor="subcategory_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Layers className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="subcategory_id"
                    id="subcategory_id"
                    value={form.subcategory_id}
                    onChange={handleChange}
                    disabled={!selectedParent}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white disabled:bg-gray-100 disabled:text-gray-400"
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
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-start pt-2 pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    name="description"
                    id="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm resize-none"
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

              <div className="pt-6 border-t border-gray-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate("/admin/product-lists")}
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
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Product List
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

export default CreateProductListPage;
