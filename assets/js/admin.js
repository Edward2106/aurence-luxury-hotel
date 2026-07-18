// Admin shell — injects sidebar and header for Aurence Admin Panel
(function () {
  function injectShell() {
    const host = document.querySelector("[data-admin-nav]");
    if (!host) return;
    const links = [
      ["index.html", "◈ Tổng quan", "dash"],
      ["hotels.html", "▤ Khách sạn", "hotels"],
      ["rooms.html", "◉ Phòng", "rooms"],
      ["bookings.html", "✦ Đặt phòng", "bookings"],
      ["customers.html", "◎ Khách hàng", "customers"],
      ["employees.html", "✧ Nhân viên", "employees"],
      ["reviews.html", "★ Đánh giá", "reviews"],
      ["reports.html", "▦ Báo cáo", "reports"],
      ["settings.html", "⚙ Cài đặt", "settings"],
    ];
    const cur = document.body.dataset.admin;
    host.innerHTML = `
      <aside class="admin-side">
        <a href="../index.html" class="brand" style="color:#fff;display:block">Aur<em>e</em>nce <span style="font-size:0.7rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold);display:block;margin-top:0.25rem">Bảng quản trị</span></a>
        <nav class="admin-nav">
          ${links.map(([h, l, k]) => `<a href="${h}" class="${k === cur ? "active" : ""}">${l}</a>`).join("")}
        </nav>
        <div style="position:absolute;bottom:1rem;left:1rem;right:1rem;padding-top:1rem;border-top:1px solid rgba(255,255,255,0.1);font-size:0.8rem;opacity:0.7">
          <div>Đăng nhập với vai trò:</div><b style="color:#fff">Isabelle Duval</b><div>Quản lý chung</div>
          <a href="../index.html" style="display:block;margin-top:0.5rem;color:var(--gold)">← Quay lại trang khách</a>
        </div>
      </aside>`;
  }
  document.addEventListener("DOMContentLoaded", injectShell);
})();
