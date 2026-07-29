import React from 'react';
import { formatCurrency } from '../services/api';

export const CurrencyText = ({ amount, currency = 'USD', className = '' }) => {
  return <span className={`font-bold gold-gradient-text ${className}`}>{formatCurrency(amount, currency)}</span>;
};
