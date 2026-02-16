
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
    if (!isOpen) return null;
    return (
        <div className={`fixed sm:absolute top-20 sm:top-14 left-4 right-4 sm:left-auto sm:right-0 w-auto sm:w-80 border shadow-2xl rounded-[2.5rem] z-[50] overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right ${isDarkMode ? 'bg-[#1e293b] border-white/10 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
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
    if (!isOpen) return null;
    return (
        <div className={`fixed sm:absolute top-20 sm:top-14 left-4 right-4 sm:left-auto sm:right-0 w-auto sm:w-64 border shadow-2xl rounded-[2.5rem] z-[50] overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right ${isDarkMode ? 'bg-[#1e293b] border-white/10 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
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

export const DisplaySettingsPopover: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    isDarkMode: boolean;
    zoomLevel: number;
    setZoomLevel: (level: number) => void;
    hoverScale: number;
    setHoverScale: (scale: number) => void;
}> = ({ isOpen, onClose, isDarkMode, zoomLevel, setZoomLevel, hoverScale, setHoverScale }) => {
    if (!isOpen) return null;

    const formattedHoverScale = Math.round(((hoverScale || 1.05) - 1) * 100);

    return (
        <div className={`fixed sm:absolute top-20 sm:top-14 left-4 right-4 sm:left-auto sm:right-20 w-auto sm:w-72 border shadow-2xl rounded-[2rem] z-[50] overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right ${isDarkMode ? 'bg-[#1e293b] border-white/10 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
            <div className="p-5 border-b border-slate-500/10 flex justify-between items-center bg-slate-500/5">
                <div className="flex items-center space-x-2">
                    <IconRenderer name="Monitor" className="w-4 h-4 text-blue-500" />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">Visualização</h3>
                </div>
                <button onClick={onClose} className="p-1.5 hover:bg-slate-500/10 rounded-full transition-colors active:scale-90 opacity-60 hover:opacity-100">
                    <IconRenderer name="X" className="w-3.5 h-3.5" />
                </button>
            </div>

            <div className="p-6 space-y-8">
                {/* Grid Zoom Control */}
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <label className="text-xs sm:text-[10px] font-black uppercase tracking-widest text-slate-400">Tamanho dos Cards</label>
                        <span className="text-xs sm:text-[10px] font-bold bg-blue-500/10 text-blue-500 px-2.5 py-1 rounded-full">Nível {zoomLevel || 3}</span>
                    </div>
                    <div className="relative h-8 flex items-center">
                        <div className="w-full h-2 rounded-full bg-slate-500/10 relative">
                            <div
                                className="absolute h-full bg-blue-500 rounded-full transition-all duration-300"
                                style={{ width: `${((zoomLevel || 3) - 1) * 25}%` }}
                            />
                            <div
                                className={`absolute w-5 h-5 rounded-full shadow-lg top-1/2 -translate-y-1/2 -ml-2.5 bg-white border-2 transition-all duration-300 pointer-events-none ${isDarkMode ? 'border-blue-500' : 'border-slate-200'}`}
                                style={{ left: `${((zoomLevel || 3) - 1) * 25}%` }}
                            />
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            step="1"
                            value={zoomLevel || 3}
                            onChange={(e) => setZoomLevel(Number(e.target.value))}
                            className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                        />
                    </div>
                    <div className="flex justify-between text-[10px] sm:text-[8px] font-bold text-slate-400 uppercase tracking-wider px-1">
                        <span>Pequeno</span>
                        <span>Grande</span>
                    </div>
                </div>

                {/* Hover Zoom Control */}
                <div className="space-y-4 pb-2">
                    <div className="flex justify-between items-end">
                        <label className="text-xs sm:text-[10px] font-black uppercase tracking-widest text-slate-400">Zoom ao passar o mouse</label>
                        <span className="text-xs sm:text-[10px] font-bold bg-purple-500/10 text-purple-500 px-2.5 py-1 rounded-full">+{formattedHoverScale}%</span>
                    </div>
                    <div className="relative h-8 flex items-center">
                        <div className="w-full h-2 rounded-full bg-slate-500/10 relative">
                            <div
                                className="absolute h-full bg-purple-500 rounded-full transition-all duration-300"
                                style={{ width: `${((hoverScale || 1.05) - 1) * 100}%` }}
                            />
                            <div
                                className={`absolute w-5 h-5 rounded-full shadow-lg top-1/2 -translate-y-1/2 -ml-2.5 bg-white border-2 transition-all duration-300 pointer-events-none ${isDarkMode ? 'border-purple-500' : 'border-slate-200'}`}
                                style={{ left: `${((hoverScale || 1.05) - 1) * 100}%` }}
                            />
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="2"
                            step="0.05"
                            value={hoverScale || 1.05}
                            onChange={(e) => setHoverScale(Number(e.target.value))}
                            className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                        />
                    </div>
                    <div className="flex justify-between text-[10px] sm:text-[8px] font-bold text-slate-400 uppercase tracking-wider px-1">
                        <span>Normal</span>
                        <span>2x</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
