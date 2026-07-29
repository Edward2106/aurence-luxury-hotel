import React from 'react';
import { Search } from 'lucide-react';

export const SearchBar = ({ value, onChange, placeholder = 'Tìm kiếm...' }) => {
  return (
    <div className="relative w-full">
      <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-navy-950 border border-slate-800 focus:border-gold-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none"
      />
    </div>
  );
};
