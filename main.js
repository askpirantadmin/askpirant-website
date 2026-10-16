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
    dm:{
      t:'Digital Marketing',
      d:'One digital strategy that ties every channel to your business goals, so effort goes where it matters.',
      l:[
        'Review your current presence, audience and competitors',
        'Build a channel plan with clear priorities and targets',
        'Coordinate campaigns, content and tracking in a single plan'
      ]
    },

    seo:{
      t:'SEO',
      d:'Search optimization that helps the right customers find you when they are actively looking.',
      l:[
        'Review your site technically and on each page',
        'Plan keywords and content around what your buyers search for',
        'Set up local search visibility for location-based businesses',
        'Report on traffic and rankings so progress is clear'
      ]
    },

    pm:{
      t:'Performance Marketing',
      d:'Paid campaigns on Meta, Google and other platforms, built so every rupee can be measured.',
      l:[
        'Set goals and conversion tracking before any spend',
        'Test audiences, creatives and offers',
        'Adjust budgets based on cost per lead and return',
        'Report in plain language on what the spend achieved'
      ]
    },

    sm:{
      t:'Social Media Management',
      d:'A consistent presence that builds recognition and trust with your audience.',
      l:[
        'Plan a content calendar in your brand voice',
        'Create, schedule and publish posts across your platforms',
        'Handle community replies and engagement',
        'Review what works each month and refine the plan'
      ]
    },

    cs:{
      t:'Content Strategy',
      d:'Content that answers real questions and moves people toward taking action.',
      l:[
        'Define your audience, topics and key messages',
        'Plan formats across your website, social and email',
        'Connect content to search visibility and business goals'
      ]
    },

    wd:{
      t:'Website Development',
      d:'A fast, mobile-friendly website designed to turn visitors into enquiries.',
      l:[
        'Plan structure and messaging around your objectives',
        'Design and build responsive, fast-loading pages',
        'Set up forms, analytics and SEO foundations at launch'
      ]
    },

    bs:{
      t:'Brand Strategy',
      d:'A clear, consistent identity everywhere customers meet your business.',
      l:[
        'Clarify your positioning, audience and voice',
        'Align visuals and messaging across channels',
        'Create simple guidelines so your team stays consistent'
      ]
    },

    an:{
      t:'Analytics & Optimization',
      d:'Turn numbers into decisions, and keep improving what you run.',
      l:[
        'Set up tracking for traffic, leads and conversions',
        'Build simple reports around the metrics that matter',
        'Test ideas and refine campaigns based on results'
      ]
    }
  };


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
