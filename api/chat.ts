export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const { prompt } = await req.json();
    
    // A sua nova chave que já sabemos que funciona!
    const apiKey = "AIzaSyCWLKkUuRffkDZRgJ3tlAGhvBLxPziPbg";

    // AJUSTE TÉCNICO: Mudamos para v1beta e o modelo Flash estável
    // O v1beta é mais flexível com os modelos novos
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
    return new Response(JSON.stringify({ error: { message: error.message } }), { status: 500 });
  }
}
