import React, { useState, useEffect } from 'react';
import { DayUsage, SystemAlert, UserProfile, DigitalLimit } from './types';
import {
  MOCK_WEEK_LOGS,
  INITIAL_ALERTS,
  INITIAL_USER,
  INITIAL_LIMITS,
  formatMinutes
} from './utils';

// Import local page components
import DashboardExposition from './components/DashboardExposition';
import AiMentor from './components/AiMentor';
import SimuladorDispositivo from './components/SimuladorDispositivo';
import RelatoriosGerais from './components/RelatoriosGerais';
import ConfiguracoesRealista from './components/ConfiguracoesRealista';

// Lucide Icons
import {
  ShieldAlert,
  BrainCircuit,
  Smartphone,
  Sparkles,
  BarChart,
  MessageSquare,
  FileText,
  Settings,
  AlertOctagon,
  Clock,
  UserCheck
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat' | 'device' | 'reports' | 'config'>('dashboard');
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER);
  const [limits, setLimits] = useState<DigitalLimit[]>(INITIAL_LIMITS);
  const [alerts, setAlerts] = useState<SystemAlert[]>(INITIAL_ALERTS);
  const [weekLogs, setWeekLogs] = useState<DayUsage[]>(MOCK_WEEK_LOGS);

  // UTC clock simulation
  const [currentTimeStr, setCurrentTimeStr] = useState('20:42:00 UTC');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTimeStr(now.toISOString().substring(11, 19) + ' UTC');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update minutes for app in final day of logs (Today)
  const handleAddMinutes = (appName: string, minutes: number, dataMB: number) => {
    setWeekLogs(prev => {
      const updated = [...prev];
      const todayIndex = updated.length - 1;
      const today = { ...updated[todayIndex] };

      today.totalMinutes += minutes;
      today.totalDataMB += dataMB;

      // Adjust productivity based on category
      const appIndex = today.apps.findIndex(a => a.appName === appName);
      if (appIndex !== -1) {
        const targetApp = { ...today.apps[appIndex] };
        targetApp.minutesSpent += minutes;
        targetApp.dataConsumedMB += dataMB;
        targetApp.launches += 2;
        today.apps[appIndex] = targetApp;
      } else {
        // App doesn't exist today, add it
        const isEdu = appName === 'Duolingo' || appName === 'PDF Reader Pro';
        const isProd = appName === 'Visual Studio Code';
        today.apps.push({
          id: `app-${Date.now()}`,
          appName,
          category: isProd ? 'Produtividade' : isEdu ? 'Educação' : 'Entretenimento',
          minutesSpent: minutes,
          dataConsumedMB: dataMB,
          launches: 4,
          productivityScore: isProd ? 98 : isEdu ? 90 : 10
        });
      }

      // Recalculate daily productivity index based on educational vs entertaining minutes spent
      let totalProdWeight = 0;
      let totalMinutes = 0;
      today.apps.forEach(a => {
        totalMinutes += a.minutesSpent;
        totalProdWeight += a.minutesSpent * a.productivityScore;
      });
      today.productivityIndex = Math.round(totalProdWeight / totalMinutes) || 50;

      updated[todayIndex] = today;
      return updated;
    });

    // Automatically trigger alert if this app has limit enabled and exceeded
    const appLimit = limits.find(l => l.appName === appName);
    const todayApps = weekLogs[weekLogs.length - 1]?.apps || [];
    const currentAppUsage = todayApps.find(a => a.appName === appName);
    const currentMinutes = (currentAppUsage?.minutesSpent || 0) + minutes;

    if (appLimit?.isEnabled && currentMinutes > appLimit.limitMinutes) {
      const newAlert: SystemAlert = {
        id: `auto-alert-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'danger',
        title: 'Excesso Detectado',
        message: `Seu uso do ${appName} (${formatMinutes(currentMinutes)}) excedeu o limite programado de ${formatMinutes(appLimit.limitMinutes)} em Angola!`,
        appAffected: appName,
        isRead: false
      };
      setAlerts(prev => [newAlert, ...prev]);
    }
  };

  const handleTriggerMockAlert = (newAlert: SystemAlert) => {
    setAlerts(prev => [newAlert, ...prev]);
  };

  const handleClearAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
  };

  const handleRefreshTelemetry = () => {
    // Inject random study/code productivity minutes dynamically
    handleAddMinutes('Visual Studio Code', 45, 12);
  };  return (
    <div className="bg-[#0a0a0c] text-gray-200 min-h-screen font-sans">
      
      {/* Upper Brand Info Panel */}
      <header className="sticky top-0 z-50 bg-[#0d0d10] border-b border-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* App title and creator */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center p-2.5 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              <BrainCircuit className="w-6 h-6 text-white stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight text-white">MindGuardian <span className="text-blue-500">AI</span> Angola</h1>
                <span className="text-[10px] items-center bg-blue-600/10 text-blue-400 border border-blue-600/20 font-semibold px-2 py-0.5 rounded-full">SaaS</span>
              </div>
              <p className="text-3xs text-gray-500">
                Criado por <span className="text-white font-semibold">Bernardo Pedro</span> com auxílio de Inteligência Artificial
              </p>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="flex items-center flex-wrap gap-1.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart className="w-4 h-4" />
              <span>Painel</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Mentor IA</span>
            </button>

            <button
              onClick={() => setActiveTab('device')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer ${
                activeTab === 'device'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Simulador</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Relatórios</span>
            </button>

            <button
              onClick={() => setActiveTab('config')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer ${
                activeTab === 'config'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Ajustes</span>
            </button>
          </nav>

          {/* Time & State Badge */}
          <div className="flex items-center gap-2.5 bg-[#15151a] border border-white/5 px-3.5 py-1.5 rounded-xl font-mono text-3xs text-gray-400">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span>{currentTimeStr}</span>
          </div>

        </div>
      </header>

      {/* Main Container Area */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        
        {/* Welcome message section */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-3.5">
          <div>
            <span className="text-[10px] text-blue-400 uppercase tracking-widest font-mono font-extrabold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-500" />
              Sistema SaaS Inteligente de Saúde Digital
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1">
              {activeTab === 'dashboard' && 'Painel de Auditoria de Consumo'}
              {activeTab === 'chat' && 'Mentor de Desintoxicação Comportamental'}
              {activeTab === 'device' && 'Estatísticas & Permissões do Android'}
              {activeTab === 'reports' && 'Relatórios e Diagnósticos Académicos'}
              {activeTab === 'config' && 'Thresholds e Ajustes do Guardião'}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {activeTab === 'dashboard' && 'Navegue pelos tempos gastos hoje, picos de ecrã e fuga financeira em dados móveis.'}
              {activeTab === 'chat' && 'Formule estratégias com o Google Gemini para limitar procrastinações em Luanda.'}
              {activeTab === 'device' && 'Simule estatísticas de primeiro plano conectadas com o seu celular virtual.'}
              {activeTab === 'reports' && 'Veja o impacto gerado por categorias e imprima a auditoria geral do acadêmico.'}
              {activeTab === 'config' && 'Defina limites de segurança por aplicativo e configure o Modo Otimizado de Banda.'}
            </p>
          </div>

          <div className="text-right flex items-center gap-2 bg-[#15151a] p-2.5 rounded-2xl border border-white/5 text-slate-300">
            <UserCheck className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-4xs text-gray-500 text-left">PROPRIETÁRIO</p>
              <p className="text-2xs font-bold text-slate-100">{userProfile.name} ({userProfile.role})</p>
            </div>
          </div>
        </div>

        {/* Dynamic Screen Tabs Router */}
        <div id="core-screen-container" className="animate-fade-in duration-200">
          {activeTab === 'dashboard' && (
            <DashboardExposition
              weekLogs={weekLogs}
              alerts={alerts}
              userProfile={userProfile}
              onRefreshTelemetry={handleRefreshTelemetry}
              onClearAlert={handleClearAlert}
            />
          )}

          {activeTab === 'chat' && (
            <AiMentor
              userProfile={userProfile}
            />
          )}

          {activeTab === 'device' && (
            <SimuladorDispositivo
              currentDayApps={weekLogs[weekLogs.length - 1]?.apps || []}
              onAddMinutes={handleAddMinutes}
              onTriggerMockAlert={handleTriggerMockAlert}
            />
          )}

          {activeTab === 'reports' && (
            <RelatoriosGerais
              weekLogs={weekLogs}
              userProfile={userProfile}
            />
          )}

          {activeTab === 'config' && (
            <ConfiguracoesRealista
              userProfile={userProfile}
              limits={limits}
              onChangeProfile={setUserProfile}
              onChangeLimits={setLimits}
            />
          )}
        </div>
      </main>

      {/* Simple, standard footer */}
      <footer className="border-t border-slate-900 py-6 mt-12 bg-slate-950/40 text-center">
        <p className="text-3xs text-slate-500">
          MindGuardian AI Angola &copy; 2026 • Plataforma SaaS de Consciência Tecnológica e Produtividade Móvel.
        </p>
        <p className="text-4xs text-slate-600 mt-1">
          Engenharia de Software de Luanda, Angola. Todos os dados permanecem estritamente preservados com criptografia local.
        </p>
      </footer>

    </div>
  );
}
