// /src/app/track.js/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const script = `
(function() {
  if (window.tracklytics) {
    return;
  }
  
  function track() {
    // Extrai o ID do projeto do atributo 'src' do script
    var scriptSrc = document.currentScript.src;
    var urlParams = new URLSearchParams(new URL(scriptSrc).search);
    var projectId = urlParams.get('id');
    
    if (!projectId) {
      console.error('Tracklytics: ID do projeto não encontrado.');
      return;
    }

    var data = {
      projectId: projectId,
      path: window.location.pathname,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      // O deviceType e countryCode serão determinados no backend
    };
    
    // Envia os dados para a API de rastreamento
    navigator.sendBeacon('/api/track', JSON.stringify(data));
  }
  
  // Rastreia a primeira visualização de página
  track();
  
  // Substitui pushState para rastrear mudanças de rota no lado do cliente (SPA)
  var originalPushState = history.pushState;
  history.pushState = function() {
    originalPushState.apply(this, arguments);
    track();
  };
  
  // Ouve o evento popstate para rastrear navegação de voltar/avançar
  window.addEventListener('popstate', track);
  
  // Expor uma função global caso seja necessário no futuro
  window.tracklytics = {
      track: track
  };
})();
`;

  return new NextResponse(script, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=3600', // Cache por 1 hora
    },
  });
}
