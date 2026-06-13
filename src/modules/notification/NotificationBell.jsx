import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, Info, Send, AlertTriangle, Check } from "lucide-react";
import { useDispatch } from "react-redux";
import { getMyNotifications, markAsRead, markAllAsRead } from "./notificationSlice";

const typeStyles = {
  transfer_request: "bg-blue-100 text-blue-700",
  transfer_received: "bg-green-100 text-green-700",
  transfer_cancelled: "bg-red-100 text-red-700",
  general: "bg-gray-100 text-gray-700",
};

const typeIcons = {
  transfer_request: Send,
  transfer_received: Check,
  transfer_cancelled: AlertTriangle,
  general: Info,
};

const NotificationBell = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const result = await dispatch(
        getMyNotifications({ page: 1, limit: 5 }),
      ).unwrap();
      setNotifications(result.data || []);
      setUnreadCount(
        (result.data || []).filter((n) => !n.is_read).length,
      );
    } catch {
      // silently fail
    }
  }, [dispatch]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkRead = async (id, e) => {
    e.stopPropagation();
    try {
      await dispatch(markAsRead(id)).unwrap();
      fetchNotifications();
    } catch {
      // silently fail
    }
  };

  const handleMarkAllRead = async (e) => {
    e.stopPropagation();
    try {
      await dispatch(markAllAsRead()).unwrap();
      fetchNotifications();
    } catch {
      // silently fail
    }
  };

  const handleViewAll = () => {
    setIsOpen(false);
    navigate("/admin/notifications");
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => {
                const TypeIcon = typeIcons[notif.type] || Info;
                return (
                  <div
                    key={notif.id}
                    className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notif.is_read ? "bg-blue-50" : ""
                    }`}
                    onClick={() => handleMarkRead(notif.id, { stopPropagation: () => {} })}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-1.5 rounded-lg shrink-0 ${
                          typeStyles[notif.type] || "bg-gray-100"
                        }`}
                      >
                        <TypeIcon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p
                            className={`text-xs font-semibold truncate ${
                              notif.is_read
                                ? "text-gray-600"
                                : "text-gray-900"
                            }`}
                          >
                            {notif.title}
                          </p>
                          {!notif.is_read && (
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                          {notif.message}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {formatDate(notif.created_at)}
                        </p>
                      </div>
                      {!notif.is_read && (
                        <button
                          onClick={(e) => handleMarkRead(notif.id, e)}
                          className="shrink-0 p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded transition-colors"
                          title="Mark as read"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-8 text-center">
                <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No notifications</p>
              </div>
            )}
          </div>

          <div className="px-4 py-2.5 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleViewAll}
              className="w-full text-center text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
