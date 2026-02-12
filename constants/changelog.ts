
// This file acts as a source of truth for features released in each version
// The Announcement System can automatically read from here to pre-fill announcements

export interface SystemVersion {
    version: string;
    title: string;
    description: string;
    features: {
        title: string;
        description: string;
        icon: string;
    }[];
    releaseDate?: string;
}

export const SYSTEM_CHANGELOG: SystemVersion[] = [
    {
        version: "2.1.0",
        title: "Atualização 2.1: Personalização & Anúncios",
        description: "Agora você tem total controle sobre a identidade visual do sistema e comunicação com seus usuários.",
        features: [
            {
                title: "Upload de Logotipo",
                description: "Personalize o NexusPro com a marca da sua empresa. Faça upload do seu logo diretamente nas configurações.",
                icon: "Image"
            },
            {
                title: "Sistema de Anúncios",
                description: "Comunique novidades e manutenções com estilo. Crie pop-ups elegantes com animações de celebração.",
                icon: "Megaphone"
            },
            {
                title: "Gerenciamento de Versões",
                description: "O sistema agora detecta automaticamente novas atualizações no código e sugere anúncios prontos para publicar.",
                icon: "GitMerge"
            }
        ],
        releaseDate: new Date().toISOString()
    },
    // Example of previous version
    {
        version: "2.0.0",
        title: "NexusPro 2.0: O Renascimento",
        description: "Uma reformulação completa da interface e performance.",
        features: [
            { title: "Novo Dashboard", description: "Visualização de dados em tempo real com gráficos interativos.", icon: "BarChart3" },
            { title: "Dark Mode", description: "Tema escuro nativo para maior conforto visual.", icon: "Moon" }
        ]
    }
];

// Helper to get the latest version
export const LATEST_VERSION = SYSTEM_CHANGELOG[0];
