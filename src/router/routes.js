import AdminLayout from "../layouts/AdminLayout";
import LoginPage from "../modules/auth/LoginPage";
import EditUserPage from "../modules/users/EditUserPage";
import UserDetailPage from "../modules/users/UserDetail";
import UserManagementPage from "../modules/users/UserManagementPage";
import AdminDashboard from "../pages/admin/AdminDashBoard";
import { ROLES } from "../utils/roles";
export const routes = [
  {
    path: "/",
    element: LoginPage,
  },
  {
    path: "/admin",
    element: AdminLayout,
    roles: [ROLES.ADMIN],
  },
  {
    path: "/admin",
    element: AdminDashboard,
    roles: [ROLES.ADMIN],
  },
  {
    path: "/admin/users",
    element: UserManagementPage,
    role: [ROLES.ADMIN],
  },
  {
    path: "/admin/users/:id",
    element: UserDetailPage,
    role: [ROLES.ADMIN]
  },
  {
    path: "/admin/users-edit/:id",
    element: EditUserPage,
    role: [ROLES.ADMIN]
  }
];
