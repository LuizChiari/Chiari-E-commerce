export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { prompt } = await req.json();
    const apiKey = process.env.OPENROUTER_API_KEY?.trim();
    const modelName = process.env.OPENROUTER_MODEL || "anthropic/claude-3.5-sonnet";

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: { message: "OPENROUTER_API_KEY não configurada no Vercel" } }),
        { status: 500 }
      );
    }

    const url = "https://openrouter.ai/api/v1/chat/completions";

    const systemPrompt = `Você é o **Comandar Estrategista 3.1 PRO**, um analista estratégico de alto nível especializado em marketing digital, marketing de afiliados, finanças pessoais e automação com IA.
Responda sempre em português brasileiro, de forma clara, estruturada, profunda e acionável.
Use títulos, bullet points, tabelas e recomendações práticas quando apropriado. Seja profissional e foque em valor real.`;

    const fullPrompt = systemPrompt + "\n\nUsuário: " + prompt;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://chiari-alpha.vercel.app', // opcional, mas ajuda
        'X-Title': 'Chiari Alpha',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: "user", content: fullPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error("OpenRouter Error:", data.error || data);
      return new Response(
        JSON.stringify({
          error: data.error || { message: `Erro HTTP ${response.status}` },
          debug: { model: modelName, status: response.status }
        }),
        { status: response.status || 400 }
      );
    }

    // Extrai o texto da resposta (formato OpenAI)
    const textoFinal = data.choices?.[0]?.message?.content || "Resposta vazia";

    return new Response(JSON.stringify({ 
      candidates: [{ content: { parts: [{ text: textoFinal }] } }] 
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("Handler Error:", error);
    return new Response(
      JSON.stringify({ error: { message: "Erro interno no proxy: " + error.message } }),
      { status: 500 }
    );
  }
}
