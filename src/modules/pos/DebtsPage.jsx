import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight, Loader2, AlertCircle, User, BookOpen, Filter } from "lucide-react";
import posService from "./posService";

const statusBadge = (status) => {
  const styles = {
    pending: "bg-orange-100 text-orange-700",
    paid: "bg-emerald-100 text-emerald-700",
    written_off: "bg-gray-100 text-gray-500",
  };
  return `px-2 py-0.5 rounded-full text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-600"}`;
};

const DebtsPage = () => {
  const navigate = useNavigate();
  const [debts, setDebts] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const searchDebounce = useRef(null);
  const limit = 15;

  useEffect(() => {
    const fetchDebts = async () => {
      setIsLoading(true);
      try {
        const params = { page, limit };
        if (statusFilter) params.status = statusFilter;
        const res = await posService.getDebts(params);
        let data = res.data || [];
        if (searchQuery.trim()) {
          const q = searchQuery.trim().toLowerCase();
          data = data.filter(
            (d) =>
              d.customer?.name?.toLowerCase().includes(q) ||
              d.customer?.phone?.includes(q) ||
              d.voucher?.code?.toLowerCase().includes(q)
          );
        }
        setDebts(data);
        setMetadata(res._metadata);
      } catch {
        setDebts([]);
      } finally {
        setIsLoading(false);
      }
    };
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(fetchDebts, 300);
    return () => { if (searchDebounce.current) clearTimeout(searchDebounce.current); };
  }, [page, statusFilter, searchQuery]);

  const totalPages = metadata ? metadata.totalPages : 1;

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto w-full px-4 md:px-6">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-emerald-600" />
          Debts
        </h1>
      </div>

      <div className="flex items-center gap-3 mb-4 shrink-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer name, phone, or voucher code..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="written_off">Written Off</option>
        </select>
      </div>

      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : debts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <AlertCircle className="h-12 w-12 mb-2" />
            <p className="text-sm">No debts found</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {debts.map((debt) => (
              <button
                key={debt.id}
                onClick={() => navigate(`/pos/debts/${debt.id}`)}
                className="w-full text-left bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 text-sm truncate">
                        {debt.customer?.name || "Unknown"}
                      </span>
                      <span className={statusBadge(debt.status)}>
                        {debt.status === "written_off" ? "Written Off" : debt.status.charAt(0).toUpperCase() + debt.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {debt.customer?.phone || "—"}
                      </span>
                      <span>Voucher: {debt.voucher?.code || "—"}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900">${Number(debt.remaining_amount).toFixed(2)}</p>
                    <p className="text-xs text-gray-400">of ${Number(debt.total_amount).toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all bg-emerald-500"
                    style={{
                      width: `${Number(debt.total_amount) > 0
                        ? Math.round((Number(debt.paid_amount) / Number(debt.total_amount)) * 100)
                        : 0}%`
                    }}
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {metadata && totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 pb-2 shrink-0 border-t border-gray-100 mt-4">
          <span className="text-xs text-gray-500">
            Page {metadata.currentPage} of {totalPages} ({metadata.totalItems} debts)
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

export default DebtsPage;
