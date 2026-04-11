import AdminLayout from "../components/AdminLayout";
import LoginPage from "../modules/auth/LoginPage";
import CreateUserPage from "../modules/users/CreateUserPage";
import EditUserPage from "../modules/users/EditUserPage";
import UserDetailPage from "../modules/users/UserDetail";
import UserManagementPage from "../modules/users/UserManagementPage";
import AdminDashboard from "../pages/admin/AdminDashBoard";
import { ROLES } from "../utils/roles";
// export const routes = [
//   {
//     path: "/",
//     element: LoginPage,
//   },
//   {
//     path: "/admin",
//     element: AdminLayout,
//     roles: [ROLES.ADMIN],
//   },
//   {
//     path: "/admin",
//     element: AdminDashboard,
//     roles: [ROLES.ADMIN],
//   },
//   {
//     path: "/admin/users",
//     element: UserManagementPage,
//     role: [ROLES.ADMIN],
//   },
//   {
//     path: "/admin/users/:id",
//     element: UserDetailPage,
//     role: [ROLES.ADMIN],
//   },
//   {
//     path: "/admin/users-edit/:id",
//     element: EditUserPage,
//     role: [ROLES.ADMIN],
//   },
//   {
//     path: "/admin/users-create",
//     element: CreateUserPage,
//     role: [ROLES.ADMIN],
//   },
// ];

export const routes = [
  {
    path: "/",
    element: LoginPage,
  },
  {
    path: "/admin",
    element: AdminLayout,
    role: [ROLES.ADMIN],
    children: [
      {
        path: "",
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
];
