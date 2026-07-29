import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Crown, User, Calendar, LogOut, Menu, X, Shield, Sparkles, PhoneCall } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';

import { SafeImage } from './SafeImage';

import { NotificationDropdown } from './NotificationDropdown';

export const Header = () => {
  const { currentUser, isAuthenticated, logout, isAdmin } = useAuthContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: 'Trang Chủ', path: '/' },
    { name: 'Khách Sạn & Suite', path: '/hotels' },
    { name: 'Dịch Vụ Cao Cấp', path: '/services' },
    { name: 'Đặt Phòng Của Tôi', path: '/my-bookings' },
  ];

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-navy-950/85 backdrop-blur-xl border-b border-gold-500/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gold-600 via-gold-400 to-gold-200 flex items-center justify-center shadow-gold-glow group-hover:scale-105 transition-transform">
            <Crown className="w-5 h-5 text-navy-950 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-wider gold-gradient-text block leading-none">
              AURENCE
            </span>
            <span className="text-[10px] tracking-[0.25em] text-slate-400 uppercase font-sans font-medium">
              Palace & Resorts
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm tracking-wide font-medium transition-colors relative py-1 ${
                  isActive ? 'text-gold-400 font-semibold' : 'text-slate-300 hover:text-gold-300'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold-400 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-gold-400/90 border border-gold-500/20 px-3 py-1.5 rounded-full bg-navy-900/40">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Quản Gia 24/7</span>
          </div>

          {isAuthenticated && <NotificationDropdown />}

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-navy-900 border border-gold-500/30 hover:border-gold-500 transition-all text-slate-200"
              >
                <SafeImage
                  src={currentUser?.avatar || '/images/hotels/hotel-default.jpg'}
                  alt={currentUser?.name || 'User'}
                  fallbackCategory="hotel"
                  className="w-8 h-8 rounded-full object-cover border border-gold-400/50"
                />
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-semibold text-slate-100">{currentUser?.name}</p>
                  <p className="text-[10px] text-gold-400 font-medium flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> Thành Viên Vàng
                  </p>
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-navy-900 border border-gold-500/30 rounded-2xl shadow-2xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <p className="text-xs font-semibold text-slate-200">{currentUser?.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser?.email}</p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-gold-400 hover:bg-navy-800 rounded-xl transition-colors"
                  >
                    <User className="w-4 h-4 text-gold-400" />
                    Hồ Sơ Cá Nhân
                  </Link>

                  <Link
                    to="/my-bookings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-gold-400 hover:bg-navy-800 rounded-xl transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-gold-400" />
                    Lịch Sử Đặt Phòng
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-amber-400 hover:text-gold-300 hover:bg-navy-800 rounded-xl transition-colors font-medium"
                    >
                      <Shield className="w-4 h-4 text-amber-400" />
                      Trang Quản Trị
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng Xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-xs font-semibold text-slate-200 hover:text-gold-400 px-4 py-2 transition-colors">
                Đăng Nhập
              </Link>
              <Link to="/register" className="text-xs font-semibold px-5 py-2.5 rounded-xl gold-gradient-bg text-navy-950 shadow-gold-glow hover:opacity-95 transition-opacity">
                Đăng Ký
              </Link>
            </div>
          )}
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-slate-200 p-2">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-navy-900 border-b border-gold-500/20 px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-slate-200 hover:text-gold-400 py-2 border-b border-slate-800"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
