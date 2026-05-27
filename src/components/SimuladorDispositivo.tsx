import React, { useState } from 'react';
import { AppUsage, SystemAlert } from '../types';
import { Smartphone, Shield, Eye, Settings, Play, CheckCircle2, AlertTriangle, CloudRain, Lock, SmartphoneCharging } from 'lucide-react';
import { formatMinutes } from '../utils';

interface Props {
  currentDayApps: AppUsage[];
  onAddMinutes: (appName: string, minutes: number, dataMB: number) => void;
  onTriggerMockAlert: (alert: SystemAlert) => void;
}

export default function SimuladorDispositivo({
  currentDayApps,
  onAddMinutes,
  onTriggerMockAlert
}: Props) {
  const [hasUsagePermission, setHasUsagePermission] = useState(true);
  const [hasNotificationPermission, setHasNotificationPermission] = useState(true);
  const [selectedApp, setSelectedApp] = useState('TikTok');
  const [minutesToAdd, setMinutesToAdd] = useState(30);
  const [isSyncing, setIsSyncing] = useState(false);

  const triggerAlertSimulation = () => {
    const customAlert: SystemAlert = {
      id: `sim-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'danger',
      title: 'Limite Exposto no Simulador',
      message: `Você excedeu o limite saudável simulado para o aplicativo ${selectedApp} em Luanda! Limite estipulado de 30m foi quebrado.`,
      appAffected: selectedApp,
      isRead: false
    };
    onTriggerMockAlert(customAlert);
  };

  const handleSimulateActiveUse = () => {
    setIsSyncing(true);
    setTimeout(() => {
      // 1 minute of video roughly takes 8MB of data. Social takes 2MB. Code/Educação takes 0.5MB.
      let rateData = 1.5;
      if (selectedApp === 'TikTok' || selectedApp === 'YouTube') rateData = 10;
      if (selectedApp === 'Instagram') rateData = 6;
      if (selectedApp === 'Visual Studio Code' || selectedApp === 'Duolingo') rateData = 0.4;

      const calcMB = Math.round(minutesToAdd * rateData);
      onAddMinutes(selectedApp, minutesToAdd, calcMB);
      setIsSyncing(false);
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Simulation Controls (Left side) */}
      <div className="lg:col-span-7 space-y-5">
        <div className="bg-[#15151a] border border-white/5 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-blue-500" />
            <h3 className="text-base font-bold text-white">Permissões do Android (Simulação Local)</h3>
          </div>
          <p className="text-2xs text-gray-400 mb-4 leading-relaxed">
            Para coletar estatísticas de consumo no Android real, o MindGuardian requer duas permissões fundamentais de privacidade que salvaguardam seus dados pessoais localmente:
          </p>

          <div className="space-y-3.5">
            {/* Permission 1 */}
            <div className="p-4 bg-[#0d0d10] border border-white/5 rounded-2xl flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <h4 className="text-xs font-semibold text-gray-200">Acesso a Estatísticas de Uso ("UsageStats")</h4>
                </div>
                <p className="text-3xs text-gray-500">Permite mapear o tempo que cada aplicação passa focada em primeiro plano.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasUsagePermission}
                  onChange={(e) => setHasUsagePermission(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-500 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 peer-checked:after:bg-white"></div>
              </label>
            </div>

            {/* Permission 2 */}
            <div className="p-4 bg-[#0d0d10] border border-white/5 rounded-2xl flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <h4 className="text-xs font-semibold text-gray-200">Leitor de Notificações de Alertas ("NotificationListener")</h4>
                </div>
                <p className="text-3xs text-gray-500">Permite ao guardião suspender notificações barulhentas durante o Modo Foco.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasNotificationPermission}
                  onChange={(e) => setHasNotificationPermission(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-500 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 peer-checked:after:bg-white"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Live Simulation Trigger */}
        <div className="bg-[#15151a] border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">Injetar Telemetria Artificial</h3>
          </div>
          <p className="text-2xs text-gray-400 leading-relaxed">
            Selecione um aplicativo e passe algum "Tempo Simulado" para ver o comportamento do sistema, os índices de produtividade e os limites de Internet móvel reagirem imediatamente.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-3xs text-gray-500 uppercase font-semibold mb-1.5">Escolher Aplicação</label>
              <select
                value={selectedApp}
                onChange={(e) => setSelectedApp(e.target.value)}
                className="w-full bg-[#0d0d10] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="TikTok">TikTok (Entretenimento)</option>
                <option value="WhatsApp">WhatsApp (Social)</option>
                <option value="YouTube">YouTube (Entretenimento)</option>
                <option value="Instagram">Instagram (Social)</option>
                <option value="Visual Studio Code">Visual Studio Code (Produtividade)</option>
                <option value="Duolingo">Duolingo (Educação)</option>
              </select>
            </div>

            <div>
              <label className="block text-3xs text-gray-500 uppercase font-semibold mb-1.5">Minutos Passados</label>
              <select
                value={minutesToAdd}
                onChange={(e) => setMinutesToAdd(Number(e.target.value))}
                className="w-full bg-[#0d0d10] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="15">15 minutos (Uso Breve)</option>
                <option value="30">30 minutos (Sessão Curta)</option>
                <option value="60">60 minutos (Sessão Longa)</option>
                <option value="120">120 minutos (Abuso Crítico)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleSimulateActiveUse}
              disabled={isSyncing}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-3 rounded-2xl transition duration-300 text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isSyncing ? 'Sincronizando de Luanda...' : 'Injetar Consumo'}
            </button>

            <button
              onClick={triggerAlertSimulation}
              className="w-full bg-transparent hover:bg-red-950/20 text-red-400 hover:text-red-300 border border-red-500/20 py-2.5 px-3 rounded-2xl transition duration-300 text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Disparar Alerta Crítico
            </button>
          </div>
        </div>
      </div>

      {/* Simulated Android Device Preview Mockup (Right side 12-col span-5) */}
      <div className="lg:col-span-5 flex justify-center">
        <div className="relative w-72 h-[490px] bg-[#0a0a0c] border-[6px] border-white/10 rounded-[40px] shadow-2xl flex flex-col justify-between p-3.5">
          {/* Top Notch/Speaker */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-white/10 rounded-b-xl flex items-center justify-center z-20">
            <div className="w-10 h-1 bg-[#0a0a0c] rounded-full"></div>
          </div>

          {/* Android Clock and Stats */}
          <div className="flex justify-between items-center text-3xs text-gray-500 font-sans mt-1 px-1.5 select-none z-10">
            <span>20:42 PM</span>
            <div className="flex items-center gap-1">
              <span className="text-blue-500">Unitel 4G</span>
              <SmartphoneCharging className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
            </div>
          </div>

          {/* Device Core Screen Content */}
          <div className="flex-1 my-3 bg-[#0d0d10] rounded-3xl p-3 border border-white/5 overflow-y-auto space-y-3.5">
            <div className="text-center py-2 border-b border-white/5">
              <p className="text-4xs text-blue-400 font-mono tracking-widest uppercase mb-1">MINDGUARDIAN AGENT</p>
              <h4 className="text-xs font-bold text-white">Dispositivo Bernardo</h4>
            </div>

            {/* Simulated Live Block Screen Overlay if limit reached */}
            <div className="p-3 bg-[#15151a] border border-white/5 rounded-2xl space-y-1">
              <span className="text-3xs bg-blue-500/15 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded-full font-mono">
                Ativo
              </span>
              <p className="text-3xs text-gray-400 leading-normal mt-1">
                Serviço de fundo está a rastrear o seu tempo de ecrã e pacotes de rede localmente.
              </p>
            </div>

            {/* List of simulated apps on the phone */}
            <div className="space-y-1.5">
              <h5 className="text-3xs text-gray-500 uppercase font-semibold">Consumo Hoje (Telemetria)</h5>
              {currentDayApps.map(app => (
                <div key={app.id} className="p-2 bg-white/5 rounded-xl flex justify-between items-center border border-white/5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span className="text-4xs font-bold text-gray-300">{app.appName}</span>
                  </div>
                  <span className="text-4xs font-mono text-gray-400">{formatMinutes(app.minutesSpent)}</span>
                </div>
              ))}
            </div>

            {/* Encryption badge */}
            <div className="flex items-center gap-1 text-gray-600 justify-center">
              <Lock className="w-2.5 h-2.5" />
              <span className="text-[8px]">Dados Criptografados localmente</span>
            </div>
          </div>

          {/* Android Bottom Home Button */}
          <div className="h-2 flex items-center justify-center">
            <div className="w-20 h-1 bg-white/10 rounded-full cursor-pointer hover:bg-white/20"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
