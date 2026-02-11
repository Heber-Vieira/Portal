
import React from 'react';

interface FooterProps {
    currentYear: number;
    isDarkMode: boolean;
}

export const Footer: React.FC<FooterProps> = ({ currentYear, isDarkMode }) => {
    return (
        <footer className="w-full py-2 mt-auto flex justify-center items-center pointer-events-none select-none">
            <p className={`text-[10px] font-medium opacity-40 transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Copyright © {currentYear} NexusPro® - Todos os Direitos Reservados
            </p>
        </footer>
    );
};
