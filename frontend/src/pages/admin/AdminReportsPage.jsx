import React from 'react';
import { FileSpreadsheet, Printer } from 'lucide-react';
import { exportToCSV } from '../../services/api';

export const AdminReportsPage = () => {
  const reportData = [
    { Hotel: 'Aurence Palais Royale (Paris)', Revenue: 850000, Occupancy: '95%', TotalBookings: 420 },
    { Hotel: 'Aurence Azure Resort (Bali)', Revenue: 640000, Occupancy: '91%', TotalBookings: 380 },
    { Hotel: 'Aurence Imperial Hotel (Tokyo)', Revenue: 790000, Occupancy: '96%', TotalBookings: 460 },
  ];

  const handleExportCSV = () => {
    exportToCSV('Bao_Cao_Doanh_Thu_Aurence_2026', reportData);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-400">Báo Cáo & Phân Tích</span>
          <h1 className="font-serif text-3xl font-bold text-slate-100">Báo Cáo Hiệu Suất Hệ Thống</h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-navy-900 border border-gold-500/30 text-gold-400 font-bold text-xs flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" /> Xuất Excel CSV
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl gold-gradient-bg text-navy-950 font-bold text-xs shadow-gold-glow flex items-center gap-2"
          >
            <Printer className="w-4 h-4" /> In Báo Cáo
          </button>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-navy-900 border border-gold-500/20 space-y-4 shadow-xl">
        <h3 className="font-serif text-lg font-bold text-slate-100">Chi Tiết Hiệu Suất Từng Khu Nghỉ Dưỡng</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-gold-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Tên Khách Sạn</th>
                <th className="py-3 px-3">Tỷ Lệ Lấp Đầy</th>
                <th className="py-3 px-3">Số Lượt Đặt</th>
                <th className="py-3 px-3 text-right">Tổng Doanh Thu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {reportData.map((r, i) => (
                <tr key={i}>
                  <td className="py-4 px-3 font-bold text-slate-100">{r.Hotel}</td>
                  <td className="py-4 px-3 font-semibold text-emerald-400">{r.Occupancy}</td>
                  <td className="py-4 px-3">{r.TotalBookings} Lượt</td>
                  <td className="py-4 px-3 text-right font-bold text-gold-400">${r.Revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
