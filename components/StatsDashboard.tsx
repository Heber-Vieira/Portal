import React, { useState, useMemo } from 'react';
import { UsageData, SaaSLink } from '../types.ts';
import { IconRenderer } from './IconRenderer.tsx';

interface StatsDashboardProps {
  data: UsageData[];
  totalSystems: number;
  totalUsers: number;
  links: SaaSLink[];
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ data, totalSystems, totalUsers, links }) => {
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const totalInteractions = data.reduce((acc, curr) => acc + curr.totalAccesses, 0);
  const mostActiveUser = data.length > 0 ? data.reduce((prev, current) => (prev.totalAccesses > current.totalAccesses) ? prev : current) : null;

  // Calculate daily trend
  const dailyTrend = useMemo(() => {
    const trendMap = new Map<string, number>();
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      trendMap.set(d.toISOString().split('T')[0], 0);
    }

    data.forEach(user => {
      if (user.history) {
        user.history.forEach(h => {
          if (trendMap.has(h.date)) {
            trendMap.set(h.date, (trendMap.get(h.date) || 0) + h.count);
          }
        });
      }
    });

    return Array.from(trendMap.entries()).map(([date, count]) => ({ date, count }));
  }, [data]);

  // Calculate system popularity
  const systemPopularity = useMemo(() => {
    const sysMap = new Map<string, { name: string, count: number, id: string }>();
    data.forEach(user => {
      user.systemBreakdown.forEach(sys => {
        if (!sysMap.has(sys.systemId)) {
          sysMap.set(sys.systemId, { name: sys.systemName, count: 0, id: sys.systemId });
        }
        sysMap.get(sys.systemId)!.count += sys.totalClicks;
      });
    });
    return Array.from(sysMap.values()).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [data]);

  // Calculate category popularity
  const categoryPopularity = useMemo(() => {
    const catMap = new Map<string, number>();
    data.forEach(user => {
      user.systemBreakdown.forEach(sys => {
        const link = links.find(l => l.id === sys.systemId);
        if (link) {
          const cat = link.category;
          catMap.set(cat, (catMap.get(cat) || 0) + sys.totalClicks);
        }
      });
    });
    return Array.from(catMap.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [data, links]);


  const sortedUsers = [...data].sort((a, b) => b.totalAccesses - a.totalAccesses);
  const maxAccesses = sortedUsers.length > 0 ? sortedUsers[0].totalAccesses : 1;

  const toggleExpand = (userId: string) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const getSystemIcon = (systemId: string) => {
    const link = links.find(l => l.id === systemId);
    return link ? link.icon : 'Layers';
  };

  const renderSparkline = (dataPoints: { count: number }[]) => {
    if (dataPoints.length < 2) return null;
    const height = 40;
    const width = 120;
    const max = Math.max(...dataPoints.map(d => d.count)) || 1;
    const points = dataPoints.map((d, i) => {
      const x = (i / (dataPoints.length - 1)) * width;
      const y = height - (d.count / max) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          points={points}
          fill="none"
          stroke="#f97316"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d={`M0,${height} ${points} L${width},${height} Z`} fill="url(#gradient)" stroke="none" />
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">ANALYTICS DE USO</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ESTATÍSTICAS OPERACIONAIS EM TEMPO REAL</p>
        </div>
        <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl flex items-center space-x-2 border border-emerald-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest">MONITORAMENTO ATIVO</span>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {/* Card 1: Users */}
        <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
              <IconRenderer name="Users" className="w-6 h-6" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-slate-900 leading-none tracking-tight">{totalUsers}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Usuários</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded w-fit">
            <IconRenderer name="CheckCircle" className="w-3 h-3 mr-1" />
            <span>Base Cadastrada</span>
          </div>
        </div>

        {/* Card 2: Interactions */}
        <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-2">
            <div className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-orange-500 shadow-sm">
              <IconRenderer name="Activity" className="w-6 h-6" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-slate-900 leading-none tracking-tight">{totalInteractions}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Interações</p>
            </div>
          </div>
          <div className="h-8 w-full mt-4 opacity-70">
            {renderSparkline(dailyTrend)}
          </div>
        </div>

        {/* Card 3: Systems Count */}
        <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-center h-full">
            <div className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-orange-500 shadow-sm">
              <IconRenderer name="Layers" className="w-6 h-6" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-slate-900 leading-none tracking-tight">{totalSystems}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Sistemas</p>
            </div>
          </div>
        </div>

        {/* Card 4: Top User Mini */}
        <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl p-0.5 border border-slate-200 flex items-center justify-center bg-white overflow-hidden">
              {mostActiveUser?.avatarUrl ? (
                <img src={mostActiveUser.avatarUrl} className="w-full h-full rounded-lg object-cover" alt="" />
              ) : mostActiveUser ? (
                <img src={`https://i.pravatar.cc/150?u=${mostActiveUser.userId}`} className="w-full h-full rounded-lg object-cover opacity-50 grayscale" alt="" />
              ) : (
                <IconRenderer name="User" className="w-5 h-5 text-slate-300" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-900 truncate">{mostActiveUser?.userName || 'N/A'}</p>
              <p className="text-[9px] font-bold text-orange-500 uppercase tracking-widest">Top Performer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Most Accessed Systems */}
        <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center">
            <IconRenderer name="BarChart3" className="w-3.5 h-3.5 mr-2" />
            Sistemas Mais Acessados
          </h3>
          <div className="space-y-4">
            {systemPopularity.map((sys, idx) => (
              <div key={sys.id} className="relative">
                <div className="flex justify-between items-center mb-1 text-xs font-bold z-10 relative">
                  <span className="text-slate-700">{idx + 1}. {sys.name}</span>
                  <span className="text-slate-500">{sys.count} acessos</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: `${(sys.count / (totalInteractions || 1)) * 100}%` }}></div>
                </div>
              </div>
            ))}
            {systemPopularity.length === 0 && <p className="text-xs text-slate-400 italic">Sem dados suficientes.</p>}
          </div>
        </div>

        {/* Most Accessed Categories */}
        <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center">
            <IconRenderer name="PieChart" className="w-3.5 h-3.5 mr-2" />
            Categorias Mais Populares
          </h3>
          <div className="space-y-3">
            {categoryPopularity.map((cat, idx) => (
              <div key={cat.name} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </div>
                  <span className="text-xs font-bold text-slate-700">{cat.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-400 rounded-full" style={{ width: `${(cat.count / (totalInteractions || 1)) * 100}%` }}></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">{Math.round((cat.count / (totalInteractions || 1)) * 100)}%</span>
                </div>
              </div>
            ))}
            {categoryPopularity.length === 0 && <p className="text-xs text-slate-400 italic">Sem dados suficientes.</p>}
          </div>
        </div>
      </div>

      {/* User Activity List */}
      <div className="space-y-6">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 pl-2">Detalhamento por Usuário</h3>
        <div className="bg-slate-50/50 rounded-3xl p-4 border border-slate-100 min-h-[200px] flex flex-col justify-center">
          {sortedUsers.length > 0 ? (
            sortedUsers.map((stat, index) => (
              <div key={stat.userId} className="mb-2 last:mb-0">
                <button
                  onClick={() => toggleExpand(stat.userId)}
                  className={`w-full group flex items-center p-4 rounded-2xl transition-all border border-transparent ${expandedUser === stat.userId
                    ? 'bg-white shadow-md border-slate-100 scale-[1.01]'
                    : 'hover:bg-white hover:shadow-sm hover:border-slate-100'
                    }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-4 font-black text-sm
                        ${index === 0 ? 'bg-orange-100 text-orange-600' :
                      'bg-slate-200 text-slate-600'
                    }`}>
                    {index + 1}
                  </div>

                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl overflow-hidden mr-4 ring-2 ring-transparent group-hover:ring-orange-100 transition-all bg-slate-100 flex items-center justify-center">
                      {stat.avatarUrl ? (
                        <img src={stat.avatarUrl} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <IconRenderer name="User" className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                  </div>

                  <div className="w-32 sm:w-48 mr-4 text-left">
                    <p className="text-sm font-bold text-slate-700 truncate group-hover:text-orange-600 transition-colors">{stat.userName}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      {stat.lastAccess ? new Date(stat.lastAccess).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>

                  <div className="flex-1 mx-4 hidden sm:block">
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                        style={{ width: `${(stat.totalAccesses / maxAccesses) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-right w-20 mr-4">
                    <span className="text-lg font-black text-slate-900">{stat.totalAccesses}</span>
                    <span className="text-[9px] block text-slate-400 font-bold uppercase">Interações</span>
                  </div>

                  <div className={`transition-transform duration-300 ${expandedUser === stat.userId ? 'rotate-90' : ''}`}>
                    <IconRenderer name="ChevronRight" className="w-5 h-5 text-slate-300 group-hover:text-orange-500 transition-colors" />
                  </div>
                </button>

                {/* Expanded Details */}
                {expandedUser === stat.userId && (
                  <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 mt-2 ml-14 shadows-sm">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                        <IconRenderer name="PieChart" className="w-3 h-3 mr-2" />
                        Uso por Sistema
                      </h4>
                      {stat.systemBreakdown && stat.systemBreakdown.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {stat.systemBreakdown.sort((a, b) => b.totalClicks - a.totalClicks).map(sys => (
                            <div key={sys.systemId} className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-orange-200 transition-all">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 shadow-sm">
                                    <IconRenderer name={getSystemIcon(sys.systemId)} className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <span className="text-sm font-bold text-slate-700 truncate block max-w-[120px]">{sys.systemName}</span>
                                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wide">
                                      {sys.totalClicks} cliques
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="h-6 w-full opacity-60">
                                {renderSparkline(sys.history.reduce((acc: any[], curr) => {
                                  const dateStr = (curr instanceof Date ? curr : new Date(curr)).toISOString().split('T')[0];
                                  const existing = acc.find(h => h.date === dateStr);
                                  if (existing) {
                                    existing.count++;
                                  } else {
                                    acc.push({ date: dateStr, count: 1 });
                                  }
                                  return acc;
                                }, []).sort((a, b) => a.date.localeCompare(b.date)))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Nenhum sistema acessado</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center flex flex-col items-center justify-center opacity-50 py-10">
              <IconRenderer name="Activity" className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Nenhuma atividade registrada no período</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
