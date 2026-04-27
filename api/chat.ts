 export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Método não permitido', { status: 405 });
  }

  try {
    const { prompt } = await req.json();
    
    // Pegando a chave direto para não ter erro de variável
    const apiKey = "AIzaSyBL88l_16dsos4holVoOBUhtl3T7t7RRpM";

    // MUDAMOS A URL PARA A VERSÃO v1 (mais estável para chaves de API)
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    // Se o Google reclamar da chave de novo, vamos mostrar o erro detalhado
    if (data.error) {
      return new Response(JSON.stringify({ error: data.error }), { status: 400 });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: { message: 'Erro interno no servidor Alpha' } }), { status: 500 });
  }
}
