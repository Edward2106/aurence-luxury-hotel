import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Sparkles, Award, ShieldCheck, CheckCircle2, Save } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { SafeImage } from '../../components/SafeImage';

export const ProfilePage = () => {
  const { currentUser } = useAuthContext();

  const [name, setName] = useState(currentUser?.name || 'Alexander Sterling');
  const [phone, setPhone] = useState(currentUser?.phone || '+1 212 555 0199');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <div className="p-8 rounded-3xl bg-navy-900 border border-gold-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-5">
          <SafeImage
            src={currentUser?.avatar || '/images/hotels/hotel-default.jpg'}
            alt={name}
            fallbackCategory="hotel"
            className="w-20 h-20 rounded-full object-cover border-2 border-gold-400 shadow-gold-glow"
          />
          <div className="space-y-1">
            <h1 className="font-serif text-2xl font-bold text-slate-100">{name}</h1>
            <p className="text-xs text-slate-400">{currentUser?.email || 'customer@aurence.com'}</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 text-xs font-bold mt-2">
              <Sparkles className="w-3.5 h-3.5" /> Thành Viên Vàng
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-navy-950 border border-slate-800 text-center min-w-[180px]">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Điểm Thưởng Tích Lũy</span>
          <span className="text-3xl font-bold gold-gradient-text">{currentUser?.rewardPoints || 4850}</span>
          <span className="text-[10px] text-gold-400 block font-semibold">ĐIỂM AURENCE</span>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-navy-900 border border-gold-500/20 space-y-6">
        <h3 className="font-serif text-lg font-bold text-slate-100 border-b border-slate-800 pb-3">
          Thông Tin Cá Nhân
        </h3>

        {saved && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Đã cập nhật thông tin cá nhân thành công.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 max-w-xl">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Họ và Tên</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-navy-950 border border-slate-800 focus:border-gold-400 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Số Điện Thoại</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-navy-950 border border-slate-800 focus:border-gold-400 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="py-3 px-6 rounded-xl gold-gradient-bg text-navy-950 font-bold text-xs shadow-gold-glow flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Lưu Thay Đổi
          </button>
        </form>
      </div>
    </div>
  );
};
