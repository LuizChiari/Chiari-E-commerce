export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  try {
    const { prompt } = await req.json();
    
    // Usamos a chave direta para não ter erro de variável de ambiente
    const apiKey = "AIzaSyBL88l_16dsos4holVoOBUhtl3T7t7RRpM";

    // VOLTAMOS PARA O MODELO 1.5-FLASH (O mais estável da v2.0)
    // Usamos a rota v1 (estável) em vez da v1beta
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

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
    return new Response(JSON.stringify({ error: { message: "Erro de Conexão Alpha" } }), { status: 500 });
  }
}
