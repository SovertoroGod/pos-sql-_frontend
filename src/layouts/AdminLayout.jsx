import Sidebar from "../components/SideBar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-5 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;