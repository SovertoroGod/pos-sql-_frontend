import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Building2,
  List,
  History,
  ArrowLeftRight,
  Send,
} from "lucide-react";
import useAuth from "../hooks/useAuth";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const menuItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/branches", label: "Branches", icon: Building2 },
    // { to: "/admin/reports", label: "Reports", icon: FileText },
    { to: "/admin/categories", label: "Categories", icon: Package },
    { to: "/admin/product-lists", label: "Product Lists", icon: List },
    { to: "/admin/product-unit-logs", label: "Product Unit Logs", icon: History },
    { to: "/admin/stock-transfers", label: "Stock Transfers", icon: ArrowLeftRight },
    { to: "/admin/issue-items", label: "Issue Items", icon: Send },
  ];

  return (
    <div className="w-56 h-screen bg-slate-800 text-white p-5 flex flex-col">
      <div>
        <h2 className="text-xl font-bold mb-8">Admin</h2>

        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-slate-700 hover:text-white transition-colors">
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="p-4 border-t border-gray-700">
        <button
          className="bg-red-500 hover:bg-red-700 w-full py-2 rounded"
          onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
