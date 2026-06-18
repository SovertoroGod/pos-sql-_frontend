import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../modules/auth/authSlice";
import usersReducer from "../modules/users/userSlice";
import branchReducer from "../modules/branches/branchSlice";
import categoryReducer from "../modules/category/categorySlice";
import productListReducer from "../modules/productList/productListSlice";
import productItemReducer from "../modules/productItem/productItemSlice";
import productUnitReducer from "../modules/productUnit/productUnitSlice";
import productUnitLogReducer from "../modules/productUnitLog/productUnitLogSlice";
import adminDashboardReducer from "../modules/adminDashboard/adminDashboardSlice";
import managerDashboardReducer from "../modules/managerDashboard/managerDashboardSlice";
import stockTransferReducer from "../modules/stockTransfer/stockTransferSlice";
import issueItemReducer from "../modules/issueItem/issueItemSlice";
import notificationReducer from "../modules/notification/notificationSlice";
import bankAccountReducer from "../modules/bankAccount/bankAccountSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    branches: branchReducer,
    category: categoryReducer,
    productList: productListReducer,
    productItem: productItemReducer,
    productUnit: productUnitReducer,
    productUnitLog: productUnitLogReducer,
    adminDashboard: adminDashboardReducer,
    managerDashboard: managerDashboardReducer,
    stockTransfer: stockTransferReducer,
    issueItem: issueItemReducer,
    notification: notificationReducer,
    bankAccount: bankAccountReducer,
  },
});