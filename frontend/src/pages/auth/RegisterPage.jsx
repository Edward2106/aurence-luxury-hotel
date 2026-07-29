import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Crown, Mail, Lock, User, Phone, UserPlus, AlertCircle } from 'lucide-react';
import { registerSchema } from '../../services/api';
import { useAuthContext } from '../../context/AuthContext';

export const RegisterPage = () => {
  const { register: registerAuth, loading } = useAuthContext();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setApiError('');
    try {
      const res = await registerAuth({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      const userRole = (res?.user?.role || '').toLowerCase();
      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setApiError(
        err.response?.data?.message || 'Đăng ký không thành công. Vui lòng kiểm tra lại thông tin.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-3xl bg-navy-900 border border-gold-500/30 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center mx-auto shadow-gold-glow">
              <Crown className="w-6 h-6 text-navy-950 stroke-[2.5]" />
            </div>
          </Link>
          <h2 className="font-serif text-2xl font-bold text-slate-100">Đăng Ký Thành Viên</h2>
          <p className="text-xs text-slate-400">Trở thành khách hàng VIP để hưởng đặc quyền nghỉ dưỡng</p>
        </div>

        {apiError && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Họ và Tên</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                {...register('fullName')}
                placeholder="Nguyễn Văn A"
                className="w-full bg-navy-950 border border-slate-800 focus:border-gold-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none"
              />
            </div>
            {errors.fullName && <p className="text-[11px] text-rose-400">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                {...register('email')}
                placeholder="customer@aurence.com"
                className="w-full bg-navy-950 border border-slate-800 focus:border-gold-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none"
              />
            </div>
            {errors.email && <p className="text-[11px] text-rose-400">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Số Điện Thoại</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="tel"
                {...register('phone')}
                placeholder="0912 345 678"
                className="w-full bg-navy-950 border border-slate-800 focus:border-gold-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none"
              />
            </div>
            {errors.phone && <p className="text-[11px] text-rose-400">{errors.phone.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Mật Khẩu</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                {...register('password')}
                placeholder="Mật khẩu tối thiểu 6 ký tự"
                className="w-full bg-navy-950 border border-slate-800 focus:border-gold-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none"
              />
            </div>
            {errors.password && <p className="text-[11px] text-rose-400">{errors.password.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Xác Nhận Mật Khẩu</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                {...register('confirmPassword')}
                placeholder="Nhập lại mật khẩu"
                className="w-full bg-navy-950 border border-slate-800 focus:border-gold-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none"
              />
            </div>
            {errors.confirmPassword && <p className="text-[11px] text-rose-400">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl gold-gradient-bg text-navy-950 font-bold text-xs shadow-gold-glow hover:opacity-95 transition-opacity flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Đang Đăng Ký...' : 'Đăng Ký Tài Khoản VIP'}
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-gold-400 font-semibold hover:underline">
            Đăng Nhập Ngay
          </Link>
        </div>
      </div>
    </div>
  );
};
