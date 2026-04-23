import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSupabase, AffiliateLink } from '@/src/lib/supabase';
import { Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function RedirectPage() {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [linkData, setLinkData] = useState<AffiliateLink | null>(null);

  useEffect(() => {
    async function fetchLink() {
      if (!slug) return;

      try {
        const client = getSupabase();
        const { data, error: sbError } = await client
          .from('links_afiliados')
          .select('*')
          .eq('slug_curto', slug)
          .single();

        if (sbError || !data) {
          setError('Link não encontrado ou expirado.');
          setLoading(false);
          return;
        }

        setLinkData(data);

        // Incrementar cliques em background (RPC ou Update)
        client
          .from('links_afiliados')
          .update({ cliques: (data.cliques || 0) + 1 })
          .eq('id', data.id)
          .then();

        // Injetar Facebook Pixel se existir
        if (data.pixel_id) {
          const script = document.createElement('script');
          script.innerHTML = `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${data.pixel_id}');
            fbq('track', 'PageView');
            fbq('track', 'ViewContent', {
              content_name: '${data.nome_produto}',
              content_category: 'Affiliate Link'
            });
          `;
          document.head.appendChild(script);

          const noscript = document.createElement('noscript');
          noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${data.pixel_id}&ev=PageView&noscript=1" />`;
          document.body.appendChild(noscript);
        }

        // Injetar TikTok Pixel se existir
        if (data.tiktok_pixel_id) {
          const script = document.createElement('script');
          script.innerHTML = `
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
              ttq.load('${data.tiktok_pixel_id}');
              ttq.page();
              ttq.track('ViewContent', {
                content_name: '${data.nome_produto}',
                content_category: 'Affiliate Link'
              });
            }(window, document, 'ttq');
          `;
          document.head.appendChild(script);
        }

        // Injetar Google Tag (YouTube) se existir
        if (data.google_tag_id) {
          const script = document.createElement('script');
          script.async = true;
          script.src = 'https://www.googletagmanager.com/gtag/js?id=' + data.google_tag_id;
          document.head.appendChild(script);

          const scriptConfig = document.createElement('script');
          scriptConfig.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${data.google_tag_id}');
            gtag('event', 'page_view', {
              page_title: '${data.nome_produto}',
              page_location: window.location.href,
              page_path: window.location.pathname
            });
          `;
          document.head.appendChild(scriptConfig);
        }

        // Redirecionar após 2 segundos
        setTimeout(() => {
          window.location.href = data.url_original;
        }, 2000);

      } catch (err) {
        console.error(err);
        setError('Ocorreu um erro ao processar o link.');
        setLoading(false);
      }
    }

    fetchLink();
  }, [slug]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Ops!</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <a href="/" className="inline-flex items-center justify-center h-10 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-blue-600 hover:bg-blue-700 focus:shadow-outline focus:outline-none">
            Voltar para Início
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6 text-blue-500" />
        <h1 className="text-3xl font-bold mb-2 tracking-tight">Redirecionando...</h1>
        {linkData && (
          <p className="text-slate-400 text-lg">
            Você está sendo levado para <span className="text-blue-400 font-semibold">{linkData.nome_produto}</span>
          </p>
        )}
        <div className="mt-12 flex justify-center space-x-2">
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-blue-500 rounded-full" />
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-blue-500 rounded-full" />
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-blue-500 rounded-full" />
        </div>
      </motion.div>
      
      <div className="absolute bottom-8 text-slate-500 text-xs uppercase tracking-widest font-medium">
        Powered by Global Affiliate Hub
      </div>
    </div>
  );
}
