const menuBtn=document.querySelector('.menu-btn');
const nav=document.querySelector('.nav-links');
if(menuBtn&&nav){menuBtn.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',open?'true':'false')});document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuBtn.setAttribute('aria-expanded','false')}));}

document.querySelectorAll('.accordion details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)document.querySelectorAll('.accordion details').forEach(x=>{if(x!==d)x.open=false})}));

const selected=document.getElementById('selectedService');
document.querySelectorAll('.service-options button').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.service-options button').forEach(x=>x.classList.remove('active'));btn.classList.add('active');selected.value=btn.dataset.pick;}));
document.querySelectorAll('[data-service]').forEach(link=>link.addEventListener('click',()=>{setTimeout(()=>{const wanted=link.dataset.service;const btn=[...document.querySelectorAll('.service-options button')].find(x=>x.dataset.pick===wanted);if(btn)btn.click()},250)}));

document.querySelector('.contact-form')?.addEventListener('submit',e=>{if(!selected.value)selected.value='Not specified';});

document.getElementById('year').textContent=new Date().getFullYear();
