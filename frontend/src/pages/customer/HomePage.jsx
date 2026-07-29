import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, Users, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { hotelService } from '../../services/hotelService';
import { HotelCard } from '../../components/HotelCard';
import { SafeImage } from '../../components/SafeImage';

export const HomePage = () => {
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState('Paris');
  const [checkInDate, setCheckInDate] = useState('2026-08-10');
  const [checkOutDate, setCheckOutDate] = useState('2026-08-14');
  const [guestCount, setGuestCount] = useState(2);
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    hotelService.getHotels()
      .then((data) => {
        if (data.hotels && data.hotels.length > 0) {
          setHotels(data.hotels);
        } else if (window.AURENCE?.hotels) {
          setHotels(window.AURENCE.hotels);
        }
      })
      .catch(() => {
        if (window.AURENCE?.hotels) {
          setHotels(window.AURENCE.hotels);
        }
      });
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/hotels?location=${encodeURIComponent(searchLocation)}&checkIn=${checkInDate}&checkOut=${checkOutDate}&guests=${guestCount}`);
  };

  return (
    <div className="space-y-24 pb-20">
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-12">
        <div className="absolute inset-0 z-0">
          <SafeImage
            src="/images/hotels/hotel-default.jpg"
            alt="Hero Background"
            fallbackCategory="hotel"
            className="w-full h-full object-cover scale-105 animate-pulse duration-[10000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-navy-950/40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8 mt-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/20 border border-gold-500/40 backdrop-blur-md text-xs font-bold text-gold-300 tracking-widest uppercase shadow-gold-glow"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Đỉnh Cao Ngành Khách Sạn Toàn Cầu
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-100 leading-[1.1]"
          >
            Nơi Đỉnh Cao Sang Trọng <span className="gold-gradient-text">Vượt Thời Gian</span>
          </motion.h1>

          <form
            onSubmit={handleSearchSubmit}
            className="p-4 sm:p-5 rounded-3xl bg-navy-900/90 border border-gold-500/30 backdrop-blur-xl shadow-2xl max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left"
          >
            <div className="p-3 rounded-2xl bg-navy-950/60 border border-slate-800">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gold-400 flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5" /> Điểm Đến
              </label>
              <select
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-slate-100 focus:outline-none cursor-pointer"
              >
                <option value="Paris" className="bg-navy-900">Paris, Pháp</option>
                <option value="Bali" className="bg-navy-900">Bali, Indonesia</option>
                <option value="Tokyo" className="bg-navy-900">Tokyo, Nhật Bản</option>
              </select>
            </div>

            <div className="p-3 rounded-2xl bg-navy-950/60 border border-slate-800">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gold-400 flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5" /> Nhận Phòng
              </label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-slate-100 focus:outline-none cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-2xl bg-navy-950/60 border border-slate-800">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gold-400 flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5" /> Trả Phòng
              </label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-slate-100 focus:outline-none cursor-pointer"
              />
            </div>

            <div className="flex gap-2">
              <div className="p-3 rounded-2xl bg-navy-950/60 border border-slate-800 flex-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gold-400 flex items-center gap-1.5 mb-1">
                  <Users className="w-3.5 h-3.5" /> Số Khách
                </label>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full bg-transparent text-xs font-semibold text-slate-100 focus:outline-none cursor-pointer"
                >
                  <option value={1} className="bg-navy-900">1 Khách</option>
                  <option value={2} className="bg-navy-900">2 Khách</option>
                  <option value={4} className="bg-navy-900">4 Khách</option>
                </select>
              </div>

              <button
                type="submit"
                className="gold-gradient-bg text-navy-950 p-4 rounded-2xl flex items-center justify-center shadow-gold-glow hover:scale-105 transition-transform"
              >
                <Search className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400">Danh Mục Độc Quyền</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100 mt-1">Khách Sạn Nổi Bật</h2>
          </div>
          <Link to="/hotels" className="text-xs font-semibold text-gold-400 hover:text-gold-300 flex items-center gap-1">
            Xem Tất Cả Khách Sạn <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </section>
    </div>
  );
};
