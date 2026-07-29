import React, { useState } from 'react';

export const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([
    { id: 'usr-1', name: 'Alexander Sterling', email: 'customer@aurence.com', membership: 'GOLD', rewardPoints: 4850, staysCount: 8, totalSpend: 14500 }
  ]);

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-gold-400">Danh Sách Khách V.I.P</span>
        <h1 className="font-serif text-3xl font-bold text-slate-100">Quản Lý Khách Hàng</h1>
      </div>

      <div className="p-6 rounded-3xl bg-navy-900 border border-gold-500/20 space-y-4 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-gold-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Họ và Tên</th>
                <th className="py-3 px-3">Hạng Thành Viên</th>
                <th className="py-3 px-3">Điểm Thưởng</th>
                <th className="py-3 px-3">Số Lần Ở</th>
                <th className="py-3 px-3 text-right">Tổng Chi Tiêu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {customers.map((c) => (
                <tr key={c.id}>
                  <td className="py-4 px-3">
                    <p className="font-bold text-slate-100">{c.name}</p>
                    <p className="text-[11px] text-slate-400">{c.email}</p>
                  </td>
                  <td className="py-4 px-3">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-gold-500/10 text-gold-400 border border-gold-500/30">
                      THÀNH VIÊN {c.membership}
                    </span>
                  </td>
                  <td className="py-4 px-3 font-mono font-bold text-slate-100">{c.rewardPoints} PTS</td>
                  <td className="py-4 px-3">{c.staysCount} Lần</td>
                  <td className="py-4 px-3 text-right font-bold text-gold-400">${c.totalSpend.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
