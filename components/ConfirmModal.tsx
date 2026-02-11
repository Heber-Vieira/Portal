
import React from 'react';
import { IconRenderer } from './IconRenderer.tsx';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 p-8 text-center border border-slate-100">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-red-50/50">
          <IconRenderer name="Trash2" className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight uppercase">{title}</h3>
        <p className="text-slate-500 font-medium leading-relaxed mb-10 px-4">{message}</p>
        <div className="flex space-x-4">
          <button 
            onClick={onClose}
            className="flex-1 px-6 py-4 bg-slate-50 text-slate-600 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-100 transition-all active:scale-95 border border-slate-100"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 px-6 py-4 bg-red-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-red-700 shadow-xl shadow-red-500/30 transition-all active:scale-95"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};
