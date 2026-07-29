import React, { useState } from 'react';
import { CheckCircle, EyeOff, Trash2 } from 'lucide-react';
import { StarRating } from '../../components/StarRating';

export const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([
    { id: 'rev-1', userName: 'Alexander Sterling', hotelName: 'Aurence Palais Royale', overallRating: 5, comment: 'Dịch vụ hoàn hảo vượt mong đợi.', status: 'APPROVED' }
  ]);

  const handleUpdateStatus = (id, status) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa đánh giá này không?')) {
      setReviews(reviews.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-gold-400">Kiểm Duyệt Phản Hồi</span>
        <h1 className="font-serif text-3xl font-bold text-slate-100">Quản Lý Đánh Giá Khách Hàng</h1>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div key={rev.id} className="p-6 rounded-3xl bg-navy-900 border border-gold-500/20 space-y-4 shadow-xl">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-xs font-bold text-slate-100">{rev.userName}</h4>
                <span className="text-[10px] text-slate-400">{rev.hotelName}</span>
                <StarRating rating={rev.overallRating} size="sm" />
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                rev.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}>
                {rev.status}
              </span>
            </div>

            <p className="text-xs text-slate-300 italic">"{rev.comment}"</p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => handleUpdateStatus(rev.id, 'APPROVED')}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Duyệt Hiển Thị
              </button>
              <button
                onClick={() => handleUpdateStatus(rev.id, 'HIDDEN')}
                className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1"
              >
                <EyeOff className="w-3.5 h-3.5" /> Ẩn Đánh Giá
              </button>
              <button
                onClick={() => handleDelete(rev.id)}
                className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
