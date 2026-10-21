import React from 'react';
import { useChurch, NavTab } from '../../context/ChurchContext';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  CalendarDays, 
  ClipboardList, 
  CircleDollarSign, 
  FileText, 
  Settings, 
  Church, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, churchProfile, members, events, departments } = useChurch();

  const menuItems: { id: NavTab; label: string; icon: React.ElementType; badge?: string | number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
    { 
      id: 'membros', 
      label: 'Membros & Secretaria', 
      icon: Users, 
      badge: members.length,
      badgeColor: 'bg-indigo-100 text-indigo-700 font-semibold'
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
        fixed top-0 bottom-0 left-0 z-40 w-72 bg-slate-900 text-white flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand / Church Header */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
            <span className="font-black text-lg tracking-tight text-slate-950 font-serif">A</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-lg tracking-wider">ATOS</span>
              <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.2 rounded-md">ADMIN</span>
            </div>
            <p className="text-xs text-slate-400 font-medium truncate">
              {churchProfile.name}
            </p>
          </div>
        </div>

        {/* Quick Church Verse Pill */}
        <div className="px-4 py-3 mx-4 my-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 text-amber-400 font-medium text-[11px] mb-0.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Versículo do Mês</span>
          </div>
          <p className="line-clamp-2 text-[11px] text-slate-400 italic">
            "{churchProfile.mottoVerse}"
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <p className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Menu Administrativo
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group cursor-pointer
                  ${isActive 
                    ? 'bg-amber-500 text-slate-950 shadow-md font-semibold' 
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-amber-400 transition-colors'}`} />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 text-xs rounded-full ${isActive ? 'bg-slate-950/20 text-slate-950' : item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-4 h-4 text-slate-950" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Pastoral Leadership Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-300 text-sm">
              {churchProfile.seniorPastor.split(' ')[1]?.charAt(0) || 'P'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-200 truncate">{churchProfile.seniorPastor}</p>
              <p className="text-[10px] text-slate-400">Pastor Presidente</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
