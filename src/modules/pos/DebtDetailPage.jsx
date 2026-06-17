import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle, User, Receipt, Building, Banknote, Calendar } from "lucide-react";
import posService from "./posService";
import Swal from "sweetalert2";

const statusBadge = (status) => {
  const styles = {
    pending: "bg-orange-100 text-orange-700",
    paid: "bg-emerald-100 text-emerald-700",
    written_off: "bg-gray-100 text-gray-500",
  };
  return `px-2 py-0.5 rounded-full text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-600"}`;
};

const DebtDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [debt, setDebt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [repayAmount, setRepayAmount] = useState("");
  const [repayType, setRepayType] = useState("cash");
  const [repayBankAccount, setRepayBankAccount] = useState("");
  const [repayNotes, setRepayNotes] = useState("");
  const [bankAccounts, setBankAccounts] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDebt = async () => {
      setIsLoading(true);
      try {
        const [debtRes, bankRes] = await Promise.all([
          posService.getDebtById(id),
          posService.getBankAccounts(),
        ]);
        setDebt(debtRes.data);
        setBankAccounts(bankRes.data || []);
      } catch {
        setDebt(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDebt();
  }, [id]);

  const handleRepay = async () => {
    const amount = parseFloat(repayAmount);
    if (!amount || amount <= 0) {
      Swal.fire({ icon: "error", title: "Error", text: "Enter a valid amount" });
      return;
    }
    if (amount > Number(debt.remaining_amount)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Amount exceeds remaining debt of $${Number(debt.remaining_amount).toFixed(2)}`,
      });
      return;
    }
    if (repayType === "bank" && !repayBankAccount) {
      Swal.fire({ icon: "error", title: "Error", text: "Select a bank account" });
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        amount,
        payment_type: repayType,
        notes: repayNotes || undefined,
      };
      if (repayType === "bank") {
        payload.bank_account_id = Number(repayBankAccount);
      }
      await posService.repayDebt(id, payload);
      Swal.fire({
        icon: "success",
        title: "Repayment Recorded",
        text: `$${amount.toFixed(2)} has been applied to this debt.`,
        timer: 2000,
        showConfirmButton: false,
      });
      setRepayAmount("");
      setRepayNotes("");
      const debtRes = await posService.getDebtById(id);
      setDebt(debtRes.data);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to record repayment";
      Swal.fire({ icon: "error", title: "Error", text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!debt) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <AlertCircle className="h-12 w-12 mb-2" />
        <p className="text-sm">Debt not found</p>
        <button onClick={() => navigate("/pos/debts")} className="mt-4 text-sm text-emerald-600 hover:underline">
          Back to debts
        </button>
      </div>
    );
  }

  const remaining = Number(debt.remaining_amount);
  const paid = Number(debt.paid_amount);
  const total = Number(debt.total_amount);
  const progressPct = total > 0 ? Math.round((paid / total) * 100) : 0;
  const isDebtPaid = debt.status === "paid" || debt.status === "written_off";

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <button
          onClick={() => navigate("/pos/debts")}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Debt Detail</h1>
        <span className={statusBadge(debt.status)}>
          {debt.status === "written_off" ? "Written Off" : debt.status.charAt(0).toUpperCase() + debt.status.slice(1)}
        </span>
      </div>

      <div className="flex-1 overflow-auto space-y-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</p>
              <p className="text-sm font-medium text-gray-900 mt-0.5 flex items-center gap-1.5">
                <User className="h-4 w-4 text-gray-400" />
                {debt.customer?.name || "Unknown"}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{debt.customer?.phone || "—"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Voucher</p>
              <p className="text-sm font-medium text-gray-900 mt-0.5 flex items-center gap-1.5">
                <Receipt className="h-4 w-4 text-gray-400" />
                {debt.voucher?.code || "—"}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                <Calendar className="h-3 w-3 inline mr-0.5" />
                {new Date(debt.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Total Amount</span>
              <span className="text-sm font-semibold text-gray-900">${total.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Paid</span>
              <span className="text-sm font-semibold text-emerald-600">${paid.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">Remaining</span>
              <span className="text-sm font-bold text-orange-500">${remaining.toFixed(2)}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all bg-emerald-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1 text-right">{progressPct}% paid</p>
          </div>
        </div>

        {!isDebtPaid && (
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Make Repayment</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Amount ($)
                </label>
                <input
                  type="number"
                  min="0.01"
                  max={remaining}
                  value={repayAmount || ''}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setRepayAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder="0.00"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Payment Type
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setRepayType("cash"); setRepayBankAccount(""); }}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-xl border transition-colors ${
                      repayType === "cash"
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <Banknote className="h-4 w-4 inline mr-1" /> Cash
                  </button>
                  <button
                    onClick={() => setRepayType("bank")}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-xl border transition-colors ${
                      repayType === "bank"
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <Building className="h-4 w-4 inline mr-1" /> Bank
                  </button>
                </div>
              </div>
              {repayType === "bank" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Bank Account
                  </label>
                  <select
                    value={repayBankAccount}
                    onChange={(e) => setRepayBankAccount(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Select account</option>
                    {bankAccounts.map((ba) => (
                      <option key={ba.id} value={ba.id}>
                        {ba.bank_name} — {ba.account_name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Notes (optional)
                </label>
                <input
                  type="text"
                  value={repayNotes}
                  onChange={(e) => setRepayNotes(e.target.value)}
                  placeholder="Add a note..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleRepay}
                disabled={submitting || !repayAmount || parseFloat(repayAmount) <= 0}
                className="w-full px-4 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                  </span>
                ) : (
                  `Record Payment — $${(parseFloat(repayAmount) || 0).toFixed(2)}`
                )}
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Repayment History</h3>
          {debt.repayments.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No repayments recorded yet</p>
          ) : (
            <div className="space-y-2">
              {debt.repayments.map((rp) => (
                <div key={rp.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {rp.payment_type === "bank" ? "Bank Transfer" : "Cash"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(rp.created_at).toLocaleString()}
                      {rp.bank_account && ` — ${rp.bank_account.bank_name}`}
                    </p>
                    {rp.notes && <p className="text-xs text-gray-400 mt-0.5">{rp.notes}</p>}
                  </div>
                  <span className="text-sm font-bold text-emerald-600">-${Number(rp.amount).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebtDetailPage;
