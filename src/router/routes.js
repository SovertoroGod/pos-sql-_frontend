import AdminLayout from "../components/AdminLayout";
import LoginPage from "../modules/auth/LoginPage";
import BranchDetailPage from "../modules/branches/BranchDetailPage";
import BranchesListPage from "../modules/branches/BranchesListPage";
import CreateBranchPage from "../modules/branches/CreateBranchPage";
import EditBranchPage from "../modules/branches/EditBranchPage";
import CreateCategoryPage from "../modules/category/CreateCategoryPage";
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
      {
        path: "branches",
        element: BranchesListPage,
      },
      {
        path: "branches/:id",
        element: BranchDetailPage,
      },
      {
        path: "branches-edit/:id",
        element: EditBranchPage,
      },
      {
        path: "branch-create",
        element: CreateBranchPage,
      },
      {
        path: "category-create",
        element: CreateCategoryPage,
      },
    ],
  },
  {
    path: "*",
    element: ErrorPage,
  },
];
