import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useBranchDetail from '../../hooks/useBranchDetail';
import useDeleteBranch from '../../hooks/useDeleteBranch';
import { Building2, ArrowLeft, MapPin, Phone, Mail, Calendar, Hash, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

const BranchDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { selectedBranch, isLoading } = useBranchDetail(id);
    const { handleDelete, isLoading: isDeleting } = useDeleteBranch();

    const handleEditPage = (branchId) => {
        navigate(`/admin/branches-edit/${branchId}`);
    };

    const handleDeleteBranch = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this! This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const res = await handleDelete(id);
                if (res.meta.requestStatus === 'fulfilled') {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Branch has been deleted.',
                        icon: 'success',
                        confirmButtonColor: '#3085d6'
                    });
                    navigate('/admin/branches');
                }
            } catch (error) {
                console.error('Delete error:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Something went wrong while deleting the branch.',
                    icon: 'error',
                    confirmButtonColor: '#3085d6'
                });
            }
        }
    };

    if (!id || isLoading) {
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
                                <span className="text-gray-600 text-lg">Loading branch details...</span>
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
                            <p className="text-gray-600 mb-4">The branch you're looking for doesn't exist or has been removed.</p>
                            <button
                                onClick={() => handleEditPage(id)}
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
                        onClick={() => navigate('/admin/branches')}
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Branches
                    </button>
                    <div className="flex items-center space-x-4">
                        <div className="p-4 bg-green-100 rounded-lg">
                            <Building2 className="h-8 w-8 text-green-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Branch Details</h1>
                            <p className="text-gray-600 mt-1">View and manage branch information</p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Branch Information Card */}
                    <div className="lg:col-span-2">
                        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                            <div className="p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Branch Information</h2>
                                
                                <div className="space-y-6">
                                    {/* Branch Name */}
                                    <div className="flex items-start space-x-4">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Building2 className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium text-gray-500">Branch Name</h3>
                                            <p className="text-lg font-semibold text-gray-900 mt-1">{selectedBranch.branch_name}</p>
                                        </div>
                                    </div>

                                    {/* Branch Code */}
                                    <div className="flex items-start space-x-4">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <Hash className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium text-gray-500">Branch Code</h3>
                                            <p className="text-lg font-semibold text-gray-900 mt-1 font-mono">{selectedBranch.branch_code}</p>
                                        </div>
                                    </div>

                                    {/* Branch ID */}
                                    <div className="flex items-start space-x-4">
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                            <Calendar className="h-5 w-5 text-gray-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium text-gray-500">Branch ID</h3>
                                            <p className="text-lg font-semibold text-gray-900 mt-1 font-mono">{selectedBranch.id}</p>
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="flex items-start space-x-4">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <MapPin className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium text-gray-500">Address</h3>
                                            <p className="text-lg font-semibold text-gray-900 mt-1">
                                                {selectedBranch.address || 'No address provided'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Phone Number */}
                                    <div className="flex items-start space-x-4">
                                        <div className="p-2 bg-indigo-100 rounded-lg">
                                            <Phone className="h-5 w-5 text-indigo-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                                            <p className="text-lg font-semibold text-gray-900 mt-1">
                                                {selectedBranch.phone_number || 'No phone number provided'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                            <div className="p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Status</h2>
                                
                                <div className="space-y-4">
                                    {/* Branch Status */}
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Branch Status</h3>
                                            <p className={`text-lg font-semibold ${selectedBranch.is_active ? 'text-green-600' : 'text-red-600'} mt-1`}>{selectedBranch.is_active ? 'Active' : 'Inactive'}</p>
                                        </div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="pt-4 border-t border-gray-200">
                                        <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Actions</h3>
                                        <div className="space-y-2">
                                            <button onClick={() => navigate(`/admin/branches-edit/${id}`)} className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
                                                Edit Branch
                                            </button>
                                            <button onClick={() => navigate(`/admin/branches-reports/${id}`)} className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors">
                                                View Reports
                                            </button>
                                            <button
                                                onClick={handleDeleteBranch}
                                                disabled={isDeleting}
                                                className="w-full inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isDeleting ? (
                                                    <>
                                                        <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Deleting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Delete Branch
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info Card */}
                        <div className="bg-white shadow-sm rounded-lg border border-gray-200 mt-6">
                            <div className="p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Created Date</span>
                                        <span className="text-sm font-medium text-gray-900">{new Date(selectedBranch.created_at).toLocaleDateString() || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Last Updated</span>
                                        <span className="text-sm font-medium text-gray-900">{new Date(selectedBranch.updated_at).toLocaleDateString() || "N/A"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BranchDetailPage;