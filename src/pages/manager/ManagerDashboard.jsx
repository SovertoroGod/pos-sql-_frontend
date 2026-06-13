import React from "react";
import {
  LayoutDashboard,
  Package,
  AlertTriangle,
  PackageX,
  Activity,
  ArrowLeftRight,
  Users,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import useManagerDashboard from "../../hooks/useManagerDashboard";
import useAuth from "../../hooks/useAuth";

const statCards = [
  { key: "totalQuantity", label: "Total Stock", icon: BarChart3, color: "bg-teal-500" },
  { key: "lowStockCount", label: "Low Stock (≤5)", icon: AlertTriangle, color: "bg-amber-500" },
  { key: "outOfStockCount", label: "Out of Stock", icon: PackageX, color: "bg-red-500" },
  { key: "todayLogCount", label: "Today's Transactions", icon: Activity, color: "bg-cyan-500" },
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

const ManagerDashboard = () => {
  const { stats, isLoading } = useManagerDashboard();
  const { user } = useAuth();

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
            <svg className="animate-spin h-8 w-8 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const resolvedStats = {
    totalQuantity: stats.stocks?.totalQuantity ?? 0,
    lowStockCount: stats.stocks?.lowStockCount ?? 0,
    outOfStockCount: stats.stocks?.outOfStockCount ?? 0,
    todayLogCount: stats.activity?.todayLogCount ?? 0,
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <LayoutDashboard className="h-7 w-7 text-teal-600" />
          <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
        </div>
        <p className="text-gray-500 ml-10">
          Welcome, {user?.full_name} — {user?.branch_name || "Your branch"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          const value = resolvedStats[card.key] ?? 0;
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

      {/* Branch Stock + Pending Transfers */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Branch Stock */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-teal-500" />
            <h2 className="text-lg font-semibold text-gray-900">Branch Stock</h2>
          </div>
          {stats.stocks?.items?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">SKU</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase">Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.stocks.items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 text-sm font-medium text-gray-900">
                        {item.product_item?.name || "-"}
                      </td>
                      <td className="px-4 py-2.5 text-sm text-gray-500 font-mono">
                        {item.product_item?.sku || "-"}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          item.quantity === 0
                            ? "bg-red-100 text-red-700"
                            : item.quantity <= 5
                            ? "bg-amber-100 text-amber-700"
                            : "bg-green-100 text-green-700"
                        }`}>
                          {item.quantity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No stock data available</p>
          )}
        </div>

        {/* Pending Transfers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <ArrowLeftRight className="h-5 w-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-900">Pending Transfers</h2>
          </div>
          {stats.activity?.pendingTransfers?.length > 0 ? (
            <div className="space-y-3">
              {stats.activity.pendingTransfers.map((transfer) => (
                <div key={transfer.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      #{transfer.id} — {transfer.product_item?.name || "Item"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {transfer.from_branch?.branch_name} → {transfer.to_branch?.branch_name}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-orange-700">
                    {transfer.quantity} units
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No pending transfers</p>
          )}
        </div>
      </div>

      {/* Recent Activity + Branch Staff */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-cyan-500" />
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          {stats.activity?.recentLogs?.length > 0 ? (
            <div className="space-y-3">
              {stats.activity.recentLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {log.product_unit?.product_item?.name || "-"}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {log.previous_qty} → {log.current_qty}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${typeStyles[log.type] || "bg-gray-100 text-gray-700"}`}>
                        {log.type.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 ml-2">
                    {formatDate(log.created_at)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No recent activity</p>
          )}
        </div>

        {/* Branch Staff */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-violet-500" />
            <h2 className="text-lg font-semibold text-gray-900">Branch Staff</h2>
          </div>
          {stats.users?.length > 0 ? (
            <div className="space-y-3">
              {stats.users.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 text-sm font-semibold">
                      {(u.full_name || u.username || "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{u.full_name || u.username}</p>
                      <p className="text-xs text-gray-500">{u.username}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                    u.role === "manager"
                      ? "bg-purple-100 text-purple-700 border-purple-200"
                      : "bg-green-100 text-green-700 border-green-200"
                  }`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No staff members found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
