import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useBookingContext } from '../../context/BookingContext';
import { useAuthContext } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';
import { formatCurrency, calculateNights } from '../../services/api';

export const BookingPage = () => {
  const navigate = useNavigate();
  const { bookingSummary } = useBookingContext();
  const { currentUser } = useAuthContext();

  const [guestName, setGuestName] = useState(currentUser?.fullName || currentUser?.name || '');
  const [guestEmail, setGuestEmail] = useState(currentUser?.email || '');
  const [guestPhone, setGuestPhone] = useState(currentUser?.phone || '');
  const [couponCode] = useState('LUXURYGOLD');
  const [couponApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nights = calculateNights(bookingSummary.checkInDate, bookingSummary.checkOutDate);
  const rawRoomTotal = (bookingSummary.pricePerNight || 0) * nights;
  const discountAmount = couponApplied ? rawRoomTotal * 0.1 : 0;
  const taxableAmount = Math.max(0, rawRoomTotal - discountAmount);
  const taxAmount = Math.round(taxableAmount * 0.1);
  const grandTotal = Math.max(0, rawRoomTotal - discountAmount + taxAmount);

  const handleFinalSubmit = async () => {
    if (!guestName || !guestEmail) {
      alert('Vui lòng nhập đầy đủ họ tên và email.');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await bookingService.createBooking({
        hotelId: bookingSummary.hotelId,
        roomTypeId: bookingSummary.roomTypeId,
        roomId: bookingSummary.roomId,
        checkInDate: bookingSummary.checkInDate,
        checkOutDate: bookingSummary.checkOutDate,
        guestCount: bookingSummary.guestCount,
        specialRequest: `Khách hàng: ${guestName}, SĐT: ${guestPhone}`,
        discountAmount: discountAmount,
      });
      const createdId = res.booking?.id || res.id;
      navigate(`/invoice/${createdId}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi tạo đơn đặt phòng.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-400">Quy Trình Đặt Phòng</span>
        <h1 className="font-serif text-3xl font-bold text-slate-100">Xác Nhận Đặt Suite Hoàng Gia</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-3xl bg-navy-900 border border-gold-500/20 space-y-6">
            <h3 className="font-serif text-lg font-bold text-slate-100">Thông Tin Khách Hàng</h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Họ và Tên</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-navy-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Email Liên Hệ</label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full bg-navy-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Số Điện Thoại</label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full bg-navy-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl gold-gradient-bg text-navy-950 font-bold text-xs shadow-gold-glow flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Đang Xử Lý...' : `Thanh Toán ${formatCurrency(grandTotal)} & Hoàn Tất`}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="p-6 rounded-3xl bg-navy-900 border border-gold-500/30 space-y-6">
            <h4 className="font-serif text-lg font-bold text-slate-100 border-b border-slate-800 pb-3">
              Tóm Tắt Chi Phí
            </h4>
            <div className="space-y-2 text-xs">
              <p className="font-bold text-gold-400">{bookingSummary.hotelName}</p>
              <p className="text-slate-300">{bookingSummary.roomName}</p>
              <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800">
                <span>Số Đêm:</span>
                <span className="text-slate-100 font-bold">{nights} Đêm</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Thuế VAT 10%:</span>
                <span className="text-slate-100">{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-100 pt-2 border-t border-slate-800">
                <span>Tổng Cộng:</span>
                <span className="gold-gradient-text text-base">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
