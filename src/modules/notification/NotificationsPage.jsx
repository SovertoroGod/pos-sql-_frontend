import React from "react";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Filter,
  XCircle,
  Check,
  CheckCheck,
  Info,
  AlertTriangle,
  Send,
} from "lucide-react";
import useNotifications from "../../hooks/useNotifications";

const TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "transfer_request", label: "Transfer Request" },
  { value: "transfer_received", label: "Transfer Received" },
  { value: "transfer_cancelled", label: "Transfer Cancelled" },
  { value: "general", label: "General" },
];

const READ_OPTIONS = [
  { value: "", label: "All" },
  { value: "false", label: "Unread" },
  { value: "true", label: "Read" },
];

const typeStyles = {
  transfer_request: "bg-blue-100 text-blue-700 border-blue-200",
  transfer_received: "bg-green-100 text-green-700 border-green-200",
  transfer_cancelled: "bg-red-100 text-red-700 border-red-200",
  general: "bg-gray-100 text-gray-700 border-gray-200",
};

const typeIcons = {
  transfer_request: Send,
  transfer_received: Check,
  transfer_cancelled: AlertTriangle,
  general: Info,
};

const NotificationsPage = () => {
  const {
    notifications,
    metadata,
    isLoading,
    filters,
    handleFilterChange,
    handlePageChange,
    handleMarkAsRead,
    handleMarkAllAsRead,
  } = useNotifications();

  const hasActiveFilters = filters.is_read || filters.type;

  const clearFilters = () => {
    handleFilterChange({ target: { name: "is_read", value: "" } });
    handleFilterChange({ target: { name: "type", value: "" } });
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
              <Bell className="h-8 w-8 text-blue-600" />
              Notifications
            </h1>
            <p className="text-gray-600 mt-2">
              View and manage your notifications
            </p>
          </div>
          <button
            onClick={handleMarkAllAsRead}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
          >
            <CheckCheck className="h-4 w-4" />
            Mark All as Read
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Read Status
            </label>
            <select
              name="is_read"
              value={filters.is_read}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {READ_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
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
                  className="animate-spin h-6 w-6 text-blue-600"
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
                  Loading notifications...
                </span>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-100">
              {notifications?.length > 0 ? (
                notifications.map((notif) => {
                  const TypeIcon = typeIcons[notif.type] || Info;
                  return (
                    <div
                      key={notif.id}
                      className={`p-6 hover:bg-gray-50 transition-colors duration-150 ${
                        !notif.is_read ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-2 rounded-lg ${
                            typeStyles[notif.type] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          <TypeIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p
                              className={`text-sm font-semibold ${
                                notif.is_read ? "text-gray-700" : "text-gray-900"
                              }`}
                            >
                              {notif.title}
                            </p>
                            {!notif.is_read && (
                              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                                typeStyles[notif.type] ||
                                "bg-gray-100 text-gray-700 border-gray-200"
                              }`}
                            >
                              {notif.type.replace(/_/g, " ")}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(notif.created_at)}
                            </span>
                          </div>
                        </div>
                        {!notif.is_read && (
                          <button
                            onClick={() => handleMarkAsRead(notif.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            <Check className="h-3 w-3" />
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <Bell className="h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-lg font-medium text-gray-900">
                      No notifications found
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {hasActiveFilters
                        ? "Try adjusting your filters"
                        : "You're all caught up!"}
                    </p>
                  </div>
                </div>
              )}
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

export default NotificationsPage;
