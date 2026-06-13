import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllBranchesForUser } from "../branches/branchSlice";
import useCreateProductUnit from "../../hooks/useCreateProductUnit";
import Swal from "sweetalert2";
import StepNav from "../../components/StepNav";
import {
  Package,
  ArrowLeft,
  Hash,
  Layers,
  Building,
  Save,
  ChevronDown,
  Search,
} from "lucide-react";

const CreateProductUnitPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const productItemId = searchParams.get("product_item_id") || "";
  const productItemName = searchParams.get("product_item_name") || "";
  const productListId = searchParams.get("product_list_id") || "";
  const productListName = searchParams.get("product_list_name") || "";
  const { handleCreate, isLoading } = useCreateProductUnit();
  const { branchesForUser } = useSelector((state) => state.branches);

  const [form, setForm] = useState({
    branch_id: "",
    quantity: "",
  });
  const [errors, setErrors] = useState({});
  const [branchSearch, setBranchSearch] = useState("");
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const branchDropdownRef = useRef(null);

  const selectedBranch = branchesForUser.find(
    (b) => String(b.id) === String(form.branch_id),
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(
        getAllBranchesForUser(branchSearch ? { search: branchSearch } : {}),
      );
    }, 300);
    return () => clearTimeout(timer);
  }, [dispatch, branchSearch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        branchDropdownRef.current &&
        !branchDropdownRef.current.contains(e.target)
      ) {
        setShowBranchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.branch_id) {
      newErrors.branch_id = "Branch is required";
    }
    if (
      form.quantity === "" ||
      isNaN(parseInt(form.quantity)) ||
      parseInt(form.quantity) < 0
    ) {
      newErrors.quantity = "Valid quantity is required";
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
        product_item_id: parseInt(productItemId),
        branch_id: parseInt(form.branch_id),
        quantity: parseInt(form.quantity),
      };
      const res = await handleCreate(payload);
      if (res.meta.requestStatus === "fulfilled") {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Product unit created successfully.",
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {
          navigate(
            `/admin/product-units?product_item_id=${productItemId}&product_item_name=${encodeURIComponent(productItemName)}&product_list_id=${productListId}&product_list_name=${encodeURIComponent(productListName)}`,
          );
        }, 1500);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: res.payload?.message || "Failed to create product unit.",
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

  const steps = [
    { label: "Product Lists", path: "/admin/product-lists" },
    {
      label: productListName || "Product Items",
      path: `/admin/product-items?product_list_id=${productListId}&product_list_name=${encodeURIComponent(productListName)}`,
    },
    {
      label: productItemName || "Product Units",
      path: `/admin/product-units?product_item_id=${productItemId}&product_item_name=${encodeURIComponent(productItemName)}&product_list_id=${productListId}&product_list_name=${encodeURIComponent(productListName)}`,
    },
    { label: "Create Unit" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <StepNav steps={steps} />
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-emerald-100 rounded-lg">
              <Package className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Create Product Unit
              </h1>
              <p className="text-gray-600 mt-1">
                Add stock for
                {productItemName && (
                  <span className="font-medium text-gray-500">
                    {" "}
                    {productItemName}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Item
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Layers className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={productItemName || `Item #${productItemId}`}
                    disabled
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div ref={branchDropdownRef} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowBranchDropdown(!showBranchDropdown)}
                  className={`w-full flex items-center justify-between px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    errors.branch_id ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-gray-400" />
                    {selectedBranch ? (
                      <span className="text-gray-900">
                        {selectedBranch.branch_name ||
                          selectedBranch.name ||
                          `Branch #${selectedBranch.id}`}
                        <span className="text-gray-400 ml-2 text-sm">
                          {selectedBranch.branch_code}
                        </span>
                      </span>
                    ) : (
                      <span className="text-gray-400">
                        Select a branch
                      </span>
                    )}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
                {errors.branch_id && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.branch_id}
                  </p>
                )}

                {showBranchDropdown && (
                  <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="p-2 border-b border-gray-100">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search branches..."
                          value={branchSearch}
                          onChange={(e) => setBranchSearch(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {branchesForUser.length > 0 ? (
                        branchesForUser.map((branch) => (
                          <button
                            key={branch.id}
                            type="button"
                            onClick={() => {
                              setForm((prev) => ({
                                ...prev,
                                branch_id: String(branch.id),
                              }));
                              setErrors((prev) => ({
                                ...prev,
                                branch_id: "",
                              }));
                              setShowBranchDropdown(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-emerald-50 transition-colors text-left ${
                              String(branch.id) === String(form.branch_id)
                                ? "bg-emerald-50 text-emerald-700"
                                : "text-gray-700"
                            }`}
                          >
                            <Building className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="font-medium">
                                {branch.branch_name || branch.name}
                              </p>
                              {branch.branch_code && (
                                <p className="text-xs text-gray-400">
                                  {branch.branch_code}
                                </p>
                              )}
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-6 text-center text-sm text-gray-400">
                          No branches found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="max-w-xs">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Quantity
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Hash className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="quantity"
                    id="quantity"
                    min="0"
                    value={form.quantity}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                      errors.quantity ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="0"
                  />
                </div>
                {errors.quantity && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.quantity}
                  </p>
                )}
              </div>

              <div className="pt-6 border-t border-gray-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/admin/product-units?product_item_id=${productItemId}&product_item_name=${encodeURIComponent(productItemName)}&product_list_id=${productListId}&product_list_name=${encodeURIComponent(productListName)}`,
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
                      Create Product Unit
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

export default CreateProductUnitPage;
