import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { ConciergeBell, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { serviceService } from '../../services/serviceService';
import { useAuthContext } from '../../context/AuthContext';
import { CurrencyText } from '../../components/CurrencyText';
import { Modal } from '../../components/Modal';
import { SafeImage } from '../../components/SafeImage';

export const ServicesPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuthContext();

  const bookingId = searchParams.get('bookingId');

  const [servicesList, setServicesList] = useState([]);
  const [activeService, setActiveService] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    serviceService.getServices()
      .then((data) => {
        if (data.services && data.services.length > 0) {
          setServicesList(data.services);
        } else if (window.AURENCE?.services) {
          setServicesList(window.AURENCE.services);
        }
      })
      .catch(() => {
        if (window.AURENCE?.services) {
          setServicesList(window.AURENCE.services);
        }
      });
  }, []);

  const handleOpenModal = (srv) => {
    if (!currentUser) {
      navigate('/login', {
        state: {
          from: location.pathname + location.search,
          message: 'Vui lòng đăng nhập hoặc đăng ký tài khoản để sử dụng dịch vụ.',
        },
      });
      return;
    }
    setActiveService(srv);
    setErrorMessage('');
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!activeService) return;

    if (!currentUser) {
      navigate('/login', {
        state: {
          from: location.pathname + location.search,
          message: 'Vui lòng đăng nhập hoặc đăng ký tài khoản để sử dụng dịch vụ.',
        },
      });
      return;
    }

    setErrorMessage('');
    try {
      await serviceService.orderService({
        bookingId: bookingId || undefined,
        serviceId: activeService.id,
        quantity,
      });
      setOrderSuccess(true);
      setTimeout(() => {
        setOrderSuccess(false);
        setActiveService(null);
        setQuantity(1);
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể đặt dịch vụ. Vui lòng kiểm tra lại.';
      setErrorMessage(msg);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-400 flex items-center justify-center gap-1.5">
          <ConciergeBell className="w-4 h-4" /> Dịch Vụ Đặt Tại Phòng 24/7
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100">Dịch Vụ Cao Cấp</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {servicesList.map((srv) => (
          <div key={srv.id} className="group glass-card rounded-3xl overflow-hidden border border-gold-500/20 flex flex-col justify-between p-5 space-y-4">
            <SafeImage
              src={srv.imageUrl || srv.image || '/images/services/service-default.jpg'}
              alt={srv.name}
              fallbackCategory="service"
              className="w-full h-44 rounded-2xl object-cover"
            />
            <div>
              <h4 className="font-serif text-base font-bold text-slate-100">{srv.name}</h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{srv.description}</p>
            </div>
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <CurrencyText amount={srv.price} className="text-base font-bold gold-gradient-text" />
              </div>
              <button
                onClick={() => handleOpenModal(srv)}
                className="px-3.5 py-2 rounded-xl gold-gradient-bg text-navy-950 font-bold text-xs flex items-center gap-1"
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Đặt Dịch Vụ
              </button>
            </div>
          </div>
        ))}
      </div>

      {activeService && (
        <Modal isOpen={!!activeService} onClose={() => setActiveService(null)} title={`Đặt ${activeService.name}`}>
          {orderSuccess ? (
            <div className="p-6 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="font-serif text-lg font-bold text-slate-100">Đã Nhận Yêu Cầu Đặt Dịch Vụ</h4>
              <p className="text-xs text-slate-300">Quản gia sẽ phục vụ bạn ngay lập tức.</p>
            </div>
          ) : (
            <form onSubmit={handleOrderSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400">
                  {errorMessage}
                </div>
              )}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Số Lượng</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-navy-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl gold-gradient-bg text-navy-950 font-bold text-xs shadow-gold-glow"
              >
                Xác Nhận & Ghi Vào Hóa Đơn Phòng
              </button>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};
