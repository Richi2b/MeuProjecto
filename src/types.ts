export interface AppUsage {
  id: string;
  appName: string;
  category: 'Social' | 'Entretenimento' | 'Educação' | 'Produtividade' | 'Outros';
  minutesSpent: number;
  dataConsumedMB: number; // Reality in Angola: internet cost is a big factor!
  productivityScore: number; // 0 to 100
  launches: number;
  icon?: string;
}

export interface DayUsage {
  date: string;
  totalMinutes: number;
  totalDataMB: number;
  productivityIndex: number; // 0 to 100
  apps: AppUsage[];
}

export interface DigitalLimit {
  appName: string;
  limitMinutes: number;
  isEnabled: boolean;
}

export interface SystemAlert {
  id: string;
  timestamp: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  appAffected?: string;
  isRead: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  insightType?: string; // Optional tags like Code, Alert, Strategy
}

export interface UserProfile {
  name: string;
  role: 'Estudante' | 'Profissional' | 'Empreendedor' | 'Outro';
  province: string; // Luanda, Benguela, Huambo, etc.
  dailyLimitMinutes: number;
  liteDataMode: boolean; // Angola specific feature
  addictionLevel: 'Baixo' | 'Moderado' | 'Crítico';
}

export interface AIInsight {
  title: string;
  description: string;
  category: 'foco' | 'saude' | 'economia' | 'alerta';
  recommendation: string;
}
