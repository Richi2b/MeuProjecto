import React, { useState } from 'react';
import { UserProfile, DigitalLimit } from '../types';
import { Settings, User, Database, ShieldAlert, Award, Eye, Save, HelpCircle, FileDown, Smartphone } from 'lucide-react';

interface Props {
  userProfile: UserProfile;
  limits: DigitalLimit[];
  onChangeProfile: (p: UserProfile) => void;
  onChangeLimits: (l: DigitalLimit[]) => void;
}

export default function ConfiguracoesRealista({
  userProfile,
  limits,
  onChangeProfile,
  onChangeLimits
}: Props) {
  const [name, setName] = useState(userProfile.name);
  const [province, setProvince] = useState(userProfile.province);
  const [role, setRole] = useState(userProfile.role);
  const [dailyLimitMinutes, setDailyLimitMinutes] = useState(userProfile.dailyLimitMinutes);
  const [liteDataMode, setLiteDataMode] = useState(userProfile.liteDataMode);

  const [localLimits, setLocalLimits] = useState<DigitalLimit[]>(limits);
  const [showDoneToast, setShowDoneToast] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onChangeProfile({
      name,
      province,
      role,
      dailyLimitMinutes,
      liteDataMode,
      addictionLevel: dailyLimitMinutes > 300 ? 'Crítico' : dailyLimitMinutes > 180 ? 'Moderado' : 'Baixo'
    });
    setShowDoneToast(true);
    setTimeout(() => setShowDoneToast(false), 2000);
  };

  const handleUpdateLimitMinutes = (index: number, minutes: number) => {
    const updated = [...localLimits];
    updated[index].limitMinutes = minutes;
    setLocalLimits(updated);
    onChangeLimits(updated);
  };

  const handleToggleLimit = (index: number, enabled: boolean) => {
    const updated = [...localLimits];
    updated[index].isEnabled = enabled;
    setLocalLimits(updated);
    onChangeLimits(updated);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Configuration Profile Card */}
      <div className="bg-[#15151a] border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-blue-500" />
          Configurações Individuais de Conta
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-3xs text-gray-500 uppercase font-semibold mb-1.5">Nome do Proprietário</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0d0d10] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-3xs text-gray-500 uppercase font-semibold mb-1.5">Cargo / Atividade</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-[#0d0d10] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Estudante">Estudante de Engenharia</option>
                <option value="Profissional">Profissional Corporativo</option>
                <option value="Empreendedor">Empreendedor / Autônomo</option>
                <option value="Outro">Outro de Luanda</option>
              </select>
            </div>

            <div>
              <label className="block text-3xs text-gray-500 uppercase font-semibold mb-1.5">Província</label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full bg-[#0d0d10] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Luanda">Luanda</option>
                <option value="Benguela">Benguela</option>
                <option value="Huambo">Huambo</option>
                <option value="Cabinda">Cabinda</option>
                <option value="Uíge">Uíge</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-3xs text-gray-500 uppercase font-semibold mb-1.5">Meta Diária de Ecrã</label>
              <select
                value={dailyLimitMinutes}
                onChange={(e) => setDailyLimitMinutes(Number(e.target.value))}
                className="w-full bg-[#0d0d10] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="120">2 Horas Saudáveis</option>
                <option value="180">3 Horas Disciplinadas</option>
                <option value="300">5 Horas (Estudante Alto)</option>
                <option value="480">8 Horas Elevadas</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <div className="p-3 bg-[#0d0d10] border border-white/5 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-[10px] font-bold text-gray-200">Modo Leve de Dados</h4>
                  <p className="text-[8px] text-gray-400">Poupar internet AO</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={liteDataMode}
                    onChange={(e) => setLiteDataMode(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-white/5 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition duration-300 flex items-center justify-center gap-1.5 cursor-pointer mt-2"
          >
            <Save className="w-4 h-4" />
            Configurar & Salvar Perfil
          </button>

          {showDoneToast && (
            <p className="text-3xs text-blue-400 text-center animate-fade-in font-mono">
              ✓ Configurações gravadas com êxito!
            </p>
          )}
        </form>
      </div>

      {/* Threshold Limit Block list setter */}
      <div className="bg-[#15151a] border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-blue-500" />
          Restrições Activas de Aplicativos
        </h3>
        <p className="text-2xs text-gray-400 mb-2 leading-relaxed">
          Defina limites individuais em minutos para bloquear de forma automática ou desencadear alertas sonoros e suspensão de dados no celular Android:
        </p>

        <div className="space-y-3">
          {localLimits.map((lim, index) => (
            <div key={lim.appName} className="p-4 bg-[#0d0d10] border border-white/5 rounded-2xl flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-3xs bg-white/5 text-gray-400 border border-white/10 px-2 py-0.5 rounded-full">
                  {lim.appName}
                </span>
                <p className="text-2xs text-gray-300 mt-1">Limite: <strong className="text-white">{lim.limitMinutes} min/dia</strong></p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="15"
                  max="180"
                  step="15"
                  value={lim.limitMinutes}
                  onChange={(e) => handleUpdateLimitMinutes(index, Number(e.target.value))}
                  disabled={!lim.isEnabled}
                  className="w-24 md:w-36 accent-blue-500 bg-white/5 h-1.5 rounded-lg cursor-pointer disabled:opacity-30"
                />

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lim.isEnabled}
                    onChange={(e) => handleToggleLimit(index, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-white/5 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exportable Script / Guide Integration */}
      <div className="lg:col-span-2 bg-[#15151a] border border-white/5 rounded-3xl p-6 shadow-xl space-y-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-blue-500" />
          Como Configurar no Seu Telefone Real Android (SaaS Link)
        </h4>
        <p className="text-2xs text-gray-400 leading-relaxed">
          O Engenheiro Bernardo Pedro projetou o MindGuardian para conectar facilmente com dispositivos reais. Você pode baixar nosso APK experimental de análise contínua de telemetria de primeiro plano enviando os dados de ecrã criptografados para a API de Luanda.
        </p>

        <div className="p-4 bg-[#0d0d10] border border-white/5 rounded-2xl">
          <h5 className="text-2xs font-semibold text-white mb-2">Comando ADB de Instalação Rápida</h5>
          <pre className="text-3xs text-blue-400 font-mono overflow-x-auto whitespace-pre-wrap leading-normal p-2.5 bg-[#0a0a0c] rounded-xl">
            adb install -r mindguardian-angola-installer.apk && adb shell pm grant com.mindguardian.angola android.permission.PACKAGE_USAGE_STATS
          </pre>
        </div>
      </div>
    </div>
  );
}
