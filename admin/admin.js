// Sidebar navigation
const menuItems = document.querySelectorAll(".sidebar li");
const sections = document.querySelectorAll(".content-section");

menuItems.forEach(item => {
  item.addEventListener("click", () => {
    menuItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");
    sections.forEach(sec => sec.classList.remove("active"));
    document.getElementById(item.dataset.section).classList.add("active");
  });
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  alert("You have been logged out!");
  window.location.href = "index.html";
});

// Realtime Chart
const rtCtx = document.getElementById("realtimeChart").getContext("2d");
const rtData = { labels: [], datasets: [{ label: "Live Users", data: [], borderColor: "#3b82f6", backgroundColor: "rgba(59,130,246,0.2)", fill: true, tension: 0.4 }] };
const realtimeChart = new Chart(rtCtx, { type: "line", data: rtData, options: { animation: false } });

// Push random data every 2s
setInterval(() => {
  const now = new Date().toLocaleTimeString();
  if (rtData.labels.length > 10) { rtData.labels.shift(); rtData.datasets[0].data.shift(); }
  rtData.labels.push(now);
  rtData.datasets[0].data.push(Math.floor(Math.random() * 500) + 100);
  realtimeChart.update();
}, 2000);

// Analytics Charts
new Chart(document.getElementById("trafficChart"), {
  type: "bar",
  data: {
    labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    datasets: [{ label: "Traffic", data: [1200,1900,3000,2500,3200,2800,4000], backgroundColor: ["#3b82f6","#06b6d4","#22c55e","#f97316","#f59e0b","#8b5cf6","#d946ef"] }]
  }
});
new Chart(document.getElementById("salesChart"), {
  type: "line",
  data: {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul"],
    datasets: [{ label: "Sales", data: [500,700,1200,900,1600,2000,2500], borderColor: "#f97316", fill: false, tension: 0.4 }]
  }
});

// Update Stats in Real Time
function updateStats() {
  document.getElementById("visitors").textContent = Math.floor(Math.random() * 20000);
  document.getElementById("revenue").textContent = "$" + (Math.random() * 50000).toFixed(2);
  document.getElementById("users").textContent = Math.floor(Math.random() * 5000);
  document.getElementById("performance").textContent = (Math.random() * 100).toFixed(1) + "%";
}
setInterval(updateStats, 3000);
