(function () {
  const hotelDefault = "/images/hotels/hotel-default.jpg";
  const roomDefault = "/images/rooms/room-default.jpg";
  const serviceDefault = "/images/services/service-default.jpg";

  const hotels = [
    { 
      id: "aurence-danang", 
      name: "Aurence Đà Nẵng Resort", 
      location: "Bãi biển Mỹ Khê, Đà Nẵng", 
      country: "Việt Nam", 
      price: 3500000, 
      rating: 4.9, 
      reviews: 842, 
      image: hotelDefault, 
      gallery: [hotelDefault, roomDefault, serviceDefault], 
      facilities: ["Hồ bơi", "Spa", "Nhà hàng", "Phòng gym", "Wi-Fi miễn phí", "Bãi đậu xe"], 
      description: "Một thiên đường nghỉ dưỡng yên bình bên bờ biển Mỹ Khê với các biệt thự có hồ bơi riêng và dịch vụ quản gia tận tâm - nơi chân trời gặp biển cả.", 
      stars: 5 
    },
    { 
      id: "aurence-nhatrang", 
      name: "Aurence Nha Trang Bay", 
      location: "Đường Trần Phú, Nha Trang", 
      country: "Việt Nam", 
      price: 2800000, 
      rating: 4.8, 
      reviews: 1204, 
      image: hotelDefault, 
      gallery: [hotelDefault, roomDefault, serviceDefault], 
      facilities: ["Hồ bơi", "Spa", "Nhà hàng", "Wi-Fi miễn phí", "Bãi đậu xe"], 
      description: "Nét sang trọng cổ điển kết hợp tinh hoa hiện đại, nằm ngay sát vịnh Nha Trang xanh ngắt thơ mộng với những rặng dừa trải dài.", 
      stars: 5 
    },
    { 
      id: "aurence-halong", 
      name: "Aurence Hạ Long Heritage", 
      location: "Vịnh Hạ Long, Quảng Ninh", 
      country: "Việt Nam", 
      price: 4200000, 
      rating: 4.9, 
      reviews: 967, 
      image: hotelDefault, 
      gallery: [hotelDefault, roomDefault, serviceDefault], 
      facilities: ["Hồ bơi", "Spa", "Nhà hàng", "Phòng gym", "Wi-Fi miễn phí"], 
      description: "Khu nghỉ dưỡng di sản độc bản ôm trọn kỳ quan thiên nhiên thế giới Vịnh Hạ Long với tầm nhìn vô cực hướng ra biển khơi huyền bí.", 
      stars: 5 
    },
    { 
      id: "aurence-dalat", 
      name: "Aurence Đà Lạt Palace", 
      location: "Hồ Xuân Hương, Đà Lạt", 
      country: "Việt Nam", 
      price: 2200000, 
      rating: 4.7, 
      reviews: 512, 
      image: hotelDefault, 
      gallery: [hotelDefault, roomDefault, serviceDefault], 
      facilities: ["Spa", "Nhà hàng", "Phòng gym", "Wi-Fi miễn phí", "Bãi đậu xe"], 
      description: "Biệt thự Pháp cổ kính ẩn mình giữa rừng thông Đà Lạt thơ mộng, hướng thẳng ra Hồ Xuân Hương mang khí hậu se lạnh quanh năm.", 
      stars: 5 
    },
    { 
      id: "aurence-phuquoc", 
      name: "Aurence Phú Quốc Oasis", 
      location: "Bãi Dài, Phú Quốc", 
      country: "Việt Nam", 
      price: 3800000, 
      rating: 4.8, 
      reviews: 733, 
      image: hotelDefault, 
      gallery: [hotelDefault, roomDefault, serviceDefault], 
      facilities: ["Hồ bơi", "Nhà hàng", "Wi-Fi miễn phí", "Bãi đậu xe"], 
      description: "Ốc đảo nhiệt đới ngập tràn nắng vàng bên bờ Bãi Dài, mang lại không gian thư giãn tuyệt đối cho tâm hồn và trải nghiệm ngắm hoàng hôn độc nhất.", 
      stars: 5 
    },
    { 
      id: "aurence-hoian", 
      name: "Aurence Hội An House", 
      location: "Phố cổ Hội An, Quảng Nam", 
      country: "Việt Nam", 
      price: 2500000, 
      rating: 4.9, 
      reviews: 388, 
      image: hotelDefault, 
      gallery: [hotelDefault, roomDefault, serviceDefault], 
      facilities: ["Spa", "Nhà hàng", "Wi-Fi miễn phí"], 
      description: "Một dinh thự yên tĩnh mang đậm hơi thở kiến trúc nhà cổ Hội An, kết hợp hài hòa giữa các giá trị truyền thống và tiện nghi hiện đại.", 
      stars: 5 
    }
  ];

  const destinations = [
    { name: "Đà Nẵng", count: 12, image: hotelDefault },
    { name: "Nha Trang", count: 8, image: hotelDefault },
    { name: "Phú Quốc", count: 15, image: hotelDefault },
    { name: "Đà Lạt", count: 6, image: hotelDefault },
    { name: "Hạ Long", count: 10, image: hotelDefault },
    { name: "Hội An", count: 7, image: hotelDefault }
  ];

  const rooms = [
    { id: "RM001", hotelId: "aurence-danang", roomNumber: "101", name: "Phòng Deluxe Hướng Biển", size: "48 m²", beds: "1 Giường King", price: 3500000, capacity: 2, image: roomDefault, status: "Còn trống" },
    { id: "RM002", hotelId: "aurence-danang", roomNumber: "102", name: "Biệt Thự Hồ Bơi Riêng", size: "85 m²", beds: "1 Giường King", price: 6500000, capacity: 2, image: roomDefault, status: "Đang sử dụng" },
    { id: "RM003", hotelId: "aurence-nhatrang", roomNumber: "201", name: "Phòng Suite Hướng Vịnh", size: "60 m²", beds: "1 Giường King", price: 2800000, capacity: 2, image: roomDefault, status: "Còn trống" },
    { id: "RM004", hotelId: "aurence-nhatrang", roomNumber: "202", name: "Phòng Gia Đình Sang Trọng", size: "75 m²", beds: "2 Giường Đôi", price: 4500000, capacity: 4, image: roomDefault, status: "Đang dọn dẹp" },
    { id: "RM005", hotelId: "aurence-halong", roomNumber: "301", name: "Phòng Premium Hướng Vịnh", size: "52 m²", beds: "1 Giường King", price: 4200000, capacity: 2, image: roomDefault, status: "Còn trống" },
    { id: "RM006", hotelId: "aurence-halong", roomNumber: "302", name: "Dinh Thự Tổng Thống Hướng Biển", size: "150 m²", beds: "2 Giường King", price: 12000000, capacity: 4, image: roomDefault, status: "Đang bảo trì" },
    { id: "RM007", hotelId: "aurence-dalat", roomNumber: "401", name: "Phòng Superior Hướng Hồ", size: "40 m²", beds: "1 Giường Queen", price: 2200000, capacity: 2, image: roomDefault, status: "Còn trống" },
    { id: "RM008", hotelId: "aurence-dalat", roomNumber: "402", name: "Biệt Thự Rừng Thông Cổ Điển", size: "90 m²", beds: "1 Giường King + 1 Giường Đơn", price: 4800000, capacity: 3, image: roomDefault, status: "Đã đặt" },
    { id: "RM009", hotelId: "aurence-phuquoc", roomNumber: "501", name: "Phòng Deluxe Sân Vườn", size: "45 m²", beds: "2 Giường Đơn", price: 3800000, capacity: 2, image: roomDefault, status: "Còn trống" },
    { id: "RM010", hotelId: "aurence-phuquoc", roomNumber: "502", name: "Biệt Thự Bãi Biển Thượng Hạng", size: "120 m²", beds: "2 Giường King", price: 9500000, capacity: 4, image: roomDefault, status: "Còn trống" },
    { id: "RM011", hotelId: "aurence-hoian", roomNumber: "601", name: "Phòng Classic Phố Cổ", size: "42 m²", beds: "1 Giường King", price: 2500000, capacity: 2, image: roomDefault, status: "Còn trống" },
    { id: "RM012", hotelId: "aurence-hoian", roomNumber: "602", name: "Phòng Suite Di Sản", size: "65 m²", beds: "1 Giường King + 1 Sofa Bed", price: 4000000, capacity: 3, image: roomDefault, status: "Còn trống" }
  ];

  const reviews = [
    { id: "RV001", hotelId: "aurence-danang", hotelName: "Aurence Đà Nẵng Resort", author: "Nguyễn Anh Tuấn", rating: 5, date: "Tháng 6, 2026", text: "Dịch vụ tuyệt vời từ lúc nhận phòng đến khi ra về. Quản gia riêng chu đáo ngoài sức mong đợi.", ratings: { overall: 5, room: 5, clean: 5, staff: 5, dining: 5, service: 5 } },
    { id: "RV002", hotelId: "aurence-nhatrang", hotelName: "Aurence Nha Trang Bay", author: "Lê Minh Hương", rating: 5, date: "Tháng 5, 2026", text: "Spa là một trải nghiệm tuyệt hảo. Bữa tối Kaiseki tại nhà hàng là bữa ăn ngon nhất trong năm của chúng tôi.", ratings: { overall: 5, room: 4, clean: 5, staff: 5, dining: 5, service: 5 } },
    { id: "RV003", hotelId: "aurence-halong", hotelName: "Aurence Hạ Long Heritage", author: "Phạm Quốc Bảo", rating: 4, date: "Tháng 4, 2026", text: "Phong cảnh ngoạn mục và dịch vụ đẳng cấp. Có một chút chậm trễ khi nhận phòng nhưng đã được xử lý khéo léo.", ratings: { overall: 4, room: 4, clean: 4, staff: 5, dining: 4, service: 4 } },
    { id: "RV004", hotelId: "aurence-dalat", hotelName: "Aurence Đà Lạt Palace", author: "Trần Thu Thảo", rating: 5, date: "Tháng 3, 2026", text: "Khuôn viên biệt thự vô cùng yên bình và thơ mộng, kiến trúc kiểu Pháp cổ kính rất đẹp.", ratings: { overall: 5, room: 5, clean: 5, staff: 4, dining: 4, service: 5 } },
    { id: "RV005", hotelId: "aurence-phuquoc", hotelName: "Aurence Phú Quốc Oasis", author: "Hoàng Minh Đức", rating: 5, date: "Tháng 2, 2026", text: "Biệt thự hướng biển rất rộng và đẹp, bãi cát mịn. Dịch vụ đưa đón chu đáo.", ratings: { overall: 5, room: 5, clean: 5, staff: 5, dining: 4, service: 5 } },
    { id: "RV006", hotelId: "aurence-hoian", hotelName: "Aurence Hội An House", author: "Vũ Thị Tuyết", rating: 4, date: "Tháng 1, 2026", text: "Không gian mang đậm nét hoài cổ của Hội An. Trà chiều ở đây rất ngon.", ratings: { overall: 4, room: 4, clean: 4, staff: 4, dining: 4, service: 4 } },
    { id: "RV007", hotelId: "aurence-danang", hotelName: "Aurence Đà Nẵng Resort", author: "Đặng Hùng Lâm", rating: 5, date: "Tháng 7, 2026", text: "Bể bơi vô cực ngắm hoàng hôn biển là điểm cộng lớn. Nhất định sẽ quay lại.", ratings: { overall: 5, room: 5, clean: 4, staff: 5, dining: 5, service: 5 } },
    { id: "RV008", hotelId: "aurence-nhatrang", hotelName: "Aurence Nha Trang Bay", author: "Ngô Hải Yến", rating: 5, date: "Tháng 7, 2026", text: "Khách sạn sạch sẽ, nhân viên thân thiện và lịch sự. Đồ ăn sáng đa dạng phong phú.", ratings: { overall: 5, room: 5, clean: 5, staff: 5, dining: 5, service: 5 } }
  ];

  const bookings = [
    { id: "BK001", customerId: "US001", customer: "Nguyễn Anh Tuấn", hotelId: "aurence-danang", hotel: "Aurence Đà Nẵng Resort", roomId: "RM002", room: "Biệt Thự Hồ Bơi Riêng", checkIn: "2026-08-12", checkOut: "2026-08-15", status: "Đã nhận phòng", total: 22425000, services: [{ id: "SV001", name: "Ẩm thực tại phòng", price: 750000, quantity: 2 }, { id: "SV002", name: "Trị liệu Spa cao cấp", price: 1800000, quantity: 1 }] },
    { id: "BK002", customerId: "US002", customer: "Lê Minh Hương", hotelId: "aurence-nhatrang", hotel: "Aurence Nha Trang Bay", roomId: "RM004", room: "Phòng Gia Đình Sang Trọng", checkIn: "2026-06-04", checkOut: "2026-06-09", status: "Đã trả phòng", total: 24725000, services: [], invoiceNo: "INV20260001", checkoutConfirmed: true },
    { id: "BK003", customerId: "US003", customer: "Phạm Quốc Bảo", hotelId: "aurence-halong", hotel: "Aurence Hạ Long Heritage", roomId: "RM005", room: "Phòng Premium Hướng Vịnh", checkIn: "2026-04-22", checkOut: "2026-04-25", status: "Đã trả phòng", total: 14490000, services: [], invoiceNo: "INV20260002", checkoutConfirmed: true },
    { id: "BK004", customerId: "US004", customer: "Trần Thu Thảo", hotelId: "aurence-hoian", hotel: "Aurence Hội An House", roomId: "RM011", room: "Phòng Classic Phố Cổ", checkIn: "2026-09-10", checkOut: "2026-09-13", status: "Đã xác nhận", total: 8625000, services: [] },
    { id: "BK005", customerId: "US005", customer: "Hoàng Minh Đức", hotelId: "aurence-dalat", hotel: "Aurence Đà Lạt Palace", roomId: "RM008", room: "Biệt Thự Rừng Thông Cổ Điển", checkIn: "2026-12-20", checkOut: "2026-12-27", status: "Đã xác nhận", total: 38640000, services: [] },
    { id: "BK006", customerId: "US006", customer: "Vũ Thị Tuyết", hotelId: "aurence-phuquoc", hotel: "Aurence Phú Quốc Oasis", roomId: "RM009", room: "Phòng Deluxe Sân Vườn", checkIn: "2026-07-01", checkOut: "2026-07-04", status: "Đã hủy", total: 13110000, services: [] },
    { id: "BK007", customerId: "US007", customer: "Đặng Hùng Lâm", hotelId: "aurence-danang", hotel: "Aurence Đà Nẵng Resort", roomId: "RM001", room: "Phòng Deluxe Hướng Biển", checkIn: "2026-07-10", checkOut: "2026-07-12", status: "Đã trả phòng", total: 8050000, services: [], invoiceNo: "INV20260003", checkoutConfirmed: true },
    { id: "BK008", customerId: "US008", customer: "Ngô Hải Yến", hotelId: "aurence-hoian", hotel: "Aurence Hội An House", roomId: "RM012", room: "Phòng Suite Di Sản", checkIn: "2026-07-15", checkOut: "2026-07-18", status: "Đã nhận phòng", total: 13800000, services: [{ id: "SV003", name: "Đưa đón sân bay hạng sang", price: 1200000, quantity: 1 }] },
    { id: "BK009", customerId: "US001", customer: "Nguyễn Anh Tuấn", hotelId: "aurence-phuquoc", hotel: "Aurence Phú Quốc Oasis", roomId: "RM010", room: "Biệt Thự Bãi Biển Thượng Hạng", checkIn: "2026-10-01", checkOut: "2026-10-05", status: "Đã xác nhận", total: 43700000, services: [] },
    { id: "BK010", customerId: "US002", customer: "Lê Minh Hương", hotelId: "aurence-halong", hotel: "Aurence Hạ Long Heritage", roomId: "RM006", room: "Dinh Thự Tổng Thống Hướng Biển", checkIn: "2026-11-15", checkOut: "2026-11-18", status: "Đã xác nhận", total: 41400000, services: [] }
  ];

  const customers = [
    { id: "US001", name: "Nguyễn Anh Tuấn", email: "tuan.nguyen@example.com", tier: "Platinum", stays: 12, spent: 85000000, phone: "0901234567", locked: false },
    { id: "US002", name: "Lê Minh Hương", email: "huong.le@example.com", tier: "Gold", stays: 7, spent: 48000000, phone: "0912345678", locked: false },
    { id: "US003", name: "Phạm Quốc Bảo", email: "bao.pham@example.com", tier: "Gold", stays: 5, spent: 32000000, phone: "0923456789", locked: false },
    { id: "US004", name: "Trần Thu Thảo", email: "thao.tran@example.com", tier: "Silver", stays: 3, spent: 15000000, phone: "0934567890", locked: false },
    { id: "US005", name: "Hoàng Minh Đức", email: "duc.hoang@example.com", tier: "Platinum", stays: 15, spent: 120000000, phone: "0945678901", locked: false },
    { id: "US006", name: "Vũ Thị Tuyết", email: "tuyet.vu@example.com", tier: "Silver", stays: 2, spent: 8000000, phone: "0956789012", locked: false },
    { id: "US007", name: "Đặng Hùng Lâm", email: "lam.dang@example.com", tier: "Silver", stays: 1, spent: 4500000, phone: "0967890123", locked: false },
    { id: "US008", name: "Ngô Hải Yến", email: "yen.ngo@example.com", tier: "Gold", stays: 4, spent: 22000000, phone: "0978901234", locked: false }
  ];

  const employees = [
    { id: "NV001", name: "Nguyễn Thị Mai", role: "Lễ tân", hotel: "Aurence Đà Nẵng Resort", shift: "Ca sáng", status: "Hoạt động" },
    { id: "NV002", name: "Trần Minh Quân", role: "Quản lý khách sạn", hotel: "Aurence Nha Trang Bay", shift: "Ca sáng", status: "Hoạt động" },
    { id: "NV003", name: "Lê Hoàng Nam", role: "Nhân viên buồng phòng", hotel: "Aurence Hạ Long Heritage", shift: "Ca chiều", status: "Hoạt động" },
    { id: "NV004", name: "Phạm Thanh Thủy", role: "Nhân viên dịch vụ", hotel: "Aurence Đà Lạt Palace", shift: "Ca tối", status: "Nghỉ phép" },
    { id: "NV005", name: "Hoàng Quốc Khánh", role: "Quản trị viên", hotel: "Tất cả", shift: "Ca sáng", status: "Hoạt động" },
    { id: "NV006", name: "Vũ Anh Dũng", role: "Nhân viên dịch vụ", hotel: "Aurence Phú Quốc Oasis", shift: "Ca chiều", status: "Hoạt động" }
  ];

  const services = [
    { id: "SV001", name: "Ẩm thực tại phòng", desc: "Dịch vụ ăn uống phục vụ 24/7 tại phòng do đầu bếp Michelin thực hiện.", price: 750000, category: "Dịch vụ phòng", image: serviceDefault },
    { id: "SV002", name: "Trị liệu Spa cao cấp", desc: "Liệu pháp massage thư giãn, xông hơi và chăm sóc da mặt chuyên sâu.", price: 1800000, category: "Spa", image: serviceDefault },
    { id: "SV003", name: "Đưa đón sân bay hạng sang", desc: "Đưa đón sân bay bằng dòng xe sang Mercedes-Benz S-Class hoặc Maybach.", price: 1200000, category: "Đưa đón sân bay", image: serviceDefault },
    { id: "SV004", name: "Đặt bàn nhà hàng Fine Dining", desc: "Trải nghiệm ẩm thực thượng hạng tại nhà hàng Michelin của chúng tôi.", price: 2500000, category: "Nhà hàng", image: serviceDefault },
    { id: "SV005", name: "Dịch vụ giặt là cao cấp", desc: "Giặt, ủi và làm sạch giày cao cấp, giao nhận trong ngày.", price: 300000, category: "Giặt ủi", image: serviceDefault },
    { id: "SV006", name: "Huấn luyện viên gym cá nhân", desc: "Giờ tập riêng cùng huấn luyện viên thể hình chuyên nghiệp tại phòng gym.", price: 800000, category: "Phòng tập thể dục", image: serviceDefault },
    { id: "SV007", name: "Thiết lập Wi-Fi tốc độ cao riêng", desc: "Đường truyền Internet băng thông rộng chuyên dụng cho công việc hoặc sự kiện.", price: 500000, category: "Hỗ trợ Wi-Fi", image: serviceDefault },
    { id: "SV008", name: "Trang trí phòng sự kiện", desc: "Thiết lập hoa tươi, bóng bay hoặc nến cho dịp kỷ niệm ngày cưới, sinh nhật.", price: 1500000, category: "Dịch vụ phòng", image: serviceDefault }
  ];

  const LS = {
    get(key, def) { try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch { return def; } },
    set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },
  };

  if (!LS.get("aurence.profile")) {
    LS.set("aurence.profile", { 
      firstName: "Tuấn", 
      lastName: "Nguyễn Anh", 
      email: "tuan.nguyen@example.com", 
      phone: "0901234567", 
      idCard: "001096001234",
      dob: "1990-05-15",
      address: "Quận 1, TP. Hồ Chí Minh",
      tier: "Platinum", 
      preferences: { bed: "King", pillow: "Down", newspaper: "FT" },
      favorites: ["aurence-danang"]
    });
  }
  if (!LS.get("aurence.hotels")) LS.set("aurence.hotels", hotels);
  if (!LS.get("aurence.rooms")) LS.set("aurence.rooms", rooms);
  if (!LS.get("aurence.bookings")) LS.set("aurence.bookings", bookings);
  if (!LS.get("aurence.reviews")) LS.set("aurence.reviews", reviews);
  if (!LS.get("aurence.customers")) LS.set("aurence.customers", customers);
  if (!LS.get("aurence.employees")) LS.set("aurence.employees", employees);
  if (!LS.get("aurence.services")) LS.set("aurence.services", services);
  if (!LS.get("aurence.settings")) {
    LS.set("aurence.settings", { 
      brandName: "Aurence Collection", 
      supportEmail: "care@aurence.com", 
      currency: "VND", 
      taxRate: 10, 
      serviceFeeRate: 5,
      checkInTime: "14:00",
      checkOutTime: "12:00",
      cancellationPolicy: "Miễn phí hủy phòng trước 48 giờ kể từ ngày nhận phòng.",
      language: "Vietnamese",
      theme: "light"
    });
  }

  window.formatVND = function(amount) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(amount);
  };

  window.AURENCE = { hotels, destinations, rooms, reviews, bookings, customers, employees, services, LS };
})();
