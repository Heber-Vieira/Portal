
import React from 'react';
import { IconRenderer } from './IconRenderer';
import { User } from '../types';

export const NotificationPopover: React.FC<{
    isOpen: boolean;
    notifications: any[];
    onClear: () => void;
    onClose: () => void;
    isDarkMode?: boolean;
    onSelect?: (notification: any) => void;
}> = ({ isOpen, notifications, onClear, onClose, isDarkMode, onSelect }) => {
    if (!isOpen) return null;
    return (
        <div className={`absolute top-14 right-0 w-80 border shadow-2xl rounded-[2.5rem] z-[50] overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right ${isDarkMode ? 'bg-[#1e293b] border-white/10 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
            <div className="p-6 border-b border-slate-500/10 flex justify-between items-center">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">Notificações</h3>
                <div className="flex items-center space-x-3">
                    {notifications.length > 0 && <button onClick={onClear} className="text-[10px] font-black text-blue-500 hover:opacity-80 uppercase tracking-wider">Limpar</button>}
                    <button onClick={onClose} className="p-1.5 hover:bg-slate-500/10 rounded-full transition-colors active:scale-90"><IconRenderer name="X" className="w-4 h-4 text-slate-400" /></button>
                </div>
            </div>
            <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                {notifications.length > 0 ? notifications.map((n: any) => (
                    <div key={n.id} onClick={() => onSelect && onSelect(n)} className="p-6 hover:bg-slate-500/5 transition-colors border-b border-slate-500/5 flex gap-4 cursor-pointer active:bg-slate-500/10">
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.type === 'alert' ? 'bg-red-500' : 'bg-blue-500'}`} />
                        <div className="flex-1">
                            <p className="text-[13px] font-bold leading-tight line-clamp-2">{n.title}</p>
                            <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1 mb-2 line-clamp-3">{n.message}</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{n.time}</p>
                        </div>
                    </div>
                )) : <div className="p-12 text-center opacity-30 text-[10px] font-black uppercase tracking-widest">Sem mensagens</div>}
            </div>
        </div>
    );
};

export const ProfilePopover: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onOpenProfile: () => void;
    onOpenSettings: () => void;
    onLogout: () => void;
    currentUser: User;
    isDarkMode?: boolean;
}> = ({ isOpen, onClose, onOpenProfile, onOpenSettings, onLogout, currentUser, isDarkMode }) => {
    if (!isOpen) return null;
    return (
        <div className={`absolute top-14 right-0 w-64 border shadow-2xl rounded-[2.5rem] z-[50] overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right ${isDarkMode ? 'bg-[#1e293b] border-white/10 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
            <div className="p-6 text-center border-b border-slate-500/10 relative">
                <button onClick={onClose} className="absolute top-5 right-5 p-1.5 hover:bg-slate-500/10 rounded-full transition-colors"><IconRenderer name="X" className="w-4 h-4 text-slate-400" /></button>
                <h3 className="text-[14px] font-black uppercase tracking-tight leading-none mb-1">{currentUser.name}</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{currentUser.role}</p>
            </div>
            <div className="p-2 space-y-1">
                <button onClick={() => { onOpenProfile(); onClose(); }} className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all group ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                    <IconRenderer name="User" className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-blue-500">Meu Perfil</span>
                </button>
                <button onClick={() => { onOpenSettings(); onClose(); }} className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all group ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                    <IconRenderer name="Settings" className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-blue-500">Ajustes</span>
                </button>
            </div>
            <div className="p-2 border-t border-slate-500/10">
                <button onClick={() => { onLogout(); onClose(); }} className="w-full flex items-center space-x-4 p-4 hover:bg-red-500/10 text-red-500 rounded-2xl transition-all active:scale-95 group">
                    <IconRenderer name="X" className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Sair</span>
                </button>
            </div>
        </div>
    );
};
