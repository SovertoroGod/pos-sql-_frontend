import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import useStockTransferDetail from "../../hooks/useStockTransferDetail";
import useCancelStockTransfer from "../../hooks/useCancelStockTransfer";
import useReceiveStockTransfer from "../../hooks/useReceiveStockTransfer";
import {
  ArrowLeftRight,
  ArrowLeft,
  Package,
  Building,
  User,
  Calendar,
  Hash,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { getStockTransferById } from "./stockTransferSlice";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  completed: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

const StockTransferDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedTransfer, isLoading } = useStockTransferDetail(id);
  const { handleCancel, isCancelling } = useCancelStockTransfer();
  const { handleReceive, isReceiving } = useReceiveStockTransfer();

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCancelClick = async () => {
    const result = await Swal.fire({
      title: "Cancel Transfer?",
      html: `Are you sure you want to cancel this transfer?<br><br>This will <strong>restore ${selectedTransfer.quantity} units</strong> to <strong>${selectedTransfer.from_branch?.branch_name}</strong>.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, cancel it!",
    });

    if (result.isConfirmed) {
      const res = await handleCancel(id);
      if (res.meta.requestStatus === "fulfilled") {
        Swal.fire({
          title: "Cancelled!",
          text: "Stock transfer has been cancelled and stock restored.",
          icon: "success",
          confirmButtonColor: "#16a34a",
        });
        dispatch(getStockTransferById(id));
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

  const handleReceiveClick = async () => {
    const result = await Swal.fire({
      title: "Receive Transfer?",
      html: `Confirm receipt of this transfer?<br><br>This will add <strong>${selectedTransfer.quantity} units</strong> to <strong>${selectedTransfer.to_branch?.branch_name}</strong>.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, receive it!",
    });

    if (result.isConfirmed) {
      const res = await handleReceive(id);
      if (res.meta.requestStatus === "fulfilled") {
        Swal.fire({
          title: "Received!",
          text: "Stock transfer has been received successfully.",
          icon: "success",
          confirmButtonColor: "#16a34a",
        });
        dispatch(getStockTransferById(id));
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

  if (!id || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-gray-600 text-lg">
                  Loading transfer details...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedTransfer) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <ArrowLeftRight className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Transfer Not Found
              </h3>
              <p className="text-gray-600 mb-4">
                The stock transfer you're looking for doesn't exist or has been
                removed.
              </p>
              <button
                onClick={() => navigate("/admin/stock-transfers")}
                className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Transfers
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
        {/* Header */}
        <div className="mb-8">
          <button
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
                Transfer #{selectedTransfer.id}
              </h1>
              <p className="text-gray-600 mt-1">
                Stock transfer details and information
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Transfer Information
                </h2>
                <div className="space-y-6">
                  {/* Product Item */}
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Package className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-500">
                        Product Item
                      </h3>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {selectedTransfer.product_item?.name || "-"}
                      </p>
                      {selectedTransfer.product_item?.sku && (
                        <p className="text-sm text-gray-500 font-mono">
                          SKU: {selectedTransfer.product_item.sku}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* From Branch */}
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-500">
                        From Branch
                      </h3>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {selectedTransfer.from_branch?.branch_name || "-"}
                      </p>
                    </div>
                  </div>

                  {/* To Branch */}
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Building className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-500">
                        To Branch
                      </h3>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {selectedTransfer.to_branch?.branch_name || "-"}
                      </p>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Hash className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-500">
                        Quantity
                      </h3>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {selectedTransfer.quantity} units
                      </p>
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedTransfer.notes && (
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <FileText className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-500">
                          Notes
                        </h3>
                        <p className="text-sm text-gray-700 mt-1">
                          {selectedTransfer.notes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Status Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Status
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${
                        statusStyles[selectedTransfer.status] ||
                        "bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                    >
                      {selectedTransfer.status}
                    </span>
                  </div>

                  {/* Created By */}
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Created By
                    </h3>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {selectedTransfer.creator?.full_name ||
                          selectedTransfer.creator?.username ||
                          "-"}
                      </span>
                    </div>
                  </div>

                  {/* Quick Actions - only when pending */}
                  {selectedTransfer.status === "pending" && (
                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-500 mb-3">
                        Quick Actions
                      </h3>
                      <div className="space-y-2">
                        <button
                          onClick={handleReceiveClick}
                          disabled={isReceiving}
                          className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isReceiving ? (
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
                              Receiving...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Receive Transfer
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleCancelClick}
                          disabled={isCancelling}
                          className="w-full inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isCancelling ? (
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
                              Cancelling...
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 mr-2" />
                              Cancel Transfer
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Status message for non-pending */}
                  {selectedTransfer.status === "completed" && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-lg p-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium">
                          This transfer has been completed.
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedTransfer.status === "cancelled" && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-red-700 bg-red-50 rounded-lg p-3">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <span className="text-sm font-medium">
                          This transfer was cancelled.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 mt-6">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Details
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Transfer ID</span>
                    <span className="text-sm font-medium text-gray-900 font-mono">
                      #{selectedTransfer.id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Created</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(selectedTransfer.created_at)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Updated</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(selectedTransfer.updated_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockTransferDetailPage;
