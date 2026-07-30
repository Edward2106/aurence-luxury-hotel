import React, { useState, useEffect } from 'react';
import { Plus, Trash2, MapPin, Layers, DollarSign, Users } from 'lucide-react';
import { hotelService } from '../../services/hotelService';
import { roomService } from '../../services/roomService';
import { Modal } from '../../components/Modal';
import { SearchBar } from '../../components/SearchBar';
import { SafeImage } from '../../components/SafeImage';
import { formatCurrencyVND } from '../../services/api';

export const AdminHotelsPage = () => {
  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Hotel form
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');

  // Room Type modal state
  const [roomTypeModalOpen, setRoomTypeModalOpen] = useState(false);
  const [selectedHotelForRoomType, setSelectedHotelForRoomType] = useState(null);
  const [hotelRoomTypes, setHotelRoomTypes] = useState([]);
  const [rtName, setRtName] = useState('');
  const [rtPrice, setRtPrice] = useState('');
  const [rtAdults, setRtAdults] = useState('2');
  const [rtChildren, setRtChildren] = useState('1');
  const [rtDescription, setRtDescription] = useState('');
  const [rtSubmitting, setRtSubmitting] = useState(false);
  const [rtError, setRtError] = useState('');
  const [rtSuccess, setRtSuccess] = useState('');

  const fetchHotels = () => {
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
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const filtered = hotels.filter((h) => h.name.toLowerCase().includes(search.toLowerCase()));

  const handleOpenCreate = () => {
    setName('');
    setAddress('');
    setCity('');
    setDescription('');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa khách sạn này không?')) {
      try {
        await hotelService.deleteHotel(id);
      } catch (e) {
        setHotels((prev) => prev.filter((h) => h.id !== id));
      }
      fetchHotels();
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const newHotelData = {
      name,
      address: address || '123 QA Boulevard',
      city: city || 'Thành Phố Hồ Chí Minh',
      description,
      starRating: 5,
      status: 'active',
      imageUrl: '/images/hotels/hotel-default.jpg',
    };
    try {
      await hotelService.createHotel(newHotelData);
    } catch (err) {
      setHotels((prev) => [...prev, { ...newHotelData, id: `h-${Date.now()}`, image: '/images/hotels/hotel-default.jpg' }]);
    }
    setModalOpen(false);
    fetchHotels();
  };

  // Open Room Type Management for a specific hotel
  const openRoomTypeModal = async (hotel) => {
    setSelectedHotelForRoomType(hotel);
    setRtName('');
    setRtPrice('2500000');
    setRtAdults('2');
    setRtChildren('1');
    setRtDescription('');
    setRtError('');
    setRtSuccess('');
    setRoomTypeModalOpen(true);

    try {
      const res = await roomService.getRoomTypesByHotel(hotel.id);
      setHotelRoomTypes(res.roomTypes || []);
    } catch (err) {
      const rts = hotel.RoomTypes || hotel.roomTypes || [];
      setHotelRoomTypes(rts);
    }
  };

  // Create new Room Type for selected hotel
  const handleSaveRoomType = async (e) => {
    e.preventDefault();
    setRtError('');
    setRtSuccess('');

    if (!selectedHotelForRoomType || !selectedHotelForRoomType.id) {
      setRtError('Không xác định được khách sạn đang chọn.');
      return;
    }

    const trimmedName = rtName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setRtError('Tên hạng phòng phải có ít nhất 2 ký tự.');
      return;
    }

    const parsedPrice = parseFloat(rtPrice);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setRtError('Giá phòng phải là một số không âm.');
      return;
    }

    setRtSubmitting(true);
    try {
      await roomService.createRoomType({
        hotelId: parseInt(selectedHotelForRoomType.id, 10),
        name: trimmedName,
        basePrice: parsedPrice,
        price: parsedPrice,
        pricePerNight: parsedPrice,
        capacity: (parseInt(rtAdults, 10) || 2) + (parseInt(rtChildren, 10) || 0),
        capacityAdults: parseInt(rtAdults, 10) || 2,
        capacityChildren: parseInt(rtChildren, 10) || 0,
        description: rtDescription.trim() || 'Hạng phòng cao cấp sang trọng',
        isActive: true,
      });

      const res = await roomService.getRoomTypesByHotel(selectedHotelForRoomType.id);
      setHotelRoomTypes(res.roomTypes || []);
      setRtName('');
      setRtPrice('2500000');
      setRtSuccess('Tạo hạng phòng mới thành công!');
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Không thể tạo hạng phòng.';
      setRtError(message);
    } finally {
      setRtSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-400">Danh Mục Hệ Thống</span>
          <h1 className="font-serif text-3xl font-bold text-slate-100">Quản Lý Khách Sạn & Hạng Phòng</h1>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl gold-gradient-bg text-navy-950 font-bold text-xs shadow-gold-glow flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Thêm Khách Sạn Mới
        </button>
      </div>

      <div className="p-4 rounded-2xl bg-navy-900 border border-slate-800">
        <div className="w-full sm:w-80">
          <SearchBar value={search} onChange={setSearch} placeholder="Tìm kiếm tên khách sạn..." />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((hotel) => (
          <div key={hotel.id} className="p-6 rounded-3xl bg-navy-900 border border-gold-500/20 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <SafeImage
                src={hotel.imageUrl || hotel.image || '/images/hotels/hotel-default.jpg'}
                alt={hotel.name}
                fallbackCategory="hotel"
                className="w-full h-44 rounded-2xl object-cover"
              />
              <h3 className="font-serif text-lg font-bold text-slate-100">{hotel.name}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gold-400" /> {hotel.city}
              </p>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => openRoomTypeModal(hotel)}
                className="flex-1 py-2 px-3 rounded-xl bg-navy-950 border border-slate-800 text-gold-400 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-800"
              >
                <Layers className="w-3.5 h-3.5" /> Quản Lý Hạng Phòng
              </button>
              <button
                onClick={() => handleDelete(hotel.id)}
                className="py-2 px-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold"
                title="Xóa khách sạn"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE HOTEL MODAL */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Thêm Khách Sạn Mới">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Tên Khách Sạn</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-navy-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Địa Chỉ</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-navy-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Thành Phố</label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-navy-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl gold-gradient-bg text-navy-950 font-bold text-xs shadow-gold-glow"
          >
            Lưu Khách Sạn
          </button>
        </form>
      </Modal>

      {/* ROOM TYPE MANAGEMENT MODAL */}
      {roomTypeModalOpen && selectedHotelForRoomType && (
        <Modal
          isOpen={roomTypeModalOpen}
          onClose={() => setRoomTypeModalOpen(false)}
          title={`Hạng Phòng - ${selectedHotelForRoomType.name}`}
        >
          <div className="space-y-6 text-xs">
            {rtError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2">
                <span>{rtError}</span>
              </div>
            )}
            {rtSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
                <span>{rtSuccess}</span>
              </div>
            )}

            {/* List of current room types */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gold-400 uppercase text-[10px] tracking-wider">Danh Sách Hạng Phòng Hiện Có</h4>
              {hotelRoomTypes.length === 0 ? (
                <div className="p-3 rounded-xl bg-navy-950 border border-slate-800 text-slate-400 text-center">
                  Chưa có hạng phòng nào cho khách sạn này.
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {hotelRoomTypes.map((rt) => (
                    <div key={rt.id} className="p-3 rounded-xl bg-navy-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-100">{rt.name}</div>
                        <div className="text-[11px] text-slate-400">
                          {rt.capacity || rt.capacityAdults || 2} sức chứa
                        </div>
                      </div>
                      <div className="font-mono font-bold text-gold-400">
                        {formatCurrencyVND(rt.basePrice || rt.price || rt.pricePerNight || 0)}/đêm
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form to create room type */}
            <form onSubmit={handleSaveRoomType} className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="font-semibold text-slate-200">Thêm Hạng Phòng Mới</h4>
              <div className="space-y-1">
                <label className="text-slate-400">Tên Hạng Phòng (VD: Executive Suite, Deluxe Ocean)</label>
                <input
                  type="text"
                  required
                  placeholder="Executive Suite"
                  value={rtName}
                  onChange={(e) => setRtName(e.target.value)}
                  className="w-full bg-navy-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400">Giá 1 Đêm (VNĐ)</label>
                  <input
                    type="number"
                    required
                    value={rtPrice}
                    onChange={(e) => setRtPrice(e.target.value)}
                    className="w-full bg-navy-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Người Lớn</label>
                  <input
                    type="number"
                    value={rtAdults}
                    onChange={(e) => setRtAdults(e.target.value)}
                    className="w-full bg-navy-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Trẻ Em</label>
                  <input
                    type="number"
                    value={rtChildren}
                    onChange={(e) => setRtChildren(e.target.value)}
                    className="w-full bg-navy-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={rtSubmitting}
                className="w-full py-2.5 rounded-xl gold-gradient-bg text-navy-950 font-bold shadow-gold-glow mt-2 disabled:opacity-50"
              >
                {rtSubmitting ? 'Đang Xử Lý...' : 'Lưu Hạng Phòng'}
              </button>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};
