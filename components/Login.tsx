
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { IconRenderer } from './IconRenderer';
import { translateError } from '../utils/errorTranslations';
import { MessageModal } from './MessageModal';

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
    const [showPassword, setShowPassword] = useState(false);
    const [systemLogo, setSystemLogo] = useState<string | null>(null);
    const [messageModal, setMessageModal] = useState<{ isOpen: boolean, title: string, message: string, type?: 'warning' | 'info' | 'error' }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'warning'
    });

    useEffect(() => {
        const checkError = localStorage.getItem('nexus_login_error');
        if (checkError === 'suspended') {
            setMessageModal({
                isOpen: true,
                title: 'Acesso Suspenso',
                message: "Identificamos uma restrição administrativa em sua credencial.\n\nPROTOCOLO DE SEGURANÇA #00-INA\n\nMotivos possíveis:\n• Revisão administrativa\n• Período de inatividade\n• Solicitação de gestão\n\nPara restabelecer seu acesso, contate imediatamente o administrador do sistema.",
                type: 'error'
            });
        }
    }, []);

    useEffect(() => {
        supabase
            .from('system_settings')
            .select('value')
            .eq('key', 'logo_url')
            .maybeSingle()
            .then(({ data }) => {
                if (data?.value) setSystemLogo(data.value);
            });
    }, []);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (mode === 'login') {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('is_active')
                    .eq('id', data.user.id)
                    .single();

                if (profile && profile.is_active === false) {
                    localStorage.setItem('nexus_login_error', 'suspended');
                    await supabase.auth.signOut();
                    window.location.reload();
                    return;
                }

                onLoginSuccess(data.user);
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { data: { full_name: name } }
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

    const handleForgotPassword = async () => {
        if (!email) {
            setError('Insira seu e-mail para recuperar a senha.');
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin,
        });
        setLoading(false);
        if (error) {
            setError(translateError(error));
        } else {
            if (onShowMessage) {
                onShowMessage('Verifique seu e-mail para redefinir a senha.', 'E-mail Enviado', 'info');
            }
        }
    };

    return (
        <div style={styles.pageWrapper}>
            {/* Card container */}
            <div style={styles.card}>

                {/* LEFT PANEL */}
                <div style={styles.leftPanel}>
                    {/* Logo */}
                    <div style={styles.logoRow}>
                        {systemLogo ? (
                            <img
                                src={systemLogo}
                                alt="Logo do sistema"
                                style={styles.customLogo}
                            />
                        ) : (
                            <>
                                <div style={styles.logoIcon}>
                                    <IconRenderer name="Layers" style={{ width: 20, height: 20, color: '#fff' }} />
                                </div>
                                <div>
                                    <span style={styles.logoName}>NexusPro</span>
                                    <span style={styles.logoSub}>Portal</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Badge */}
                    <div style={styles.badge}>PORTAL DE ACESSO</div>

                    {/* Headline */}
                    <h1 style={styles.headline}>
                        Gestão Integrada de{' '}
                        <span style={{ color: '#f87171' }}>Sistemas SaaS</span>
                    </h1>

                    {/* Description */}
                    <p style={styles.description}>
                        Centralize o acesso aos seus sistemas, monitore usuários e garante total controle
                        com segurança corporativa.
                    </p>

                    {/* Security badge */}
                    <div style={styles.securityBadge}>
                        <div style={styles.securityIcon}>
                            <IconRenderer name="ShieldCheck" style={{ width: 22, height: 22, color: '#a78bfa' }} />
                        </div>
                        <div>
                            <div style={styles.securityTitle}>SEGURANÇA NÍVEL CORPORATIVO</div>
                            <div style={styles.securityText}>
                                Seus dados estão protegidos sob criptografia de ponta a ponta.
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div style={styles.rightPanel}>
                    <div style={styles.formContainer}>
                        <h2 style={styles.welcomeTitle}>
                            {mode === 'login' ? 'Bem-vindo de volta!' : 'Criar nova conta'}
                        </h2>
                        <p style={styles.welcomeSubtitle}>
                            {mode === 'login'
                                ? 'Insira suas credenciais corporativas para acessar o painel de controle.'
                                : 'Preencha os dados abaixo para solicitar acesso ao portal.'}
                        </p>

                        <form onSubmit={handleAuth} style={styles.form}>

                            {/* Name (signup only) */}
                            {mode === 'signup' && (
                                <div style={styles.fieldGroup}>
                                    <label style={styles.fieldLabel}>NOME COMPLETO</label>
                                    <div style={styles.inputWrapper}>
                                        <IconRenderer name="User" style={styles.inputIcon} />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            style={styles.input}
                                            placeholder="Ex: Heber Vieira"
                                            required
                                            onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
                                            onBlur={e => Object.assign(e.target.style, styles.input)}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Email */}
                            <div style={styles.fieldGroup}>
                                <label style={styles.fieldLabel}>E-MAIL CORPORATIVO</label>
                                <div style={styles.inputWrapper}>
                                    <IconRenderer name="Mail" style={styles.inputIcon} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={styles.input}
                                        placeholder="seu.nome@empresa.com.br"
                                        required
                                        onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
                                        onBlur={e => Object.assign(e.target.style, styles.input)}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div style={styles.fieldGroup}>
                                <div style={styles.passwordLabelRow}>
                                    <label style={styles.fieldLabel}>SENHA DE ACESSO</label>
                                    {mode === 'login' && (
                                        <button
                                            type="button"
                                            onClick={handleForgotPassword}
                                            style={styles.forgotLink}
                                        >
                                            Esqueci minha senha
                                        </button>
                                    )}
                                </div>
                                <div style={styles.inputWrapper}>
                                    <IconRenderer name="Lock" style={styles.inputIcon} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{ ...styles.input, paddingRight: 48 }}
                                        placeholder="••••••••"
                                        required
                                        onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
                                        onBlur={e => Object.assign(e.target.style, { ...styles.input, paddingRight: 48 })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={styles.eyeButton}
                                    >
                                        <IconRenderer name={showPassword ? 'EyeOff' : 'Eye'} style={{ width: 16, height: 16, color: '#94a3b8' }} />
                                    </button>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div style={styles.errorBox}>
                                    <IconRenderer name="AlertCircle" style={{ width: 14, height: 14, color: '#ef4444', flexShrink: 0 }} />
                                    <span style={styles.errorText}>{error}</span>
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                style={styles.submitBtn}
                                onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                            >
                                {loading ? (
                                    <div style={styles.spinner} />
                                ) : (
                                    <>
                                        <span>{mode === 'login' ? 'ENTRAR NO SISTEMA' : 'FINALIZAR CADASTRO'}</span>
                                        <IconRenderer name="ArrowRight" style={{ width: 16, height: 16, color: '#fff' }} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Footer */}
                        <div style={styles.footer}>
                            <span style={styles.footerText}>Protegido por reCAPTCHA e LGPD</span>
                            <div style={styles.footerIcons}>
                                <IconRenderer name="UserCheck" style={{ width: 16, height: 16, color: '#cbd5e1' }} />
                                <IconRenderer name="Shield" style={{ width: 16, height: 16, color: '#cbd5e1' }} />
                            </div>
                        </div>

                        {/* Mode switch */}
                        <p style={styles.modeSwitch}>
                            {mode === 'login' ? 'Não tem acesso?' : 'Já tem conta?'}{' '}
                            <button
                                type="button"
                                onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); }}
                                style={styles.modeSwitchLink}
                            >
                                {mode === 'login' ? 'Solicitar acesso' : 'Fazer login'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            <MessageModal
                isOpen={messageModal.isOpen}
                onClose={() => {
                    setMessageModal({ ...messageModal, isOpen: false });
                    localStorage.removeItem('nexus_login_error');
                }}
                title={messageModal.title}
                message={messageModal.message}
                type={messageModal.type}
            />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                @keyframes loginFadeIn {
                    from { opacity: 0; transform: translateY(16px) scale(0.98); }
                    to   { opacity: 1; transform: translateY(0)    scale(1);    }
                }
                @keyframes spinAnim {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

/* ─── Inline styles ─────────────────────────────────────────────────────── */
const styles: Record<string, React.CSSProperties> = {
    pageWrapper: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e8eaf0 0%, #dde0ea 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: "'Inter', sans-serif",
    },
    card: {
        display: 'flex',
        width: '100%',
        maxWidth: 860,
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.18)',
        animation: 'loginFadeIn 0.55s cubic-bezier(.22,1,.36,1) both',
    },

    /* LEFT */
    leftPanel: {
        flex: '0 0 42%',
        background: 'linear-gradient(160deg, #3b1f6e 0%, #5c2d91 45%, #7b3fb5 100%)',
        padding: '44px 36px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        position: 'relative',
        overflow: 'hidden',
    },
    logoRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
    },
    logoIcon: {
        width: 36,
        height: 36,
        background: 'rgba(255,255,255,0.15)',
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoName: {
        display: 'block',
        color: '#fff',
        fontWeight: 700,
        fontSize: 15,
        lineHeight: 1,
    },
    logoSub: {
        display: 'block',
        color: '#f472b6',
        fontWeight: 600,
        fontSize: 11,
        lineHeight: 1,
        marginTop: 2,
    },
    customLogo: {
        maxHeight: 48,
        maxWidth: 180,
        width: 'auto',
        objectFit: 'contain' as const,
        display: 'block',
        filter: 'brightness(0) invert(1)',   // keep visible on dark background
        opacity: 0.95,
    },
    badge: {
        display: 'inline-block',
        background: 'rgba(255,255,255,0.12)',
        color: '#e2d9f3',
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.12em',
        padding: '5px 12px',
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    headline: {
        color: '#fff',
        fontSize: 26,
        fontWeight: 800,
        lineHeight: 1.25,
        margin: 0,
    },
    description: {
        color: 'rgba(255,255,255,0.65)',
        fontSize: 13,
        lineHeight: 1.65,
        margin: 0,
    },
    securityBadge: {
        marginTop: 'auto',
        background: 'rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
    },
    securityIcon: {
        width: 38,
        height: 38,
        background: 'rgba(167,139,250,0.2)',
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    securityTitle: {
        color: '#fff',
        fontWeight: 700,
        fontSize: 10,
        letterSpacing: '0.08em',
        marginBottom: 4,
    },
    securityText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 11,
        lineHeight: 1.5,
    },

    /* RIGHT */
    rightPanel: {
        flex: 1,
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '44px 40px',
    },
    formContainer: {
        width: '100%',
        maxWidth: 380,
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: 800,
        color: '#ec4899',
        margin: '0 0 6px',
    },
    welcomeSubtitle: {
        fontSize: 13,
        color: '#64748b',
        margin: '0 0 28px',
        lineHeight: 1.55,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
    },
    fieldGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
    },
    fieldLabel: {
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.1em',
        color: '#94a3b8',
    },
    passwordLabelRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    inputWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    inputIcon: {
        position: 'absolute',
        left: 14,
        width: 15,
        height: 15,
        color: '#94a3b8',
        pointerEvents: 'none',
    },
    input: {
        width: '100%',
        border: '1.5px solid #e2e8f0',
        borderRadius: 12,
        padding: '13px 14px 13px 42px',
        fontSize: 13,
        color: '#1e293b',
        outline: 'none',
        background: '#fff',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box',
    },
    inputFocus: {
        width: '100%',
        border: '1.5px solid #a78bfa',
        borderRadius: 12,
        padding: '13px 14px 13px 42px',
        fontSize: 13,
        color: '#1e293b',
        outline: 'none',
        background: '#faf7ff',
        boxSizing: 'border-box',
    },
    eyeButton: {
        position: 'absolute',
        right: 12,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 4,
        display: 'flex',
        alignItems: 'center',
    },
    forgotLink: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#ec4899',
        fontSize: 11,
        fontWeight: 600,
        padding: 0,
    },
    errorBox: {
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: 10,
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
    },
    errorText: {
        color: '#ef4444',
        fontSize: 11,
        fontWeight: 600,
    },
    submitBtn: {
        width: '100%',
        background: '#1e1b4b',
        color: '#fff',
        border: 'none',
        borderRadius: 12,
        padding: '15px',
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: '0.12em',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        transition: 'opacity 0.2s',
        marginTop: 4,
    },
    spinner: {
        width: 18,
        height: 18,
        border: '2px solid rgba(255,255,255,0.3)',
        borderTopColor: '#fff',
        borderRadius: '50%',
        animation: 'spinAnim 0.7s linear infinite',
    },
    footer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingTop: 16,
        borderTop: '1px solid #f1f5f9',
    },
    footerText: {
        color: '#94a3b8',
        fontSize: 11,
    },
    footerIcons: {
        display: 'flex',
        gap: 8,
    },
    modeSwitch: {
        textAlign: 'center',
        marginTop: 12,
        fontSize: 12,
        color: '#64748b',
    },
    modeSwitchLink: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#7c3aed',
        fontWeight: 700,
        fontSize: 12,
        padding: 0,
    },
};
