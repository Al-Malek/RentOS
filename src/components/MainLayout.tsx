"use client";
import React, { useState } from 'react';
import { useConfig } from '@/context/ConfigContext';

const MenuIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
const UserIcon = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { highContrast, toggleContrast, lang, toggleLang, t } = useConfig();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const theme = {
    wrapper: highContrast ? 'bg-white text-black' : 'bg-[#0a0a0a] text-gray-200',
    sidebar: highContrast ? 'bg-gray-100 border-r border-gray-300' : 'bg-[#121212] border-r border-gray-800',
    header: highContrast ? 'bg-white border-b border-gray-300' : 'bg-[#0a0a0a] border-b border-gray-800',
    input: highContrast ? 'bg-gray-100 border border-gray-400 text-black' : 'bg-gray-800 text-white',
    sidebarActive: 'bg-[#00E5FF] text-black font-bold',
    sidebarLink: highContrast ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-400 hover:bg-gray-800',
  };

  const menuItems = ['vehiculos', 'reservas', 'clientes', 'reportes', 'taller', 'tarifas'];

  return (
    <div className={`min-h-screen flex flex-col md:flex-row transition-colors duration-300 ${theme.wrapper}`}>
      <aside className={`hidden md:flex flex-col w-64 ${theme.sidebar} min-h-screen`}>
        <div className="p-6 text-2xl font-bold text-center">
          RENT<span className="text-[#00E5FF]">OS</span>
        </div>
        <nav className="flex-1 px-2 space-y-2 mt-4">
          {menuItems.map((item) => (
            <button key={item} className={`w-full text-left px-6 py-3 rounded-lg transition-all ${item === 'vehiculos' ? theme.sidebarActive : theme.sidebarLink}`}>
              {t('nav', item).toUpperCase()}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className={`flex justify-between items-center p-4 ${theme.header}`}>
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}><MenuIcon /></button>
          <div className={`hidden md:flex flex-1 mx-8 rounded-full px-4 py-2 max-w-lg ${theme.input}`}>
            <input type="text" placeholder={t('header', 'search')} className="bg-transparent outline-none w-full" />
            <span>🔍</span>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={toggleContrast} className="text-xs border px-3 py-1 rounded-full border-current hover:opacity-70 transition">
               {highContrast ? t('a11y', 'dark') : t('a11y', 'light')}
            </button>
            <button onClick={toggleLang} className="text-xs border px-3 py-1 rounded-full border-current hover:opacity-70 transition">
              {lang === 'es' ? '🇺🇸 EN' : '🇪🇸 ES'}
            </button>
            <button className="bg-[#00E5FF] text-black px-4 py-2 rounded-full font-bold shadow-lg hidden sm:block">+ {t('header', 'ticket')}</button>
            <div className={`p-2 rounded-full ${highContrast ? 'bg-gray-200 text-black' : 'bg-gray-700 text-white'}`}><UserIcon /></div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}