import React, { useState, useRef, useEffect } from "react";
import useCreateUser from "../../hooks/useCreateUser";
import {
  User,
  Mail,
  Lock,
  Shield,
  Building2,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Search,
  ChevronDown,
  X,
} from "lucide-react";
import Swal from "sweetalert2";

const CreateUserPage = () => {
  const {
    form,
    branchesForUser,
    handleChange,
    handleSubmit,
    isLoading,
    navigate,
    branchSearch,
    setBranchSearch,
  } = useCreateUser();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const branchDropdownRef = useRef(null);

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "full_name":
        if (value.length < 2) {
          newErrors.full_name = "Full name must be at least 2 characters";
        } else {
          delete newErrors.full_name;
        }
        break;
      case "username":
        if (value.length < 3) {
          newErrors.username = "Username must be at least 3 characters";
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          newErrors.username =
            "Username can only contain letters, numbers, and underscores";
        } else {
          delete newErrors.username;
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;
      case "password":
        if (value.length < 6) {
          newErrors.password = "Password must be at least 6 characters";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          newErrors.password =
            "Password must contain uppercase, lowercase, and number";
        } else {
          delete newErrors.password;
        }
        break;
      case "role":
        if (!value) {
          newErrors.role = "Please select a role";
        } else {
          delete newErrors.role;
        }
        break;
      case "branch_id":
        if (!value) {
          newErrors.branch_id = "Please select a branch";
        } else {
          delete newErrors.branch_id;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(e);
    validateField(name, value);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, e.target.value);
  };

  const getFieldError = (fieldName) => {
    return touched[fieldName] && errors[fieldName];
  };

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

  const handleBranchSelect = (branchId, branchName) => {
    handleChange({ target: { name: "branch_id", value: branchId } });
    validateField("branch_id", branchId);
    setTouched({ ...touched, branch_id: true });
    setIsBranchDropdownOpen(false);
  };

  const getSelectedBranchName = () => {
    if (!form.branch_id) return "Select a branch";
    const selected = branchesForUser?.find((b) => b.id === form.branch_id);
    return selected
      ? `${selected.branch_name} - ${selected.branch_code}`
      : "Select a branch";
  };

  const isFormValid = () => {
    return (
      Object.keys(errors).length === 0 &&
      Object.values(form).every((value) => value !== "") &&
      !isLoading
    );
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    Object.keys(form).forEach((key) => {
      validateField(key, form[key]);
      setTouched((prev) => ({ ...prev, [key]: true }));
    });

    // Check if there are any errors
    if (
      Object.keys(errors).length > 0 ||
      Object.values(form).some((value) => value === "")
    ) {
      await Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill in all required fields correctly.",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    try {
      await handleSubmit(e);
      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "User created successfully.",
        confirmButtonColor: "#3b82f6",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to create user. Please try again.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin/users")}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </button>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Create New User
              </h1>
              <p className="text-gray-600 mt-1">
                Add a new user to your POS system
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="p-6">
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="full_name"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    placeholder="Enter full name"
                    value={form.full_name}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      getFieldError("full_name")
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    required
                  />
                  {getFieldError("full_name") && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {getFieldError("full_name") && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.full_name}
                  </p>
                )}
              </div>

              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  placeholder="Enter username"
                  value={form.username}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    getFieldError("username")
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  required
                />
                {getFieldError("username") && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    value={form.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      getFieldError("email")
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    required
                  />
                  {getFieldError("email") && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {getFieldError("email") && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={form.password}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      getFieldError("password")
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {getFieldError("password") && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 6 characters
                </p>
              </div>

              {/* Role */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="role"
                    name="role"
                    value={form.role}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none ${
                      getFieldError("role")
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    required>
                    <option value="">Select a role</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="cashier">Cashier</option>
                  </select>
                  {getFieldError("role") && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {getFieldError("role") && (
                  <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                )}
              </div>

              {/* Branch - Searchable Dropdown */}
              <div ref={branchDropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch
                </label>
                <div className="relative">
                  {/* Dropdown Trigger */}
                  <button
                    type="button"
                    onClick={() =>
                      setIsBranchDropdownOpen(!isBranchDropdownOpen)
                    }
                    className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-left bg-white ${
                      getFieldError("branch_id")
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <span
                      className={
                        form.branch_id ? "text-gray-900" : "text-gray-500"
                      }>
                      {getSelectedBranchName()}
                    </span>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <ChevronDown
                        className={`h-5 w-5 text-gray-400 transition-transform ${isBranchDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isBranchDropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
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
                            className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            autoFocus
                          />
                          {branchSearch && (
                            <button
                              type="button"
                              onClick={() => setBranchSearch("")}
                              className="absolute inset-y-0 right-0 pr-2 flex items-center">
                              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Branch List */}
                      <div className="overflow-y-auto max-h-48">
                        {branchesForUser && branchesForUser.length > 0 ? (
                          branchesForUser.map((branch) => (
                            <button
                              key={branch.id}
                              type="button"
                              onClick={() =>
                                handleBranchSelect(
                                  branch.id,
                                  branch.branch_name,
                                )
                              }
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

                  {getFieldError("branch_id") && (
                    <div className="absolute inset-y-0 right-0 pr-10 flex items-center pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {getFieldError("branch_id") && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.branch_id}
                  </p>
                )}
                {/* Hidden input for form validation */}
                <input
                  type="hidden"
                  name="branch_id"
                  value={form.branch_id}
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={!isFormValid()}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                    isFormValid()
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}>
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      Creating User...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Create User
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/admin/users")}
                  disabled={isLoading}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUserPage;
