import React from "react";
import {
  History,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Package,
  Building,
  User,
  ArrowRight,
} from "lucide-react";
import useProductUnitLogs from "../../hooks/useProductUnitLogs";

const LOG_TYPES = [
  { value: "", label: "All Types" },
  { value: "initial", label: "Initial" },
  { value: "transfer_out", label: "Transfer Out" },
  { value: "transfer_in", label: "Transfer In" },
  { value: "sold", label: "Sold" },
  { value: "issue", label: "Issue" },
  { value: "adjustment", label: "Adjustment" },
  { value: "return", label: "Return" },
];

const typeStyles = {
  initial: "bg-blue-100 text-blue-700 border-blue-200",
  transfer_out: "bg-orange-100 text-orange-700 border-orange-200",
  transfer_in: "bg-emerald-100 text-emerald-700 border-emerald-200",
  sold: "bg-red-100 text-red-700 border-red-200",
  issue: "bg-purple-100 text-purple-700 border-purple-200",
  adjustment: "bg-yellow-100 text-yellow-700 border-yellow-200",
  return: "bg-cyan-100 text-cyan-700 border-cyan-200",
};

const ProductUnitLogsPage = () => {
  const {
    productUnitLogs,
    metadata,
    isLoading,
    filters,
    handleFilterChange,
    handlePageChange,
  } = useProductUnitLogs();

  const hasActiveFilters =
    filters.type ||
    filters.startDate ||
    filters.endDate;

  const clearFilters = () => {
    handleFilterChange({ target: { name: "type", value: "" } });
    handleFilterChange({ target: { name: "startDate", value: "" } });
    handleFilterChange({ target: { name: "endDate", value: "" } });
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <History className="h-8 w-8 text-indigo-600" />
              Product Unit Logs
            </h1>
            <p className="text-gray-600 mt-2">
              Track stock movements and changes across branches
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Log Type
            </label>
            <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {LOG_TYPES.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
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
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                  Clear Filters
                </button>
              </div>
            )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-flex items-center space-x-2">
                <svg
                  className="animate-spin h-6 w-6 text-indigo-600"
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="text-gray-600 text-lg">
                  Loading product unit logs...
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
                      Product Item
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Branch
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Stock Change
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Created By
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {productUnitLogs?.length > 0 ? (
                    productUnitLogs.map((log, index) => (
                      <tr
                        key={log.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {(metadata?.currentPage - 1) *
                            (metadata?.limit || 10) +
                            index +
                            1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                              <Package className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {log.product_unit?.product_item?.name || "-"}
                              </p>
                              {log.product_unit?.product_item?.sku && (
                                <p className="text-xs text-gray-400 font-mono">
                                  {log.product_unit.product_item.sku}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                            <Building className="h-4 w-4 text-gray-400" />
                            {log.product_unit?.branch?.branch_name ||
                              log.product_unit?.branch?.name ||
                              "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-sm">
                            <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-800 font-semibold rounded-lg">
                              {log.previous_qty}
                            </span>
                            <ArrowRight className="h-3 w-3 text-gray-400" />
                            <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-800 font-semibold rounded-lg">
                              {log.current_qty}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                              typeStyles[log.type] || "bg-gray-100 text-gray-700 border-gray-200"
                            }`}
                          >
                            {log.type.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                            <User className="h-4 w-4 text-gray-400" />
                            {log.creator?.full_name ||
                              log.creator?.username ||
                              "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(log.created_at)}
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
                          <History className="h-12 w-12 text-gray-300 mb-3" />
                          <p className="text-lg font-medium text-gray-900">
                            No product unit logs found
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Try adjusting your filters
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

export default ProductUnitLogsPage;
