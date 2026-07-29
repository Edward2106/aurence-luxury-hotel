import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { StarRating } from '../../components/StarRating';
import { reviewService } from '../../services/reviewService';

export const ReviewPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [overallRating, setOverallRating] = useState(5);
  const [roomRating, setRoomRating] = useState(5);
  const [staffRating, setStaffRating] = useState(5);
  const [cleanlinessRating, setCleanlinessRating] = useState(5);
  const [foodRating, setFoodRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await reviewService.createReview({
        bookingId,
        overallRating,
        roomRating,
        staffRating,
        cleanlinessRating,
        foodRating,
        comment,
      });
      setSubmitted(true);
      setTimeout(() => navigate('/my-bookings'), 2000);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Không thể gửi đánh giá. Vui lòng kiểm tra lại đơn đặt phòng.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-400">Đánh Giá Từ Khách Hàng</span>
        <h1 className="font-serif text-3xl font-bold text-slate-100">Chia Sẻ Trải Nghiệm Của Bạn</h1>
      </div>

      <div className="p-8 rounded-3xl bg-navy-900 border border-gold-500/30 shadow-2xl space-y-6">
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-slate-100">Cảm Ơn Đánh Giá Của Bạn</h3>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4 border-b border-slate-800 pb-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-100">Đánh Giá Tổng Thể</span>
                <StarRating rating={overallRating} interactive size="lg" onRate={setOverallRating} />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Chất Lượng Suite & Phòng</span>
                <StarRating rating={roomRating} interactive size="md" onRate={setRoomRating} />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Phục Vụ Quản Gia & Nhân Viên</span>
                <StarRating rating={staffRating} interactive size="md" onRate={setStaffRating} />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Vệ Sinh & Sạch Sẽ</span>
                <StarRating rating={cleanlinessRating} interactive size="md" onRate={setCleanlinessRating} />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Ẩm Thực & Nhà Hàng</span>
                <StarRating rating={foodRating} interactive size="md" onRate={setFoodRating} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-gold-400" /> Nhận Xét Chi Tiết
              </label>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Dịch vụ tuyệt vời, quản gia rất tận tâm..."
                className="w-full bg-navy-950 border border-slate-800 focus:border-gold-400 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl gold-gradient-bg text-navy-950 font-bold text-xs shadow-gold-glow"
            >
              {isSubmitting ? 'Đang Gửi Đánh Giá...' : 'Gửi Đánh Giá Qua Hệ Thống'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
