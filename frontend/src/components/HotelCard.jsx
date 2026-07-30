import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Heart } from 'lucide-react';
import { formatCurrencyVND, normalizePrice } from '../services/api';
import { SafeImage } from './SafeImage';

export const HotelCard = ({ hotel, isFavorite, onToggleFavorite }) => {
  const imageSrc = hotel.mainImage || hotel.imageUrl || hotel.image || '/images/hotels/hotel-default.jpg';
  const displayPrice = normalizePrice(hotel.minPrice ?? hotel.priceStart ?? hotel.price);

  return (
    <div className="group glass-card rounded-3xl overflow-hidden glass-card-hover border border-gold-500/20 flex flex-col justify-between">
      <div className="relative h-60 overflow-hidden">
        <SafeImage
          src={imageSrc}
          alt={hotel.name}
          fallbackCategory="hotel"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-transparent" />
        
        {onToggleFavorite && (
          <button
            onClick={() => onToggleFavorite(hotel.id)}
            className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-colors ${
              isFavorite ? 'bg-rose-500 text-white' : 'bg-navy-950/60 text-slate-300 hover:text-rose-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}

        <div className="absolute bottom-3 left-4 text-xs font-medium text-slate-200 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-gold-400" />
          {hotel.city || hotel.location || 'Việt Nam'}, {hotel.country || 'Việt Nam'}
        </div>
      </div>

      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-serif text-lg font-bold text-slate-100 group-hover:text-gold-400 transition-colors">
              {hotel.name}
            </h3>
            <div className="flex items-center gap-1 text-xs font-bold text-gold-400">
              <Star className="w-3.5 h-3.5 fill-gold-400" />
              {hotel.ratingScore || hotel.rating || hotel.averageRating || 5.0}
            </div>
          </div>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{hotel.description}</p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Giá Từ</span>
            <span className="text-lg font-bold gold-gradient-text">{formatCurrencyVND(displayPrice)}</span>
            <span className="text-[10px] text-slate-400"> / đêm</span>
          </div>
          <Link
            to={`/hotels/${hotel.id}`}
            className="px-4 py-2 rounded-xl text-xs font-bold gold-gradient-bg text-navy-950 hover:opacity-95"
          >
            Xem Phòng
          </Link>
        </div>
      </div>
    </div>
  );
};
