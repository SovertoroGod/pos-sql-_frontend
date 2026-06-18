import AdminLayout from "../components/AdminLayout";
import LoginPage from "../modules/auth/LoginPage";
import BankAccountListPage from "../modules/bankAccount/BankAccountListPage";
import CreateBankAccountPage from "../modules/bankAccount/CreateBankAccountPage";
import EditBankAccountPage from "../modules/bankAccount/EditBankAccountPage";
import BankAccountHistoryPage from "../modules/bankAccount/BankAccountHistoryPage";
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
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import ManagerLayout from "../layouts/ManagerLayout";
import CashierLayout from "../layouts/CashierLayout";
import SalePage from "../modules/pos/SalePage";
import DebtsPage from "../modules/pos/DebtsPage";
import DebtDetailPage from "../modules/pos/DebtDetailPage";
import VoucherHistoryPage from "../modules/pos/VoucherHistoryPage";
import VoucherDetailPage from "../modules/pos/VoucherDetailPage";
import TodaySalesPage from "../modules/pos/TodaySalesPage";
import CashierDashboardPage from "../modules/pos/CashierDashboardPage";
import ErrorPage from "../pages/ErrorPage";
import StockTransfersPage from "../modules/stockTransfer/StockTransfersPage";
import ManagerStockTransfersPage from "../modules/stockTransfer/ManagerStockTransfersPage";
import ManagerCreateStockTransferPage from "../modules/stockTransfer/ManagerCreateStockTransferPage";
import StockTransferDetailPage from "../modules/stockTransfer/StockTransferDetailPage";
import CreateStockTransferPage from "../modules/stockTransfer/CreateStockTransferPage";
import CreateIssueItemPage from "../modules/issueItem/CreateIssueItemPage";
import IssueItemsPage from "../modules/issueItem/IssueItemsPage";
import ManagerIssueItemsPage from "../modules/issueItem/ManagerIssueItemsPage";
import ManagerProductUnitsPage from "../modules/productUnit/ManagerProductUnitsPage";
import ManagerVoucherListPage from "../modules/voucher/ManagerVoucherListPage";
import ManagerVoucherDetailPage from "../modules/voucher/ManagerVoucherDetailPage";
import NotificationsPage from "../modules/notification/NotificationsPage";
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
        path: "bank-accounts",
        element: BankAccountListPage,
      },
      {
        path: "bank-accounts-create",
        element: CreateBankAccountPage,
      },
      {
        path: "bank-accounts-edit/:id",
        element: EditBankAccountPage,
      },
      {
        path: "bank-accounts/:id/history",
        element: BankAccountHistoryPage,
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
      {
        path: "stock-transfers",
        element: StockTransfersPage,
      },
      {
        path: "stock-transfers/:id",
        element: StockTransferDetailPage,
      },
      {
        path: "stock-transfers-create",
        element: CreateStockTransferPage,
      },
      {
        path: "notifications",
        element: NotificationsPage,
      },
      {
        path: "issue-items",
        element: IssueItemsPage,
      },
    ],
  },
  {
    path: "/manager",
    element: ManagerLayout,
    role: [ROLES.MANAGER],
    children: [
      {
        index: true,
        element: ManagerDashboard,
      },
      {
        path: "stock-transfers",
        element: ManagerStockTransfersPage,
      },
      {
        path: "stock-transfers-create",
        element: ManagerCreateStockTransferPage,
      },
      {
        path: "issue-items-create",
        element: CreateIssueItemPage,
      },
      {
        path: "notifications",
        element: NotificationsPage,
      },
      {
        path: "issue-items",
        element: ManagerIssueItemsPage,
      },
      {
        path: "product-units",
        element: ManagerProductUnitsPage,
      },
      {
        path: "vouchers",
        element: ManagerVoucherListPage,
      },
      {
        path: "vouchers/:id",
        element: ManagerVoucherDetailPage,
      },
    ],
  },
  {
    path: "/pos",
    element: CashierLayout,
    role: [ROLES.CASHIER],
    children: [
      {
        index: true,
        element: SalePage,
      },
      {
        path: "dashboard",
        element: CashierDashboardPage,
      },
      {
        path: "today",
        element: TodaySalesPage,
      },
      {
        path: "history",
        element: VoucherHistoryPage,
      },
      {
        path: "history/:id",
        element: VoucherDetailPage,
      },
      {
        path: "debts",
        element: DebtsPage,
      },
      {
        path: "debts/:id",
        element: DebtDetailPage,
      },
    ],
  },
  {
    path: "*",
    element: ErrorPage,
  },
];
