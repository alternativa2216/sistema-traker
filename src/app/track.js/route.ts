
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
    var scriptElement = document.currentScript;
    if (!scriptElement) return;

    var scriptSrc = scriptElement.src;
    var urlParams = new URLSearchParams(new URL(scriptSrc).search);
    var projectId = urlParams.get('id');
    
    if (!projectId) {
      console.error('Tracklytics: ID do projeto não encontrado.');
      return;
    }

    var data = {
      projectId: projectId,
      path: window.location.pathname + window.location.search,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      // O deviceType e countryCode serão determinados no backend
    };
    
    // Envia os dados para a API de rastreamento
    // Usamos fetch com keepalive em vez de sendBeacon para garantir que o corpo seja JSON
    fetch('/api/track', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      },
      keepalive: true
    });
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
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600', // Cache por 1 hora
    },
  });
}
