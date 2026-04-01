import { useState, useEffect, useRef } from "react";
import axiosInstance from "../api/axiosInstance";
import { Link, useNavigate } from "react-router";
import { 
  FiBell, 
  FiCheckCircle, 
  FiXCircle, 
  FiInfo, 
  FiDollarSign, 
  FiShield, 
  FiClock 
} from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get("/notifications");
      setNotifications(res.data.notifications);
      
      const unreadRes = await axiosInstance.get("/notifications/unread-count");
      setUnreadCount(unreadRes.data.count);
    } catch (err) {
      console.error("Failed to fetch notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Refresh every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = async () => {
    try {
      await axiosInstance.patch("/notifications/read-all");
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all as read");
    }
  };

  const markRead = async (id) => {
    try {
      await axiosInstance.patch(`/notifications/${id}/read`);
      setUnreadCount(prev => Math.max(0, prev - 1));
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error("Failed to mark as read");
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'verification_update': return <FiShield className="text-blue-500" />;
      case 'new_verification_request': return <FiShield className="text-orange-500" />;
      case 'donation': return <FiDollarSign className="text-green-500" />;
      case 'account_suspension': return <FiXCircle className="text-red-500" />;
      case 'campaign_status': return <FiCheckCircle className="text-primary" />;
      default: return <FiInfo className="text-gray-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-primary transition-all rounded-xl hover:bg-neutral group cursor-pointer"
      >
        <FiBell className={`text-xl ${unreadCount > 0 ? 'animate-bounce' : ''}`} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden z-[60] animate-in slide-in-from-top-2 duration-300">
          <div className="p-5 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllRead}
                className="text-[10px] font-black uppercase text-primary hover:underline cursor-pointer"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-10 text-center">
                <FiBell className="text-4xl text-gray-100 mx-auto mb-3" />
                <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n._id}
                  onClick={() => {
                    if (!n.isRead) markRead(n._id);
                    if (n.link) {
                        setIsOpen(false);
                        navigate(n.link);
                    }
                  }}
                  className={`p-4 border-b border-gray-50 last:border-0 hover:bg-neutral transition-all cursor-pointer flex gap-4 ${!n.isRead ? 'bg-primary/[0.02]' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${n.isRead ? 'bg-gray-50' : 'bg-white shadow-sm border border-gray-100'}`}>
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[11px] leading-tight mb-1 ${!n.isRead ? 'font-black text-gray-900' : 'font-bold text-gray-500'}`}>
                      {n.title}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-[8px] font-black uppercase tracking-widest text-gray-300">
                      <FiClock size={10} />
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                  {!n.isRead && (
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-4 bg-gray-50 text-center">
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Your Humanitarian History</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
