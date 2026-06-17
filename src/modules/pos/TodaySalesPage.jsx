import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart, Loader2, AlertCircle, DollarSign, Receipt, Banknote,
  Building, ChevronRight, Calendar, Hash, User,
} from "lucide-react";
import posService from "./posService";

const today = () => {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
};

const TodaySalesPage = () => {
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchToday = async () => {
      setIsLoading(true);
      try {
        const dateStr = today();
        const res = await posService.getVouchers({ startDate: dateStr, endDate: dateStr, limit: 200 });
        setVouchers(res.data || []);
      } catch {
        setVouchers([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchToday();
  }, []);

  const totalSales = vouchers.reduce((s, v) => s + Number(v.grand_total), 0);
  const totalPaid = vouchers.reduce((s, v) => s + Number(v.amount_paid), 0);
  const totalChange = vouchers.reduce((s, v) => s + Number(v.change_amount), 0);
  const totalItems = vouchers.reduce((s, v) => s + (v.items || []).reduce((si, i) => si + i.quantity, 0), 0);
  const cashTotal = vouchers.filter((v) => v.purchase_type === "cash").reduce((s, v) => s + Number(v.grand_total), 0);
  const bankTotal = vouchers.filter((v) => v.purchase_type === "bank").reduce((s, v) => s + Number(v.grand_total), 0);

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto w-full px-4 md:px-6">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-emerald-600" />
          Today's Sales
        </h1>
        <span className="text-sm text-gray-400">{today()}</span>
      </div>

      <div className="flex-1 overflow-auto space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : vouchers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <ShoppingCart className="h-12 w-12 mb-2" />
            <p className="text-sm">No sales today</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-emerald-600 mb-1">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Sales</span>
                </div>
                <p className="text-xl font-bold text-gray-900">${totalSales.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-blue-500 mb-1">
                  <Receipt className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Vouchers</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{vouchers.length}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-orange-500 mb-1">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Items Sold</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{totalItems}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-purple-500 mb-1">
                  <Banknote className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Change</span>
                </div>
                <p className="text-xl font-bold text-gray-900">${totalChange.toFixed(2)}</p>
              </div>
            </div>

            {(cashTotal > 0 || bankTotal > 0) && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Payment Breakdown</h3>
                <div className="space-y-2">
                  {cashTotal > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5 text-gray-700">
                        <Banknote className="h-4 w-4 text-gray-400" /> Cash
                      </span>
                      <span className="font-semibold text-gray-900">${cashTotal.toFixed(2)}</span>
                    </div>
                  )}
                  {bankTotal > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5 text-gray-700">
                        <Building className="h-4 w-4 text-gray-400" /> Bank
                      </span>
                      <span className="font-semibold text-gray-900">${bankTotal.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
                    <span className="font-medium text-gray-900">Total Paid</span>
                    <span className="font-bold text-emerald-600">${totalPaid.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3">Today's Vouchers</h3>
              <div className="space-y-2">
                {vouchers.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => navigate(`/pos/history/${v.id}`)}
                    className="w-full text-left bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 flex items-center justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <Hash className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span className="font-mono font-semibold text-gray-900 text-sm">{v.code}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {v.customer?.name || "Walk-in"}
                        </span>
                        <span>{v.purchase_type === "bank" ? "Bank" : "Cash"}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-gray-900">${Number(v.grand_total).toFixed(2)}</p>
                      <p className="text-xs text-gray-400">${Number(v.amount_paid).toFixed(2)} paid</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-300 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TodaySalesPage;
