// === TƯƠNG TÁC ƯỚC TÍNH CƯỚC ===
document.addEventListener("DOMContentLoaded", () => {
  const estBtn = document.querySelector("[data-action='estimate']");
  const out = document.querySelector("#estimate-output");

  if (estBtn && out) {
    estBtn.addEventListener("click", () => {
      const base = 15000; // giá mở cửa
      const km = Number(document.querySelector("#distance-km")?.value || 3);
      const perKm = 12000;
      const total = base + km * perKm;
      out.textContent = new Intl.NumberFormat("vi-VN").format(total) + " đồng";
    });
  }
});

// === ĐĂNG KÝ SERVICE WORKER CHO GH PAGES (SUBPATH) ===
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const BASE = "/taxi-ai-site/";        // subpath repo của bạn
    navigator.serviceWorker
      .register("sw.js", { scope: BASE })  // KHÔNG dùng "/sw.js"
      .catch(console.error);
  });
}
