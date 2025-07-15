// /src/app/track.js/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const host = request.headers.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  const script = `
(function() {
  if (window.tracklytics) {
    return;
  }
  
  var tracklyticsData = {
    blockRightClick: false,
    blockDevTools: false,
    redirectUrl: ''
  };

  function applyProtections() {
    if (tracklyticsData.blockRightClick) {
      document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
    }
    if (tracklyticsData.blockDevTools) {
      function detectDevTools() {
        if ((window.innerHeight - window.outerHeight) > 150 || (window.innerWidth - window.outerWidth) > 150) {
          window.location.href = tracklyticsData.redirectUrl || 'https://google.com';
        }
      }
      setInterval(detectDevTools, 1000);
      
      document.addEventListener('keydown', function(e) {
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'))) {
          e.preventDefault();
        }
      });
    }
  }

  function track() {
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
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
    };
    
    // Envia os dados para a API e lida com a resposta
    fetch('${baseUrl}/api/track', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
      keepalive: true
    })
    .then(response => response.json())
    .then(result => {
      if (result.redirectTo) {
        window.location.href = result.redirectTo;
      }
      if (result.config) {
         Object.assign(tracklyticsData, result.config);
         applyProtections();
      }
    })
    .catch(err => console.error('Tracklytics Error:', err));
  }
  
  track();
  
  var originalPushState = history.pushState;
  history.pushState = function() {
    originalPushState.apply(this, arguments);
    track();
  };
  
  window.addEventListener('popstate', track);
  
  window.tracklytics = {
      track: track
  };
})();
`;

  return new NextResponse(script, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600', // Cache por 1 hora
    },
  });
}
