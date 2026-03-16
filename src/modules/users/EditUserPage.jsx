import React from "react";
import { useParams } from "react-router-dom";
import useEditUser from "../../hooks/useEditUser";
import AdminLayout from "../../components/AdminLayout";
import { ArrowLeft, User, Mail, Shield, Building, ToggleLeft, Save, X } from 'lucide-react';

const EditUserPage = () => {
  const { id } = useParams();
  const {
    selectedUser,
    form,
    branches,
    isLoading,
    handleChange,
    handleSubmit,
    handleCancel,
    navigate,
  } = useEditUser(id);

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: "bg-red-100 text-red-700 border-red-200",
      manager: "bg-purple-100 text-purple-700 border-purple-200",
      cashier: "bg-green-100 text-green-700 border-green-200",
    };
    return colors[role] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200">
              <ArrowLeft className="h-4 w-4" />
              Back to User
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
              {selectedUser?.full_name?.charAt(0)?.toUpperCase() ||
                selectedUser?.username?.charAt(0)?.toUpperCase() ||
                "U"}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
              <p className="text-gray-600 mt-1">
                Update user information and settings
              </p>
              {selectedUser && (
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(selectedUser.role)}`}>
                    <Shield className="h-3 w-3 mr-1" />
                    {selectedUser.role}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            <form
              onSubmit={handleSubmit}
              className="space-y-8 max-w-4xl mx-auto">
              {/* Personal Information Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-600" />
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      name="full_name"
                      value={form.full_name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <input
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="Enter username"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-gray-600" />
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  {/* Branch ID */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Branch ID
                    </label>
                    <select
                      name="branch_id"
                      value={form.branch_id || ""}
                      onChange={handleChange}
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
              </div>

              {/* Role & Status Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-gray-600" />
                  Role & Status
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Role */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      User Role
                    </label>
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required>
                      <option value="">Select Role</option>
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="cashier">Cashier</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <ToggleLeft className="h-4 w-4" />
                      Account Status
                    </label>
                    <select
                      name="is_active"
                      value={form.is_active}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-8 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center gap-2 px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    onClick={navigate}>
                    <Save className="h-4 w-4" />
                    {isLoading ? "Updating..." : "Update User"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditUserPage;
