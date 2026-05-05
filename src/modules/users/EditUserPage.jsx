import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useEditUser from "../../hooks/useEditUser";
import AdminLayout from "../../components/AdminLayout";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  User,
  Mail,
  Shield,
  Building,
  ToggleLeft,
  Save,
  X,
  Search,
  ChevronDown,
} from "lucide-react";

const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    selectedUser,
    form,
    branchesForUser,
    isLoading,
    handleChange,
    handleSubmit,
    handleCancel,
    branchSearch,
    setBranchSearch,
  } = useEditUser(id);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const branchDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        branchDropdownRef.current &&
        !branchDropdownRef.current.contains(event.target)
      ) {
        setIsBranchDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBranchSelect = (branchId) => {
    handleChange({ target: { name: "branch_id", value: branchId } });
    setIsBranchDropdownOpen(false);
  };

  const getSelectedBranchName = () => {
    if (!form.branch_id) return "Select Branch";
    const selected = branchesForUser?.find((b) => b.id === form.branch_id);
    return selected
      ? `${selected.branch_name} - ${selected.branch_code}`
      : "Select Branch";
  };

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

  // Handle form submission with SweetAlert
  const onSubmit = async (e) => {
    const result = await handleSubmit(e);
    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "User updated successfully.",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate(`/admin/users/${id}`);
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: result.error || "Failed to update user. Please try again.",
        confirmButtonColor: "#3b82f6",
      });
    }
  };

  return (
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
          <form onSubmit={onSubmit} className="space-y-8 max-w-4xl mx-auto">
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

                {/* Branch ID - Searchable Dropdown */}
                <div className="space-y-2 relative" ref={branchDropdownRef}>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Branch Code
                  </label>
                  {/* Dropdown Trigger */}
                  <button
                    type="button"
                    onClick={() =>
                      setIsBranchDropdownOpen(!isBranchDropdownOpen)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-left flex items-center justify-between">
                    <span
                      className={
                        form.branch_id ? "text-gray-900" : "text-gray-500"
                      }>
                      {getSelectedBranchName()}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-400 transition-transform ${isBranchDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isBranchDropdownOpen && (
                    <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                      {/* Search Input */}
                      <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            placeholder="Search branches..."
                            value={branchSearch}
                            onChange={(e) => setBranchSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            autoFocus
                          />
                        </div>
                      </div>

                      {/* Branch List */}
                      <div className="overflow-y-auto max-h-48">
                        {branchesForUser && branchesForUser.length > 0 ? (
                          branchesForUser.map((branch) => (
                            <button
                              key={branch.id}
                              type="button"
                              onClick={() => handleBranchSelect(branch.id)}
                              className={`w-full px-4 py-2 text-left text-sm hover:bg-blue-50 transition-colors ${
                                form.branch_id === branch.id
                                  ? "bg-blue-100 text-blue-900 font-medium"
                                  : "text-gray-700"
                              }`}>
                              <div className="font-medium">
                                {branch.branch_name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {branch.branch_code}
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-500 text-center">
                            {branchSearch
                              ? "No branches found"
                              : "Loading branches..."}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Hidden input for form submission */}
                  <input
                    type="hidden"
                    name="branch_id"
                    value={form.branch_id || ""}
                  />
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
                  className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg">
                  <Save className="h-4 w-4" />
                  {isLoading ? "Updating..." : "Update User"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserPage;
