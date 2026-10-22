import React, { useState } from 'react';
import { useChurch, NavTab } from '../../context/ChurchContext';
import { ROLE_PERMISSIONS } from '../../types';
import { ChurchEmblemRenderer } from '../common/ChurchEmblemRenderer';
import { EmblemCustomizerModal } from '../common/EmblemCustomizerModal';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  CalendarDays, 
  ClipboardList, 
  CircleDollarSign, 
  FileText, 
  Settings, 
  Sparkles,
  ChevronRight,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { 
    activeTab, 
    setActiveTab, 
    churchProfile, 
    members, 
    events, 
    departments, 
    theme,
    currentUser,
    logout,
    adminRole
  } = useChurch();
  const [isEmblemModalOpen, setIsEmblemModalOpen] = useState(false);

  const allMenuItems: { id: NavTab; label: string; icon: React.ElementType; badge?: string | number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
    { 
      id: 'membros', 
      label: 'Membros & Secretaria', 
      icon: Users, 
      badge: members.length,
      badgeColor: 'bg-slate-800 text-slate-300 font-semibold border border-slate-700/60'
    },
    { 
      id: 'departamentos', 
      label: 'Departamentos', 
      icon: Building2,
      badge: departments.length,
      badgeColor: 'bg-amber-100 text-amber-700 font-semibold'
    },
    { 
      id: 'calendario', 
      label: 'Calendário & Cultos', 
      icon: CalendarDays,
      badge: events.length,
      badgeColor: 'bg-emerald-100 text-emerald-700 font-semibold'
    },
    { id: 'escalas', label: 'Escalas de Voluntários', icon: ClipboardList },
    { id: 'financeiro', label: 'Tesouraria & Dízimos', icon: CircleDollarSign },
    { id: 'relatorios', label: 'Relatórios & Atas', icon: FileText },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  // Restrict menu items strictly to the permissions of the current role
  const roleConfig = ROLE_PERMISSIONS[adminRole];
  const allowedTabs = roleConfig ? roleConfig.allowedTabs : ['dashboard'];

  const menuItems = allMenuItems
    .filter(item => allowedTabs.includes(item.id))
    .map(item => {
      if (item.id === 'departamentos' && adminRole === 'Líder de Ministério') {
        return {
          ...item,
          label: currentUser?.departmentName ? `Meu Ministério` : 'Meu Departamento',
          badge: 1,
          badgeColor: 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
        };
      }
      return item;
    });

  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-40 w-72 bg-slate-900 text-white flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out no-scrollbar
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand / Church Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            {/* Clickable Emblem with Edit Trigger */}
            <div 
              onClick={() => setIsEmblemModalOpen(true)}
              className="relative group cursor-pointer shrink-0"
              title="Clique para personalizar o emblema ou avatar da igreja"
            >
              <ChurchEmblemRenderer 
                emblem={churchProfile.emblem} 
                churchName={churchProfile.name}
                size="md"
              />
              <div className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-amber-300">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            {/* Church Name Highlighted at TOP, Platform Name (ATOS) BELOW */}
            <div className="min-w-0 flex-1">
              {/* Church Name (IN HIGHLIGHT) */}
              <h1 
                className="font-extrabold text-white text-sm sm:text-base leading-snug line-clamp-2 hover:text-amber-200 transition-colors"
                title={churchProfile.name}
              >
                {churchProfile.name}
              </h1>

              {/* Platform Name (ATOS) Positioned BELOW */}
              <div className="flex items-center gap-1.5 mt-1">
                <span 
                  className="text-xs font-black tracking-widest"
                  style={{ color: theme.primaryHex }}
                >
                  ATOS
                </span>
                <span className="text-[9px] bg-slate-800 text-slate-300 font-semibold px-1.5 py-0.5 rounded border border-slate-700/80 uppercase">
                  Gestão Eclesiástica
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Church Verse Pill */}
        <div className="px-3 py-2 mx-3 my-2 rounded-xl bg-slate-800/60 dark:bg-slate-900/80 border border-slate-700/50 text-xs text-slate-300">
          <div 
            className="flex items-center gap-1.5 font-semibold text-[11px] mb-0.5"
            style={{ color: theme.primaryHex }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Versículo do Mês</span>
          </div>
          <p className="line-clamp-2 text-[10px] sm:text-[11px] text-slate-400 italic">
            "{churchProfile.mottoVerse}"
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-2.5 py-1 space-y-0.5 overflow-y-auto no-scrollbar">
          <div className="px-3 py-1 flex items-center justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            <span>
              {adminRole === 'Líder de Ministério' 
                ? 'Meu Ministério' 
                : adminRole === 'Tesouraria' 
                  ? 'Livro Caixa' 
                  : adminRole === 'Secretaria Eclesiástica' 
                    ? 'Secretaria & Cultos' 
                    : 'Menu Administrativo'}
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700/60 lowercase">
              {menuItems.length} {menuItems.length === 1 ? 'módulo' : 'módulos'}
            </span>
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                style={isActive ? { 
                  backgroundColor: theme.primaryHex,
                  color: theme.id === 'dourado_real' ? '#020617' : '#ffffff'
                } : undefined}
                className={`
                  w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all group cursor-pointer
                  ${isActive 
                    ? 'shadow-md shadow-black/25 font-bold' 
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }
                `}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'opacity-90' : 'text-slate-400 group-hover:text-white transition-colors'}`} />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 text-[11px] rounded-full ${isActive ? 'bg-black/20 text-inherit' : item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-4 h-4 opacity-80" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Active User Session & Pastoral Footer */}
        <div className="p-3 sm:p-3.5 border-t border-slate-800 dark:border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <div 
              className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs shrink-0"
              style={{ color: theme.primaryHex }}
            >
              {currentUser?.name.charAt(0) || churchProfile.seniorPastor.split(' ')[1]?.charAt(0) || 'P'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-200 truncate">
                {currentUser?.name || churchProfile.seniorPastor}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {currentUser?.role || 'Pastor Presidente'}
              </p>
            </div>
            <button
              onClick={() => logout()}
              title="Sair da Conta (Logout)"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
              aria-label="Sair da conta"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Emblem Customizer Modal */}
      <EmblemCustomizerModal
        isOpen={isEmblemModalOpen}
        onClose={() => setIsEmblemModalOpen(false)}
      />
    </>
  );
};
