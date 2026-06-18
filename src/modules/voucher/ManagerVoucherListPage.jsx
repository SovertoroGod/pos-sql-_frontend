import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, ChevronLeft, ChevronRight, Loader2, AlertCircle, Receipt,
  User, Calendar, DollarSign, Hash, XCircle, CheckCircle,
} from "lucide-react";
import voucherService from "./voucherService";

const ManagerVoucherListPage = () => {
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const searchDebounce = useRef(null);
  const limit = 15;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const params = { page, limit };
        if (dateFrom) params.startDate = dateFrom;
        if (dateTo) params.endDate = dateTo;
        const res = await voucherService.getVouchers(params);
        let data = res.data || [];
        if (searchQuery.trim()) {
          const q = searchQuery.trim().toLowerCase();
          data = data.filter(
            (v) =>
              v.code?.toLowerCase().includes(q) ||
              v.customer?.name?.toLowerCase().includes(q) ||
              v.customer?.phone?.includes(q)
          );
        }
        setVouchers(data);
        setMetadata(res._metadata);
      } catch {
        setVouchers([]);
      } finally {
        setIsLoading(false);
      }
    };
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(fetchData, 300);
    return () => { if (searchDebounce.current) clearTimeout(searchDebounce.current); };
  }, [page, dateFrom, dateTo, searchQuery]);

  const totalPages = metadata ? metadata.totalPages : 1;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Receipt className="h-8 w-8 text-teal-600" />
          Vouchers
        </h1>
        <p className="text-gray-500 mt-1">View and manage vouchers in your branch</p>
      </div>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by code, customer name, or phone..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
        <span className="text-xs text-gray-400">to</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          </div>
        ) : vouchers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <AlertCircle className="h-12 w-12 mb-2" />
            <p className="text-sm">No vouchers found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">No.</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cashier</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Grand Total</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Paid</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vouchers.map((voucher, index) => {
                    const itemCount = voucher.items?.length || 0;
                    const isCancelled = voucher.status === "cancelled";
                    return (
                      <tr
                        key={voucher.id}
                        onClick={() => navigate(`/manager/vouchers/${voucher.id}`)}
                        className={`hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${isCancelled ? "opacity-60" : ""}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(page - 1) * limit + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-mono font-semibold text-sm text-gray-900 flex items-center gap-1.5">
                            <Hash className="h-3.5 w-3.5 text-teal-500" />
                            {voucher.code}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <span className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-gray-400" />
                            {voucher.customer?.name || "Walk-in"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {voucher.cashier?.full_name || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-gray-400" />
                            {new Date(voucher.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {itemCount} item{itemCount !== 1 ? "s" : ""}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                          <span className="flex items-center justify-end gap-1">
                            <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                            {Number(voucher.grand_total).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                          {Number(voucher.amount_paid).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {isCancelled ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                              <XCircle className="h-3 w-3 mr-1" />
                              Cancelled
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {metadata && totalPages > 1 && (
              <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Page {metadata.currentPage} of {totalPages} ({metadata.totalItems} vouchers)
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ManagerVoucherListPage;
