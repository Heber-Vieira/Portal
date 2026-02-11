
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
      className={`group relative border transition-all duration-300 flex flex-col h-full rounded-xl overflow-hidden ${isDense ? 'p-2' : 'p-4'
        } ${isDarkMode
          ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
          : 'bg-white border-slate-100 hover:shadow-xl hover:shadow-slate-200/50'
        } ${saas.isPinned
          ? (isDarkMode ? 'ring-1 ring-blue-500' : 'ring-1 ring-slate-900 border-slate-900 shadow-sm bg-slate-50/20')
          : ''
        }`}
    >
      {/* Favorito e Controles de Admin (Topo) */}
      <div className="absolute top-2 right-2 flex items-center space-x-1 z-10">
        {isAdmin && (
          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-[#334155] dark:bg-slate-800/95 backdrop-blur-sm rounded-lg shadow-xl border border-white/10 overflow-hidden transform translate-x-2 group-hover:translate-x-0">
            <button onClick={() => onEdit(saas)} className="p-1.5 text-white/70 hover:text-white transition-colors" title="Editar">
              <IconRenderer name="Edit2" className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-3 bg-white/10" />
            <button onClick={() => onDelete(saas.id)} className="p-1.5 text-white/70 hover:text-red-400 transition-colors" title="Excluir">
              <IconRenderer name="Trash2" className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        <button
          onClick={() => onTogglePin(saas.id)}
          className={`p-1.5 rounded-lg transition-all ${saas.isPinned
            ? (isDarkMode ? 'text-blue-400 bg-white/10 shadow-lg' : 'text-slate-900 bg-white shadow-md border border-slate-100')
            : 'text-slate-400 opacity-0 group-hover:opacity-100 hover:text-blue-500 bg-white/90 dark:bg-slate-800/90 border border-slate-100 dark:border-white/5'
            }`}
          title={saas.isPinned ? "Desfavoritar" : "Favoritar"}
        >
          <IconRenderer name="Pin" className={`w-3.5 h-3.5 ${saas.isPinned ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Identificação */}
      <div className={`flex items-start space-x-3 ${isDense ? 'mb-2' : 'mb-4'} pr-14`}>
        <div
          className={`shrink-0 rounded flex items-center justify-center overflow-hidden transition-all duration-300 mt-0.5 ${isDense ? 'w-7 h-7' : 'w-10 h-10'
            } ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'} border shadow-sm group-hover:scale-110`}
          style={{ color: saas.accentColor }}
        >
          {saas.imageUrl ? (
            <img src={saas.imageUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <IconRenderer name={saas.icon} className={isDense ? 'w-3 h-3' : 'w-5 h-5'} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <span className={`block font-black uppercase tracking-widest text-slate-400 leading-none ${isDense ? 'text-[6px] mb-1' : 'text-[7px] mb-1.5'}`}>
            {saas.category}
          </span>
          <h3 className={`font-black leading-tight break-words ${isDense ? 'text-[9px]' : 'text-[11px]'} ${isDarkMode ? 'text-white' : 'text-[#0f172a]'}`}>
            {saas.name}
          </h3>
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

      {/* Ações Centralizadas (Base) */}
      <div className={`flex justify-center border-t ${isDarkMode ? 'border-white/5 pt-3' : 'border-slate-100 pt-4'}`}>
        {saas.isActive ? (
          <a
            href={saas.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onAccess(saas.id)}
            className={`w-full text-white rounded-lg font-black text-[9px] uppercase tracking-widest flex items-center justify-center space-x-2 transition-all hover:opacity-90 active:scale-95 shadow-lg ${isDarkMode ? 'bg-blue-600 shadow-blue-600/20' : 'bg-[#0f172a] shadow-black/10'} ${isDense ? 'py-1.5' : 'py-2.5'}`}
          >
            <span>Acessar</span>
            <IconRenderer name="ExternalLink" className="w-2.5 h-2.5 opacity-60" />
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
