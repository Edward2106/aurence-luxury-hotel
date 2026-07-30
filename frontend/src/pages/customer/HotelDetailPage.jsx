import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { hotelService } from '../../services/hotelService';
import { useBookingContext } from '../../context/BookingContext';
import { StarRating } from '../../components/StarRating';
import { CurrencyText } from '../../components/CurrencyText';
import { RoomCard } from '../../components/RoomCard';
import { SafeImage } from '../../components/SafeImage';
import { normalizePrice } from '../../services/api';

export const HotelDetailPage = () => {
  const params = useParams();
  const targetId = params.hotelId || params.id;
  const navigate = useNavigate();
  const { updateSearch } = useBookingContext();

  const [hotel, setHotel] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [activeImage, setActiveImage] = useState('/images/hotels/hotel-default.jpg');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (targetId) {
      setIsLoading(true);
      hotelService.getHotelById(targetId)
        .then((data) => {
          if (data.hotel) {
            setHotel(data.hotel);
            setActiveImage(data.hotel.imageUrl || data.hotel.image || '/images/hotels/hotel-default.jpg');
            const rooms = data.hotel.RoomTypes || data.hotel.roomTypes || data.hotel.rooms || [];
            setRoomTypes(rooms);
          }
        })
        .catch(() => {
          const foundMock = window.AURENCE?.hotels?.find((h) => h.id === targetId) || window.AURENCE?.hotels?.[0];
          if (foundMock) {
            setHotel(foundMock);
            setActiveImage(foundMock.image || '/images/hotels/hotel-default.jpg');
            const mockRooms = window.AURENCE?.rooms?.filter((r) => r.hotelId === foundMock.id) || [];
            setRoomTypes(mockRooms.length > 0 ? mockRooms : [
              { id: 1, name: 'Phòng Deluxe Hướng Biển', basePrice: foundMock.price || 3500000, capacity: 2, sizeSqM: 48, bedType: '1 Giường King', description: foundMock.description }
            ]);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [targetId]);

  const lowestPrice = useMemo(() => {
    if (!roomTypes || roomTypes.length === 0) {
      return normalizePrice(hotel?.minPrice || hotel?.priceStart || hotel?.price);
    }
    const validPrices = roomTypes
      .map((rt) => normalizePrice(rt.basePrice || rt.pricePerNight || rt.price))
      .filter((p) => p !== null && p >= 0);

    return validPrices.length > 0
      ? Math.min(...validPrices)
      : normalizePrice(hotel?.minPrice || hotel?.priceStart || hotel?.price);
  }, [roomTypes, hotel]);

  if (isLoading || !hotel) {
    return <div className="p-20 text-center text-slate-400">Đang tải thông tin khách sạn...</div>;
  }

  const handleBookRoom = (rt) => {
    const selectedRt = rt || roomTypes[0];
    const roomPrice = normalizePrice(selectedRt?.basePrice || selectedRt?.pricePerNight || selectedRt?.price || lowestPrice || 2500000);
    updateSearch({
      selectedHotel: { id: hotel.id, name: hotel.name },
      selectedRoom: {
        id: selectedRt ? selectedRt.id : 1,
        name: selectedRt ? selectedRt.name : 'Standard Room',
        basePrice: roomPrice,
        pricePerNight: roomPrice,
      },
    });
    navigate('/booking');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400">Khu Nghỉ Dưỡng {hotel.starRating || hotel.stars || 5} Sao</span>
            <StarRating rating={hotel.starRating || hotel.stars || 5} size="sm" />
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-100">{hotel.name}</h1>
          <p className="text-xs text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
            {hotel.address || hotel.location}, {hotel.city || hotel.country || ''}
          </p>
        </div>

        <button
          onClick={() => handleBookRoom(roomTypes[0])}
          className="px-6 py-3.5 rounded-2xl gold-gradient-bg text-navy-950 font-bold text-xs shadow-gold-glow hover:opacity-95 flex items-center gap-2"
        >
          Đặt Phòng Ngay <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="h-[450px] w-full rounded-3xl overflow-hidden border border-gold-500/20 relative shadow-2xl">
          <SafeImage src={activeImage} alt={hotel.name} fallbackCategory="hotel" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="p-8 rounded-3xl bg-navy-900 border border-gold-500/20 space-y-4">
            <h3 className="font-serif text-xl font-bold text-slate-100">Giới Thiệu {hotel.name}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{hotel.description}</p>
          </div>

          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-slate-100">Danh Sách Hạng Phòng</h3>
            <div className="space-y-6">
              {roomTypes.map((rt) => (
                <RoomCard key={rt.id} roomType={rt} onSelect={handleBookRoom} />
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-28 p-6 rounded-3xl bg-navy-900 border border-gold-500/40 shadow-2xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] text-slate-400 uppercase block">Giá Từ Thấp Nhất</span>
              <CurrencyText amount={lowestPrice} className="text-2xl" />
              <span className="text-xs text-slate-400"> / đêm</span>
            </div>
            <button
              onClick={() => handleBookRoom(roomTypes[0])}
              className="w-full py-3.5 rounded-2xl gold-gradient-bg text-navy-950 font-bold text-xs shadow-gold-glow"
            >
              Tiến Hành Đặt Phòng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
