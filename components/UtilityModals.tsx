
import React, { useState, useRef } from 'react';
import { IconRenderer } from './IconRenderer';
import { User } from '../types';
import { supabase } from '../supabase';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    isDarkMode?: boolean;
}

export const SettingsModal: React.FC<ModalProps & {
    setIsDarkMode: (v: boolean) => void;
    isDenseGrid: boolean;
    setIsDenseGrid: (v: boolean) => void;
    notificationsEnabled: boolean;
    setNotificationsEnabled: (v: boolean) => void;
}> = ({ isOpen, onClose, isDarkMode, setIsDarkMode, isDenseGrid, setIsDenseGrid, notificationsEnabled, setNotificationsEnabled }) => {
    if (!isOpen) return null;

    const Toggle = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
        <button
            onClick={onToggle}
            className={`w-10 h-6 rounded-full relative transition-all duration-300 border ${active
                ? (isDarkMode ? 'bg-blue-600 border-blue-600' : 'bg-[#0f172a] border-[#0f172a]')
                : 'bg-slate-100 border-slate-200'
                }`}
        >
            <div className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 shadow-sm ${active
                ? 'translate-x-5 bg-white'
                : 'translate-x-1 bg-slate-300'
                }`}></div>
        </button>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className={`${isDarkMode ? 'bg-[#1e293b] text-white border-white/10' : 'bg-white text-slate-900 border-slate-200'} w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 p-8 border`}>
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-black tracking-tighter uppercase">Configurações</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-500/10 rounded-full transition-colors">
                        <IconRenderer name="X" className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-black uppercase">Modo Escuro</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Interface de alto contraste</p>
                        </div>
                        <Toggle active={!!isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-black uppercase">Grid Denso</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Mais ativos na mesma tela</p>
                        </div>
                        <Toggle active={isDenseGrid} onToggle={() => setIsDenseGrid(!isDenseGrid)} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-black uppercase">Notificações Push</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Alertas de manutenção Críticos</p>
                        </div>
                        <Toggle active={notificationsEnabled} onToggle={() => setNotificationsEnabled(!notificationsEnabled)} />
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className={`mt-10 w-full py-4 text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] shadow-xl hover:opacity-90 active:scale-95 transition-all border border-white/10 bg-primary`}
                >
                    Salvar Preferências
                </button>
            </div>
        </div>
    );
};

export const DocsModal: React.FC<ModalProps> = ({ isOpen, onClose, isDarkMode }) => {
    const [selectedDoc, setSelectedDoc] = useState<any>(null);

    if (!isOpen) return null;
    const docs = [
        { title: 'Guia de Acesso Remoto', cat: 'Infraestrutura', icon: 'Globe', content: 'Para acessar remotamente, utilize a VPN industrial através do gateway 10.0.0.1. Certifique-se de que seu token MFA está ativo no dispositivo autorizado. Suporte via TI ramal 445.' },
        { title: 'Protocolos de Segurança v4', cat: 'Compliance', icon: 'Shield', content: 'A política de senhas exige 12 caracteres, incluindo símbolos e números. A troca é obrigatória a cada 90 dias conforme auditoria ISO 27001. Não compartilhe credenciais.' },
        { title: 'Manuais das Ferramentas BI', cat: 'Operacional', icon: 'BarChart3', content: 'Os dashboards do InsightPanel são atualizados a cada 15 minutos via Data Lake. Em caso de divergência de valores, abra um ticket para a equipe de Controladoria.' },
        { title: 'Workflow de Aprovações', cat: 'Processos', icon: 'GitBranch', content: 'Toda alteração de processo no FlowMaster BPM deve ser aprovada pelo gerente de planta. As assinaturas digitais são validadas pelo sistema Nexus Signature.' }
    ];

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className={`${isDarkMode ? 'bg-[#1e293b] text-white border-white/5' : 'bg-white text-slate-900 border-slate-200'} w-full max-w-2xl max-h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col border`}>
                <div className="px-6 py-6 border-b border-slate-500/10 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-xl font-black tracking-tighter uppercase">{selectedDoc ? 'Manual Nexus' : 'Documentação'}</h2>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{selectedDoc ? selectedDoc.title : 'Central de Conhecimento'}</p>
                    </div>
                    <button onClick={selectedDoc ? () => setSelectedDoc(null) : onClose} className="p-2 bg-slate-500/10 hover:bg-slate-500/20 rounded-xl transition-all active:scale-90">
                        <IconRenderer name={selectedDoc ? "ChevronRight" : "X"} className={`w-5 h-5 text-slate-400 ${selectedDoc ? 'rotate-180' : ''}`} />
                    </button>
                </div>
                <div className="flex-1 p-6 overflow-y-auto">
                    {selectedDoc ? (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${isDarkMode ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'}`}>
                                <IconRenderer name={selectedDoc.icon} className="w-6 h-6" />
                            </div>
                            <div className="prose prose-slate">
                                <p className={`text-sm leading-relaxed font-medium p-6 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                                    {selectedDoc.content}
                                </p>
                            </div>
                            <div className="pt-6 flex justify-end">
                                <button onClick={() => setSelectedDoc(null)} className={`px-6 py-3 text-white rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg ${isDarkMode ? 'bg-blue-600 shadow-blue-600/20' : 'bg-[#0f172a]'}`}>Voltar para Lista</button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="relative mb-6">
                                <IconRenderer name="Search" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input placeholder="Buscar guia rápido..." className={`w-full pl-12 pr-6 py-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-600 transition-all text-xs font-bold ${isDarkMode ? 'bg-white/5 text-white' : 'bg-slate-50 text-slate-900'}`} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {docs.map((doc, i) => (
                                    <button key={i} onClick={() => setSelectedDoc(doc)} className={`flex items-center space-x-4 p-4 border rounded-xl transition-all text-left group active:scale-98 ${isDarkMode ? 'bg-white/5 border-white/5 hover:border-white/20' : 'bg-white border-slate-100 hover:border-slate-900'}`}>
                                        <div className="w-10 h-10 shrink-0 bg-slate-500/5 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                                            <IconRenderer name={doc.icon} className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{doc.cat}</p>
                                            <p className={`text-xs font-bold truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{doc.title}</p>
                                        </div>
                                        <IconRenderer name="ChevronRight" className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const SupportModal: React.FC<ModalProps> = ({ isOpen, onClose, isDarkMode }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    if (!isOpen) return null;

    const handleSend = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                onClose();
            }, 2500);
        }, 1500);
    };

    const handleEmergency = () => {
        const message = encodeURIComponent("🚨 EMERGÊNCIA NEXUSPRO: Necessito de suporte imediato em um incidente crítico na operação.");
        window.open(`https://wa.me/5500000000000?text=${message}`, '_blank');
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-end p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-sm h-full max-h-[600px] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-500">
                <div className="p-6 bg-primary text-white flex justify-between items-center shrink-0">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                            <IconRenderer name="LifeBuoy" className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-none">Quick Support</h3>
                            <p className="text-[10px] text-blue-300 uppercase tracking-widest mt-1">Linha Industrial</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-90">
                        <IconRenderer name="X" className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                    {submitted ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in-95 duration-300">
                            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center border-4 border-emerald-100">
                                <IconRenderer name="Check" className="w-10 h-10" />
                            </div>
                            <div>
                                <h4 className="text-xl font-black uppercase tracking-tight text-slate-900">Chamado Enviado</h4>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Protocolo: #{Math.floor(Math.random() * 90000) + 10000}</p>
                            </div>
                            <p className="text-sm font-medium text-slate-600 px-6">Nossa equipe técnica entrará em contato em instantes via e-mail corporativo.</p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Canal Direto</p>
                                <p className="text-sm text-slate-600 font-medium leading-relaxed">Olá! Como podemos ajudar na operação hoje? Se houver um incidente crítico, use o botão de emergência.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Assunto</label>
                                    <input type="text" placeholder="Ex: Falha no acesso ao ERP" className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Mensagem</label>
                                    <textarea rows={4} placeholder="Descreva o ocorrido..." className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none font-bold"></textarea>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                {!submitted && (
                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 shrink-0">
                        <button
                            onClick={handleEmergency}
                            className="flex-1 py-3.5 bg-red-100 text-red-600 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-200 transition-colors active:scale-95 border border-red-200"
                        >
                            Emergência
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={isSubmitting}
                            className={`flex-[2] py-3.5 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center space-x-2 active:scale-95 shadow-lg bg-primary ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            {isSubmitting ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Enviar Chamado</span>
                                    <IconRenderer name="Send" className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export const SLAModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const metrics = [
        { label: 'Uptime Global', value: '99.98%', color: 'emerald', icon: 'Shield' },
        { label: 'Latência Ásia/Américas', value: '45ms', color: 'blue', icon: 'Zap' },
        { label: 'Suporte N1 (Médio)', value: '12min', color: 'blue', icon: 'Clock' },
        { label: 'Incidentes Ativos', value: '0', color: 'emerald', icon: 'HeartPulse' }
    ];

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 p-10 text-center border border-slate-100 overflow-hidden relative">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />

                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 border-4 border-emerald-100 rotate-3 transition-transform hover:rotate-0">
                    <IconRenderer name="Activity" className="w-10 h-10" />
                </div>

                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Status do Ecossistema</h2>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2 px-8">Disponibilidade e Performance em Tempo Real</p>

                <div className="mt-8 grid grid-cols-2 gap-4">
                    {metrics.map((m, i) => (
                        <div key={i} className="bg-slate-50 p-5 rounded-3xl border border-slate-100 hover:border-blue-100 transition-colors group">
                            <div className="flex items-center space-x-2 mb-2">
                                <IconRenderer name={m.icon as any} className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{m.label}</span>
                            </div>
                            <span className={`text-xl font-black ${m.color === 'emerald' ? 'text-emerald-500' : 'text-blue-600'}`}>
                                {m.value}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="mt-6 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 flex items-center justify-center space-x-3">
                    <div className="relative">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping absolute inset-0" />
                        <div className="w-3 h-3 bg-emerald-500 rounded-full relative" />
                    </div>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Todos os sistemas operacionais</span>
                </div>

                <button onClick={onClose} className="mt-8 w-full py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:scale-[1.02] active:scale-95 transition-all">Fechar Painel</button>
            </div>
        </div>
    );
};


export const ProfileModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    currentUser: User;
    onUpdateUser?: (user: User) => void;
    onShowMessage?: (message: string, title?: string, type?: 'warning' | 'info' | 'error') => void;
}> = ({ isOpen, onClose, currentUser, onUpdateUser, onShowMessage }) => {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${currentUser.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            if (onUpdateUser) {
                onUpdateUser({ ...currentUser, avatarUrl: publicUrl });
            }
        } catch (error: any) {
            onShowMessage?.('Erro ao fazer upload da imagem: ' + error.message, 'Erro de Upload', 'error');
        } finally {
            setUploading(false);
        }
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 p-10 border border-slate-200">
                <div className="flex justify-between items-start mb-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Meu Perfil</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors"><IconRenderer name="X" className="w-5 h-5 text-slate-400" /></button>
                </div>
                <div className="flex flex-col items-center mb-8">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-white shadow-xl mb-4 relative bg-white flex items-center justify-center">
                            <img src={currentUser.avatarUrl || `https://i.pravatar.cc/150?u=${currentUser.id}`} className="w-full h-full object-cover" alt="" />
                            {uploading && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                </div>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all active:scale-90 border-4 border-white"
                        >
                            <IconRenderer name="Camera" className="w-4 h-4" />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileUpload}
                            disabled={uploading}
                        />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{currentUser.name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{currentUser.role}</p>
                </div>
                <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">E-mail Corporativo</p>
                        <p className="text-sm font-bold text-slate-700">{currentUser.email}</p>
                    </div>
                </div>

                <div className="mt-6">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 ml-1">Sua Cor Preferida</p>
                    <div className="grid grid-cols-6 gap-2 p-1">
                        {[
                            { name: 'Navy', color: '#0f172a' },
                            { name: 'Azul', color: '#2563eb' },
                            { name: 'Roxo', color: '#7c3aed' },
                            { name: 'Rosa', color: '#db2777' },
                            { name: 'Vermelho', color: '#dc2626' },
                            { name: 'Verde Print', color: '#82e622' },
                            { name: 'Laranja Print', color: '#ff4d00' },
                            { name: 'Amarelo Print', color: '#ffc400' },
                            { name: 'Emerald', color: '#10b981' },
                            { name: 'Indigo', color: '#4f46e5' },
                            { name: 'Slate', color: '#475569' },
                            { name: 'Rose', color: '#e11d48' },
                        ].map((c) => (
                            <button
                                key={c.color}
                                type="button"
                                onClick={() => onUpdateUser?.({ ...currentUser, primaryColor: c.color })}
                                className={`group relative w-full aspect-square rounded-xl transition-all active:scale-90 flex items-center justify-center ${currentUser.primaryColor === c.color ? 'ring-2 ring-primary ring-offset-2' : 'hover:scale-105 shadow-sm'}`}
                                style={{ backgroundColor: c.color }}
                                title={c.name}
                            >
                                {currentUser.primaryColor === c.color && (
                                    <IconRenderer name="Check" className="w-4 h-4 text-white drop-shadow-md" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <button onClick={onClose} className="mt-8 w-full py-4 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:opacity-90 active:scale-95 transition-all bg-primary">Fechar</button>
            </div>
        </div>
    );
};
