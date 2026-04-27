export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const { prompt } = await req.json();
    
    // Tenta pegar GEMINI_API_KEY (padrão servidor) ou a VITE_ (padrão antigo)
    // Se não achar nenhuma, usa a sua chave real como fallback final
    const apiKey = process.env.GEMINI_API_KEY || 
                   process.env.VITE_GEMINI_API_KEY || 
                   "AIzaSyBL88l_16dsos4holVoOBUhtl3T7t7RRpM";

    // Usando a rota v1 (mais estável) e o modelo 3.1 Pro que você confirmou
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent?key=${apiKey.trim()}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (data.error) {
      // Isso vai nos mostrar exatamente o que o Google está reclamando
      return new Response(JSON.stringify({ error: data.error }), { status: 400 });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: { message: error.message } }), { status: 500 });
  }
}
