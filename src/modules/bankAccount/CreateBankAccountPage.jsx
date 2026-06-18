import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useBankAccountCreate from '../../hooks/useBankAccountCreate';
import { ArrowLeft, Landmark, Building2, Hash, Save } from 'lucide-react';
import Swal from 'sweetalert2';

const CreateBankAccountPage = () => {
  const navigate = useNavigate();
  const { handleCreate, isLoading, message } = useBankAccountCreate();
  const [form, setForm] = useState({
    account_name: "",
    account_number: "",
    bank_name: "",
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
        text: 'Bank account created successfully.',
        icon: 'success',
        confirmButtonColor: '#2563eb'
      });
      navigate("/admin/bank-accounts");
    } else {
      Swal.fire({
        title: 'Error!',
        text: res.payload || message || 'Failed to create bank account.',
        icon: 'error',
        confirmButtonColor: '#e3342f'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate('/admin/bank-accounts')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bank Accounts
          </button>
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-blue-100 rounded-lg">
              <Landmark className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Bank Account</h1>
              <p className="text-gray-600 mt-1">Add a new bank account for the POS system</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="account_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Account Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Landmark className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="account_name"
                      id="account_name"
                      value={form.account_name}
                      onChange={handleChange}
                      required
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="e.g. Main Operating Account"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="account_number" className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Hash className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="account_number"
                      id="account_number"
                      value={form.account_number}
                      onChange={handleChange}
                      required
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono"
                      placeholder="e.g. 1234567890"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="bank_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="bank_name"
                    id="bank_name"
                    value={form.bank_name}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g. Bank of America"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/admin/bank-accounts')}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
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
                      Create Bank Account
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

export default CreateBankAccountPage;