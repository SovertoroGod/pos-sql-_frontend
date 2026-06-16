import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  User,
  UserPlus,
  X,
  Package,
  Check,
  Receipt,
  Hash,
  DollarSign,
  Building,
  AlertCircle,
  Loader2,
  ChevronDown,
  Percent,
  Banknote,
  Landmark,
  Tag,
  BanknoteIcon,
  Eye,
} from "lucide-react";
import posService from "./posService";
import Swal from "sweetalert2";

const SalePage = () => {
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedProductList, setSelectedProductList] = useState("");
  const [selectedProductItem, setSelectedProductItem] = useState("");
  const [searchSku, setSearchSku] = useState("");
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [customerForm, setCustomerForm] = useState({ name: "", phone: "" });
  const [customerSearchResults, setCustomerSearchResults] = useState([]);
  const [customerSearchLoading, setCustomerSearchLoading] = useState(false);
  const [voucherCreated, setVoucherCreated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [voucherDiscountType, setVoucherDiscountType] = useState("percent");
  const [voucherDiscountValue, setVoucherDiscountValue] = useState(0);
  const [purchaseType, setPurchaseType] = useState("cash");
  const [selectedBankAccountId, setSelectedBankAccountId] = useState("");
  const [discountModal, setDiscountModal] = useState({ itemId: null, discountType: "percent", discountValue: 0 });
  const [showVoucherPreview, setShowVoucherPreview] = useState(false);
  const [amountPaid, setAmountPaid] = useState(0);
  const [customerMode, setCustomerMode] = useState("walk-in");
  const [customerExpanded, setCustomerExpanded] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");

  const [subcategories, setSubcategories] = useState([]);
  const [productLists, setProductLists] = useState([]);
  const [productItems, setProductItems] = useState([]);
  const [productUnitsMap, setProductUnitsMap] = useState({});
  const [bankAccounts, setBankAccounts] = useState([]);

  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [loadingProductLists, setLoadingProductLists] = useState(false);
  const [loadingProductItems, setLoadingProductItems] = useState(false);
  const [loadingUnits, setLoadingUnits] = useState(false);

  const searchDebounce = useRef(null);
  const customerSearchDebounce = useRef(null);

  useEffect(() => {
    const fetchInitial = async () => {
      setLoadingSubcategories(true);
      try {
        const res = await posService.getSubcategories();
        setSubcategories(res.data || []);
      } catch {
        setSubcategories([]);
      } finally {
        setLoadingSubcategories(false);
      }
      try {
        const res = await posService.getBankAccounts();
        setBankAccounts(res.data || []);
      } catch {
        setBankAccounts([]);
      }
      setLoadingUnits(true);
      try {
        const res = await posService.getProductUnitsForBranch();
        const units = res.data || [];
        const map = {};
        units.forEach((u) => { map[u.product_item_id] = u; });
        setProductUnitsMap(map);
      } catch {
        setProductUnitsMap({});
      } finally {
        setLoadingUnits(false);
      }
    };
    fetchInitial();
  }, []);

  useEffect(() => {
    if (!selectedSubcategory) {
      setProductLists([]);
      return;
    }
    setLoadingProductLists(true);
    setSelectedProductList("");
    setSelectedProductItem("");
    setSearchSku("");
    posService
      .getProductLists(selectedSubcategory)
      .then((res) => setProductLists(res.data || []))
      .catch(() => setProductLists([]))
      .finally(() => setLoadingProductLists(false));
  }, [selectedSubcategory]);

  useEffect(() => {
    if (!selectedProductList && !searchSku.trim()) {
      setProductItems([]);
      return;
    }
    setLoadingProductItems(true);
    const params = {};
    if (searchSku.trim()) {
      params.search = searchSku.trim();
    } else if (selectedProductList) {
      params.product_list_id = selectedProductList;
    }
    posService
      .getProductItems(params)
      .then((res) => setProductItems(res.data || []))
      .catch(() => setProductItems([]))
      .finally(() => setLoadingProductItems(false));
  }, [selectedProductList, searchSku]);

  useEffect(() => {
    if (customerSearchDebounce.current) clearTimeout(customerSearchDebounce.current);
    if (!customerSearchQuery.trim() || customerMode !== "old") {
      setCustomerSearchResults([]);
      return;
    }
    customerSearchDebounce.current = setTimeout(() => {
      setCustomerSearchLoading(true);
      posService
        .searchCustomers(customerSearchQuery.trim())
        .then((res) => setCustomerSearchResults(res.data || []))
        .catch(() => setCustomerSearchResults([]))
        .finally(() => setCustomerSearchLoading(false));
    }, 400);
    return () => clearTimeout(customerSearchDebounce.current);
  }, [customerSearchQuery, customerMode]);

  const handleSubcategoryChange = (e) => {
    setSelectedSubcategory(e.target.value);
    setSelectedProductList("");
    setSelectedProductItem("");
    setSearchSku("");
  };

  const handleProductListChange = (e) => {
    setSelectedProductList(e.target.value);
    setSelectedProductItem("");
    setSearchSku("");
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchSku(value);
    if (value.trim()) {
      setSelectedProductList("");
    }
  };

  const getItemUnit = (itemId) => {
    return productUnitsMap[itemId] || null;
  };

  const getMaxQty = (itemId) => {
    const unit = getItemUnit(itemId);
    return unit ? unit.quantity : 0;
  };

  const addToCart = (item) => {
    const unit = getItemUnit(item.id);
    const maxQty = unit ? unit.quantity : 0;
    const existing = cart.find((ci) => ci.id === item.id);
    const currentInCart = existing ? existing.quantity : 0;
    if (maxQty <= 0) return;
    const qty = 1;
    const totalRequested = currentInCart + qty;
    if (totalRequested > maxQty) {
      Swal.fire({
        icon: "warning",
        title: "Insufficient Stock",
        text: `Only ${maxQty} available. Already ${currentInCart} in cart.`,
      });
      return;
    }
    setCart((prev) => {
      const found = prev.find((ci) => ci.id === item.id);
      if (found) {
        return prev.map((ci) =>
          ci.id === item.id ? { ...ci, quantity: ci.quantity + qty } : ci,
        );
      }
      return [...prev, { ...item, quantity: qty, discountType: "percent", discountValue: 0 }];
    });
  };

  const updateCartQty = (itemId, delta) => {
    setCart((prev) =>
      prev
        .map((ci) => {
          if (ci.id !== itemId) return ci;
          const newQty = ci.quantity + delta;
          const unit = getItemUnit(itemId);
          const maxQty = unit ? unit.quantity : 0;
          if (newQty > maxQty) return ci;
          return { ...ci, quantity: Math.max(1, newQty) };
        })
    );
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((ci) => ci.id !== itemId));
  };

  const updateItemDiscount = (itemId, field, value) => {
    setCart((prev) =>
      prev.map((ci) => {
        if (ci.id !== itemId) return ci;
        const updated = { ...ci, [field]: value };
        if (field === "discountType") {
          updated.discountValue = 0;
        }
        return updated;
      })
    );
  };

  const calcItemSubtotal = (ci) => ci.price * ci.quantity;

  const calcItemDiscount = (ci) => {
    const sub = calcItemSubtotal(ci);
    if (ci.discountType === "percent") {
      return Math.min(sub, sub * (Math.min(ci.discountValue || 0, 100) / 100));
    }
    return Math.min(sub, ci.discountValue || 0);
  };

  const calcItemTotal = (ci) => calcItemSubtotal(ci) - calcItemDiscount(ci);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, ci) => sum + calcItemSubtotal(ci), 0);
  }, [cart]);

  const totalItemDiscounts = useMemo(() => {
    return cart.reduce((sum, ci) => sum + calcItemDiscount(ci), 0);
  }, [cart]);

  const afterItemDiscounts = subtotal - totalItemDiscounts;

  const voucherDiscount = useMemo(() => {
    if (!voucherDiscountValue || afterItemDiscounts <= 0) return 0;
    if (voucherDiscountType === "percent") {
      return afterItemDiscounts * (Math.min(voucherDiscountValue, 100) / 100);
    }
    return Math.min(voucherDiscountValue, afterItemDiscounts);
  }, [voucherDiscountType, voucherDiscountValue, afterItemDiscounts]);

  const grandTotal = afterItemDiscounts - voucherDiscount;
  const changeAmount = Math.max(0, amountPaid - grandTotal);
  const debtAmount = Math.max(0, grandTotal - amountPaid);

  const handleCreateVoucher = async () => {
    setIsLoading(true);
    try {
      const items = cart.map((ci) => ({
        product_item_id: ci.id,
        quantity: ci.quantity,
        discount_type: ci.discountType && ci.discountValue > 0 ? ci.discountType : undefined,
        discount_value: ci.discountValue || 0,
      }));
      const payload = {
        customer_id: customer?.id || undefined,
        purchase_type: purchaseType,
        bank_account_id: purchaseType === "bank" && selectedBankAccountId
          ? Number(selectedBankAccountId)
          : undefined,
        amount_paid: amountPaid,
        items,
        voucher_discount_type: voucherDiscountValue > 0 ? voucherDiscountType : undefined,
        voucher_discount_value: voucherDiscountValue || 0,
      };
      const res = await posService.createVoucher(payload);
      setVoucherCreated(true);
      setCart([]);
      setCustomer(null);
      setSelectedSubcategory("");
      setSelectedProductList("");
      setSelectedProductItem("");
      setSearchSku("");
      setVoucherDiscountValue(0);
      setVoucherDiscountType("percent");
      setPurchaseType("cash");
      setSelectedBankAccountId("");
      setCustomerMode("walk-in");
      setAmountPaid(0);
      const debtInfo = res.data?.debt;
      const changeInfo = res.data?.change_amount > 0 ? Number(res.data.change_amount).toFixed(2) : null;
      const parts = ["The voucher has been created successfully."];
      if (changeInfo) parts.push(`Change: $${changeInfo}`);
      if (debtInfo) parts.push(`Debt of $${Number(debtInfo.remaining_amount).toFixed(2)} created for this voucher.`);
      Swal.fire({
        icon: "success",
        title: "Voucher Created!",
        html: parts.join("<br>"),
        timer: 3000,
        showConfirmButton: false,
      });
      setTimeout(() => setVoucherCreated(false), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to create voucher";
      Swal.fire({ icon: "error", title: "Error", text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCustomer = async () => {
    try {
      const res = await posService.createCustomer({
        name: customerForm.name.trim(),
        phone: customerForm.phone.trim(),
      });
      const newCustomer = res.data;
      setCustomer(newCustomer);
      setCustomerForm({ name: "", phone: "" });
      setCustomerSearchResults([]);
      setCustomerMode("walk-in");
      Swal.fire({
        icon: "success",
        title: "Customer Created",
        text: `${newCustomer.name} has been saved.`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to create customer";
      Swal.fire({ icon: "error", title: "Error", text: msg });
    }
  };

  const isCustomerFormValid =
    customerForm.name.trim().length > 0 && customerForm.phone.trim().length > 0;

  const renderProductGrid = () => {
    const items = productItems;

    if (searchSku.trim() && items.length === 0 && !loadingProductItems && !selectedProductList) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Search className="h-12 w-12 mb-3" />
          <p className="text-lg font-medium text-gray-600">No products found</p>
          <p className="text-sm text-gray-400 mt-1">
            No product matches &quot;{searchSku}&quot;
          </p>
        </div>
      );
    }

    if (!selectedSubcategory) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Package className="h-12 w-12 mb-3" />
          <p className="text-lg font-medium text-gray-600">Select a subcategory</p>
          <p className="text-sm text-gray-400 mt-1">
            Choose a subcategory to see product lists
          </p>
        </div>
      );
    }

    if (productLists.length > 0 && !selectedProductList && !searchSku.trim()) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Package className="h-12 w-12 mb-3" />
          <p className="text-lg font-medium text-gray-600">Select a product list</p>
          <p className="text-sm text-gray-400 mt-1">
            Choose a product list to see available items
          </p>
        </div>
      );
    }

    if (loadingProductItems) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
          <span className="ml-3 text-gray-500">Loading products...</span>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <AlertCircle className="h-12 w-12 mb-3" />
          <p className="text-lg font-medium text-gray-600">No items available</p>
          <p className="text-sm text-gray-400 mt-1">
            This product list has no items yet
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => {
          const unit = getItemUnit(item.id);
          const stock = unit ? unit.quantity : 0;
          const inCart = cart.find((ci) => ci.id === item.id);
          return (
            <div
              key={item.id}
              className={`bg-white rounded-xl border shadow-sm p-4 flex flex-col transition-all duration-200 hover:shadow-md ${
                inCart ? "border-emerald-300 ring-2 ring-emerald-100" : "border-gray-200"
              }`}
            >
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate" title={item.name}>
                  {item.name}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Hash className="h-3 w-3 text-gray-400" />
                  <span className="text-xs font-mono text-gray-500">{item.sku}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <DollarSign className="h-3 w-3 text-emerald-500" />
                  <span className="text-sm font-bold text-gray-900">
                    {Number(item.price).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Building className="h-3 w-3 text-gray-400" />
                  <span className={`text-xs font-medium ${stock > 0 ? "text-gray-600" : "text-red-500"}`}>
                    {loadingUnits ? "..." : `Stock: ${stock}`}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => addToCart(item)}
                  disabled={stock <= 0}
                  className={`flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    stock <= 0
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : inCart
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  {inCart ? (
                    <>
                      <Check className="h-4 w-4" />
                      Added ({inCart.quantity})
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Add
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Receipt className="h-6 w-6 text-emerald-600" />
            Create Voucher
          </h2>
        </div>

        <div className="p-4 space-y-4 overflow-auto flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchSku}
              onChange={handleSearchChange}
              placeholder="Search by SKU or product name..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
            />
            {searchSku && (
              <button
                onClick={() => {
                  setSearchSku("");
                  setSelectedProductItem("");
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Subcategory
              </label>
              <div className="relative">
                <select
                  value={selectedSubcategory}
                  onChange={handleSubcategoryChange}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2.5 pr-8 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                >
                  <option value="">{loadingSubcategories ? "Loading..." : "Select subcategory"}</option>
                  {subcategories.map((sc) => (
                    <option key={sc.id} value={sc.id}>
                      {sc.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Product List
              </label>
              <div className="relative">
                <select
                  value={selectedProductList}
                  onChange={handleProductListChange}
                  disabled={!selectedSubcategory}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2.5 pr-8 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">
                    {loadingProductLists ? "Loading..." : "Select product list"}
                  </option>
                  {productLists.map((pl) => (
                    <option key={pl.id} value={pl.id}>
                      {pl.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {selectedSubcategory && !loadingProductLists && productLists.length === 0 && (
                <p className="text-xs text-red-500 mt-1">No product lists for this subcategory</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Product Item
              </label>
              <div className="relative">
                <select
                  value={selectedProductItem}
                  onChange={(e) => setSelectedProductItem(e.target.value)}
                  disabled={!selectedProductList && !searchSku.trim()}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2.5 pr-8 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">
                    {loadingProductItems ? "Loading..." : "Select product item"}
                  </option>
                  {productItems.map((pi) => {
                    const unit = getItemUnit(pi.id);
                    return (
                      <option key={pi.id} value={pi.id}>
                        {pi.name} - {pi.sku} {unit ? `(Stock: ${unit.quantity})` : "(No stock)"}
                      </option>
                    );
                  })}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {renderProductGrid()}
        </div>
      </div>

      <div className="w-[28rem] border-l border-gray-200 bg-white flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200 shrink-0">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-emerald-600" />
            Order
            {cart.length > 0 && (
              <span className="ml-auto text-sm font-normal text-gray-500">
                {cart.length} item{cart.length !== 1 ? "s" : ""}
              </span>
            )}
          </h3>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingCart className="h-20 w-20 mb-4" />
              <p className="text-xl font-semibold text-gray-600">Cart is empty</p>
              <p className="text-sm text-gray-400 mt-1 text-center px-4">
                Search or browse products and add them here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((ci) => {
                const itemSub = calcItemSubtotal(ci);
                const itemDisc = calcItemDiscount(ci);
                const itemTotal = calcItemTotal(ci);
                const unit = getItemUnit(ci.id);
                const maxQty = unit ? unit.quantity : 0;
                return (
                  <div
                    key={ci.id}
                    className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-gray-900 truncate">
                          {ci.name}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Hash className="h-3 w-3 text-gray-400" />
                          <span className="text-xs font-mono text-gray-500">{ci.sku}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-base font-bold text-gray-900">
                            ${itemTotal.toFixed(2)}
                          </span>
                          {itemDisc > 0 && (
                            <span className="text-xs text-red-500 line-through">
                              ${itemSub.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setDiscountModal({ itemId: ci.id, discountType: ci.discountType, discountValue: ci.discountValue })}
                          className={`p-1.5 rounded-lg transition-colors ${
                            itemDisc > 0
                              ? "text-red-500 hover:bg-red-50"
                              : "text-gray-400 hover:text-gray-600 hover:bg-gray-200"
                          }`}
                          title={itemDisc > 0 ? "Discount applied" : "Add discount"}
                        >
                          <Percent className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => removeFromCart(ci.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                      <span className="text-sm text-gray-600">
                        ${Number(ci.price).toFixed(2)} × {ci.quantity} = <strong className="text-gray-900">${(Number(ci.price) * ci.quantity).toFixed(2)}</strong>
                      </span>
                      <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                        <button
                          onClick={() => updateCartQty(ci.id, -1)}
                          disabled={ci.quantity <= 1}
                          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-l-lg"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {ci.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQty(ci.id, 1)}
                          disabled={ci.quantity >= maxQty}
                          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-r-lg"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    
                  </div>
                );
              })}
            </div>
          )}

          {cart.length > 0 && (<>
          <hr className="border-t border-gray-200" />

          <div>
            <button
              onClick={() => setCustomerExpanded((prev) => !prev)}
              className="w-full flex items-center justify-between py-1"
            >
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${customer ? "bg-emerald-100" : "bg-gray-100"}`}>
                  <User className={`h-3.5 w-3.5 ${customer ? "text-emerald-600" : "text-gray-500"}`} />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {customer ? customer.name : "Walk-in Customer"}
                </span>
                {customer && <span className="text-xs text-gray-400">{customer.phone}</span>}
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${customerExpanded ? "rotate-180" : ""}`} />
            </button>

            {customerExpanded && (
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setCustomerMode("walk-in"); setCustomer(null); setCustomerSearchQuery(""); setCustomerSearchResults([]); }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      customerMode === "walk-in" && !customer
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Walk-in
                  </button>
                  <button
                    onClick={() => setCustomerMode(customerMode === "old" ? "walk-in" : "old")}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      customerMode === "old"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Old Customer
                  </button>
                  <button
                    onClick={() => setCustomerMode(customerMode === "new" ? "walk-in" : "new")}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      customerMode === "new"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    New Customer
                  </button>
                </div>

                {customerMode === "old" && (
                  <div className="relative">
                    <input
                      type="text"
                      value={customerSearchQuery}
                      onChange={(e) => setCustomerSearchQuery(e.target.value)}
                      placeholder="Search by name or phone..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      autoFocus
                    />
                    {customerSearchQuery && (
                      <button
                        onClick={() => { setCustomerSearchQuery(""); setCustomerSearchResults([]); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    {customerSearchLoading && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 flex items-center gap-2 text-sm text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Searching...
                      </div>
                    )}
                    {!customerSearchLoading && customerSearchResults.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {customerSearchResults.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => {
                              setCustomer(c);
                              setCustomerMode("walk-in");
                              setCustomerSearchQuery("");
                              setCustomerSearchResults([]);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                          >
                            <User className="h-4 w-4 text-gray-400 shrink-0" />
                            <span className="font-medium text-gray-900">{c.name}</span>
                            <span className="text-gray-500 ml-auto">{c.phone}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {!customerSearchLoading && customerSearchQuery.trim() && customerSearchResults.length === 0 && (
                      <p className="text-xs text-gray-400 mt-1">No customers found</p>
                    )}
                  </div>
                )}

                {customerMode === "new" && (
                  <div className="space-y-2">
                    <input
                      type="tel"
                      value={customerForm.phone}
                      onChange={(e) => setCustomerForm((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="Phone number *"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={customerForm.name}
                      onChange={(e) => setCustomerForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Name *"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleCreateCustomer}
                      disabled={!isCustomerFormValid}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      <UserPlus className="h-4 w-4" />
                      Save Customer
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <hr className="border-t border-gray-200" />

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Purchase:</span>
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => { setPurchaseType("cash"); setSelectedBankAccountId(""); }}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  purchaseType === "cash"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Cash
              </button>
              <button
                onClick={() => setPurchaseType("bank")}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  purchaseType === "bank"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Bank
              </button>
            </div>
            {purchaseType === "bank" && (
              <div className="relative flex-1">
                <select
                  value={selectedBankAccountId}
                  onChange={(e) => setSelectedBankAccountId(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-2 py-1 pr-7 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Select account</option>
                  {bankAccounts.map((ba) => (
                    <option key={ba.id} value={ba.id}>
                      {ba.bank_name} - {ba.account_name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-1.5 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
            {totalItemDiscounts > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Item Discounts</span>
                <span className="font-medium text-red-500">-${totalItemDiscounts.toFixed(2)}</span>
              </div>
            )}

            <div className="flex items-center gap-2 py-1">
              <span className="text-xs text-gray-500">Disc:</span>
              <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => { setVoucherDiscountType("percent"); setVoucherDiscountValue(0); }}
                  className={`px-2 py-1 text-xs font-medium transition-colors ${
                    voucherDiscountType === "percent"
                      ? "bg-emerald-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >%</button>
                <button
                  onClick={() => { setVoucherDiscountType("fixed"); setVoucherDiscountValue(0); }}
                  className={`px-2 py-1 text-xs font-medium transition-colors ${
                    voucherDiscountType === "fixed"
                      ? "bg-emerald-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >$</button>
              </div>
              <div className="relative flex-1">
                <input
                  type="number"
                  min="0"
                  max={voucherDiscountType === "percent" ? 100 : afterItemDiscounts}
                  value={voucherDiscountValue}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setVoucherDiscountValue(Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder={voucherDiscountType === "percent" ? "0%" : "0.00"}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              {voucherDiscount > 0 && (
                <span className="text-xs text-red-500 font-medium shrink-0">-${voucherDiscount.toFixed(2)}</span>
              )}
            </div>

            <div className="flex items-center gap-2 py-1 pt-2 border-t border-gray-200">
              <span className="text-xs text-gray-500 shrink-0">Paid:</span>
              <input
                type="number"
                min="0"
                value={amountPaid}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setAmountPaid(Math.max(0, parseFloat(e.target.value) || 0))}
                placeholder="0.00"
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            {changeAmount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Change</span>
                <span className="font-medium text-emerald-600">${changeAmount.toFixed(2)}</span>
              </div>
            )}
            {debtAmount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Debt Created</span>
                <span className="font-medium text-orange-500">$${debtAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-lg font-bold text-emerald-600">${Math.max(0, grandTotal).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowVoucherPreview(true)}
              disabled={cart.length === 0}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-3 text-sm font-medium border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>
            <button
              onClick={handleCreateVoucher}
              disabled={cart.length === 0 || isLoading || (purchaseType === "bank" && !selectedBankAccountId)}
              className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 ${
                cart.length === 0 || isLoading || (purchaseType === "bank" && !selectedBankAccountId)
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow-md"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating Voucher...
                </>
              ) : voucherCreated ? (
                <>
                  <Check className="h-5 w-5" />
                  Voucher Created!
                </>
              ) : (
                <>
                  <Receipt className="h-5 w-5" />
                  Create Voucher — ${Math.max(0, grandTotal).toFixed(2)}
                </>
              )}
            </button>
          </div>
        </>)}
        </div>
      </div>

      {showVoucherPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Receipt className="h-5 w-5 text-emerald-600" />
                Voucher Preview
              </h3>
              <button
                onClick={() => setShowVoucherPreview(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">
                    {customer ? `${customer.name} (${customer.phone})` : "Walk-in Customer"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Purchase Type</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5 capitalize">
                    {purchaseType}{purchaseType === "bank" && selectedBankAccountId ? ` — ${bankAccounts.find(b => b.id === Number(selectedBankAccountId))?.bank_name || ""}` : ""}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Items</p>
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
                    {cart.map((ci, idx) => {
                      const itemDisc = calcItemDiscount(ci);
                      const itemTotal = calcItemTotal(ci);
                      return (
                        <tr key={ci.id} className="border-b border-gray-100">
                          <td className="py-2 pr-2 text-gray-400">{idx + 1}</td>
                          <td className="py-2 px-2">
                            <p className="font-medium text-gray-900">{ci.name}</p>
                            <p className="text-xs text-gray-400">{ci.sku}</p>
                          </td>
                          <td className="py-2 px-2 text-right text-gray-700">${Number(ci.price).toFixed(2)}</td>
                          <td className="py-2 px-2 text-right text-gray-700">{ci.quantity}</td>
                          <td className="py-2 px-2 text-right text-red-500">{itemDisc > 0 ? `-$${itemDisc.toFixed(2)}` : "—"}</td>
                          <td className="py-2 pl-2 text-right font-semibold text-gray-900">${itemTotal.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-gray-200 pt-3 space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                {totalItemDiscounts > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Item Discounts</span>
                    <span className="font-medium text-red-500">-${totalItemDiscounts.toFixed(2)}</span>
                  </div>
                )}
                {voucherDiscount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Voucher Discount</span>
                    <span className="font-medium text-red-500">-${voucherDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Amount Paid</span>
                  <span className="font-medium text-gray-900">${amountPaid.toFixed(2)}</span>
                </div>
                {changeAmount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Change</span>
                    <span className="font-medium text-emerald-600">${changeAmount.toFixed(2)}</span>
                  </div>
                )}
                {debtAmount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Debt</span>
                    <span className="font-medium text-orange-500">${debtAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-base pt-2 border-t border-gray-300">
                  <span className="font-bold text-gray-900">Grand Total</span>
                  <span className="text-lg font-bold text-emerald-600">${Math.max(0, grandTotal).toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end shrink-0">
              <button
                onClick={() => setShowVoucherPreview(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {discountModal.itemId !== null && (() => {
        const ci = cart.find((c) => c.id === discountModal.itemId);
        if (!ci) return null;
        const sub = calcItemSubtotal(ci);
        const disc = discountModal.discountType === "percent"
          ? Math.min(sub, sub * (Math.min(discountModal.discountValue || 0, 100) / 100))
          : Math.min(sub, discountModal.discountValue || 0);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Percent className="h-5 w-5 text-emerald-600" />
                  Item Discount
                </h3>
                <button
                  onClick={() => setDiscountModal({ itemId: null, discountType: "percent", discountValue: 0 })}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{ci.name}</p>
                  <p className="text-xs text-gray-500">{ci.sku} — ${Number(ci.price).toFixed(2)} × {ci.quantity}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Subtotal: ${sub.toFixed(2)}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Discount Type</label>
                  <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden w-fit">
                    <button
                      onClick={() => setDiscountModal((prev) => ({ ...prev, discountType: "percent", discountValue: 0 }))}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${
                        discountModal.discountType === "percent"
                          ? "bg-emerald-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >%</button>
                    <button
                      onClick={() => setDiscountModal((prev) => ({ ...prev, discountType: "fixed", discountValue: 0 }))}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${
                        discountModal.discountType === "fixed"
                          ? "bg-emerald-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >$</button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    {discountModal.discountType === "percent" ? "Discount Percent" : "Discount Amount"}
                  </label>
                <input
                  type="number"
                  min="0"
                  max={discountModal.discountType === "percent" ? 100 : sub}
                  value={discountModal.discountValue}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) =>
                    setDiscountModal((prev) => ({ ...prev, discountValue: Math.max(0, parseFloat(e.target.value) || 0) }))
                  }
                    placeholder={discountModal.discountType === "percent" ? "0%" : "0.00"}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
                {disc > 0 && (
                  <div className="flex items-center justify-between text-sm bg-red-50 rounded-lg px-3 py-2">
                    <span className="text-red-600 font-medium">Discount</span>
                    <span className="text-red-600 font-bold">−${disc.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setDiscountModal({ itemId: null, discountType: "percent", discountValue: 0 })}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      updateItemDiscount(discountModal.itemId, "discountType", discountModal.discountType);
                      updateItemDiscount(discountModal.itemId, "discountValue", discountModal.discountValue);
                      setDiscountModal({ itemId: null, discountType: "percent", discountValue: 0 });
                    }}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default SalePage;
