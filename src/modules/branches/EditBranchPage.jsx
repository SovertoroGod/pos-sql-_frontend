import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useBranchDetail from '../../hooks/useBranchDetail';
import useUpdateBranch from '../../hooks/useUpdateBranch';
import Swal from 'sweetalert2';
import { Building2, ArrowLeft, MapPin, Phone, Hash, Save, X, AlertCircle, CheckCircle } from 'lucide-react';

const EditBranchPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { selectedBranch } = useBranchDetail(id);
    const { handleUpdate, isLoading } = useUpdateBranch();
    const [form, setForm] = useState({
        branch_name: "",
        branch_code: "",
        address: "",
        phone_number: "",
        is_active: true,
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (selectedBranch) {
            setForm({
                branch_name: selectedBranch.branch_name || "",
                branch_code: selectedBranch.branch_code || "",
                address: selectedBranch.address || "",
                phone_number: selectedBranch.phone_number || "",
                is_active: selectedBranch.is_active !== undefined ? selectedBranch.is_active : true
            });
        }
    }, [selectedBranch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setForm({ ...form, [name]: checked });
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!form.branch_name.trim()) {
            newErrors.branch_name = "Branch name is required";
        }
        
        if (!form.branch_code.trim()) {
            newErrors.branch_code = "Branch code is required";
        }
        
        if (!form.address.trim()) {
            newErrors.address = "Address is required";
        }
        
        if (!form.phone_number.trim()) {
            newErrors.phone_number = "Phone number is required";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await handleUpdate(id, form);
            if (res.meta.requestStatus === "fulfilled") {
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "Branch updated successfully.",
                    showConfirmButton: false,
                    timer: 1500,
                }).then(() => {
                    navigate("/admin/branches");
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: res.payload?.message || "Failed to update branch. Please try again.",
                    confirmButtonColor: "#16a34a",
                });
            }
        } catch (error) {
            console.error("Update error:", error);
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: error?.message || "An unexpected error occurred. Please try again.",
                confirmButtonColor: "#16a34a",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate(`/admin/branches/${id}`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="inline-flex items-center space-x-2">
                                <svg className="animate-spin h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="text-gray-600 text-lg">Loading branch data...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!selectedBranch) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Branch Not Found</h3>
                            <p className="text-gray-600 mb-4">The branch you're trying to edit doesn't exist.</p>
                            <button
                                onClick={() => navigate('/admin/branches')}
                                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Branches
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={handleCancel}
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Branch Details
                    </button>
                    <div className="flex items-center space-x-4">
                        <div className="p-4 bg-blue-100 rounded-lg">
                            <Building2 className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Edit Branch</h1>
                            <p className="text-gray-600 mt-1">Update branch information</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Branch Name */}
                            <div>
                                <label htmlFor="branch_name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Branch Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Building2 className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="branch_name"
                                        name="branch_name"
                                        value={form.branch_name}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                                            errors.branch_name ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter branch name"
                                    />
                                </div>
                                {errors.branch_name && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.branch_name}
                                    </p>
                                )}
                            </div>

                            {/* Branch Code */}
                            <div>
                                <label htmlFor="branch_code" className="block text-sm font-medium text-gray-700 mb-2">
                                    Branch Code
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Hash className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="branch_code"
                                        name="branch_code"
                                        value={form.branch_code}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                                            errors.branch_code ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter branch code"
                                    />
                                </div>
                                {errors.branch_code && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.branch_code}
                                    </p>
                                )}
                            </div>

                            {/* Address */}
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                                    Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-start pt-2 pointer-events-none">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <textarea
                                        id="address"
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        rows={3}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none ${
                                            errors.address ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter branch address"
                                    />
                                </div>
                                {errors.address && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.address}
                                    </p>
                                )}
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        id="phone_number"
                                        name="phone_number"
                                        value={form.phone_number}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                                            errors.phone_number ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter phone number"
                                    />
                                </div>
                                {errors.phone_number && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.phone_number}
                                    </p>
                                )}
                            </div>

                            {/* Status */}
                            <div>
                                <label htmlFor="is_active" className="block text-sm font-medium text-gray-700 mb-2">
                                    Branch Status
                                </label>
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            id="is_active"
                                            name="is_active"
                                            checked={form.is_active}
                                            onChange={handleCheckboxChange}
                                            className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
                                        />
                                    </div>
                                    <label htmlFor="is_active" className="text-sm text-gray-700 cursor-pointer">
                                        <span className="flex items-center">
                                            {form.is_active ? (
                                                <>
                                                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                                                    Active
                                                </>
                                            ) : (
                                                <>
                                                    <X className="h-4 w-4 text-red-600 mr-2" />
                                                    Inactive
                                                </>
                                            )}
                                        </span>
                                    </label>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    Active branches can be used in the system. Inactive branches are disabled.
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Update Branch
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditBranchPage;