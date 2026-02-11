
import React from 'react';
import { IconRenderer } from './IconRenderer';

interface ActionBarProps {
    setShowHelpCenter: (show: boolean) => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({ setShowHelpCenter }) => {
    return (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 px-3 py-1.5 bg-[#0f172a]/90 backdrop-blur-md border border-white/10 rounded-full shadow-2xl flex items-center space-x-2 transition-all duration-500 hover:scale-110 active:scale-95 group">
            <button
                onClick={() => setShowHelpCenter(true)}
                className="flex items-center space-x-3 px-6 py-2 rounded-full bg-primary/20 hover:bg-primary text-primary hover:text-white transition-all duration-300"
            >
                <IconRenderer name="LifeBuoy" className="w-4 h-4 animate-pulse group-hover:animate-none" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden md:block">Intelligence Center</span>
            </button>
        </div>
    );
};
