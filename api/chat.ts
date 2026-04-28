export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { prompt } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: { message: "GEMINI_API_KEY não configurada no Vercel" } }),
        { status: 500 }
      );
    }

    // URL corrigida
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const systemPrompt = `Você é o **Comandar Estrategista 3.1 PRO**, um analista estratégico de alto nível especializado em estratégias globais, marketing digital, marketing de afiliados, finanças e automação com IA.
Responda sempre em português brasileiro, de forma clara, estruturada, profunda e acionável.
Use títulos, bullet points, tabelas e recomendações práticas quando apropriado.`;

    const fullPrompt = systemPrompt + "\n\nUsuário: " + prompt;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: fullPrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
          topP: 0.95,
          topK: 40,
        }
      }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error("Gemini API Error:", JSON.stringify(data.error || data, null, 2));
      return new Response(
        JSON.stringify({
          error: data.error || { message: `Erro HTTP ${response.status}` },
          debug: { model: modelName, status: response.status }
        }),
        { status: response.status || 400 }
      );
    }

    return new Response(JSON.stringify(data), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("Handler Error:", error);
    return new Response(
      JSON.stringify({ error: { message: "Erro interno no proxy da aplicação: " + error.message } }),
      { status: 500 }
    );
  }
}
