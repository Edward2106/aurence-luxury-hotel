import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, RefreshCw, X, AlertCircle } from 'lucide-react';
import { roomService } from '../../services/roomService';
import { hotelService } from '../../services/hotelService';
import { StatusBadge } from '../../components/StatusBadge';
import { formatCurrencyVND } from '../../services/api';

const STATUS_OPTIONS = [
  { value: 'available', label: 'Còn trống' },
  { value: 'occupied', label: 'Đang sử dụng' },
  { value: 'reserved', label: 'Đã đặt' },
  { value: 'cleaning', label: 'Đang dọn dẹp' },
  { value: 'maintenance', label: 'Đang bảo trì' },
  { value: 'inactive', label: 'Ngừng hoạt động' },
];

export const formatFloor = (floor) => {
  if (floor === undefined || floor === null || floor === '') return 'Tầng 1';
  const num = parseInt(floor, 10);
  if (!isNaN(num)) {
    if (num === 0) return 'Tầng trệt';
    return `Tầng ${num}`;
  }
  const str = String(floor).trim();
  if (str.toLowerCase().startsWith('tầng')) return str;
  return `Tầng ${str}`;
};

export const AdminRoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedHotelFilter, setSelectedHotelFilter] = useState('');
  const [selectedRoomTypeFilter, setSelectedRoomTypeFilter] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Form state
  const [formState, setFormState] = useState({
    hotelId: '',
    roomTypeId: '',
    roomNumber: '',
    floor: '1',
    status: 'available',
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [roomsData, hotelsData, roomTypesData] = await Promise.all([
        roomService.getRooms(),
        hotelService.getHotels(),
        roomService.getRoomTypes().catch(() => ({ roomTypes: [] })),
      ]);

      const fetchedRooms = roomsData.rooms || [];
      const fetchedHotels = hotelsData.hotels || [];
      const fetchedRoomTypes = roomTypesData.roomTypes || [];

      setRooms(fetchedRooms);
      setHotels(fetchedHotels);

      if (fetchedRoomTypes.length > 0) {
        setRoomTypes(fetchedRoomTypes);
      } else {
        const extracted = fetchedHotels.flatMap((h) => h.RoomTypes || h.roomTypes || []);
        setRoomTypes(extracted);
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách phòng:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await roomService.updateRoomStatus(id, newStatus.toLowerCase());
      if (res.room) {
        setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, ...res.room, status: newStatus.toLowerCase() } : r)));
      } else {
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái phòng.');
    }
  };

  // Filtered rooms calculation
  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      if (searchKeyword && !r.roomNumber.toLowerCase().includes(searchKeyword.toLowerCase())) {
        return false;
      }
      if (selectedHotelFilter && String(r.hotelId) !== String(selectedHotelFilter)) {
        return false;
      }
      if (selectedRoomTypeFilter && String(r.roomTypeId) !== String(selectedRoomTypeFilter)) {
        return false;
      }
      if (selectedStatusFilter && r.status.toLowerCase() !== selectedStatusFilter.toLowerCase()) {
        return false;
      }
      return true;
    });
  }, [rooms, searchKeyword, selectedHotelFilter, selectedRoomTypeFilter, selectedStatusFilter]);

  // Open Add Modal
  const openAddModal = () => {
    setFormError('');
    setFormState({
      hotelId: hotels[0]?.id || '',
      roomTypeId: roomTypes[0]?.id || '',
      roomNumber: '',
      floor: '1',
      status: 'available',
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (room) => {
    setSelectedRoom(room);
    setFormError('');
    setFormState({
      hotelId: room.hotelId || '',
      roomTypeId: room.roomTypeId || '',
      roomNumber: room.roomNumber || '',
      floor: String(room.floor || '1'),
      status: room.status || 'available',
    });
    setIsEditModalOpen(true);
  };

  // Open Delete Modal
  const openDeleteModal = (room) => {
    setSelectedRoom(room);
    setIsDeleteModalOpen(true);
  };

  // Submit Add Room
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formState.hotelId || !formState.roomTypeId || !formState.roomNumber) {
      setFormError('Vui lòng điền đầy đủ: Khách sạn, Hạng phòng và Số phòng.');
      return;
    }

    setIsSubmitting(true);
    try {
      await roomService.createRoom(formState);
      setIsAddModalOpen(false);
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Có lỗi khi thêm phòng mới.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Edit Room
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formState.roomNumber) {
      setFormError('Số phòng không được để trống.');
      return;
    }

    setIsSubmitting(true);
    try {
      await roomService.updateRoom(selectedRoom.id, formState);
      setIsEditModalOpen(false);
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Có lỗi khi cập nhật phòng.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Delete Room
  const handleDeleteSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await roomService.deleteRoom(selectedRoom.id);
      if (res.isSoftDeleted) {
        alert(res.message);
      }
      setIsDeleteModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi khi xóa phòng.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // RoomTypes matching selected hotel in form
  const availableFormRoomTypes = useMemo(() => {
    if (!formState.hotelId) return roomTypes;
    return roomTypes.filter((rt) => String(rt.hotelId) === String(formState.hotelId));
  }, [roomTypes, formState.hotelId]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-400">Vận Hành Khách Sạn</span>
          <h1 className="font-serif text-3xl font-bold text-slate-100">Quản Lý Phòng & Trạng Thái</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl bg-navy-900 border border-slate-800 text-slate-300 hover:text-gold-400"
            title="Tải lại danh sách"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-xl gold-gradient-bg text-navy-950 font-bold text-xs shadow-gold-glow flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" /> Thêm Phòng
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="p-6 rounded-3xl bg-navy-900 border border-gold-500/20 space-y-4 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Tìm theo số phòng..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full bg-navy-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-gold-500/50"
            />
          </div>

          <select
            value={selectedHotelFilter}
            onChange={(e) => setSelectedHotelFilter(e.target.value)}
            className="w-full bg-navy-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none cursor-pointer"
          >
            <option value="">Tất cả Khách Sạn</option>
            {hotels.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>

          <select
            value={selectedRoomTypeFilter}
            onChange={(e) => setSelectedRoomTypeFilter(e.target.value)}
            className="w-full bg-navy-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none cursor-pointer"
          >
            <option value="">Tất cả Hạng Phòng</option>
            {roomTypes.map((rt) => (
              <option key={rt.id} value={rt.id}>
                {rt.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="w-full bg-navy-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none cursor-pointer"
          >
            <option value="">Tất cả Trạng Thái</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label} ({opt.value})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="p-6 rounded-3xl bg-navy-900 border border-gold-500/20 space-y-4 shadow-xl">
        {isLoading ? (
          <div className="text-center py-12 text-slate-400">Đang tải danh sách phòng...</div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-12 text-slate-400">Không tìm thấy phòng phù hợp.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-gold-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Số Phòng</th>
                  <th className="py-3 px-3">Tầng</th>
                  <th className="py-3 px-3">Khách Sạn</th>
                  <th className="py-3 px-3">Hạng Suite</th>
                  <th className="py-3 px-3">Giá Đêm</th>
                  <th className="py-3 px-3">Trạng Thái Badge</th>
                  <th className="py-3 px-3">Thay Đổi Trạng Thái</th>
                  <th className="py-3 px-3 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-navy-950/50">
                    <td className="py-4 px-3 font-mono font-bold text-slate-100 text-sm">{room.roomNumber}</td>
                    <td className="py-4 px-3 text-slate-300 font-medium">{formatFloor(room.floor)}</td>
                    <td className="py-4 px-3 text-slate-300">{room.Hotel?.name || 'Aurence Hotel'}</td>
                    <td className="py-4 px-3 font-semibold text-slate-200">
                      {room.RoomType ? room.RoomType.name : 'Deluxe Room'}
                    </td>
                    <td className="py-4 px-3 font-mono font-bold text-gold-400">
                      {formatCurrencyVND(room.RoomType?.basePrice || room.RoomType?.price || 0)}
                    </td>
                    <td className="py-4 px-3">
                      <StatusBadge status={room.status} />
                    </td>
                    <td className="py-4 px-3">
                      <select
                        value={(room.status || 'available').toLowerCase()}
                        onChange={(e) => handleStatusChange(room.id, e.target.value)}
                        className="bg-navy-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none cursor-pointer"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label} ({opt.value})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(room)}
                          className="p-1.5 rounded-lg bg-navy-950 border border-slate-800 text-slate-300 hover:text-gold-400"
                          title="Sửa phòng"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(room)}
                          className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
                          title="Xóa phòng"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD ROOM MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-gold-500/30 rounded-3xl p-6 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-serif text-lg font-bold text-slate-100">Thêm Phòng Mới</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Khách Sạn</label>
                <select
                  value={formState.hotelId}
                  onChange={(e) => setFormState({ ...formState, hotelId: e.target.value })}
                  className="w-full bg-navy-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none"
                >
                  <option value="">-- Chọn Khách Sạn --</option>
                  {hotels.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Hạng Phòng (Room Type)</label>
                <select
                  value={formState.roomTypeId}
                  onChange={(e) => setFormState({ ...formState, roomTypeId: e.target.value })}
                  className="w-full bg-navy-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none"
                >
                  <option value="">-- Chọn Hạng Phòng --</option>
                  {availableFormRoomTypes.map((rt) => (
                    <option key={rt.id} value={rt.id}>
                      {rt.name} - {formatCurrencyVND(rt.basePrice || rt.price || 0)}/đêm
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Số Phòng (e.g. 101, 202)</label>
                  <input
                    type="text"
                    placeholder="101"
                    value={formState.roomNumber}
                    onChange={(e) => setFormState({ ...formState, roomNumber: e.target.value })}
                    className="w-full bg-navy-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Tầng (Floor)</label>
                  <input
                    type="number"
                    placeholder="1"
                    value={formState.floor}
                    onChange={(e) => setFormState({ ...formState, floor: e.target.value })}
                    className="w-full bg-navy-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Trạng Thái Ban Đầu</label>
                <select
                  value={formState.status}
                  onChange={(e) => setFormState({ ...formState, status: e.target.value })}
                  className="w-full bg-navy-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none cursor-pointer"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} ({opt.value})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-navy-950 border border-slate-800 text-slate-300 font-semibold hover:bg-slate-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl gold-gradient-bg text-navy-950 font-bold shadow-gold-glow"
                >
                  {isSubmitting ? 'Đang Xử Lý...' : 'Lưu Phòng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ROOM MODAL */}
      {isEditModalOpen && selectedRoom && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-gold-500/30 rounded-3xl p-6 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-serif text-lg font-bold text-slate-100">Chỉnh Sửa Phòng #{selectedRoom.roomNumber}</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Khách Sạn</label>
                <select
                  value={formState.hotelId}
                  onChange={(e) => setFormState({ ...formState, hotelId: e.target.value })}
                  className="w-full bg-navy-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none"
                >
                  {hotels.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Hạng Phòng (Room Type)</label>
                <select
                  value={formState.roomTypeId}
                  onChange={(e) => setFormState({ ...formState, roomTypeId: e.target.value })}
                  className="w-full bg-navy-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none"
                >
                  {availableFormRoomTypes.map((rt) => (
                    <option key={rt.id} value={rt.id}>
                      {rt.name} - {formatCurrencyVND(rt.basePrice || rt.price || 0)}/đêm
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Số Phòng</label>
                  <input
                    type="text"
                    value={formState.roomNumber}
                    onChange={(e) => setFormState({ ...formState, roomNumber: e.target.value })}
                    className="w-full bg-navy-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Tầng (Floor)</label>
                  <input
                    type="number"
                    value={formState.floor}
                    onChange={(e) => setFormState({ ...formState, floor: e.target.value })}
                    className="w-full bg-navy-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Trạng Thái</label>
                <select
                  value={formState.status}
                  onChange={(e) => setFormState({ ...formState, status: e.target.value })}
                  className="w-full bg-navy-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none cursor-pointer"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} ({opt.value})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-navy-950 border border-slate-800 text-slate-300 font-semibold hover:bg-slate-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl gold-gradient-bg text-navy-950 font-bold shadow-gold-glow"
                >
                  {isSubmitting ? 'Đang Xử Lý...' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && selectedRoom && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-rose-500/30 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-slate-100 flex items-center gap-2 text-rose-400">
              <Trash2 className="w-5 h-5" /> Xác Nhận Xóa Phòng
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bạn có chắc chắn muốn xóa phòng <strong className="text-gold-400">#{selectedRoom.roomNumber}</strong> thuộc {selectedRoom.Hotel?.name}?
            </p>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Nếu phòng đã có lịch sử đặt phòng, hệ thống sẽ tự động Soft Delete (chuyển sang Ngừng hoạt động) để bảo vệ dữ liệu hóa đơn.</span>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-navy-950 border border-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-800"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-rose-500 text-slate-950 text-xs font-bold shadow-lg hover:bg-rose-400"
              >
                {isSubmitting ? 'Đang Xử Lý...' : 'Xác Nhận Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
