(()=>{
  document.documentElement.classList.add('js');

  const $=s=>document.querySelector(s),
        b=$('#burger'),
        m=$('#menu');

  /* =========================
     NAVIGATION
  ========================= */

  const close=()=>{
    m.classList.remove('open');
    b.setAttribute('aria-expanded','false');
    b.setAttribute('aria-label','Open menu');
  };

  b.addEventListener('click',()=>{
    const o=m.classList.toggle('open');
    b.setAttribute('aria-expanded',o);
    b.setAttribute('aria-label',o?'Close menu':'Open menu');
  });

  m.addEventListener('click',e=>{
    if(e.target.closest('a')) close();
  });

  addEventListener('keydown',e=>{
    if(e.key==='Escape') close();
  });


  /* =========================
     SCROLL ANIMATIONS
  ========================= */

  const io='IntersectionObserver' in window
    ?new IntersectionObserver(es=>es.forEach(e=>{
        if(e.isIntersecting){
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }),{threshold:.12})
    :null;

  document.querySelectorAll('.rv').forEach(el=>
    io?io.observe(el):el.classList.add('in')
  );


  /* =========================
     CONTACT FORM
  ========================= */

  const f=$('#form'),
        st=$('#status'),
        sel=f.elements.service;


  /* =========================
     SERVICES
  ========================= */

  const S={
    dm:{t:'Digital Marketing',d:'An integrated digital strategy that connects your channels to your business goals.',l:['Review your current presence, audience and competitors','Build a channel plan with clear priorities and targets','Coordinate campaigns and content around agreed objectives']},
    meta:{t:'Meta Ads',d:'Paid campaigns designed to reach relevant audiences across Meta platforms.',l:['Define campaign objectives and target audiences','Test creative, messaging and audience approaches','Review campaign delivery and optimize based on performance']},
    google:{t:'Google Ads',d:'Search and paid media campaigns that help you connect with people looking for your products or services.',l:['Structure campaigns around relevant search intent','Align ad messaging and landing pages','Review results and refine targeting and spend']},
    seo:{t:'SEO & GEO',d:'Improve how your business is discovered through search engines and AI-driven discovery experiences.',l:['Review technical and on-page search foundations','Organize content around useful customer questions','Strengthen local visibility and clear business information']},
    video:{t:'Videography',d:'Planned video capture for brand stories, products, campaigns and social content.',l:['Plan the shoot around your content goals','Capture footage with appropriate camera, lighting and audio','Prepare footage for the editing workflow']},
    editing:{t:'Video Editing',d:'Turn raw footage into polished, platform-ready video content.',l:['Edit footage for pacing, clarity and story','Add suitable titles, motion elements and finishing','Prepare exports for the intended platforms']}
  };


  /* =========================
     SERVICES / GEAR TABS
  ========================= */

  const servicesTab=$('#services-tab'), gearTab=$('#gear-tab'),
        servicesPanel=$('#services-panel'), gearPanel=$('#gear-panel');

  const selectPanel=(showGear)=>{
    servicesTab.setAttribute('aria-selected',String(!showGear));
    gearTab.setAttribute('aria-selected',String(showGear));
    servicesTab.classList.toggle('btn-gold',!showGear);
    servicesTab.classList.toggle('btn-ghost',showGear);
    gearTab.classList.toggle('btn-gold',showGear);
    gearTab.classList.toggle('btn-ghost',!showGear);
    servicesPanel.hidden=showGear;
    gearPanel.hidden=!showGear;
  };
  servicesTab.addEventListener('click',()=>selectPanel(false));
  gearTab.addEventListener('click',()=>selectPanel(true));


  /* =========================
     SERVICE POPUP
  ========================= */

  const dlg=$('#svc');

  document.querySelectorAll('.card[data-k]').forEach(c=>
    c.addEventListener('click',()=>{
      const k=S[c.dataset.k];

      $('#svc-t').textContent=k.t;
      $('#svc-d').textContent=k.d;
      $('#svc-l').innerHTML=
        k.l.map(x=>'<li>'+x+'</li>').join('');

      dlg.dataset.s=c.dataset.s;

      dlg.querySelector('use').setAttribute(
        'href',
        c.querySelector('use').getAttribute('href')
      );

      dlg.showModal();
    })
  );

  dlg.addEventListener('click',e=>{
    if(e.target===dlg||e.target.closest('.x'))
      dlg.close();
  });

  $('#svc-c').addEventListener('click',()=>{
    sel.value=dlg.dataset.s;
    dlg.close();
  });


  /* =========================
     FORM VALIDATION
  ========================= */

  const rules={
    name:v=>
      v.trim().length>1 ||
      'Enter your name.',

    email:v=>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ||
      'Enter a valid email address.',

    phone:v=>
      v.trim().length>0 &&
      /^[+\d][\d\s()-]{6,17}$/.test(v) ||
      'Enter a valid phone number.',

    service:v=>
      !!v ||
      'Choose a service.',

    message:v=>
      v.trim().length>=10 ||
      'Tell us a little more (10+ characters).'
  };


  const check=el=>{
    const r=rules[el.name];

    if(!r) return true;

    const ok=r(el.value);
    const s=el.parentNode.querySelector('small');

    el.setAttribute(
      'aria-invalid',
      ok!==true
    );

    s.textContent=
      ok===true?'':ok;

    return ok===true;
  };


  /* =========================
     VALIDATE ON FOCUS OUT
  ========================= */

  f.addEventListener('focusout',e=>{
    check(e.target);
  });


  /* =========================
     WEB3FORMS SUBMISSION
  ========================= */

  f.addEventListener('submit',async e=>{
    e.preventDefault();

    /* Validate fields */

    const bad=[...f.elements].filter(
      el=>el.name&&!check(el)
    );

    if(bad.length){
      bad[0].focus();
      return;
    }


    /* Honeypot spam protection */

    const botcheck=f.elements.botcheck;

    if(
      botcheck &&
      botcheck.value.trim()!==''
    ){
      st.className='err';
      st.textContent=
        'Spam protection triggered. Please refresh and try again.';
      return;
    }


    /* Button */

    const btn=f.querySelector(
      'button[type="submit"]'
    );

    const originalText=btn.textContent;

    btn.disabled=true;
    btn.textContent='Sending...';

    st.className='';
    st.textContent='Sending...';


    try{

      /*
       * The access_key is already included
       * inside the HTML form.
       *
       * Web3Forms receives the complete
       * form data and sends the enquiry
       * to the email associated with the
       * access key.
       */

      const formData=new FormData(f);


      const response=await fetch(
        'https://api.web3forms.com/submit',
        {
          method:'POST',
          body:formData
        }
      );


      const data=await response.json();


      console.log(
        'Web3Forms response:',
        data
      );


      /* Successful submission */

      if(data.success){

        f.reset();

        st.className='ok';

        st.textContent=
          'Thank you. Your enquiry has been sent successfully.';

      }

      /* Web3Forms returned an error */

      else{

        st.className='err';

        st.textContent=
          'Error: '+
          (data.message||'Unable to send your enquiry.');

      }


    }catch(error){

      console.error(
        'Web3Forms error:',
        error
      );

      st.className='err';

      st.textContent=
        'Unable to send your enquiry. Please try again.';

    }


    /* Restore button */

    btn.disabled=false;
    btn.textContent=originalText;

  });

})();
