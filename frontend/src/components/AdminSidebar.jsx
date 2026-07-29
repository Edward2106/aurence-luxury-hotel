import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SafeImage } from './SafeImage';
import {
  LayoutDashboard,
  Building2,
  BedDouble,
  CalendarCheck,
  Users,
  UserCheck,
  Star,
  BarChart3,
  Settings,
  Crown,
  LogOut,
  ChevronRight,
  X,
  Sparkles
} from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';

export const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { currentUser, logout } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();

  const adminMenu = [
    { name: 'Tổng Quan', path: '/admin', icon: LayoutDashboard },
    { name: 'Quản Lý Khách Sạn', path: '/admin/hotels', icon: Building2 },
    { name: 'Quản Lý Phòng', path: '/admin/rooms', icon: BedDouble },
    { name: 'Quản Lý Đặt Phòng', path: '/admin/bookings', icon: CalendarCheck },
    { name: 'Khách Hàng', path: '/admin/customers', icon: Users },
    { name: 'Nhân Viên', path: '/admin/employees', icon: UserCheck },
    { name: 'Đánh Giá', path: '/admin/reviews', icon: Star },
    { name: 'Báo Cáo', path: '/admin/reports', icon: BarChart3 },
    { name: 'Cài Đặt', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-72 bg-navy-900 border-r border-gold-500/20 flex flex-col justify-between transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div>
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gold-500 flex items-center justify-center shadow-gold-glow">
              <Crown className="w-5 h-5 text-navy-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold gold-gradient-text">AURENCE</span>
              <span className="block text-[9px] uppercase tracking-[0.2em] text-slate-400">Admin Control</span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-160px)]">
          {adminMenu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gold-500/15 text-gold-400 border border-gold-500/40 shadow-gold-glow'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-navy-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-slate-500'}`} />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-gold-400" />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-navy-800/80 border border-gold-500/20 mb-3">
          <div className="flex items-center gap-3">
            <SafeImage
              src={currentUser?.avatar || '/images/hotels/hotel-default.jpg'}
              alt={currentUser?.name || 'Admin'}
              fallbackCategory="hotel"
              className="w-9 h-9 rounded-full object-cover border border-gold-400/50"
            />
            <div className="text-left overflow-hidden">
              <p className="text-xs font-bold text-slate-100 truncate">{currentUser?.name || 'Administrator'}</p>
              <span className="text-[10px] text-amber-400 font-medium flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Quản Trị Viên
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Đăng Xuất Admin
        </button>
      </div>
    </aside>
  );
};
