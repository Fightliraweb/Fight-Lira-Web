const nav=document.querySelector('.nav');if(nav){addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>35),{passive:true});}
const mb=document.querySelector('.menu-btn'),mp=document.querySelector('.mobile-panel'),mc=document.querySelector('.mobile-close');
if(mb&&mp){mb.addEventListener('click',()=>mp.classList.add('open'));mc?.addEventListener('click',()=>mp.classList.remove('open'));mp.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mp.classList.remove('open')))}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target)}}),{threshold:.10});document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

function setupCarousel(){
  const track=document.querySelector('[data-carousel-track]');
  if(!track)return;
  const slides=[...track.children],dots=document.querySelector('[data-carousel-dots]');
  let idx=0,timer;
  slides.forEach((_,i)=>{
    const d=document.createElement('span');
    d.className='dot'+(i===0?' active':'');
    dots.appendChild(d)
  });
  const dotEls=[...dots.children];
  const show=i=>{
    idx=(i+slides.length)%slides.length;
    track.style.transform=`translateX(-${idx*100}%)`;
    dotEls.forEach((d,j)=>d.classList.toggle('active',j===idx));
    restart()
  };
  const restart=()=>{
    clearInterval(timer);
    timer=setInterval(()=>show(idx+1),5600)
  };
  document.querySelector('[data-prev]')?.addEventListener('click',()=>show(idx-1));
  document.querySelector('[data-next]')?.addEventListener('click',()=>show(idx+1));
  restart();
  document.querySelector('.carousel')?.addEventListener('mouseenter',()=>clearInterval(timer));
  document.querySelector('.carousel')?.addEventListener('mouseleave',restart)
}
setupCarousel();

document.querySelectorAll('[data-room]').forEach(btn=>btn.addEventListener('click',()=>{
  const id=btn.getAttribute('data-room');
  document.querySelectorAll('.room-view').forEach(v=>v.classList.toggle('active',v.id===id));
  document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'center'});
}));

/* Fight Lira 9.9.5 — Parceiros escalável até 15+ logos
   Mostra apenas logos reais cadastradas.
   Troca automática a cada 3 segundos em loop infinito.
*/
(function setupPartnerLoop995(){
  const strip=document.querySelector('.partner-strip-official');
  if(!strip)return;

  const cards=[...strip.querySelectorAll('.sponsor-card')];
  if(!cards.length)return;

  const style=document.createElement('style');
  style.id='fight-lira-partners-995';
  style.textContent=`
    .partner-feature{
      padding:30px clamp(20px,4vw,56px) 34px!important;
      background:linear-gradient(180deg,#0b0b0b,#080808)!important;
      overflow:hidden;
    }
    .partner-feature-head{
      margin-bottom:14px!important;
      display:block!important;
    }
    .partner-feature-title{
      font-size:clamp(31px,3.6vw,50px)!important;
      line-height:.94!important;
      margin-top:5px!important;
    }
    .partner-feature-copy{display:none!important}

    .partner-strip-official.partner-loop-995{
      position:relative!important;
      display:block!important;
      width:min(100%,760px)!important;
      max-width:760px!important;
      height:156px!important;
      min-height:156px!important;
      margin:0 auto!important;
      padding:0!important;
      overflow:hidden!important;
      background:transparent!important;
    }

    .partner-loop-995 .sponsor-card{
      position:absolute!important;
      left:50%!important;
      top:50%!important;
      width:188px!important;
      height:116px!important;
      min-height:0!important;
      padding:11px!important;
      margin:0!important;
      display:flex!important;
      align-items:center!important;
      justify-content:center!important;
      border-radius:17px!important;
      border:1px solid rgba(255,255,255,.07)!important;
      background:
        radial-gradient(circle at 50% 45%,rgba(255,255,255,.025),transparent 62%),
        #070707!important;
      box-shadow:
        0 13px 28px rgba(0,0,0,.34),
        inset 0 1px 0 rgba(255,255,255,.025)!important;
      opacity:0!important;
      transform:translate(-50%,-50%) scale(.72)!important;
      transition:
        transform .62s cubic-bezier(.2,.75,.2,1),
        opacity .48s ease,
        border-color .48s ease,
        box-shadow .48s ease!important;
      pointer-events:none!important;
      z-index:0!important;
    }

    .partner-loop-995 .sponsor-card::before{display:none!important}

    .partner-loop-995 .sponsor-card img{
      width:auto!important;
      height:auto!important;
      max-width:88%!important;
      max-height:90px!important;
      object-fit:contain!important;
      animation:none!important;
      filter:drop-shadow(0 7px 13px rgba(0,0,0,.35))!important;
    }

    .partner-loop-995 .sponsor-pdk img{
      max-width:74%!important;
      max-height:96px!important;
    }
    .partner-loop-995 .sponsor-pagpouco img{
      max-width:86%!important;
      max-height:88px!important;
    }
    .partner-loop-995 .sponsor-caipiovs img{
      max-width:82%!important;
      max-height:91px!important;
    }

    .partner-loop-995 .sponsor-card.is-prev{
      opacity:.34!important;
      transform:translate(calc(-50% - 224px),-50%) scale(.84)!important;
      z-index:1!important;
    }
    .partner-loop-995 .sponsor-card.is-active{
      opacity:1!important;
      transform:translate(-50%,-50%) scale(1)!important;
      border-color:rgba(240,200,63,.24)!important;
      box-shadow:
        0 19px 38px rgba(0,0,0,.48),
        0 0 22px rgba(240,200,63,.035),
        inset 0 1px 0 rgba(255,255,255,.04)!important;
      z-index:3!important;
    }
    .partner-loop-995 .sponsor-card.is-next{
      opacity:.34!important;
      transform:translate(calc(-50% + 224px),-50%) scale(.84)!important;
      z-index:1!important;
    }

    @media(max-width:640px){
      .partner-feature{
        padding:26px 18px 28px!important;
      }
      .partner-strip-official.partner-loop-995{
        width:100%!important;
        height:142px!important;
        min-height:142px!important;
        overflow:visible!important;
      }
      .partner-loop-995 .sponsor-card{
        width:164px!important;
        height:104px!important;
      }
      .partner-loop-995 .sponsor-card img{
        max-height:80px!important;
      }
      .partner-loop-995 .sponsor-card.is-prev{
        opacity:.20!important;
        transform:translate(calc(-50% - 174px),-50%) scale(.76)!important;
      }
      .partner-loop-995 .sponsor-card.is-next{
        opacity:.20!important;
        transform:translate(calc(-50% + 174px),-50%) scale(.76)!important;
      }
    }

    @media(prefers-reduced-motion:reduce){
      .partner-loop-995 .sponsor-card{
        transition:opacity .2s ease!important;
      }
    }
  `;
  document.head.appendChild(style);

  strip.classList.add('partner-loop-995');

  let index=0;
  let timer=null;

  const clearStates=()=>{
    cards.forEach(card=>{
      card.classList.remove('is-prev','is-active','is-next');
      card.setAttribute('aria-hidden','true');
    });
  };

  const render=()=>{
    clearStates();

    if(cards.length===1){
      cards[0].classList.add('is-active');
      cards[0].setAttribute('aria-hidden','false');
      return;
    }

    if(cards.length===2){
      cards[index].classList.add('is-active');
      cards[index].setAttribute('aria-hidden','false');
      cards[(index+1)%2].classList.add('is-next');
      cards[(index+1)%2].setAttribute('aria-hidden','false');
      return;
    }

    const prev=(index-1+cards.length)%cards.length;
    const next=(index+1)%cards.length;

    cards[prev].classList.add('is-prev');
    cards[index].classList.add('is-active');
    cards[next].classList.add('is-next');

    cards[prev].setAttribute('aria-hidden','false');
    cards[index].setAttribute('aria-hidden','false');
    cards[next].setAttribute('aria-hidden','false');
  };

  const start=()=>{
    clearInterval(timer);
    if(cards.length>1){
      timer=setInterval(()=>{
        index=(index+1)%cards.length;
        render();
      },3000);
    }
  };

  render();
  start();

  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){
      clearInterval(timer);
    }else{
      start();
    }
  });
})();


/* Fight Lira 9.9.6 — troca para logos transparentes */
(function applyTransparentPartnerLogos996(){
  const swaps = [
    ['.sponsor-pdk img','assets/img/partners/pdk-personal-doktor.png'],
    ['.sponsor-pagpouco img','assets/img/partners/pag-pouco.png'],
    ['.sponsor-caipiovs img','assets/img/partners/caipiovs.png']
  ];
  swaps.forEach(([selector,src])=>{
    const img=document.querySelector(selector);
    if(img) img.setAttribute('src',src);
  });
})();
