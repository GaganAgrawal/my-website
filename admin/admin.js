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
  document.getElementById("users").textContent = Math.floor(Math.random()*5000);
  document.getElementById("performance").textContent = (Math.random()*100).toFixed(1)+"%";
  document.getElementById("contentEdited").textContent = Math.floor(Math.random()*100);
}
setInterval(updateStats,3000);

// Content editor save
function saveContent(){
  const content = document.getElementById("editorArea").value;
  alert("Content saved:\n"+content.substring(0,50)+"...");
}

// Format editor text
function formatText(command){
  const editor = document.getElementById("editorArea");
  let start = editor.selectionStart;
  let end = editor.selectionEnd;
  const selected = editor.value.substring(start,end);
  let newText = selected;
  if(command === 'bold') newText = "**"+selected+"**";
  if(command === 'italic') newText = "*"+selected+"*";
  if(command === 'underline') newText = "__"+selected+"__";
  editor.setRangeText(newText,start,end,"end");
}
