
import React from 'react';
import { IconRenderer } from './IconRenderer';

interface MessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: 'warning' | 'info' | 'error';
}

export const MessageModal: React.FC<MessageModalProps> = ({ isOpen, onClose, title, message, type = 'warning' }) => {
    if (!isOpen) return null;

    const getColors = () => {
        switch (type) {
            case 'error': return { bg: 'bg-red-50', text: 'text-red-500', border: 'border-red-50/50', btn: 'bg-red-600 hover:bg-red-700 shadow-red-500/30' };
            case 'info': return { bg: 'bg-blue-50', text: 'text-blue-500', border: 'border-blue-50/50', btn: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30' };
            default: return { bg: 'bg-amber-50', text: 'text-amber-500', border: 'border-amber-50/50', btn: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30' };
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'error': return 'X';
            case 'info': return 'Bell';
            default: return 'LifeBuoy'; // Usando LifeBuoy como ícone de alerta/help
        }
    };

    const colors = getColors();

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 p-8 text-center border border-slate-100">
                <div className={`w-20 h-20 ${colors.bg} ${colors.text} rounded-full flex items-center justify-center mx-auto mb-6 border-4 ${colors.border}`}>
                    <IconRenderer name={getIcon()} className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight uppercase">{title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-10 px-4 whitespace-pre-wrap">{message}</p>
                <button
                    onClick={onClose}
                    className={`w-full px-6 py-5 ${colors.btn} text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all shadow-xl active:scale-95`}
                >
                    Entendi
                </button>
            </div>
        </div>
    );
};
