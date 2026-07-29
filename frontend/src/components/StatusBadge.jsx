import React from 'react';

export const StatusBadge = ({ status }) => {
  const getStyle = () => {
    switch (status) {
      case 'AVAILABLE':
      case 'CONFIRMED':
      case 'APPROVED':
      case 'PAID':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'OCCUPIED':
      case 'PENDING':
        return 'bg-gold-500/10 text-gold-400 border-gold-500/30';
      case 'CLEANING':
      case 'CHECKED_IN':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'MAINTENANCE':
      case 'CANCELLED':
      case 'HIDDEN':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-navy-800 text-slate-300 border-navy-700';
    }
  };

  return (
    <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStyle()}`}>
      {status}
    </span>
  );
};
