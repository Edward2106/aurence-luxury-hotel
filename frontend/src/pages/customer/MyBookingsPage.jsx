import React, { useState, useEffect } from 'react';
import { BookingCard } from '../../components/BookingCard';
import { bookingService } from '../../services/bookingService';

export const MyBookingsPage = () => {
  const [activeTab, setActiveTab] = useState('UPCOMING');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data.bookings || []);
    } catch (err) {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đặt phòng này không?')) {
      await bookingService.cancelBooking(id);
      fetchBookings();
    }
  };

  const filtered = bookings.filter((b) => {
    const statusUpper = (b.status || '').toUpperCase();
    if (activeTab === 'UPCOMING') return statusUpper === 'CONFIRMED' || statusUpper === 'PENDING' || statusUpper === 'CHECKED_IN';
    return statusUpper === 'CHECKED_OUT' || statusUpper === 'CANCELLED' || statusUpper === 'COMPLETED';
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-400">Danh Mục Đặt Phòng</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100">Quản Lý Đặt Phòng Của Tôi</h1>
      </div>

      <div className="flex border-b border-slate-800 space-x-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('UPCOMING')}
          className={`pb-3 relative ${activeTab === 'UPCOMING' ? 'text-gold-400 font-bold' : 'text-slate-400'}`}
        >
          Sắp Tới ({bookings.filter((b) => ['CONFIRMED', 'PENDING'].includes((b.status || '').toUpperCase())).length})
          {activeTab === 'UPCOMING' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold-400" />}
        </button>
        <button
          onClick={() => setActiveTab('HISTORY')}
          className={`pb-3 relative ${activeTab === 'HISTORY' ? 'text-gold-400 font-bold' : 'text-slate-400'}`}
        >
          Lịch Sử & Đánh Giá
          {activeTab === 'HISTORY' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold-400" />}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Đang tải danh sách đặt phòng...</div>
      ) : (
        <div className="space-y-6">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-400">Chưa có đặt phòng nào.</div>
          ) : (
            filtered.map((b) => (
              <BookingCard key={b.id} booking={b} onCancel={handleCancel} />
            ))
          )}
        </div>
      )}
    </div>
  );
};
