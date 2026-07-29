import React, { useState, useEffect } from 'react';
import { Plus, Trash2, MapPin } from 'lucide-react';
import { hotelService } from '../../services/hotelService';
import { Modal } from '../../components/Modal';
import { SearchBar } from '../../components/SearchBar';
import { SafeImage } from '../../components/SafeImage';

export const AdminHotelsPage = () => {
  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');

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

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-400">Danh Mục Hệ Thống</span>
          <h1 className="font-serif text-3xl font-bold text-slate-100">Quản Lý Khách Sạn & Resort</h1>
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
          <div key={hotel.id} className="p-6 rounded-3xl bg-navy-900 border border-gold-500/20 space-y-4 shadow-xl">
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
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleDelete(hotel.id)}
                className="py-2 px-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

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
    </div>
  );
};
