const menuBtn=document.querySelector(".menu-btn"),nav=document.querySelector(".nav-links");
if(menuBtn&&nav){menuBtn.addEventListener("click",()=>{const open=nav.classList.toggle("open");menuBtn.setAttribute("aria-expanded",open);});document.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menuBtn.setAttribute("aria-expanded","false");}));}
const year=document.getElementById("year"); if(year) year.textContent=new Date().getFullYear();
