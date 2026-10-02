(()=>{
document.documentElement.classList.add('js');
const $=s=>document.querySelector(s),b=$('#burger'),m=$('#menu');
const close=()=>{m.classList.remove('open');b.setAttribute('aria-expanded','false');b.setAttribute('aria-label','Open menu')};
b.addEventListener('click',()=>{const o=m.classList.toggle('open');b.setAttribute('aria-expanded',o);b.setAttribute('aria-label',o?'Close menu':'Open menu')});
m.addEventListener('click',e=>{if(e.target.closest('a'))close()});
addEventListener('keydown',e=>{if(e.key==='Escape')close()});
const io='IntersectionObserver'in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12}):null;
document.querySelectorAll('.rv').forEach(el=>io?io.observe(el):el.classList.add('in'));
const f=$('#form'),st=$('#status'),sel=f.elements.service;
document.querySelectorAll('.card[data-s]').forEach(c=>c.addEventListener('click',()=>{sel.value=c.dataset.s}));
const rules={name:v=>v.trim().length>1||'Enter your name.',email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)||'Enter a valid email address.',
phone:v=>!v||/^[+\d][\d\s()-]{6,17}$/.test(v)||'Enter a valid phone number.',service:v=>!!v||'Choose a service.',message:v=>v.trim().length>=10||'Tell us a little more (10+ characters).'};
const check=el=>{const r=rules[el.name];if(!r)return true;const ok=r(el.value),s=el.parentNode.querySelector('small');el.setAttribute('aria-invalid',ok!==true);s.textContent=ok===true?'':ok;return ok===true};
f.addEventListener('focusout',e=>check(e.target));
f.addEventListener('submit',async e=>{e.preventDefault();
const bad=[...f.elements].filter(el=>el.name&&!check(el));if(bad.length){bad[0].focus();return}
const btn=f.querySelector('button');btn.disabled=true;st.className='';st.textContent='Sending...';
try{const r=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(f)))});
const j=await r.json();if(!r.ok||!j.success)throw 0;f.reset();st.className='ok';st.textContent='Thank you. We will be in touch soon.'}
catch{st.className='err';st.textContent='Could not send. Please email info@askpirant.com instead.'}
btn.disabled=false});
})();
