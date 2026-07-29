import React, { useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';

export const AdminSettingsPage = () => {
  const [taxRate, setTaxRate] = useState(10);
  const [currency, setCurrency] = useState('USD');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-gold-400">Thiết Lập Hệ Thống</span>
        <h1 className="font-serif text-3xl font-bold text-slate-100">Cấu Hình Cài Đặt Chung</h1>
      </div>

      <div className="p-8 rounded-3xl bg-navy-900 border border-gold-500/20 space-y-6 shadow-xl">
        {saved && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Cấu hình hệ thống đã được lưu thành công.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Đơn Vị Tiền Tệ</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-navy-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none"
              >
                <option value="USD">USD ($)</option>
                <option value="VND">VND (VNĐ)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Thuế VAT Hóa Đơn (%)</label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full bg-navy-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="py-3 px-6 rounded-xl gold-gradient-bg text-navy-950 font-bold text-xs shadow-gold-glow flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Lưu Cấu Hình Hệ Thống
          </button>
        </form>
      </div>
    </div>
  );
};
