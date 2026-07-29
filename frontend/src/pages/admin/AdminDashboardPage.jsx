import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DollarSign, Percent, BedDouble, CalendarCheck, Sparkles, TrendingUp } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { bookingService } from '../../services/bookingService';
import { formatCurrency } from '../../services/api';

export const AdminDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalRooms: 0,
    occupancyRate: '0.0',
  });
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    adminService.getDashboard()
      .then((data) => setDashboardData(data))
      .catch((err) => console.error('Dashboard fetch error:', err));

    bookingService.getAllBookings()
      .then((data) => setRecentBookings(data.bookings || []))
      .catch((err) => console.error('Bookings fetch error:', err));
  }, []);

  const chartData = [
    { month: 'Thg 1', revenue: 145000, occupancy: 82 },
    { month: 'Thg 2', revenue: 168000, occupancy: 86 },
    { month: 'Thg 3', revenue: 195000, occupancy: 89 },
    { month: 'Thg 4', revenue: 210000, occupancy: 92 },
    { month: 'Thg 5', revenue: 245000, occupancy: 94 },
    { month: 'Thg 6', revenue: 290000, occupancy: 97 },
    { month: 'Thg 7', revenue: dashboardData.totalRevenue || 320000, occupancy: parseFloat(dashboardData.occupancyRate) || 98 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-400">Trung Tâm Điều Hành</span>
          <h1 className="font-serif text-3xl font-bold text-slate-100">Tổng Quan Báo Cáo & Doanh Thu</h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-gold-500/10 text-gold-400 border border-gold-500/30">
          <Sparkles className="w-4 h-4" /> Đồng Bộ Trực Tiếp
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-navy-900 border border-gold-500/20 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Doanh Thu Mô Phỏng</span>
            <div className="p-2.5 rounded-2xl bg-navy-950 border border-slate-800 text-gold-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-100 block">{formatCurrency(dashboardData.totalRevenue)}</span>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> Trực tiếp từ dữ liệu
            </span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-navy-900 border border-gold-500/20 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Tỷ Lệ Lấp Đầy</span>
            <div className="p-2.5 rounded-2xl bg-navy-950 border border-slate-800 text-emerald-400">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-100 block">{dashboardData.occupancyRate}%</span>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> Công suất hiện tại
            </span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-navy-900 border border-gold-500/20 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Số Lượng Phòng</span>
            <div className="p-2.5 rounded-2xl bg-navy-950 border border-slate-800 text-sky-400">
              <BedDouble className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-100 block">{dashboardData.totalRooms} Phòng</span>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> Khách sạn Aurence
            </span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-navy-900 border border-gold-500/20 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Đặt Phòng Mới</span>
            <div className="p-2.5 rounded-2xl bg-navy-950 border border-slate-800 text-amber-400">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-100 block">{dashboardData.totalBookings}</span>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> Tổng lượt đặt
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 rounded-3xl bg-navy-900 border border-gold-500/20 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-lg font-bold text-slate-100">Tăng Trưởng Doanh Thu Tháng</h3>
            <span className="text-xs font-semibold text-gold-400">VND (₫)</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1C2541" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0B132B', borderColor: '#D4AF37', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-navy-900 border border-gold-500/20 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-lg font-bold text-slate-100">Tỷ Lệ Công Suất Phòng %</h3>
            <span className="text-xs font-semibold text-emerald-400">Chỉ số: {dashboardData.occupancyRate}%</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1C2541" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0B132B', borderColor: '#34D399', borderRadius: '12px' }} />
                <Bar dataKey="occupancy" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-navy-900 border border-gold-500/20 space-y-4">
        <h3 className="font-serif text-lg font-bold text-slate-100">Đặt Phòng Gần Đây</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-gold-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Mã Đặt</th>
                <th className="py-3 px-3">Tên Khách Hàng</th>
                <th className="py-3 px-3">Ngày Nhận Phòng</th>
                <th className="py-3 px-3 text-right">Tổng Tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {recentBookings.map((b) => (
                <tr key={b.id}>
                  <td className="py-3.5 px-3 font-mono font-bold text-gold-400">{b.bookingCode}</td>
                  <td className="py-3.5 px-3 font-semibold text-slate-100">{b.User ? b.User.fullName : 'Guest'}</td>
                  <td className="py-3.5 px-3">{b.checkInDate}</td>
                  <td className="py-3.5 px-3 text-right font-bold text-slate-100">{formatCurrency(b.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
