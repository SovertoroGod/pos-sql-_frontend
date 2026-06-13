import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Package,
  Building,
  User,
  Filter,
  XCircle,
  CheckCircle,
  XCircleIcon,
  Plus,
} from "lucide-react";
import useManagerStockTransfers from "../../hooks/useManagerStockTransfers";
import useCancelStockTransfer from "../../hooks/useCancelStockTransfer";
import useReceiveStockTransfer from "../../hooks/useReceiveStockTransfer";
import useAuth from "../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { getAllStockTransfersForManager } from "../stockTransfer/stockTransferSlice";
import Swal from "sweetalert2";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  completed: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

const ManagerStockTransfersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    stockTransfers,
    metadata,
    isLoading,
    filters,
    handleFilterChange,
    handlePageChange,
  } = useManagerStockTransfers();
  const { handleCancel, isCancelling } = useCancelStockTransfer();
  const { handleReceive, isReceiving } = useReceiveStockTransfer();
  const { user } = useAuth();

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const hasActiveFilters =
    filters.status || filters.startDate || filters.endDate;

  const clearFilters = () => {
    handleFilterChange({ target: { name: "status", value: "" } });
    handleFilterChange({ target: { name: "startDate", value: "" } });
    handleFilterChange({ target: { name: "endDate", value: "" } });
  };

  const handleCancelClick = async (e, transfer) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: "Cancel Transfer?",
      html: `Are you sure you want to cancel transfer #${transfer.id}?<br><br>This will restore <strong>${transfer.quantity} units</strong> to <strong>${transfer.from_branch?.branch_name}</strong>.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, cancel it!",
    });

    if (result.isConfirmed) {
      const res = await handleCancel(transfer.id);
      if (res.meta.requestStatus === "fulfilled") {
        Swal.fire({
          title: "Cancelled!",
          text: "Stock transfer has been cancelled.",
          icon: "success",
          confirmButtonColor: "#16a34a",
        });
        dispatch(getAllStockTransfersForManager(filters));
      } else {
        Swal.fire({
          title: "Error!",
          text: res.payload || "Failed to cancel transfer.",
          icon: "error",
          confirmButtonColor: "#e3342f",
        });
      }
    }
  };

  const handleReceiveClick = async (e, transfer) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: "Receive Transfer?",
      html: `Confirm receipt of transfer #${transfer.id}?<br><br>This will add <strong>${transfer.quantity} units</strong> to your branch.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, receive it!",
    });

    if (result.isConfirmed) {
      const res = await handleReceive(transfer.id);
      if (res.meta.requestStatus === "fulfilled") {
        Swal.fire({
          title: "Received!",
          text: "Stock transfer has been received successfully.",
          icon: "success",
          confirmButtonColor: "#16a34a",
        });
        dispatch(getAllStockTransfersForManager(filters));
      } else {
        Swal.fire({
          title: "Error!",
          text: res.payload || "Failed to receive transfer.",
          icon: "error",
          confirmButtonColor: "#e3342f",
        });
      }
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <ArrowLeftRight className="h-8 w-8 text-orange-600" />
              Stock Transfers
            </h1>
            <p className="text-gray-600 mt-2">
              View and manage stock transfers for your branch
            </p>
          </div>
          <button
            onClick={() => navigate("/manager/stock-transfers-create")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Create Transfer
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {STATUS_OPTIONS.map((opt) => (
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
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-flex items-center space-x-2">
                <svg
                  className="animate-spin h-6 w-6 text-orange-600"
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
                  Loading stock transfers...
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
                      From Branch
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      To Branch
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stockTransfers?.length > 0 ? (
                    stockTransfers.map((transfer, index) => (
                      <tr
                        key={transfer.id}
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
                            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                              <Package className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {transfer.product_item?.name || "-"}
                              </p>
                              {transfer.product_item?.sku && (
                                <p className="text-xs text-gray-400 font-mono">
                                  {transfer.product_item.sku}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                            <Building className="h-4 w-4 text-gray-400" />
                            {transfer.from_branch?.branch_name || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                            <Building className="h-4 w-4 text-gray-400" />
                            {transfer.to_branch?.branch_name || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-800 font-semibold rounded-lg text-sm">
                            {transfer.quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                              statusStyles[transfer.status] ||
                              "bg-gray-100 text-gray-700 border-gray-200"
                            }`}
                          >
                            {transfer.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(transfer.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {transfer.status === "pending" && transfer.from_branch_id !== user?.branch_id && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => handleReceiveClick(e, transfer)}
                                disabled={isReceiving}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                                title="Receive Transfer"
                              >
                                <CheckCircle className="h-3.5 w-3.5" />
                                Receive
                              </button>
                              <button
                                onClick={(e) => handleCancelClick(e, transfer)}
                                disabled={isCancelling}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                                title="Cancel Transfer"
                              >
                                <XCircleIcon className="h-3.5 w-3.5" />
                                Cancel
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center">
                          <ArrowLeftRight className="h-12 w-12 text-gray-300 mb-3" />
                          <p className="text-lg font-medium text-gray-900">
                            No stock transfers found
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

export default ManagerStockTransfersPage;
