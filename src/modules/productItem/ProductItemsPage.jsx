import React, { useState, useEffect, useRef } from "react";
import {
  Package,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  Hash,
  Plus,
  Pencil,
  Layers,
  Building,
} from "lucide-react";
import useProductItems from "../../hooks/useProductItems";
import { useNavigate, useSearchParams } from "react-router-dom";
import StepNav from "../../components/StepNav";

const ProductItemsPage = () => {
  const [searchParams] = useSearchParams();
  const productListId = searchParams.get("product_list_id") || "";
  const productListName = searchParams.get("product_list_name") || "";
  const {
    productItems,
    metadata,
    isLoading,
    filters,
    handleFilterChange,
    handlePageChange,
  } = useProductItems(productListId);
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search);
  const debounceRef = useRef(null);

  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (searchInput !== filters.search) {
        handleFilterChange({ target: { name: "search", value: searchInput } });
      }
    }, 1000);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput]);

  const hasActiveFilters =
    filters.search ||
    filters.is_active ||
    filters.startDate ||
    filters.endDate;

  const clearFilters = () => {
    handleFilterChange({ target: { name: "search", value: "" } });
    handleFilterChange({ target: { name: "is_active", value: "" } });
    handleFilterChange({ target: { name: "startDate", value: "" } });
    handleFilterChange({ target: { name: "endDate", value: "" } });
  };

  const toggleFilters = () => setShowFilters(!showFilters);

  const getStatusBadge = (isActive) => {
    return isActive
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-red-100 text-red-700 border-red-200";
  };

  const formatPrice = (price) => {
    return Number(price).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <StepNav
          steps={[
            { label: "Product Lists", path: "/admin/product-lists" },
            { label: productListName || "Product Items" },
          ]}
        />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Package className="h-8 w-8 text-emerald-600" />
              Product Items
            </h1>
            <p className="text-gray-600 mt-2">
              Manage product items
              {productListName && (
                <span className="text-gray-400">
                  {" "}
                  for <span className="font-medium text-gray-500">{productListName}</span>
                </span>
              )}
            </p>
          </div>
          {productListId && (
            <button
              onClick={() =>
                navigate(
                  `/admin/product-items-create?product_list_id=${productListId}&product_list_name=${encodeURIComponent(productListName)}`,
                )
              }
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Add Product Item
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                name="search"
                placeholder="Search by name or SKU..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <button
            onClick={toggleFilters}
            className={`inline-flex items-center gap-2 px-4 py-3 rounded-lg border transition-all duration-200 ${
              showFilters
                ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                {
                  [
                    filters.search,
                    filters.is_active,
                    filters.startDate,
                    filters.endDate,
                  ].filter(Boolean).length
                }
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="is_active"
                  value={filters.is_active}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            {hasActiveFilters && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <XCircle className="h-4 w-4" />
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
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
                  Loading product items...
                </span>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      No.
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {productItems?.length > 0 ? (
                    productItems.map((item, index) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {(metadata?.currentPage - 1) * (metadata?.limit || 10) +
                            index +
                            1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 text-sm font-mono rounded">
                            <Hash className="h-3 w-3" />
                            {item.sku}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-gray-900">
                            <DollarSign className="h-3 w-3 text-emerald-500" />
                            {formatPrice(item.price)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(
                              item.is_active,
                            )}`}
                          >
                            {item.is_active ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 mr-1" />
                                Inactive
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(item.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/product-items-edit/${item.id}?product_list_id=${productListId}&product_list_name=${encodeURIComponent(productListName)}`,
                                )
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                              title={`Edit ${item.name}`}
                            >
                              <Pencil className="h-4 w-4" />
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/product-units?product_item_id=${item.id}&product_item_name=${encodeURIComponent(item.name)}&product_list_id=${productListId}&product_list_name=${encodeURIComponent(productListName)}`,
                                )
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors duration-200"
                              title={`Units of ${item.name}`}
                            >
                              <Building className="h-4 w-4" />
                              Units
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center">
                          <Package className="h-12 w-12 text-gray-300 mb-3" />
                          <p className="text-lg font-medium text-gray-900">
                            No product items found
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {productListId
                              ? "This product list has no items yet"
                              : "Try adjusting your filters"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {metadata?.totalPages > 1 && (
              <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing page {metadata?.currentPage || 1} of{" "}
                  {metadata?.totalPages || 1}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={metadata?.currentPage <= 1}
                    onClick={() =>
                      handlePageChange(metadata?.currentPage - 1)
                    }
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </button>
                  <button
                    disabled={metadata?.currentPage >= metadata?.totalPages}
                    onClick={() =>
                      handlePageChange(metadata?.currentPage + 1)
                    }
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductItemsPage;
