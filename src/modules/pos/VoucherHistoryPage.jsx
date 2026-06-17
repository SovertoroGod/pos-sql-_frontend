import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, ChevronLeft, ChevronRight, Loader2, AlertCircle, Receipt,
  User, Building, Calendar, DollarSign, Hash,
} from "lucide-react";
import posService from "./posService";

const VoucherHistoryPage = () => {
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
    const fetchVouchers = async () => {
      setIsLoading(true);
      try {
        const params = { page, limit };
        if (dateFrom) params.startDate = dateFrom;
        if (dateTo) params.endDate = dateTo;
        const res = await posService.getVouchers(params);
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
    searchDebounce.current = setTimeout(fetchVouchers, 300);
    return () => { if (searchDebounce.current) clearTimeout(searchDebounce.current); };
  }, [page, dateFrom, dateTo, searchQuery]);

  const totalPages = metadata ? metadata.totalPages : 1;

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto w-full px-4 md:px-6">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Receipt className="h-6 w-6 text-emerald-600" />
          Voucher History
        </h1>
      </div>

      <div className="flex items-center gap-3 mb-4 shrink-0 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by code, customer name, or phone..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
        <span className="text-xs text-gray-400">to</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : vouchers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <AlertCircle className="h-12 w-12 mb-2" />
            <p className="text-sm">No vouchers found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {vouchers.map((voucher) => {
              const itemCount = voucher.items?.length || 0;
              const itemTotal = voucher.items?.reduce((s, i) => s + i.quantity, 0) || 0;
              return (
                <button
                  key={voucher.id}
                  onClick={() => navigate(`/pos/history/${voucher.id}`)}
                  className="w-full text-left bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Hash className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span className="font-mono font-semibold text-gray-900 text-sm">
                          {voucher.code}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {voucher.customer?.name || "Walk-in"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(voucher.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {voucher.purchase_type === "bank" && voucher.bank_account
                            ? voucher.bank_account.bank_name
                            : "Cash"}
                        </span>
                        <span className="text-gray-400">
                          {itemCount} item{itemCount !== 1 ? "s" : ""} ({itemTotal} qty)
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-gray-900">
                        ${Number(voucher.grand_total).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">
                        Paid: ${Number(voucher.amount_paid).toFixed(2)}
                      </p>
                      {Number(voucher.change_amount) > 0 && (
                        <p className="text-xs text-emerald-500">
                          Change: ${Number(voucher.change_amount).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {metadata && totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 pb-2 shrink-0 border-t border-gray-100 mt-4">
          <span className="text-xs text-gray-500">
            Page {metadata.currentPage} of {totalPages} ({metadata.totalItems} vouchers)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoucherHistoryPage;
