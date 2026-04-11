import React from "react";
import {
  Search,
  Users,
  Filter,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Edit,
  Trash2,
  MoreVertical,
  Eye,
} from "lucide-react";
import AdminLayout from "../../components/AdminLayout";
import useUsers from "../../hooks/useUsers";
import { useNavigate } from "react-router-dom";

const UserManagementPage = () => {
  const {
    users,
    metadata,
    filters,
    isLoading,
    search,
    showFilters,
    hasActiveFilters,
    handleSearch,
    changePage,
    toggleFilters,
    clearFilters,
    getRoleBadgeColor,
    branches,
  } = useUsers();

  const navigate = useNavigate();
  console.log("just branch", branches);

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-600" />
                User Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and organize your system users
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/users-create")}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm">
              <UserPlus className="h-4 w-4" />
              Add User
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Main Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  name="full_name"
                  placeholder="Search by name, username, or email..."
                  value={search.full_name}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={toggleFilters}
              className={`inline-flex items-center gap-2 px-4 py-3 rounded-lg border transition-all duration-200 ${
                showFilters
                  ? "bg-blue-50 border-blue-300 text-blue-700"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}>
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  {Object.values(search).filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    name="username"
                    placeholder="Enter username"
                    value={search.username}
                    onChange={handleSearch}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter email"
                    value={search.email}
                    onChange={handleSearch}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    name="role"
                    onChange={handleSearch}
                    value={search.role}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="cashier">Cashier</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User Status
                  </label>
                  <select
                    name="is_active"
                    onChange={handleSearch}
                    value={search.is_active}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select Status</option>
                    <option value="false">Inactive</option>
                    <option value="true">Active</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    name="startDate"
                    type="date"
                    value={search.startDate}
                    onChange={handleSearch}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    name="endDate"
                    type="date"
                    value={search.endDate}
                    onChange={handleSearch}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch Code
                  </label>
                  <select
                    name="branch_id"
                    value={search.branch_id || ""}
                    onChange={handleSearch}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 required">
                    <option value="">Select Branch</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.branch_code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {hasActiveFilters && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                  <svg
                    className="animate-spin h-6 w-6 text-blue-600"
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
                <p className="text-gray-600 text-sm font-medium">
                  Loading users...
                </p>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Branch
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <Users className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600 font-medium">
                        No users found
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        Try adjusting your search or filters
                      </p>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 shrink-0">
                            <div className="h-10 w-10 rounded-full bg-linear-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                              {user.full_name?.charAt(0)?.toUpperCase() ||
                                user.username?.charAt(0)?.toUpperCase() ||
                                "U"}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              <button
                                onClick={() =>
                                  navigate(`/admin/users/${user.id}`)
                                }
                                className="hover:text-blue-600 transition-colors duration-150 underline">
                                {user.full_name || "N/A"}
                              </button>
                            </div>
                            <div className="text-sm text-gray-500">
                              @{user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {branches.find((b) => b.id === user.branch_id)
                            ?.branch_code || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {user.is_active ? "Active" : "Inactive"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-150"
                            onClick={() => navigate(`/admin/users/${user.id}`)}
                            title="View Profile">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-150"
                            onClick={() =>
                              navigate(`/admin/users-edit/${user.id}`)
                            }
                            title="Edit User">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-150"
                            title="Delete User">
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-150"
                            title="More Options">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {metadata && metadata.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-700">
                  {metadata.totalItems > 0 ? (
                    <>
                      Showing {(filters.page - 1) * (metadata.limit || 10) + 1}{" "}
                      to{" "}
                      {Math.min(
                        filters.page * (metadata.limit || 10),
                        metadata.totalItems || 0,
                      )}{" "}
                      of {metadata.totalItems || 0} results
                    </>
                  ) : (
                    <>No results found</>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => changePage(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-150">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: metadata.totalPages || 1 }, (_, i) => {
                    const page = i + 1;
                    const isCurrent = filters.page === page;
                    const isNearCurrent =
                      Math.abs(page - filters.page) <= 2 ||
                      page === 1 ||
                      page === metadata.totalPages;

                    if (!isNearCurrent && i > 0 && i < metadata.totalPages - 1)
                      return null;

                    return (
                      <button
                        key={i}
                        onClick={() => changePage(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                          isCurrent
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}>
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => changePage(filters.page + 1)}
                    disabled={filters.page === metadata.totalPages}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-150">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserManagementPage;
