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

// Logout button
document.getElementById("logoutBtn").addEventListener("click", () => {
  alert("Logged out!");
});

// Realtime Chart
const rtCtx = document.getElementById("realtimeChart").getContext("2d");
const rtData = { labels: [], datasets: [{ label: "Live Users", data: [], borderColor: "#3b82f6", backgroundColor:"rgba(59,130,246,0.2)", fill:true, tension:0.4 }]};
const realtimeChart = new Chart(rtCtx, { type:"line", data:rtData, options:{ animation:false } });

// Add random data every 2s
setInterval(() => {
  const now = new Date().toLocaleTimeString();
  if(rtData.labels.length>10){ rtData.labels.shift(); rtData.datasets[0].data.shift(); }
  rtData.labels.push(now);
  rtData.datasets[0].data.push(Math.floor(Math.random()*500)+100);
  realtimeChart.update();
},2000);

// Update stat cards
function updateStats() {
  document.getElementById("visitors").textContent = Math.floor(Math.random()*20000);
  document.getElementById("revenue").textContent = "$"+(Math.random()*50000).toFixed(2);
  document.getElementById("users").textContent = Math.floor(Math.random()*5000);
  document.getElementById("performance").textContent = (Math.random()*100).toFixed(1)+"%";
}
setInterval(updateStats,3000);
