import React from 'react';
import { DayUsage, SystemAlert, UserProfile } from '../types';
import { formatMinutes, calculateDataCostAOA } from '../utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Smartphone, Clock, Database, ShieldAlert, Award, TrendingUp, Sparkles, DollarSign, BrainCircuit, Bell, CircleDot } from 'lucide-react';

interface Props {
  weekLogs: DayUsage[];
  alerts: SystemAlert[];
  userProfile: UserProfile;
  onRefreshTelemetry: () => void;
  onClearAlert: (id: string) => void;
}

const COLORS = ['#10B981', '#3b82f6', '#f59e0b', '#dc2626', '#8b5cf6'];

export default function DashboardExposition({
  weekLogs,
  alerts,
  userProfile,
  onRefreshTelemetry,
  onClearAlert
}: Props) {
  // Current stats (usually the last day or accumulated average)
  const currentDay: DayUsage = weekLogs[weekLogs.length - 1] || { date: '', totalMinutes: 0, totalDataMB: 0, productivityIndex: 0, apps: [] };
  const totalMinutesWeek = weekLogs.reduce((sum, d) => sum + d.totalMinutes, 0);
  const totalDataWeekMB = weekLogs.reduce((sum, d) => sum + d.totalDataMB, 0);
  const avgProductivity = Math.round(weekLogs.reduce((sum, d) => sum + d.productivityIndex, 0) / weekLogs.length);

  // Group apps by category for current day
  const categorySummary: { [key: string]: number } = {};
  currentDay.apps.forEach(app => {
    categorySummary[app.category] = (categorySummary[app.category] || 0) + app.minutesSpent;
  });

  const pieData = Object.keys(categorySummary).map(category => ({
    name: category,
    value: categorySummary[category]
  }));

  const activeAlerts = alerts.filter(a => !a.isRead);

  return (
    <div className="space-y-6">
      {/* Upper Notification Banner if any critical alert exist */}
      {activeAlerts.length > 0 && (
        <div id="quick-alerts" className="relative bg-red-950/40 border border-red-500/30 rounded-2xl p-4 overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 animate-ping m-4"></div>
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-red-200">Alertas Ativos de Dependência Digital</h4>
              <p className="text-xs text-red-300">
                Detectamos comportamento nocivo hoje em Luanda. Seu Guardião Inteligente registrou {activeAlerts.length} anomalias críticas.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {activeAlerts.map(alert => (
                  <span
                    key={alert.id}
                    className="inline-flex items-center gap-1 text-2xs bg-red-900/60 text-red-200 px-3 py-1 rounded-full border border-red-700/40"
                  >
                    <CircleDot className="w-3 h-3 text-red-400" />
                    <strong>{alert.title}:</strong> {alert.message}
                    <button
                      onClick={() => onClearAlert(alert.id)}
                      className="ml-2 hover:text-white text-red-400 font-bold"
                      title="Marcar como lido"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Time card */}
        <div id="stat-card-time" className="relative group bg-[#15151a] border border-white/5 rounded-2xl p-5 hover:border-blue-500/30 transition-all duration-300">
          <div className="absolute top-4 right-4 text-blue-500 bg-blue-500/10 p-2.5 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Tempo Hoje</span>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-light text-white">{formatMinutes(currentDay.totalMinutes)}</span>
          </div>
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            Limite diário: {formatMinutes(userProfile.dailyLimitMinutes)}
          </p>
        </div>

        {/* Data Consumption card */}
        <div id="stat-card-data" className="relative group bg-[#15151a] border border-white/5 rounded-2xl p-5 hover:border-blue-500/30 transition-all duration-300">
          <div className="absolute top-4 right-4 text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl">
            <Database className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Consumo de Banda</span>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-light text-white">{(currentDay.totalDataMB / 1024).toFixed(2)} <span className="text-lg">GB</span></span>
          </div>
          <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-mono">
            <DollarSign className="w-3.5 h-3.5" />
            Custo Est.: {calculateDataCostAOA(currentDay.totalDataMB).toLocaleString()} AOA
          </p>
        </div>

        {/* Productivity Level */}
        <div id="stat-card-productivity" className="relative group bg-[#15151a] border border-white/5 rounded-2xl p-5 hover:border-blue-500/30 transition-all duration-300">
          <div className="absolute top-4 right-4 text-purple-400 bg-purple-500/10 p-2.5 rounded-xl">
            <Award className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Índice Produtividade</span>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-light text-purple-300">{currentDay.productivityIndex}%</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Status: <span className="text-purple-400 font-semibold">{currentDay.productivityIndex > 70 ? 'Excelente' : 'Abaixo da Média'}</span>
          </p>
        </div>

        {/* Level of Vicio Digital */}
        <div id="stat-card-addiction" className="relative group bg-[#15151a] border border-white/5 rounded-2xl p-5 hover:border-blue-500/30 transition-all duration-300">
          <div className="absolute top-4 right-4 text-orange-400 bg-orange-400/10 p-2.5 rounded-xl">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Dependência Digital</span>
          <div className="flex items-end justify-between">
            <span className={`text-3xl font-light tracking-tight ${
              userProfile.addictionLevel === 'Crítico' ? 'text-rose-400 font-medium' : 'text-orange-400'
            }`}>
              {userProfile.addictionLevel}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Risco sugerido pelo total de horas noturnas
          </p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly consumption evolution bar chart */}
        <div className="lg:col-span-2 bg-[#15151a] border border-white/5 rounded-3xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-blue-500" />
                Histórico Semanal de Consumo
              </h3>
              <p className="text-xs text-gray-500">Tempo ativo de ecrã (minutos) por dia letivo</p>
            </div>
            <button
              onClick={onRefreshTelemetry}
              className="text-2xs bg-white/5 hover:bg-white/10 text-white font-medium py-1.5 px-3.5 rounded-xl border border-white/10 transition duration-300"
            >
              Simular Sincronização
            </button>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekLogs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#4b5563" fontSize={10} tickLine={false} />
                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} unit="m" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d0d10', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Bar dataKey="totalMinutes" name="Minutos Usados" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/5 text-center">
            <div>
              <p className="text-xs text-gray-500">Média Semanal</p>
              <p className="text-sm font-semibold text-gray-200">{formatMinutes(Math.round(totalMinutesWeek / weekLogs.length))}/dia</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Dados Totais</p>
              <p className="text-sm font-semibold text-blue-400">{(totalDataWeekMB / 1024).toFixed(1)} GB</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Custo Total Est.</p>
              <p className="text-sm font-semibold text-emerald-400">{calculateDataCostAOA(totalDataWeekMB).toLocaleString()} AOA</p>
            </div>
          </div>
        </div>

        {/* Category distribution chart */}
        <div className="bg-[#15151a] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              Distribuição por Categoria
            </h3>
            <p className="text-xs text-gray-500">Divisão do tempo de ecrã hoje</p>
          </div>

          <div className="h-44 relative my-4 flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${value} minutos`, 'Uso']}
                    contentStyle={{ backgroundColor: '#0d0d10', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-gray-500 text-xs">Sem dados suficientes</span>
            )}
            <div className="absolute flex flex-col items-center">
              <span className="text-sm text-gray-500">Total</span>
              <span className="text-lg font-mono font-bold text-white">{currentDay.totalMinutes}m</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            {pieData.map((item, index) => (
              <div key={item.name} className="flex justify-between items-center text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  <span>{item.name}</span>
                </div>
                <span className="font-mono text-gray-500">{item.value} min ({Math.round((item.value / currentDay.totalMinutes) * 100) || 0}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row: App consumption ranking and daily highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Apps ranking lists */}
        <div className="bg-[#15151a] border border-white/5 rounded-3xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-500" />
            Ranking de Consumo de Hoje
          </h3>
          <div className="space-y-3">
            {currentDay.apps.map(app => (
              <div key={app.id} className="relative group p-3.5 bg-[#0d0d10] border border-white/5 rounded-2xl flex items-center justify-between hover:border-white/10 transition duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-mono font-bold text-white">
                    {app.appName[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{app.appName}</h4>
                    <span className="text-2xs bg-white/5 text-gray-400 px-2 py-0.5 rounded-full border border-white/10">
                      {app.category}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold text-gray-200">{formatMinutes(app.minutesSpent)}</p>
                  <p className="text-2xs text-gray-500">{app.launches} aberturas | {app.dataConsumedMB} MB</p>
                </div>

                {/* Progress bar representing app consumption relative to total screen time */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 rounded-b-2xl overflow-hidden">
                  <div
                    className="h-full bg-blue-600 group-hover:bg-blue-500 transition-all duration-300"
                    style={{ width: `${Math.min(100, (app.minutesSpent / currentDay.totalMinutes) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Angola Behavioral Diagnosis Summary */}
        <div className="bg-[#15151a] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-400" />
              Diagnóstico de Hábitos Angolano
            </h3>
            <p className="text-xs text-gray-400 mb-4 font-normal">Análise automatizada de hábitos digitais com base em Luanda, Benguela e interior</p>

            <div className="space-y-4 text-sm text-gray-300">
              <div className="bg-[#0d0d10] p-4 rounded-2xl border border-white/5 flex items-start gap-4">
                <div className="p-2 border border-blue-500/20 bg-blue-500/10 text-blue-400 rounded-xl mt-0.5 shrink-0">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-xs">Vazamento Financeiro Estipulado</h4>
                  <p className="text-2xs text-gray-400 mt-0.5 leading-relaxed">
                    Seu perfil gasta o equivalente a <strong className="text-white">{(totalDataWeekMB / 1024).toFixed(1)} GB</strong> ou aproximadamente <strong className="text-blue-400">{(calculateDataCostAOA(totalDataWeekMB)).toLocaleString()} AOA</strong> semanais em recargas de internet móvel.
                  </p>
                </div>
              </div>

              <div className="bg-[#0d0d10] p-4 rounded-2xl border border-white/5 flex items-start gap-4">
                <div className="p-2 border border-purple-500/20 bg-purple-500/10 text-purple-400 rounded-xl mt-0.5 shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-xs">Rotina do Estudante</h4>
                  <p className="text-2xs text-gray-400 mt-0.5 leading-relaxed">
                    Seu maior tempo produtivo foi na Sexta-feira com o uso do <strong className="text-white">Visual Studio Code (150m)</strong>. Parabéns! A disciplina gera mestria. Continue focado em estudos práticos de engenharia de software do país.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-2xs text-gray-500 font-mono uppercase tracking-wider">
            <span>Desenvolvido de Luanda, AO</span>
            <span>Estabilidade de Sistema: Alta</span>
          </div>
        </div>
      </div>
    </div>
  );
}
