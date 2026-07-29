import React, { useState, useEffect } from 'react';
import { roomService } from '../../services/roomService';
import { StatusBadge } from '../../components/StatusBadge';

export const AdminRoomsPage = () => {
  const [rooms, setRooms] = useState([]);

  const fetchRooms = () => {
    roomService.getRooms()
      .then((data) => {
        if (data.rooms && data.rooms.length > 0) {
          setRooms(data.rooms);
        } else if (window.AURENCE?.rooms) {
          setRooms(window.AURENCE.rooms);
        }
      })
      .catch(() => {
        if (window.AURENCE?.rooms) {
          setRooms(window.AURENCE.rooms);
        }
      });
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    await roomService.updateRoom(id, { status: newStatus.toLowerCase() });
    fetchRooms();
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-gold-400">Vận Hành Khách Sạn</span>
        <h1 className="font-serif text-3xl font-bold text-slate-100">Quản Lý Phòng & Trạng Thái</h1>
      </div>

      <div className="p-6 rounded-3xl bg-navy-900 border border-gold-500/20 space-y-4 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-gold-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Số Phòng</th>
                <th className="py-3 px-3">Tầng</th>
                <th className="py-3 px-3">Hạng Suite</th>
                <th className="py-3 px-3">Trạng Thái</th>
                <th className="py-3 px-3 text-right">Cập Nhật Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {rooms.map((room) => (
                <tr key={room.id}>
                  <td className="py-4 px-3 font-mono font-bold text-slate-100 text-sm">{room.roomNumber}</td>
                  <td className="py-4 px-3">Tầng {room.floor}</td>
                  <td className="py-4 px-3 font-semibold text-slate-200">
                    {room.RoomType ? room.RoomType.name : 'Deluxe Room'}
                  </td>
                  <td className="py-4 px-3"><StatusBadge status={room.status} /></td>
                  <td className="py-4 px-3 text-right">
                    <select
                      value={room.status.toLowerCase()}
                      onChange={(e) => handleStatusChange(room.id, e.target.value)}
                      className="bg-navy-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none cursor-pointer"
                    >
                      <option value="available">available (Trống)</option>
                      <option value="occupied">occupied (Đang ở)</option>
                      <option value="reserved">reserved (Đã đặt)</option>
                      <option value="cleaning">cleaning (Dọn dẹp)</option>
                      <option value="maintenance">maintenance (Bảo trì)</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
