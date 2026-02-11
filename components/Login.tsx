
import React, { useState } from 'react';
import { supabase } from '../supabase';
import { IconRenderer } from './IconRenderer';
import { translateError } from '../utils/errorTranslations';

interface LoginProps {
    onLoginSuccess: (user: any) => void;
    onShowMessage?: (message: string, title?: string, type?: 'warning' | 'info' | 'error') => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onShowMessage }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<'login' | 'signup'>('login');

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (mode === 'login') {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                onLoginSuccess(data.user);
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: name,
                        }
                    }
                });
                if (error) throw error;
                if (onShowMessage) {
                    onShowMessage('Confirme seu e-mail para ativar a conta!', 'Ativação Necessária', 'info');
                } else {
                    alert('Confirme seu e-mail para ativar a conta!');
                }
                setMode('login');
            }
        } catch (err: any) {
            setError(translateError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 overflow-hidden relative">
            {/* Background Ornaments */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-600/20">
                        <IconRenderer name="Layers" className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
                        Nexus<span className="text-blue-500">Pro</span>
                    </h1>
                    <p className="text-slate-400 text-[10px] uppercase tracking-[0.4em] mt-2">Industrial Management Ecosystem</p>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-10 rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in-95 duration-500">
                    <h2 className="text-xl font-bold text-white mb-8 text-center uppercase tracking-tight">
                        {mode === 'login' ? 'Acesso ao Portal' : 'Criar Nova Conta'}
                    </h2>

                    <form onSubmit={handleAuth} className="space-y-6">
                        {mode === 'signup' && (
                            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Nome Completo</label>
                                <div className="relative">
                                    <IconRenderer name="User" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-xs font-bold outline-none focus:border-blue-500 focus:bg-white/10 transition-all"
                                        placeholder="Ex: Heber Vieira"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">E-mail Corporativo</label>
                            <div className="relative">
                                <IconRenderer name="User" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-xs font-bold outline-none focus:border-blue-500 focus:bg-white/10 transition-all"
                                    placeholder="admin@nexus.pro"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Senha de Acesso</label>
                            <div className="relative">
                                <IconRenderer name="Lock" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-xs font-bold outline-none focus:border-blue-500 focus:bg-white/10 transition-all"
                                    placeholder="••••••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center space-x-3 animate-shake">
                                <IconRenderer name="AlertCircle" className="w-4 h-4 text-red-500 shrink-0" />
                                <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg shadow-blue-600/20 flex items-center justify-center space-x-2 mt-8"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>{mode === 'login' ? 'Entrar no Sistema' : 'Finalizar Cadastro'}</span>
                                    <IconRenderer name="ChevronRight" className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-white/5 text-center">
                        <button
                            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                            className="text-[10px] font-black text-slate-400 hover:text-blue-400 uppercase tracking-widest transition-colors"
                        >
                            {mode === 'login' ? 'Não possui uma conta? Registre-se' : 'Já possui conta? Faça Login'}
                        </button>
                    </div>
                </div>

                <p className="text-center mt-8 text-[9px] font-medium text-slate-500 uppercase tracking-widest opacity-40">
                    NexusPro® Security Framework v4.2
                </p>
            </div>
        </div>
    );
};
