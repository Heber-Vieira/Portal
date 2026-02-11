
import React from 'react';
import {
  Wrench, GitBranch, Package, BarChart3, Calendar,
  Settings, Activity, Layers, Database, Shield,
  Cpu, Zap, Globe, Truck, FileText, Plus, Search,
  ExternalLink, Pin, MoreVertical, Trash2, Edit2,
  LayoutGrid, List, Menu, Bell, User, Building2,
  X, Filter, LifeBuoy, BookOpen, HeartPulse, Clock, Send, ChevronRight, Check, HelpCircle
} from 'lucide-react';

const icons: Record<string, React.FC<any>> = {
  Wrench, GitBranch, Package, BarChart3, Calendar,
  Settings, Activity, Layers, Database, Shield,
  Cpu, Zap, Globe, Truck, FileText, Plus, Search,
  ExternalLink, Pin, MoreVertical, Trash2, Edit2,
  LayoutGrid, List, Menu, Bell, User, Building2,
  X, Filter, LifeBuoy, BookOpen, HeartPulse, Clock, Send, ChevronRight, Check, HelpCircle
};

interface IconRendererProps {
  name: string;
  className?: string;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ name, className }) => {
  const IconComponent = icons[name] || icons['HelpCircle'];
  return <IconComponent className={className} />;
};
