
import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole, SaaSLink } from '../types';
import { IconRenderer } from './IconRenderer';
import { supabase } from '../supabase';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User, password?: string) => void;
  initialData?: User | null;
  apps: SaaSLink[];
  onShowMessage?: (message: string, title?: string, type?: 'warning' | 'info' | 'error') => void;
}

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, initialData, apps, onShowMessage }) => {
  const [formData, setFormData] = useState<Omit<User, 'id'> & { password?: string; confirmPassword?: string }>({
    name: '',
    email: '',
    role: 'Usuário',
    isActive: true,
    avatarUrl: '',
    allowedApps: [],
    password: '',
    confirmPassword: ''
  });

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        role: initialData.role,
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
        avatarUrl: initialData.avatarUrl || '',
        allowedApps: initialData.allowedApps || []
      });
      setShowPasswordFields(false);
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'Usuário',
        isActive: true,
        avatarUrl: '',
        allowedApps: [],
        password: '',
        confirmPassword: ''
      });
      setShowPasswordFields(true);
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, avatarUrl: publicUrl }));
    } catch (error: any) {
      onShowMessage?.('Erro ao fazer upload da imagem: ' + error.message, 'Erro de Upload', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let passwordToSave = undefined;

    if (showPasswordFields) {
      if (!formData.password || formData.password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('As senhas não coincidem');
        return;
      }
      passwordToSave = formData.password;
    }

    const { password: _p, confirmPassword: _cp, ...cleanData } = formData;
    const userData: User = {
      ...cleanData as User,
      id: initialData ? initialData.id : Math.random().toString(36).substr(2, 9),
      avatarUrl: formData.avatarUrl || `https://i.pravatar.cc/150?u=${formData.email || Date.now()}`
    };
    onSave(userData, passwordToSave);
    onClose();
  };

  const toggleAppPermission = (appId: string) => {
    setFormData(prev => ({
      ...prev,
      allowedApps: prev.allowedApps?.includes(appId)
        ? prev.allowedApps.filter(id => id !== appId)
        : [...(prev.allowedApps || []), appId]
    }));
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 flex flex-col max-h-[90vh]">
        <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 shrink-0">
          <h2 className="text-xl font-bold text-[#1e293b]">
            {initialData ? 'Editar Usuário' : 'Novo Usuário'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <IconRenderer name="X" className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-slate-50 shadow-xl relative bg-slate-100 flex items-center justify-center">
                {formData.avatarUrl ? (
                  <img src={formData.avatarUrl} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <IconRenderer name="User" className="w-10 h-10 text-slate-300" />
                )}
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
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-4">Clique para alterar foto</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5 ml-1">Nome Completo</label>
              <input
                required
                type="text"
                placeholder="Ex: João Silva"
                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5 ml-1">E-mail Corporativo</label>
              <input
                required
                type="email"
                placeholder="joao.silva@nexus.pro"
                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {/* Redefinição de Senha para Usuários Existentes */}
            {initialData && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Segurança</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Alterar senha de acesso do usuário</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPasswordFields(!showPasswordFields)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${showPasswordFields ? 'bg-blue-600 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  {showPasswordFields ? 'Cancelar Alteração' : 'Redefinir Senha'}
                </button>
              </div>
            )}

            {/* Campos de Senha */}
            {showPasswordFields && (
              <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                    {initialData ? 'Nova Senha' : 'Senha de Acesso'}
                  </label>
                  <div className="relative">
                    <IconRenderer name="Lock" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                      required
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-3.5 pl-11 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm"
                      value={formData.password}
                      onChange={e => {
                        setFormData({ ...formData, password: e.target.value });
                        if (error) setError(null);
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Confirmar Senha</label>
                  <div className="relative">
                    <IconRenderer name="Check" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                      required
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-3.5 pl-11 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm"
                      value={formData.confirmPassword}
                      onChange={e => {
                        setFormData({ ...formData, confirmPassword: e.target.value });
                        if (error) setError(null);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center space-x-2 animate-shake">
                <IconRenderer name="AlertCircle" className="w-4 h-4 text-red-500" />
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5 ml-1">Perfil</label>
                <select
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm appearance-none cursor-pointer"
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
                >
                  <option value="Usuário">Usuário</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5 ml-1">Status</label>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className={`flex-1 px-4 py-3 rounded-xl border font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2 ${formData.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}
                >
                  <div className={`w-2 h-2 rounded-full ${formData.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span>{formData.isActive ? 'Ativo' : 'Inativo'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 ml-1">Aplicativos Permitidos</label>
            <div className="space-y-2 max-h-48 overflow-y-auto p-1 custom-scrollbar">
              {apps.map(app => {
                const isSelected = formData.allowedApps?.includes(app.id);
                return (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => toggleAppPermission(app.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${isSelected ? 'bg-blue-50 border-blue-100 shadow-sm' : 'bg-white border-slate-100'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-white text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                        <IconRenderer name={app.icon} className="w-4 h-4" />
                      </div>
                      <span className={`text-[11px] font-bold ${isSelected ? 'text-blue-900' : 'text-slate-600'}`}>{app.name}</span>
                    </div>
                    <div className={`w-10 h-6 rounded-full relative transition-all ${isSelected ? 'bg-[#10b981]' : 'bg-slate-200'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${isSelected ? 'left-5' : 'left-1'}`}></div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </form>

        <div className="px-6 py-5 border-t border-slate-50 bg-slate-50/30 shrink-0 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3.5 bg-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all active:scale-95"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex-1 px-4 py-3.5 bg-[#0f172a] text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:opacity-95 shadow-xl transition-all active:scale-95"
          >
            {initialData ? 'Salvar Alterações' : 'Criar Conta'}
          </button>
        </div>
      </div>
    </div>
  );
};
