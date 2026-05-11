import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    // Cole a lógica do seu /api/chat que consome o Gemini aqui
    const { prompt } = req.body;
    
    res.status(200).json({ choices: [{ message: { content: "Exemplo de resposta da API." } }] });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}