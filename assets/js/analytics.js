/* Fight Lira — contagem de visitas (Google Analytics) e de cliques no WhatsApp.
   Evento "clique_whatsapp" com o parâmetro "turma" (Personal Fight, Muay Thai, Jiu-Jitsu, Kids, Infantil, Geral). */
(function(){
  var GA_ID='G-549G0VHR49';
  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){dataLayer.push(arguments);};
  // páginas com media-share.js já iniciam o Analytics: não contar a visita duas vezes
  var jaTem=document.querySelector('script[src*="media-share"]')||document.querySelector('script[data-fight-lira-ga]');
  if(!jaTem){
    gtag('js',new Date());
    gtag('config',GA_ID,{send_page_view:true});
    var s=document.createElement('script');s.async=true;
    s.src='https://www.googletagmanager.com/gtag/js?id='+GA_ID;s.dataset.fightLiraGa=GA_ID;
    document.head.appendChild(s);
  }
  function turma(a){
    var t='';try{t=decodeURIComponent((a.href.split('text=')[1]||'').replace(/\+/g,' '));}catch(e){}
    t=(t+' '+(a.textContent||'')).toLowerCase();
    if(/personal/.test(t))return 'Personal Fight';
    if(/infantil/.test(t))return 'Jiu-Jitsu Infantil';
    if(/kids/.test(t))return 'Jiu-Jitsu Kids';
    if(/muay/.test(t))return 'Muay Thai';
    if(/jiu/.test(t))return 'Jiu-Jitsu';
    return 'Geral';
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href*="wa.me/55"],a[href*="api.whatsapp.com"]');
    if(!a)return;
    gtag('event','clique_whatsapp',{turma:turma(a),pagina:location.pathname||'/',transport_type:'beacon'});
  },true);
})();
