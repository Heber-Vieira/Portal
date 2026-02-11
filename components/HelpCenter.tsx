
import React, { useState, useMemo, useEffect } from 'react';
import { IconRenderer } from './IconRenderer';
import { SaaSLink } from '../types';

interface HelpCenterProps {
    isOpen: boolean;
    onClose: () => void;
    isDarkMode?: boolean;
    links: SaaSLink[]; // Adicionado para automação
}

type TabType = 'docs' | 'support' | 'status' | 'faq';

export const HelpCenter: React.FC<HelpCenterProps> = ({ isOpen, onClose, isDarkMode, links }) => {
    const [activeTab, setActiveTab] = useState<TabType>('docs');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDoc, setSelectedDoc] = useState<any>(null);
    const [supportStep, setSupportStep] = useState<'form' | 'success'>('form');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Geração Automática de Documentação baseada nas Funcionalidades (Links)
    const baseDocs = [
        { id: 'sec-v4', title: 'Protocolos de Segurança v4', cat: 'Compliance', icon: 'Shield', content: 'A política de senhas exige 12 caracteres, incluindo símbolos e números. A troca é obrigatória a cada 90 dias conforme auditoria ISO 27001.' },
        { id: 'infra-rem', title: 'Guia de Acesso Remoto', cat: 'Infraestrutura', icon: 'Globe', content: 'Para acessar remotamente, utilize a VPN industrial através do gateway 10.0.0.1. Certifique-se de que seu token MFA está ativo no dispositivo autorizado.' }
    ];

    const generatedDocs = useMemo(() => {
        // Mapeia cada sistema para um item de documentação automático
        const systemDocs = links.map(link => ({
            id: `sys-${link.id}`,
            title: `Manual: ${link.name}`,
            cat: link.category,
            icon: link.icon,
            content: `Documentação oficial para o sistema ${link.name}. Este sistema faz parte da categoria ${link.category} e destina-se a: ${link.description}. Para acessar, utilize a URL oficial: ${link.url}. Caso encontre dificuldades técnicas, abra um chamado na aba lateral.`
        }));

        return [...baseDocs, ...systemDocs];
    }, [links]);

    const faqs = [
        { q: 'Como solicitar novo acesso?', a: 'Abra um chamado na aba de suporte indicando qual sistema Nexus você precisa acessar e o motivo.' },
        { q: 'Esqueci minha senha do ERP', a: 'Utilize o portal de autoatendimento Nexus Identity ou entre em contato com o ramal 445.' },
        { q: 'Instabilidade no Dashboards', a: 'Verifique a aba de Status para ver se há manutenções programadas no Data Lake.' }
    ];

    const metrics = [
        { label: 'Uptime Global', value: '99.98%', status: 'optimal' },
        { label: 'Latência Redes', value: '42ms', status: 'optimal' },
        { label: 'SLA Atendimento', value: '18min', status: 'optimal' },
        { label: 'Incidentes Atuais', value: '0', status: 'clear' }
    ];

    const filteredDocs = useMemo(() => {
        return generatedDocs.filter(doc =>
            doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.cat.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [generatedDocs, searchQuery]);

    // Cleanup when closing
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setActiveTab('docs');
                setSearchQuery('');
                setSelectedDoc(null);
                setSupportStep('form');
                setIsSubmitting(false);
            }, 300);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSupportSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setSupportStep('success');
        }, 1500);
    };

    const handleEmergency = () => {
        const message = encodeURIComponent("🚨 EMERGÊNCIA NEXUSPRO: Necessito de suporte imediato em um incidente crítico.");
        window.open(`https://wa.me/5500000000000?text=${message}`, '_blank');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-900/40 backdrop-blur-[8px] animate-in fade-in duration-300">
            <div className={`
                relative w-full max-w-4xl h-full max-h-[700px] 
                ${isDarkMode ? 'bg-[#0f172a] border-white/5 text-white' : 'bg-white border-slate-200 text-slate-900'} 
                rounded-[2.5rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] 
                flex flex-col overflow-hidden border animate-in zoom-in-95 duration-500
            `}>

                {/* Header Section */}
                <div className={`px-8 py-8 border-b ${isDarkMode ? 'border-white/5' : 'border-slate-50'} flex justify-between items-center shrink-0`}>
                    <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl bg-primary`}>
                            <IconRenderer name="LifeBuoy" className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tighter uppercase leading-none">Nexus Intel</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1.5 flex items-center space-x-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span>Sistema Operacional</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-3 rounded-2xl transition-all active:scale-90 ${isDarkMode ? 'bg-white/5 text-slate-400 hover:text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900'}`}
                    >
                        <IconRenderer name="X" className="w-5 h-5" />
                    </button>
                </div>

                {/* Main Interaction Area */}
                <div className="flex-1 flex flex-col md:flex-row min-h-0">

                    {/* Sidebar Nav */}
                    <div className={`w-full md:w-64 p-6 border-r ${isDarkMode ? 'border-white/5 bg-black/10' : 'border-slate-50 bg-slate-50/50'} flex flex-row md:flex-col gap-2`}>
                        {[
                            { id: 'docs', label: 'Documentos', icon: 'BookOpen' },
                            { id: 'faq', label: 'FAQ', icon: 'HelpCircle' },
                            { id: 'support', label: 'Suporte', icon: 'Send' },
                            { id: 'status', label: 'Status', icon: 'Activity' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id as TabType); setSelectedDoc(null); }}
                                className={`
                                    flex-1 md:flex-none flex items-center md:space-x-4 p-4 rounded-2xl transition-all duration-300 group
                                    ${activeTab === tab.id
                                        ? 'bg-primary text-white shadow-lg scale-102'
                                        : (isDarkMode ? 'text-slate-400 hover:bg-white/5' : 'text-slate-500 hover:bg-white hover:shadow-sm')
                                    }
                                `}
                            >
                                <IconRenderer name={tab.icon} className={`w-5 h-5 transition-transform group-hover:scale-110`} />
                                <span className="hidden md:block text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 flex flex-col min-h-0 bg-transparent">

                        {/* Tab Content: Documents */}
                        {activeTab === 'docs' && (
                            <div className="flex-1 flex flex-col p-8 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                                {selectedDoc ? (
                                    <div className="flex flex-col h-full space-y-6">
                                        <button
                                            onClick={() => setSelectedDoc(null)}
                                            className="flex items-center space-x-2 text-[10px] font-black uppercase text-primary tracking-widest hover:translate-x-[-4px] transition-transform"
                                        >
                                            <IconRenderer name="ChevronRight" className="w-3 h-3 rotate-180" />
                                            <span>Voltar para Lista</span>
                                        </button>
                                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
                                            <h3 className="text-3xl font-black tracking-tighter uppercase mb-2">{selectedDoc.title}</h3>
                                            <div className="flex items-center space-x-2 mb-8">
                                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-white/10 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{selectedDoc.cat}</span>
                                            </div>
                                            <div className={`prose prose-sm max-w-none ${isDarkMode ? 'prose-invert' : ''}`}>
                                                <p className="text-lg leading-relaxed font-medium opacity-80">{selectedDoc.content}</p>
                                                <div className="mt-8 p-6 rounded-3xl border border-dashed border-slate-500/20 opacity-50">
                                                    <p className="text-[10px] font-bold uppercase text-center italic">Documentação técnica reservada. Para detalhes confidenciais, acesse o servidor Nexus Secure.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="relative mb-8 group">
                                            <IconRenderer name="Search" className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                            <input
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="BUSCAR NO CENTRO DE INTELIGÊNCIA..."
                                                className={`
                                                    w-full pl-16 pr-8 py-5 rounded-2xl border-none outline-none transition-all text-xs font-black uppercase tracking-widest
                                                    ${isDarkMode ? 'bg-white/5 text-white focus:bg-white/10 ring-1 ring-white/5 focus:ring-primary/50' : 'bg-slate-50 text-slate-900 focus:bg-white ring-1 ring-slate-100 focus:ring-primary focus:shadow-2xl'}
                                                `}
                                            />
                                        </div>
                                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                {filteredDocs.map((doc, i) => (
                                                    <button
                                                        key={doc.id}
                                                        onClick={() => setSelectedDoc(doc)}
                                                        className={`
                                                            flex items-start p-6 rounded-[1.5rem] border transition-all text-left group relative overflow-hidden active:scale-95
                                                            ${isDarkMode ? 'bg-white/5 border-white/5 hover:border-blue-500/50 hover:bg-blue-500/5' : 'bg-white border-slate-100 hover:border-slate-900 hover:shadow-xl'}
                                                        `}
                                                        style={{ animationDelay: `${i * 50}ms` }}
                                                    >
                                                        <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center transition-all duration-300 ${isDarkMode ? 'bg-white/5 text-slate-400 group-hover:bg-primary group-hover:text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-primary group-hover:text-white'}`}>
                                                            <IconRenderer name={doc.icon} className="w-5 h-5" />
                                                        </div>
                                                        <div className="ml-5 flex-1 pr-4">
                                                            <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">{doc.cat}</p>
                                                            <p className={`text-sm font-black uppercase tracking-tight leading-tight mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{doc.title}</p>
                                                            <div className="flex items-center space-x-1 text-[8px] font-bold text-slate-500 uppercase">
                                                                <span>Ler Artigo</span>
                                                                <IconRenderer name="ChevronRight" className="w-2.5 h-2.5 group-hover:translate-x-1 transition-transform" />
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Tab Content: FAQ */}
                        {activeTab === 'faq' && (
                            <div className="flex-1 flex flex-col p-8 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-right-4 duration-500">
                                <h3 className="text-xl font-black uppercase tracking-tighter mb-8">Dúvidas Frequentes</h3>
                                <div className="space-y-4">
                                    {faqs.map((faq, i) => (
                                        <div key={i} className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                            <p className={`text-xs font-black uppercase tracking-widest mb-3 text-primary`}>{faq.q}</p>
                                            <p className={`text-sm font-medium leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{faq.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tab Content: Support */}
                        {activeTab === 'support' && (
                            <div className="flex-1 flex flex-col p-8 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-right-4 duration-500">
                                {supportStep === 'success' ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                        <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center border-4 animate-in zoom-in duration-500 ${isDarkMode ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-emerald-50 border-emerald-100 text-emerald-500'}`}>
                                            <IconRenderer name="Check" className="w-12 h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-2xl font-black uppercase tracking-tighter">Chamado Aberto</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em]">Protocolo #{Math.floor(Math.random() * 90000) + 10000}</p>
                                        </div>
                                        <p className="text-sm font-medium max-w-[280px] opacity-70">Sua solicitação foi enviada para o NOC. O tempo estimado de resposta é de 15 minutos.</p>
                                        <button
                                            onClick={() => setSupportStep('form')}
                                            className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200'}`}
                                        >
                                            Novo Chamado
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSupportSubmit} className="space-y-6">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className={`flex-1 p-6 rounded-3xl border bg-primary/10 border-primary/20 text-primary`}>
                                                <p className="text-[10px] font-black uppercase tracking-widest mb-1">Central de Ajuda</p>
                                                <p className="text-sm font-bold leading-tight">Canal prioritário para incidentes operacionais.</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleEmergency}
                                                className="flex-1 py-6 bg-red-100 text-red-600 border border-red-200 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-200 transition-all active:scale-95 shadow-xl shadow-red-500/5 flex flex-col items-center justify-center space-y-2"
                                            >
                                                <IconRenderer name="Zap" className="w-5 h-5" />
                                                <span>Emergência 24h</span>
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Assunto Crítico</label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="EX: FALHA DE SINCRONISMO DATA LAKE"
                                                    className={`w-full px-6 py-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-600 font-black uppercase tracking-tight text-xs ${isDarkMode ? 'bg-white/5 text-white' : 'bg-slate-50 text-slate-900'}`}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Detalhes Adicionais</label>
                                                <textarea
                                                    required
                                                    rows={4}
                                                    placeholder="DESCREVA O COMPORTAMENTO DO SISTEMA..."
                                                    className={`w-full px-6 py-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-600 font-medium text-sm resize-none ${isDarkMode ? 'bg-white/5 text-white' : 'bg-slate-50 text-slate-900'}`}
                                                ></textarea>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`
                                                w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center space-x-3 transition-all active:scale-95 shadow-2xl bg-primary text-white
                                                ${isSubmitting ? 'opacity-50 pointer-events-none' : 'hover:opacity-90'}
                                            `}
                                        >
                                            {isSubmitting ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <span>ENVIAR PARA O NOC</span>
                                                    <IconRenderer name="Send" className="w-4 h-4" />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}

                        {/* Tab Content: Status */}
                        {activeTab === 'status' && (
                            <div className="flex-1 flex flex-col p-8 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-right-4 duration-500">
                                <h3 className="text-xl font-black uppercase tracking-tighter mb-8">Saúde do Ecossistema</h3>

                                {/* Global Metrics */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    {metrics.map((m, i) => (
                                        <div key={i} className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'}`}>
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{m.label}</p>
                                            <p className={`text-lg font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{m.value}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Individual Systems Status */}
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">Disponibilidade por Sistema</p>
                                    {links.map((link) => (
                                        <div key={link.id} className={`flex items-center justify-between p-4 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                            <div className="flex items-center space-x-4">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-white/5 text-slate-400' : 'bg-white text-slate-400 shadow-sm'}`}>
                                                    <IconRenderer name={link.icon} className="w-4 h-4" />
                                                </div>
                                                <span className="text-xs font-black uppercase tracking-tight">{link.name}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Operacional</span>
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className={`mt-8 p-6 rounded-3xl border flex items-center space-x-4 ${isDarkMode ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                                    <IconRenderer name="Shield" className="w-5 h-5" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">Todos os sistemas monitorados estão operando dentro dos parâmetros de SLA.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
