
import React, { useState, useMemo, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { SaaSLink, User, Category, UsageData, Notification } from './types';
import { translateError } from './utils/errorTranslations';
import { INITIAL_SAAS_LINKS, CATEGORIES, TEST_USERS } from './constants';
import { SaaSCard } from './components/SaaSCard';
import { SaaSModal } from './components/SaaSModal';
import { ManageCategoriesModal } from './components/ManageCategoriesModal';
import { ManageUsersModal } from './components/ManageUsersModal';
import { ConfirmModal } from './components/ConfirmModal';
import { MessageModal } from './components/MessageModal';
import { SendNotificationModal } from './components/SendNotificationModal';
import { StatsDashboard } from './components/StatsDashboard';
import {
  ProfileModal,
  SettingsModal
} from './components/UtilityModals';
import { HelpCenter } from './components/HelpCenter';
import { CookieConsent } from './components/CookieConsent';
import { IconRenderer } from './components/IconRenderer';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ActionBar } from './components/ActionBar';
import { Login } from './components/Login';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [links, setLinks] = useState<SaaSLink[]>(INITIAL_SAAS_LINKS);
  const [categories, setCategories] = useState<Category[]>(
    CATEGORIES.map((name, index) => ({ name, isVisible: true, order: index }))
  );
  const [users, setUsers] = useState<User[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tudo');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  // Settings States
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDenseGrid, setIsDenseGrid] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Mapear usuário do Supabase para o modelo interno
  const [currentUser, setCurrentUser] = useState<User>({
    id: '',
    name: 'Carregando...',
    email: '',
    role: 'Usuário',
    isActive: true,
    avatarUrl: '',
    allowedApps: []
  });
  const isAdmin = currentUser.role === 'Administrador';

  useEffect(() => {
    // 1. Verificar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAuthChecking(false);
    });

    // 2. Ouvir mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        setIsLoggedOut(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 3. Carregar dados sempre que a sessão mudar
  useEffect(() => {
    if (!session?.user) return;

    const fetchAllData = async () => {
      const userId = session.user.id;

      // Carregar Perfil
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      if (profile) {
        const userObj: User = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role as any,
          avatarUrl: profile.avatar_url,
          isActive: profile.is_active,
          allowedApps: profile.allowed_apps || [],
          primaryColor: profile.primary_color || '#0f172a'
        };
        setCurrentUser(userObj);
        if (profile.is_dark_mode !== undefined) setIsDarkMode(profile.is_dark_mode);
        if (profile.is_dense_grid !== undefined) setIsDenseGrid(profile.is_dense_grid);
        if (profile.notifications_enabled !== undefined) setNotificationsEnabled(profile.notifications_enabled);

        // Se for admin, carregar todos os usuários
        if (profile.role === 'Administrador') {
          const { data: allUsers } = await supabase.from('profiles').select('*').order('name');
          if (allUsers) {
            setUsers(allUsers.map(u => ({
              id: u.id,
              name: u.name,
              email: u.email,
              role: u.role as any,
              avatarUrl: u.avatar_url,
              isActive: u.is_active,
              allowedApps: u.allowed_apps || [],
              primaryColor: u.primary_color || '#0f172a'
            })));
          }
        }
      }

      // Carregar Categorias
      const { data: catData } = await supabase.from('categories').select('*').order('order', { ascending: true });
      if (catData) setCategories(catData.map(c => ({
        name: c.name,
        isVisible: c.is_visible,
        order: c.order || 0
      })));

      // Carregar Links
      const { data: linkData } = await supabase.from('saas_links').select('*').order('name');

      // Carregar Favoritos do Usuário
      let favoriteIds = new Set<string>();
      if (session?.user?.id) {
        const { data: favs } = await supabase.from('user_favorites').select('link_id').eq('user_id', session.user.id);
        if (favs) favs.forEach((f: any) => favoriteIds.add(f.link_id));
      }

      if (linkData) setLinks(linkData.map(l => ({
        id: l.id,
        name: l.name,
        url: l.url,
        description: l.description,
        category: l.category_name,
        icon: l.icon as any,
        accentColor: l.accent_color,
        isPinned: favoriteIds.has(l.id), // User preference
        isActive: l.is_active,
        isVisibleToUsers: l.is_visible_to_users
      })));

      const { data: notifs } = await supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(10);
      if (notifs) {
        setNotifications(notifs.map((n: any) => ({ ...n, time: new Date(n.created_at).toLocaleDateString() })));
      }
    };

    fetchAllData();
  }, [session]);

  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingSaaS, setEditingSaaS] = useState<SaaSLink | null>(null);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showManageUsersModal, setShowManageUsersModal] = useState(false);
  const [deletingItem, setDeletingItem] = useState<{ id: string, type: 'saas' | 'category' | 'user' } | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pinned'>('all');
  const [showStats, setShowStats] = useState(false);

  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfilePopover, setShowProfilePopover] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [messageModal, setMessageModal] = useState<{ isOpen: boolean, title: string, message: string, type?: 'warning' | 'info' | 'error' }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning'
  });

  const showMessage = (message: string, title: string = 'Atenção', type: 'warning' | 'info' | 'error' = 'warning') => {
    setMessageModal({ isOpen: true, title, message, type });
  };

  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showSendNotificationModal, setShowSendNotificationModal] = useState(false);

  const currentYear = new Date().getFullYear();

  // Apply Global Theme Settings
  useEffect(() => {
    // Apply Dark Mode
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      document.documentElement.style.setProperty('--bg-main', '#0f172a');
      document.documentElement.style.setProperty('--text-main', '#f8fafc');
    } else {
      document.body.classList.remove('dark-theme');
      document.documentElement.style.setProperty('--bg-main', '#fcfdfe');
      document.documentElement.style.setProperty('--text-main', '#0f172a');
    }

    // Apply Primary Color
    const primaryColor = currentUser.primaryColor || '#0f172a';
    document.documentElement.style.setProperty('--primary-color', primaryColor);

    // Generate sub-colors (hover states, etc)
    document.documentElement.style.setProperty('--primary-color-hover', primaryColor + 'ee');
  }, [isDarkMode, currentUser.primaryColor]);

  const handleTogglePin = async (id: string) => {
    const link = links.find(l => l.id === id);
    if (!link || !session?.user) return;

    const newPinState = !link.isPinned;
    setLinks(prev => prev.map(l => l.id === id ? { ...l, isPinned: newPinState } : l));

    if (newPinState) {
      await supabase.from('user_favorites').insert({ user_id: session.user.id, link_id: id });
    } else {
      await supabase.from('user_favorites').delete().eq('user_id', session.user.id).eq('link_id', id);
    }
  };

  const handleEditSaaS = (saas: SaaSLink) => {
    setEditingSaaS(saas);
    setShowAddEditModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    if (deletingItem.type === 'saas') {
      setLinks(prev => prev.filter(l => l.id !== deletingItem.id));
      await supabase.from('saas_links').delete().eq('id', deletingItem.id);
    } else if (deletingItem.type === 'category') {
      const categoryToRemove = deletingItem.id;
      setLinks(prev => prev.map(l => l.category === categoryToRemove ? { ...l, category: 'Outros' } : l));
      setCategories(prev => prev.filter(c => c.name !== categoryToRemove));
      await supabase.from('categories').delete().eq('name', categoryToRemove);
    } else if (deletingItem.type === 'user') {
      setUsers(prev => prev.filter(u => u.id !== deletingItem.id));
      await supabase.from('profiles').delete().eq('id', deletingItem.id);
    }
    setDeletingItem(null);
  };

  const handleSendNotification = async (data: any) => {
    const dbData = {
      title: data.title,
      message: data.message,
      type: data.type,
      target_user_id: data.targetUserId,
      is_global: !data.targetUserId
    };
    const { error } = await supabase.from('notifications').insert(dbData);
    if (error) {
      showMessage('Erro ao enviar comunicado: ' + error.message, 'Erro', 'error');
    } else {
      showMessage('Comunicado enviado com sucesso.', 'Sucesso', 'info');
      const { data: notifs } = await supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(10);
      if (notifs) {
        setNotifications(notifs.map((n: any) => ({ ...n, time: new Date(n.created_at).toLocaleDateString() })));
      }
    }
    setShowSendNotificationModal(false);
  };

  const handleSaveSaaS = async (saas: SaaSLink) => {
    const dbData = {
      name: saas.name,
      url: saas.url,
      description: saas.description,
      category_name: saas.category,
      icon: saas.icon,
      accent_color: saas.accentColor,
      // is_pinned removed from global sync
      is_active: saas.isActive,
      is_visible_to_users: saas.isVisibleToUsers
    };

    if (editingSaaS) {
      setLinks(prev => prev.map(l => l.id === saas.id ? saas : l));
      await supabase.from('saas_links').update(dbData).eq('id', saas.id);
    } else {
      const { data } = await supabase.from('saas_links').insert(dbData).select().single();
      if (data) setLinks(prev => [...prev, { ...saas, id: data.id }]);
    }
    setShowAddEditModal(false);
    setEditingSaaS(null);
  };

  const handleRenameCategory = async (oldName: string, newName: string) => {
    const trimmedNewName = newName.trim();
    if (oldName === 'Outros' || !trimmedNewName) return;

    // Check for duplicates
    if (categories.some(c => c.name.toLowerCase() === trimmedNewName.toLowerCase() && c.name !== oldName)) {
      showMessage('Esta categoria já existe.', 'Duplicidade', 'warning');
      return;
    }

    setCategories(prev => prev.map(c => c.name === oldName ? { ...c, name: trimmedNewName } : c));
    setLinks(prev => prev.map(l => l.category === oldName ? { ...l, category: trimmedNewName } : l));
    if (selectedCategory === oldName) setSelectedCategory(trimmedNewName);

    await supabase.from('categories').update({ name: trimmedNewName }).eq('name', oldName);
    await supabase.from('saas_links').update({ category_name: trimmedNewName }).eq('category_name', oldName);
  };


  const handleAddCategory = async (name: string) => {
    const trimmedName = name.trim();
    if (categories.some(c => c.name.toLowerCase() === trimmedName.toLowerCase())) {
      showMessage('Esta categoria já existe.', 'Duplicidade', 'warning');
      return;
    }
    const newCat = { name: trimmedName, isVisible: true, order: 0 };
    setCategories(prev => [...prev, newCat]);
    await supabase.from('categories').insert({ name: trimmedName, is_visible: true, order: 0 });
  };

  const handleToggleCategoryVisibility = async (name: string) => {
    const cat = categories.find(c => c.name === name);
    if (!cat) return;
    const newVisibility = !cat.isVisible;
    setCategories(prev => prev.map(c => c.name === name ? { ...c, isVisible: newVisibility } : c));
    await supabase.from('categories').update({ is_visible: newVisibility }).eq('name', name);
  };

  const handleAddUser = async (user: User, password?: string) => {
    try {
      if (password) {
        // Criar um cliente temporário para não afetar a sessão atual do administrador
        // Isso evita que o signUp faça login automático e derrube a sessão do admin
        const tempSupabase = createClient(
          import.meta.env.VITE_SUPABASE_URL,
          import.meta.env.VITE_SUPABASE_ANON_KEY,
          {
            auth: {
              persistSession: false,
              autoRefreshToken: false,
              detectSessionInUrl: false
            }
          }
        );

        // Criar usuário no Supabase Auth usando o cliente temporário
        const { data, error } = await tempSupabase.auth.signUp({
          email: user.email,
          password: password,
          options: {
            data: {
              full_name: user.name,
              role: user.role,
              allowed_apps: user.allowedApps,
              avatar_url: user.avatarUrl,
              primary_color: user.primaryColor
            }
          }
        });
        if (error) throw error;

        // Se o usuário foi criado com sucesso, atualizar o ID local com o UUID do Supabase
        if (data.user) {
          const newUser = { ...user, id: data.user.id };

          // Atualização explícita no perfil para garantir que campos extras (foto, cor) sejam salvos
          // já que triggers as vezes só pegam o básico do metadata
          await supabase.from('profiles').update({
            avatar_url: user.avatarUrl,
            primary_color: user.primaryColor
          }).eq('id', data.user.id);

          setUsers(prev => [...prev.filter(u => u.id !== user.id), newUser]);
          showMessage(`Solicitação de criação enviada para ${user.email}. O usuário deve confirmar o e-mail.`, 'Conta Criada', 'info');
          return;
        }
      }

      // Fallback para atualização local caso não entre no bloco auth
      setUsers(prev => [...prev, user]);
    } catch (err: any) {
      showMessage('Erro ao criar usuário: ' + translateError(err), 'Erro', 'error');
    }
  };

  const handleUpdateUser = async (user: User, password?: string) => {
    try {
      // 1. Atualizar perfil no banco de dados
      const { data: updatedData, error: profileError } = await supabase.from('profiles').update({
        name: user.name,
        role: user.role,
        is_active: user.isActive,
        avatar_url: user.avatarUrl,
        allowed_apps: user.allowedApps,
        primary_color: user.primaryColor
      }).eq('id', user.id).select();

      if (profileError) throw profileError;
      if (!updatedData || updatedData.length === 0) throw new Error('Falha ao atualizar: Registro não encontrado ou permissão negada.');

      // 2. Se houver nova senha, enviar e-mail de redefinição
      // Nota: O client SDK não permite mudar senha de outro usuário diretamente sem Admin API.
      // A melhor prática client-side é disparar o fluxo de recuperação.
      if (password) {
        const { error: authError } = await supabase.auth.resetPasswordForEmail(user.email, {
          redirectTo: window.location.origin
        });
        if (authError) throw authError;
        showMessage(`Um e-mail de redefinição de senha foi enviado para ${user.email}.`, 'Segurança', 'info');
      }

      // 3. Atualizar estado local
      setUsers(prev => prev.map(u => u.id === user.id ? user : u));
      if (user.id === currentUser.id) {
        setCurrentUser(user);
      }
    } catch (err: any) {
      console.error('Erro detalhado:', err);
      showMessage('Erro ao atualizar usuário: ' + translateError(err), 'Erro', 'error');
    }
  };

  const handleLogout = async () => {
    setIsLoggedOut(true);
    await supabase.auth.signOut();
    setTimeout(() => window.location.reload(), 1500);
  };

  const handleTrackAccess = async (id: string) => {
    const link = links.find(l => l.id === id);
    if (!link) return;
    const now = new Date();

    if (session?.user?.id) {
      await supabase.from('usage_logs').insert({
        user_id: session.user.id,
        link_id: id
      });
    }

    // Otimistic update for current user
    setUsageData(prev => {
      const userStat = prev.find(u => u.userId === currentUser.id) || {
        userId: currentUser.id, userName: currentUser.name, totalAccesses: 0, lastAccess: now, topSystemId: id, systemBreakdown: [], history: []
      };

      const systemStat = userStat.systemBreakdown.find(s => s.systemId === id) || {
        systemId: id, systemName: link.name, totalClicks: 0, lastAccess: now, history: []
      };

      systemStat.totalClicks += 1;
      systemStat.lastAccess = now;
      if (!systemStat.history) systemStat.history = [];
      systemStat.history.push(now);

      userStat.totalAccesses += 1;
      userStat.lastAccess = now;

      // Update history for today
      const todayStr = now.toISOString().split('T')[0];
      const historyPoint = userStat.history?.find(h => h.date === todayStr);
      if (historyPoint) {
        historyPoint.count += 1;
      } else {
        if (!userStat.history) userStat.history = [];
        userStat.history.push({ date: todayStr, count: 1 });
      }

      userStat.systemBreakdown = userStat.systemBreakdown.some(s => s.systemId === id)
        ? userStat.systemBreakdown.map(s => s.systemId === id ? systemStat : s)
        : [...userStat.systemBreakdown, systemStat];

      return prev.some(u => u.userId === currentUser.id)
        ? prev.map(u => u.userId === currentUser.id ? userStat : u)
        : [...prev, userStat];
    });
  };

  // Fetch initial analytics data (last 30 days)
  useEffect(() => {
    if (!isAdmin || !session) return;

    const fetchAnalytics = async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: logs, error } = await supabase
        .from('usage_logs')
        .select('created_at, user_id, link_id, profiles(name)')
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (error || !logs) return;

      const userMap = new Map<string, UsageData>();

      logs.forEach(log => {
        const userId = log.user_id;
        const linkId = log.link_id;
        const date = new Date(log.created_at);
        const dateStr = date.toISOString().split('T')[0];
        const profileData = log.profiles as any;
        const userName = (Array.isArray(profileData) ? profileData[0]?.name : profileData?.name) || 'Usuário Desconhecido';
        const linkName = links.find(l => l.id === linkId)?.name || 'Sistema';

        if (!userMap.has(userId)) {
          userMap.set(userId, {
            userId,
            userName,
            totalAccesses: 0,
            lastAccess: date,
            topSystemId: '',
            systemBreakdown: [],
            history: []
          });
        }

        const userStat = userMap.get(userId)!;
        userStat.totalAccesses++;
        if (date > userStat.lastAccess) userStat.lastAccess = date;

        // Update system stats
        let sysStat = userStat.systemBreakdown.find(s => s.systemId === linkId);
        if (!sysStat) {
          sysStat = { systemId: linkId, systemName: linkName, totalClicks: 0, lastAccess: date, history: [] };
          userStat.systemBreakdown.push(sysStat);
        }
        sysStat.totalClicks++;
        if (date > sysStat.lastAccess) sysStat.lastAccess = date;
        sysStat.history.push(date);

        // Update history
        let historyPoint = userStat.history.find(h => h.date === dateStr);
        if (!historyPoint) {
          historyPoint = { date: dateStr, count: 0 };
          userStat.history.push(historyPoint);
        }
        historyPoint.count++;
      });

      // Sort history dates
      userMap.forEach(user => {
        user.history.sort((a, b) => a.date.localeCompare(b.date));
      });

      setUsageData(Array.from(userMap.values()));
    };

    fetchAnalytics();
  }, [isAdmin, session, links]);

  const filteredLinks = useMemo(() => {
    return links
      .filter(link => {
        const matchesSearch = link.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          link.category.toLowerCase().includes(searchTerm.toLowerCase());
        const categoryMatch = selectedCategory === 'Tudo' || link.category === selectedCategory;
        const matchesTab = activeTab === 'all' || (activeTab === 'pinned' && link.isPinned);

        // Visibilidade por usuário individual
        const visibilityMatch = isAdmin || (currentUser.allowedApps?.includes(link.id));

        return matchesSearch && categoryMatch && matchesTab && visibilityMatch;
      })
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return a.name.localeCompare(b.name, 'pt', { sensitivity: 'base' });
      });
  }, [links, searchTerm, selectedCategory, activeTab, isAdmin, currentUser.allowedApps]);

  const activeCategories = useMemo(() => {
    const counts: Record<string, number> = {};
    links.forEach(l => {
      if (isAdmin || currentUser.allowedApps?.includes(l.id)) {
        counts[l.category] = (counts[l.category] || 0) + 1;
      }
    });

    const otherCats = categories
      .filter(c => c.isVisible && (counts[c.name] || isAdmin))
      .sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA === 'OUTROS' || nameA === 'OUTRO' || nameA === 'OUTRAS') return 1;
        if (nameB === 'OUTROS' || nameB === 'OUTRO' || nameB === 'OUTRAS') return -1;
        return nameA.localeCompare(nameB, 'pt', { sensitivity: 'base' });
      })
      .map(c => c.name);

    return ['Tudo', ...otherCats];
  }, [links, categories, isAdmin, currentUser.allowedApps]);


  const handleSaveCategories = async (updatedCategories: Category[]) => {
    try {
      const dbData = updatedCategories.map(cat => ({
        name: cat.name,
        is_visible: cat.isVisible
      }));

      const { error } = await supabase.from('categories').upsert(dbData, { onConflict: 'name' });

      if (error) throw error;
      setCategories(updatedCategories);
    } catch (err: any) {
      showMessage('Erro ao salvar categorias: ' + translateError(err), 'Erro Crítico', 'error');
    }
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">Iniciando NexusPro...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Login onLoginSuccess={(user) => setSession({ user })} onShowMessage={showMessage} />;
  }

  if (isLoggedOut) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <IconRenderer name="X" className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-widest">Sessão Encerrada</h2>
          <p className="text-slate-400 text-[10px] mt-2 uppercase tracking-[0.4em]">NexusPro</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col ${isDarkMode ? 'bg-[#0f172a] text-white' : 'bg-[#fcfdfe] text-[#0f172a]'}`}>
      <Header
        isDarkMode={isDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isAdmin={isAdmin}
        setShowManageUsersModal={setShowManageUsersModal}
        showStats={showStats}
        setShowStats={setShowStats}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        showProfilePopover={showProfilePopover}
        setShowProfilePopover={setShowProfilePopover}
        notificationsEnabled={notificationsEnabled}
        notifications={notifications}
        setNotifications={setNotifications}
        currentUser={currentUser}
        handleLogout={handleLogout}
        setShowProfileModal={setShowProfileModal}
        setShowSettingsModal={setShowSettingsModal}
        onLogoClick={() => { setShowStats(false); setSelectedCategory('Tudo'); }}
        onShowSendNotification={() => setShowSendNotificationModal(true)}
      />

      <main className="max-w-[1800px] mx-auto px-4 py-6 flex-1 w-full text-inherit">
        {showStats && isAdmin ? (
          <StatsDashboard data={usageData} totalSystems={links.length} totalUsers={users.length} links={links} />
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-baseline space-x-3">
                <h2 className="text-xl font-black tracking-tighter uppercase">{selectedCategory}</h2>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{filteredLinks.length} ativos</span>
              </div>

              <div className="flex items-center space-x-2">
                <div className={`flex items-center space-x-1 p-0.5 rounded-lg border overflow-x-auto no-scrollbar transition-colors ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                  {activeCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-tight transition-all whitespace-nowrap ${selectedCategory === cat
                        ? (isDarkMode ? 'bg-white text-slate-900' : 'bg-white text-[#0f172a] shadow-sm')
                        : 'text-slate-400 hover:text-slate-300'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                {isAdmin && (
                  <button
                    onClick={() => setShowCategoriesModal(true)}
                    className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'bg-white/5 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    title="Gerenciar Categorias"
                  >
                    <IconRenderer name="Settings" className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {isAdmin && (
                <button
                  onClick={() => { setEditingSaaS(null); setShowAddEditModal(true); }}
                  className={`px-4 py-2 text-white font-black text-[9px] uppercase tracking-widest rounded transition-all flex items-center space-x-2 active:scale-95 shadow-lg bg-primary ${isDarkMode ? 'opacity-90 shadow-blue-600/10' : 'shadow-black/10 hover:opacity-95'}`}
                >
                  <IconRenderer name="Plus" className="w-3 h-3" />
                  <span>Novo</span>
                </button>
              )}
            </div>

            {filteredLinks.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-3 animate-in fade-in duration-300">
                {filteredLinks.map(saas => (
                  <div key={saas.id} className={`transition-all duration-300 ${isDenseGrid ? 'w-full sm:w-[220px] lg:w-[240px]' : 'w-full sm:w-[320px] lg:w-[350px]'}`}>
                    <SaaSCard
                      saas={saas}
                      onDelete={(id) => setDeletingItem({ id, type: 'saas' })}
                      onTogglePin={handleTogglePin}
                      onEdit={handleEditSaaS}
                      onAccess={handleTrackAccess}
                      isAdmin={isAdmin}
                      isDense={isDenseGrid}
                      isDarkMode={isDarkMode}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center opacity-30">
                <IconRenderer name="Search" className="w-8 h-8 mx-auto mb-2" />
                <p className="text-[10px] font-black uppercase tracking-widest">Sem ativos para exibir</p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer currentYear={currentYear} isDarkMode={isDarkMode} />

      <ActionBar
        setShowHelpCenter={setShowHelpCenter}
      />

      <CookieConsent />

      <SaaSModal isOpen={showAddEditModal} onClose={() => { setShowAddEditModal(false); setEditingSaaS(null); }} onSave={handleSaveSaaS} initialData={editingSaaS} categories={categories.map(c => c.name)} />
      <ManageCategoriesModal
        isOpen={showCategoriesModal}
        onClose={() => setShowCategoriesModal(false)}
        categories={categories}
        onAdd={handleAddCategory}
        onRemove={(name) => setDeletingItem({ id: name, type: 'category' })}
        onRename={handleRenameCategory}
        onToggleVisibility={handleToggleCategoryVisibility}
        onSave={handleSaveCategories}
        onShowMessage={showMessage}
      />
      <ManageUsersModal isOpen={showManageUsersModal} onClose={() => setShowManageUsersModal(false)} users={users} apps={links} onAdd={handleAddUser} onUpdate={handleUpdateUser} onRemove={(id) => setDeletingItem({ id, type: 'user' })} currentUserId={currentUser.id} onShowMessage={showMessage} />
      <ConfirmModal isOpen={!!deletingItem} onClose={() => setDeletingItem(null)} onConfirm={confirmDelete} title="Excluir" message={deletingItem?.type === 'saas' ? "Remover este ativo permanentemente?" : deletingItem?.type === 'category' ? `Remover a categoria "${deletingItem?.id}"? Os sistemas serão movidos para "Outros".` : "Remover este usuário permanentemente?"} />
      <HelpCenter isOpen={showHelpCenter} onClose={() => setShowHelpCenter(false)} isDarkMode={isDarkMode} links={links} />
      <MessageModal
        isOpen={messageModal.isOpen}
        onClose={() => setMessageModal(prev => ({ ...prev, isOpen: false }))}
        title={messageModal.title}
        message={messageModal.message}
        type={messageModal.type}
      />
      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} currentUser={currentUser} onUpdateUser={handleUpdateUser} onShowMessage={showMessage} />
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        isDarkMode={isDarkMode}
        setIsDarkMode={async (val) => {
          setIsDarkMode(val);
          if (session?.user?.id) await supabase.from('profiles').update({ is_dark_mode: val }).eq('id', session.user.id);
        }}
        isDenseGrid={isDenseGrid}
        setIsDenseGrid={async (val) => {
          setIsDenseGrid(val);
          if (session?.user?.id) await supabase.from('profiles').update({ is_dense_grid: val }).eq('id', session.user.id);
        }}
        notificationsEnabled={notificationsEnabled}
        setNotificationsEnabled={async (val) => {
          setNotificationsEnabled(val);
          if (session?.user?.id) await supabase.from('profiles').update({ notifications_enabled: val }).eq('id', session.user.id);
        }}
      />
      <SendNotificationModal
        isOpen={showSendNotificationModal}
        onClose={() => setShowSendNotificationModal(false)}
        onSend={handleSendNotification}
        users={users}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default App;
