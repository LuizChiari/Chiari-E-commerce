export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const { prompt } = await req.json();
    
    // O sistema busca a chave de forma segura no ambiente da Vercel
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: { message: "Chave não configurada no cofre da Vercel" } }), { status: 500 });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

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
  } catch (error: any) {
    return new Response(JSON.stringify({ error: { message: "Alpha Security Error" } }), { status: 500 });
  }
}
