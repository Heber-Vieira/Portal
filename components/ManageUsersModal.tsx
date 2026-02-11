
import React, { useState } from 'react';
import { IconRenderer } from './IconRenderer';
import { User, SaaSLink } from '../types';
import { UserModal } from './UserModal';

interface ManageUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  apps: SaaSLink[];
  onAdd: (user: User, password?: string) => void;
  onUpdate: (user: User, password?: string) => void;
  onRemove: (userId: string) => void;
  currentUserId: string;
  onShowMessage?: (message: string, title?: string, type?: 'warning' | 'info' | 'error') => void;
}

export const ManageUsersModal: React.FC<ManageUsersModalProps> = ({
  isOpen,
  onClose,
  users,
  apps,
  onAdd,
  onUpdate,
  onRemove,
  currentUserId,
  onShowMessage
}) => {
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 flex flex-col max-h-[85vh]">
          <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <div>
              <h2 className="text-xl font-bold text-[#1e293b]">Gerenciar Usuários</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Controle de Acessos NexusPro</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsAddingUser(true)}
                className="bg-primary text-white px-4 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center space-x-2 hover:opacity-90 transition-all shadow-lg active:scale-95"
              >
                <IconRenderer name="Plus" className="w-3.5 h-3.5" />
                <span>Novo Usuário</span>
              </button>
              <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <IconRenderer name="X" className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-3 custom-scrollbar">
            {users.map((user) => (
              <div
                key={user.id}
                className={`flex items-center justify-between p-4 rounded-[1.5rem] border transition-all ${user.isActive ? 'bg-white border-slate-100 hover:border-slate-300' : 'bg-slate-50 border-slate-100 opacity-60'}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-slate-50 shrink-0">
                    <img src={user.avatarUrl} className="w-full h-full object-cover grayscale" alt="" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#0f172a]">{user.name} {user.id === currentUserId && <span className="text-[10px] text-blue-500 ml-1">(Você)</span>}</h3>
                    <p className="text-[11px] text-slate-400 font-medium">{user.email}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${user.role === 'Administrador' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                      {user.role}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setEditingUser(user)}
                    className="p-2.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                    title="Editar"
                  >
                    <IconRenderer name="Edit2" className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRemove(user.id)}
                    disabled={user.id === currentUserId}
                    className={`p-2.5 rounded-xl transition-all ${user.id === currentUserId ? 'opacity-0' : 'text-slate-300 hover:text-red-500 hover:bg-red-50'}`}
                    title="Remover"
                  >
                    <IconRenderer name="Trash2" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100">
            <button
              onClick={onClose}
              className="w-full px-4 py-3.5 bg-white border border-slate-200 text-[#1e293b] font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-slate-100 transition-all active:scale-95"
            >
              Concluir Gerenciamento
            </button>
          </div>
        </div>
      </div>

      <UserModal
        isOpen={isAddingUser || !!editingUser}
        onClose={() => { setIsAddingUser(false); setEditingUser(null); }}
        onSave={(u, p) => editingUser ? onUpdate(u, p) : onAdd(u, p)}
        initialData={editingUser}
        apps={apps}
        onShowMessage={onShowMessage}
      />
    </>
  );
};
