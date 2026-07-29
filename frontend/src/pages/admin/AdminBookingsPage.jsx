import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/bookingService';
import { formatCurrency } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';

export const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState('');

  const fetchBookings = () => {
    bookingService.getAllBookings()
      .then((data) => setBookings(data.bookings || []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await bookingService.updateStatus(id, newStatus);
      fetchBookings();
    } catch (err) {
      alert('Không thể cập nhật trạng thái: ' + (err.response?.data?.message || err.message));
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const q = search.toLowerCase();
    const code = (b.bookingCode || '').toLowerCase();
    const name = (b.User?.fullName || '').toLowerCase();
    const email = (b.User?.email || '').toLowerCase();
    return code.includes(q) || name.includes(q) || email.includes(q);
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-400">Lễ Tân & Đặt Phòng</span>
          <h1 className="font-serif text-3xl font-bold text-slate-100">Quản Lý Đặt Phòng</h1>
        </div>
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Tìm theo mã, tên khách hàng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-navy-900 border border-gold-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none"
          />
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-navy-900 border border-gold-500/20 space-y-4 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-gold-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Mã Đặt</th>
                <th className="py-3 px-3">Khách Hàng</th>
                <th className="py-3 px-3">Thời Gian</th>
                <th className="py-3 px-3">Trạng Thái</th>
                <th className="py-3 px-3">Tổng Tiền</th>
                <th className="py-3 px-3 text-right">Thao Tác Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredBookings.map((b) => (
                <tr key={b.id}>
                  <td className="py-4 px-3 font-mono font-bold text-gold-400">{b.bookingCode}</td>
                  <td className="py-4 px-3 font-semibold text-slate-100">{b.User ? b.User.fullName : 'Guest'}</td>
                  <td className="py-4 px-3">{b.checkInDate} → {b.checkOutDate}</td>
                  <td className="py-4 px-3"><StatusBadge status={b.status} /></td>
                  <td className="py-4 px-3 font-bold text-slate-100">{formatCurrency(b.totalAmount)}</td>
                  <td className="py-4 px-3 text-right space-x-1.5">
                    {(b.status === 'pending') && (
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'confirmed')}
                        className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-400 font-bold text-[10px] hover:bg-sky-500/20"
                      >
                        Xác Nhận
                      </button>
                    )}
                    {(b.status === 'confirmed' || b.status === 'pending') && (
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'checked_in')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-[10px] hover:bg-emerald-500/20"
                      >
                        Check-In
                      </button>
                    )}
                    {(b.status === 'checked_in') && (
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'checked_out')}
                        className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 font-bold text-[10px] hover:bg-purple-500/20"
                      >
                        Check-Out
                      </button>
                    )}
                    {(b.status === 'pending' || b.status === 'confirmed') && (
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 font-bold text-[10px] hover:bg-rose-500/20"
                      >
                        Hủy
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
