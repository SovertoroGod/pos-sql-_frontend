import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  ArrowLeft, Loader2, AlertCircle, User, Receipt, Building,
  Calendar, Hash, DollarSign, Banknote, XCircle,
} from "lucide-react";
import voucherService from "./voucherService";

const formatCurrency = (val) => Number(val || 0).toLocaleString();

const ManagerVoucherDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await voucherService.getVoucherById(id);
        setVoucher(res.data);
      } catch {
        setVoucher(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleCancel = async () => {
    const { value: reason } = await Swal.fire({
      title: "Cancel Voucher",
      text: `Are you sure you want to cancel voucher ${voucher?.code}?`,
      icon: "warning",
      input: "textarea",
      inputLabel: "Reason for cancellation (optional)",
      inputPlaceholder: "Enter reason...",
      inputAttributes: { rows: 3 },
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it",
      cancelButtonText: "No, keep it",
      reverseButtons: true,
      preConfirm: (inputValue) => {
        return inputValue || "";
      },
    });
    if (reason === undefined) return;

    setCancelling(true);
    try {
      await voucherService.cancelVoucher(id, reason);
      await Swal.fire({
        icon: "success",
        title: "Cancelled",
        text: `Voucher ${voucher?.code} has been cancelled`,
        timer: 2000,
        showConfirmButton: false,
      });
      const res = await voucherService.getVoucherById(id);
      setVoucher(res.data);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || err.message || "Failed to cancel voucher",
      });
    } finally {
      setCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!voucher) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <AlertCircle className="h-12 w-12 mb-2" />
        <p className="text-sm">Voucher not found</p>
        <button onClick={() => navigate("/manager/vouchers")} className="mt-4 text-sm text-teal-600 hover:underline">
          Back to voucher list
        </button>
      </div>
    );
  }

  const isCancelled = voucher.status === "cancelled";
  const totalItems = voucher.items?.reduce((s, i) => s + i.quantity, 0) || 0;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/manager/vouchers")}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Voucher Detail</h1>
        </div>
        {!isCancelled && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {cancelling ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            {cancelling ? "Cancelling..." : "Cancel Voucher"}
          </button>
        )}
      </div>

      {isCancelled && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800">Voucher Cancelled</p>
            <p className="text-xs text-red-600 mt-0.5">
              Cancelled on {new Date(voucher.cancelled_at).toLocaleString()}
              {voucher.canceller?.full_name ? ` by ${voucher.canceller.full_name}` : ""}
              {voucher.cancel_reason ? ` — Reason: ${voucher.cancel_reason}` : ""}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Voucher Code</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5 flex items-center gap-1.5">
              <Hash className="h-4 w-4 text-teal-500" />
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
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cashier</p>
            <p className="text-sm font-medium text-gray-900 mt-0.5">
              {voucher.cashier?.full_name || "-"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</p>
            <p className="text-sm font-medium text-gray-900 mt-0.5 flex items-center gap-1.5">
              <Building className="h-4 w-4 text-gray-400" />
              {voucher.purchase_type === "bank" && voucher.bank_account
                ? `${voucher.bank_account.bank_name} — ${voucher.bank_account.account_name}`
                : "Cash"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</p>
            <p className="mt-0.5">
              {isCancelled ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                  <XCircle className="h-3 w-3 mr-1" />
                  Cancelled
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                  Active
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Items ({totalItems} units)</h3>
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
                <td className="py-2 px-2 text-right text-gray-700">{formatCurrency(item.price)}</td>
                <td className="py-2 px-2 text-right text-gray-700">{item.quantity}</td>
                <td className="py-2 px-2 text-right text-red-500">
                  {Number(item.discount_value) > 0 ? `-${formatCurrency(item.discount_value)}` : "\u2014"}
                </td>
                <td className="py-2 pl-2 text-right font-semibold text-gray-900">{formatCurrency(item.line_total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Summary</h3>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium text-gray-900">{formatCurrency(voucher.subtotal)}</span>
            </div>
            {Number(voucher.total_item_discount) > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Item Discounts</span>
                <span className="font-medium text-red-500">-{formatCurrency(voucher.total_item_discount)}</span>
              </div>
            )}
            {Number(voucher.voucher_discount) > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Voucher Discount</span>
                <span className="font-medium text-red-500">-{formatCurrency(voucher.voucher_discount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
              <span className="font-semibold text-gray-700">Grand Total</span>
              <span className="text-base font-bold text-teal-600">{formatCurrency(voucher.grand_total)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Payment</h3>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Amount Paid</span>
              <span className="font-medium text-gray-900 flex items-center gap-1">
                <Banknote className="h-3.5 w-3.5 text-gray-400" />
                {formatCurrency(voucher.amount_paid)}
              </span>
            </div>
            {Number(voucher.change_amount) > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Change</span>
                <span className="font-medium text-teal-600">{formatCurrency(voucher.change_amount)}</span>
              </div>
            )}
            {voucher.debt && Number(voucher.debt.remaining_amount) > 0 && (
              <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
                <span className="text-gray-500">Debt Remaining</span>
                <span className={`font-medium ${voucher.debt.status === "written_off" ? "text-gray-400 line-through" : "text-orange-500"}`}>
                  {formatCurrency(voucher.debt.remaining_amount)}
                  {voucher.debt.status === "written_off" && " (written off)"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerVoucherDetailPage;
