
import React, { useState, useEffect } from 'react';
import { IconRenderer } from './IconRenderer';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoverCustomizar, setHoverCustomizar] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('nexus-cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAction = () => {
    localStorage.setItem('nexus-cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleReject = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    localStorage.setItem('nexus-cookie-consent', 'rejected');
    setIsVisible(false);
  };

  const showPrivacyPolicy = (e: React.MouseEvent) => {
    e.preventDefault();
    alert('Nossa Política de Privacidade será disponibilizada em breve.');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 right-4 z-[100] w-full max-w-[360px] p-2 animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-[#111827] text-white rounded-[1.8rem] shadow-2xl border border-white/5 p-6 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary rounded-full blur-3xl pointer-events-none opacity-20"></div>

        <div className="flex justify-between items-start mb-4">
          <h3 className="text-primary font-bold text-sm tracking-tight">Controle sua privacidade</h3>
        </div>

        <p className="text-[12px] font-medium text-slate-300 leading-relaxed mb-4">
          Nosso site usa cookies para melhorar a navegação.
        </p>

        <div className="flex items-center space-x-2 mb-6">
          <a href="#" onClick={showPrivacyPolicy} className="text-primary text-[11px] font-bold hover:underline transition-all">Política de Privacidade</a>
          <span className="text-slate-600 text-[10px]">-</span>
          <a href="#" onClick={handleReject} className="text-primary text-[11px] font-bold hover:underline transition-all">Opt-out</a>
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            onClick={showPrivacyPolicy}
            className="text-[11px] font-bold transition-colors"
            style={{ color: hoverCustomizar ? 'var(--primary-color)' : 'white' }}
            onMouseEnter={() => setHoverCustomizar(true)}
            onMouseLeave={() => setHoverCustomizar(false)}
          >
            Customizar
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleReject}
              className="px-5 py-2 rounded-full border border-slate-700 text-[11px] font-bold text-white hover:bg-white/5 transition-all active:scale-95"
            >
              Rejeitar
            </button>
            <button
              onClick={handleAction}
              className="px-6 py-2 rounded-full bg-primary bg-primary-hover text-white text-[11px] font-bold shadow-lg shadow-black/20 transition-all active:scale-95"
            >
              Aceitar
            </button>
          </div>
        </div>
      </div>

      {/* Floating Check Icon (Indicator) */}
      <div className="absolute -left-2 -bottom-2 w-10 h-10 bg-primary opacity-95 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10 shadow-lg shadow-black/40">
        <div className="w-5 h-5 border-2 border-white rounded-md flex items-center justify-center">
          <div className="w-2.5 h-1.5 border-l-2 border-b-2 border-white -rotate-45 -translate-y-0.5"></div>
        </div>
      </div>
    </div>
  );
};
