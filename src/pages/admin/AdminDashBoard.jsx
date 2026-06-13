import React from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  Package,
  List,
  AlertTriangle,
  PackageX,
  Inbox,
  TrendingUp,
  BarChart3,
  Layers,
  Activity,
} from "lucide-react";
import useAdminDashboard from "../../hooks/useAdminDashboard";

const statCards = [
  { key: "activeBranches", label: "Active Branches", icon: Building2, color: "bg-blue-500" },
  { key: "activeCategories", label: "Active Categories", icon: Layers, color: "bg-emerald-500" },
  { key: "activeProductLists", label: "Product Lists", icon: List, color: "bg-violet-500" },
  { key: "activeProductItems", label: "Product Items", icon: Package, color: "bg-indigo-500" },
  { key: "totalStock", label: "Total Stock", icon: BarChart3, color: "bg-teal-500" },
  { key: "lowStockCount", label: "Low Stock (≤5)", icon: AlertTriangle, color: "bg-amber-500" },
  { key: "outOfStockCount", label: "Out of Stock", icon: PackageX, color: "bg-red-500" },
  { key: "inactiveItems", label: "Inactive Items", icon: Inbox, color: "bg-gray-500" },
  { key: "todayLogs", label: "Today's Transactions", icon: Activity, color: "bg-cyan-500" },
];

const typeStyles = {
  initial: "bg-blue-100 text-blue-700",
  transfer_out: "bg-orange-100 text-orange-700",
  transfer_in: "bg-emerald-100 text-emerald-700",
  sold: "bg-red-100 text-red-700",
  issue: "bg-purple-100 text-purple-700",
  adjustment: "bg-yellow-100 text-yellow-700",
  return: "bg-cyan-100 text-cyan-700",
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

const AdminDashboard = () => {
  const { stats, isLoading } = useAdminDashboard();

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <LayoutDashboard className="h-7 w-7 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
        <p className="text-gray-500 ml-10">Overview of your business</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          const value = stats[card.key] ?? 0;
          return (
            <div key={card.key} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center gap-4">
              <div className={`${card.color} p-3 rounded-lg`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-gray-900">Users by Role</h2>
          </div>
          <div className="space-y-3">
            {stats.users && Object.entries(stats.users).filter(([k]) => k !== "total").map(([role, count]) => (
              <div key={role} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 capitalize">{role}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-100 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full bg-indigo-500"
                      style={{ width: `${stats.users.total ? (count / stats.users.total) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-sm font-bold text-gray-900">Total</span>
              <span className="text-sm font-bold text-gray-900">{stats.users?.total || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-teal-500" />
            <h2 className="text-lg font-semibold text-gray-900">Stock by Branch</h2>
          </div>
          {stats.stockByBranch?.length > 0 ? (
            <div className="space-y-3">
              {stats.stockByBranch.map((branch) => (
                <div key={branch.branch_name} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 truncate max-w-[180px]">{branch.branch_name}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-100 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full bg-teal-500"
                        style={{ width: `${Math.min((branch.total / 5000) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-16 text-right">{branch.total}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No stock data available</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-cyan-500" />
            <h2 className="text-lg font-semibold text-gray-900">Today's Activity by Type</h2>
          </div>
          {stats.todayLogsByType && Object.keys(stats.todayLogsByType).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(stats.todayLogsByType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeStyles[type] || "bg-gray-100 text-gray-700"}`}>
                    {type.replace(/_/g, " ")}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No activity today</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-gray-900">Low Stock Items</h2>
          </div>
          <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
            <p>Click "Product Units" in sidebar to manage stock</p>
          </div>
        </div>
      </div>

      {stats.recentLogs?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Branch</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock Change</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {log.product_unit?.product_item?.name || "-"}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">
                      {log.product_unit?.branch?.branch_name || "-"}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 bg-gray-100 text-gray-800 text-sm font-semibold rounded-lg">
                        {log.previous_qty} → {log.current_qty}
                      </span>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeStyles[log.type] || "bg-gray-100 text-gray-700"}`}>
                        {log.type.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(log.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
