import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useCreateStockTransfer from "../../hooks/useCreateStockTransfer";
import { useSelector, useDispatch } from "react-redux";
import { getAllBranches } from "../branches/branchSlice";
import axiosClient from "../../api/axiosClient";
import { ArrowLeftRight, ArrowLeft, Save, Package, Building, Hash } from "lucide-react";
import Swal from "sweetalert2";

const CreateStockTransferPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { handleCreate, isLoading } = useCreateStockTransfer();
  const { branches } = useSelector((state) => state.branches);

  const [form, setForm] = useState({
    product_item_id: "",
    from_branch_id: "",
    to_branch_id: "",
    quantity: "",
    notes: "",
  });

  const [productSearch, setProductSearch] = useState("");
  const [productResults, setProductResults] = useState([]);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const productDropdownRef = useRef(null);

  useEffect(() => {
    dispatch(getAllBranches());
  }, [dispatch]);

  useEffect(() => {
    if (!productSearch || productSearch.length < 2) {
      setProductResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await axiosClient.get("/admin/product-items", {
          params: { search: productSearch, limit: 10 },
        });
        setProductResults(res.data.data || []);
        setShowProductDropdown(true);
      } catch (err) {
        setProductResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [productSearch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        productDropdownRef.current &&
        !productDropdownRef.current.contains(e.target)
      ) {
        setShowProductDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProductSelect = (item) => {
    setSelectedProduct(item);
    setForm({ ...form, product_item_id: item.id });
    setProductSearch(item.name);
    setShowProductDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.from_branch_id === form.to_branch_id) {
      Swal.fire({
        title: "Validation Error",
        text: "Source and destination branches must be different.",
        icon: "warning",
        confirmButtonColor: "#f97316",
      });
      return;
    }

    const res = await handleCreate(form);
    if (res.meta.requestStatus === "fulfilled") {
      Swal.fire({
        title: "Success!",
        text: "Stock transfer initiated successfully.",
        icon: "success",
        confirmButtonColor: "#16a34a",
      });
      navigate("/admin/stock-transfers");
    } else {
      Swal.fire({
        title: "Error!",
        text: res.payload || "Failed to initiate stock transfer.",
        icon: "error",
        confirmButtonColor: "#e3342f",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/admin/stock-transfers")}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Transfers
          </button>
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-orange-100 rounded-lg">
              <ArrowLeftRight className="h-8 w-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Initiate Stock Transfer
              </h1>
              <p className="text-gray-600 mt-1">
                Transfer stock between branches
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Item */}
              <div ref={productDropdownRef} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Item <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Package className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value);
                      setSelectedProduct(null);
                      setForm({ ...form, product_item_id: "" });
                    }}
                    onFocus={() =>
                      productResults.length > 0 && setShowProductDropdown(true)
                    }
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Search product by name or SKU..."
                  />
                </div>
                {showProductDropdown && productResults.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {productResults.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleProductSelect(item)}
                        className="w-full px-4 py-3 text-left hover:bg-orange-50 flex items-center justify-between border-b border-gray-100 last:border-0"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500 font-mono">
                            SKU: {item.sku}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400">
                          Price: {item.price}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                {selectedProduct && (
                  <p className="mt-1 text-sm text-green-600">
                    Selected: {selectedProduct.name} ({selectedProduct.sku})
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* From Branch */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Branch <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="from_branch_id"
                      value={form.from_branch_id}
                      onChange={handleChange}
                      required
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    >
                      <option value="">Select source branch</option>
                      {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.branch_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* To Branch */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Branch <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="to_branch_id"
                      value={form.to_branch_id}
                      onChange={handleChange}
                      required
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    >
                      <option value="">Select destination branch</option>
                      {branches
                        .filter(
                          (b) => String(b.id) !== String(form.from_branch_id),
                        )
                        .map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.branch_name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Hash className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    required
                    min="1"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Number of units to transfer"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={3}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Optional notes for this transfer"
                />
              </div>

              {/* Form Actions */}
              <div className="pt-6 border-t border-gray-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate("/admin/stock-transfers")}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !form.product_item_id}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
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
                      Initiating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Initiate Transfer
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

export default CreateStockTransferPage;
