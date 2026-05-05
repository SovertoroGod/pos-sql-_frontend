import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useBranchCreate from '../../hooks/useBranchCreate';
import { ArrowLeft, Building2, Hash, MapPin, Phone, Save } from 'lucide-react';
import Swal from 'sweetalert2';

const CreateBranchPage = () => {
    const navigate = useNavigate();
    const { handleCreate, isLoading, message } = useBranchCreate();
    const [form, setForm] = useState({
        branch_name: "",
        branch_code: "",
        address: "",
        phone_number: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await handleCreate(form);
        if (res.meta.requestStatus === "fulfilled") {
            Swal.fire({
                title: 'Success!',
                text: 'Branch created successfully.',
                icon: 'success',
                confirmButtonColor: '#16a34a'
            });
            navigate("/admin/branches");
        } else {
            Swal.fire({
                title: 'Error!',
                text: res.payload || message || 'Failed to create branch.',
                icon: 'error',
                confirmButtonColor: '#e3342f'
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        type="button"
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
                            <h1 className="text-2xl font-bold text-gray-900">Create New Branch</h1>
                            <p className="text-gray-600 mt-1">Add a new branch location to your POS system</p>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Branch Name */}
                                <div>
                                    <label htmlFor="branch_name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Branch Name <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Building2 className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="branch_name"
                                            id="branch_name"
                                            value={form.branch_name}
                                            onChange={handleChange}
                                            required
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                            placeholder="e.g. Main Street"
                                        />
                                    </div>
                                </div>

                                {/* Branch Code */}
                                <div>
                                    <label htmlFor="branch_code" className="block text-sm font-medium text-gray-700 mb-1">
                                        Branch Code <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Hash className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="branch_code"
                                            id="branch_code"
                                            value={form.branch_code}
                                            onChange={handleChange}
                                            required
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 sm:text-sm font-mono uppercase"
                                            placeholder="e.g. BR-001"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                    Address <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="address"
                                        id="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        required
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        placeholder="Full address of the branch"
                                    />
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="phone_number"
                                        id="phone_number"
                                        value={form.phone_number}
                                        onChange={handleChange}
                                        required
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        placeholder="Contact phone number"
                                    />
                                </div>
                            </div>



                            {/* Form Actions */}
                            <div className="pt-6 border-t border-gray-200 flex items-center justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => navigate('/admin/branches')}
                                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Create Branch
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

export default CreateBranchPage;