import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Crown, Mail, Lock, LogIn, Sparkles, ShieldCheck, AlertCircle, Info } from 'lucide-react';
import { loginSchema } from '../../services/api';
import { useAuthContext } from '../../context/AuthContext';

export const LoginPage = () => {
  const { login, loading } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectMessage = location.state?.message || '';
  const redirectFrom = location.state?.from || '';

  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  const onSubmit = async (data) => {
    setApiError('');
    try {
      const res = await login({
        email: data.email,
        password: data.password,
      });

      const userRole = (res?.user?.role || '').toLowerCase();
      if (userRole === 'admin') {
        navigate('/admin');
      } else if (redirectFrom) {
        navigate(redirectFrom);
      } else {
        navigate('/');
      }
    } catch (err) {
      setApiError(
        err.response?.data?.message || 'Email hoặc mật khẩu không chính xác. Vui lòng thử lại.'
      );
    }
  };

  const fillQuickDemo = (roleType) => {
    setApiError('');
    if (roleType === 'admin') {
      setValue('email', 'admin@aurence.com');
      setValue('password', 'Admin@123');
    } else {
      setValue('email', 'customer@aurence.com');
      setValue('password', 'Customer@123');
    }
  };

  const handleInputChange = () => {
    if (apiError) {
      setApiError('');
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-3xl bg-navy-900 border border-gold-500/30 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center mx-auto shadow-gold-glow">
              <Crown className="w-6 h-6 text-navy-950 stroke-[2.5]" />
            </div>
          </Link>
          <h2 className="font-serif text-2xl font-bold text-slate-100">Đăng Nhập Aurence</h2>
          <p className="text-xs text-slate-400">Đăng nhập hệ thống quản lý & đặc quyền khách hàng</p>
        </div>

        {redirectMessage && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{redirectMessage}</span>
          </div>
        )}

        <div className="p-3 rounded-2xl bg-navy-950/80 border border-gold-500/20 space-y-2">
          <span className="text-[10px] text-gold-400 font-bold uppercase tracking-wider block text-center">
            ⚡ Đăng Nhập Nhanh (Account Demo)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillQuickDemo('customer')}
              className="px-3 py-1.5 rounded-xl bg-navy-800 text-[11px] font-semibold text-slate-200 hover:text-gold-400 border border-slate-700 transition-colors flex items-center justify-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-gold-400" /> Khách Hàng
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('admin')}
              className="px-3 py-1.5 rounded-xl bg-navy-800 text-[11px] font-semibold text-amber-400 hover:text-gold-300 border border-slate-700 transition-colors flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3 h-3 text-amber-400" /> Quản Trị (Admin)
            </button>
          </div>
        </div>

        {apiError && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                {...register('email')}
                onChange={handleInputChange}
                placeholder="customer@aurence.com"
                className="w-full bg-navy-950 border border-slate-800 focus:border-gold-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none"
              />
            </div>
            {errors.email && <p className="text-[11px] text-rose-400">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-300">Mật Khẩu</label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                {...register('password')}
                onChange={handleInputChange}
                placeholder="••••••••••••"
                className="w-full bg-navy-950 border border-slate-800 focus:border-gold-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none"
              />
            </div>
            {errors.password && <p className="text-[11px] text-rose-400">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl gold-gradient-bg text-navy-950 font-bold text-xs shadow-gold-glow hover:opacity-95 transition-opacity flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Đang Đăng Nhập...' : 'Đăng Nhập'}
            <LogIn className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Chưa có tài khoản Aurence?{' '}
          <Link to="/register" className="text-gold-400 font-semibold hover:underline">
            Đăng Ký Khách Hàng
          </Link>
        </div>
      </div>
    </div>
  );
};
