
import { SaaSLink, User } from './types';

export const INITIAL_SAAS_LINKS: SaaSLink[] = [
  {
    id: '2',
    name: 'FlowMaster BPM',
    url: 'https://example.com/flowmaster',
    description: 'Modelagem e automação de processos industriais ponta a ponta.',
    category: 'Processos',
    icon: 'GitBranch',
    accentColor: '#10b981',
    isPinned: true,
    isActive: true,
    isVisibleToUsers: true
  },
  {
    id: '1',
    name: 'MaintePro ERP',
    url: 'https://example.com/maintepro',
    description: 'Sistema completo de gestão de manutenção preditiva e corretiva.',
    category: 'Manutenção',
    icon: 'Wrench',
    accentColor: '#3b82f6',
    isPinned: true,
    isActive: true,
    isVisibleToUsers: true
  },
  {
    id: '4',
    name: 'InsightPanel',
    url: 'https://example.com/insight',
    description: 'Dashboard de BI para análise de KPIs industriais em tempo real.',
    category: 'Análise',
    icon: 'BarChart3',
    accentColor: '#8b5cf6',
    isPinned: false,
    isActive: true,
    isVisibleToUsers: true
  },
  {
    id: '5',
    name: 'PlantPlanner',
    url: 'https://example.com/planner',
    description: 'Agendamento e planejamento de turnos e paradas de fábrica.',
    category: 'Planejamento',
    icon: 'Calendar',
    accentColor: '#ef4444',
    isPinned: false,
    isActive: false,
    isVisibleToUsers: false
  },
  {
    id: '3',
    name: 'StockSense',
    url: 'https://example.com/stocksense',
    description: 'Controle inteligente de estoque e insumos de produção.',
    category: 'Estoque',
    icon: 'Package',
    accentColor: '#f59e0b',
    isPinned: false,
    isActive: true,
    isVisibleToUsers: true
  }
];

export const TEST_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'Admin Nexus',
    email: 'admin@nexus.pro',
    role: 'Administrador',
    canViewStats: true,
    isActive: true,
    avatarUrl: 'https://i.pravatar.cc/150?u=admin',
    allowedApps: ['1', '2', '3', '4', '5']
  },
  {
    id: 'user-standard',
    name: 'Operador Padrão',
    email: 'operador@nexus.pro',
    role: 'Usuário',
    canViewStats: false,
    isActive: true,
    avatarUrl: 'https://i.pravatar.cc/150?u=standard',
    allowedApps: ['1', '2', '3']
  },
  {
    id: 'user-heber',
    name: 'Heber Vieira',
    email: 'heber.vieira.hv@gmail.com',
    role: 'Administrador',
    canViewStats: true,
    isActive: true,
    avatarUrl: 'https://i.pravatar.cc/150?u=heber',
    allowedApps: ['1', '2', '3', '4', '5']
  }
];

export const CATEGORIES = [
  'Manutenção',
  'Processos',
  'Estoque',
  'Análise',
  'Planejamento',
  'Outros'
];

export const ICON_OPTIONS = [
  'Wrench', 'GitBranch', 'Package', 'BarChart3', 'Calendar',
  'Settings', 'Activity', 'Layers', 'Database', 'Shield',
  'Cpu', 'Zap', 'Globe', 'Truck', 'FileText'
];
