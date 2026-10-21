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
  X
} from 'lucide-react';

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
    setSelectedMemberForCard 
  } = useChurch();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showBirthdayMenu, setShowBirthdayMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Calculate birthdays in October (or current month)
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
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            title="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 leading-tight">
              {getTabTitle()}
            </h2>
            <p className="text-xs text-slate-500 hidden sm:block">
              {churchProfile.name} • {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Center: Quick Search Input */}
        <div className="relative hidden md:block max-w-xs w-full mx-4">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              placeholder="Buscar membro, telefone, cargo..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100 hover:bg-slate-200/70 focus:bg-white border border-transparent focus:border-indigo-400 rounded-xl transition-all focus:outline-hidden"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          {showSearchResults && searchQuery && (
            <div 
              onMouseLeave={() => setShowSearchResults(false)}
              className="absolute left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-in"
            >
              {filteredSearch.length === 0 ? (
                <p className="text-xs text-slate-500 p-2 text-center">Nenhum membro encontrado</p>
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
                      className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-semibold text-slate-800">{m.name}</p>
                        <p className="text-slate-500 text-[11px]">{m.role} • {m.phone}</p>
                      </div>
                      <span className="text-[10px] text-indigo-600 font-medium px-2 py-0.5 bg-indigo-50 rounded">
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
        <div className="flex items-center gap-2">
          {/* Birthday Notification */}
          <div className="relative">
            <button
              onClick={() => setShowBirthdayMenu(!showBirthdayMenu)}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-amber-50 hover:text-amber-700 transition-colors"
              title="Aniversariantes do Mês"
            >
              <Cake className="w-5 h-5" />
              {monthBirthdays.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full flex items-center justify-center animate-pulse">
                  {monthBirthdays.length}
                </span>
              )}
            </button>

            {/* Birthdays Popup */}
            {showBirthdayMenu && (
              <div 
                onMouseLeave={() => setShowBirthdayMenu(false)}
                className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-fade-in"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Cake className="w-4 h-4 text-amber-500" />
                    <h4 className="font-bold text-xs text-slate-800">Aniversariantes de Outubro ({monthBirthdays.length})</h4>
                  </div>
                  <button onClick={() => setShowBirthdayMenu(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                  {monthBirthdays.map(m => {
                    const day = m.birthDate.split('-')[2];
                    const whatsappMsg = encodeURIComponent(
                      `A paz do Senhor, ${m.name}! Em nome da ${churchProfile.name}, queremos te abençoar neste mês especial pelo seu aniversário. Que Deus multiplique seus dias com graça, saúde e paz!`
                    );
                    const cleanPhone = m.phone.replace(/\D/g, '');
                    return (
                      <div key={m.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                        <div>
                          <p className="font-semibold text-slate-800">{m.name}</p>
                          <p className="text-[11px] text-slate-500">Dia {day} • {m.role}</p>
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
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200/60 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline font-semibold">{adminRole}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div 
                onMouseLeave={() => setShowRoleMenu(false)}
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-50 animate-fade-in"
              >
                <p className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
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
                      adminRole === r ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{r}</span>
                    {adminRole === r && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Add Member Button */}
          <button
            onClick={onOpenQuickMemberModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-slate-950" />
            <span className="hidden sm:inline">Novo Membro</span>
          </button>
        </div>
      </div>
    </header>
  );
};
