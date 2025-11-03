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
// === NÚT CÀI ĐẶT ỨNG DỤNG (PWA) ===
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  // Chặn prompt mặc định để tự hiện bằng nút của chúng ta
  e.preventDefault();
  deferredPrompt = e;

  const btn = document.getElementById("btn-install");
  if (btn) btn.style.display = "inline-block";
});

document.getElementById("btn-install")?.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice; // accepted | dismissed
  deferredPrompt = null;

  // Ẩn nút sau khi đã hiện prompt
  const btn = document.getElementById("btn-install");
  if (btn) btn.style.display = "none";
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
