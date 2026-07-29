import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, FileText, Star, ConciergeBell, XCircle } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { formatCurrency, formatDate } from '../services/api';

export const BookingCard = ({ booking, onCancel }) => {
  const hotelName = booking.Room?.Hotel?.name || booking.hotelName || 'Aurence Luxury Hotel';
  const hotelCity = booking.Room?.Hotel?.city || booking.hotelCity || 'Hồ Chí Minh';
  const totalAmount = booking.Invoice?.totalAmount || booking.totalAmount || booking.grandTotal || 0;
  const checkIn = booking.checkInDate || booking.checkIn;
  const checkOut = booking.checkOutDate || booking.checkOut;

  return (
    <div className="p-6 rounded-3xl bg-navy-900 border border-gold-500/20 space-y-6 shadow-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-gold-400">
            Mã: {booking.bookingCode}
          </span>
          <h3 className="font-serif text-xl font-bold text-slate-100">{hotelName}</h3>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-gold-400" /> {hotelCity}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status={booking.status} />
          <span className="text-lg font-bold gold-gradient-text">{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
        <div className="p-3 rounded-2xl bg-navy-950 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase block">Nhận Phòng</span>
          <span className="font-bold text-slate-100">{formatDate(checkIn)}</span>
        </div>
        <div className="p-3 rounded-2xl bg-navy-950 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase block">Trả Phòng</span>
          <span className="font-bold text-slate-100">{formatDate(checkOut)}</span>
        </div>
        <div className="p-3 rounded-2xl bg-navy-950 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase block">Số Khách</span>
          <span className="font-bold text-slate-100">{booking.guestCount} Khách</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Link
          to={`/services?bookingId=${booking.id}`}
          className="px-4 py-2 rounded-xl bg-navy-950 border border-gold-500/30 text-gold-400 text-xs font-bold hover:bg-gold-500/10 flex items-center gap-1.5"
        >
          <ConciergeBell className="w-3.5 h-3.5" /> Đặt Dịch Vụ Tại Phòng
        </Link>

        <Link
          to={`/invoice/${booking.id}`}
          className="px-4 py-2 rounded-xl bg-navy-950 border border-slate-800 text-slate-200 text-xs font-bold hover:text-gold-400 flex items-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5" /> Hóa Đơn
        </Link>

        <Link
          to={`/review/${booking.id}`}
          className="px-4 py-2 rounded-xl bg-navy-950 border border-slate-800 text-slate-200 text-xs font-bold hover:text-gold-400 flex items-center gap-1.5"
        >
          <Star className="w-3.5 h-3.5" /> Viết Đánh Giá
        </Link>

        {booking.status === 'CONFIRMED' && onCancel && (
          <button
            onClick={() => onCancel(booking.id)}
            className="ml-auto px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold hover:bg-rose-500/20 flex items-center gap-1.5"
          >
            <XCircle className="w-3.5 h-3.5" /> Hủy Đặt Phòng
          </button>
        )}
      </div>
    </div>
  );
};
