
import React from 'react';
import {
  // Original & General Actions
  Wrench, GitBranch, Package, BarChart3, Calendar, Settings, Activity, Layers, Database, Shield,
  Cpu, Zap, Globe, Truck, FileText, Plus, Search, ExternalLink, Pin, MoreVertical, Trash2, Edit2,
  LayoutGrid, List, Menu, Bell, User, Building2, X, Filter, LifeBuoy, BookOpen, HeartPulse, Clock,
  Send, ChevronRight, Check, HelpCircle,

  // New Industrial & Tech
  Hammer, Cog, Factory, HardDrive, Server, Binary, Cloud, Code, Terminal, Monitor, Smartphone, Wifi,

  // New Business & Finance
  Briefcase, ShoppingCart, ShoppingBag, CreditCard, Wallet, Receipt, Compass,

  // New Data & Analysis
  PieChart, TrendingUp, LineChart, Clipboard,

  // New Communication & Actions
  Mail, MessageSquare, Phone, Share2, Users, UserPlus, Link, Hash,

  // New Utilities & Apps
  Target, Flag, Star, Bookmark, Image, Video, Music, Camera, Eye, PenTool, Palette, Maximize, Minimize,

  // New Health & Safety
  Stethoscope, Syringe, FlaskConical, Dna, ShieldAlert, Flame,

  // New Maintenance & Construction
  Construction, HardHat, Drill, PlugZap, PencilRuler, ThermometerSnowflake, Droplets, Cylinder, Key, ScanSearch, Lock, EyeOff
} from 'lucide-react';

const icons: Record<string, React.FC<any>> = {
  Wrench, GitBranch, Package, BarChart3, Calendar, Settings, Activity, Layers, Database, Shield,
  Cpu, Zap, Globe, Truck, FileText, Plus, Search, ExternalLink, Pin, MoreVertical, Trash2, Edit2,
  LayoutGrid, List, Menu, Bell, User, Building2, X, Filter, LifeBuoy, BookOpen, HeartPulse, Clock,
  Send, ChevronRight, Check, HelpCircle,
  Hammer, Cog, Factory, HardDrive, Server, Binary, Cloud, Code, Terminal, Monitor, Smartphone, Wifi,
  Briefcase, ShoppingCart, ShoppingBag, CreditCard, Wallet, Receipt, Compass,
  PieChart, TrendingUp, LineChart, Clipboard,
  Mail, MessageSquare, Phone, Share2, Users, UserPlus, Link, Hash,
  Target, Flag, Star, Bookmark, Image, Video, Music, Camera, Eye, PenTool, Palette, Maximize, Minimize,
  Stethoscope, Syringe, FlaskConical, Dna, ShieldAlert, Flame,
  Construction, HardHat, Drill, PlugZap, PencilRuler, ThermometerSnowflake, Droplets, Cylinder, Key, ScanSearch, Lock, EyeOff
};

interface IconRendererProps {
  name: string;
  className?: string;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ name, className }) => {
  const IconComponent = icons[name] || icons['HelpCircle'];
  return <IconComponent className={className} />;
};
