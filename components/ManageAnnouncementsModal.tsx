
import React, { useState, useEffect } from 'react';
import { IconRenderer } from './IconRenderer';
import { supabase } from '../supabase';
import { Announcement } from '../types';
import { LATEST_VERSION, SystemVersion } from '../constants/changelog';
import { FeatureAnnouncementModal } from './FeatureAnnouncementModal';

interface ManageAnnouncementsModalProps {
    isOpen: boolean;
    onClose: () => void;
    isDarkMode: boolean;
    onShowMessage?: (message: string, title?: string, type?: 'warning' | 'info' | 'error') => void;
}

export const ManageAnnouncementsModal: React.FC<ManageAnnouncementsModalProps> = ({ isOpen, onClose, isDarkMode, onShowMessage }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [features, setFeatures] = useState<{ title: string; description: string; icon: string; created_at?: string }[]>([]);
    const [displayDuration, setDisplayDuration] = useState(7);
    const [isActive, setIsActive] = useState(true);
    const [version, setVersion] = useState('');
    const [pendingUpdate, setPendingUpdate] = useState<SystemVersion | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState<Announcement | null>(null);

    // Check for updates on mount
    useEffect(() => {
        if (isOpen) {
            checkForSystemUpdates();
        }
    }, [isOpen]);

    const checkForSystemUpdates = async () => {
        try {
            // Check if latest version exists in DB
            const { data } = await supabase
                .from('announcements')
                .select('version')
                .eq('version', LATEST_VERSION.version)
                .maybeSingle();

            if (!data) {
                setPendingUpdate(LATEST_VERSION);
                onShowMessage?.(`Nova versão ${LATEST_VERSION.version} detectada no sistema!`, 'Novidades', 'info');
            }
        } catch (error) {
            console.error('Error checking updates:', error);
        }
    };

    const handleImportUpdate = () => {
        if (!pendingUpdate) return;
        setTitle(pendingUpdate.title);
        setDescription(pendingUpdate.description);
        setFeatures(pendingUpdate.features.map(f => ({
            ...f,
            created_at: new Date().toISOString()
        })));
        setVersion(pendingUpdate.version);
        setDisplayDuration(7);
        setPendingUpdate(null);
        onShowMessage?.('Dados da atualização importados com sucesso!', 'Importado', 'info');
    };

    const handleAddFeature = () => {
        setFeatures([...features, {
            title: 'Nova Feature',
            description: 'Descrição da funcionalidade...',
            icon: 'Star',
            created_at: new Date().toISOString()
        }]);
    };

    const handleFeatureChange = (index: number, field: string, value: string) => {
        const newFeatures = [...features];
        newFeatures[index] = { ...newFeatures[index], [field]: field === 'icon' ? value : value };
        setFeatures(newFeatures);
    };

    const handleRemoveFeature = (index: number) => {
        const newFeatures = features.filter((_, i) => i !== index);
        setFeatures(newFeatures);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error: dbError } = await supabase.from('announcements').insert({
                title,
                description,
                features,
                display_duration: displayDuration,
                is_active: isActive,
                version: version || null
            });

            if (dbError) throw dbError;

            onShowMessage?.('Anúncio criado com sucesso!', 'Sucesso', 'info');
            onClose();
        } catch (error: any) {
            console.error(error);
            onShowMessage?.('Erro ao criar anúncio: ' + error.message, 'Erro', 'error');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className={`${isDarkMode ? 'bg-[#1e293b] text-white border-white/10' : 'bg-white text-slate-900 border-slate-200'} w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col border`}>
                <div className="px-6 py-6 border-b border-slate-500/10 flex justify-between items-center shrink-0">
                    <h2 className="text-xl font-black tracking-tighter uppercase">Gerenciar Anúncios</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-500/10 rounded-full transition-colors">
                        <IconRenderer name="X" className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-6">
                    {pendingUpdate && (
                        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-4">
                            <div>
                                <h3 className="text-sm font-black text-blue-500 uppercase flex items-center gap-2">
                                    <IconRenderer name="Sparkles" className="w-4 h-4" />
                                    Nova Versão Detectada: {pendingUpdate.version}
                                </h3>
                                <p className={`text-xs mt-1 ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                                    O código fonte contém novas features não publicadas.
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPreviewData({
                                            id: 'preview-auto',
                                            title: pendingUpdate.title,
                                            description: pendingUpdate.description,
                                            features: pendingUpdate.features as any,
                                            display_duration: 7,
                                            is_active: true,
                                            created_at: new Date().toISOString()
                                        });
                                        setShowPreview(true);
                                    }}
                                    className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all border ${isDarkMode ? 'border-blue-500/30 text-blue-400 hover:bg-blue-500/10' : 'border-blue-200 text-blue-600 hover:bg-blue-50'}`}
                                >
                                    Ver Prévia
                                </button>
                                <button
                                    type="button"
                                    onClick={handleImportUpdate}
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors shadow-lg active:scale-95"
                                >
                                    Importar Dados
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 block">Título</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ex: Grand Lançamento v2.0"
                                className={`w-full px-4 py-3 rounded-xl border outline-none font-bold text-sm transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 focus:bg-slate-700' : 'bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500'}`}
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 block">Descrição da Celebração</label>
                            <textarea
                                rows={2}
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Uma mensagem curta e empolgante..."
                                className={`w-full px-4 py-3 rounded-xl border outline-none font-medium text-sm transition-all resize-none ${isDarkMode ? 'bg-slate-800 border-slate-700 focus:bg-slate-700' : 'bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500'}`}
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 block">Período de Exibição (Dias)</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="number"
                                    min="1"
                                    max="90"
                                    value={displayDuration}
                                    onChange={(e) => setDisplayDuration(parseInt(e.target.value) || 1)}
                                    className={`w-24 px-4 py-3 rounded-xl border outline-none font-black text-center text-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <div className="flex-1 h-2 bg-slate-200 rounded-full relative overflow-hidden">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
                                        style={{ width: `${(displayDuration / 30) * 100}%` }}
                                    />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase w-20">dias ativos</span>
                            </div>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-2">
                                O anúncio expira automaticamente após este período para cada item.
                            </p>
                        </div>

                        <div className="col-span-2 flex items-center justify-between p-4 rounded-xl border border-slate-200/50 bg-slate-50/50">
                            <div>
                                <p className="text-xs font-black uppercase text-slate-700">Status Ativo</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Habilitar visibilidade para usuários</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsActive(!isActive)}
                                className={`w-10 h-6 rounded-full relative transition-all duration-300 border ${isActive ? 'bg-emerald-500 border-emerald-500' : 'bg-slate-300 border-slate-300'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${isActive ? 'translate-x-[18px]' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-slate-500/10 pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-black uppercase tracking-tight">Features em Destaque</h3>
                            <button
                                type="button"
                                onClick={handleAddFeature}
                                className="px-3 py-1.5 bg-blue-500/10 text-blue-500 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-500/20 active:scale-95 transition-all flex items-center gap-1"
                            >
                                <IconRenderer name="Plus" className="w-3 h-3" />
                                Adicionar
                            </button>
                        </div>

                        <div className="space-y-3">
                            {features.map((feat, idx) => (
                                <div key={idx} className={`p-4 rounded-xl border flex gap-3 group items-start ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
                                    <div className="flex-1 grid grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            placeholder="Título da Feature"
                                            value={feat.title}
                                            onChange={(e) => handleFeatureChange(idx, 'title', e.target.value)}
                                            className={`col-span-2 px-3 py-2 rounded-lg text-xs font-bold outline-none border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                                        />
                                        <div className="col-span-2 flex gap-2">
                                            <div className="relative w-1/3">
                                                <input
                                                    type="text"
                                                    placeholder="Icon (Lucide)"
                                                    value={feat.icon}
                                                    onChange={(e) => handleFeatureChange(idx, 'icon', e.target.value)}
                                                    className={`w-full px-3 py-2 pl-9 rounded-lg text-xs font-bold outline-none border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                                                />
                                                <div className="absolute left-2.5 top-2.5 opacity-50">
                                                    <IconRenderer name={feat.icon} className="w-4 h-4" />
                                                </div>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Descrição curta..."
                                                value={feat.description}
                                                onChange={(e) => handleFeatureChange(idx, 'description', e.target.value)}
                                                className={`flex-1 px-3 py-2 rounded-lg text-xs outline-none border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFeature(idx)}
                                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <IconRenderer name="Trash2" className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </form>

                <div className="p-6 border-t border-slate-500/10 flex justify-end gap-3 shrink-0">
                    <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-colors">Cancelar</button>
                    <button
                        type="button"
                        onClick={() => setShowPreview(true)}
                        className={`px-6 py-3 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                        Visualizar
                    </button>
                    <button onClick={handleSubmit} className="px-8 py-3 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all">Publicar Anúncio</button>
                </div>
            </div>

            {showPreview && (
                <FeatureAnnouncementModal
                    announcement={previewData || {
                        id: 'preview',
                        title: title || 'Título do Anúncio',
                        description: description || 'Sua descrição aparecerá aqui.',
                        features: features.length > 0 ? (features as any) : [{ title: 'Título da Feature', description: 'Descrição da funcionalidade', icon: 'Star' }],
                        display_duration: displayDuration,
                        is_active: isActive,
                        created_at: new Date().toISOString()
                    }}
                    onClose={() => {
                        setShowPreview(false);
                        setPreviewData(null);
                    }}
                    isDarkMode={isDarkMode}
                />
            )}
        </div>
    );
};
