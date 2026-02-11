
import React, { useState } from 'react';
import { UsageData, SaaSLink } from '../types.ts';
import { IconRenderer } from './IconRenderer.tsx';

interface StatsDashboardProps {
  data: UsageData[];
  totalSystems: number;
  links: SaaSLink[];
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ data, totalSystems, links }) => {
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const totalInteractions = data.reduce((acc, curr) => acc + curr.totalAccesses, 0);
  const mostActiveUser = data.length > 0 ? data.reduce((prev, current) => (prev.totalAccesses > current.totalAccesses) ? prev : current) : null;

  // Sort users by activity
  const sortedUsers = [...data].sort((a, b) => b.totalAccesses - a.totalAccesses);
  const maxAccesses = sortedUsers.length > 0 ? sortedUsers[0].totalAccesses : 1;

  const toggleExpand = (userId: string) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
    } else {
      setExpandedUser(userId);
    }
  };

  const getSystemIcon = (systemId: string) => {
    const link = links.find(l => l.id === systemId);
    return link ? link.icon : 'Layers';
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-[#0f172a] tracking-tight uppercase">Analytics de Uso</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Estatísticas Operacionais em Tempo Real</p>
        </div>
        <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl flex items-center space-x-2 border border-emerald-100">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">Monitoramento Ativo</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Card 1: Total Interactions */}
        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex items-center space-x-4">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
            <IconRenderer name="Activity" className="w-6 h-6" />
          </div>
          <div>
            <p className="text-3xl font-black text-slate-900 leading-none">{totalInteractions}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Acessos Totais</p>
          </div>
        </div>

        {/* Card 2: Active Systems */}
        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex items-center space-x-4">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
            <IconRenderer name="Layers" className="w-6 h-6" />
          </div>
          <div>
            <p className="text-3xl font-black text-slate-900 leading-none">{totalSystems}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Sistemas Ativos</p>
          </div>
        </div>

        {/* Card 3: Top User */}
        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex items-center space-x-4">
          <div className="w-14 h-14 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden">
            {mostActiveUser ? (
              <img src={`https://i.pravatar.cc/150?u=${mostActiveUser.userId}`} className="w-full h-full object-cover grayscale" alt="" />
            ) : (
              <IconRenderer name="User" className="w-6 h-6 text-slate-300" />
            )}
          </div>
          <div>
            <p className="text-sm font-black text-slate-900 leading-tight line-clamp-1">{mostActiveUser?.userName || 'N/A'}</p>
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Usuário Mais Ativo</p>
          </div>
        </div>
      </div>

      {/* User Activity List */}
      <div className="space-y-4">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 pl-2">Detalhamento por Usuário</h3>
        <div className="bg-slate-50 rounded-3xl p-2 border border-slate-100">
          {sortedUsers.length > 0 ? (
            sortedUsers.map((stat, index) => (
              <div key={stat.userId} className="mb-1 last:mb-0">
                <button
                  onClick={() => toggleExpand(stat.userId)}
                  className={`w-full group flex items-center p-4 rounded-2xl transition-all ${expandedUser === stat.userId ? 'bg-white shadow-sm' : 'hover:bg-white'}`}
                >
                  <span className="text-[10px] font-black text-slate-300 w-6 text-left">{index + 1}</span>

                  <div className="w-8 h-8 rounded-lg overflow-hidden mr-4 grayscale group-hover:grayscale-0 transition-all">
                    <img src={`https://i.pravatar.cc/150?u=${stat.userId}`} className="w-full h-full object-cover" alt="" />
                  </div>

                  <div className="w-32 sm:w-48 mr-4 text-left">
                    <p className="text-xs font-bold text-slate-700 truncate">{stat.userName}</p>
                    <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">
                      {stat.lastAccess ? `Último: ${new Date(stat.lastAccess).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Sem acesso'}
                    </p>
                  </div>

                  <div className="flex-1 mx-4">
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${(stat.totalAccesses / maxAccesses) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-right w-16 mr-4">
                    <span className="text-sm font-black text-slate-900">{stat.totalAccesses}</span>
                    <span className="text-[8px] block text-slate-400 font-bold uppercase">Cliques</span>
                  </div>

                  <div className={`transition-transform duration-300 ${expandedUser === stat.userId ? 'rotate-90' : ''}`}>
                    <IconRenderer name="ChevronRight" className="w-4 h-4 text-slate-400" />
                  </div>
                </button>

                {/* Expanded Details */}
                {expandedUser === stat.userId && (
                  <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-4 mt-2">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Sistemas Acessados</h4>
                      {stat.systemBreakdown && stat.systemBreakdown.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {stat.systemBreakdown.sort((a, b) => b.totalClicks - a.totalClicks).map(sys => (
                            <div key={sys.systemId} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center space-x-2">
                                  <div className="w-6 h-6 rounded bg-slate-50 flex items-center justify-center text-slate-500">
                                    <IconRenderer name={getSystemIcon(sys.systemId)} className="w-3 h-3" />
                                  </div>
                                  <span className="text-xs font-bold text-slate-700 truncate max-w-[100px]">{sys.systemName}</span>
                                </div>
                                <span className="bg-primary/10 text-primary text-[9px] font-black px-1.5 py-0.5 rounded uppercase">{sys.totalClicks}x</span>
                              </div>
                              <div className="border-t border-slate-50 pt-2 mt-2">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1">Histórico de Acessos</p>
                                <div className="max-h-24 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                                  {sys.history && sys.history.length > 0 ? (
                                    sys.history.sort((a, b) => new Date(b).getTime() - new Date(a).getTime()).map((date, idx) => (
                                      <div key={idx} className="flex justify-between text-[9px] text-slate-500 font-medium">
                                        <span>{new Date(date).toLocaleDateString()}</span>
                                        <span>{new Date(date).toLocaleTimeString()}</span>
                                      </div>
                                    ))
                                  ) : (
                                    <span className="text-[9px] text-slate-300">Sem histórico detalhado</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Nenhum sistema acessado ainda</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
              Nenhuma atividade registrada hoje
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
