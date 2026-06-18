import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import NotificationBell from "../modules/notification/NotificationBell";
import { LogOut, LayoutDashboard, ArrowLeftRight, Send, Package, Receipt, Landmark } from "lucide-react";

const navItems = [
  { to: "/manager", label: "Dashboard", icon: LayoutDashboard },
  { to: "/manager/stock-transfers", label: "Stock Transfers", icon: ArrowLeftRight },
  { to: "/manager/issue-items", label: "Issue Items", icon: Send },
  { to: "/manager/product-units", label: "Stock", icon: Package },
  { to: "/manager/vouchers", label: "Vouchers", icon: Receipt },
  { to: "/manager/bank-accounts", label: "Bank Accounts", icon: Landmark },
];

const ManagerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => {
    if (path === "/manager") {
      return location.pathname === "/manager";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-sm font-bold">
            {(user?.full_name || user?.username || "M").charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-sm font-semibold text-gray-900">Manager Portal</h1>
            <p className="text-xs text-gray-500">{user?.full_name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200 shrink-0">
        <div className="px-6 flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.to}
                onClick={() => navigate(item.to)}
                className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  isActive(item.to)
                    ? "border-teal-500 text-teal-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Page Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default ManagerLayout;
