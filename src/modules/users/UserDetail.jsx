import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useUserDetail from "../../hooks/useUserDetail";
import AdminLayout from "../../components/AdminLayout";
import { ArrowLeft, User, Mail, Shield, Building, Calendar, Clock, Edit, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { getAllBranches } from "../branches/branchSlice";

const UserDetailPage = () => {
  const { id } = useParams();
  const userId = Number(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedUser, isLoading, branches, deactivateUser } =
    useUserDetail(userId);
  const branch = branches?.find((b) => b.id === selectedUser?.branch_id);

  const branchDisplayName = branch?.branch_name || "No Branch Assigned";
  const branchDisplayCode = branch?.branch_code || "No Branch Assigned";

  const getRoleBadgeColor = (role) => {
    const normalizedRole = role?.toLowerCase();
    const colors = {
      admin: "bg-red-100 text-red-700 border-red-200",
      manager: "bg-purple-100 text-purple-700 border-purple-200",
      cashier: "bg-green-100 text-green-700 border-green-200",
    };
    return (
      colors[normalizedRole] || "bg-gray-100 text-gray-700 border-gray-200"
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-600 font-medium">Loading user details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/admin/users")}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200">
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
              {selectedUser.full_name?.charAt(0)?.toUpperCase() ||
                selectedUser.username?.charAt(0)?.toUpperCase() ||
                "U"}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {selectedUser.full_name || "N/A"}
              </h1>
              <p className="text-gray-600">@{selectedUser.username}</p>
              <div className="mt-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeColor(selectedUser.role)}`}>
                  <Shield className="h-3 w-3 mr-1" />
                  {selectedUser.role}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              onClick={() => navigate(`/admin/users-edit/${selectedUser.id}`)}>
              <Edit className="h-4 w-4" />
              Edit User
            </button>
            <button
              className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
              onClick={deactivateUser}>
              <Trash2 className="h-4 w-4" />
              Delete User
            </button>
          </div>
        </div>
      </div>

      {/* User Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="h-5 w-5 text-gray-600" />
              Basic Information
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-500">Status</span>
              <span
                className={`text-sm font-medium ${selectedUser.is_active ? "text-green-700" : "text-red-700"}`}>
                {selectedUser.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-500">
                Full Name
              </span>
              <span className="text-sm text-gray-900">
                {selectedUser.full_name || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-500">
                Username
              </span>
              <span className="text-sm text-gray-900 font-mono">
                @{selectedUser.username}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-sm font-medium text-gray-500">Role</span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(selectedUser.role)}`}>
                {selectedUser.role}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Mail className="h-5 w-5 text-gray-600" />
              Contact Information
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-500">
                Email Address
              </span>
              <span className="text-sm text-gray-900">
                {selectedUser.email || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Building className="h-4 w-4" />
                Branch ID
              </span>
              <span className="text-sm text-gray-900">
                {selectedUser.branch_id || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Building className="h-4 w-4" />
                Branch Name
              </span>
              <span className="text-sm text-gray-900">
                {branchDisplayName || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Building className="h-4 w-4" />
                Branch Code
              </span>
              <span className="text-sm text-gray-900">
                {branchDisplayCode || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Account Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-600" />
              Account Activity
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-500">
                Last Login
              </span>
              <span className="text-sm text-gray-900">
                {selectedUser.last_login
                  ? new Date(selectedUser.last_login).toLocaleString()
                  : "Never"}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Account Created
              </span>
              <span className="text-sm text-gray-900">
                {selectedUser.created_at
                  ? new Date(selectedUser.created_at).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Quick Actions
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <button
                className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                onClick={() =>
                  navigate(`/admin/users-edit/${selectedUser.id}`)
                }>
                <Edit className="h-4 w-4" />
                Edit User Profile
              </button>
              {/* <button className="w-full inline-flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                  <Shield className="h-4 w-4" />
                  Change Role
                </button> */}
              <button className="w-full inline-flex items-center justify-center gap-2 bg-yellow-600 text-white px-4 py-3 rounded-lg hover:bg-yellow-700 transition-colors duration-200">
                <Mail className="h-4 w-4" />
                Send Email
              </button>
              <button
                className="w-full inline-flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200"
                onClick={deactivateUser}>
                <Trash2 className="h-4 w-4" />
                Delete User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;