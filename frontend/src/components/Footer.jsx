import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Mail, MapPin, Phone, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-navy-950 border-t border-gold-500/20 text-slate-400 pt-16 pb-12 font-sans relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 p-8 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-gold-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-serif text-2xl font-semibold text-slate-100 flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-gold-400" />
              Đăng Ký Nhận Thư Đặc Quyền Aurence
            </h3>
            <p className="text-xs text-slate-300">
              Nhận lời mời sự kiện riêng tư, xem trước các suite mới và ưu đãi độc quyền.
            </p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <input
              type="email"
              placeholder="Nhập email VIP của bạn"
              className="bg-navy-950 border border-gold-500/30 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-gold-400 min-w-[260px]"
            />
            <button className="gold-gradient-bg text-navy-950 text-xs font-bold px-5 py-2.5 rounded-xl hover:opacity-95 transition-opacity whitespace-nowrap">
              Tham Gia Câu Lạc Bộ
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center">
                <Crown className="w-4 h-4 text-navy-950" />
              </div>
              <span className="font-serif text-xl font-bold gold-gradient-text">AURENCE</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Chuỗi khách sạn và nghỉ dưỡng thượng lưu tại Paris, Bali, Tokyo. Nơi hoàn hảo cho du khách toàn cầu.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-slate-100 tracking-wider uppercase text-gold-400">
              Điểm Đến
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/hotels?location=Paris" className="hover:text-gold-300">Aurence Palais Royale (Paris)</Link></li>
              <li><Link to="/hotels?location=Bali" className="hover:text-gold-300">Aurence Azure Resort (Bali)</Link></li>
              <li><Link to="/hotels?location=Tokyo" className="hover:text-gold-300">Aurence Imperial Hotel (Tokyo)</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-slate-100 tracking-wider uppercase text-gold-400">
              Dịch Vụ
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/services" className="hover:text-gold-300">Quản Gia & Lễ Tân 24/7</Link></li>
              <li><Link to="/services" className="hover:text-gold-300">Ẩm Thực Sao Michelin</Link></li>
              <li><Link to="/services" className="hover:text-gold-300">Guerlain Spa & Massage</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-slate-100 tracking-wider uppercase text-gold-400">
              Liên Hệ
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gold-400" /> 15 Place Vendôme, Paris</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-gold-400" /> +33 1 42 68 55 00</p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-gold-400" /> concierge@aurence.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© 2026 Aurence Hotels & Resorts Group. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};
