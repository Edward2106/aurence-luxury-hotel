import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from '../../components/Modal';

export const AdminEmployeesPage = () => {
  const [employees, setEmployees] = useState([
    { id: 'emp-1', userName: 'Jean-Luc Dubois', userEmail: 'j.dubois@aurence.com', position: 'Tổng Quản Lý', department: 'Ban Điều Hành', salary: 12000 },
    { id: 'emp-2', userName: 'Claire Dupont', userEmail: 'c.dupont@aurence.com', position: 'Trưởng Quản Gia', department: 'Dịch Vụ Khách Hàng', salary: 6500 },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [position] = useState('Quản Gia');

  const handleDelete = (id) => {
    if (window.confirm('Bạn có muốn xóa nhân viên này khỏi danh sách không?')) {
      setEmployees(employees.filter((e) => e.id !== id));
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const newEmp = {
      id: `emp-${Date.now()}`,
      userName: name,
      userEmail: email,
      position,
      department: 'Dịch Vụ',
      salary: 5000,
    };
    setEmployees([newEmp, ...employees]);
    setModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-400">Quản Lý Nhân Sự</span>
          <h1 className="font-serif text-3xl font-bold text-slate-100">Danh Sách Nhân Viên</h1>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl gold-gradient-bg text-navy-950 font-bold text-xs shadow-gold-glow flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Thêm Nhân Viên Mới
        </button>
      </div>

      <div className="p-6 rounded-3xl bg-navy-900 border border-gold-500/20 space-y-4 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-gold-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Họ Tên</th>
                <th className="py-3 px-3">Vị Trí</th>
                <th className="py-3 px-3">Bộ Phận</th>
                <th className="py-3 px-3">Lương Tháng</th>
                <th className="py-3 px-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td className="py-4 px-3">
                    <p className="font-bold text-slate-100">{emp.userName}</p>
                    <p className="text-[11px] text-slate-400">{emp.userEmail}</p>
                  </td>
                  <td className="py-4 px-3 font-semibold text-gold-400">{emp.position}</td>
                  <td className="py-4 px-3">{emp.department}</td>
                  <td className="py-4 px-3 font-mono text-slate-100">${emp.salary}</td>
                  <td className="py-4 px-3 text-right">
                    <button
                      onClick={() => handleDelete(emp.id)}
                      className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Thêm Nhân Viên Mới">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Họ và Tên</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-navy-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Email Nhân Viên</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-navy-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl gold-gradient-bg text-navy-950 font-bold text-xs shadow-gold-glow"
          >
            Tạo Nhân Viên
          </button>
        </form>
      </Modal>
    </div>
  );
};
