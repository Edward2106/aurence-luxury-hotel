// Admin shell — injects sidebar and header
(function () {
  function injectShell() {
    const host = document.querySelector("[data-admin-nav]");
    if (!host) return;
    const links = [
      ["index.html","◈ Dashboard","dash"],
      ["hotels.html","▤ Hotels","hotels"],
      ["rooms.html","◉ Rooms","rooms"],
      ["bookings.html","✦ Bookings","bookings"],
      ["customers.html","◎ Customers","customers"],
      ["employees.html","✧ Employees","employees"],
      ["reviews.html","★ Reviews","reviews"],
      ["reports.html","▦ Reports","reports"],
      ["settings.html","⚙ Settings","settings"],
    ];
    const cur = document.body.dataset.admin;
    host.innerHTML = `
      <aside class="admin-side">
        <a href="../index.html" class="brand" style="color:#fff;display:block">Aur<em style="color:var(--gold);font-style:normal">e</em>nce <span style="font-size:0.7rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold);display:block;margin-top:0.25rem">Admin console</span></a>
        <nav class="admin-nav">
          ${links.map(([h,l,k]) => `<a href="${h}" class="${k===cur?"active":""}">${l}</a>`).join("")}
        </nav>
        <div style="position:absolute;bottom:1rem;left:1rem;right:1rem;padding-top:1rem;border-top:1px solid rgba(255,255,255,0.1);font-size:0.8rem;opacity:0.7">
          <div>Signed in as</div><b style="color:#fff">Isabelle Duval</b><div>General Manager</div>
          <a href="../index.html" style="display:block;margin-top:0.5rem;color:var(--gold)">← Guest site</a>
        </div>
      </aside>`;
  }
  document.addEventListener("DOMContentLoaded", injectShell);
})();
