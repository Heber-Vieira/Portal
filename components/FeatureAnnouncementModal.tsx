
import React, { useState, useEffect } from 'react';
import { IconRenderer } from './IconRenderer';
import { Announcement } from '../types';
import { supabase } from '../supabase';

interface FeatureAnnouncementModalProps {
    announcement: Announcement;
    onClose: () => void;
    isDarkMode: boolean;
}

export const FeatureAnnouncementModal: React.FC<FeatureAnnouncementModalProps> = ({ announcement, onClose, isDarkMode }) => {
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        // Stop confetti after a few seconds
        const timer = setTimeout(() => setShowConfetti(false), 4000);
        return () => clearTimeout(timer);
    }, []);

    const handleConfirm = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase.from('announcement_views').upsert({
                user_id: user.id,
                announcement_id: announcement.id,
                viewed_at: new Date().toISOString()
            });
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-500">
            {/* Confetti Effect using simple CSS/Elements or you could use canvas-confetti library, staying simple here with animated elements */}
            {showConfetti && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-confetti"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `-10%`,
                                backgroundColor: ['#FFC700', '#FF0000', '#2E3192', '#41BBC7'][Math.floor(Math.random() * 4)],
                                width: `${Math.random() * 10 + 5}px`,
                                height: `${Math.random() * 10 + 5}px`,
                                opacity: Math.random(),
                                animationDuration: `${Math.random() * 3 + 2}s`,
                                animationDelay: `${Math.random() * 2}s`
                            }}
                        />
                    ))}
                    <style>
                        {`
                          @keyframes confetti {
                            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                          }
                          .animate-confetti {
                            animation-name: confetti;
                            animation-timing-function: linear;
                            animation-iteration-count: 1; 
                            animation-fill-mode: forwards;
                            border-radius: 2px;
                          }
                        `}
                    </style>
                </div>
            )}

            <div className={`relative w-full max-w-[90%] md:max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar rounded-3xl md:rounded-[3rem] shadow-2xl animate-in zoom-in-90 duration-500 border flex flex-col ${isDarkMode ? 'bg-[#0f172a] border-white/20' : 'bg-white border-white'}`}>
                {/* Decorative Background */}
                <div className="absolute top-0 left-0 w-full h-32 md:h-40 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-20 shrink-0" />
                <div className="absolute -top-20 -right-20 w-48 h-48 md:w-64 md:h-64 bg-indigo-500/30 rounded-full blur-3xl animate-pulse pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-48 h-48 md:w-64 md:h-64 bg-pink-500/30 rounded-full blur-3xl animate-pulse pointer-events-none" />

                <div className="relative p-6 md:p-10 flex flex-col items-center text-center w-full">
                    <div className="w-16 h-16 md:w-24 md:h-24 mb-4 md:mb-6 relative shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-pink-400 rounded-2xl md:rounded-3xl rotate-6 opacity-50 blur-sm" />
                        <div className={`relative w-full h-full rounded-2xl md:rounded-3xl flex items-center justify-center text-2xl md:text-4xl shadow-xl ${isDarkMode ? 'bg-slate-900 border border-white/10' : 'bg-white border border-slate-100'}`}>
                            🎉
                        </div>
                    </div>

                    <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter mb-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
                        {announcement.title}
                    </h2>
                    <p className={`text-xs md:text-sm font-medium leading-relaxed max-w-sm mb-6 md:mb-10 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {announcement.description || 'Preparamos atualizações incríveis para melhorar ainda mais sua experiência.'}
                    </p>

                    <div className="w-full space-y-3 md:space-y-4 mb-6 md:mb-10 text-left">
                        {announcement.features.map((feature, idx) => (
                            <div key={idx} className={`p-3 md:p-4 rounded-xl md:rounded-2xl flex items-start gap-3 md:gap-4 transition-all hover:scale-[1.01] md:hover:scale-[1.02] ${isDarkMode ? 'bg-white/5 border border-white/5 hover:bg-white/10' : 'bg-slate-50 border border-slate-100 hover:bg-slate-100'}`}>
                                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                                    <IconRenderer name={feature.icon} className="w-4 h-4 md:w-5 md:h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className={`text-xs md:text-sm font-bold uppercase tracking-tight mb-0.5 md:mb-1 truncate ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{feature.title}</h3>
                                    <p className={`text-[10px] md:text-xs leading-relaxed line-clamp-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="w-full mt-auto">
                        <button
                            onClick={handleConfirm}
                            className="w-full py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            Conferir Novidades
                        </button>
                        <button
                            onClick={onClose}
                            className={`mt-4 text-[10px] font-bold uppercase tracking-widest hover:underline py-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}
                        >
                            Agora não
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
