import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini with custom User-Agent and key
const api_key = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;

if (api_key) {
  ai = new GoogleGenAI({
    apiKey: api_key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// REST API for general health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'MindGuardian AI Angola',
    creator: 'Eng. Bernardo Pedro',
    hasApiKey: !!api_key
  });
});

// Gemini Endpoint: Analyze digital behavior & patterns
app.post('/api/gemini/analyze', async (req, res) => {
  try {
    const { userProfile, weekData } = req.body;

    if (!ai) {
      return res.status(200).json({
        isMock: true,
        insights: [
          {
            title: "Desperdício Crítico e Dreno de Kwanza",
            description: "Você gastou quase 15 horas em redes sociais esta semana, principalmente TikTok. Isso consome muitos pacotes de dados de internet móvel em Luanda, elevando seus gastos financeiros sem retorno prático.",
            category: "economia",
            recommendation: "Recomendamos ativar o Modo De Economia de Dados no MindGuardian para bloquear redes fora de horários de estudo."
          },
          {
            title: "Falta de Ritmo Protetor Noturno",
            description: "Detectamos que 45% do seu consumo digital ocorre entre as 21h e as 23h, afetando seu sono e procrastinando tarefas educacionais cruciais para o seu ano letivo.",
            category: "saude",
            recommendation: "Ative o bloqueio automático de Entretenimento a partir das 22h para preservar sua energia celular."
          },
          {
            title: "Aproveite para Expandir seu Engenho",
            description: "Você só usou 2 horas de ferramentas de produtividade e programação nesta semana. Potencialize seu computador ou celular para criar softwares em vez de carregar feeds.",
            category: "foco",
            recommendation: "Defina uma meta diária de 45 minutos em livros ou IDEs de programação."
          }
        ]
      });
    }

    const prompt = `Analise o perfil e o consumo semanal deste usuário angolano do sistema MindGuardian AI Angola:
Perfil: ${JSON.stringify(userProfile)}
Dados Semanais de Uso de Apps: ${JSON.stringify(weekData)}

Gere 3 insights comportamentais específicos e pragmáticos voltados para a realidade angolana (como o alto custo da internet em Kwanzas AOA, o dreno de tempo em redes de vídeo curto no celular, a conciliação entre estudos e distração digital).
Você deve retornar uma resposta estritamente estruturada em JSON obedecendo a este esquema:
{
  "insights": [
    {
      "title": "título chamativo, máximo 5 palavras",
      "description": "descrição analítica detalhada com tom empático e profissional angolano",
      "category": "uma das opções: foco, saude, economia, alerta",
      "recommendation": "uma recomendação específica de atitude ou configuração sugerida"
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['insights'],
          properties: {
            insights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ['title', 'description', 'category', 'recommendation'],
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  category: { type: Type.STRING },
                  recommendation: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text?.trim() || '{}');
    res.json({ isMock: false, ...parsedData });

  } catch (error: any) {
    console.error('Error analyzing behavioral patterns with Gemini:', error);
    res.status(500).json({ error: error.message || 'Error executing AI diagnostics' });
  }
});

// Gemini Endpoint: Chat interactions with Behavior Mentor / Coach
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { messages, userProfile } = req.body;

    if (!ai) {
      return res.status(200).json({
        text: "Olá! Como o Engenheiro Bernardo Pedro não configurou a chave de API neste ambiente de visualização automática, estou a falar com você em Modo de Simulação Local. Analisando as suas estatísticas móveis no país, noto que o seu principal desperdício ocorre no TikTok durante a noite. Deseja definir um limite rígido de 30 minutos diários para poupar os seus preciosos pacotes de dados?",
        isMock: true
      });
    }

    // Prepare system instructions for Portuguese (Angola) tech coach context
    const systemInstruction = `Você é o mentor comportamental inteligente do "MindGuardian AI Angola", um sistema de conscientização digital que auxilia jovens angolanos a controlarem o vício do tempo de ecran do smartphone, otimizar aplicativos produtivos, gerenciar procrastinação e poupar dinheiro de saldo de dados de internet móvel (Kwanzas AOA).
Seja amigável, utilize português de Angola de forma polida e profissional ("Estás a gastar", "noto que queres", "Engenheiro Bernardo Pedro", "Angola"). Seja encorajador, prático e aja como um orientador que valoriza a educação nacional e o bom aproveitamento do tempo.`;

    // Map message history
    const geminiContents = messages.map((m: any) => ({
      role: m.sender === 'ai' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: geminiContents,
      config: {
        systemInstruction,
        temperature: 0.75,
      }
    });

    res.json({
      text: response.text || 'Lamento, não consegui obter resposta da Inteligência Artificial.',
      isMock: false
    });

  } catch (error: any) {
    console.error('Error in MindGuardian Gemini chat API:', error);
    res.status(500).json({ error: error.message || 'Error connecting to Gemini coach' });
  }
});

// Integrate Vite middleware for development or serve custom dist for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MindGuardian Server] Running as full-stack app on port ${PORT}`);
  });
}

startServer();
