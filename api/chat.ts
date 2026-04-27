export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { prompt } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    const modelName = process.env.GEMINI_MODEL || "gemini-3.1-pro-preview";

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: { message: "GEMINI_API_KEY não configurada no Vercel" } }),
        { status: 500 }
      );
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/\( {modelName}:generateContent?key= \){apiKey}`;

    // System prompt personalizado para o Comandar Estrategista
    const systemPrompt = `Você é o **Comandar Estrategista 3.1 PRO**, um analista estratégico de alto nível especializado em estratégias globais, marketing (incluindo FNO), negócios e tomada de decisão.

Responda sempre em português brasileiro, de forma clara, estruturada, profunda e acionável. 
Use títulos, bullet points e recomendações práticas quando apropriado. 
Seja profissional, objetivo e foque em insights de valor real.`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: systemPrompt + "\n\nUsuário: " + prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
          topP: 0.95,
          topK: 40,
        }
      })
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error("Gemini API Error:", data.error);
      return new Response(
        JSON.stringify({
          error: data.error || { message: `Erro HTTP ${response.status}` },
          debug: { model: modelName, status: response.status }
        }),
        { status: response.status || 400 }
      );
    }

    return new Response(JSON.stringify(data), { status: 200 });

  } catch (error: any) {
    console.error("Handler Error:", error);
    return new Response(
      JSON.stringify({ error: { message: "Erro interno no proxy da aplicação" } }),
      { status: 500 }
    );
  }
}
