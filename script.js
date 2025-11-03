// Tính cước đơn giản: 15.000đ/km + 0đ mở cửa
function formatVND(n) {
  return n.toLocaleString("vi-VN") + " đồng";
}

function estimate() {
  const km = parseFloat(document.getElementById("distance-km").value || "0");
  const fare = Math.max(0, km) * 15000;
  document.getElementById("estimate-output").textContent = formatVND(Math.round(fare));
}

document.addEventListener("click", (e) => {
  if (e.target && e.target.matches("[data-action='estimate']")) estimate();
});

window.addEventListener("DOMContentLoaded", estimate);

// Đăng ký Service Worker (an toàn cho /taxi-ai-site/ và cho domain riêng)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js", { scope: "/" }).catch(console.error);
  });
}

// Nút cài PWA
let deferredPrompt;
const btnInstall = document.getElementById("btn-install");
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (btnInstall) btnInstall.style.display = "inline-block";
});
btnInstall?.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  btnInstall.style.display = "none";
});
