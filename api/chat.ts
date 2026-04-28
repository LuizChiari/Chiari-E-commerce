export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { prompt, temperature = 0.7 } = await req.json();
    
    const apiKey = process.env.OPENROUTER_API_KEY?.trim();
    const modelName = process.env.OPENROUTER_MODEL || "anthropic/claude-sonnet-4.6";

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: { message: "OPENROUTER_API_KEY não configurada no Vercel" } }),
        { status: 500 }
      );
    }

    const url = "https://openrouter.ai/api/v1/chat/completions";

    // System Prompt fixo e poderoso para marketing de afiliados
    const systemPrompt = `Você é o **Comandar Estrategista 3.1 PRO**, um especialista de alto nível em marketing digital, marketing de afiliados, finanças pessoais e automação com IA.

Suas respostas devem ser sempre:
- Em português brasileiro claro e direto
- Altamente estruturadas (use títulos, bullet points, tabelas quando fizer sentido)
- Focadas em resultados práticos e acionáveis
- Otimizadas para conversão (hooks fortes, calls to action, prova social)
- Profissionais, mas acessíveis para iniciantes`;

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
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: temperature,
        max_tokens: 2500,
      }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error("OpenRouter Error:", data.error);
      return new Response(
        JSON.stringify({ 
          error: data.error || { message: `Erro HTTP ${response.status}` } 
        }),
        { status: response.status || 400 }
      );
    }

    const textoFinal = data.choices?.[0]?.message?.content || "Sem resposta da IA";

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
