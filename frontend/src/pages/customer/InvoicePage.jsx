import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Printer, Crown, ArrowLeft, CheckCircle2, QrCode, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../services/api';
import { bookingService } from '../../services/bookingService';

export const InvoicePage = () => {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (invoiceId) {
      bookingService
        .getBookingById(invoiceId)
        .then((data) => {
          const b = data.booking;
          if (b) {
            const roomCharge = parseFloat(b.Invoice?.roomCharge || b.roomPrice || 0);
            const vatAmount = parseFloat(b.Invoice?.vatAmount || b.vatAmount || 0);
            const totalAmount = parseFloat(b.Invoice?.totalAmount || b.totalAmount || 0);
            setInvoice({
              invoiceNumber: b.Invoice?.invoiceCode || `INV-${b.bookingCode}`,
              bookingCode: b.bookingCode,
              issuedAt: b.Invoice?.created_at || b.created_at,
              status: (b.Invoice?.paymentStatus || b.paymentStatus || b.status || 'UNPAID').toUpperCase(),
              hotel: {
                name: b.Room?.Hotel?.name || 'Aurence Luxury Hotel',
                address: b.Room?.Hotel?.address || '15 Place Vendôme, Quận 1',
                city: b.Room?.Hotel?.city || 'Hồ Chí Minh',
                country: 'Việt Nam',
                taxRegistration: 'EU-98234811-FRA',
              },
              customer: {
                name: b.User?.fullName || 'Alexander Sterling',
                email: b.User?.email || 'customer@aurence.com',
                phone: b.User?.phone || '+84 90 123 4567',
              },
              lineItems: [
                {
                  description: `${b.Room?.RoomType?.name || 'Phòng Khách Sạn Cao Cấp'} (Đặt phòng #${b.bookingCode})`,
                  unitPrice: parseFloat(b.roomPrice || roomCharge),
                  quantity: b.numberOfNights || 1,
                  amount: roomCharge > 0 ? roomCharge : totalAmount,
                },
              ],
              roomCharges: roomCharge,
              serviceCharges: 0,
              discountAmount: 0,
              vatAmount: vatAmount,
              grandTotal: totalAmount,
            });
          }
        })
        .catch(() => {
          setInvoice({
            invoiceNumber: `INV-${invoiceId}`,
            bookingCode: invoiceId,
            issuedAt: new Date().toISOString(),
            status: 'UNPAID',
            hotel: { name: 'Aurence Luxury Hotel', address: '15 Place Vendôme', city: 'Hồ Chí Minh', country: 'Việt Nam' },
            customer: { name: 'Khách hàng Aurence', email: 'customer@aurence.com', phone: '0901234567' },
            lineItems: [{ description: 'Đặt phòng khách sạn', unitPrice: 7500000, quantity: 1, amount: 7500000 }],
            roomCharges: 7500000,
            vatAmount: 750000,
            grandTotal: 8250000,
          });
        });
    }
  }, [invoiceId]);

  const handleConfirmPay = async () => {
    setIsSubmitting(true);
    try {
      await bookingService.payInvoice(invoiceId);
      alert('Mô phỏng thanh toán thành công. Hóa đơn của bạn đã được cập nhật.');
      setInvoice((prev) => (prev ? { ...prev, status: 'PAID' } : null));
      setShowPayModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi khi thực hiện thanh toán mô phỏng.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!invoice) return <div className="text-center py-20 text-slate-400">Đang tải hóa đơn...</div>;

  const isPaid = invoice.status === 'PAID';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <Link to="/my-bookings" className="text-xs text-slate-400 hover:text-gold-400 flex items-center gap-1 font-semibold">
          <ArrowLeft className="w-4 h-4" /> Quay Lại Đặt Phòng
        </Link>
        <div className="flex items-center gap-3">
          {!isPaid && (
            <button
              onClick={() => setShowPayModal(true)}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 text-navy-950 font-bold text-xs shadow-lg hover:bg-emerald-400 flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" /> Mô Phỏng Thanh Toán
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 rounded-xl gold-gradient-bg text-navy-950 font-bold text-xs shadow-gold-glow flex items-center gap-2"
          >
            <Printer className="w-4 h-4" /> In Hóa Đơn / Xuất PDF
          </button>
        </div>
      </div>

      {!isPaid && (
        <div className="p-6 rounded-3xl bg-navy-900 border border-gold-500/30 text-center space-y-4 print:hidden">
          <div className="flex items-center justify-center gap-2 text-gold-400 font-bold text-sm">
            <QrCode className="w-5 h-5" /> Mã QR Thanh Toán Mô Phỏng
          </div>
          <div className="w-48 h-48 mx-auto p-2 rounded-2xl bg-white border border-gold-500/30 flex items-center justify-center shadow-xl">
            <img
              src="/images/payment/payment-qr-simulation.jpg"
              alt="Mã QR thanh toán mô phỏng"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
          <p className="text-xs text-slate-300">
            Quét mã để mô phỏng quy trình thanh toán. Hệ thống không thực hiện giao dịch ngân hàng thực tế.
          </p>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 max-w-lg mx-auto flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Chức năng này chỉ cập nhật trạng thái hóa đơn trong cơ sở dữ liệu và phục vụ mục đích học tập, trình diễn.</span>
          </div>
        </div>
      )}

      <div className="p-10 rounded-3xl bg-navy-900 border border-gold-500/30 shadow-2xl space-y-10 print:bg-white print:text-black print:p-0">
        <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-800 pb-6 print:border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center">
              <Crown className="w-5 h-5 text-navy-950" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold gold-gradient-text print:text-black">AURENCE</span>
              <span className="block text-[10px] tracking-widest text-slate-400 uppercase">Hóa Đơn Giá Trị Gia Tăng</span>
            </div>
          </div>
          <div className="text-left sm:text-right mt-4 sm:mt-0">
            <span className="font-mono text-base font-bold text-gold-400 print:text-black">{invoice.invoiceNumber}</span>
            <span className={`text-[11px] flex items-center justify-end gap-1 font-semibold mt-1 ${isPaid ? 'text-emerald-400' : 'text-amber-400'}`}>
              <CheckCircle2 className="w-3.5 h-3.5" /> {isPaid ? 'Đã mô phỏng thanh toán' : 'Chưa mô phỏng thanh toán'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-slate-300 print:text-gray-800">
          <div className="space-y-1.5 p-4 rounded-2xl bg-navy-950 border border-slate-800 print:bg-gray-50">
            <h4 className="font-bold text-gold-400 print:text-black uppercase text-[10px]">Thông Tin Khách Sạn</h4>
            <p className="font-bold text-slate-100 print:text-black">{invoice.hotel.name}</p>
            <p>{invoice.hotel.address}, {invoice.hotel.city}</p>
          </div>
          <div className="space-y-1.5 p-4 rounded-2xl bg-navy-950 border border-slate-800 print:bg-gray-50">
            <h4 className="font-bold text-gold-400 print:text-black uppercase text-[10px]">Thông Tin Khách Hàng</h4>
            <p className="font-bold text-slate-100 print:text-black">{invoice.customer.name}</p>
            <p>{invoice.customer.email}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-gold-400 uppercase text-[10px] print:border-gray-300 print:text-black">
                <th className="py-3 px-2">Nội Dung</th>
                <th className="py-3 px-2 text-center">Số Lượng</th>
                <th className="py-3 px-2 text-right">Đơn Giá</th>
                <th className="py-3 px-2 text-right">Thành Tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 print:divide-gray-200 print:text-gray-800">
              {invoice.lineItems.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-3 px-2">{item.description}</td>
                  <td className="py-3 px-2 text-center">{item.quantity}</td>
                  <td className="py-3 px-2 text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-3 px-2 text-right font-bold text-slate-100 print:text-black">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800 print:border-gray-300">
          <div className="w-full sm:w-72 space-y-2 text-xs text-slate-300 print:text-gray-800">
            <div className="flex justify-between font-bold text-slate-100 pt-2 border-t border-slate-800 print:text-black">
              <span>Tổng Tiền Thanh Toán:</span>
              <span className="gold-gradient-text text-base print:text-black">{formatCurrency(invoice.grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {showPayModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-gold-500/30 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-slate-100 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-gold-400" /> Xác Nhận Thanh Toán Mô Phỏng
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bạn đang thực hiện quy trình thanh toán mô phỏng. Hệ thống chỉ cập nhật trạng thái hóa đơn trong cơ sở dữ liệu và không thực hiện giao dịch ngân hàng thực tế.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowPayModal(false)}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-navy-950 border border-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-800"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmPay}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-navy-950 text-xs font-bold shadow-lg hover:bg-emerald-400"
              >
                {isSubmitting ? 'Đang Xử Lý...' : 'Xác Nhận Mô Phỏng'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
