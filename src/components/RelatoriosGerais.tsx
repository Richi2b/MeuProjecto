import React, { useState } from 'react';
import { DayUsage, UserProfile, AIInsight } from '../types';
import { formatMinutes, calculateDataCostAOA } from '../utils';
import { FileText, Award, ShieldAlert, CheckCircle, RefreshCw, Sparkles, Download, DollarSign } from 'lucide-react';

interface Props {
  weekLogs: DayUsage[];
  userProfile: UserProfile;
}

export default function RelatoriosGerais({ weekLogs, userProfile }: Props) {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<AIInsight[]>([
    {
      title: 'Desperdício de Banda Exagerado',
      description: 'Dentre os aplicativos catalogados, o TikTok lidera o tempo desperdiçado, elevando de forma severa as taxas de custos de pacotes adicionais Móveis.',
      category: 'economia',
      recommendation: 'Ative o modo Otimizado de Dados e configure limites diários rígidos para as noites em Luanda.'
    },
    {
      title: 'Hábito Noturno Danoso',
      description: 'O seu comportamento diário revela um pico elevado de launches após as 21h que quebram o foco mental para os seus estudos.',
      category: 'saude',
      recommendation: 'Agende uma pausa forçada de ecrã a partir das 22h com o modo Noturno Ativo.'
    }
  ]);

  const totalMinutesWeek = weekLogs.reduce((sum, d) => sum + d.totalMinutes, 0);
  const totalDataMB = weekLogs.reduce((sum, d) => sum + d.totalDataMB, 0);
  const avgProductivity = Math.round(weekLogs.reduce((sum, d) => sum + d.productivityIndex, 0) / weekLogs.length);

  const fetchAiDiagnostics = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile,
          weekData: weekLogs
        })
      });

      if (!response.ok) throw new Error('Falha no diagnóstico da IA');
      const data = await response.json();
      if (data.insights) {
        setInsights(data.insights);
      }
    } catch (err) {
      console.error('Error fetching AI insights:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPrintableReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Options */}
      <div className="bg-[#15151a] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            Relatórios de Comportamento & Diagnósticos Inteligentes
          </h2>
          <p className="text-xs text-gray-500">Gere e imprima relatórios diagnósticos de desintoxicação digital do MindGuardian.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchAiDiagnostics}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition duration-300 flex items-center gap-1.5 cursor-pointer"
            disabled={loading}
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? 'Consultando Gemini...' : 'Recalcular com Gemini'}
          </button>

          <button
            onClick={downloadPrintableReport}
            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 py-2.5 px-4 rounded-xl text-xs transition duration-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Imprimir Relatório (PDF)
          </button>
        </div>
      </div>

      <div id="report-print-area" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Printable Diagnostics Sheet */}
        <div className="lg:col-span-2 bg-[#15151a] border border-white/5 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="border-b border-white/5 pb-4 text-center">
            <p className="text-3xs text-blue-400 font-mono tracking-widest uppercase">MINDGUARDIAN AI - ANGOLA DIGITAL ACCESSIBILITY</p>
            <h3 className="text-base font-bold text-white mt-1">SaaS de Auditoria Comportamental Móvel</h3>
            <p className="text-4xs text-gray-500 mt-1">Preparado pelo Engenheiro Bernardo Pedro e Mentor Inteligente</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2 text-center border-b border-white/5 pb-4">
            <div>
              <p className="text-3xs text-gray-500 uppercase">Tempo Semanal</p>
              <p className="text-sm font-bold text-white mt-0.5">{formatMinutes(totalMinutesWeek)}</p>
            </div>
            <div>
              <p className="text-3xs text-gray-500 uppercase">Banda Tráfego</p>
              <p className="text-sm font-bold text-blue-400 mt-0.5">{(totalDataMB / 1024).toFixed(2)} GB</p>
            </div>
            <div>
              <p className="text-3xs text-gray-500 uppercase">Período de Análise</p>
              <p className="text-sm font-bold text-gray-305 mt-0.5">Últimos 7 dias</p>
            </div>
            <div>
              <p className="text-3xs text-gray-500 uppercase">Fuga Monetária Est.</p>
              <p className="text-sm font-bold text-emerald-400 mt-0.5">{(calculateDataCostAOA(totalDataMB)).toLocaleString()} AOA</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Estatísticas Mensais Comparadas</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead>
                  <tr className="border-b border-white/5 text-gray-400">
                    <th className="py-2.5">Indicador de Uso</th>
                    <th className="py-2.5">Meta Ideal</th>
                    <th className="py-2.5 text-right">Consumo Realizado</th>
                    <th className="py-2.5 text-right">Diagnosticado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-2.5 font-semibold">Tempo Diário Médio</td>
                    <td className="py-2.5 text-gray-500">180 minutos</td>
                    <td className="py-2.5 text-right text-red-400">{Math.round(totalMinutesWeek / 7)} min</td>
                    <td className="py-2.5 text-right text-yellow-500 font-medium">Excedente Saudável</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold">Dados Móveis por Semana</td>
                    <td className="py-2.5 text-gray-500">2.0 GB</td>
                    <td className="py-2.5 text-right text-blue-400">{(totalDataMB / 1024).toFixed(1)} GB</td>
                    <td className="py-2.5 text-right text-red-500 font-medium">Elevado Custo</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold">Foco Acadêmico Semanal</td>
                    <td className="py-2.5 text-gray-500">420 minutos</td>
                    <td className="py-2.5 text-right text-emerald-400">300 min</td>
                    <td className="py-2.5 text-right text-yellow-500 font-medium">Em Expansão</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 bg-[#0d0d10] rounded-2xl border border-white/5 text-gray-400 text-3xs leading-relaxed space-y-1">
            <strong>Certificação Reguladora Simbólica:</strong>
            <p>Este documento autentica que o perfil monitorado no MindGuardian possui indícios de procrastinação noturna em Luanda. As sugestões emitidas foram interpretadas por Inteligência Artificial baseado na conformidade de economia de banda nacional.</p>
          </div>
        </div>

        {/* AI Insight Cards (Right Column) */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-500" />
            Insights de Redução Digital do Diagnóstico
          </h3>

          {insights.map((ins, index) => (
            <div
              key={index}
              className={`p-5 rounded-3xl border shadow-lg space-y-3 bg-[#15151a] ${
                ins.category === 'economia'
                  ? 'border-blue-500/20'
                  : ins.category === 'saude'
                  ? 'border-purple-500/20'
                  : 'border-emerald-500/20'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-[9px] uppercase px-2 py-0.5 rounded-full border ${
                  ins.category === 'economia'
                    ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                    : ins.category === 'saude'
                    ? 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                }`}>
                  {ins.category === 'economia' ? 'Poupança & Finanças AOA' : ins.category === 'saude' ? 'Ecrã & Sono Noturno' : 'Foco & Disciplina'}
                </span>
                <span className="text-4xs text-gray-500 font-mono">Insight {index + 1}</span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-200">{ins.title}</h4>
                <p className="text-2xs text-gray-400 mt-1 leading-relaxed">{ins.description}</p>
              </div>

              <div className="pt-2 border-t border-white/5 text-gray-300">
                <p className="text-2xs font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  Plano Sugerido:
                </p>
                <p className="text-3xs text-gray-400 mt-0.5">{ins.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
