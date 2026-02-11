
import React, { useState, useEffect, useRef } from 'react';
import { SaaSLink, SaaSCategory } from '../types.ts';
import { IconRenderer } from './IconRenderer.tsx';
import { ICON_OPTIONS } from '../constants.tsx';

interface SaaSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (saas: SaaSLink) => void;
  initialData?: SaaSLink | null;
  categories: string[];
}

export const SaaSModal: React.FC<SaaSModalProps> = ({ isOpen, onClose, onSave, initialData, categories }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    category: 'Outros' as SaaSCategory,
    icon: 'Globe',
    accentColor: '#3b82f6',
    imageUrl: '',
    isActive: true,
    isVisibleToUsers: true
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        url: initialData.url,
        description: initialData.description,
        category: initialData.category,
        icon: initialData.icon,
        accentColor: initialData.accentColor,
        imageUrl: initialData.imageUrl || '',
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
        isVisibleToUsers: initialData.isVisibleToUsers !== undefined ? initialData.isVisibleToUsers : true
      });
    } else {
      setFormData({
        name: '',
        url: '',
        description: '',
        category: 'Outros' as SaaSCategory,
        icon: 'Globe',
        accentColor: '#3b82f6',
        imageUrl: '',
        isActive: true,
        isVisibleToUsers: true
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const saasData: SaaSLink = {
      ...formData,
      id: initialData ? initialData.id : Math.random().toString(36).substr(2, 9),
      isPinned: initialData ? initialData.isPinned : false,
    };
    onSave(saasData);
    onClose();
  };

  const Toggle = ({ active, onToggle, label, sublabel }: { active: boolean, onToggle: () => void, label: string, sublabel: string }) => (
    <div className="col-span-2 flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
      <div>
        <span className="block text-sm font-bold text-slate-700">{label}</span>
        <span className="text-xs text-slate-500 font-medium">{sublabel}</span>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`w-[48px] h-[28px] rounded-full relative transition-all duration-300 ease-in-out ${active ? 'bg-[#10b981]' : 'bg-slate-300'}`}
      >
        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ease-in-out ${active ? 'left-[24px]' : 'left-1'}`}></div>
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? 'Editar Ativo Digital' : 'Novo Ativo Digital'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <IconRenderer name="X" className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nome do Sistema</label>
              <input
                required
                type="text"
                placeholder="Ex: Sigma Maintenance"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">URL de Acesso</label>
              <div className="relative">
                <IconRenderer name="Globe" className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  required
                  type="url"
                  placeholder="https://app.sigma.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
                  value={formData.url}
                  onChange={e => setFormData({ ...formData, url: e.target.value })}
                />
              </div>
            </div>

            <Toggle
              active={formData.isActive}
              onToggle={() => setFormData({ ...formData, isActive: !formData.isActive })}
              label="Link Ativo"
              sublabel="Habilitar botão de acesso no portal"
            />

            <Toggle
              active={formData.isVisibleToUsers}
              onToggle={() => setFormData({ ...formData, isVisibleToUsers: !formData.isVisibleToUsers })}
              label="Visível para Usuários"
              sublabel="Define se usuários comuns podem ver este item"
            />

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Categoria</label>
              <select
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all appearance-none font-medium cursor-pointer"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as SaaSCategory })}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Cor de Destaque</label>
              <div className="flex items-center space-x-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
                <input
                  type="color"
                  className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
                  value={formData.accentColor}
                  onChange={e => setFormData({ ...formData, accentColor: e.target.value })}
                />
                <span className="text-xs text-slate-600 font-mono font-bold uppercase">{formData.accentColor}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Representação Visual</label>
            <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <IconRenderer name={formData.icon} className="w-8 h-8 text-slate-300" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white px-4 py-2.5 rounded-lg hover:bg-slate-800 transition-all w-full shadow-md active:scale-95"
                >
                  Upload Imagem
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {formData.imageUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, imageUrl: '' })}
                    className="text-[9px] font-bold text-red-500 uppercase tracking-widest hover:text-red-700 transition-colors w-full text-center"
                  >
                    Remover Imagem
                  </button>
                )}
              </div>
            </div>
          </div>

          {!formData.imageUrl && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Escolha um Ícone</label>
              <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto p-3 bg-slate-50 border border-slate-100 rounded-xl custom-scrollbar">
                {ICON_OPTIONS.map(iconName => (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: iconName })}
                    className={`p-2.5 flex items-center justify-center rounded-lg transition-all ${formData.icon === iconName ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white text-slate-400 hover:text-slate-600 border border-slate-100 hover:border-slate-300'}`}
                  >
                    <IconRenderer name={iconName} className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Descrição Breve</label>
            <textarea
              rows={2}
              placeholder="Descreva a finalidade deste SaaS..."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all resize-none font-medium"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="pt-4 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all text-xs uppercase tracking-widest active:scale-95"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all text-xs uppercase tracking-widest active:scale-95"
            >
              {initialData ? 'Salvar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
