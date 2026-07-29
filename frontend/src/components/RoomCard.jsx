import React from 'react';
import { BedDouble, Users, Maximize } from 'lucide-react';
import { formatCurrency } from '../services/api';
import { SafeImage } from './SafeImage';

export const RoomCard = ({ roomType, onSelect }) => {
  const imageSrc = roomType.images?.[0] || roomType.imageUrl || roomType.image || '/images/rooms/room-default.jpg';

  return (
    <div className="p-6 rounded-3xl bg-navy-900 border border-gold-500/20 flex flex-col md:flex-row gap-6 items-center">
      <SafeImage
        src={imageSrc}
        alt={roomType.name}
        fallbackCategory="room"
        className="w-full md:w-48 h-36 rounded-2xl object-cover border border-slate-800"
      />
      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-serif text-lg font-bold text-slate-100">{roomType.name}</h4>
          <span className="text-base font-bold gold-gradient-text">{formatCurrency(roomType.basePrice || roomType.price || 2500000)}</span>
        </div>
        <p className="text-xs text-slate-400 line-clamp-2">{roomType.description}</p>
        <div className="flex items-center gap-4 text-xs text-slate-300">
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-gold-400" /> {roomType.capacity || 2} Khách</span>
          <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5 text-gold-400" /> {roomType.sizeSqM || roomType.size || '45'} m²</span>
          <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5 text-gold-400" /> {roomType.bedType || roomType.beds || '1 Giường King'}</span>
        </div>
      </div>
      {onSelect && (
        <button
          onClick={() => onSelect(roomType)}
          className="w-full md:w-auto px-5 py-2.5 rounded-xl gold-gradient-bg text-navy-950 font-bold text-xs shadow-gold-glow"
        >
          Chọn Phòng
        </button>
      )}
    </div>
  );
};
