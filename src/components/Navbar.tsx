import React from 'react';
import { Menu } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavbarProps {
  onToggleSidebar: () => void;
  pageTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, pageTitle }) => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-lab-bg/80 backdrop-blur-xl border-b border-lab-cardBorder/60 px-4 sm:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Menyu"
          className="lg:hidden p-2 rounded-xl bg-lab-card border border-slate-700/80 text-slate-300 hover:text-white"
        >
          <Menu size={20} />
        </button>
        {pageTitle && (
          <h2 className="text-sm sm:text-base font-bold text-white font-mono tracking-tight line-clamp-1">
            {pageTitle}
          </h2>
        )}
      </div>

      <div className="flex items-center gap-3">
        <LanguageSwitcher />
      </div>
    </header>
  );
};
