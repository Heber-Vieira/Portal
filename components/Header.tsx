
import React from 'react';
import { IconRenderer } from './IconRenderer';
import { User } from '../types';
import { NotificationPopover, ProfilePopover } from './Popovers';

interface HeaderProps {
    isDarkMode: boolean;
    activeTab: 'all' | 'pinned';
    setActiveTab: (tab: 'all' | 'pinned') => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    isAdmin: boolean;
    setShowManageUsersModal: (show: boolean) => void;
    showStats: boolean;
    setShowStats: (show: boolean) => void;
    showNotifications: boolean;
    setShowNotifications: (show: boolean) => void;
    showProfilePopover: boolean;
    setShowProfilePopover: (show: boolean) => void;
    notificationsEnabled: boolean;
    notifications: any[];
    setNotifications: (notifications: any[]) => void;
    currentUser: User;
    handleLogout: () => void;
    setShowProfileModal: (show: boolean) => void;
    setShowSettingsModal: (show: boolean) => void;
    onLogoClick: () => void;
    onShowSendNotification: () => void;
    onNotificationClick: (notification: any) => void;
    onClearNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    isDarkMode,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    isAdmin,
    setShowManageUsersModal,
    showStats,
    setShowStats,
    showNotifications,
    setShowNotifications,
    showProfilePopover,
    setShowProfilePopover,
    notificationsEnabled,
    notifications,
    setNotifications,
    currentUser,
    handleLogout,
    setShowProfileModal,
    setShowSettingsModal,
    onLogoClick,
    onShowSendNotification,
    onNotificationClick,
    onClearNotifications
}) => {
    return (
        <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]/80 border-white/5' : 'bg-white/70 border-slate-100'}`}>
            <div className="max-w-[1800px] mx-auto px-4 h-12 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 group cursor-pointer" onClick={onLogoClick}>
                        <div
                            className="w-7 h-7 rounded flex items-center justify-center text-white transition-transform group-hover:scale-105 border border-white/10 bg-primary"
                        >
                            <IconRenderer name="Layers" className="w-3.5 h-3.5" />
                        </div>
                        <h1 className="text-xs font-black tracking-tighter uppercase">Nexus<span className="text-blue-500">Pro</span></h1>
                    </div>

                    {!showStats && (
                        <nav className={`hidden lg:flex items-center rounded p-0.5 transition-colors ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
                            <button onClick={() => setActiveTab('all')} className={`px-3 py-1 rounded text-[8px] font-black uppercase tracking-widest transition-all ${activeTab === 'all' ? (isDarkMode ? 'bg-white text-slate-900' : 'bg-white text-slate-900 shadow-sm') : 'text-slate-400 hover:text-slate-300'}`}>Todos</button>
                            <button onClick={() => setActiveTab('pinned')} className={`px-3 py-1 rounded text-[8px] font-black uppercase tracking-widest transition-all ${activeTab === 'pinned' ? (isDarkMode ? 'bg-white text-slate-900' : 'bg-white text-slate-900 shadow-sm') : 'text-slate-400 hover:text-slate-300'}`}>Favoritos</button>
                        </nav>
                    )}
                </div>

                <div className="flex-1 max-w-sm hidden md:block">
                    <div className="relative">
                        <IconRenderer name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Busca rápida..."
                            className={`w-full rounded py-1 pl-8 pr-3 text-[10px] font-bold outline-none transition-all ${isDarkMode ? 'bg-white/5 border-white/10 focus:bg-white/10 focus:border-white/20 text-white' : 'bg-slate-50 border-slate-100 focus:bg-white focus:border-slate-900'}`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-1">
                    {isAdmin && (
                        <>
                            <button onClick={onShowSendNotification} className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors" title="Enviar Comunicado">
                                <IconRenderer name="Megaphone" className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setShowManageUsersModal(true)} className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors" title="Gerenciar Usuários">
                                <IconRenderer name="User" className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => setShowStats(!showStats)}
                                className={`p-1.5 rounded transition-colors ${showStats ? 'text-white bg-primary' : 'text-slate-400 hover:text-slate-300'}`}
                            >
                                <IconRenderer name="BarChart3" className="w-3.5 h-3.5" />
                            </button>
                        </>
                    )}
                    <button onClick={() => setShowNotifications(!showNotifications)} className="p-1.5 text-slate-400 hover:text-slate-300 relative">
                        <IconRenderer name="Bell" className="w-3.5 h-3.5" />
                        {notificationsEnabled && notifications.length > 0 && <span className="absolute top-1.5 right-1.5 w-1 h-1 bg-red-500 rounded-full shadow-sm shadow-red-500/50"></span>}
                    </button>
                    <button onClick={() => setShowProfilePopover(!showProfilePopover)} className="w-7 h-7 rounded bg-white text-slate-900 flex items-center justify-center font-black text-[8px] border border-slate-200 overflow-hidden shadow-sm">
                        <img src={currentUser.avatarUrl} className="w-full h-full object-cover" alt="" />
                    </button>
                    <NotificationPopover isOpen={showNotifications} notifications={notifications} onClear={onClearNotifications} onClose={() => setShowNotifications(false)} isDarkMode={isDarkMode} onSelect={onNotificationClick} />
                    <ProfilePopover
                        isOpen={showProfilePopover}
                        onClose={() => setShowProfilePopover(false)}
                        onOpenProfile={() => setShowProfileModal(true)}
                        onOpenSettings={() => setShowSettingsModal(true)}
                        currentUser={currentUser}
                        onLogout={handleLogout}
                        isDarkMode={isDarkMode}
                    />
                </div>
            </div>
        </header>
    );
};
