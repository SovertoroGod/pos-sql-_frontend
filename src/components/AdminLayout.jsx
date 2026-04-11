import React, { useState } from 'react';
import Sidebar from './SideBar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-56" : "w-0"} transition-all duration-300 ease-in-out overflow-hidden relative`}>
        <Sidebar />
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-1/2 transform -translate-y-1/2 z-50 p-1 bg-blue-400 rounded-r-lg shadow-md hover:shadow-lg transition-all duration-200"
        style={{ left: sidebarOpen ? "14rem" : "0" }}>
        {sidebarOpen ? (
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-600" />
        )}
      </button>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
