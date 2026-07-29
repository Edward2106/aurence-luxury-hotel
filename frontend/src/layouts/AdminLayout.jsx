import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { AdminSidebar } from '../components/AdminSidebar';
import { NotificationDropdown } from '../components/NotificationDropdown';

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-navy-950 text-slate-100 font-sans">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col lg:pl-72 min-w-0">
        <header className="h-20 bg-navy-900/80 backdrop-blur-md border-b border-gold-500/20 px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-300 hover:text-gold-400 p-1"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="font-serif text-lg font-bold text-slate-100 hidden sm:block">
              Hệ Thống Quản Trị Khách Sạn Aurence
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <Link
              to="/"
              className="text-xs font-semibold px-4 py-2 rounded-xl border border-gold-500/40 text-gold-400 hover:bg-gold-500/10 transition-colors"
            >
              Xem Website ↗
            </Link>
          </div>
        </header>

        <main className="p-6 lg:p-10 flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
