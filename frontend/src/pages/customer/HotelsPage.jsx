import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ArrowUpDown } from 'lucide-react';
import { hotelService } from '../../services/hotelService';
import { HotelCard } from '../../components/HotelCard';
import { SearchBar } from '../../components/SearchBar';

export const HotelsPage = () => {
  const [searchParams] = useSearchParams();
  const initialLocation = searchParams.get('location') || '';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [sortBy, setSortBy] = useState('rating');
  const [favorites, setFavorites] = useState([]);
  const [hotelsList, setHotelsList] = useState([]);

  useEffect(() => {
    hotelService.getHotels()
      .then((data) => {
        if (data.hotels && data.hotels.length > 0) {
          setHotelsList(data.hotels);
        } else if (window.AURENCE?.hotels) {
          setHotelsList(window.AURENCE.hotels);
        }
      })
      .catch(() => {
        if (window.AURENCE?.hotels) {
          setHotelsList(window.AURENCE.hotels);
        }
      });
  }, []);

  const filtered = hotelsList.filter((h) => {
    if (searchQuery && !h.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedLocation && h.city.toLowerCase() !== selectedLocation.toLowerCase()) return false;
    return true;
  });

  const toggleFavorite = (hotelId) => {
    setFavorites((prev) =>
      prev.includes(hotelId) ? prev.filter((id) => id !== hotelId) : [...prev, hotelId]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-400">Danh Mục Toàn Cầu</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-100">Danh Sách Khách Sạn & Villa</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 p-6 rounded-3xl bg-navy-900 border border-gold-500/20 space-y-6 h-fit">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="font-serif text-lg font-bold text-slate-100 flex items-center gap-2">
              <Filter className="w-4 h-4 text-gold-400" /> Bộ Lọc Tìm Kiếm
            </h3>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedLocation('');
                setSortBy('rating');
              }}
              className="text-[11px] text-slate-400 hover:text-gold-400"
            >
              Đặt Lại
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Thành Phố / Điểm Đến</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-navy-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
            >
              <option value="">Tất Cả Điểm Đến</option>
              <option value="thành phố hồ chí minh">Thành Phố Hồ Chí Minh</option>
              <option value="Paris">Paris, Pháp</option>
              <option value="Bali">Bali, Indonesia</option>
              <option value="Tokyo">Tokyo, Nhật Bản</option>
            </select>
          </div>
        </aside>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-navy-900 border border-slate-800">
            <div className="w-full sm:w-72">
              <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Tìm kiếm tên khách sạn..." />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <ArrowUpDown className="w-4 h-4 text-gold-400 shrink-0" />
              <span className="text-xs text-slate-400 shrink-0">Sắp Xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-navy-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              >
                <option value="rating">Đánh giá cao nhất</option>
                <option value="price_asc">Giá: Thấp đến Cao</option>
                <option value="price_desc">Giá: Cao đến Thấp</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                isFavorite={favorites.includes(hotel.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
