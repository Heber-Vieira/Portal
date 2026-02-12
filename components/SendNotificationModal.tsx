
import React, { useState } from 'react';
import { IconRenderer } from './IconRenderer';
import { User, Notification } from '../types';

interface SendNotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: (data: { title: string; message: string; type: Notification['type']; targetUserId: string | null }) => void;
    users: User[];
    isDarkMode?: boolean;
}

export const SendNotificationModal: React.FC<SendNotificationModalProps> = ({ isOpen, onClose, onSend, users, isDarkMode }) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState<Notification['type']>('info');
    const [isGlobal, setIsGlobal] = useState(true);
    const [targetUserId, setTargetUserId] = useState<string>('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSend({
            title,
            message,
            type,
            targetUserId: isGlobal ? null : targetUserId
        });
        // Reset
        setTitle('');
        setMessage('');
        setType('info');
        setIsGlobal(true);
        setTargetUserId('');
    };

    const getTypeColor = (t: Notification['type']) => {
        switch (t) {
            case 'success': return 'bg-emerald-500 text-emerald-500';
            case 'warning': return 'bg-amber-500 text-amber-500';
            case 'alert': return 'bg-red-500 text-red-500';
            default: return 'bg-blue-500 text-blue-500';
        }
    };

    const getTypeIcon = (t: Notification['type']) => {
        switch (t) {
            case 'success': return 'CheckCircle';
            case 'warning': return 'TriangleAlert';
            case 'alert': return 'Siren';
            default: return 'Info';
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className={`${isDarkMode ? 'bg-[#1e293b] text-white border-white/10' : 'bg-white text-slate-900 border-slate-200'} w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col border`}>
                <div className="p-8 border-b border-slate-500/10 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-black tracking-tighter uppercase">Novo Comunicado</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Enviar mensagem para os usuários</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-500/10 rounded-full transition-colors active:scale-90">
                        <IconRenderer name="X" className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <div className="p-8 space-y-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
                    {/* Preview Card */}
                    <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Pré-visualização</p>
                        <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'} flex items-start space-x-4`}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shrink-0 ${getTypeColor(type).split(' ')[0]} text-white`}>
                                <IconRenderer name={getTypeIcon(type)} className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{title || 'Título da Mensagem'}</h4>
                                <p className={`text-xs mt-1 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                    {message || 'O conteúdo da sua mensagem aparecerá aqui...'}
                                </p>
                                <p className="text-[9px] font-black text-slate-400/60 mt-2 uppercase tracking-widest">Agora mesmo</p>
                            </div>
                        </div>
                    </div>

                    <form id="notification-form" onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Tipo</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {(['info', 'success', 'warning', 'alert'] as const).map(t => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setType(t)}
                                            className={`aspect-square rounded-xl flex items-center justify-center transition-all ${type === t ? getTypeColor(t).split(' ')[0] + ' text-white ring-2 ring-offset-2 ring-offset-white ring-' + getTypeColor(t).split('-')[1] + '-500' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                                            title={t}
                                        >
                                            <IconRenderer name={getTypeIcon(t)} className="w-4 h-4" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Destinatário</label>
                                <div className="flex bg-slate-100 rounded-xl p-1">
                                    <button type="button" onClick={() => setIsGlobal(true)} className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${isGlobal ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>Todos</button>
                                    <button type="button" onClick={() => setIsGlobal(false)} className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${!isGlobal ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>Individual</button>
                                </div>
                            </div>
                        </div>

                        {!isGlobal && (
                            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Selecionar Usuário</label>
                                <select
                                    required={!isGlobal}
                                    value={targetUserId}
                                    onChange={e => setTargetUserId(e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold text-xs ${isDarkMode ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-900'}`}
                                >
                                    <option value="">Selecione um usuário...</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Título</label>
                            <input
                                required
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Ex: Manutenção Programada"
                                className={`w-full px-4 py-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold text-xs ${isDarkMode ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-900'}`}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Mensagem</label>
                            <textarea
                                required
                                rows={4}
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder="Digite o conteúdo do comunicado..."
                                className={`w-full px-4 py-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold text-xs resize-none ${isDarkMode ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-900'}`}
                            />
                        </div>
                    </form>
                </div>

                <div className="p-8 pt-0 mt-auto">
                    <button
                        form="notification-form"
                        type="submit"
                        className="w-full py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center space-x-3"
                    >
                        <span>Enviar Comunicado</span>
                        <IconRenderer name="Megaphone" className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};
