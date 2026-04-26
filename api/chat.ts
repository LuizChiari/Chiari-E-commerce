export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Método não permitido', { status: 405 });
  }

  try {
    const { prompt } = await req.json();
    
    // Tenta pegar da Vercel, se não conseguir, usa a sua chave real direto
    const apiKey = process.env.VITE_GEMINI_API_KEY || "AIzaSyBL88l_16dsos4holVoOBUhtl3T7t7RRpM";

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro interno no servidor Alpha' }), { status: 500 });
  }
}
