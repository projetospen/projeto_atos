import React, { useState } from 'react';
import { useChurch, AdminRole } from '../../context/ChurchContext';
import { 
  Menu, 
  Cake, 
  UserPlus, 
  Calendar, 
  ShieldCheck, 
  Search, 
  ChevronDown, 
  Church, 
  X, 
  Palette,
  Sun,
  Moon
} from 'lucide-react';
import { ThemeCustomizerModal } from '../common/ThemeCustomizerModal';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenQuickMemberModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenQuickMemberModal }) => {
  const { 
    activeTab, 
    adminRole, 
    setAdminRole, 
    churchProfile, 
    members,
    setSelectedMemberForCard,
    theme,
    colorMode,
    toggleColorMode 
  } = useChurch();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showBirthdayMenu, setShowBirthdayMenu] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Calculate birthdays in current month
  const currentMonth = new Date().getMonth() + 1; // 1-12
  const monthBirthdays = members.filter(m => {
    if (!m.birthDate) return false;
    const parts = m.birthDate.split('-');
    return parseInt(parts[1], 10) === currentMonth;
  });

  // Filter search
  const filteredSearch = searchQuery.trim() === '' ? [] : members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.phone.includes(searchQuery) ||
    m.role.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Painel Administrativo Geral';
      case 'membros': return 'Gestão de Membros & Secretaria';
      case 'departamentos': return 'Departamentos & Ministérios';
      case 'calendario': return 'Calendário Eclesiástico & Cultos';
      case 'escalas': return 'Escalas de Voluntários & Ministérios';
      case 'financeiro': return 'Tesouraria & Livro Caixa';
      case 'relatorios': return 'Relatórios Estatísticos & Atas';
      case 'configuracoes': return 'Configurações da Igreja & Backup';
      default: return 'ATOS';
    }
  };

  const rolesList: AdminRole[] = [
    'Administrador Geral',
    'Pastor Presidente',
    'Secretaria Eclesiástica',
    'Tesouraria',
    'Líder de Ministério'
  ];

  return (
    <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white leading-tight">
              {getTabTitle()}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              {churchProfile.name} • {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Center: Quick Search Input */}
        <div className="relative hidden md:block max-w-xs w-full mx-4">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              placeholder="Buscar membro, telefone, cargo..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 focus:bg-white dark:focus:bg-slate-800/90 border border-transparent focus:border-slate-300 dark:focus:border-slate-600 rounded-xl transition-all focus:outline-hidden text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          {showSearchResults && searchQuery && (
            <div 
              onMouseLeave={() => setShowSearchResults(false)}
              className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-fade-in"
            >
              {filteredSearch.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 p-2 text-center">Nenhum membro encontrado</p>
              ) : (
                <div className="space-y-1">
                  {filteredSearch.map(m => (
                    <div
                      key={m.id}
                      onClick={() => {
                        setSelectedMemberForCard(m);
                        setShowSearchResults(false);
                        setSearchQuery('');
                      }}
                      className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white">{m.name}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px]">{m.role} • {m.phone}</p>
                      </div>
                      <span 
                        className="text-[10px] font-bold px-2 py-0.5 rounded"
                        style={{ 
                          backgroundColor: `${theme.primaryHex}20`, 
                          color: theme.primaryHex 
                        }}
                      >
                        Ver Ficha
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Toggle Light / Dark Mode Button */}
          <button
            onClick={toggleColorMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={colorMode === 'dark' ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
            aria-label="Alternar modo claro ou escuro"
          >
            {colorMode === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600 hover:text-indigo-600 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Quick Theme Color Customizer Modal Trigger */}
          <button
            onClick={() => setIsThemeModalOpen(true)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer relative group"
            title="Personalizar Cores e Tema da Plataforma"
            aria-label="Personalizar cores da plataforma"
          >
            <Palette className="w-5 h-5 transition-transform group-hover:scale-110" style={{ color: theme.primaryHex }} />
            <span 
              className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-2 ring-white dark:ring-slate-900" 
              style={{ backgroundColor: theme.primaryHex }}
            />
          </button>

          {/* Birthday Notification */}
          <div className="relative">
            <button
              onClick={() => setShowBirthdayMenu(!showBirthdayMenu)}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-700 dark:hover:text-amber-300 transition-colors cursor-pointer"
              title="Aniversariantes do Mês"
            >
              <Cake className="w-5 h-5" />
              {monthBirthdays.length > 0 && (
                <span 
                  className="absolute top-1 right-1 w-4 h-4 text-slate-950 font-black text-[10px] rounded-full flex items-center justify-center animate-pulse"
                  style={{ backgroundColor: theme.primaryHex }}
                >
                  {monthBirthdays.length}
                </span>
              )}
            </button>

            {/* Birthdays Popup */}
            {showBirthdayMenu && (
              <div 
                onMouseLeave={() => setShowBirthdayMenu(false)}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-fade-in"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Cake className="w-4 h-4" style={{ color: theme.primaryHex }} />
                    <h4 className="font-bold text-xs text-slate-800 dark:text-white">Aniversariantes deste Mês ({monthBirthdays.length})</h4>
                  </div>
                  <button onClick={() => setShowBirthdayMenu(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                  {monthBirthdays.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-3">Nenhum aniversariante neste mês</p>
                  ) : (
                    monthBirthdays.map(m => {
                      const day = m.birthDate.split('-')[2];
                      const whatsappMsg = encodeURIComponent(
                        `A paz do Senhor, ${m.name}! Em nome da ${churchProfile.name}, queremos te abençoar neste mês especial pelo seu aniversário. Que Deus multiplique seus dias com graça, saúde e paz!`
                      );
                      const cleanPhone = m.phone.replace(/\D/g, '');
                      return (
                        <div key={m.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-xs">
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-white">{m.name}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">Dia {day} • {m.role}</p>
                          </div>
                          <a
                            href={`https://wa.me/55${cleanPhone}?text=${whatsappMsg}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 text-[10px] font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                          >
                            Felicitar
                          </a>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl border border-slate-200/60 dark:border-slate-700 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: theme.primaryHex }} />
              <span className="hidden sm:inline font-semibold">{adminRole}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div 
                onMouseLeave={() => setShowRoleMenu(false)}
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-1.5 z-50 animate-fade-in"
              >
                <p className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                  Mudar Perfil Administrativo
                </p>
                {rolesList.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setAdminRole(r);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                      adminRole === r 
                        ? 'bg-slate-100 dark:bg-slate-800 font-bold text-slate-900 dark:text-white' 
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <span>{r}</span>
                    {adminRole === r && (
                      <span 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: theme.primaryHex }}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Add Member Button with Dynamic Theme */}
          <button
            onClick={onOpenQuickMemberModal}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-bold text-white rounded-xl shadow-sm transition-transform active:scale-95 cursor-pointer"
            style={{ backgroundColor: theme.primaryHex }}
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Novo Membro</span>
          </button>
        </div>
      </div>

      {/* Theme Customizer Modal */}
      <ThemeCustomizerModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />
    </header>
  );
};
