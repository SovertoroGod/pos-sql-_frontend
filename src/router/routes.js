import AdminLayout from "../components/AdminLayout";
import LoginPage from "../modules/auth/LoginPage";
import BranchDetailPage from "../modules/branches/BranchDetailPage";
import BranchesListPage from "../modules/branches/BranchesListPage";
import CreateBranchPage from "../modules/branches/CreateBranchPage";
import EditBranchPage from "../modules/branches/EditBranchPage";
import BranchReportsPage from "../modules/branches/BranchReportsPage";
import CategoryDetailPage from "../modules/category/CategoryDetailPage";
import CategoryListsPage from "../modules/category/CategoryListsPage";
import CreateCategoryPage from "../modules/category/CreateCategoryPage";
import CreateSubCategoryPage from "../modules/category/CreateSubCategoryPage";
import UpdateCategoryPage from "../modules/category/UpdateCategoryPage";
import UpdateSubCategoryPage from "../modules/category/UpdateSubCategoryPage";
import CreateUserPage from "../modules/users/CreateUserPage";
import EditUserPage from "../modules/users/EditUserPage";
import UserDetailPage from "../modules/users/UserDetail";
import UserManagementPage from "../modules/users/UserManagementPage";
import ProductListsPage from "../modules/productList/ProductListsPage";
import CreateProductListPage from "../modules/productList/CreateProductListPage";
import ProductListDetailPage from "../modules/productList/ProductListDetailPage";
import EditProductListPage from "../modules/productList/EditProductListPage";
import ProductItemsPage from "../modules/productItem/ProductItemsPage";
import CreateProductItemPage from "../modules/productItem/CreateProductItemPage";
import EditProductItemPage from "../modules/productItem/EditProductItemPage";
import ProductUnitsPage from "../modules/productUnit/ProductUnitsPage";
import CreateProductUnitPage from "../modules/productUnit/CreateProductUnitPage";
import EditProductUnitPage from "../modules/productUnit/EditProductUnitPage";
import ProductUnitLogsPage from "../modules/productUnitLog/ProductUnitLogsPage";
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
        path: "branches-reports/:id",
        element: BranchReportsPage,
      },
      {
        path: "branch-create",
        element: CreateBranchPage,
      },
      {
        path: "categories",
        element: CategoryListsPage,
      },
      {
        path: "category-create",
        element: CreateCategoryPage,
      },
      {
        path: "subcategory-create/:parentId",
        element: CreateSubCategoryPage,
      },
      {
        path: "category-detail/:id",
        element: CategoryDetailPage,
      },
      {
        path: "category-edit/:id",
        element: UpdateCategoryPage,
      },
      {
        path: "subcategory-edit/:id",
        element: UpdateSubCategoryPage,
      },
      {
        path: "product-lists",
        element: ProductListsPage,
      },
      {
        path: "product-lists-create",
        element: CreateProductListPage,
      },
      {
        path: "product-lists/:id",
        element: ProductListDetailPage,
      },
      {
        path: "product-lists-edit/:id",
        element: EditProductListPage,
      },
      {
        path: "product-items",
        element: ProductItemsPage,
      },
      {
        path: "product-items-create",
        element: CreateProductItemPage,
      },
      {
        path: "product-items-edit/:id",
        element: EditProductItemPage,
      },
      {
        path: "product-units",
        element: ProductUnitsPage,
      },
      {
        path: "product-units-create",
        element: CreateProductUnitPage,
      },
      {
        path: "product-units-edit/:id",
        element: EditProductUnitPage,
      },
      {
        path: "product-unit-logs",
        element: ProductUnitLogsPage,
      },
    ],
  },
  {
    path: "*",
    element: ErrorPage,
  },
];
