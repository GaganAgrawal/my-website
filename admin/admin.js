// Sidebar navigation
const menuItems = document.querySelectorAll(".sidebar-menu li");
const sections = document.querySelectorAll(".content-section");
menuItems.forEach(item=>{
  item.addEventListener("click",()=>{
    menuItems.forEach(i=>i.classList.remove("active"));
    item.classList.add("active");
    sections.forEach(sec=>sec.classList.remove("active"));
    document.getElementById(item.dataset.section).classList.add("active");
  });
});

// Logout button
document.getElementById("logoutBtn").addEventListener("click",()=>{
  alert("Logged out!");
  window.location.href="index.html";
});

// Save content editor
function saveContent(){
  const content=document.getElementById("editorArea").value;
  localStorage.setItem("webContent",content);
  alert("Content saved successfully!");
}

// Load saved content
window.addEventListener("DOMContentLoaded",()=>{
  const saved = localStorage.getItem("webContent");
  if(saved) document.getElementById("editorArea").value = saved;
});

// Dummy stats update
function updateStats(){
  document.getElementById("visitors").textContent = Math.floor(Math.random()*20000);
  document.getElementById("users").textContent = Math.floor(Math.random()*2000);
  document.getElementById("performance").textContent = Math.floor(Math.random()*100)+"%";
  document.getElementById("contentEdited").textContent = Math.floor(Math.random()*100);
}
setInterval(updateStats,5000);

// Simple formatting for editor
function formatText(command){
  const textarea = document.getElementById("editorArea");
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.substring(start,end);
  let formatted = selected;
  if(command==="bold") formatted = `**${selected}**`;
  if(command==="italic") formatted = `*${selected}*`;
  if(command==="underline") formatted = `__${selected}__`;
  textarea.setRangeText(formatted,start,end,'end');
}
