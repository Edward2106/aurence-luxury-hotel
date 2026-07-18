// Shared app JS — navbar, footer, page helpers for Aurence
(function () {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

  // Inject navbar + footer where placeholders exist
  function injectNav() {
    const host = document.querySelector("[data-nav]");
    if (!host) return;
    const transparent = host.hasAttribute("data-nav-transparent");
    host.innerHTML = `
      <nav class="nav ${transparent ? "" : "scrolled"}" id="site-nav">
        <div class="container nav-inner">
          <a href="index.html" class="brand">Aur<em>e</em>nce</a>
          <div class="nav-links" id="nav-links">
            <a href="index.html" data-link="home">Trang chủ</a>
            <a href="hotels.html" data-link="hotels">Khách sạn</a>
            <a href="services.html" data-link="services">Dịch vụ</a>
            <a href="dashboard.html" data-link="dashboard">Đặt phòng của tôi</a>
            <a href="admin/index.html" data-link="admin">Quản trị</a>
          </div>
          <div class="nav-actions">
            <a href="profile.html" class="btn btn-sm btn-outline">Hồ sơ</a>
            <button class="btn btn-sm btn-ghost nav-toggle" aria-label="Menu" id="nav-toggle">☰</button>
          </div>
        </div>
      </nav>`;
    const nav = $("#site-nav");
    const toggle = $("#nav-toggle");
    const links = $("#nav-links");
    toggle?.addEventListener("click", () => links.classList.toggle("open"));

    if (transparent) {
      const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 60);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    // Active link
    const page = document.body.dataset.page;
    if (page) {
      const a = links.querySelector(`[data-link="${page}"]`);
      a?.classList.add("active");
    }
  }

  function injectFooter() {
    const host = document.querySelector("[data-footer]");
    if (!host) return;
    host.innerHTML = `
      <footer class="footer">
        <div class="container">
          <div class="footer-grid">
            <div>
              <div class="brand" style="color:#fff">Aur<em style="color:var(--gold);font-style:normal">e</em>nce</div>
              <p style="margin-top:1rem;font-size:0.9rem;max-width:280px">Một bộ sưu tập tư nhân gồm những khách sạn sang trọng huyền thoại trên thế giới - được đặt trước và trải nghiệm qua một giao diện tinh tế, yên bình.</p>
            </div>
            <div>
              <h4>Về công ty</h4>
              <a href="#">Giới thiệu</a><a href="#">Tạp chí</a><a href="#">Báo chí</a><a href="#">Tuyển dụng</a>
            </div>
            <div>
              <h4>Dành cho khách</h4>
              <a href="dashboard.html">Đặt phòng của tôi</a><a href="services.html">Dịch vụ phòng</a><a href="profile.html">Hồ sơ cá nhân</a><a href="#">Liên hệ</a>
            </div>
            <div>
              <h4>Pháp lý</h4>
              <a href="#">Điều khoản</a><a href="#">Bảo mật</a><a href="#">Cookies</a>
            </div>
          </div>
          <div class="footer-bottom">
            <span>© ${new Date().getFullYear()} Bộ sưu tập Aurence</span>
            <span>Thiết kế tinh tế & sang trọng.</span>
          </div>
        </div>
      </footer>`;
  }

  function injectConcierge() {
    if (document.querySelector("[data-no-concierge]")) return;
    const btn = document.createElement("a");
    btn.href = "services.html";
    btn.className = "concierge";
    btn.innerHTML = "✦ Dịch vụ phòng";
    document.body.appendChild(btn);
  }

  // Toast helper
  window.toast = function (msg) {
    let el = document.querySelector(".toast");
    if (!el) { el = document.createElement("div"); el.className = "toast"; document.body.appendChild(el); }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("show"), 2400);
  };

  // Card renderer (reused across pages)
  window.renderHotelCard = function (h) {
    const stars = "★".repeat(h.stars || Math.round(h.rating));
    const priceFormatted = window.formatVND ? window.formatVND(h.price) : (h.price.toLocaleString() + " ₫");
    return `
      <a href="hotel.html?id=${h.id}" class="card fade-up">
        <div class="card-media">
          <img src="${h.image}" alt="${h.name}" loading="lazy" />
          <span class="card-badge">${h.country}</span>
        </div>
        <div class="card-body">
          <div class="card-title">${h.name}</div>
          <div class="card-meta">◉ ${h.location}</div>
          <div class="rating">${stars} <span class="muted" style="font-size:0.8rem">${h.rating} · ${h.reviews} đánh giá</span></div>
          <div class="card-facilities">${h.facilities.slice(0,4).map(f => `<span class="chip">${f}</span>`).join("")}</div>
          <div class="card-foot">
            <span class="price">${priceFormatted}<small> / đêm</small></span>
            <span class="btn btn-sm btn-outline">Xem chi tiết</span>
          </div>
        </div>
      </a>`;
  };

  document.addEventListener("DOMContentLoaded", () => {
    injectNav();
    injectFooter();
    injectConcierge();
    
    // reveal fade-up on load; also on scroll for below-fold
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.style.animationPlayState = "running"; io.unobserve(e.target); } });
    }, { threshold: 0.08 });
    $$(".fade-up").forEach(el => io.observe(el));
  });
})();
