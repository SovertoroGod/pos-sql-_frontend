import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useManagerBankAccountHistory from "../../hooks/useManagerBankAccountHistory";
import {
  Landmark,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Calendar,
  TrendingUp,
  History,
  ChevronDown,
  ChevronUp,
  Search,
  X,
} from "lucide-react";

const ManagerBankAccountHistoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    startDate: "",
    endDate: "",
  });
  const [expandedMonths, setExpandedMonths] = useState({});

  const { account, data, aggregates, metadata, isLoading } = useManagerBankAccountHistory(id, filters);

  useEffect(() => {
    if (aggregates.length > 0) {
      const initial = {};
      aggregates.forEach((m) => {
        initial[m.month] = true;
      });
      setExpandedMonths(initial);
    }
  }, [aggregates]);

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleDateFilter = () => {
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  const clearDates = () => {
    setFilters((prev) => ({ ...prev, startDate: "", endDate: "", page: 1 }));
  };

  const toggleMonth = (month) => {
    setExpandedMonths((prev) => ({ ...prev, [month]: !prev[month] }));
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatMonthLabel = (month) => {
    const [year, m] = month.split("-");
    const date = new Date(year, parseInt(m) - 1);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  if (isLoading && !account) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="inline-flex items-center space-x-2">
              <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-600 text-lg">Loading history...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Landmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Bank Account Not Found</h3>
              <p className="text-gray-600 mb-4">The bank account you&apos;re looking for doesn&apos;t exist.</p>
              <button
                onClick={() => navigate("/manager/bank-accounts")}
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

  const totalIn = aggregates.reduce((sum, m) => sum + m.total, 0);
  const totalTx = aggregates.reduce((sum, m) => sum + m.count, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate("/manager/bank-accounts")}
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
              <h1 className="text-2xl font-bold text-gray-900">{account.account_name}</h1>
              <p className="text-gray-600 mt-1">
                {account.bank_name} | {account.account_number}
              </p>
              <p className="text-sm text-gray-500 mt-1">Branch transactions only</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Money In (Your Branch)</p>
                <p className="text-xl font-semibold text-green-600">{formatAmount(totalIn)} Ks</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <History className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Transactions (Your Branch)</p>
                <p className="text-xl font-semibold text-gray-900">{totalTx}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Months Tracked</p>
                <p className="text-xl font-semibold text-gray-900">{aggregates.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleDateFilter}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Search className="h-4 w-4 mr-2" />
              Filter
            </button>
            {(filters.startDate || filters.endDate) && (
              <button
                onClick={clearDates}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium rounded-lg transition-colors"
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Balance by Month (Your Branch)</h2>
          </div>
          <div className="p-4">
            {aggregates.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No transaction data available for your branch</p>
            ) : (
              <div className="space-y-3">
                {aggregates.map((monthData) => (
                  <div key={monthData.month} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleMonth(monthData.month)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-left">
                          <p className="font-medium text-gray-900">{formatMonthLabel(monthData.month)}</p>
                          <p className="text-sm text-gray-500">{monthData.count} transactions</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-semibold text-green-600">
                          +{formatAmount(monthData.total)} Ks
                        </span>
                        {expandedMonths[monthData.month] ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </button>
                    {expandedMonths[monthData.month] && monthData.days && (
                      <div className="border-t border-gray-200">
                        {Object.entries(monthData.days)
                          .sort(([a], [b]) => b.localeCompare(a))
                          .map(([day, dayData]) => (
                            <div key={day} className="flex items-center justify-between px-8 py-3 border-b border-gray-100 last:border-b-0">
                              <div>
                                <p className="text-sm font-medium text-gray-700">{formatDate(day)}</p>
                                <p className="text-xs text-gray-500">{dayData.count} transaction{dayData.count !== 1 ? "s" : ""}</p>
                              </div>
                              <span className="text-sm font-semibold text-green-600">
                                +{formatAmount(dayData.total)} Ks
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Transaction History (Your Branch)</h2>
          </div>
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-gray-600">Loading transactions...</span>
              </div>
            </div>
          ) : data.length === 0 ? (
            <div className="p-8 text-center">
              <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-600">
                {filters.startDate || filters.endDate
                  ? "Try adjusting your date range"
                  : "No transactions have been recorded for this account in your branch yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((tx) => (
                    <tr key={`${tx.type}-${tx.id}`} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(tx.created_at)}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(tx.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            tx.type === "voucher"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {tx.type === "voucher" ? "Sale" : "Repayment"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-900">{tx.reference}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{tx.customer}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">{tx.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm font-semibold text-green-600">
                          +{formatAmount(tx.amount)} Ks
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm font-semibold text-gray-900">
                          {formatAmount(tx.balance)} Ks
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {metadata.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((metadata.currentPage - 1) * metadata.limit) + 1} to{" "}
              {Math.min(metadata.currentPage * metadata.limit, metadata.totalItems)} of{" "}
              {metadata.totalItems} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(metadata.currentPage - 1)}
                disabled={metadata.currentPage === 1}
                className={`inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md transition-colors ${
                  metadata.currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, metadata.totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  const isActive = pageNum === metadata.currentPage;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => handlePageChange(metadata.currentPage + 1)}
                disabled={metadata.currentPage === metadata.totalPages}
                className={`inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md transition-colors ${
                  metadata.currentPage === metadata.totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerBankAccountHistoryPage;
