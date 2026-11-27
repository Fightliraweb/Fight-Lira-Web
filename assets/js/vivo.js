/* Fight Lira — barra de progresso de rolagem (camada "vivo") */
(function(){
  document.body.classList.add('fl-vivo');
  var bar=document.createElement('div');bar.className='fl-progress';bar.setAttribute('aria-hidden','true');
  document.body.appendChild(bar);
  var tick=false;
  function upd(){var h=document.documentElement.scrollHeight-innerHeight;bar.style.setProperty('--p',h>0?Math.min(scrollY/h,1):0);tick=false}
  addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});
  upd();
})();
