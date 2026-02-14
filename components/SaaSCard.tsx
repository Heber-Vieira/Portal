
import React from 'react';
import { SaaSLink } from '../types.ts';
import { IconRenderer } from './IconRenderer.tsx';

interface SaaSCardProps {
    saas: SaaSLink;
    onDelete: (id: string) => void;
    onTogglePin: (id: string) => void;
    onEdit: (saas: SaaSLink) => void;
    onAccess: (id: string) => void;
    isAdmin: boolean;
    isDense?: boolean;
    isDarkMode?: boolean;
}

export const SaaSCard: React.FC<SaaSCardProps> = ({ saas, onDelete, onTogglePin, onEdit, onAccess, isAdmin, isDense, isDarkMode }) => {
    return (
        <div
            className={`group relative border transition-all duration-500 ease-out flex flex-col h-full rounded-xl overflow-hidden transform-gpu hover:scale-[2.0] hover:-translate-y-1 hover:z-50 ${isDense ? 'p-2' : 'p-4'
                } ${isDarkMode
                    ? 'bg-white/5 border-white/5 hover:bg-[#1e293b] hover:border-white/20 hover:shadow-2xl hover:shadow-primary/40'
                    : 'bg-white border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-slate-400/50'
                } ${saas.isPinned
                    ? (isDarkMode ? 'ring-1 border-primary ring-primary' : 'ring-1 border-primary ring-primary shadow-sm bg-slate-50/20')
                    : ''
                }`}
        >
            {/* Cabeçalho do Card: Alinhamento Horizontal (Logo | Texto+Admin | Pin) */}
            <div className={`flex items-start justify-between ${isDense ? 'mb-2' : 'mb-4'}`}>
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                    {/* Logo do Sistema */}
                    <div
                        className={`shrink-0 rounded flex items-center justify-center overflow-hidden transition-all duration-500 mt-0.5 ${isDense ? 'w-7 h-7' : 'w-10 h-10'
                            } ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'} border shadow-sm group-hover:scale-110 group-hover:rotate-6`}
                        style={{ color: saas.accentColor }}
                    >
                        {saas.imageUrl ? (
                            <img src={saas.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <IconRenderer name={saas.icon} className={isDense ? 'w-3 h-3' : 'w-5 h-5'} />
                        )}
                    </div>

                    {/* Nome, Categoria e Ferramentas Admin */}
                    <div className="flex-1 min-w-0 pr-2">
                        <span className={`block font-black uppercase tracking-widest text-slate-400 leading-none ${isDense ? 'text-[6px] mb-1' : 'text-[7px] mb-1.5'}`}>
                            {saas.category}
                        </span>
                        <div className="flex items-center flex-wrap gap-2">
                            <h3 className={`font-black leading-tight break-words transition-all duration-500 group-hover:text-primary ${isDense ? 'text-[9px]' : 'text-[11px]'} ${isDarkMode ? 'text-white' : 'text-[#0f172a]'}`}>
                                {saas.name}
                            </h3>

                            {/* Controles de Admin (Pílula Horizontal) */}
                            {isAdmin && (
                                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-[#0f172a] text-white rounded-full px-1.5 py-1 shadow-lg border border-white/10 z-20">
                                    <button onClick={() => onEdit(saas)} className="p-1 hover:text-blue-400 transition-colors" title="Editar">
                                        <IconRenderer name="Edit2" className="w-3 h-3" />
                                    </button>
                                    <div className="w-px h-3 bg-white/20 mx-1" />
                                    <button onClick={() => onDelete(saas.id)} className="p-1 hover:text-red-400 transition-colors" title="Excluir">
                                        <IconRenderer name="Trash2" className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Botão Favorito (Pin) */}
                <div className="shrink-0">
                    <button
                        onClick={() => onTogglePin(saas.id)}
                        className={`p-2.5 rounded-2xl transition-all shadow-sm ${saas.isPinned
                            ? 'bg-white text-pink-500 border border-slate-100 shadow-lg'
                            : 'text-slate-400 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-[#334155] bg-white border border-slate-100'
                            }`}
                    >
                        <IconRenderer name="Pin" className={`w-4 h-4 ${saas.isPinned ? 'fill-current' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Descrição Flexível */}
            <div className={`flex-1 ${isDense ? 'mb-2' : 'mb-4'}`}>
                <p className={`text-slate-400 font-medium leading-tight ${isDense ? 'text-[8px]' : 'text-[10px]'}`}>
                    {saas.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                    {!saas.isActive && (
                        <div className="text-[7px] font-black uppercase tracking-[0.2em] text-red-500 flex items-center space-x-1 animate-pulse">
                            <IconRenderer name="Clock" className="w-2 h-2" />
                            <span>Indisponível</span>
                        </div>
                    )}
                    {isAdmin && !saas.isVisibleToUsers && (
                        <div className="text-[7px] font-black uppercase tracking-[0.2em] text-amber-500 flex items-center space-x-1">
                            <IconRenderer name="Shield" className="w-2 h-2" />
                            <span>Apenas Admin</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Ação Principal (Base) */}
            <div className={`border-t ${isDarkMode ? 'border-white/5 pt-3' : 'border-slate-100 pt-4'}`}>
                {saas.isActive ? (
                    <a
                        href={saas.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => onAccess(saas.id)}
                        className={`w-full text-white rounded-lg font-black text-[9px] uppercase tracking-widest flex items-center justify-center space-x-2 transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-primary/30 hover:opacity-90 active:scale-95 shadow-lg bg-primary ${isDense ? 'py-1.5' : 'py-2.5'}`}
                    >
                        <span>Acessar</span>
                        <IconRenderer name="ExternalLink" className="w-2.5 h-2.5 opacity-60 group-hover:translate-x-1 transition-transform" />
                    </a>
                ) : (
                    <div className={`w-full bg-slate-500/10 text-slate-500 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 cursor-not-allowed border border-slate-500/5 ${isDense ? 'py-1.5' : 'py-2.5'}`}>
                        <span>Bloqueado</span>
                    </div>
                )}
            </div>
        </div>
    );
};
