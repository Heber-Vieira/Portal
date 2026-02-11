
import React, { useState, useEffect } from 'react';
import { IconRenderer } from './IconRenderer.tsx';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('nexus-cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAction = () => {
    localStorage.setItem('nexus-cookie-consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 right-4 z-[100] w-full max-w-[360px] p-2 animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-[#111827] text-white rounded-[1.8rem] shadow-2xl border border-white/5 p-6 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-[#10b981] font-bold text-sm tracking-tight">Controle sua privacidade</h3>
          <span className="text-[#10b981]/50 text-[9px] font-black uppercase tracking-tighter">AdOpt</span>
        </div>

        <p className="text-[12px] font-medium text-slate-300 leading-relaxed mb-4">
          Nosso site usa cookies para melhorar a navegação.
        </p>

        <div className="flex items-center space-x-2 mb-6">
          <a href="#" className="text-[#10b981] text-[11px] font-bold hover:underline transition-all">Política de Privacidade</a>
          <span className="text-slate-600 text-[10px]">-</span>
          <a href="#" className="text-[#10b981] text-[11px] font-bold hover:underline transition-all">Opt-out</a>
        </div>

        <div className="flex items-center justify-between gap-3">
          <button 
            onClick={handleAction}
            className="text-[11px] font-bold text-white hover:text-[#10b981] transition-colors"
          >
            Customizar
          </button>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleAction}
              className="px-5 py-2 rounded-full border border-slate-700 text-[11px] font-bold text-white hover:bg-white/5 transition-all active:scale-95"
            >
              Rejeitar
            </button>
            <button 
              onClick={handleAction}
              className="px-6 py-2 rounded-full bg-[#059669] text-white text-[11px] font-bold hover:bg-[#047857] shadow-lg shadow-emerald-900/20 transition-all active:scale-95"
            >
              Aceitar
            </button>
          </div>
        </div>
      </div>
      
      {/* Floating Check Icon (Indicator) */}
      <div className="absolute -left-2 -bottom-2 w-10 h-10 bg-[#059669]/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10 shadow-lg shadow-emerald-900/40">
        <div className="w-5 h-5 border-2 border-white rounded-md flex items-center justify-center">
           <div className="w-2.5 h-1.5 border-l-2 border-b-2 border-white -rotate-45 -translate-y-0.5"></div>
        </div>
      </div>
    </div>
  );
};
