export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Método não permitido', { status: 405 });
  }

  try {
    const { prompt } = await req.json();
    
    // 1. Tenta pegar a chave da Vercel (GEMINI_API_KEY) 
    // 2. Se não achar, usa a NOVA chave que você colar abaixo
    // COLE A SUA NOVA CHAVE DENTRO DAS ASPAS ABAIXO:
    const apiKey = process.env.GEMINI_API_KEY || "COLE_AQUI_SUA_NOVA_CHAVE_DO_GOOGLE";

    // Rota estável v1 + modelo 1.5-flash (O conjunto mais seguro contra erros de validação)
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      })
    });

    const data = await response.json();

    // Se o Google devolver erro, repassamos a mensagem real para o seu painel
    if (data.error) {
      return new Response(JSON.stringify({ 
        error: { message: `Google API Error: ${data.error.message}` } 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ 
      error: { message: "Erro de Conexão no Servidor Alpha: " + error.message } 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
