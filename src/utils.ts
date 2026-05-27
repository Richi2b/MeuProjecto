import { DayUsage, SystemAlert, UserProfile, DigitalLimit } from './types';

// Helper to calculate cost in Kwanzas (AOA)
// Standard rate in Angola: roughly 500 AOA to 1000 AOA per GB depending on the bundle (Unitel/Movicel)
export const calculateDataCostAOA = (mb: number): number => {
  const gb = mb / 1024;
  return Math.round(gb * 750); // average ~750 AOA per GB
};

export const INITIAL_USER: UserProfile = {
  name: 'Eng. Bernardo Pedro',
  role: 'Estudante',
  province: 'Luanda',
  dailyLimitMinutes: 300,
  liteDataMode: true,
  addictionLevel: 'Crítico',
};

export const INITIAL_LIMITS: DigitalLimit[] = [
  { appName: 'TikTok', limitMinutes: 45, isEnabled: true },
  { appName: 'WhatsApp', limitMinutes: 120, isEnabled: true },
  { appName: 'YouTube', limitMinutes: 60, isEnabled: false },
  { appName: 'Facebook', limitMinutes: 30, isEnabled: true },
];

export const MOCK_WEEK_LOGS: DayUsage[] = [
  {
    date: 'Segunda-feira',
    totalMinutes: 340,
    totalDataMB: 1250,
    productivityIndex: 65,
    apps: [
      { id: '1', appName: 'TikTok', category: 'Entretenimento', minutesSpent: 120, dataConsumedMB: 650, productivityScore: 10, launches: 32 },
      { id: '2', appName: 'WhatsApp', category: 'Social', minutesSpent: 140, dataConsumedMB: 120, productivityScore: 45, launches: 50 },
      { id: '3', appName: 'YouTube', category: 'Entretenimento', minutesSpent: 40, dataConsumedMB: 400, productivityScore: 30, launches: 5 },
      { id: '4', appName: 'C++ Compiler', category: 'Produtividade', minutesSpent: 30, dataConsumedMB: 15, productivityScore: 95, launches: 8 },
      { id: '5', appName: 'Duolingo', category: 'Educação', minutesSpent: 10, dataConsumedMB: 65, productivityScore: 90, launches: 2 },
    ]
  },
  {
    date: 'Terça-feira',
    totalMinutes: 420,
    totalDataMB: 2100,
    productivityIndex: 48,
    apps: [
      { id: '1', appName: 'TikTok', category: 'Entretenimento', minutesSpent: 190, dataConsumedMB: 1100, productivityScore: 5, launches: 44 },
      { id: '2', appName: 'WhatsApp', category: 'Social', minutesSpent: 150, dataConsumedMB: 180, productivityScore: 50, launches: 62 },
      { id: '3', appName: 'YouTube', category: 'Entretenimento', minutesSpent: 60, dataConsumedMB: 800, productivityScore: 25, launches: 12 },
      { id: '4', appName: 'PDF Reader Pro', category: 'Educação', minutesSpent: 20, dataConsumedMB: 20, productivityScore: 85, launches: 4 },
    ]
  },
  {
    date: 'Quarta-feira',
    totalMinutes: 310,
    totalDataMB: 980,
    productivityIndex: 72,
    apps: [
      { id: '1', appName: 'TikTok', category: 'Entretenimento', minutesSpent: 40, dataConsumedMB: 200, productivityScore: 12, launches: 10 },
      { id: '2', appName: 'WhatsApp', category: 'Social', minutesSpent: 110, dataConsumedMB: 90, productivityScore: 60, launches: 40 },
      { id: '3', appName: 'Visual Studio Code', category: 'Produtividade', minutesSpent: 120, dataConsumedMB: 90, productivityScore: 98, launches: 6 },
      { id: '4', appName: 'Duolingo', category: 'Educação', minutesSpent: 40, dataConsumedMB: 60, productivityScore: 90, launches: 4 },
    ]
  },
  {
    date: 'Quinta-feira',
    totalMinutes: 490,
    totalDataMB: 3150,
    productivityIndex: 38,
    apps: [
      { id: '1', appName: 'TikTok', category: 'Entretenimento', minutesSpent: 240, dataConsumedMB: 1850, productivityScore: 5, launches: 65 },
      { id: '2', appName: 'WhatsApp', category: 'Social', minutesSpent: 150, dataConsumedMB: 300, productivityScore: 40, launches: 80 },
      { id: '3', appName: 'Subway Surfers', category: 'Entretenimento', minutesSpent: 80, dataConsumedMB: 0, productivityScore: 20, launches: 15 },
      { id: '4', appName: 'Google Chrome', category: 'Educação', minutesSpent: 20, dataConsumedMB: 1000, productivityScore: 50, launches: 7 },
    ]
  },
  {
    date: 'Sexta-feira',
    totalMinutes: 280,
    totalDataMB: 750,
    productivityIndex: 84,
    apps: [
      { id: '1', appName: 'TikTok', category: 'Entretenimento', minutesSpent: 20, dataConsumedMB: 100, productivityScore: 15, launches: 5 },
      { id: '2', appName: 'WhatsApp', category: 'Social', minutesSpent: 80, dataConsumedMB: 80, productivityScore: 70, launches: 25 },
      { id: '3', appName: 'Visual Studio Code', category: 'Produtividade', minutesSpent: 150, dataConsumedMB: 50, productivityScore: 98, launches: 10 },
      { id: '4', appName: 'Khan Academy', category: 'Educação', minutesSpent: 30, dataConsumedMB: 520, productivityScore: 95, launches: 3 },
    ]
  },
  {
    date: 'Sábado',
    totalMinutes: 520,
    totalDataMB: 4050,
    productivityIndex: 25,
    apps: [
      { id: '1', appName: 'TikTok', category: 'Entretenimento', minutesSpent: 290, dataConsumedMB: 2300, productivityScore: 2, launches: 90 },
      { id: '2', appName: 'Instagram', category: 'Social', minutesSpent: 120, dataConsumedMB: 1100, productivityScore: 10, launches: 35 },
      { id: '3', appName: 'WhatsApp', category: 'Social', minutesSpent: 80, dataConsumedMB: 50, productivityScore: 50, launches: 30 },
      { id: '4', appName: 'PUBG Mobile', category: 'Entretenimento', minutesSpent: 30, dataConsumedMB: 600, productivityScore: 30, launches: 2 },
    ]
  },
  {
    date: 'Domingo',
    totalMinutes: 380,
    totalDataMB: 1950,
    productivityIndex: 52,
    apps: [
      { id: '1', appName: 'TikTok', category: 'Entretenimento', minutesSpent: 150, dataConsumedMB: 980, productivityScore: 5, launches: 40 },
      { id: '2', appName: 'WhatsApp', category: 'Social', minutesSpent: 180, dataConsumedMB: 220, productivityScore: 40, launches: 60 },
      { id: '3', appName: 'Canva', category: 'Produtividade', minutesSpent: 40, dataConsumedMB: 250, productivityScore: 80, launches: 5 },
      { id: '4', appName: 'Wikipedia', category: 'Educação', minutesSpent: 10, dataConsumedMB: 500, productivityScore: 90, launches: 2 },
    ]
  }
];

export const INITIAL_ALERTS: SystemAlert[] = [
  {
    id: 'a1',
    timestamp: '2026-05-27T10:15:00Z',
    type: 'danger',
    title: 'Limite Crítico Excedido',
    message: 'Você já passou do limite estipulado de 45 minutos de TikTok hoje! Tempo atual: 1h 22m.',
    appAffected: 'TikTok',
    isRead: false,
  },
  {
    id: 'a2',
    timestamp: '2026-05-27T14:30:00Z',
    type: 'warning',
    title: 'Consumo Elevado de Saldo / Net',
    message: 'Seu celular consumiu 2.3 GB de dados nas últimas 4 horas. Isso equivale a aproximadamente 1,725 AOA em saldo de dados!',
    isRead: false,
  },
  {
    id: 'a3',
    timestamp: '2026-05-27T20:00:00Z',
    type: 'info',
    title: 'Sessão Noturna de Estudos',
    message: 'Dica do Guardião: Dedique as próximas 2 horas para estudo concentrado sem notificações do WhatsApp.',
    appAffected: 'WhatsApp',
    isRead: false,
  }
];

export const formatMinutes = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};
