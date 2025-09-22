// Sidebar Navigation
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
document.getElementById("logoutBtn").addEventListener("click",()=>{
  alert("Logged out!");
});

// Dummy stats update
function updateStats(){
  document.getElementById("visitors").textContent = Math.floor(Math.random()*20000);
  document.getElementById("revenue").textContent = "$"+(Math.random()*50000).toFixed(2);
  document.getElementById("users").textContent = Math.floor(Math.random()*5000);
  document.getElementById("performance").textContent = (Math.random()*100).toFixed(1)+"%";
}
setInterval(updateStats,3000);

// Realtime chart
const ctx = document.getElementById('realtimeChart').getContext('2d');
const data = { labels: [], datasets:[{label:'Live Users', data:[], borderColor:'#3b82f6', backgroundColor:'rgba(59,130,246,0.2)', fill:true, tension:0.3}]};
const realtimeChart = new Chart(ctx,{type:'line',data:data,options:{animation:false}});
setInterval(()=>{
  const now = new Date().toLocaleTimeString();
  if(data.labels.length>10){data.labels.shift();data.datasets[0].data.shift();}
  data.labels.push(now);
  data.datasets[0].data.push(Math.floor(Math.random()*500)+100);
  realtimeChart.update();
},2000);

// Editor save
function saveContent(){alert("Content saved!");}
