
export type SaaSCategory = string;

export type UserRole = 'Administrador' | 'Usuário';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  allowedApps?: string[]; // IDs dos sistemas que o usuário pode visualizar
  canViewStats?: boolean; // Permissão para ver o dashboard de estatísticas
  isActive?: boolean;
  primaryColor?: string;
}

export interface Category {
  name: string;
  isVisible: boolean;
  order: number;
}

export interface SaaSLink {
  id: string;
  name: string;
  url: string;
  description: string;
  category: SaaSCategory;
  icon: string; // Lucide icon name
  accentColor: string;
  isPinned: boolean;
  isActive: boolean; // Se o link de acesso está habilitado
  isVisibleToUsers: boolean; // Controle de visibilidade para usuários comuns
  imageUrl?: string; // Optional image data or URL
  lastAccessed?: string;
}

export interface PortalSettings {
  logoUrl: string;
  showLogo: boolean;
  brandColor: string;
  brandPalette: string[]; // Paleta completa de cores detectadas
  useBrandPalette: boolean;
}

export interface UserSettings {
  userName: string;
  companyName: string;
  theme: 'light' | 'dark';
}

export interface SystemUsageStats {
  systemId: string;
  systemName: string;
  totalClicks: number;
  lastAccess: Date;
  history: Date[]; // Array com todas as datas de clique
}

export interface UsageData {
  userId: string;
  userName: string;
  totalAccesses: number;
  lastAccess: Date;
  topSystemId: string;
  systemBreakdown: SystemUsageStats[]; // Detalhamento por sistema
  history: HistoryPoint[]; // Histórico de acessos por dia (para gráfico)
}

export interface HistoryPoint {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'alert' | 'success' | 'warning';
  created_at: string;
  is_global: boolean;
  target_user_id?: string | null;
  read?: boolean;
}

