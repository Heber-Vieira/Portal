
import React, { useState } from 'react';
import { IconRenderer } from './IconRenderer.tsx';
import { ConfirmModal } from './ConfirmModal.tsx';
import { Category } from '../types.ts';

interface ManageCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onAdd: (category: string) => void;
  onRemove: (category: string) => void;
  onRename: (oldName: string, newName: string) => void;
  onToggleVisibility: (category: string) => void;
  onSave?: (categories: Category[]) => Promise<void>;
  onShowMessage?: (message: string, title?: string, type?: 'warning' | 'info' | 'error') => void;
}

export const ManageCategoriesModal: React.FC<ManageCategoriesModalProps> = ({
  isOpen,
  onClose,
  categories,
  onAdd,
  onRemove,
  onRename,
  onToggleVisibility,
  onSave,
  onShowMessage
}) => {
  const [newCat, setNewCat] = useState('');
  const [catToDelete, setCatToDelete] = useState<string | null>(null);
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [localCats, setLocalCats] = useState<Category[]>(categories);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sincronizar estado local quando as categorias mudarem externamente (ex: adição/remoção)
  React.useEffect(() => {
    setLocalCats(categories);
  }, [categories]);

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCat.trim()) {
      onAdd(newCat.trim());
      setNewCat('');
    }
  };

  const startEditing = (name: string) => {
    setEditingCat(name);
    setEditValue(name);
  };

  const handleRename = (oldName: string) => {
    if (editValue.trim() && editValue.trim() !== oldName) {
      onRename(oldName, editValue.trim());
    }
    setEditingCat(null);
  };

  const confirmRemoval = () => {
    if (catToDelete) {
      onRemove(catToDelete);
      setCatToDelete(null);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 flex flex-col max-h-[90vh]">
          <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 shrink-0">
            <h2 className="text-xl font-bold text-[#1e293b]">Gerenciar Categorias</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
              <IconRenderer name="X" className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
            <form onSubmit={handleAdd} className="flex space-x-2 mb-6">
              <input
                type="text"
                placeholder="Nova categoria..."
                className="flex-1 px-4 py-3.5 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 border border-slate-200 outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm font-bold shadow-sm"
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
              />
              <button
                type="submit"
                className="bg-primary text-white p-4 rounded-xl hover:opacity-90 transition-all shadow-lg active:scale-95"
              >
                <IconRenderer name="Plus" className="w-5 h-5" />
              </button>
            </form>

            <div className="space-y-2.5 pr-1">
              {[...localCats]
                .sort((a, b) => {
                  const nameA = a.name.toUpperCase();
                  const nameB = b.name.toUpperCase();
                  if (nameA === 'OUTROS' || nameA === 'OUTRO' || nameA === 'OUTRAS') return 1;
                  if (nameB === 'OUTROS' || nameB === 'OUTRO' || nameB === 'OUTRAS') return -1;
                  return nameA.localeCompare(nameB, 'pt', { sensitivity: 'base' });
                })
                .map((cat) => (
                  <div key={cat.name} className="flex flex-col p-4 bg-[#f8fafc] rounded-2xl border border-slate-100 transition-all hover:border-slate-200 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">

                        <button
                          onClick={() => {
                            const newVisibility = !cat.isVisible;
                            setLocalCats(prev => prev.map(c => c.name === cat.name ? { ...c, isVisible: newVisibility } : c));
                            // onToggleVisibility(cat.name);
                          }}
                          className={`p-1.5 rounded-lg transition-all shrink-0 ${cat.isVisible ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}
                          title={cat.isVisible ? "Ocultar Categoria" : "Exibir Categoria"}
                        >
                          <IconRenderer name="Bell" className="w-3.5 h-3.5" />
                        </button>

                        {editingCat === cat.name ? (
                          <div className="flex items-center space-x-1 flex-1">
                            <input
                              autoFocus
                              type="text"
                              className="flex-1 bg-white border border-blue-200 rounded px-2 py-1 text-sm font-bold outline-none focus:ring-1 focus:ring-blue-500"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleRename(cat.name)}
                            />
                            <button onClick={() => handleRename(cat.name)} className="p-1 text-emerald-500 hover:bg-emerald-50 rounded"><IconRenderer name="Check" className="w-4 h-4" /></button>
                            <button onClick={() => setEditingCat(null)} className="p-1 text-red-400 hover:bg-red-50 rounded"><IconRenderer name="X" className="w-4 h-4" /></button>
                          </div>
                        ) : (
                          <span className={`font-black text-xs uppercase tracking-wider truncate ${cat.isVisible ? 'text-[#334155]' : 'text-slate-400 line-through'}`}>{cat.name}</span>
                        )}
                      </div>

                      {editingCat !== cat.name && (
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => startEditing(cat.name)}
                            className={`p-2 rounded-lg transition-colors text-slate-300 hover:text-blue-500 hover:bg-blue-50 ${cat.name === 'Outros' ? 'hidden' : ''}`}
                          >
                            <IconRenderer name="Edit2" className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setCatToDelete(cat.name)}
                            disabled={cat.name === 'Outros'}
                            className={`p-2 rounded-lg transition-colors ${cat.name === 'Outros' ? 'opacity-0 pointer-events-none' : 'text-slate-300 hover:text-red-500 hover:bg-red-50'}`}
                          >
                            <IconRenderer name="Trash2" className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="px-6 py-6 bg-slate-50 border-t border-slate-100 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3.5 bg-white border border-slate-200 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-all active:scale-95"
            >
              Cancelar
            </button>
            <button
              onClick={async () => {
                if (onSave) {
                  // Final duplicate check
                  const names = localCats.map(c => c.name.toLowerCase());
                  const hasDuplicates = names.some((name, index) => names.indexOf(name) !== index);

                  if (hasDuplicates) {
                    onShowMessage?.('Existem categorias com nomes repetidos. Por favor, corrija antes de salvar.', 'Nomes Duplicados', 'warning');
                    return;
                  }

                  setIsSaving(true);
                  await onSave(localCats);
                  setIsSaving(false);
                  setSaved(true);
                  setTimeout(() => {
                    setSaved(false);
                    onClose();
                  }, 800);
                }
              }}
              className="flex-[2] px-4 py-3.5 bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:opacity-90 transition-all shadow-lg active:scale-95 flex items-center justify-center space-x-2"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : saved ? (
                <>
                  <IconRenderer name="Check" className="w-4 h-4" />
                  <span>Salvo!</span>
                </>
              ) : (
                <span>Salvar Modificações</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!catToDelete}
        onClose={() => setCatToDelete(null)}
        onConfirm={confirmRemoval}
        title="Excluir Categoria"
        message={`Tem certeza que deseja remover a categoria "${catToDelete}"? Todos os sistemas vinculados a ela serão movidos para "Outros".`}
      />
    </>
  );
};
