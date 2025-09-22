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
document.getElementById("logoutBtn").addEventListener("click",()=>{
  alert("Logged out!");
  window.location.href="index.html";
});

// Dummy real-time stats update
function updateStats(){
  document.getElementById("visitors").textContent = Math.floor(Math.random()*20000);
  document.getElementById("users
