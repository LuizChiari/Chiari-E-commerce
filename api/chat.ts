export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { prompt } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: { message: "Chave GEMINI_API_KEY não configurada no Vercel" } }),
        { status: 500 }
      );
    }

    // Modelo atualizado - pode ser alterado via variável de ambiente
    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    const url = `https://generativelanguage.googleapis.com/v1beta/models/\( {modelName}:generateContent?key= \){apiKey}`;

    // System prompt para dar personalidade ao "Comandar Estrategista 3.1 PRO"
    const systemPrompt = `Você é o Comandar Estrategista 3.1 PRO, um analista estratégico de alto nível. 
    Forneça análises claras, profundas, estruturadas e acionáveis. Use linguagem profissional em português.`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: systemPrompt + "\n\n" + prompt }]
          }
        ],
        // Configurações recomendadas para análise estratégica
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          topP: 0.95,
        }
      })
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error("Gemini API Error:", data.error);
      return new Response(
        JSON.stringify({ 
          error: data.error || { message: `Erro na API Google (status ${response.status})` } 
        }), 
        { status: response.status || 400 }
      );
    }

    return new Response(JSON.stringify(data), { status: 200 });

  } catch (error: any) {
    console.error("Handler Error:", error);
    return new Response(
      JSON.stringify({ error: { message: "Erro interno no proxy Alpha Security" } }), 
      { status: 500 }
    );
  }
}
