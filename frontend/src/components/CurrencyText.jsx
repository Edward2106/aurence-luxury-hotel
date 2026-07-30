import React from 'react';
import { formatCurrencyVND } from '../services/api';

export const CurrencyText = ({ amount, currency = 'VND', fallback = 'Liên hệ', className = '' }) => {
  return <span className={`font-bold gold-gradient-text ${className}`}>{formatCurrencyVND(amount, fallback)}</span>;
};
