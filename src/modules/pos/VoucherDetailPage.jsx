import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Loader2, AlertCircle, User, Receipt, Building,
  Calendar, Hash, DollarSign, Percent, Banknote,
} from "lucide-react";
import posService from "./posService";

const VoucherDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVoucher = async () => {
      setIsLoading(true);
      try {
        const res = await posService.getVoucherById(id);
        setVoucher(res.data);
      } catch {
        setVoucher(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVoucher();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!voucher) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <AlertCircle className="h-12 w-12 mb-2" />
        <p className="text-sm">Voucher not found</p>
        <button onClick={() => navigate("/pos/history")} className="mt-4 text-sm text-emerald-600 hover:underline">
          Back to voucher history
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto w-full px-4 md:px-6">
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <button
          onClick={() => navigate("/pos/history")}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Voucher Detail</h1>
      </div>

      <div className="flex-1 overflow-auto space-y-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Voucher Code</p>
              <p className="text-sm font-bold text-gray-900 mt-0.5 flex items-center gap-1.5">
                <Hash className="h-4 w-4 text-emerald-500" />
                {voucher.code}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</p>
              <p className="text-sm font-medium text-gray-900 mt-0.5 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gray-400" />
                {new Date(voucher.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</p>
              <p className="text-sm font-medium text-gray-900 mt-0.5 flex items-center gap-1.5">
                <User className="h-4 w-4 text-gray-400" />
                {voucher.customer?.name || "Walk-in"}
              </p>
              {voucher.customer?.phone && (
                <p className="text-xs text-gray-500 mt-0.5">{voucher.customer.phone}</p>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</p>
              <p className="text-sm font-medium text-gray-900 mt-0.5 flex items-center gap-1.5">
                <Building className="h-4 w-4 text-gray-400" />
                {voucher.purchase_type === "bank" && voucher.bank_account
                  ? `${voucher.bank_account.bank_name} — ${voucher.bank_account.account_name}`
                  : "Cash"}
              </p>
              {voucher.cashier && (
                <p className="text-xs text-gray-500 mt-0.5">Cashier: {voucher.cashier.full_name}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Items</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-2 font-medium text-gray-500">#</th>
                <th className="text-left py-2 px-2 font-medium text-gray-500">Item</th>
                <th className="text-right py-2 px-2 font-medium text-gray-500">Price</th>
                <th className="text-right py-2 px-2 font-medium text-gray-500">Qty</th>
                <th className="text-right py-2 px-2 font-medium text-gray-500">Disc</th>
                <th className="text-right py-2 pl-2 font-medium text-gray-500">Total</th>
              </tr>
            </thead>
            <tbody>
              {voucher.items.map((item, idx) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-2 pr-2 text-gray-400">{idx + 1}</td>
                  <td className="py-2 px-2">
                    <p className="font-medium text-gray-900">{item.product_name}</p>
                    <p className="text-xs text-gray-400">{item.sku}</p>
                  </td>
                  <td className="py-2 px-2 text-right text-gray-700">${Number(item.price).toFixed(2)}</td>
                  <td className="py-2 px-2 text-right text-gray-700">{item.quantity}</td>
                  <td className="py-2 px-2 text-right text-red-500">
                    {Number(item.discount_value) > 0 ? `-$${Number(item.discount_value).toFixed(2)}` : "\u2014"}
                  </td>
                  <td className="py-2 pl-2 text-right font-semibold text-gray-900">${Number(item.line_total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium text-gray-900">${Number(voucher.subtotal).toFixed(2)}</span>
            </div>
            {Number(voucher.total_item_discount) > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Item Discounts</span>
                <span className="font-medium text-red-500">-${Number(voucher.total_item_discount).toFixed(2)}</span>
              </div>
            )}
            {Number(voucher.voucher_discount) > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Voucher Discount</span>
                <span className="font-medium text-red-500">-${Number(voucher.voucher_discount).toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Grand Total</span>
              <span className="text-base font-bold text-emerald-600">${Number(voucher.grand_total).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Amount Paid</span>
              <span className="font-medium text-gray-900 flex items-center gap-1">
                <Banknote className="h-3.5 w-3.5 text-gray-400" />
                ${Number(voucher.amount_paid).toFixed(2)}
              </span>
            </div>
            {Number(voucher.change_amount) > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Change</span>
                <span className="font-medium text-emerald-600">${Number(voucher.change_amount).toFixed(2)}</span>
              </div>
            )}
            {voucher.debt && Number(voucher.debt.remaining_amount) > 0 && (
              <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
                <span className="text-gray-500">Debt Remaining</span>
                <button
                  onClick={() => navigate(`/pos/debts/${voucher.debt.id}`)}
                  className="font-medium text-orange-500 hover:text-orange-600 underline"
                >
                  ${Number(voucher.debt.remaining_amount).toFixed(2)}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoucherDetailPage;
