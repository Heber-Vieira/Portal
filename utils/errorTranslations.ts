
export const translateError = (error: any): string => {
    if (!error) return 'Ocorreu um erro desconhecido.';

    const message = typeof error === 'string' ? error : error.message || '';
    const lowerMessage = message.toLowerCase();

    // Mensagens do Supabase Auth
    if (lowerMessage.includes('invalid format') && lowerMessage.includes('email')) {
        return 'O formato do e-mail é inválido.';
    }
    if (lowerMessage.includes('user already exists') || lowerMessage.includes('user already registered')) {
        return 'Este usuário já está cadastrado.';
    }
    if (lowerMessage.includes('invalid login credentials')) {
        return 'E-mail ou senha incorretos.';
    }
    if (lowerMessage.includes('email not confirmed')) {
        return 'Por favor, confirme seu e-mail antes de acessar.';
    }
    if (lowerMessage.includes('password is too short')) {
        return 'A senha deve ter pelo menos 6 caracteres.';
    }
    if (lowerMessage.includes('rate limit exceeded')) {
        return 'Muitas solicitações em pouco tempo. Tente novamente mais tarde.';
    }
    if (lowerMessage.includes('network error') || lowerMessage.includes('failed to fetch')) {
        return 'Erro de conexão. Verifique sua internet.';
    }
    if (lowerMessage.includes('database error')) {
        return 'Erro interno no banco de dados.';
    }
    if (lowerMessage.includes('user not found')) {
        return 'Usuário não encontrado.';
    }

    // Fallback para mensagens genéricas se não houver tradução específica
    return message || 'Ocorreu um erro ao processar sua solicitação.';
};
