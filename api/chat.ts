 export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Método não permitido', { status: 405 });
  }

  try {
    const { prompt } = await req.json();
    
    // AQUI ESTÁ O SEGREDO: Colocamos a chave direto para não depender da Vercel ler a variável agora
    const apiKey = "AIzaSyBL88l_16dsos4holVoOBUhtl3T7t7RRpM";

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    // Se o Google reclamar da chave aqui, ele vai nos dizer exatamente o porquê
    if (data.error) {
      return new Response(JSON.stringify({ error: data.error }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro interno no servidor Alpha' }), { status: 500 });
  }
}
