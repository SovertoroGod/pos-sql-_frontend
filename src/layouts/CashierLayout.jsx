import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import CashierSidebar from '../modules/pos/CashierSidebar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import NotificationBell from '../modules/notification/NotificationBell';
import useAuth from '../hooks/useAuth';

const CashierLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50">
      <div className={`${sidebarOpen ? "w-56" : "w-0"} transition-all duration-300 ease-in-out overflow-hidden relative`}>
        <CashierSidebar />
      </div>

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

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-end px-4 shrink-0 gap-4">
          <span className="text-sm text-gray-600">
            Cashier: <span className="font-semibold">{user?.full_name || user?.username}</span>
          </span>
          <NotificationBell />
        </div>
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CashierLayout;
