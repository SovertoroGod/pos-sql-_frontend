import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useBankAccountDetail from '../../hooks/useBankAccountDetail';
import useUpdateBankAccount from '../../hooks/useUpdateBankAccount';
import Swal from 'sweetalert2';
import { Landmark, ArrowLeft, Building2, Hash, Save, X, AlertCircle, CheckCircle } from 'lucide-react';

const EditBankAccountPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedBankAccount, isLoading } = useBankAccountDetail(id);
  const { handleUpdate } = useUpdateBankAccount();
  const [form, setForm] = useState({
    account_name: "",
    account_number: "",
    bank_name: "",
    is_active: true,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedBankAccount) {
      setForm({
        account_name: selectedBankAccount.account_name || "",
        account_number: selectedBankAccount.account_number || "",
        bank_name: selectedBankAccount.bank_name || "",
        is_active: selectedBankAccount.is_active !== undefined ? selectedBankAccount.is_active : true,
      });
    }
  }, [selectedBankAccount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
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
    if (!form.account_name.trim()) newErrors.account_name = "Account name is required";
    if (!form.account_number.trim()) newErrors.account_number = "Account number is required";
    if (!form.bank_name.trim()) newErrors.bank_name = "Bank name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const res = await handleUpdate(id, form);
      if (res.meta.requestStatus === "fulfilled") {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Bank account updated successfully.",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate("/admin/bank-accounts");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: res.payload?.message || "Failed to update bank account.",
          confirmButtonColor: "#2563eb",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error?.message || "An unexpected error occurred.",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="inline-flex items-center space-x-2">
              <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-600 text-lg">Loading bank account data...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedBankAccount) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Bank Account Not Found</h3>
              <p className="text-gray-600 mb-4">The bank account you&apos;re trying to edit doesn&apos;t exist.</p>
              <button
                onClick={() => navigate('/admin/bank-accounts')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Bank Accounts
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
        <div className="mb-8">
          <button
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
              <h1 className="text-2xl font-bold text-gray-900">Edit Bank Account</h1>
              <p className="text-gray-600 mt-1">Update bank account information</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="account_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Account Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Landmark className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="account_name"
                      name="account_name"
                      value={form.account_name}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.account_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter account name"
                    />
                  </div>
                  {errors.account_name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.account_name}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="account_number" className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Hash className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="account_number"
                      name="account_number"
                      value={form.account_number}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.account_number ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter account number"
                    />
                  </div>
                  {errors.account_number && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.account_number}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="bank_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="bank_name"
                    name="bank_name"
                    value={form.bank_name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.bank_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter bank name"
                  />
                </div>
                {errors.bank_name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.bank_name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Status
                </label>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="is_active"
                      name="is_active"
                      checked={form.is_active}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <label htmlFor="is_active" className="text-sm text-gray-700 cursor-pointer">
                    <span className="flex items-center">
                      {form.is_active ? (
                        <><CheckCircle className="h-4 w-4 text-green-600 mr-2" /> Active</>
                      ) : (
                        <><X className="h-4 w-4 text-red-600 mr-2" /> Inactive</>
                      )}
                    </span>
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Active accounts can be selected for transactions. Inactive accounts are hidden.
                </p>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/admin/bank-accounts')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                      Update Bank Account
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

export default EditBankAccountPage;