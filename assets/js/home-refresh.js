(function(){
  const sticky=document.querySelector('.mobile-sticky-cta');
  const panel=document.querySelector('.mobile-panel');
  if(!sticky)return;
  const sync=()=>{
    const mobile=window.innerWidth<=640;
    const menuOpen=panel?.classList.contains('open');
    sticky.classList.toggle('is-visible',mobile&&window.scrollY>600&&!menuOpen);
  };
  window.addEventListener('scroll',sync,{passive:true});
  window.addEventListener('resize',sync);
  document.querySelector('.menu-btn')?.addEventListener('click',()=>setTimeout(sync,0));
  document.querySelector('.mobile-close')?.addEventListener('click',()=>setTimeout(sync,0));
  panel?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setTimeout(sync,0)));
  sync();
})();
