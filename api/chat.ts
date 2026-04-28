export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { prompt } = await req.json();
    const apiKey = process.env.OPENROUTER_API_KEY?.trim();
    const modelName = process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash";

    if (!apiKey) {
      return new Response(JSON.stringify({ error: { message: "OPENROUTER_API_KEY não configurada" } }), { status: 500 });
    }

    const url = "https://openrouter.ai/api/v1/chat/completions";

    const systemPrompt = `Você é o Comandar Estrategista 3.1 PRO, especialista em marketing de afiliados, finanças e automação com IA. 
Responda em português brasileiro, de forma clara, prática e estruturada.`;

    const fullPrompt = systemPrompt + "\n\nUsuário: " + prompt;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://chiari-alpha.vercel.app',
        'X-Title': 'Chiari Alpha',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelName,
        messages: [{ role: "user", content: fullPrompt }],
        temperature: 0.7,
        max_tokens: 2000,        // Reduzido para evitar erro de créditos
      }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error("OpenRouter Error:", data.error);
      return new Response(JSON.stringify({ 
        error: data.error || { message: `Erro ${response.status}` } 
      }), { status: response.status || 400 });
    }

    const textoFinal = data.choices?.[0]?.message?.content || "Sem resposta da IA";

    return new Response(JSON.stringify({ 
      candidates: [{ content: { parts: [{ text: textoFinal }] } }] 
    }), { status: 200 });

  } catch (error: any) {
    console.error("Handler Error:", error);
    return new Response(JSON.stringify({ error: { message: error.message } }), { status: 500 });
  }
}
