export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  try {
    const { prompt } = await req.json();
    
    // Usando a chave que você já configurou na Vercel
    const apiKey = process.env.VITE_GEMINI_API_KEY || "AIzaSyBL88l_16dsos4holVoOBUhtl3T7t7RRpM";

    // MODELO 3.1 PRO (O topo da linha que apareceu no seu print)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return new Response(JSON.stringify({ error: data.error }), { status: 400 });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: { message: "Erro no Servidor Alpha" } }), { status: 500 });
  }
}
