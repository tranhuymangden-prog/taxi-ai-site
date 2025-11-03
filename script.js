// Taxi AI – tương tác cơ bản (ước tính cước) + đăng ký service worker (PWA nhẹ)
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

// Đăng ký service worker nếu có
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(console.error);
  });
}
