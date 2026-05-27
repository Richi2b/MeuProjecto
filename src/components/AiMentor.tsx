import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserProfile } from '../types';
import { Send, Sparkles, BrainCircuit, Lightbulb, Zap, User, RefreshCw } from 'lucide-react';

interface Props {
  userProfile: UserProfile;
}

const QUICK_PRESETS = [
  { label: 'Como poupar dados e travar o vício?', query: 'Moro em Luanda e gasto imenso dinheiro com saldos de internet Unitel/Movicel a ver TikToks à noite. Dá-me estratégias para poupar dados e focar em programar/estudar.' },
  { label: 'Dica para focar em Engenharia de Software', query: 'Sou estudante de engenharia em Angola e procrastino muito nas redes sociais de ecran. Como posso usar o MindGuardian AI para criar uma rotina focada?' },
  { label: 'Detetar cansaço digital noturno', query: 'Normalmente fico acordado até às 23h ou 0h no ecrã e sinto-me cansado no dia seguinte. Podes criar um plano de relaxamento digital para mim?' }
];

export default function AiMentor({ userProfile }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: `Olá, Engenheiro Bernardo Pedro! Sou o seu Guardião Comportamental do MindGuardian AI. Estou a analisar os seus hábitos de uso móvel no país e vejo que o TikTok está a drenar o seu tempo de estudo de forma crítica. Como posso ajudar-lhe hoje a disciplinar os seus limites digitais de banda?`,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          userProfile
        })
      });

      if (!response.ok) {
        throw new Error('Falha na resposta do Mentor Digital');
      }

      const data = await response.json();
      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.text,
        timestamp: new Date().toLocaleTimeString()
      }]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `Peço desculpa, ocorreu um pequeno problema de rede ao consultar a Inteligência Artificial. Pode tentar reenviar a sua sugestão ou ativar o Modo Alternativo de Dados Simplificados.`,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar options */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-[#15151a] border border-white/5 rounded-3xl p-5 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-blue-500" />
            Mentor Comportamental
          </h3>
          <p className="text-2xs text-gray-400 leading-relaxed mb-4">
            A IA do MindGuardian Angola funciona como um treinador pessoal para hábitos benéficos e controle de bem-estar tecnológico.
          </p>

          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex justify-between items-center text-2xs">
              <span className="text-gray-500">Modo Conexão</span>
              <span className="text-blue-400 font-mono">Gemini-3.5-Flash</span>
            </div>
            <div className="flex justify-between items-center text-2xs">
              <span className="text-gray-500">Suporte a Dados</span>
              <span className="text-purple-400 font-mono">Modo Otimizado AO</span>
            </div>
          </div>
        </div>

        <div className="bg-[#15151a] border border-white/5 rounded-3xl p-5 shadow-xl">
          <h4 className="text-xs font-semibold text-gray-300 mb-3 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-blue-400" />
            Sugestões Rápidas de Diálogo
          </h4>
          <div className="space-y-2">
            {QUICK_PRESETS.map((preset, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(preset.query)}
                className="w-full text-left text-2xs bg-[#0d0d10] hover:bg-[#15151a] border border-white/5 hover:border-white/10 p-3 rounded-2xl text-gray-300 transition duration-300"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Messenger Box */}
      <div className="lg:col-span-3 bg-[#15151a] border border-white/5 rounded-3xl shadow-xl overflow-hidden flex flex-col h-[520px]">
        {/* Core header */}
        <div className="bg-[#0d0d10] border-b border-white/5 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <BrainCircuit className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">MindGuardian AI Coach</h3>
              <p className="text-2xs text-blue-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></span>
                Analista digital ativo
              </p>
            </div>
          </div>
          <span className="text-2xs bg-white/5 text-gray-400 px-2.5 py-1 rounded-xl border border-white/10">
            Luanda, AO
          </span>
        </div>

        {/* Message logs */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                m.sender === 'user'
                  ? 'bg-blue-600/25 text-blue-400'
                  : 'bg-white/5 text-gray-300'
              }`}>
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <BrainCircuit className="w-4 h-4" />}
              </div>

              <div className={`p-4 rounded-2xl space-y-1 ${
                m.sender === 'user'
                  ? 'bg-blue-600/10 border border-blue-500/15 text-gray-200'
                  : 'bg-[#0d0d10] border border-white/5 text-gray-200'
              }`}>
                <p className="text-xs leading-relaxed whitespace-pre-line">{m.text}</p>
                <div className="flex justify-between items-center text-3xs text-gray-500">
                  <span>{m.sender === 'user' ? 'Você' : 'MindGuardian AI'}</span>
                  <span>{m.timestamp}</span>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 mr-auto max-w-[80%]">
              <div className="w-8 h-8 rounded-xl bg-white/5 text-gray-400 flex items-center justify-center shrink-0">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-[#0d0d10] border border-white/5 text-gray-450 text-xs animate-pulse">
                O seu Mentor comportamental está a redigir soluções inteligentes para Angola...
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Chat input controls */}
        <div className="p-4 bg-[#0d0d10] border-t border-white/5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(userInput);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Pergunte sobre consumo móvel, vícios noturnos ou economia de Kwanzas..."
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition duration-300"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !userInput.trim()}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-3 rounded-2xl transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span className="text-xs hidden md:inline">Enviar</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
