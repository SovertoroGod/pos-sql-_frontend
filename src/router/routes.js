import AdminLayout from "../components/AdminLayout";
import LoginPage from "../modules/auth/LoginPage";
import CreateUserPage from "../modules/users/CreateUserPage";
import EditUserPage from "../modules/users/EditUserPage";
import UserDetailPage from "../modules/users/UserDetail";
import UserManagementPage from "../modules/users/UserManagementPage";
import AdminDashboard from "../pages/admin/AdminDashBoard";
import ErrorPage from "../pages/ErrorPage";
import { ROLES } from "../utils/roles";

export const routes = [
  {
    path: "/",
    element: LoginPage,
  },
  {
    path: "/403",
    element: ErrorPage,
  },
  {
    path: "/admin",
    element: AdminLayout,
    role: [ROLES.ADMIN],
    children: [
      {
        index: true,
        element: AdminDashboard,
      },
      {
        path: "users",
        element: UserManagementPage,
      },
      {
        path: "users-create",
        element: CreateUserPage,
      },
      {
        path: "users/:id",
        element: UserDetailPage,
      },
      {
        path: "users-edit/:id",
        element: EditUserPage,
      },
    ],
  },
  {
    path: "*",
    element: ErrorPage,
  },
];
